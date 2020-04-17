import { createElement } from 'react';
import { toStatic } from 'hooked-head';

export const onRenderBody = ({ setHeadComponents, setHtmlAttributes }) => {
  const { title, metas, lang, links } = toStatic();

  if (lang) {
    setHtmlAttributes({ lang });
  }

  setHeadComponents(
    [
      title && createElement('title', null, title),
      ...metas.map((meta) => createElement('meta', meta, null)),
      ...links.map((link) => createElement('link', link, null)),
    ].filter(Boolean)
  );
};
