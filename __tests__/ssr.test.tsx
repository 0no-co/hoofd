import { expect, describe, it, vi } from 'vitest';

vi.mock('../src/utils', () => {
  return {
    isServerSide: true,
  };
});
import * as React from 'react';
import * as ReactDom from 'react-dom/server';
import {
  useTitle,
  toStatic,
  useMeta,
  useLink,
  useLang,
  useHead,
  useScript,
} from '../src';

const render = ReactDom.renderToString;

describe('ssr', () => {
  it('should render to string (basic-individual)', () => {
    vi.useFakeTimers();
    const MyComponent = () => {
      useTitle('hi');
      useLang('nl');
      useMeta({ property: 'fb:admins', content: 'hi' });
      useLink({ rel: 'stylesheet', href: 'x' });
      useScript({
        crossorigin: 'anonymous',
        type: 'application/javascript',
        src: 'test.js',
        async: true,
      });
      useScript({
        text: '{"key":"value"}',
        type: 'application/ld+json',
        id: 'rich-text',
      });
      return <p>hi</p>;
    };

    render(<MyComponent />);
    vi.runAllTimers();
    const { lang, title, metas, links, scripts } = toStatic();

    expect(lang).toEqual('nl');
    expect(title).toEqual('hi');
    expect(metas).toEqual([{ content: 'hi', property: 'fb:admins' }]);
    expect(links).toEqual([
      { 'data-hoofd': '1', rel: 'stylesheet', href: 'x' },
    ]);
    expect(scripts).toEqual([
      {
        crossorigin: 'anonymous',
        type: 'application/javascript',
        src: 'test.js',
        async: true,
      },
      {
        text: '{"key":"value"}',
        type: 'application/ld+json',
        id: 'rich-text',
      },
    ]);
  });

  it('should escape meta-content', () => {
    vi.useFakeTimers();
    const MyComponent = () => {
      useMeta({ property: 'fb:admins', content: "''<>&" });
      useMeta({ property: 'fb:something', content: '""' });
      return <p>hi</p>;
    };

    render(<MyComponent />);
    vi.runAllTimers();
    const { metas } = toStatic();

    expect(metas).toEqual([
      { content: '&quot;&quot;', property: 'fb:something' },
      { content: '&#39;&#39;&lt;&gt;&amp;', property: 'fb:admins' },
    ]);
  });

  it('should render to string (basic-useHead)', () => {
    vi.useFakeTimers();
    const MyComponent = () => {
      useHead({
        title: 'hi',
        metas: [{ property: 'fb:admins', content: 'hi' }],
      });
      return <p>hi</p>;
    };

    render(<MyComponent />);
    vi.runAllTimers();
    const { title, metas } = toStatic();
    expect(title).toEqual('hi');
    expect(metas).toEqual([{ content: 'hi', property: 'fb:admins' }]);
  });

  it('should render to string (nested-individual)', () => {
    vi.useFakeTimers();
    const MyComponent = (props: any) => {
      useTitle('hi');
      useMeta({ property: 'fb:admins', content: 'hi' });
      useLink({ rel: 'stylesheet', href: 'x' });
      useScript({
        crossorigin: 'anonymous',
        type: 'application/javascript',
        src: 'test.js',
        async: true,
      });

      return props.children;
    };

    const MyNestedComponent = () => {
      useTitle('bye');
      useMeta({ property: 'fb:admins', content: 'bye' });
      useLink({ rel: 'stylesheet', href: 'y' });
      useScript({
        text: '{"key":"value"}',
        type: 'application/ld+json',
        id: 'rich-text',
      });

      return <p>hi</p>;
    };

    render(
      <MyComponent>
        <MyNestedComponent />
      </MyComponent>
    );
    vi.runAllTimers();
    const { title, metas, links, scripts } = toStatic();
    expect(title).toEqual('bye');
    expect(metas).toEqual([{ content: 'bye', property: 'fb:admins' }]);
    expect(links).toEqual([
      { 'data-hoofd': '1', rel: 'stylesheet', href: 'x' },
      { 'data-hoofd': '1', rel: 'stylesheet', href: 'y' },
    ]);
    expect(scripts).toEqual([
      {
        crossorigin: 'anonymous',
        type: 'application/javascript',
        src: 'test.js',
        async: true,
      },
      {
        text: '{"key":"value"}',
        type: 'application/ld+json',
        id: 'rich-text',
      },
    ]);
  });

  it('should render to string (nested-useHead)', () => {
    vi.useFakeTimers();
    const MyComponent = (props: any) => {
      useHead({
        title: 'hi',
        metas: [{ property: 'fb:admins', content: 'hi' }],
      });
      return props.children;
    };

    const MyNestedComponent = () => {
      useHead({
        title: 'bye',
        metas: [{ property: 'fb:admins', content: 'bye' }],
      });
      return <p>hi</p>;
    };

    render(
      <MyComponent>
        <MyNestedComponent />
      </MyComponent>
    );
    vi.runAllTimers();
    const { title, metas } = toStatic();
    expect(title).toEqual('bye');
    expect(metas).toEqual([{ content: 'bye', property: 'fb:admins' }]);
  });
});
