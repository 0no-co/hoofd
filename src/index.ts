import dispatcher from './dispatcher';

export * from './hooks/useLang';
export * from './hooks/useLink';
export * from './hooks/useMeta';
export * from './hooks/useTitle';
export * from './hooks/useTitleTemplate';
export * from './hooks/useHead';
export * from './types';
export const toStatic = dispatcher._static;
