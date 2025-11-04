import React, { useState, useCallback, useEffect } from 'react';
import { ImageInfo } from './types';
import { generateEditedImages, generateNewImages, removeBackground, swapClothes, mergeImages, createArtisticPortrait, createMoviePoster, MoviePosterDetails, QuotaExceededError } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ControlPanel from './components/ControlPanel';
import GeneratedImageView from './components/GeneratedImageView';
import { Toaster, toast } from 'react-hot-toast';
import Dropdown, { DropdownOption } from './components/Dropdown';
import { useLanguage } from './contexts/LanguageContext';
import LanguageSwitcher from './components/LanguageSwitcher';
import HomeButton from './components/HomeButton';

type Mode = 'HOME' | 'EDITOR' | 'GENERATOR' | 'BACKGROUND_REMOVAL' | 'IMAGE_MERGE' | 'PORTRAIT' | 'CLOTHES_SWAP' | 'MOVIE_POSTER';

const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>('HOME');
  const { language, t } = useLanguage();

  // Common States
  const [editedImages, setEditedImages] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  // Editor State
  const [originalImage, setOriginalImage] = useState<ImageInfo | null>(null);
  const [editPrompt, setEditPrompt] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Generator State
  const [generatePrompt, setGeneratePrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [numToGenerate, setNumToGenerate] = useState<number>(4);

  // Background Removal State
  const [imageForBgRemoval, setImageForBgRemoval] = useState<ImageInfo | null>(null);
  const [isRemovingBg, setIsRemovingBg] = useState<boolean>(false);

  // Clothes Swap State
  const [imageForClothesSwap, setImageForClothesSwap] = useState<ImageInfo | null>(null);
  const [clothingImage, setClothingImage] = useState<ImageInfo | null>(null);
  const [clothesSwapPrompt, setClothesSwapPrompt] = useState<string>('');
  const [isSwappingClothes, setIsSwappingClothes] = useState<boolean>(false);

  // Image Merge State
  const [imagesToMerge, setImagesToMerge] = useState<(ImageInfo | null)[]>([null, null, null]);
  const [mergePrompt, setMergePrompt] = useState<string>('');
  const [isMerging, setIsMerging] = useState<boolean>(false);
  
  // Portrait State
  const [portraitImage, setPortraitImage] = useState<ImageInfo | null>(null);
  const [portraitStyle, setPortraitStyle] = useState<string>('');
  const [isCreatingPortrait, setIsCreatingPortrait] = useState<boolean>(false);

  // Movie Poster State
  const [posterImages, setPosterImages] = useState<(ImageInfo | null)[]>([null, null, null]);
  const [posterDetails, setPosterDetails] = useState<MoviePosterDetails>({ title: '', description: '', actors: '', director: '', writer: '', genre: '' });
  const [isCreatingPoster, setIsCreatingPoster] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [mode]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const handleApiError = useCallback((error: any, failureToastKey: string) => {
    if (error instanceof QuotaExceededError) {
      if (error.retryAfter) {
        toast.error(t('toast.error.quotaExceededRetry', { time: error.retryAfter }));
      } else {
        toast.error(t('toast.error.quotaExceeded'));
      }
    } else {
      console.error(`API Error:`, error);
      toast.error(t(failureToastKey));
    }
  }, [t]);


  const handleEdit = useCallback(async () => {
    if (!originalImage) return toast.error(t('toast.error.uploadFirst'));
    if (!editPrompt.trim()) return toast.error(t('toast.error.enterDescription'));

    setIsEditing(true);
    setEditedImages([]);
    try {
      const images = await generateEditedImages(originalImage, editPrompt);
      setEditedImages(images);
      toast.success(t('toast.success.imagesCreated'));
    } catch (error) {
      handleApiError(error, 'toast.error.creationFailed');
    } finally {
      setIsEditing(false);
    }
  }, [originalImage, editPrompt, t, handleApiError]);

  const handleGenerate = useCallback(async () => {
    if (!generatePrompt.trim()) return toast.error(t('toast.error.enterPrompt'));

    setIsGenerating(true);
    setGeneratedImages([]);
    try {
      const images = await generateNewImages(generatePrompt, numToGenerate);
      setGeneratedImages(images);
      toast.success(t('toast.success.imagesCreated'));
    } catch (error) {
      handleApiError(error, 'toast.error.creationFailed');
    } finally {
      setIsGenerating(false);
    }
  }, [generatePrompt, numToGenerate, t, handleApiError]);
  
  const handleRemoveBackground = useCallback(async () => {
    if (!imageForBgRemoval) return toast.error(t('toast.error.uploadFirst'));

    setIsRemovingBg(true);
    setGeneratedImages([]);
    try {
      const image = await removeBackground(imageForBgRemoval);
      setGeneratedImages([image]);
      toast.success(t('toast.success.bgRemoved'));
    } catch (error) {
      handleApiError(error, 'toast.error.bgRemovalFailed');
    } finally {
      setIsRemovingBg(false);
    }
  }, [imageForBgRemoval, t, handleApiError]);

  const handleClothesSwap = useCallback(async () => {
    if (!imageForClothesSwap) return toast.error(t('toast.error.uploadPersonImage'));
    if (!clothingImage && !clothesSwapPrompt.trim()) return toast.error(t('toast.error.uploadOrDescribeClothes'));

    setIsSwappingClothes(true);
    setEditedImages([]);
    try {
      const images = await swapClothes(imageForClothesSwap, clothesSwapPrompt, clothingImage);
      setEditedImages(images);
      toast.success(t('toast.success.clothesSwapped'));
    } catch (error) {
      handleApiError(error, 'toast.error.clothesSwapFailed');
    } finally {
      setIsSwappingClothes(false);
    }
  }, [imageForClothesSwap, clothingImage, clothesSwapPrompt, t, handleApiError]);

  const handleImageMerge = useCallback(async () => {
    const validImages = imagesToMerge.filter(img => img !== null) as ImageInfo[];
    if (validImages.length < 2) return toast.error(t('toast.error.uploadTwoImages'));
    if (!mergePrompt.trim()) return toast.error(t('toast.error.enterMergeDescription'));

    setIsMerging(true);
    setGeneratedImages([]);
    try {
        const images = await mergeImages(validImages, mergePrompt);
        setGeneratedImages(images);
        toast.success(t('toast.success.imagesMerged'));
    } catch (error) {
        handleApiError(error, 'toast.error.mergeFailed');
    } finally {
        setIsMerging(false);
    }
  }, [imagesToMerge, mergePrompt, t, handleApiError]);

  const handleCreatePortrait = useCallback(async () => {
    if (!portraitImage) return toast.error(t('toast.error.uploadFirst'));
    if (!portraitStyle) return toast.error(t('toast.error.selectStyle'));

    setIsCreatingPortrait(true);
    setEditedImages([]);
    try {
        const images = await createArtisticPortrait(portraitImage, portraitStyle);
        setEditedImages(images);
        toast.success(t('toast.success.portraitCreated', { style: t(`portrait.${portraitStyle}.name`) }));
    } catch (error) {
        handleApiError(error, 'toast.error.portraitFailed');
    } finally {
        setIsCreatingPortrait(false);
    }
  }, [portraitImage, portraitStyle, t, handleApiError]);
  
  const handleCreatePoster = useCallback(async () => {
    if (!posterDetails.title.trim()) return toast.error(t('toast.error.movieTitleRequired'));
    
    setIsCreatingPoster(true);
    setGeneratedImages([]);
    try {
        const images = await createMoviePoster(posterImages.filter(img => img !== null) as ImageInfo[], posterDetails);
        setGeneratedImages(images);
        toast.success(t('toast.success.posterCreated'));
    } catch (error) {
        handleApiError(error, 'toast.error.posterFailed');
    } finally {
        setIsCreatingPoster(false);
    }
  }, [posterImages, posterDetails, t, handleApiError]);


  const goToHome = () => {
    setMode('HOME');
    // Reset all states
    setOriginalImage(null);
    setEditPrompt('');
    setEditedImages([]);
    setGeneratePrompt('');
    setGeneratedImages([]);
    setImageForBgRemoval(null);
    setImageForClothesSwap(null);
    setClothingImage(null);
    setClothesSwapPrompt('');
    setImagesToMerge([null, null, null]);
    setMergePrompt('');
    setPortraitImage(null);
    setPortraitStyle('');
    setPosterImages([null, null, null]);
    setPosterDetails({ title: '', description: '', actors: '', director: '', writer: '', genre: '' });
  }
  
  const renderContent = () => {
    switch (mode) {
      case 'EDITOR':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <ImageUploader onImageUpload={setOriginalImage} originalImage={originalImage} />
              <ControlPanel
                prompt={editPrompt}
                setPrompt={setEditPrompt}
                onGenerate={handleEdit}
                isLoading={isEditing}
                isImageUploaded={!!originalImage}
                buttonText={t('editor.button')}
                title={t('editor.promptTitle')}
                placeholder={t('editor.placeholder')}
              />
            </div>
            <div className="lg:col-span-8">
              <GeneratedImageView 
                isLoading={isEditing} 
                generatedImages={editedImages} 
                originalImage={null} 
                emptyStateText={t('imageView.editedEmptyState')}
                emptyStateSubtext={t('imageView.editedEmptySubtext')}
              />
            </div>
          </div>
        );
      case 'GENERATOR':
        const numOptions: DropdownOption[] = [1, 2, 3, 4].map(num => ({
          value: num,
          label: `${num}`,
        }));
        return (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
               <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
                 <h2 className="text-xl font-semibold text-cyan-400 mb-3">{t('generator.selectNumberTitle')}</h2>
                 <Dropdown
                    options={numOptions}
                    selectedValue={numToGenerate}
                    onSelect={(value) => setNumToGenerate(value as number)}
                  />
               </div>
              <ControlPanel
                prompt={generatePrompt}
                setPrompt={setGeneratePrompt}
                onGenerate={handleGenerate}
                isLoading={isGenerating}
                isImageUploaded={true} // Always enabled for generator
                title={t('generator.promptTitle')}
                placeholder={t('generator.placeholder')}
                buttonText={t('generator.button', { count: numToGenerate })}
              />
            </div>
            <div className="lg:col-span-8">
              <GeneratedImageView 
                isLoading={isGenerating} 
                generatedImages={generatedImages} 
                originalImage={null}
                emptyStateText={t('imageView.generatedEmptyState')}
                emptyStateSubtext={t('imageView.generatedEmptySubtext')}
              />
            </div>
          </div>
        );
      case 'BACKGROUND_REMOVAL':
        return (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <ImageUploader onImageUpload={setImageForBgRemoval} originalImage={imageForBgRemoval} />
               <button
                  onClick={handleRemoveBackground}
                  disabled={isRemovingBg || !imageForBgRemoval}
                  className="w-full flex items-center justify-center bg-cyan-600 text-white font-bold py-3 px-4 rounded-md hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isRemovingBg ? t('bgRemoval.buttonLoading') : t('bgRemoval.button')}
                </button>
            </div>
            <div className="lg:col-span-8">
              <GeneratedImageView 
                isLoading={isRemovingBg} 
                generatedImages={generatedImages} 
                originalImage={null}
                emptyStateText={t('imageView.bgRemovalEmptyState')}
                emptyStateSubtext={t('imageView.bgRemovalEmptySubtext')}
                isTransparent
              />
            </div>
          </div>
        );
       case 'CLOTHES_SWAP':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <ImageUploader 
                onImageUpload={setImageForClothesSwap} 
                originalImage={imageForClothesSwap}
                title={t('clothesSwap.personImageTitle')}
              />
              <ImageUploader 
                onImageUpload={setClothingImage} 
                originalImage={clothingImage}
                title={t('clothesSwap.clothesImageTitle')}
              />
              <ControlPanel
                prompt={clothesSwapPrompt}
                setPrompt={setClothesSwapPrompt}
                onGenerate={handleClothesSwap}
                isLoading={isSwappingClothes}
                isImageUploaded={!!imageForClothesSwap}
                title={t('clothesSwap.promptTitle')}
                placeholder={t('clothesSwap.placeholder')}
                buttonText={t('clothesSwap.button')}
                showQuickPrompts={false}
              />
            </div>
            <div className="lg:col-span-8">
              <GeneratedImageView 
                isLoading={isSwappingClothes} 
                generatedImages={editedImages} 
                originalImage={null}
                emptyStateText={t('imageView.clothesSwapEmptyState')}
                emptyStateSubtext={t('imageView.clothesSwapEmptySubtext')}
              />
            </div>
          </div>
        );
      case 'IMAGE_MERGE':
        return <ImageMergeView 
                    images={imagesToMerge}
                    setImages={setImagesToMerge}
                    prompt={mergePrompt}
                    setPrompt={setMergePrompt}
                    onMerge={handleImageMerge}
                    isLoading={isMerging}
                    generatedImages={generatedImages}
                />;
      case 'PORTRAIT':
        return <PortraitView
                    image={portraitImage}
                    setImage={setPortraitImage}
                    style={portraitStyle}
                    setStyle={setPortraitStyle}
                    onCreate={handleCreatePortrait}
                    isLoading={isCreatingPortrait}
                    generatedImages={editedImages}
                />;
      case 'MOVIE_POSTER':
        return <MoviePosterView 
                    images={posterImages}
                    setImages={setPosterImages}
                    details={posterDetails}
                    setDetails={setPosterDetails}
                    onCreate={handleCreatePoster}
                    isLoading={isCreatingPoster}
                    generatedImages={generatedImages}
                />;
      case 'HOME':
      default:
        return <HomePage onSelectMode={setMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
      <Toaster position="top-center" reverseOrder={false} />
      <LanguageSwitcher />
      {mode !== 'HOME' && <HomeButton onClick={goToHome} />}
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};


// --- Section Components ---

const ImageMergeView: React.FC<{
    images: (ImageInfo | null)[],
    setImages: (images: (ImageInfo | null)[]) => void,
    prompt: string,
    setPrompt: (p: string) => void,
    onMerge: () => void,
    isLoading: boolean,
    generatedImages: string[]
}> = ({ images, setImages, prompt, setPrompt, onMerge, isLoading, generatedImages }) => {
    const { t } = useLanguage();
    const handleUpload = (index: number) => (imageInfo: ImageInfo) => {
        const newImages = [...images];
        newImages[index] = imageInfo;
        setImages(newImages);
    };

    const uploadedCount = images.filter(Boolean).length;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    <ImageUploader onImageUpload={handleUpload(0)} originalImage={images[0]} title={t('imageMerge.image1')} />
                    <ImageUploader onImageUpload={handleUpload(1)} originalImage={images[1]} title={t('imageMerge.image2')} />
                    <ImageUploader onImageUpload={handleUpload(2)} originalImage={images[2]} title={t('imageMerge.image3')} />
                </div>
                <ControlPanel
                    prompt={prompt}
                    setPrompt={setPrompt}
                    onGenerate={onMerge}
                    isLoading={isLoading}
                    isImageUploaded={uploadedCount >= 2}
                    title={t('imageMerge.promptTitle')}
                    placeholder={t('imageMerge.placeholder')}
                    buttonText={t('imageMerge.button')}
                    showQuickPrompts={false}
                />
            </div>
            <div className="lg:col-span-8">
                <GeneratedImageView
                    isLoading={isLoading}
                    generatedImages={generatedImages}
                    originalImage={null} 
                    emptyStateText={t('imageView.mergeEmptyState')}
                    emptyStateSubtext={t('imageView.mergeEmptySubtext')}
                />
            </div>
        </div>
    );
};

