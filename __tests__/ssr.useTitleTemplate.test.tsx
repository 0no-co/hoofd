jest.mock('../src/utils', () => {
  return {
    isServerSide: true,
  };
});

import * as React from 'react';
import { useTitle, useTitleTemplate, toStatic } from '../src';
import { render } from '@testing-library/react';

describe('ssr with a template', () => {
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
      useTitleTemplate('%s | you');
      useTitle('hi');
      return <p>hi</p>;
    };

    render(<MyComponent />);
    jest.runAllTimers();
    const { headString, title } = toStatic();
    expect(headString).toContain('<title>hi | you</title>');
    expect(title).toEqual('hi | you');
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
    const { headString, title } = toStatic();
    expect(headString).toContain('<title>bye | you</title>');
    expect(title).toEqual('bye | you');
  });
});
