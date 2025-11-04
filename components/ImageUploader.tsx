import React, { useCallback, useRef } from 'react';
import { ImageInfo } from '../types';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';

interface ImageUploaderProps {
  onImageUpload: (imageInfo: ImageInfo) => void;
  originalImage: ImageInfo | null;
  title?: string;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // remove the data url prefix
    };
    reader.onerror = (error) => reject(error);
  });
};

const UploadIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);


const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, originalImage, title }) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultTitle = t('imageUploader.title');

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error(t('toast.error.invalidImageFile'));
        return;
      }
      try {
        const base64 = await fileToBase64(file);
        onImageUpload({ file, base64, mimeType: file.type });
      } catch (error) {
        toast.error(t('toast.error.fileReadFailed'));
        console.error(error);
      }
    }
  }, [onImageUpload, t]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-inner">
      <h2 className="text-xl font-semibold text-cyan-400 mb-3">{title || defaultTitle}</h2>
      <div
        className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-cyan-500 transition-colors"
        onClick={handleUploadClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        {originalImage ? (
          <div className="relative">
             <img src={`data:${originalImage.mimeType};base64,${originalImage.base64}`} alt="Preview" className="mx-auto max-h-60 rounded-md" />
             <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <p className="text-white font-semibold">{t('imageUploader.changeImage')}</p>
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 text-gray-400">
            <UploadIcon />
            <p>
              <span className="font-semibold text-cyan-500">{t('imageUploader.clickToUpload')}</span> {t('imageUploader.orDragAndDrop')}
            </p>
            <p className="text-xs">{t('imageUploader.fileTypes')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;