const PortraitView: React.FC<{
    image: ImageInfo | null,
    setImage: (i: ImageInfo | null) => void,
    style: string,
    setStyle: (s: string) => void,
    onCreate: () => void,
    isLoading: boolean,
    generatedImages: string[]
}> = ({ image, setImage, style, setStyle, onCreate, isLoading, generatedImages }) => {
    const { t } = useLanguage();
    const styles = [
        { value: 'EnhanceQuality', name: t('portrait.EnhanceQuality.name'), description: t('portrait.EnhanceQuality.description') },
        { value: 'RestorePhoto', name: t('portrait.RestorePhoto.name'), description: t('portrait.RestorePhoto.description') },
        { value: 'Anime', name: t('portrait.Anime.name'), description: t('portrait.Anime.description') },
        { value: 'Disney', name: t('portrait.Disney.name'), description: t('portrait.Disney.description') },
        { value: 'CharcoalSketch', name: t('portrait.CharcoalSketch.name'), description: t('portrait.CharcoalSketch.description') },
        { value: 'PencilDrawing', name: t('portrait.PencilDrawing.name'), description: t('portrait.PencilDrawing.description') },
        { value: 'AbstractArt', name: t('portrait.AbstractArt.name'), description: t('portrait.AbstractArt.description') },
        { value: 'PopArt', name: t('portrait.PopArt.name'), description: t('portrait.PopArt.description') },
    ];

    const styleOptions: DropdownOption[] = styles.map(s => ({
      value: s.value,
      label: s.name,
      description: s.description,
    }));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
                <ImageUploader onImageUpload={setImage} originalImage={image} title={t('portrait.uploadTitle')} />
                <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
                    <h2 className="text-xl font-semibold text-cyan-400 mb-3">{t('portrait.styleTitle')}</h2>
                    <Dropdown
                      options={styleOptions}
                      selectedValue={style}
                      onSelect={(value) => setStyle(value as string)}
                      placeholder={t('portrait.stylePlaceholder')}
                    />
                </div>
                 <button
                  onClick={onCreate}
                  disabled={isLoading || !image || !style}
                  className="w-full flex items-center justify-center bg-cyan-600 text-white font-bold py-3 px-4 rounded-md hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? t('portrait.buttonLoading') : t('portrait.button')}
                </button>
            </div>
            <div className="lg:col-span-8">
                <GeneratedImageView
                    isLoading={isLoading}
                    generatedImages={generatedImages}
                    originalImage={null}
                    emptyStateText={t('imageView.portraitEmptyState')}
                    emptyStateSubtext={t('imageView.portraitEmptySubtext')}
                />
            </div>
        </div>
    );
};

