import { createContext } from 'react';
import { LinkOptions } from '../hooks/useLink';
import { ScriptOptions } from '../hooks/useScript';
import { Name, CharSet, HttpEquiv, Property } from '../types';
import { isServerSide } from '../utils';

export const META = 'M';
export const TITLE = 'T';
export const LINK = 'L';
export const TEMPLATE = 'P';
export const SCRIPT = 'S';

type HeadType = 'T' | 'P' | 'M' | 'L' | 'S';
type MetaKeyword = 'name' | 'charset' | 'http-equiv' | 'property';
export interface MetaPayload {
  keyword: MetaKeyword;
  name: Name | string;
  charset: CharSet;
  'http-equiv': HttpEquiv | string;
  property: Property | string;
  content: string;
}

const applyTitleTemplate = (title: string, template?: string) =>
  template ? template.replace(/%s/g, title || '') : title;

const changeOrCreateMetaTag = (meta: MetaPayload) => {
  const result = document.head.querySelectorAll(
    meta.charset
      ? `meta[${meta.keyword}]`
      : `meta[${meta.keyword}="${meta[meta.keyword]}"]`
  );

  if (result[0]) {
    if (meta.charset) {
      result[0].setAttribute(meta.keyword, meta.charset);
    } else {
      result[0].setAttribute('content', meta.content as string);
    }
  } else {
    const metaTag = document.createElement('meta');
    if (meta.charset) {
      metaTag.setAttribute(meta.keyword, meta.charset);
    } else {
      metaTag.setAttribute(meta.keyword, meta[meta.keyword] as string);
      metaTag.setAttribute('content', meta.content as string);
    }
    document.head.appendChild(metaTag);
  }
};

/**
 * This dispatcher orchestrates the title and meta updates/creation/deletion.
 *
 * This is needed because of the order of execution in hooks
 *
 * <App> --> useTitle('x')
 *  <Child /> --> useTitle('y')
 *
 * Will display 'x' due to the effects resolving bottom-up, instead we schedule
 * both meta and titles in batches. This way we can display 'y' and keep 'x' around
 * as a fallback if <Child /> would unmount it will update to 'x'.
 *
 * When this batch is processed we only take one of each kind of meta and one title.
 *
 * Due to the batching with "currentXIndex" we also account for the scenario where Child
 * would get switched out for Child2, this is a new batch and will be put in front of the
 * queue.
 */
