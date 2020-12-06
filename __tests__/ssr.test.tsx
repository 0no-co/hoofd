jest.mock('../src/utils', () => {
  return {
    isServerSide: true,
  };
});
import * as React from 'react';
import { useTitle, toStatic, useMeta, useLink, useLang, useHead } from '../src';
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
      return <p>hi</p>;
    };

    render(<MyComponent />);
    jest.runAllTimers();
    const { lang, title, metas, links } = toStatic();
    expect(lang).toEqual('nl');
    expect(title).toEqual('hi');
    expect(metas).toEqual([{ content: 'hi', property: 'fb:admins' }]);
    expect(links).toEqual([{ rel: 'stylesheet', href: 'x' }]);
  });

  it('should render to string (basic-useHead)', () => {
    jest.useFakeTimers();
    const MyComponent = () => {
      useHead({
        title: 'hi',
        metas: [{ property: 'fb:admins', content: 'hi' }],
        amp: 'nomodule',
      });
      return <p>hi</p>;
    };

    render(<MyComponent />);
    jest.runAllTimers();
    const { title, metas, amp, ampScript } = toStatic();
    expect(amp).toBeTruthy();
    expect(ampScript).toEqual('https://cdn.ampproject.org/v0.js');
    expect(title).toEqual('hi');
    expect(metas).toEqual([{ content: 'hi', property: 'fb:admins' }]);
  });

  it('should render to string (nested-individual)', () => {
    jest.useFakeTimers();
    const MyComponent = (props: any) => {
      useTitle('hi');
      useMeta({ property: 'fb:admins', content: 'hi' });
      useLink({ rel: 'stylesheet', href: 'x' });
      return props.children;
    };

    const MyNestedComponent = () => {
      useTitle('bye');
      useMeta({ property: 'fb:admins', content: 'bye' });
      useLink({ rel: 'stylesheet', href: 'y' });
      return <p>hi</p>;
    };

    render(
      <MyComponent>
        <MyNestedComponent />
      </MyComponent>
    );
    jest.runAllTimers();
    const { title, metas, links } = toStatic();
    expect(title).toEqual('bye');
    expect(metas).toEqual([{ content: 'bye', property: 'fb:admins' }]);
    expect(links).toEqual([
      { rel: 'stylesheet', href: 'x' },
      { rel: 'stylesheet', href: 'y' },
    ]);
  });

  it('should render to string (nested-useHead)', () => {
    jest.useFakeTimers();
    const MyComponent = (props: any) => {
      useHead({
        title: 'hi',
        amp: 'module',
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
    const { title, metas, amp, ampScript } = toStatic();
    expect(amp).toBeTruthy();
    expect(ampScript).toEqual('https://cdn.ampproject.org/v0.mjs');
    expect(title).toEqual('bye');
    expect(metas).toEqual([{ content: 'bye', property: 'fb:admins' }]);
  });
});
