import { Rel, As } from '../types';
import { useContext, useEffect, useRef } from 'react';
import { isServerSide } from '../utils';
import { DispatcherContext, LINK } from '../dispatcher';

export interface LinkOptions {
  rel: Rel;
  as?: As;
  media?: string;
  href?: string;
  sizes?: string;
  crossorigin?: 'anonymous' | 'use-credentials';
  type?: string;
  hreflang?: string;
}

export const useLink = (options: LinkOptions) => {
  const dispatcher = useContext(DispatcherContext);

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
  }, [JSON.stringify(options)]);

  useEffect(() => {
    hasMounted.current = true;
    const preExistingElements = document.querySelectorAll(
      `link[data-hoofd="1"]`
    );

    // We should be able to recover from SSR like this
    preExistingElements.forEach((x) => {
      let found = true;
      Object.keys(options).forEach((key) => {
        // @ts-ignore
        if (x.getAttribute(key) !== options[key]) {
          found = false;
        }
      });

      if (found) {
        node.current = x;
      }
    });

    if (!node.current) {
      node.current = document.createElement('link');
      Object.keys(options).forEach((key) => {
        // @ts-ignore
        (node.current as Element).setAttribute(key, options[key]);
      });
      document.head.appendChild(node.current);
    }

    return () => {
      hasMounted.current = false;
      if (node.current) {
        document.head.removeChild(node.current as Element);
        node.current = undefined;
      }
    };
  }, []);
};
