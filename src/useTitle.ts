import { useEffect, useRef, useMemo } from 'react';

export const useTitle = (title: string) => {
  const hasMounted = useRef(false);
  const titleBeforeHook = useRef<string | undefined>();

  useMemo(() => {
    if (!hasMounted.current) titleBeforeHook.current = document.title;
    document.title = title;
  }, [title]);

  useEffect(() => {
    hasMounted.current = true;
    return () => {
      document.title = titleBeforeHook.current || '';
    };
  }, []);
};
