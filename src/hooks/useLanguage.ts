import { useEffect } from 'react';

export const useLanguage = (language: string) => {
  useEffect(() => {
    document.getElementsByTagName('html')[0].setAttribute('lang', language);
  }, [language]);
};
