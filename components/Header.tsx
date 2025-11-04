import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Header: React.FC = () => {
  const { t } = useLanguage();
  return (
    <header className="sticky top-0 z-40 bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 text-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400 tracking-tight">
            Elmotiam
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            {t('header.subtitle')}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
