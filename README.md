# hooked-head

[![npm version](https://badgen.net/npm/v/hooked-head)](https://www.npmjs.com/package/hooked-head)
[![Bundle size](https://badgen.net/bundlephobia/minzip/hooked-head)](https://badgen.net/bundlephobia/minzip/hooked-head)
[![codecov](https://codecov.io/gh/JoviDeCroock/hooked-head/branch/master/graph/badge.svg)](https://codecov.io/gh/JoviDeCroock/hooked-head)

This project aims at providing a set of hooks to populate `<meta>`, ... for each page.

## Goals

Initially this will be `title` and `meta`.

- [x] React support
- [x] Add majority of types for meta and link.
- [x] Concurrent friendly
- [x] Preact support
- [x] Support `<link>`
- [x] Stricter typings
- [x] Document the hooks
- [x] Document the dispatcher
- [x] SSR support
- [ ] Golf bytes

## Preact

If you need support for [Preact](https://preactjs.com/) you can import from `hooked-head/preact` instead.

## Hooks

This package exports `useTitle`, `useMeta`, `useLink` and `useLang`. These hooks
are used to control information conveyed by the `<head>` in an html document.

### useTitle

This hook accepts a string that will be used to set the `document.title`, every time the
given string changes it will update the property.

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

## Dispatcher

It can be interesting to give this a read, in the code itself.
