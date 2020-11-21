import '@testing-library/jest-dom';
import * as React from 'react';
import { act, render, cleanup } from '@testing-library/react';
import { useHead } from '../src';
import dispatcher from '../src/dispatcher';

describe('useMeta', () => {
  afterEach(() => {
    cleanup();
    dispatcher._reset!();
  });

  it('should use full head', async () => {
    jest.useFakeTimers();
    const MyComponent = ({ description }: any) => {
      useHead({
        title: 'Hello world',
        metas: [
          { charset: 'utf-8' },
          { name: 'description', content: description },
          { property: 'og:description', content: description },
          { httpEquiv: 'refresh', content: '30' },
        ],
      });

      return <p>hi</p>;
    };

    let rerender: any;

    await act(async () => {
      ({ rerender } = await render(
        <MyComponent description="This is a test" />
      ));
    });

    jest.runAllTimers();
    expect(document.title).toEqual('Hello world');
    expect(document.head.innerHTML).toContain('<meta charset="utf-8">');
    expect(document.head.innerHTML).toContain(
      '<meta name="description" content="This is a test">'
    );
    expect(document.head.innerHTML).toContain(
      '<meta property="og:description" content="This is a test">'
    );
    expect(document.head.innerHTML).toContain(
      '<meta http-equiv="refresh" content="30">'
    );

    await act(async () => {
      await rerender(<MyComponent description="This is not a test" />);
    });

    jest.runAllTimers();
    expect(document.title).toEqual('Hello world');
    expect(document.head.innerHTML).toContain('<meta charset="utf-8">');
    expect(document.head.innerHTML).toContain(
      '<meta name="description" content="This is not a test">'
    );
    expect(document.head.innerHTML).toContain(
      '<meta property="og:description" content="This is not a test">'
    );
    expect(document.head.innerHTML).toContain(
      '<meta http-equiv="refresh" content="30">'
    );
    expect(document.head.innerHTML).not.toContain(
      '<meta name="description" content="This is a test">'
    );
    expect(document.head.innerHTML).not.toContain(
      '<meta property="og:description" content="This is a test">'
    );
  });

  it('should deeply utilize head', async () => {
    jest.useFakeTimers();

    const MyChild = ({ description, title }: any) => {
      useHead({
        title: title ? 'Ohaio world' : undefined,
        metas: [
          { charset: 'utf-8' },
          { name: 'description', content: description },
          { property: 'og:description', content: description },
          { httpEquiv: 'refresh', content: '60' },
        ],
      });

      return <p>hi</p>;
    };

    const MyComponent = ({ description, children, twitter, title }: any) => {
      useHead({
        language: 'en',
        title: title ? title : 'Hello world',
        metas: [
          { charset: 'utf-8' },
          { name: 'description', content: description },
          { property: 'og:description', content: description },
          { httpEquiv: 'refresh', content: '30' },
          twitter && { property: 'twitter:description', content: description },
        ].filter(Boolean) as any,
      });

      return <div>{children}</div>;
    };

    let rerender: any;

    await act(async () => {
      ({ rerender } = await render(
        <MyComponent description="This is a test">
          <MyChild title description="This is a child" />
        </MyComponent>
      ));
    });

    jest.runAllTimers();
    expect(
      document.getElementsByTagName('html')[0].getAttribute('lang')
    ).toEqual('en');
    expect(document.title).toEqual('Ohaio world');
    expect(document.head.innerHTML).toContain('<meta charset="utf-8">');
    expect(document.head.innerHTML).toContain(
      '<meta name="description" content="This is a child">'
    );
    expect(document.head.innerHTML).toContain(
      '<meta property="og:description" content="This is a child">'
    );
    expect(document.head.innerHTML).toContain(
      '<meta http-equiv="refresh" content="60">'
    );

    await act(async () => {
      await rerender(
        <MyComponent description="This is a test">
          <MyChild description="This is a child" />
        </MyComponent>
      );
    });

    jest.runAllTimers();
    expect(document.title).toEqual('Hello world');
    expect(document.head.innerHTML).toContain('<meta charset="utf-8">');
    expect(document.head.innerHTML).toContain(
      '<meta name="description" content="This is a child">'
    );
    expect(document.head.innerHTML).toContain(
      '<meta property="og:description" content="This is a child">'
    );
    expect(document.head.innerHTML).toContain(
      '<meta http-equiv="refresh" content="60">'
    );

    await act(async () => {
      await rerender(
        <MyComponent description="This is a test">
          <MyChild title description="This is a child" />
        </MyComponent>
      );
    });

    jest.runAllTimers();
    expect(document.title).toEqual('Ohaio world');
    expect(document.head.innerHTML).toContain('<meta charset="utf-8">');
    expect(document.head.innerHTML).toContain(
      '<meta name="description" content="This is a child">'
    );
    expect(document.head.innerHTML).toContain(
      '<meta property="og:description" content="This is a child">'
    );
    expect(document.head.innerHTML).toContain(
      '<meta http-equiv="refresh" content="60">'
    );

    await act(async () => {
      await rerender(<MyComponent twitter description="This is not a test" />);
    });

    jest.runAllTimers();
    expect(document.title).toEqual('Hello world');
    expect(document.head.innerHTML).toContain('<meta charset="utf-8">');
    expect(document.head.innerHTML).toContain(
      '<meta name="description" content="This is not a test">'
    );
    expect(document.head.innerHTML).toContain(
      '<meta property="og:description" content="This is not a test">'
    );
    expect(document.head.innerHTML).toContain(
      '<meta property="twitter:description" content="This is not a test">'
    );
    expect(document.head.innerHTML).toContain(
      '<meta http-equiv="refresh" content="30">'
    );
    expect(document.head.innerHTML).not.toContain(
      '<meta http-equiv="refresh" content="60">'
    );
    expect(document.head.innerHTML).not.toContain(
      '<meta name="description" content="This is a test">'
    );
    expect(document.head.innerHTML).not.toContain(
      '<meta property="og:description" content="This is a test">'
    );

    await act(async () => {
      await rerender(
        <MyComponent title="hey" twitter description="This is not a test" />
      );
    });
    expect(document.title).toEqual('hey');
    expect(document.head.innerHTML).toContain('<meta charset="utf-8">');
    expect(document.head.innerHTML).toContain(
      '<meta name="description" content="This is not a test">'
    );
    expect(document.head.innerHTML).toContain(
      '<meta property="og:description" content="This is not a test">'
    );
    expect(document.head.innerHTML).toContain(
      '<meta property="twitter:description" content="This is not a test">'
    );
    expect(document.head.innerHTML).toContain(
      '<meta http-equiv="refresh" content="30">'
    );
    expect(document.head.innerHTML).not.toContain(
      '<meta http-equiv="refresh" content="60">'
    );
    expect(document.head.innerHTML).not.toContain(
      '<meta name="description" content="This is a test">'
    );
    expect(document.head.innerHTML).not.toContain(
      '<meta property="og:description" content="This is a test">'
    );
  });
});
