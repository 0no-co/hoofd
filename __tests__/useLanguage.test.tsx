import '@testing-library/jest-dom';
import * as React from 'react';
import { act, render, cleanup } from '@testing-library/react';
import { useLang } from '../src';

describe('useLang', () => {
  afterEach(() => {
    cleanup();
  });

  it('should fill in the language', () => {
    const MyComponent = ({ language }: { language: string }) => {
      useLang(language);
      return <p>hi</p>;
    };

    let rerender: any;
    act(() => {
      ({ rerender } = render(<MyComponent language="en" />));
    });
    expect(
      document.getElementsByTagName('html')[0].getAttribute('lang')
    ).toEqual('en');

    act(() => {
      rerender!(<MyComponent language="nl" />);
    });
    expect(
      document.getElementsByTagName('html')[0].getAttribute('lang')
    ).toEqual('nl');
  });
});