const MoviePosterView: React.FC<{
    images: (ImageInfo | null)[],
    setImages: (images: (ImageInfo | null)[]) => void,
    details: MoviePosterDetails,
    setDetails: (d: MoviePosterDetails) => void,
    onCreate: () => void,
    isLoading: boolean,
    generatedImages: string[]
}> = ({ images, setImages, details, setDetails, onCreate, isLoading, generatedImages }) => {
    const { t } = useLanguage();
    const handleUpload = (index: number) => (imageInfo: ImageInfo) => {
        const newImages = [...images];
        newImages[index] = imageInfo;
        setImages(newImages);
    };

    const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
                <ImageUploader onImageUpload={handleUpload(0)} originalImage={images[0]} title={t('moviePoster.image1')} />
                <ImageUploader onImageUpload={handleUpload(1)} originalImage={images[1]} title={t('moviePoster.image2')} />
                <ImageUploader onImageUpload={handleUpload(2)} originalImage={images[2]} title={t('moviePoster.image3')} />
                <div className="bg-gray-800 p-4 rounded-lg shadow-inner space-y-3">
                    <h2 className="text-xl font-semibold text-cyan-400 mb-2">{t('moviePoster.detailsTitle')}</h2>
                    <input type="text" name="title" value={details.title} onChange={handleDetailChange} placeholder={t('moviePoster.titlePlaceholder')} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500" />
                    <input type="text" name="description" value={details.description} onChange={handleDetailChange} placeholder={t('moviePoster.descriptionPlaceholder')} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500" />
                    <input type="text" name="actors" value={details.actors} onChange={handleDetailChange} placeholder={t('moviePoster.actorsPlaceholder')} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500" />
                    <input type="text" name="director" value={details.director} onChange={handleDetailChange} placeholder={t('moviePoster.directorPlaceholder')} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500" />
                    <input type="text" name="writer" value={details.writer} onChange={handleDetailChange} placeholder={t('moviePoster.writerPlaceholder')} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500" />
                    <input type="text" name="genre" value={details.genre} onChange={handleDetailChange} placeholder={t('moviePoster.genrePlaceholder')} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500" />
                </div>
                 <button
                  onClick={onCreate}
                  disabled={isLoading || !details.title}
                  className="w-full flex items-center justify-center bg-cyan-600 text-white font-bold py-3 px-4 rounded-md hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? t('moviePoster.buttonLoading') : t('moviePoster.button')}
                </button>
            </div>
            <div className="lg:col-span-8">
                <GeneratedImageView
                    isLoading={isLoading}
                    generatedImages={generatedImages}
                    originalImage={null}
                    emptyStateText={t('imageView.posterEmptyState')}
                    emptyStateSubtext={t('imageView.posterEmptySubtext')}
                />
            </div>
        </div>
    );
};

