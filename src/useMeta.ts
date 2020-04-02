import { useEffect } from 'react';

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
  useEffect(() => {
    const result = document.head.querySelectorAll(
      charset
        ? '[charset]'
        : name
        ? `[name=${name}]`
        : property
        ? `[property=${property}]`
        : `[http-equiv=${httpEquiv}]`
    );
    const element = result[0];

    if (element) {
      if (charset) {
        element.setAttribute('charset', charset);
      } else {
        element.setAttribute('content', content || '');
      }
    } else {
      const metaTag = document.createElement('meta');
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

        metaTag.setAttribute('content', content || '');
      }

      document.head.appendChild(metaTag);
    }
  }, [name, content, httpEquiv, property]);
};
