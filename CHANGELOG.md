# CHANGELOG

## 1.7.0

### Minor Changes

- Escape single quotes via x27 instead of 39
  Submitted by [@tazsingh](https://github.com/tazsingh) (See [#88](https://github.com/0no-co/hoofd/pull/88))

## 1.6.0

### Minor Changes

- Make `useLink` concurrent safe by only re-using `link` tags carrying `data-hoofd="1"`, these would come from hydration as hoofd will add these to the static export
  Submitted by [@JoviDeCroock](https://github.com/JoviDeCroock) (See [#79](https://github.com/0no-co/hoofd/pull/79))

## 1.5.4

- Escape the `content` property in meta tags [#76](https://github.com/0no-co/hoofd/pull/78)

## 1.5.3

- Guard against no meta tags being returned in React Concurrent Mode [#76](https://github.com/0no-co/hoofd/pull/76)

## 1.4.1

- Add `dns-prefetch` to rel type [#62](https://github.com/JoviDeCroock/hoofd/pull/62)

## 1.4.0

- Add specialized types for `hoofd/preact` [#54](https://github.com/JoviDeCroock/hoofd/pull/54)

## 1.3.0

- Add support for `id` and `text` in `useScript` [#44](https://github.com/JoviDeCroock/hoofd/pull/44)

## 1.2.2

- fix Preact [#40](https://github.com/JoviDeCroock/hoofd/pull/40)

## 1.2.1

- Adjust useScript to use context API [#37](https://github.com/JoviDeCroock/hoofd/pull/37)

## 1.2.0

- Support context API [#35](https://github.com/JoviDeCroock/hoofd/pull/35)
- Add `useScript` [#31](https://github.com/JoviDeCroock/hoofd/pull/31)

## 1.1.0

- `useTitleTemplate` will fallback to removing the `%s` rather than inserting it when no title has been provided [#33](https://github.com/JoviDeCroock/hoofd/pull/33)

## 1.0.2

- fix: `useTitle` now correctly detects the `template` argument changing [#27](https://github.com/JoviDeCroock/hoofd/commit/c6493ff5f4a58da178066d742b0c974e5eda0839)
- fix: Preact types are now picked up correctly

## 1.0.1

- Detect already injected links correctly and reuse them when possible.

## 1.0.0

- add `useHead`

## 0.4.1

- Make types less strict
- Add `type` to `linkOptions` [#11](https://github.com/JoviDeCroock/hoofd/pull/11)

## 0.4.0

**BREAKING**

- Renamed `toString` to `toStatic`
- Stopped returning a stringified `head` and moved to `{ title, lang, metas, links }` [Read more](./README.md#SSR)

## 0.3.0

- Add `useTitleTemplate` hook

## 0.2.1

- Bundle size savings -100 bytes

## 0.2.0

- SSR Support

## 0.1.0

- Initial release
