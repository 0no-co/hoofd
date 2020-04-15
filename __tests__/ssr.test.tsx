jest.mock('../src/utils', () => {
  return {
    isServerSide: true,
  };
});
import * as React from 'react';
import { useTitle, toStatic, useMeta, useLink, useLang } from '../src';
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

  it('should render to string (basic)', () => {
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
    const { headString, lang, title, metas, links } = toStatic();
    expect(headString).toContain('<title>hi</title>');
    expect(headString).toContain('<meta property="fb:admins" content="hi">');
    expect(headString).toContain('<link rel="stylesheet" href="x">');
    expect(lang).toEqual('nl');
    expect(title).toEqual('hi');
    expect(metas).toEqual([
      { type: 'meta', content: 'hi', property: 'fb:admins' },
    ]);
    expect(links).toEqual([{ rel: 'stylesheet', href: 'x', type: 'link' }]);
  });

  it('should render to string (nested)', () => {
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
    const { headString, title, metas, links } = toStatic();
    expect(headString).toContain('<title>bye</title>');
    expect(headString).toContain('<meta property="fb:admins" content="bye">');
    expect(headString).toContain('<link rel="stylesheet" href="y">');
    expect(title).toEqual('bye');
    expect(metas).toEqual([
      { type: 'meta', content: 'bye', property: 'fb:admins' },
    ]);
    expect(links).toEqual([
      { rel: 'stylesheet', href: 'x', type: 'link' },
      { rel: 'stylesheet', href: 'y', type: 'link' },
    ]);
  });
});
