import React, { createElement } from 'react';
import { toStatic } from 'hoofd';

export const onRenderBody = ({ setHeadComponents, setHtmlAttributes }) => {
  const { title, metas, lang, links, scripts } = toStatic();

  if (lang) {
    setHtmlAttributes({ lang });
  }

  setHeadComponents(
    [
      title && createElement('title', null, title),
      ...metas.map((meta) => createElement('meta', meta, null)),
      ...links.map((link) => createElement('link', link, null)),
      ...scripts.map(({ module, text, type, ...script }) => (
        <script
          type={module ? 'module' : type}
          key={script.id || script.src}
          {...script}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )),
    ].filter(Boolean)
  );
};
