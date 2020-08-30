import { Rel, As } from '../types';
import { useEffect, useRef } from 'react';
import { isServerSide } from '../utils';
import dispatcher, { LINK } from '../dispatcher';

export interface LinkOptions {
  rel: Rel;
  as?: As;
  media?: string;
  href?: string;
  sizes?: string;
  crossorigin?: 'anonymous' | 'use-credentials';
  type?: string;
}

export const useLink = (options: LinkOptions) => {
  const hasMounted = useRef(false);
  const node = useRef<Element | undefined>();

  if (isServerSide && !hasMounted.current) {
    dispatcher._addToQueue(LINK, options as any);
  }

  useEffect(() => {
    if (hasMounted.current) {
      Object.keys(options).forEach((key) => {
        // @ts-ignore
        (node.current as Element).setAttribute(key, options[key]);
      });
    }
  }, [
    options.href,
    options.media,
    options.as,
    options.rel,
    options.crossorigin,
    options.type,
  ]);

  useEffect(() => {
    hasMounted.current = true;
    node.current = document.createElement('link');
    Object.keys(options).forEach((key) => {
      // @ts-ignore
      (node.current as Element).setAttribute(key, options[key]);
    });
    document.head.appendChild(node.current);

    return () => {
      hasMounted.current = false;
      document.head.removeChild(node.current as Element);
    };
  }, []);
};
