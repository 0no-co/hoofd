import { useEffect } from 'react';
import dispatcher from '../dispatcher';
import { isServerSide } from '../utils';

export const useLang = (language: string) => {
  useEffect(() => {
    if (isServerSide) dispatcher.setLang(language);
    else
      document.getElementsByTagName('html')[0].setAttribute('lang', language);
  }, [language]);
};
