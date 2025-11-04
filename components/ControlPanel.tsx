import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ControlPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  isImageUploaded: boolean;
  title?: string;
  placeholder?: string;
  buttonText?: string;
  showQuickPrompts?: boolean;
}

const QuickPromptButton: React.FC<{ onClick: () => void, children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded-full hover:bg-cyan-600 hover:text-white transition-all duration-200"
  >
    {children}
  </button>
);

const GenerateIcon: React.FC = () => {
    const { language } = useLanguage();
    return (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${language === 'ar' ? 'mr-2' : 'ms-2'}`} viewBox="0 0 20 20" fill="currentColor">
      <path d="M11.983 1.904a1 1 0 00-1.09.217l-5 5a1 1 0 00-.293.707v2.09a1 1 0 001 1h2.09a1 1 0 00.707-.293l5-5a1 1 0 00-.217-1.09l-2.09-2.09a1 1 0 00-.707-.293zM12.924 5.341l-1.06-1.06 1.06-1.061 1.06 1.06-1.06 1.061zM4 14a1 1 0 011-1h8a1 1 0 010 2H5a1 1 0 01-1-1z" />
      <path d="M15.53 3.47a1 1 0 00-1.414 0l-1.06 1.06 1.414 1.414 1.06-1.06a1 1 0 000-1.414zM17 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM3 10a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zM7 17a1 1 0 011-1h1a1 1 0 110 2H8a1 1 0 01-1-1zM13 17a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" />
    </svg>
    );
};


const ControlPanel: React.FC<ControlPanelProps> = ({ 
  prompt, 
  setPrompt, 
  onGenerate, 
  isLoading, 
  isImageUploaded,
  title,
  placeholder,
  buttonText,
  showQuickPrompts = true
}) => {
  const { t } = useLanguage();
  const quickPrompts = [
    t('quickPrompts.classic'),
    t('quickPrompts.removeBg'),
    t('quickPrompts.portrait'),
    t('quickPrompts.moviePoster'),
    t('quickPrompts.cinematic')
  ];

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-inner space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-cyan-400 mb-3">{title}</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholder}
          className="w-full h-28 p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow"
          disabled={isLoading}
        />
      </div>
      {showQuickPrompts && (
        <div>
          <h3 className="text-md font-semibold text-gray-300 mb-2">{t('controlPanel.quickIdeas')}</h3>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((p) => (
              <QuickPromptButton key={p} onClick={() => setPrompt(p)}>
                {p}
              </QuickPromptButton>
            ))}
          </div>
        </div>
      )}
      <div>
        <button
          onClick={onGenerate}
          disabled={isLoading || !isImageUploaded}
          className="w-full flex items-center justify-center bg-cyan-600 text-white font-bold py-3 px-4 rounded-md hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ms-1 me-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('controlPanel.loading')}
            </>
          ) : (
            <>
             {buttonText}
             <GenerateIcon />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;