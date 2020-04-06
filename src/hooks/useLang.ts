import { useEffect } from 'react';
import { isServerSide } from '../utils';

export const useLang = (language: string) => {
  useEffect(() => {
    if (!isServerSide)
      document.getElementsByTagName('html')[0].setAttribute('lang', language);
  }, [language]);
};
