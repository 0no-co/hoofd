jest.mock('../src/utils', () => {
  return {
    isServerSide: true,
  };
});

import * as React from 'react';
import { useTitle, toString, useMeta, useLink, useLang } from '../src';
import { render } from '@testing-library/react';

describe('ssr', () => {
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
    const { head, lang } = toString();
    expect(head).toContain('<title>hi</title>');
    expect(head).toContain('<meta property="fb:admins" content="hi">');
    expect(head).toContain('<link rel="stylesheet" href="x">');
    expect(lang).toEqual('nl');
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
    const { head } = toString();
    expect(head).toContain('<title>bye</title>');
    expect(head).toContain('<meta property="fb:admins" content="bye">');
    expect(head).toContain('<link rel="stylesheet" href="y">');
  });

  it('should render to string (updates)', () => {
    jest.useFakeTimers();
    const MyComponent = (props: any) => {
      useTitle('hi');
      useMeta({ property: 'fb:admins', content: 'hi' });
      useLink({ rel: 'stylesheet', href: 'x' });
      return props.children;
    };

    const MyNestedComponent = ({ content }: any) => {
      useTitle(content);
      useMeta({ property: 'fb:admins', content });
      useLink({ rel: 'stylesheet', href: 'y' });
      return <p>hi</p>;
    };

    const { rerender } = render(
      <MyComponent>
        <MyNestedComponent content="bye" />
      </MyComponent>
    );
    jest.runAllTimers();

    rerender(
      <MyComponent>
        <MyNestedComponent content="foo" />
      </MyComponent>
    );
    jest.runAllTimers();
    const { head } = toString();
    expect(head).toContain('<title>foo</title>');
    expect(head).toContain('<meta property="fb:admins" content="foo">');
    expect(head).toContain('<link rel="stylesheet" href="y">');
  });

  it('should render to string (removal)', () => {
    jest.useFakeTimers();
    const MyComponent = (props: any) => {
      useTitle('hi');
      useMeta({ charset: 'utf-8' });
      useMeta({ property: 'fb:admins', content: 'hi' });
      useLink({ rel: 'stylesheet', href: 'x' });
      return props.children || <p>hi</p>;
    };

    const MyNestedComponent = ({ content }: any) => {
      useTitle(content);
      useMeta({ charset: 'utf-2' as any });
      useMeta({ property: 'fb:admins', content });
      useMeta({ property: 'fb:app_id', content });
      useLink({ rel: 'stylesheet', href: 'y' });
      return <p>hi</p>;
    };

    const { rerender } = render(
      <MyComponent>
        <MyNestedComponent content="bye" />
      </MyComponent>
    );
    jest.runAllTimers();

    rerender(<MyComponent />);
    jest.runAllTimers();
    const { head } = toString();
    expect(head).toContain('<title>hi</title>');
    expect(head).toContain('<meta charset="utf-8">');
    expect(head).toContain('<meta property="fb:admins" content="hi">');
    expect(head).toContain('<link rel="stylesheet" href="x">');
    expect(head).not.toContain('<meta rel="fb:app_id" content="hi">');
  });
});
