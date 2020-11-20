import { useEffect } from 'react';
import dispatcher from '../dispatcher';
import { isServerSide } from '../utils';

export const useLang = (language: string) => {
  if (isServerSide) {
    dispatcher._setLang(language);
  }

  useEffect(() => {
    document.getElementsByTagName('html')[0].setAttribute('lang', language);
  }, [language]);
};
