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
  const originalOptions = useRef<LinkOptions | undefined>();

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
    options.hreflang,
  ]);

  useEffect(() => {
    hasMounted.current = true;
    const preExistingElements = document.querySelectorAll(
      `link[rel="${options.rel}"]`
    );

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

    if (node.current) {
      originalOptions.current = Object.keys(options).reduce((acc, key) => {
        // @ts-ignore
        acc[key] = node.current!.getAttribute(key);
        return acc;
      }, {} as LinkOptions);
    } else {
      node.current = document.createElement('link');
      Object.keys(options).forEach((key) => {
        // @ts-ignore
        (node.current as Element).setAttribute(key, options[key]);
      });
      document.head.appendChild(node.current);
    }

    return () => {
      hasMounted.current = false;
      if (originalOptions.current) {
        Object.keys(originalOptions.current).forEach((key) => {
          (node.current as Element).setAttribute(
            key,
            // @ts-ignore
            originalOptions.current[key]
          );
        });
      } else {
        document.head.removeChild(node.current as Element);
      }
    };
  }, []);
};
