import dispatcher from '../dispatcher';
import { isServerSide, ampScriptSrc } from '../utils';
import { useEffect } from 'react';

export const useAmp = () => {
  if (isServerSide) {
    dispatcher._setAmp();
  }

  useEffect(() => {
    const nodeList = document.querySelectorAll(`script[src="${ampScriptSrc}"]`);
    document.getElementsByTagName('html')[0].setAttribute('amp', '');
    if (!nodeList[0]) {
      const ampScript = document.createElement('script');
      // @ts-ignore
      ampScript.src = ampScriptSrc;
      ampScript.async = true;
      document.head.insertBefore(ampScript, document.head.firstChild);
    }
  }, []);
};
