# react-head

This project aims at providing a set of hooks to populate `<meta>`, ... for each page.

## Goals

Initially this will be `title` and `meta`.

- [x] React support
- [x] Add majority of types for meta and link.
- [x] Concurrent friendly ([dispatcher](#dispatcher) of some sorts)
- [x] Preact support
- [ ] Support `<link>`
- [ ] Support `<script>`
- [ ] SSR support

## Dispatcher

When we enter concurrent land we can't synchronously do these things, at this point we aren't
concurrent friendly. Probably not React-friendly in general, if we would schedule this in `useEffect`
we can't guarantee deterministic prioritisation.

```jsx
<App> // useTitle('hi') 1.schedules 4.executes
  <Page /> // useTitle('world') 2.schedules 3.executes
```

This means that `<App />` will be the last effect to execute and the title will be "hi" instead of
"world".

One potential solution I can see is that we have a `DispatcherProvider` containing a `tags` and `schedule`
we should process these tags (with a `defer` call) where we should guarantee that the last is called of one type
is called.

This means that `[title, title]` only the first one should be applied, so that when that hook would unmount we could fallback
to the one still in the array. The issue here is to consistently order these correctly since knowing `depth` isn't really a thing
in React. This would also need to happen for `meta`, this could get quite complicated for the case of hooks.

1. Queue in React-tree by doing `queue.push(payload)` in a `useEffect`.
2. Schedule a `processQueue` in the first step.
3. Process the `titleQueue` by doing a `.reverse()` and taking the first one.
4. Process the `metaQueue` by walking it and holding a `Set` of visited properties (also reversed).
5. When something is visited don't add it again.
6. When a `title` unmounts use the next one in the queue.
7. When a `meta` unmounts find the next one in the queue.

- Found? Update the property
- None? Remove the tag
