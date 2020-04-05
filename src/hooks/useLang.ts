import { useEffect } from 'react';

export const useLang = (language: string) => {
  useEffect(() => {
    document.getElementsByTagName('html')[0].setAttribute('lang', language);
  }, [language]);
};
