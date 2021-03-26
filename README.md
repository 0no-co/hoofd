# Hoofd

[![npm version](https://badgen.net/npm/v/hoofd)](https://www.npmjs.com/package/hoofd)
[![Bundle size](https://badgen.net/bundlephobia/minzip/hoofd)](https://badgen.net/bundlephobia/minzip/hoofd)
[![codecov](https://codecov.io/gh/JoviDeCroock/hoofd/branch/main/graph/badge.svg)](https://codecov.io/gh/JoviDeCroock/hoofd)

This project aims at providing a set of hooks to populate `<meta>`, ... for each page. With crawlers now supporting
client-side alterations it's important to support a fallback model for our `<head>` tags. The dispatcher located in this
library will always make a queue of how we should fallback, ... This way we'll always have some information to give to a
visiting crawler.

```sh
npm i --save hoofd
## OR
yarn add hoofd
```

```jsx
import { useMeta, useLink, useLang, useTitle, useTitleTemplate } from 'hoofd';

const App = () => {
  // Will set <html lang="en">
  useLang('en');

  // Will set title to "Welcome to hoofd | 💭"
  useTitleTemplate('%s | 💭');
  useTitle('Welcome to hoofd');

  useMeta({ name: 'author', content: 'Jovi De Croock' });
  useLink({ rel: 'me', href: 'https://jovidecroock.com' });

  return <p>hoofd</p>;
};
```

Or you can choose to

```jsx
import { useHead, useLink } from 'hoofd';

const App = () => {
  useHead({
    title: 'Welcome to hoofd | 💭',
    language: 'en',
    metas: [{ name: 'author', content: 'Jovi De Croock' }],
  });
  useLink({ rel: 'me', href: 'https://jovidecroock.com' });

  return <p>hoofd</p>;
};
```

## Preact

If you need support for [Preact](https://preactjs.com/) you can import from `hoofd/preact` instead.

## Gatsby

There's a plugin that hooks in with [Gatsby](https://www.npmjs.com/package/gatsby-plugin-hoofd) and that
will fill in the `meta`, ... in your build process.

## Hooks

This package exports `useTitle`, `useTitleTemplate`, `useMeta`, `useLink` and `useLang`. These hooks
are used to control information conveyed by the `<head>` in an html document.

### useTitle

This hook accepts a string that will be used to set the `document.title`, every time the
given string changes it will update the property.

### useTitleTemplate

This hook accepts a string, which will be used to format the result of `useTitle` whenever
it updates. Similar to react-helmet, the placeholder `%s` will be replaced with the `title`.

### useMeta

This hook accepts the regular `<meta>` properties, being `name`, `property`, `httpEquiv`,
`charset` and `content`.

These have to be passed as an object and will update when `content` changes.

### useLink

This hook accepts the regular `<link>` properties, being `rel`, `as`, `media`,
`href`, `sizes` and `crossorigin`.

This will update within the same `useLink` but will never go outside

### useLang

This hook accepts a string that will be used to set the `lang` property on the
base `<html>` tag. Every time this string gets updated this will be reflected in the dom.

### useAmp

You can call `useAmp` to inject `html.amp = true` and the `ampScript`, depending on the first
attribute the hook will decide whether or not you want a module, when passing `true` to the first
argument the script will be injected as `script type module`.

## SSR

We expose a method called `toStatic` that will return the following properties:

- title, the current `title` dictated by the deepest `useTitleTemplate` and `useTitle` combination
- lang, the current `lang` dictated by the deepest `useLang`
- metas, an array of unique metas by `keyword` (property, ...)
- links, the links aggregated from the render pass.

The reason we pass these as properties is to better support `gatsby`, ...

If you need to stringify these you can use the following algo:

```js
const stringify = (title, metas, links, ampScript) => {
  const visited = new Set();
  return `
    <title>${title}</title>

    ${
      ampScript
        ? `<script src={ampScript} async ${
            ampScript.endsWith('mjs') ? 'type="module"' : ''
          } />`
        : ''
    }

    ${metaQueue.reduce((acc, meta) => {
      if (!visited.has(meta.charset ? meta.keyword : meta[meta.keyword])) {
        visited.add(meta.charset ? meta.keyword : meta[meta.keyword]);
        return `${acc}<meta ${meta.keyword}="${meta[meta.keyword]}"${
          meta.charset ? '' : ` content="${meta.content}"`
        }>`;
      }
      return acc;
    }, '')}

    ${linkQueue.reduce((acc, link) => {
      return `${acc}<link${Object.keys(link).reduce(
        (properties, key) => `${properties} ${key}="${link[key]}"`,
        ''
      )}>`;
    }, '')}
  `;
};
```

```js
import { toStatic } from 'hoofd';

const reactStuff = renderToString();
const { metas, links, title, lang, amp, ampScript } = toStatic();
const stringified = stringify(title, metas, links, ampScript);

const html = `
  <!doctype html>
    <html ${lang ? `lang="${lang}"` : ''} ${amp ? `amp` : ''}>
      <head>
        ${stringified}
      </head>
      <body>
        <div id="content">
          ${reactStuff}
        </div>
      </body>
  </html>
`;
```

### Context API

By default this package relies on a statically-initialized context provider to accumulate and
dispatch `<head>` and `<meta>` changes. In cases where you may want to control the Dispatcher
instance used, this module exports a `HoofdProvider` context provider and `createDispatcher`
function for creating valid context instances.

```jsx
import { createDispatcher, HoofdProvider } from 'hoofd';

function ssr(App) {
  const dispatcher = createDispatcher();
  const wrappedApp = (
    <HoofdProvider value={dispatcher}>
      <App />
    </HoofdProvider>
  );
  const markup = renderToString(wrappedApp);
  const { metas, links, title, lang, amp, ampScript } = dispatcher.toStatic();

  // See example above for potential method to consume these static results.
}
```

## Goals

- [x] React support
- [x] Add majority of types for meta and link.
- [x] Concurrent friendly
- [x] Preact support
- [x] Support `<link>`
- [x] Stricter typings
- [x] Document the hooks
- [x] Document the dispatcher
- [x] SSR support
- [x] Consider moving from `doc.title = x` to inserting `<title>x</title>`
- [x] Golf bytes
- [ ] improve typings, there are probably missing possibilities in `types.ts`
