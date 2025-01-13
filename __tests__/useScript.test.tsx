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

    const scripts = document.head.querySelectorAll('script');

    expect(scripts.length).to.equal(1);
    expect(scripts[0].type).to.equal('application/javascript');
    expect(scripts[0].crossOrigin).to.equal('anonymous');
    expect(scripts[0].src).toContain('test.js');
    expect(scripts[0].getAttribute('async')).to.equal('true');
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

    const scripts = document.head.querySelectorAll('script');

    expect(scripts.length).to.equal(1);
    expect(scripts[0].type).to.equal('application/javascript');
    expect(scripts[0].crossOrigin).to.equal('anonymous');
    expect(scripts[0].src).toContain('test.js');
    expect(scripts[0].getAttribute('async')).to.equal('true');
  });

  it('should create a new tag when the existing tag with src is not found', () => {
    const MyComponent = () => {
      useScript({
        crossorigin: 'anonymous',
        type: 'application/javascript',
        src: 'another-test.js',
        async: true,
      });
      return <p>hi</p>;
    };

    const node = document.createElement('script');
    const options = {
      crossorigin: 'anonymous',
      src: 'first-test.js',
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

    const scripts = document.head.querySelectorAll('script');

    expect(scripts.length).to.equal(2);
    expect(scripts[0].type).to.equal('');
    expect(scripts[0].crossOrigin).to.equal('anonymous');
    expect(scripts[0].src).toContain('first-test.js');
    expect(scripts[0].getAttribute('async')).to.equal('true');

    expect(scripts[1].type).to.equal('application/javascript');
    expect(scripts[1].crossOrigin).to.equal('anonymous');
    expect(scripts[1].src).toContain('another-test.js');
    expect(scripts[1].getAttribute('async')).to.equal('true');

    // cleanup only removes elements added/modified through React
    document.head.removeChild(node);
  });

  it('should remove script on unmount', () => {
    const MyComponent = () => {
      useScript({
        crossorigin: 'anonymous',
        type: 'application/javascript',
        src: 'test.js',
        async: true,
      });
      return <p>hi</p>;
    };

    let unmount;

    act(() => {
      unmount = render(<MyComponent />).unmount;
    });

    const scripts = document.head.querySelectorAll('script');

    expect(scripts.length).to.equal(1);
    expect(scripts[0].type).to.equal('application/javascript');
    expect(scripts[0].crossOrigin).to.equal('anonymous');
    expect(scripts[0].src).toContain('test.js');
    expect(scripts[0].getAttribute('async')).to.equal('true');

    unmount();

    const updatedScripts = document.head.querySelectorAll('script');

    expect(updatedScripts.length).to.equal(0);
  });

  it('should remove reused script on unmount', () => {
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

    let unmount;

    act(() => {
      unmount = render(<MyComponent />).unmount;
    });

    const scripts = document.head.querySelectorAll('script');

    expect(scripts.length).to.equal(1);
    expect(scripts[0].type).to.equal('application/javascript');
    expect(scripts[0].crossOrigin).to.equal('anonymous');
    expect(scripts[0].src).toContain('test.js');
    expect(scripts[0].getAttribute('async')).to.equal('true');

    unmount();

    const updatedScripts = document.head.querySelectorAll('script');

    expect(updatedScripts.length).to.equal(0);
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

    const scripts = document.head.querySelectorAll('script');
    expect(scripts.length).to.equal(1);
    expect(scripts[0].type).to.equal('application/ld+json');
    expect(scripts[0].id).to.equal('rich-text');
    expect(scripts[0].text).to.equal('{"key":"value"}');
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

    const scripts = document.head.querySelectorAll('script');

    expect(scripts.length).to.equal(1);
    expect(scripts[0].type).to.equal('application/ld+json');
    expect(scripts[0].id).to.equal('rich-text');
    expect(scripts[0].text).to.equal('{"key":"value"}');
  });

  it('should create a new tag when existing tag id does not match', () => {
    const MyComponent = () => {
      useScript({
        text: '{"key":"value"}',
        type: 'application/ld+json',
        id: 'richer-text',
      });
      return <p>hi</p>;
    };

    const node = document.createElement('script');
    const options = {
      type: 'application/ld+json',
      id: 'empty-rich-text',
    };
    Object.keys(options).forEach(key => {
      // @ts-ignore
      (node as Element).setAttribute(key, options[key]);
    });
    document.head.appendChild(node);

    act(() => {
      render(<MyComponent />);
    });

    const scripts = document.head.querySelectorAll('script');

    expect(scripts.length).to.equal(2);
    expect(scripts[0].type).to.equal('application/ld+json');
    expect(scripts[0].id).to.equal('empty-rich-text');
    expect(scripts[0].text).to.equal('');
    expect(scripts[1].type).to.equal('application/ld+json');
    expect(scripts[1].id).to.equal('richer-text');
    expect(scripts[1].text).to.equal('{"key":"value"}');

    // cleanup only removes elements added/modified through React
    document.head.removeChild(node);
  });
});
