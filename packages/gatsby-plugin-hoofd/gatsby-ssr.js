import { createElement } from 'react';
import { toStatic } from 'hoofd';

export const onRenderBody = ({ setHeadComponents, setHtmlAttributes }) => {
  const { title, metas, lang, links, scripts } = toStatic();

  if (lang || amp) {
    setHtmlAttributes({ lang, amp });
  }

  setHeadComponents(
    [
      title && createElement('title', null, title),
      ...metas.map((meta) => createElement('meta', meta, null)),
      ...links.map((link) => createElement('link', link, null)),
      ...scripts.map(({ module, ...script }) => createElement('script', { ...script, type: module ? 'module' : undefined }, null)),
    ].filter(Boolean)
  );
};
