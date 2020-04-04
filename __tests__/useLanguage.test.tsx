import '@testing-library/jest-dom';
import * as React from 'react';
import { act, render, cleanup } from '@testing-library/react';
import { useLanguage } from '../src';

describe('useLanguage', () => {
  afterEach(() => {
    cleanup();
  });

  it('should fill in the language', () => {
    const MyComponent = ({ language }: { language: string }) => {
      useLanguage(language);
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
