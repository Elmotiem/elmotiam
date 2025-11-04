import { GoogleGenAI, Modality } from "@google/genai";
import { ImageInfo } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Custom Error Types ---
export class QuotaExceededError extends Error {
  public retryAfter: string | null;
  constructor(message: string, retryAfter: string | null = null) {
    super(message);
    this.name = 'QuotaExceededError';
    this.retryAfter = retryAfter;
  }
}

// --- Centralized Error Handler ---
const handleApiError = (error: any) => {
  console.error("Gemini API Error:", error);
  const errorMessage = error.message || String(error) || 'Unknown error';

  // Check for various forms of quota/rate limit errors
  if (errorMessage.includes('429') || /rate limit|quota|exhausted/i.test(errorMessage)) {
    const retryMatch = errorMessage.match(/try again in ([\d\s\w]+)\.?$/i);
    const retryAfter = retryMatch ? retryMatch[1] : null;
    throw new QuotaExceededError('API quota exceeded.', retryAfter);
  }
  
  throw new Error('An unexpected API error occurred.');
};


// --- Helper Functions ---

const callMultimodalImageApi = async (parts: any[], model: string = 'gemini-2.5-flash-image'): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model,
            contents: { parts },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                // Ensure PNG for features that might need transparency
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image data found in the API response.");
    } catch (error) {
        handleApiError(error);
        return ''; // Should not be reached
    }
};

// --- Exported Service Functions ---

export const generateEditedImages = async (
  originalImage: ImageInfo,
  prompt: string
): Promise<string[]> => {
  const fullPrompt = `Apply the following edit to the image: "${prompt}". IMPORTANT: It is critical to preserve the original person's exact facial features and likeness. Do not change their face.`;
  const parts = [
    { inlineData: { data: originalImage.base64, mimeType: originalImage.mimeType } },
    { text: fullPrompt },
  ];
  // Create 2 variations
  const generationPromises = Array(2).fill(0).map(() => callMultimodalImageApi(parts));
  return Promise.all(generationPromises);
};


export const generateNewImages = async (prompt: string, numImages: number): Promise<string[]> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: numImages,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    return response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);
  } catch (error) {
    handleApiError(error);
    return []; // Should not be reached
  }
};

export const removeBackground = async (imageInfo: ImageInfo): Promise<string> => {
  const prompt = "Remove the background of this image. The output must be a PNG with a transparent background. Do not add any new background, the new background must be fully transparent. Preserve the main subject's details perfectly.";
  const parts = [
    { inlineData: { data: imageInfo.base64, mimeType: imageInfo.mimeType } },
    { text: prompt },
  ];
  return callMultimodalImageApi(parts);
};

export const swapClothes = async (
  personImage: ImageInfo,
  prompt: string,
  clothingImage: ImageInfo | null
): Promise<string[]> => {
    let fullPrompt = `Take the person from the first image and change their clothes.`;
    if (clothingImage) {
      fullPrompt += ` They should wear the clothes shown in the second image.`;
    } else {
      fullPrompt += ` The new clothes should be: ${prompt}.`;
    }
    fullPrompt += ` CRITICAL: You must keep the person's exact facial features, likeness, pose, and the background the same. Do not alter their face in any way.`

    const imageParts: any[] = [{
      inlineData: { data: personImage.base64, mimeType: personImage.mimeType }
    }];

    if (clothingImage) {
      imageParts.push({
        inlineData: { data: clothingImage.base64, mimeType: clothingImage.mimeType }
      });
    }
    const parts = [...imageParts, { text: fullPrompt }];

    const generationPromises = Array(2).fill(0).map(() => callMultimodalImageApi(parts));
    return Promise.all(generationPromises);
};

export const mergeImages = async (images: ImageInfo[], prompt: string): Promise<string[]> => {
    const imageParts = images.map(img => ({
        inlineData: { data: img.base64, mimeType: img.mimeType }
    }));
    const fullPrompt = `Merge these images together as described: "${prompt}". IMPORTANT: If there are people in the images, it is critical to preserve their original facial features and likeness in the final merged image. Do not change their faces.`
    const parts = [...imageParts, { text: fullPrompt }];
    
    // Generate 2 variations
    const generationPromises = Array(2).fill(0).map(() => callMultimodalImageApi(parts));
    return Promise.all(generationPromises);
};

