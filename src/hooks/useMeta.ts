import { useRef, useEffect } from 'react';
import { Name, HttpEquiv, CharSet, Property } from '../types';
import dispatcher, { MetaPayload, META } from '../dispatcher';
import { isServerSide } from '../utils';
import { extractKeyword } from './useHead';

export interface MetaOptions {
  name?: Name | string;
  httpEquiv?: HttpEquiv | string;
  charset?: CharSet;
  content?: string;
  property?: Property | string;
}

export const useMeta = (options: MetaOptions) => {
  const hasMounted = useRef(false);
  const keyword = useRef<string | undefined>();
  const metaObject = useRef<MetaPayload>({
    keyword: keyword.current = extractKeyword(options),
    name: options.name,
    charset: options.charset,
    'http-equiv': options.httpEquiv,
    property: options.property,
    content: options.content,
  } as MetaPayload);

  if (isServerSide && !hasMounted.current) {
    dispatcher._addToQueue(META, metaObject.current);
  }

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
    dispatcher._addToQueue(META, metaObject.current);
    hasMounted.current = true;

    return () => {
      hasMounted.current = false;
      dispatcher._removeFromQueue(META, metaObject.current as MetaPayload);
    };
  }, []);
};
