import { useEffect, useRef } from 'react';

export const useTitle = (title: string) => {
  const hasMounted = useRef(false);
  const titleBeforeHook = useRef<string | undefined>();

  useEffect(() => {
    if (!hasMounted.current) titleBeforeHook.current = document.title;
    document.title = title;
    hasMounted.current = true;
    return () => {
      document.title = titleBeforeHook.current || '';
    };
  }, [title]);
};
