import { createElement } from 'react';
import { toStatic } from 'hoofd';

export const onRenderBody = ({ setHeadComponents, setHtmlAttributes }) => {
  const { title, metas, lang, links, amp, ampScript } = toStatic();

  if (lang || amp) {
    setHtmlAttributes({ lang, amp });
  }

  setHeadComponents(
    [
      amp && createElement('script', {
        async: true,
        src: ampScript,
        type: ampScript.endsWith('mjs') ? 'module' : undefined,
      }),
      title && createElement('title', null, title),
      ...metas.map((meta) => createElement('meta', meta, null)),
      ...links.map((link) => createElement('link', link, null)),
    ].filter(Boolean)
  );
};
