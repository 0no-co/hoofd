import { useRef, useEffect } from 'react';
import { Name, HttpEquiv, CharSet, Property } from './types';
import { addToQueue, removeFromQueue, change } from './dispatcher';

export interface MetaOptions {
  name?: Name;
  httpEquiv?: HttpEquiv;
  charset?: CharSet;
  content?: string;
  property?: Property;
}

export const useMeta = ({
  name,
  content,
  charset,
  httpEquiv,
  property,
}: MetaOptions) => {
  const hasMounted = useRef(false);
  const keyword = useRef<string | undefined>();
  const index = useRef<number | undefined>();

  useEffect(() => {
    if (hasMounted.current) {
      change('meta', index.current as number, {
        keyword: keyword.current,
        name,
        charset,
        httpEquiv,
        property,
        content,
      });
    }
  }, [content]);

  useEffect(() => {
    index.current = addToQueue('meta', {
      keyword: keyword.current = charset
        ? 'charset'
        : name
        ? 'name'
        : property
        ? 'property'
        : 'http-equiv',
      name,
      charset,
      httpEquiv,
      property,
      content,
    });

    hasMounted.current = true;
    return () => {
      hasMounted.current = false;
      removeFromQueue('meta', index.current as number);
    };
  }, []);
};
