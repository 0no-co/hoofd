import { useMemo, useRef, useEffect } from 'react';

// TODO: type this
// type Meta = 'application-name' | 'author' | 'description' | 'generator' | 'keywords' | 'viewport' | 'referrer' | 'theme-color' | 'color-scheme';
// type Property = string;

export type HttpEquiv =
  | 'content-type'
  | 'default-style'
  | 'refresh'
  | 'content-security-policy';
export type CharSet = 'utf-8';

export interface MetaOptions {
  name?: string;
  httpEquiv?: HttpEquiv;
  charset?: CharSet;
  content?: string;
  property?: string;
}

export const useMeta = ({
  name,
  content,
  charset,
  httpEquiv,
  property,
}: MetaOptions) => {
  const hasMounted = useRef(false);
  const valueBeforeHook = useRef<string | null | undefined>();
  const initialElement = useRef<Element | undefined>();

  useMemo(() => {
    const result = document.head.querySelectorAll(
      charset
        ? 'meta[charset]'
        : name
        ? `meta[name="${name}"]`
        : property
        ? `meta[property="${property}"]`
        : `meta[http-equiv="${httpEquiv}"]`
    );

    let element = (initialElement.current = result[0]);
    if (!hasMounted.current && element) {
      if (charset) {
        valueBeforeHook.current = element.getAttribute('charset');
      } else {
        valueBeforeHook.current = element.getAttribute('content');
      }
    }

    if (element) {
      if (charset) {
        element.setAttribute('charset', charset);
      } else {
        element.setAttribute('content', content as string);
      }
    } else {
      const metaTag = (element = document.createElement('meta'));
      if (charset) {
        metaTag.setAttribute('charset', charset);
      } else {
        if (name) {
          metaTag.setAttribute('name', name);
        } else if (property) {
          metaTag.setAttribute('property', property);
        } else {
          metaTag.setAttribute('http-equiv', httpEquiv as string);
        }

        metaTag.setAttribute('content', content as string);
      }

      initialElement.current = element;
      document.head.appendChild(metaTag);
    }
  }, [content]);

  useEffect(() => {
    hasMounted.current = true;
    return () => {
      if (valueBeforeHook.current)
        (initialElement.current as Element).setAttribute(
          charset ? 'charset' : 'content',
          valueBeforeHook.current as string
        );
      else document.head.removeChild(initialElement.current as Element);
    };
  }, []);
};
