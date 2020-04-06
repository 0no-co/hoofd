import { useEffect, useRef } from 'react';
import dispatcher from '../dispatcher';

export const useTitle = (title: string) => {
  const hasMounted = useRef(false);
  const prevTitle = useRef<string | undefined>();

  useEffect(() => {
    if (hasMounted.current) {
      dispatcher._change(
        'title',
        prevTitle.current as string,
        (prevTitle.current = title)
      );
    }
  }, [title]);

  useEffect(() => {
    hasMounted.current = true;
    dispatcher._addToQueue('title', (prevTitle.current = title));
    return () => {
      hasMounted.current = false;
      dispatcher._removeFromQueue('title', prevTitle.current as string);
    };
  }, []);
};
