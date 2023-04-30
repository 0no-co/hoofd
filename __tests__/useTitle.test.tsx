/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import { expect, describe, afterEach, it, vi } from 'vitest';
import { act, render, cleanup } from '@testing-library/react';

import { useTitle } from '../src';
import dispatcher from '../src/dispatcher';

describe('useTitle', () => {
  afterEach(() => {
    cleanup();
    dispatcher._reset!();
  });

  it('should fill in the title', async () => {
    vi.useFakeTimers();
    const MyComponent = ({ title }: { title: string }) => {
      useTitle(title);
      return <p>hi</p>;
    };

    let rerender: any;
    await act(async () => {
      ({ rerender } = await render(<MyComponent title="coolStoryBruh" />));
    });
    vi.runAllTimers();
    expect(document.title).toEqual('coolStoryBruh');

    await act(async () => {
      await rerender!(<MyComponent title="itWorks" />);
    });
    vi.runAllTimers();
    expect(document.title).toEqual('itWorks');
  });

  it('should restore the title', async () => {
    vi.useFakeTimers();
    const MyComponent = ({ title }: { title: string }) => {
      useTitle(title);
      return <p>hi</p>;
    };

    let rerender: any;

    await act(async () => {
      ({ rerender } = await render(<MyComponent title="coolStoryBruh" />));
    });
    vi.runAllTimers();
    expect(document.title).toEqual('coolStoryBruh');

    await act(async () => {
      await rerender!(<p>hi</p>);
    });
    vi.runAllTimers();
    expect(document.title).toEqual('');
  });

  it('should deeply fill in the title', async () => {
    vi.useFakeTimers();
    const MyComponent = ({
      children,
      title,
    }: {
      children: any;
      title: string;
    }) => {
      useTitle(title);
      return children;
    };

    const MyDeepComponent = ({ title }: { title: string }) => {
      useTitle(title);
      return <p>hi</p>;
    };

    let rerender: any;

    await act(async () => {
      ({ rerender } = await render(
        <MyComponent title="coolStoryBruh">
          <MyDeepComponent title="resettedBruv" />
        </MyComponent>
      ));
    });
    vi.runAllTimers();
    expect(document.title).toEqual('resettedBruv');

    await act(async () => {
      await rerender!(
        <MyComponent title="coolStoryBruh">
          <p>hi</p>
        </MyComponent>
      );
    });
    vi.runAllTimers();
    expect(document.title).toEqual('coolStoryBruh');
  });

  it('should react correctly to a replaced title', async () => {
    let rerender: any;
    const MyComponent = ({
      children,
      title,
    }: {
      children: any;
      title: string;
    }) => {
      useTitle(title);
      return children;
    };

    const Page1 = ({ title }: { title: string }) => {
      useTitle(title);
      return <p>hi</p>;
    };

    const Page2 = ({ title }: { title: string }) => {
      useTitle(title);
      return <p>bye</p>;
    };

    await act(async () => {
      ({ rerender } = await render(
        <MyComponent title="coolStoryBruh">
          <Page1 title="Bruv" />
        </MyComponent>
      ));
    });
    vi.runAllTimers();
    expect(document.title).toEqual('Bruv');

    await act(async () => {
      await rerender!(
        <MyComponent title="coolStoryBruh">
          <Page2 title="Bruh" />
        </MyComponent>
      );
    });
    vi.runAllTimers();
    expect(document.title).toEqual('Bruh');
  });
});
