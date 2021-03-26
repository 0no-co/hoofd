import { useContext, useEffect } from 'react';
import { DispatcherContext } from '../dispatcher';
import { isServerSide } from '../utils';

export const useLang = (language: string) => {
  const dispatcher = useContext(DispatcherContext);

  if (isServerSide) {
    dispatcher._setLang(language);
  }

  useEffect(() => {
    document.getElementsByTagName('html')[0].setAttribute('lang', language);
  }, [language]);
};
