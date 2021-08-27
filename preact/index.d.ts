/// <reference types="preact" />

export { createDispatcher } from '../dist/dispatcher';
export * from '../dist/hooks/useLang';
export * from '../dist/hooks/useLink';
export * from '../dist/hooks/useScript';
export * from '../dist/hooks/useMeta';
export * from '../dist/hooks/useTitle';
export * from '../dist/hooks/useTitleTemplate';
export { useHead } from '../dist/hooks/useHead';
export * from '../dist/types';

export declare const toStatic: () => {
  lang: string;
  title: string;
  links: any[];
  scripts: any[];
  metas: (
    | {
        charset: 'utf-8';
        content?: undefined;
      }
    | {
        [x: string]: string;
        content: string;
        charset?: undefined;
      }
  )[];
};

export declare const HoofdProvider: import('preact').Provider<{
  _setLang: (l: string) => void;
  _addToQueue: (
    type: 'T' | 'P' | 'M' | 'L' | 'S',
    payload: string | import('./dispatcher').MetaPayload
  ) => void;
  _removeFromQueue: (
    type: 'T' | 'P' | 'M' | 'L' | 'S',
    payload: string | import('./dispatcher').MetaPayload
  ) => void;
  _change: (
    type: 'T' | 'P' | 'M' | 'L' | 'S',
    prevPayload: string | import('./dispatcher').MetaPayload,
    payload: any
  ) => void;
  _reset: (() => void) | undefined;
  toStatic: () => {
    lang: string;
    title: string;
    links: any[];
    scripts: any[];
    metas: (
      | {
          charset: 'utf-8';
          content?: undefined;
        }
      | {
          [x: string]: string;
          content: string;
          charset?: undefined;
        }
    )[];
  };
}>;
