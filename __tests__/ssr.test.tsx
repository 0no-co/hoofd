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
    const MyComponent = () => {
      useTitle('hi');
      useLang('nl');
      useMeta({ property: 'fb:admins', content: 'hi' });
      useLink({ rel: 'stylesheet', href: 'x' });
      return <p>hi</p>;
    };

    render(<MyComponent />);
    const { head, lang } = toString();
    expect(head).toContain('<title>hi</title>');
    expect(head).toContain('<meta property="fb:admins" content="hi">');
    expect(head).toContain('<link rel="stylesheet" href="x">');
    expect(lang).toEqual('nl');
  });

  it('should render to string (nested)', () => {
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
    const { head } = toString();
    expect(head).toContain('<title>bye</title>');
    expect(head).toContain('<meta property="fb:admins" content="bye">');
    expect(head).toContain('<link rel="stylesheet" href="y">');
  });
});
