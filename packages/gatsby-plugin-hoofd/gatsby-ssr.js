import { createElement } from 'react';
import { toStatic } from 'hoofd';

export const onRenderBody = ({ setHeadComponents, setHtmlAttributes }) => {
  const { title, metas, lang, links, amp } = toStatic();

  if (lang) {
    setHtmlAttributes({ lang, amp });
  }

  setHeadComponents(
    [
      amp && createElement('script', {
        async: true,
        src: 'https://cdn.ampproject.org/v0.js'
      }),
      title && createElement('title', null, title),
      ...metas.map((meta) => createElement('meta', meta, null)),
      ...links.map((link) => createElement('link', link, null)),
    ].filter(Boolean)
  );
};
