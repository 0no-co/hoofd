/// <reference types="preact" />
import { Name, CharSet, HttpEquiv, Property } from '../dist/types';
export declare const META = 'M';
export declare const TITLE = 'T';
export declare const LINK = 'L';
export declare const TEMPLATE = 'P';
export declare const SCRIPT = 'S';
declare type HeadType = 'T' | 'P' | 'M' | 'L' | 'S';
declare type MetaKeyword = 'name' | 'charset' | 'http-equiv' | 'property';
export interface MetaPayload {
  keyword: MetaKeyword;
  name: Name | string;
  charset: CharSet;
  'http-equiv': HttpEquiv | string;
  property: Property | string;
  content: string;
}
export declare const createDispatcher: () => {
  _setLang: (l: string) => void;
  _addToQueue: (type: HeadType, payload: MetaPayload | string) => void;
  _removeFromQueue: (type: HeadType, payload: MetaPayload | string) => void;
  _change: (
    type: HeadType,
    prevPayload: string | MetaPayload,
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
};
declare const defaultDispatcher: {
  _setLang: (l: string) => void;
  _addToQueue: (type: HeadType, payload: MetaPayload | string) => void;
  _removeFromQueue: (type: HeadType, payload: MetaPayload | string) => void;
  _change: (
    type: HeadType,
    prevPayload: string | MetaPayload,
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
};
export default defaultDispatcher;
export declare const DispatcherContext: import('preact').Context<{
  _setLang: (l: string) => void;
  _addToQueue: (type: HeadType, payload: MetaPayload | string) => void;
  _removeFromQueue: (type: HeadType, payload: MetaPayload | string) => void;
  _change: (
    type: HeadType,
    prevPayload: string | MetaPayload,
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
