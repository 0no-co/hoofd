jest.mock('../src/utils', () => {
  return {
    isServerSide: true,
  };
});

import * as React from 'react';
import { useTitle, useTitleTemplate, toString } from '../src';
import { render } from '@testing-library/react';

describe('ssr with a template', () => {
  it('should render to string (basic)', () => {
    jest.useFakeTimers();
    const MyComponent = () => {
      useTitleTemplate('%s | you');
      useTitle('hi');
      return <p>hi</p>;
    };

    render(<MyComponent />);
    jest.runAllTimers();
    const { head, lang } = toString();
    expect(head).toContain('<title>hi | you</title>');
  });

  it('should render to string (nested)', () => {
    jest.useFakeTimers();
    const MyComponent = (props: any) => {
      useTitleTemplate('%s | you');
      useTitle('hi');
      return props.children;
    };

    const MyNestedComponent = () => {
      useTitleTemplate('%s | you');
      useTitle('bye');
      return <p>hi</p>;
    };

    render(
      <MyComponent>
        <MyNestedComponent />
      </MyComponent>
    );
    jest.runAllTimers();
    const { head } = toString();
    expect(head).toContain('<title>bye | you</title>');
  });

  it('should render to string (updates)', () => {
    jest.useFakeTimers();
    const MyComponent = (props: any) => {
      useTitleTemplate('%s | you');
      useTitle('hi');
      return props.children;
    };

    const MyNestedComponent = ({ content, template }: any) => {
      useTitle(content);
      useTitleTemplate(template);
      return <p>hi</p>;
    };

    const { rerender } = render(
      <MyComponent>
        <MyNestedComponent content="bye" template="%s | you" />
      </MyComponent>
    );
    jest.runAllTimers();

    rerender(
      <MyComponent>
        <MyNestedComponent content="foo" template="%s | you" />
      </MyComponent>
    );
    jest.runAllTimers();
    const { head } = toString();
    expect(head).toContain('<title>foo | you</title>');
  });

  it('should render to string (removal)', () => {
    jest.useFakeTimers();
    const MyComponent = (props: any) => {
      useTitleTemplate('%s | you');
      useTitle('hi');
      return props.children || <p>hi</p>;
    };

    const MyNestedComponent = ({ content }: any) => {
      useTitleTemplate('%s | you');
      useTitle(content);
      return <p>hi</p>;
    };

    const { rerender } = render(
      <MyComponent>
        <MyNestedComponent content="bye" template="%s | you" />
      </MyComponent>
    );
    jest.runAllTimers();

    rerender(<MyComponent />);
    jest.runAllTimers();
    const { head } = toString();
    expect(head).toContain('<title>hi | you</title>');
  });
});
