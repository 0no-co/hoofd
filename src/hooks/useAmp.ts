import dispatcher from '../dispatcher';
import { isServerSide } from '../utils';

export const useAmp = () => {
  if (isServerSide) {
    dispatcher._setAmp();
  }
};
