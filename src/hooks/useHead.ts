import { useContext, useEffect, useMemo, useRef } from 'react';
import { DispatcherContext, META, MetaPayload, TITLE } from '../dispatcher';
import { isServerSide } from '../utils';
import { MetaOptions } from './useMeta';

export interface HeadObject {
  title?: string;
  language?: string;
  metas?: MetaOptions[];
}

export function extractKeyword(meta: MetaOptions) {
  return meta.charset
    ? 'charset'
    : meta.name
    ? 'name'
    : meta.property
    ? 'property'
    : 'http-equiv';
}

export const useHead = ({ title, metas, language }: HeadObject) => {
  const dispatcher = useContext(DispatcherContext);
  const hasMounted = useRef(false);
  const prevTitle = useRef<{ payload: string } | undefined>();
  const prevMetas = useRef<MetaPayload[]>();
  const addedMetas = useRef<MetaPayload[]>();

  const memoizedMetas = useMemo(() => {
    const calculatedMetas: MetaPayload[] = (metas || []).map(meta => {
      const keyword = extractKeyword(meta);

      if (prevMetas.current) {
        const found = prevMetas.current.find(
          x =>
            x.keyword === keyword &&
            x.name === meta.name &&
            x.charset === meta.charset &&
            x['http-equiv'] === meta.httpEquiv &&
            x.property === meta.property &&
            x.content === meta.content
        );

        if (found) return found;
      }

      return {
        keyword,
        name: meta.name!,
        charset: meta.charset!,
        'http-equiv': meta.httpEquiv!,
        property: meta.property!,
        content: meta.content!,
      };
    });

    return calculatedMetas;
  }, [metas]);

  if (isServerSide && !hasMounted.current) {
    if (title) dispatcher._addToQueue(TITLE, { payload: title });
    if (language) dispatcher._setLang(language);

    memoizedMetas.forEach(meta => {
      dispatcher._addToQueue(META, meta);
    });
  }

  useEffect(() => {
    if (prevMetas.current) {
      const previousMetas = [...prevMetas.current];
      const added: MetaPayload[] = [];

      memoizedMetas.forEach(meta => {
        added.push(meta);
        if (previousMetas.includes(meta)) {
          previousMetas.splice(previousMetas.indexOf(meta), 1);
        } else {
          const previousIteration = previousMetas.find(
            x =>
              x.keyword === meta.keyword &&
              meta[meta.keyword] === x[meta.keyword]
          );
          if (previousIteration) {
            dispatcher._change(META, previousIteration, meta);
          } else {
            dispatcher._addToQueue(META, meta);
          }
        }
      });

      if (previousMetas.length) {
        previousMetas.forEach(meta => {
          dispatcher._removeFromQueue(META, meta);
        });
      }

      addedMetas.current = added;
      prevMetas.current = memoizedMetas;
    }
  }, [memoizedMetas]);

  useEffect(() => {
    memoizedMetas.forEach(meta => {
      dispatcher._addToQueue(META, meta);
    });

    prevMetas.current = addedMetas.current = memoizedMetas;

    return () => {
      (addedMetas.current || []).forEach(meta => {
        dispatcher._removeFromQueue(META, meta);
      });
    };
  }, []);

  useEffect(() => {
    if (hasMounted.current && title) {
      if (prevTitle.current != null) {
        dispatcher._change(
          TITLE,
          prevTitle.current,
          (prevTitle.current = { payload: title })
        );
      } else {
        dispatcher._addToQueue(TITLE, (prevTitle.current = { payload: title }));
      }
    } else if (hasMounted.current && prevTitle.current) {
      dispatcher._removeFromQueue(TITLE, prevTitle.current);
      prevTitle.current = undefined;
    }
  }, [title]);

  useEffect(() => {
    hasMounted.current = true;
    dispatcher._addToQueue(TITLE, (prevTitle.current = { payload: title! }));

    return () => {
      hasMounted.current = false;
      if (prevTitle.current != null)
        dispatcher._removeFromQueue(TITLE, prevTitle.current);
    };
  }, []);

  useEffect(() => {
    if (language)
      document.getElementsByTagName('html')[0].setAttribute('lang', language);
  }, [language]);
};
