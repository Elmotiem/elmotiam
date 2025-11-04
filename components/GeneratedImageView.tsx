import React, { useState } from 'react';
import { ImageInfo } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface GeneratedImageViewProps {
  isLoading: boolean;
  generatedImages: string[];
  originalImage: ImageInfo | null;
  emptyStateText?: string;
  emptyStateSubtext?: string;
  isTransparent?: boolean;
}

const DownloadIcon: React.FC = () => {
    const { language } = useLanguage();
    return (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${language === 'ar' ? 'mr-2' : 'ms-2'}`} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
    );
};

const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ImageCard: React.FC<{ src: string; alt: string; onDownload: () => void; onClick: () => void; isOriginal?: boolean; isTransparent?: boolean }> = ({ src, alt, onDownload, onClick, isOriginal = false, isTransparent = false }) => {
  const checkerboardStyle = {
    backgroundImage:
      'linear-gradient(45deg, #444 25%, transparent 25%), linear-gradient(-45deg, #444 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #444 75%), linear-gradient(-45deg, transparent 75%, #444 75%)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
  };
  const { t } = useLanguage();

  return (
    <div className="group relative aspect-square bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer" style={isTransparent ? checkerboardStyle : {}}>
      <img src={src} alt={alt} className="w-full h-full object-contain" onClick={onClick} />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center pointer-events-none">
        {!isOriginal && (
          <button
            onClick={(e) => { e.stopPropagation(); onDownload(); }}
            className="opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-90 transition-all duration-300 bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md flex items-center pointer-events-auto"
          >
            {t('imageView.download')}
            <DownloadIcon />
          </button>
        )}
        {isOriginal && (
          <div className="absolute top-2 ltr:right-2 rtl:left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {t('imageView.original')}
          </div>
        )}
      </div>
    </div>
  );
};

const SkeletonCard: React.FC = () => (
  <div className="aspect-square bg-gray-700 rounded-lg animate-pulse"></div>
);

const ImageModal: React.FC<{ src: string; onClose: () => void; onDownload: () => void }> = ({ src, onClose, onDownload }) => {
    const { t } = useLanguage();
    return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
        <div className="relative" onClick={e => e.stopPropagation()}>
            <img src={src} alt="Full screen view" className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg" />
            <button
                onClick={onClose}
                className="absolute -top-3 ltr:-right-3 rtl:-left-3 text-white bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors"
                aria-label={t('imageView.closeAriaLabel')}
            >
                <CloseIcon />
            </button>
            <button
                onClick={onDownload}
                className="absolute bottom-4 ltr:right-4 rtl:left-4 bg-cyan-600 text-white font-semibold py-2 px-4 rounded-md flex items-center hover:bg-cyan-500 transition-colors"
            >
                {t('imageView.downloadImage')}
                <DownloadIcon />
            </button>
        </div>
    </div>
    );
};


const GeneratedImageView: React.FC<GeneratedImageViewProps> = ({ 
  isLoading, 
  generatedImages, 
  originalImage,
  emptyStateText,
  emptyStateSubtext,
  isTransparent = false
}) => {
  const { t } = useLanguage();
  const [modalSrc, setModalSrc] = useState<string | null>(null);

  const defaultEmptyStateText = t('imageView.editedEmptyState');
  const defaultEmptyStateSubtext = t('imageView.editedEmptySubtext');


  const handleDownload = (base64Image: string) => {
    const link = document.createElement('a');
    link.href = base64Image;
    link.download = `elmotiam-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasContent = isLoading || generatedImages.length > 0 || originalImage;

  if (!hasContent) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-inner h-full flex flex-col items-center justify-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-400">{emptyStateText || defaultEmptyStateText}</h3>
        <p className="text-gray-500 mt-2">{emptyStateSubtext || defaultEmptyStateSubtext}</p>
      </div>
    );
  }
  
  const skeletonsNeeded = (() => {
    if (generatedImages.length > 0) return 0; // Don't show skeletons if images are already loaded
    if (emptyStateText && emptyStateText.includes(t('imageView.generatedEmptyState'))) return 4;
    if (emptyStateText && emptyStateText.includes(t('imageView.bgRemovalEmptyState'))) return 1;
    return 2; // Default for other edit modes
  })();
  

  return (
    <>
      {modalSrc && <ImageModal src={modalSrc} onClose={() => setModalSrc(null)} onDownload={() => handleDownload(modalSrc)} />}
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-inner">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {originalImage && (
            <ImageCard
              src={`data:${originalImage.mimeType};base64,${originalImage.base64}`}
              alt="Original"
              onDownload={() => {}}
              onClick={() => setModalSrc(`data:${originalImage.mimeType};base64,${originalImage.base64}`)}
              isOriginal={true}
            />
          )}
          
          {isLoading && Array.from({length: skeletonsNeeded}).map((_, i) => <SkeletonCard key={i} />)}

          {!isLoading && generatedImages.map((img, index) => (
            <ImageCard
              key={index}
              src={img}
              alt={`Generated ${index + 1}`}
              onDownload={() => handleDownload(img)}
              onClick={() => setModalSrc(img)}
              isTransparent={isTransparent}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default GeneratedImageView;