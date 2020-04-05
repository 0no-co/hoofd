import '@testing-library/jest-dom';
import * as React from 'react';
import { act, render, cleanup } from '@testing-library/react';
import { useLink } from '../src';

describe('useLanguage', () => {
  afterEach(() => {
    cleanup();
  });

  it('should fill in the language', () => {
    const MyComponent = ({ media }: { media: string }) => {
      useLink({
        crossorigin: 'anonymous',
        as: 'audio',
        href: 'htt://yow',
        media,
        rel: 'prefetch',
        sizes: 'x',
      });
      return <p>hi</p>;
    };

    let rerender: any;
    act(() => {
      ({ rerender } = render(<MyComponent media="en" />));
    });
    expect(document.head.innerHTML).toContain(
      '<link crossorigin="anonymous" as="audio" href="htt://yow" media="en" rel="prefetch" sizes="x">'
    );

    act(() => {
      rerender!(<MyComponent media="nl" />);
    });
    expect(document.head.innerHTML).toContain(
      '<link crossorigin="anonymous" as="audio" href="htt://yow" media="nl" rel="prefetch" sizes="x">'
    );

    act(() => {
      rerender!(<p>hi</p>);
    });
    expect(document.head.innerHTML).not.toContain(
      '<link crossorigin="anonymous" as="audio" href="htt://yow" media="nl" rel="prefetch" sizes="x">'
    );
  });
});