export const createArtisticPortrait = async (image: ImageInfo, style: string): Promise<string[]> => {
    let prompt = '';

    switch (style) {
        case 'Enhance Quality':
            prompt = "Enhance the quality of this image. Improve its resolution, sharpness, and clarity. Remove any noise or artifacts. Make it look like a high-resolution photograph. Do not change the content, composition, or the person's facial features.";
            break;
        case 'Restore Photo':
            prompt = "Restore this old photo. Repair any scratches, tears, or blemishes. Correct color fading and improve contrast. Bring the photo back to its original quality as much as possible, making it look clean and vibrant. It is critical to maintain the person's original likeness.";
            break;
        case 'Anime':
            prompt = "Convert the entire image, including the subject, background, and all objects, into the Japanese anime art style. It is important to retain the core likeness of the person's face. The final result should look like a complete, cohesive scene from an anime, not just a character portrait against an unchanged background.";
            break;
        case 'Disney':
            prompt = "Convert the entire image, including the subject, background, and all objects, into the Disney animation art style. It is important to retain the core likeness of the person's face. The final result should look like a complete, cohesive scene from a classic Disney movie, with a magical and charming aesthetic applied everywhere.";
            break;
        default: // For all other artistic styles
            prompt = `Convert this photo into an artistic portrait in the style of ${style}. IMPORTANT: Preserve the subject's exact likeness and facial features, but adopt the aesthetic of the chosen style. Focus on the style's key characteristics throughout the entire image.`;
            break;
    }
    
    const parts = [
        { inlineData: { data: image.base64, mimeType: image.mimeType } },
        { text: prompt }
    ];
    // Generate 2 variations
    const generationPromises = Array(2).fill(0).map(() => callMultimodalImageApi(parts));
    return Promise.all(generationPromises);
};

export interface MoviePosterDetails {
  title: string;
  description: string;
  actors: string;
  director: string;
  writer: string;
  genre: string;
}

export const createMoviePoster = async (images: ImageInfo[], details: MoviePosterDetails): Promise<string[]> => {
    let prompt = `**Task: Create a hyper-realistic, professional, cinematic movie poster with flawless Arabic typography and layout.**

**Movie Details:**
- **Title:** "${details.title}"
- **Genre:** ${details.genre || 'Not specified'}
- **Tagline/Description:** "${details.description || 'Not specified'}"
- **Starring:** ${details.actors || 'Not specified'}
- **Director:** ${details.director || 'Not specified'}
- **Writer:** ${details.writer || 'Not specified'}

---

**MANDATE 1: CINEMATIC ART DIRECTION (Genre-Driven Design)**
The entire visual style MUST be dictated by the film's genre. Create a powerful, realistic image, not a simple composite.
-   **If Genre is Action/Thriller:** Use high contrast, dramatic shadows, cool or gritty color palettes (blues, greys, oranges), and dynamic compositions. Create a sense of tension and excitement.
-   **If Genre is Comedy/Family:** Use bright, saturated, warm colors. The lighting should be even and cheerful. The composition should be fun and inviting.
-   **If Genre is Drama/Romance:** Use a more muted, atmospheric color palette. Lighting should be moody and evocative, focusing on character emotions. The composition should be elegant and emotionally resonant.
-   **For any genre:** The final image must be hyper-realistic, with cinematic lighting and textures.

---

**MANDATE 2: PROFESSIONAL TYPOGRAPHY & LAYOUT (The Hollywood Standard)**
The placement of text is NOT flexible. Follow this professional structure precisely:
1.  **Starring Line:** The names of the actors ('${details.actors}') MUST be placed **above the movie title** in a clean, prominent font.
2.  **Movie Title:** The title ('${details.title}') is the **centerpiece**. It must be the largest text, highly stylized to fit the genre, and artistically integrated into the poster's artwork.
3.  **Tagline:** The tagline ('${details.description}') should be placed strategically, often above or below the title, in a smaller, complementary font.
4.  **Credits Block:** This is essential for realism. At the **very bottom** of the poster, create a standard "credits block". This block should contain the Director ('${details.director}') and Writer ('${details.writer}'). The font here MUST be small, capitalized, and condensed, just like in real movie posters.

---

**MANDATE 3: CHARACTER INTEGRITY**
-   From the provided images, extract the main characters.
-   **CRITICAL:** Preserve their **exact facial identity and likeness**. They must be perfectly recognizable.
-   While keeping their identity, you MUST adjust their **facial EXPRESSIONS and body language** to fit the genre's mood.
-   Place these characters seamlessly into a **completely new, genre-appropriate background** that you generate.

---

**MANDATE 4: FLAWLESS ARABIC TEXT (ZERO-TOLERANCE POLICY)**
This is non-negotiable. The Arabic text must be 100% perfect.
-   **Direction:** RIGHT-TO-LEFT.
-   **Connectivity:** Letters in words MUST be connected correctly.
-   **Spelling:** EXACTLY match the provided text. No errors are permitted.
-   **Legibility:** The font must be clear.

**Final Goal:** A powerful, hyper-realistic movie poster that looks indistinguishable from a real Hollywood production, with a layout, mood, and typography that perfectly match the genre, and featuring flawless Arabic text.
`;

    const imageParts = images.map(img => ({
        inlineData: { data: img.base64, mimeType: img.mimeType }
    }));
    const parts = [...imageParts, { text: prompt }];

    // Generate 2 variations due to complexity
    const generationPromises = Array(2).fill(0).map(() => callMultimodalImageApi(parts));
    return Promise.all(generationPromises);
};