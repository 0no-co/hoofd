import dispatcher from '../dispatcher';
import { isServerSide } from '../utils';
import { useEffect } from 'react';

export const useAmp = () => {
  if (isServerSide) {
    dispatcher._setAmp();
  }

  useEffect(() => {
    const nodeList = document.querySelectorAll(
      'script[src="https://cdn.ampproject.org/v0.js"]'
    );
    document.getElementsByTagName('html')[0].setAttribute('amp', '');
    if (!nodeList[0]) {
      const ampScript = document.createElement('script');
      ampScript.src = 'https://cdn.ampproject.org/v0.js';
      ampScript.async = true;
      document.head.insertBefore(ampScript, document.head.firstChild);
    }
  }, []);
};
