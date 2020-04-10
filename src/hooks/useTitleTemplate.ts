import { useEffect, useRef } from 'react';
import dispatcher from '../dispatcher';

export const useTitleTemplate = (template: string) => {
  const hasMounted = useRef(false);
  const prevTitleTemplate = useRef<string | undefined>();

  useEffect(() => {
    if (hasMounted.current) {
      dispatcher._change(
        'titleTemplate',
        prevTitleTemplate.current as string,
        (prevTitleTemplate.current = template)
      );
    }
  }, [template]);

  useEffect(() => {
    hasMounted.current = true;
    dispatcher._addToQueue(
      'titleTemplate',
      (prevTitleTemplate.current = template)
    );
    return () => {
      hasMounted.current = false;
      dispatcher._removeFromQueue(
        'titleTemplate',
        prevTitleTemplate.current as string
      );
    };
  }, []);
};
