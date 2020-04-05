import { useRef, useEffect } from 'react';
import { Name, HttpEquiv, CharSet, Property } from '../types';
import dispatcher, { MetaPayload } from '../dispatcher';

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
  const metaObject = useRef<MetaPayload>();

  useEffect(() => {
    if (hasMounted.current) {
      dispatcher.change(
        'meta',
        metaObject.current as MetaPayload,
        (metaObject.current = {
          keyword: keyword.current,
          name,
          charset,
          'http-equiv': httpEquiv,
          property,
          content,
        } as MetaPayload) as MetaPayload
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
          : 'http-equiv',
        name,
        charset,
        'http-equiv': httpEquiv,
        property,
        content,
      } as MetaPayload) as MetaPayload
    );

    hasMounted.current = true;
    return () => {
      hasMounted.current = false;
      dispatcher.removeFromQueue('meta', metaObject.current as MetaPayload);
    };
  }, []);
};
