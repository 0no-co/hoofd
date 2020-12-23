import { useEffect } from 'react';
import { isServerSide } from '../utils';
import dispatcher, { SCRIPT } from '../dispatcher';

export interface ScriptOptions {
  src: string;
  type: string;
  async?: boolean;
  defer?: boolean;
  module?: boolean;
  crossorigin?: 'anonymous' | 'use-credentials';
  integrity?: string;
}

export const useScript = (options: ScriptOptions) => {
  if (isServerSide) {
    dispatcher._addToQueue(SCRIPT, options as any);
  }

  useEffect(() => {
    const preExistingElements = document.querySelectorAll(
      `script[src="${options.src}"]`
    );

    let script: HTMLScriptElement;

    if (!preExistingElements[0] && options.src) {
      const script = document.createElement('script');

      script.type = options.type;
      if (options.module) script.type = 'module';

      if (options.integrity)
        script.setAttribute('integrity', options.integrity as string);
      if (options.crossorigin)
        script.setAttribute('crossorigin', options.crossorigin as string);
      if (options.defer) script.setAttribute('defer', 'true');
      else if (options.async) script.setAttribute('async', 'true');

      script.src = options.src;
      document.head.appendChild(script);
    } else if (preExistingElements[0]) {
      script = preExistingElements[0] as HTMLScriptElement;
    }

    return () => {
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);
};
