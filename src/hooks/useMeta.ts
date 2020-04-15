import { useRef, useEffect } from 'react';
import { Name, HttpEquiv, CharSet, Property } from '../types';
import dispatcher, { MetaPayload, META } from '../dispatcher';

export interface MetaOptions {
  name?: Name;
  httpEquiv?: HttpEquiv;
  charset?: CharSet;
  content?: string;
  property?: Property;
}

export const useMeta = (options: MetaOptions) => {
  const hasMounted = useRef(false);
  const keyword = useRef<string | undefined>();
  const metaObject = useRef<MetaPayload>();

  useEffect(() => {
    if (hasMounted.current) {
      dispatcher._change(
        META,
        metaObject.current as MetaPayload,
        (metaObject.current = {
          keyword: keyword.current,
          name: options.name,
          charset: options.charset,
          'http-equiv': options.httpEquiv,
          property: options.property,
          content: options.content,
        } as MetaPayload) as MetaPayload
      );
    }
  }, [options.content]);

  useEffect(() => {
    dispatcher._addToQueue(
      META,
      (metaObject.current = {
        keyword: keyword.current = options.charset
          ? 'charset'
          : options.name
          ? 'name'
          : options.property
          ? 'property'
          : 'http-equiv',
        name: options.name,
        charset: options.charset,
        'http-equiv': options.httpEquiv,
        property: options.property,
        content: options.content,
      } as MetaPayload) as MetaPayload
    );

    hasMounted.current = true;
    return () => {
      hasMounted.current = false;
      dispatcher._removeFromQueue(META, metaObject.current as MetaPayload);
    };
  }, []);
};