export const createDispatcher = () => {
  let lang: string;
  let linkQueue: any[] = [];
  let scriptQueue: any[] = [];
  let titleQueue: string[] = [];
  let titleTemplateQueue: string[] = [];
  let metaQueue: MetaPayload[] = [];
  let currentTitleIndex = 0;
  let currentTitleTemplateIndex = 0;
  let currentMetaIndex = 0;

  // A process can be debounced by one frame timing,
  // since microticks could potentially interfere with how
  // React works.
  const processQueue = (() => {
    let timeout: any;

    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        const visited = new Set();

        document.title = applyTitleTemplate(
          titleQueue[0],
          titleTemplateQueue[0]
        );

        metaQueue.forEach(meta => {
          if (!visited.has(meta.charset ? meta.keyword : meta[meta.keyword])) {
            visited.add(meta.charset ? meta.keyword : meta[meta.keyword]);
            changeOrCreateMetaTag(meta);
          }
        });

        currentTitleIndex = currentTitleTemplateIndex = currentMetaIndex = 0;
      }, 1000 / 60 /* One second divided by the max browser fps. */);
    };
  })();

  return {
    _setLang: (l: string) => {
      lang = l;
    },
    _addToQueue: (type: HeadType, payload: MetaPayload | string): void => {
      if (!isServerSide) processQueue();

      if (type === SCRIPT) {
        scriptQueue.push(payload);
      } else if (type === TITLE) {
        titleQueue.splice(currentTitleIndex++, 0, payload as string);
      } else if (type === TEMPLATE) {
        titleTemplateQueue.splice(
          currentTitleTemplateIndex++,
          0,
          payload as string
        );
      } else if (type === META) {
        metaQueue.splice(currentMetaIndex++, 0, payload as MetaPayload);
      } else {
        linkQueue.push(payload);
      }
    },
    _removeFromQueue: (type: HeadType, payload: MetaPayload | string) => {
      if (type === TITLE || type === TEMPLATE) {
        const queue = type === TEMPLATE ? titleTemplateQueue : titleQueue;
        const index = queue.indexOf(payload as string);
        queue.splice(index, 1);

        let currentIndex =
          type === TITLE ? currentTitleIndex : currentTitleTemplateIndex;
        if (currentIndex === index) {
          currentIndex--;
        }

        if (index === 0)
          document.title = applyTitleTemplate(
            titleQueue[0] || '',
            titleTemplateQueue[0]
          );
      } else {
        const index = metaQueue.indexOf(payload as MetaPayload);

        const oldMeta = metaQueue[index];

        if (oldMeta) {
          metaQueue.splice(index, 1);
          const newMeta = metaQueue.find(
            m =>
              m.keyword === oldMeta.keyword &&
              (m.charset || m[m.keyword] === oldMeta[m.keyword])
          );

          if (currentMetaIndex === index) {
            currentMetaIndex--;
          }

          if (newMeta) {
            changeOrCreateMetaTag(newMeta);
          } else {
            const result = document.head.querySelectorAll(
              oldMeta.charset
                ? `meta[${oldMeta.keyword}]`
                : `meta[${oldMeta.keyword}="${oldMeta[oldMeta.keyword]}"]`
            );

            if (result[0]) {
              document.head.removeChild(result[0]);
            }
          }
        }
      }
    },
    _change: (
      type: HeadType,
      prevPayload: string | MetaPayload,
      payload: any
    ) => {
      if (type === TITLE || type === TEMPLATE) {
        const queue = type === TEMPLATE ? titleTemplateQueue : titleQueue;
        queue[queue.indexOf(prevPayload as string)] = payload;

        if (queue.indexOf(payload) === 0) {
          document.title = applyTitleTemplate(
            queue[queue.indexOf(payload)],
            titleTemplateQueue[0]
          );
        }
      } else {
        changeOrCreateMetaTag(
          (metaQueue[metaQueue.indexOf(prevPayload as MetaPayload)] = payload)
        );
      }
    },
    _reset:
      process.env.NODE_ENV === 'test'
        ? // istanbul ignore next
          () => {
            titleQueue = [];
            metaQueue = [];
            linkQueue = [];
            titleTemplateQueue = [];
            currentMetaIndex = 0;
            currentTitleIndex = 0;
            currentTitleTemplateIndex = 0;
          }
        : // istanbul ignore next
          undefined,
    toStatic: (): StaticPayload => {
      const ESCAPED_CHARS = /['"&<>]/;

      function escape(str: string) {
        if (str.length === 0 || ESCAPED_CHARS.test(str) === false) return str;

        let last = 0,
          i = 0,
          out = '',
          ch = '';

        for (; i < str.length; i++) {
          switch (str.charCodeAt(i)) {
            case 34:
              ch = '&quot;';
              break;
            case 38:
              ch = '&amp;';
              break;
            case 39:
              ch = '&#x27;';
              break;
            case 60:
              ch = '&lt;';
              break;
            case 62:
              ch = '&gt;';
              break;
            default:
              continue;
          }

          if (i !== last) out += str.slice(last, i);
          out += ch;
          last = i + 1;
        }
        if (i !== last) out += str.slice(last, i);
        return out;
      }
      //  Will process the two arrays, taking the first title in the array and returning <title>{string}</title>
      //  Then do a similar for the meta's. (will also need to add links, and add a linkQueue). Note that both queues
      //  will need a reset to prevent memory leaks.
      const title = applyTitleTemplate(
        titleQueue[titleQueue.length - 1],
        titleTemplateQueue[titleTemplateQueue.length - 1]
      );

      const visited = new Set();
      const links = [...linkQueue];
      const scripts = [...scriptQueue];
      metaQueue.reverse();
      // @ts-ignore
      const metas = [...metaQueue].filter(meta => {
        if (!visited.has(meta.charset ? meta.keyword : meta[meta.keyword])) {
          visited.add(meta.charset ? meta.keyword : meta[meta.keyword]);
          return true;
        }
      });

      titleQueue = [];
      titleTemplateQueue = [];
      metaQueue = [];
      linkQueue = [];
      scriptQueue = [];
      currentTitleIndex = currentTitleTemplateIndex = currentMetaIndex = 0;

      return {
        lang,
        title,
        links: links.map(x => ({ ...x, ['data-hoofd']: '1' })),
        scripts,
        metas: metas.map(meta =>
          meta.keyword === 'charset'
            ? {
                charset: meta[meta.keyword],
              }
            : {
                [meta.keyword]: meta[meta.keyword],
                content: escape(meta.content),
              }
        ),
      };
    },
  };
};

export type StaticPayload = {
  lang?: string;
  title?: string;
  links?: Array<LinkOptions>;
  scripts?: Array<ScriptOptions>;
  metas?: Array<
    { charset: string } | { [key: string]: string; content: string }
  >;
};

const defaultDispatcher = createDispatcher();

export default defaultDispatcher;
export const DispatcherContext = createContext(defaultDispatcher);
