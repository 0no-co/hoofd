import { useEffect } from 'react';
import dispatcher from '../dispatcher';
import { isServerSide } from '../utils';

export const useAmp = () => {
  if (isServerSide) {
    dispatcher._setAmp();
  }

  useEffect(() => {
    document.getElementsByTagName('html')[0].setAttribute('amp', '');
  }, []);
};
