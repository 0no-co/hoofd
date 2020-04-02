import { useEffect, useRef } from 'react';

export const useTitle = (title: string) => {
  const prevTitle = useRef<string | undefined>(undefined);
  const hasMounted = useRef(false);
  const titleBeforeHook = useRef<string | undefined>();

  if (!hasMounted.current) titleBeforeHook.current = document.title;

  if (prevTitle.current !== title) {
    document.title = title;
    prevTitle.current = title;
  }

  useEffect(() => {
    hasMounted.current = true;
    return () => {
      document.title = titleBeforeHook.current || '';
    };
  }, []);
};
