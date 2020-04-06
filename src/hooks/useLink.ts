import { Rel, As } from '../types';
import { useEffect, useRef } from 'react';
import { isServerSide } from '../utils';
import dispatcher from '../dispatcher';

interface LinkOptions {
  rel: Rel;
  as?: As;
  media?: string;
  href?: string;
  sizes?: string;
  crossorigin?: 'anonymous' | 'use-credentials';
}

export const useLink = (options: LinkOptions) => {
  const hasMounted = useRef(false);
  const node = useRef<Element | undefined>();

  useEffect(() => {
    if (hasMounted.current && !isServerSide) {
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
  ]);

  useEffect(() => {
    if (isServerSide) {
      dispatcher._addToQueue('link', options as any);
    } else {
      hasMounted.current = true;
      node.current = document.createElement('link');
      Object.keys(options).forEach((key) => {
        // @ts-ignore
        (node.current as Element).setAttribute(key, options[key]);
      });
      document.head.appendChild(node.current);
    }
    return () => {
      hasMounted.current = false;
      if (!isServerSide) document.head.removeChild(node.current as Element);
    };
  }, []);
};
