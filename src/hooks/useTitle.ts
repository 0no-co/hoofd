import { useContext, useEffect, useRef } from 'react';
import {
  DispatcherContext,
  TEMPLATE,
  TITLE,
  TitlePayload,
} from '../dispatcher';
import { isServerSide } from '../utils';

export const useTitle = (title: string, template?: boolean) => {
  const dispatcher = useContext(DispatcherContext);
  const hasMounted = useRef(false);
  const prevTitle = useRef<{ payload: string } | undefined>();

  if (isServerSide && !hasMounted.current) {
    dispatcher._addToQueue(template ? TEMPLATE : TITLE, { payload: title });
  }

  useEffect(() => {
    if (hasMounted.current) {
      dispatcher._change(
        template ? TEMPLATE : TITLE,
        prevTitle.current as TitlePayload,
        (prevTitle.current = { payload: title })
      );
    }
  }, [title, template]);

  useEffect(() => {
    hasMounted.current = true;
    dispatcher._addToQueue(
      template ? TEMPLATE : TITLE,
      (prevTitle.current = { payload: title })
    );

    return () => {
      hasMounted.current = false;
      dispatcher._removeFromQueue(
        template ? TEMPLATE : TITLE,
        prevTitle.current as TitlePayload
      );
    };
  }, [template]);
};
