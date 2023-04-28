import { expect, describe, it, vi } from 'vitest';

vi.mock('../src/utils', () => {
  return {
    isServerSide: true,
  };
});

import * as React from 'react';
import * as ReactDom from 'react-dom/server';
import { useTitle, useTitleTemplate, toStatic } from '../src';

describe('ssr with a template', () => {
  it('should render to string (basic)', () => {
    vi.useFakeTimers();
    const MyComponent = () => {
      useTitleTemplate('%s | you');
      useTitle('hi');
      return <p>hi</p>;
    };

    ReactDom.renderToString(<MyComponent />);
    vi.runAllTimers();
    const { title } = toStatic();
    expect(title).toEqual('hi | you');
  });

  it('should render to string (nested)', () => {
    vi.useFakeTimers();
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

    ReactDom.renderToString(
      <MyComponent>
        <MyNestedComponent />
      </MyComponent>
    );
    vi.runAllTimers();
    const { title } = toStatic();
    expect(title).toEqual('bye | you');
  });
});
