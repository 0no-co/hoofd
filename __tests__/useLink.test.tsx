/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import { act, render, cleanup } from '@testing-library/react';
import { expect, describe, afterEach, it } from 'vitest';

import { useLink } from '../src';

describe('useLink', () => {
  afterEach(() => {
    cleanup();
  });

  it('should fill in the link', () => {
    const MyComponent = ({ media }: { media: string }) => {
      useLink({
        crossorigin: 'anonymous',
        as: 'audio',
        href: 'htt://yow',
        media,
        rel: 'prefetch',
        sizes: 'x',
        hreflang: 'en-us',
      });
      return <p>hi</p>;
    };

    let rerender: any;
    act(() => {
      ({ rerender } = render(<MyComponent media="en" />));
    });
    expect(document.head.innerHTML).toContain(
      '<link crossorigin="anonymous" as="audio" href="htt://yow" media="en" rel="prefetch" sizes="x" hreflang="en-us">'
    );

    act(() => {
      rerender!(<MyComponent media="nl" />);
    });
    expect(document.head.innerHTML).toContain(
      '<link crossorigin="anonymous" as="audio" href="htt://yow" media="nl" rel="prefetch" sizes="x" hreflang="en-us">'
    );

    act(() => {
      rerender!(<p>hi</p>);
    });
    expect(document.head.innerHTML).not.toContain(
      '<link crossorigin="anonymous" as="audio" href="htt://yow" media="nl" rel="prefetch" sizes="x" hreflang="en-us">'
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
    Object.keys(options).forEach(key => {
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
      '<link crossorigin="anonymous" as="audio" href="htt://yow" media="en" rel="prefetch" sizes="x">'
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
    Object.keys(options).forEach(key => {
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

  it('sets imagesrcset and imagesizes on the link', () => {
    const MyComponent = () => {
      useLink({
        rel: 'preload',
        as: 'image',
        href: '/pic-800.jpg',
        imagesrcset: '/pic-400.jpg 400w, /pic-800.jpg 800w',
        imagesizes: '(max-width: 600px) 100vw, 50vw',
      });
      return null;
    };

    render(<MyComponent />);

    const link = document.head.querySelector('link[rel="preload"]')!;
    expect(link.getAttribute('imagesrcset')).toBe('/pic-400.jpg 400w, /pic-800.jpg 800w');
    expect(link.getAttribute('imagesizes')).toBe('(max-width: 600px) 100vw, 50vw');
  });
});
