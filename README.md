# react-head

[![npm version](https://badgen.net/npm/v/react-head)](https://www.npmjs.com/package/react-head)
[![Bundle size](https://badgen.net/bundlephobia/minzip/react-head)](https://badgen.net/bundlephobia/minzip/react-head)
[![codecov](https://codecov.io/gh/JoviDeCroock/react-head/branch/master/graph/badge.svg)](https://codecov.io/gh/JoviDeCroock/react-head)

This project aims at providing a set of hooks to populate `<meta>`, ... for each page.

## Goals

Initially this will be `title` and `meta`.

- [x] React support
- [x] Add majority of types for meta and link.
- [x] Concurrent friendly
- [x] Preact support
- [x] Support `<link>`
- [ ] Stricter typings
- [ ] SSR support
- [x] Document the dispatcher
- [ ] Document the hooks
- [ ] Golf bytes

## Preact

If you need support for [Preact](https://preactjs.com/) you can import from `react-head/preact` instead.

## Hooks

This package exports `useTitle`, `useMeta`, `useLink` and `useLang`. These hooks
are used to control information conveyed by the `<head>` in an html document.

### useTitle

### useMeta

### useLink

### useLang

This hook accepts a string that will be used to set the `lang` property on the
base `<html>` tag.
