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

  it('should reuse an existing tag', () => {
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
    const node = document.createElement('link');
    const options = {
      crossorigin: 'anonymous',
      as: 'audio',
      href: 'htt://yow',
      media: 'en',
      rel: 'prefetch',
      sizes: 'x',
    };
    Object.keys(options).forEach((key) => {
      // @ts-ignore
      (node as Element).setAttribute(key, options[key]);
    });
    document.head.appendChild(node);
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
    expect(document.head.innerHTML).toContain(
      '<link crossorigin="anonymous" as="audio" href="htt://yow" media="nl" rel="prefetch" sizes="x">'
    );
  });

  it('should not reuse an existing tag that does not match', () => {
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
    const node = document.createElement('link');
    const options = {
      crossorigin: 'anonymous',
      as: 'audio',
      href: 'htt://chow',
      media: 'en',
      rel: 'prefetch',
      sizes: 'x',
    };
    Object.keys(options).forEach((key) => {
      // @ts-ignore
      (node as Element).setAttribute(key, options[key]);
    });
    document.head.appendChild(node);
    act(() => {
      ({ rerender } = render(<MyComponent media="en" />));
    });
    expect(document.head.innerHTML).toContain(
      '<link crossorigin="anonymous" as="audio" href="htt://yow" media="en" rel="prefetch" sizes="x">'
    );
    expect(document.head.innerHTML).toContain(
      '<link crossorigin="anonymous" as="audio" href="htt://chow" media="en" rel="prefetch" sizes="x">'
    );

    act(() => {
      rerender!(<MyComponent media="nl" />);
    });
    expect(document.head.innerHTML).toContain(
      '<link crossorigin="anonymous" as="audio" href="htt://yow" media="nl" rel="prefetch" sizes="x">'
    );
    expect(document.head.innerHTML).toContain(
      '<link crossorigin="anonymous" as="audio" href="htt://chow" media="en" rel="prefetch" sizes="x">'
    );

    act(() => {
      rerender!(<p>hi</p>);
    });
    expect(document.head.innerHTML).toContain(
      '<link crossorigin="anonymous" as="audio" href="htt://chow" media="en" rel="prefetch" sizes="x">'
    );
  });
});
