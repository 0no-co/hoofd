import { useEffect } from 'react';

export interface LinkOptions {
  rel?: string;
}

export const useLink = ({ rel }: LinkOptions) => {
  useEffect(() => {
    rel = 'hi';
  }, []);
};
