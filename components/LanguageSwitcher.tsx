'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useTransition, useRef, useEffect } from 'react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇩🇿' },
];

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  // Debug effect to monitor locale changes
  useEffect(() => {
    console.log('LanguageSwitcher debug:', {
      locale,
      pathname,
      currentLanguage,
      languages,
      windowPath: typeof window !== 'undefined' ? window.location.pathname : 'SSR'
    });
  }, [locale, pathname, currentLanguage]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLanguageChange = (nextLocale: string) => {
    if (nextLocale === locale) return;
    
    setIsOpen(false);
    startTransition(() => {
      try {
        // Get current full URL components
        const currentUrl = window.location.pathname + window.location.search + window.location.hash;
        
        console.log('Starting language change:', {
          from: locale,
          to: nextLocale,
          currentUrl
        });
        
        // Remove the current locale if it exists at the beginning of the path
        let pathWithoutLocale = currentUrl;
        
        // Handle both cases: /fr/... and /ar/...
        const localeRegex = new RegExp(`^/(fr|ar)(/|$)`);
        const match = currentUrl.match(localeRegex);
        
        if (match) {
          // Remove the matched locale part
          pathWithoutLocale = currentUrl.replace(match[0], match[2] || '/');
        }
        
        // Ensure path starts with /
        if (!pathWithoutLocale.startsWith('/')) {
          pathWithoutLocale = '/' + pathWithoutLocale;
        }
        
        // Remove double slashes
        pathWithoutLocale = pathWithoutLocale.replace(/\/+/g, '/');
        
        // Construct new path with new locale
        let newPath;
        if (pathWithoutLocale === '/') {
          newPath = `/${nextLocale}`;
        } else {
          newPath = `/${nextLocale}${pathWithoutLocale}`;
        }
        
        console.log('Language switch calculation:', {
          currentUrl,
          currentLocale: locale,
          nextLocale,
          pathWithoutLocale,
          newPath,
          regexMatch: match
        });
        
        // Navigate to new path with a small delay to ensure state updates
        setTimeout(() => {
          router.push(newPath);
        }, 100);
        
      } catch (error) {
        console.error('Error during language change:', error);
        // Fallback: simple redirect to home page with new locale
        router.push(`/${nextLocale}`);
      }
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`
          relative w-full min-w-[140px]
          flex items-center justify-between
          bg-gradient-to-r from-slate-50 to-gray-50
          hover:from-white hover:to-slate-50
          border border-slate-200 hover:border-slate-300
          text-slate-700 font-medium
          py-3 px-4
          rounded-xl
          leading-tight
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-sm hover:shadow-md
          ${isOpen ? 'ring-2 ring-blue-500/20 border-blue-400' : ''}
          ${isPending ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{currentLanguage.flag}</span>
          <span className="text-sm">{currentLanguage.name}</span>
        </div>
        
        {/* Arrow Icon */}
        <svg 
          className={`
            w-5 h-5 text-slate-400
            transition-all duration-200 ease-in-out
            ${isOpen ? 'rotate-180 text-blue-500' : 'group-hover:text-slate-600'}
            ${isPending ? 'animate-spin' : ''}
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isPending ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          )}
        </svg>

        {/* Loading Overlay */}
        {isPending && (
          <div className="absolute inset-0 bg-white/50 rounded-xl flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`
          absolute top-full left-0 right-0 mt-2 z-50
          bg-white
          border border-slate-200
          rounded-xl
          shadow-lg shadow-slate-200/50
          overflow-hidden
          animate-in fade-in-0 zoom-in-95 duration-200
        `}>
          <div className="py-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                disabled={isPending}
                className={`
                  w-full flex items-center gap-3 px-4 py-3
                  text-sm font-medium text-left
                  transition-all duration-150 ease-in-out
                  hover:bg-slate-50 hover:text-slate-900
                  focus:outline-none focus:bg-slate-50
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${language.code === locale 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500' 
                    : 'text-slate-600'
                  }
                `}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="flex-1">{language.name}</span>
                
                {/* Check mark for current language */}
                {language.code === locale && (
                  <svg 
                    className="w-4 h-4 text-blue-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}