import { ampScriptSrc, DispatcherContext } from '../dispatcher';
import { isServerSide } from '../utils';
import { useContext, useEffect } from 'react';

export const useAmp = (isModule: boolean, disabled?: boolean) => {
  const dispatcher = useContext(DispatcherContext);

  if (isServerSide && !disabled) {
    dispatcher._setAmp(isModule);
  }

  useEffect(() => {
    if (!disabled) {
      const nodeList = document.querySelectorAll(
        `script[src="${ampScriptSrc}"]`
      );
      document.getElementsByTagName('html')[0].setAttribute('amp', '');

      if (!nodeList[0]) {
        const ampScript = document.createElement('script');
        if (isModule) {
          ampScript.setAttribute('type', 'module');
        }

        ampScript.setAttribute('async', '');
        ampScript.setAttribute(
          'src',
          ampScriptSrc + (isModule ? '.mjs' : '.js')
        );
        document.head.insertBefore(ampScript, document.head.firstChild);
      }
    }
  }, [disabled]);
};
