jest.mock('../src/utils', () => {
  return {
    isServerSide: true,
  };
});
import * as React from 'react';
import {
  useTitle,
  toStatic,
  useMeta,
  useLink,
  useLang,
  useHead,
  useScript,
} from '../src';
import { render } from '@testing-library/react';

describe('ssr', () => {
  let original: any;

  beforeAll(() => {
    original = React.useEffect;
    (React as any).useEffect = jest.fn(() => {});
  });

  afterAll(() => {
    (React as any).useEffect = original;
  });

  it('should render to string (basic-individual)', () => {
    jest.useFakeTimers();
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
    jest.runAllTimers();
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
    jest.useFakeTimers();
    const MyComponent = () => {
      useMeta({ property: 'fb:admins', content: "''<>&" });
      useMeta({ property: 'fb:something', content: '""' });
      return <p>hi</p>;
    };

    render(<MyComponent />);
    jest.runAllTimers();
    const { metas } = toStatic();

    expect(metas).toEqual([
      { content: '&quot;&quot;', property: 'fb:something' },
      { content: '&#39;&#39;&lt;&gt;&amp;', property: 'fb:admins' },
    ]);
  });

  it('should render to string (basic-useHead)', () => {
    jest.useFakeTimers();
    const MyComponent = () => {
      useHead({
        title: 'hi',
        metas: [{ property: 'fb:admins', content: 'hi' }],
      });
      return <p>hi</p>;
    };

    render(<MyComponent />);
    jest.runAllTimers();
    const { title, metas } = toStatic();
    expect(title).toEqual('hi');
    expect(metas).toEqual([{ content: 'hi', property: 'fb:admins' }]);
  });

  it('should render to string (nested-individual)', () => {
    jest.useFakeTimers();
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
    jest.runAllTimers();
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
    jest.useFakeTimers();
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
    jest.runAllTimers();
    const { title, metas } = toStatic();
    expect(title).toEqual('bye');
    expect(metas).toEqual([{ content: 'bye', property: 'fb:admins' }]);
  });
});
