import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// A generic chevron down icon
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5 text-gray-400" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

export interface DropdownOption {
    value: string | number;
    label: string;
    description?: string;
}

interface DropdownProps {
    options: DropdownOption[];
    selectedValue: string | number | null;
    onSelect: (value: string | number) => void;
    placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, selectedValue, onSelect, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

    const selectedOption = options.find(option => option.value === selectedValue);

    // Close dropdown on outside click
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

    const handleSelectOption = (value: string | number) => {
        onSelect(value);
        setIsOpen(false);
    };
    
    const defaultPlaceholder = t('dropdown.placeholder');

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm ltr:pl-3 ltr:pr-10 rtl:pr-3 rtl:pl-10 py-2.5 ltr:text-left rtl:text-right focus:outline-none focus:ring-2 focus:ring-cyan-500 flex justify-between items-center"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate text-white">
                    {selectedOption ? selectedOption.label : (placeholder || defaultPlaceholder)}
                </span>
                <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-600 shadow-lg rounded-md max-h-60 overflow-auto">
                    <ul className="py-1">
                        {options.map((option) => (
                            <li
                                key={option.value}
                                className="text-white cursor-pointer select-none relative py-2 px-4 hover:bg-cyan-900/50"
                                onClick={() => handleSelectOption(option.value)}
                            >
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-center">
                                      <span className={`font-normal block truncate ltr:text-left rtl:text-right ${selectedValue === option.value ? 'font-semibold text-cyan-300' : ''}`}>
                                          {option.label}
                                      </span>
                                      {selectedValue === option.value && (
                                          <span className="text-cyan-400">
                                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                              </svg>
                                          </span>
                                      )}
                                    </div>
                                    {option.description && (
                                        <span className="text-gray-400 text-xs mt-1 ltr:text-left rtl:text-right">
                                            {option.description}
                                        </span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dropdown;