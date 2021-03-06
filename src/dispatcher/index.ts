import { Name, CharSet, HttpEquiv, Property } from '../types';
import { isServerSide } from '../utils';

export const ampScriptSrc = 'https://cdn.ampproject.org/v0';

export const META = 'M';
export const TITLE = 'T';
export const LINK = 'L';
export const TEMPLATE = 'P';

type HeadType = 'T' | 'P' | 'M' | 'L';
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
  template ? template.replace(/%s/g, title  || '') : title;

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
const createDispatcher = () => {
  let lang: string;
  let amp: 'module' | 'nomodule' | undefined;
  let linkQueue: any[] = [];
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

        metaQueue.forEach((meta) => {
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

      if (type === TITLE) {
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
    _setAmp: (isModule: boolean) => {
      amp = isModule ? 'module' : 'nomodule';
    },
    _removeFromQueue: (type: HeadType, payload: MetaPayload | string) => {
      if (type === TITLE || type === TEMPLATE) {
        const queue = type === TEMPLATE ? titleTemplateQueue : titleQueue;
        const index = queue.indexOf(payload as string);
        queue.splice(index, 1);

        if (index === 0)
          document.title = applyTitleTemplate(
            titleQueue[0] || '',
            titleTemplateQueue[0]
          );
      } else {
        const oldMeta = metaQueue[metaQueue.indexOf(payload as MetaPayload)];

        if (oldMeta) {
          metaQueue.splice(metaQueue.indexOf(payload as MetaPayload), 1);
          const newMeta = metaQueue.find(
            (m) =>
              m.keyword === oldMeta.keyword &&
              (m.charset || m[m.keyword] === oldMeta[m.keyword])
          );

          if (newMeta) {
            changeOrCreateMetaTag(newMeta);
          } else {
            const result = document.head.querySelectorAll(
              oldMeta.charset
                ? `meta[${oldMeta.keyword}]`
                : `meta[${oldMeta.keyword}="${oldMeta[oldMeta.keyword]}"]`
            );

            document.head.removeChild(result[0]);
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
          }
        : // istanbul ignore next
          undefined,
    _static: () => {
      //  Will process the two arrays, taking the first title in the array and returning <title>{string}</title>
      //  Then do a similar for the meta's. (will also need to add links, and add a linkQueue). Note that both queues
      //  will need a reset to prevent memory leaks.
      const title = applyTitleTemplate(
        titleQueue[titleQueue.length - 1],
        titleTemplateQueue[titleTemplateQueue.length - 1]
      );

      const visited = new Set();
      const links = [...linkQueue];
      metaQueue.reverse();
      // @ts-ignore
      const metas = [...metaQueue].filter((meta) => {
        if (!visited.has(meta.charset ? meta.keyword : meta[meta.keyword])) {
          visited.add(meta.charset ? meta.keyword : meta[meta.keyword]);
          return true;
        }
      });

      titleQueue = [];
      titleTemplateQueue = [];
      metaQueue = [];
      linkQueue = [];
      currentTitleIndex = currentTitleTemplateIndex = currentMetaIndex = 0;

      let ampScript;
      if (amp && amp === 'module') {
        ampScript = ampScriptSrc + '.mjs';
      } else if (amp) {
        ampScript = ampScriptSrc + '.js';
      }

      return {
        amp,
        ampScript,
        lang,
        title,
        links,
        metas: metas.map((meta) =>
          meta.keyword === 'charset'
            ? {
                charset: meta[meta.keyword],
              }
            : {
                [meta.keyword]: meta[meta.keyword],
                content: meta.content,
              }
        ),
      };
    },
  };
};

export default createDispatcher();
