# CHANGELOG

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
