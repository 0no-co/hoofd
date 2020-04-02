import { useEffect, useRef } from 'react';
import { useMemo } from 'react';

export const useTitle = (title: string) => {
  const hasMounted = useRef(false);
  const titleBeforeHook = useRef<string | undefined>();

  useMemo(() => {
    // TODO: should we make a title node for this?
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
