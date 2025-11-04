import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSetLanguage = (lang: 'ar' | 'en') => {
        setLanguage(lang);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="fixed top-4 left-4 z-50" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-700 hover:bg-cyan-600 text-white font-bold w-10 h-10 rounded-full transition-colors flex items-center justify-center shadow-lg"
                aria-label="Change language"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m4 13-4-4-4 4M19 18v-7a2 2 0 00-2-2h-5l-5 5v7a2 2 0 002 2h5a2 2 0 002-2z" />
                </svg>
            </button>
            {isOpen && (
                <div className="absolute left-0 mt-2 w-36 bg-gray-800 border border-gray-600 shadow-lg rounded-md z-10">
                    <ul className="py-1">
                        <li>
                            <button
                                onClick={() => handleSetLanguage('en')}
                                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-cyan-900/50"
                            >
                                English
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handleSetLanguage('ar')}
                                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-cyan-900/50"
                            >
                                العربية
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default LanguageSwitcher;
