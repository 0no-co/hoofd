import dispatcher, { DispatcherContext } from './dispatcher';

export { createDispatcher } from './dispatcher';
export * from './hooks/useLang';
export * from './hooks/useLink';
export * from './hooks/useMeta';
export * from './hooks/useTitle';
export * from './hooks/useTitleTemplate';
export { useHead } from './hooks/useHead';
export * from './types';
export const toStatic = dispatcher.toStatic;
export const HoofdProvider = DispatcherContext.Provider;
