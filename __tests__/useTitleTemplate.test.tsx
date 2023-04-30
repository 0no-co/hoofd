/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import { expect, describe, afterEach, it, vi } from 'vitest';
import { act, render, cleanup } from '@testing-library/react';

import { useTitle, useTitleTemplate } from '../src';
import dispatcher from '../src/dispatcher';

describe('useTitle', () => {
  afterEach(() => {
    cleanup();
    dispatcher._reset!();
  });

  it('should remove the template string when there is no title provided', async () => {
    vi.useFakeTimers();
    const MyComponent = ({ template }: { template: string }) => {
      useTitleTemplate(template);

      return <p>hi</p>;
    };

    await act(async () => {
      await render(<MyComponent template="Site%s" />);
    });

    vi.runAllTimers();
    expect(document.title).toEqual('Site');
  });

  it('should fill in the title based on the template', async () => {
    vi.useFakeTimers();
    const MyComponent = ({
      template,
      title,
    }: {
      template: string;
      title: string;
    }) => {
      useTitleTemplate(template);
      useTitle(title);

      return <p>hi</p>;
    };

    let rerender: any;

    await act(async () => {
      ({ rerender } = await render(
        <MyComponent template="%s | Site" title="Super" />
      ));
    });

    vi.runAllTimers();
    expect(document.title).toEqual('Super | Site');

    await act(async () => {
      await rerender!(
        <MyComponent title="itWorks" template="| without replacement" />
      );
    });
    vi.runAllTimers();
    expect(document.title).toEqual('| without replacement');
  });

  it('should restore the title', async () => {
    vi.useFakeTimers();
    const MyComponent = ({
      title,
      template,
    }: {
      title: string;
      template: string;
    }) => {
      useTitleTemplate(template);
      useTitle(title);
      return <p>hi</p>;
    };

    let rerender: any;

    await act(async () => {
      ({ rerender } = await render(
        <MyComponent title="coolStory" template="%s | Bruh" />
      ));
    });

    vi.runAllTimers();
    expect(document.title).toEqual('coolStory | Bruh');

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
      template,
    }: {
      children: any;
      title: string;
      template: string;
    }) => {
      useTitleTemplate(template);
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
        <MyComponent title="coolStory" template="%s | Bruh">
          <MyDeepComponent title="resetted" />
        </MyComponent>
      ));
    });

    vi.runAllTimers();
    expect(document.title).toEqual('resetted | Bruh');

    await act(async () => {
      await rerender!(
        <MyComponent title="coolStory" template="%s | Bruh">
          <p>hi</p>
        </MyComponent>
      );
    });

    vi.runAllTimers();
    expect(document.title).toEqual('coolStory | Bruh');
  });

  it('should keep the templates deeply in order', async () => {
    vi.useFakeTimers();
    const MyComponent = ({
      children,
      title,
      template,
    }: {
      children: any;
      title: string;
      template: string;
    }) => {
      useTitleTemplate(template);
      useTitle(title);
      return children;
    };

    const MyDeepComponent = ({
      children,
      title,
      template,
    }: {
      children: any;
      title: string;
      template: string;
    }) => {
      useTitleTemplate(template);
      useTitle(title);
      return children;
    };

    const MyDeepestComponent = ({
      title,
      template,
    }: {
      title: string;
      template?: string;
    }) => {
      if (template) {
        useTitleTemplate(template);
      }

      useTitle(title);
      return <p>hi</p>;
    };

    let rerender: any;

    await act(async () => {
      ({ rerender } = await render(
        <MyComponent title="coolStory" template="%s | Bruh">
          <MyDeepComponent title="resetted" template="%s | Bro">
            <MyDeepestComponent title="innerStory" template="%s | Sis" />
          </MyDeepComponent>
        </MyComponent>
      ));
    });

    vi.runAllTimers();
    expect(document.title).toEqual('innerStory | Sis');

    await act(async () => {
      ({ rerender } = await render(
        <MyComponent title="coolStory" template="%s | Bruh">
          <MyDeepComponent title="resetted" template="%s | Bro">
            <MyDeepestComponent title="innerStory" />
          </MyDeepComponent>
        </MyComponent>
      ));
    });

    vi.runAllTimers();
    expect(document.title).toEqual('innerStory | Bro');
  });
});
