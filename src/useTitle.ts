import { useEffect, useRef } from 'react';
import { addToQueue, removeFromQueue, change } from './dispatcher';

export const useTitle = (title: string) => {
  const hasMounted = useRef(false);
  const index = useRef<number | undefined>();

  useEffect(() => {
    if (hasMounted.current) {
      change('title', index.current as number, title);
    }
  }, [title]);

  useEffect(() => {
    hasMounted.current = true;
    index.current = addToQueue('title', title);
    return () => {
      hasMounted.current = false;
      removeFromQueue('title', index.current as number);
    };
  }, []);
};