const HomePage: React.FC<{ onSelectMode: (mode: Mode) => void }> = ({ onSelectMode }) => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-4xl font-bold text-white mb-4">{t('home.title')}</h2>
      <p className="text-lg text-gray-400 mb-10">{t('home.subtitle')}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        <ModeCard
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
          title={t('home.generator.title')}
          description={t('home.generator.description')}
          onClick={() => onSelectMode('GENERATOR')}
        />
        <ModeCard
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12.25c0-4.452-3.62-8.074-8.098-8.074-4.41 0-7.986 3.51-8.09 7.865-.006.23.033.45.105.659 1.196 3.487 4.37 6.037 8.014 6.037 3.593 0 6.74-2.475 7.95-5.87.052-.14.08-.286.08-.437.02-.158.02-.317 0-.475Z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12.023 15.25a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m15.863 5.5-1.554 2.872.483.26ZM8.137 5.5l1.554 2.872-.483.26Z" /></svg>}
          title={t('home.bgRemoval.title')}
          description={t('home.bgRemoval.description')}
          onClick={() => onSelectMode('BACKGROUND_REMOVAL')}
        />
        <ModeCard
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>}
          title={t('home.editor.title')}
          description={t('home.editor.description')}
          onClick={() => onSelectMode('EDITOR')}
        />
        <ModeCard
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10h.01M15 10h.01M12 6v.01" /></svg>}
          title={t('home.clothesSwap.title')}
          description={t('home.clothesSwap.description')}
          onClick={() => onSelectMode('CLOTHES_SWAP')}
        />
        <ModeCard
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5" /></svg>}
          title={t('home.imageMerge.title')}
          description={t('home.imageMerge.description')}
          onClick={() => onSelectMode('IMAGE_MERGE')}
        />
        <ModeCard
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          title={t('home.portrait.title')}
          description={t('home.portrait.description')}
          onClick={() => onSelectMode('PORTRAIT')}
        />
        <ModeCard
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5.1L9 3 3 5.1V9l6 2.1 6-2.1V5.1zM3 14.1l6 2.1 6-2.1v-3.3L12 13 6 10.9v3.2z" /></svg>}
          title={t('home.moviePoster.title')}
          description={t('home.moviePoster.description')}
          onClick={() => onSelectMode('MOVIE_POSTER')}
        />
      </div>
    </div>
  );
}

const ModeCard: React.FC<{ icon: React.ReactNode, title: string, description: string, onClick: () => void }> = ({ icon, title, description, onClick }) => (
  <div
    onClick={onClick}
    className="bg-gray-800 p-8 rounded-lg border border-gray-700 hover:border-cyan-500 hover:bg-gray-700/50 cursor-pointer transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center"
  >
    <div className="text-cyan-400 mb-4">{icon}</div>
    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

const Footer: React.FC = () => {
    const { t } = useLanguage();
    return (
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} {t('footer.rights')}</p>
      </footer>
    );
}

export default App;
