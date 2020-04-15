import { useEffect, useRef } from 'react';
import dispatcher, { TEMPLATE, TITLE } from '../dispatcher';
import { isServerSide } from '../utils';

export const useTitle = (title: string, template?: boolean) => {
  const hasMounted = useRef(false);
  const prevTitle = useRef<string | undefined>();

  if (isServerSide && !hasMounted.current) {
    dispatcher._addToQueue(template ? TEMPLATE : TITLE, title);
    hasMounted.current = true;
  }

  useEffect(() => {
    if (hasMounted.current) {
      dispatcher._change(
        template ? TEMPLATE : TITLE,
        prevTitle.current as string,
        (prevTitle.current = title)
      );
    }
  }, [title]);

  useEffect(() => {
    hasMounted.current = true;
    dispatcher._addToQueue(
      template ? TEMPLATE : TITLE,
      (prevTitle.current = title)
    );

    return () => {
      hasMounted.current = false;
      dispatcher._removeFromQueue(
        template ? TEMPLATE : TITLE,
        prevTitle.current as string
      );
    };
  }, []);
};
