import { useRef, useEffect } from 'react';
import { Name, HttpEquiv, CharSet, Property } from '../types';
import dispatcher from '../dispatcher';

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
  const metaObject = useRef<any>();

  useEffect(() => {
    if (hasMounted.current) {
      dispatcher.change(
        'meta',
        metaObject.current,
        (metaObject.current = {
          keyword: keyword.current,
          name,
          charset,
          httpEquiv,
          property,
          content,
        })
      );
    }
  }, [content]);

  useEffect(() => {
    dispatcher.addToQueue(
      'meta',
      (metaObject.current = {
        keyword: keyword.current = charset
          ? 'charset'
          : name
          ? 'name'
          : property
          ? 'property'
          : 'httpEquiv',
        name,
        charset,
        httpEquiv,
        property,
        content,
      })
    );

    hasMounted.current = true;
    return () => {
      hasMounted.current = false;
      dispatcher.removeFromQueue('meta', metaObject.current);
    };
  }, []);
};
