/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import { act, render, cleanup } from '@testing-library/react';
import { expect, describe, afterEach, it } from 'vitest';

import { useScript } from '../src';

describe('useScript', () => {
  afterEach(() => {
    cleanup();
  });

  it('should fill in the script', () => {
    const MyComponent = () => {
      useScript({
        crossorigin: 'anonymous',
        type: 'application/javascript',
        src: 'test.js',
        async: true,
      });
      return <p>hi</p>;
    };

    act(() => {
      render(<MyComponent />);
    });
    expect(document.head.innerHTML).toContain(
      '<script type="application/javascript" crossorigin="anonymous" async="true" src="test.js"></script>'
    );
  });

  it('should reuse an existing tag', () => {
    const MyComponent = () => {
      useScript({
        crossorigin: 'anonymous',
        type: 'application/javascript',
        src: 'test.js',
        async: true,
      });
      return <p>hi</p>;
    };

    const node = document.createElement('script');
    const options = {
      crossorigin: 'anonymous',
      src: 'test.js',
      async: true,
    };
    Object.keys(options).forEach(key => {
      // @ts-ignore
      (node as Element).setAttribute(key, options[key]);
    });
    document.head.appendChild(node);

    act(() => {
      render(<MyComponent />);
    });
    expect(document.head.innerHTML).toContain(
      '<script type="application/javascript" crossorigin="anonymous" async="true" src="test.js"></script>'
    );
  });

  it('should fill in the script with text', () => {
    const MyComponent = () => {
      useScript({
        text: '{"key":"value"}',
        type: 'application/ld+json',
        id: 'rich-text',
      });
      return <p>hi</p>;
    };

    act(() => {
      render(<MyComponent />);
    });

    expect(document.head.innerHTML).toContain(
      '<script type="application/ld+json" id="rich-text">{"key":"value"}</script>'
    );
  });

  it('should reuse an existing tag to fill text', () => {
    const MyComponent = () => {
      useScript({
        text: '{"key":"value"}',
        type: 'application/ld+json',
        id: 'rich-text',
      });
      return <p>hi</p>;
    };

    const node = document.createElement('script');
    const options = {
      type: 'application/ld+json',
      id: 'rich-text',
    };
    Object.keys(options).forEach(key => {
      // @ts-ignore
      (node as Element).setAttribute(key, options[key]);
    });
    document.head.appendChild(node);

    act(() => {
      render(<MyComponent />);
    });

    expect(document.head.innerHTML).toContain(
      '<script type="application/ld+json" id="rich-text">{"key":"value"}</script>'
    );
  });
});
