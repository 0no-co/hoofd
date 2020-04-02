import '@testing-library/jest-dom';
import * as React from 'react';
import { act, render } from '@testing-library/react';
import { useMeta } from '../src';

describe('useMeta', () => {
  it('should use meta tags', () => {
    const MyComponent = ({ description }: any) => {
      useMeta({ charset: 'utf-8' });
      useMeta({ name: 'description', content: description });
      useMeta({ property: 'og:description', content: description });
      useMeta({ httpEquiv: 'refresh', content: '30' });
      return <p>hi</p>;
    };

    let rerender: any;

    act(() => {
      ({ rerender } = render(<MyComponent description="This is a test" />));
    });

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

    act(() => {
      rerender(<MyComponent description="This is not a test" />);
    });

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

  it('should deeply use meta-tags', () => {
    const MyComponent = ({ children }: any) => {
      useMeta({ charset: 'utf-8' });
      useMeta({ name: 'description', content: 'This is a test' });
      useMeta({ property: 'og:description', content: 'This is a test' });
      useMeta({ httpEquiv: 'refresh', content: '30' });
      return children;
    };

    const MyPage = () => {
      // @ts-ignore
      useMeta({ charset: 'utf-2' });
      useMeta({ name: 'description', content: 'This is not a test' });
      useMeta({ property: 'og:description', content: 'This is not a test' });
      useMeta({ httpEquiv: 'refresh', content: '60' });
      useMeta({ property: 'og:image', content: 'me' });
      return <p>hi</p>;
    };

    let rerender: any;

    act(() => {
      ({ rerender } = render(
        <MyComponent>
          <MyPage />
        </MyComponent>
      ));
    });

    expect(document.head.innerHTML).toContain('<meta charset="utf-2">');
    expect(document.head.innerHTML).toContain(
      '<meta name="description" content="This is not a test">'
    );
    expect(document.head.innerHTML).toContain(
      '<meta property="og:description" content="This is not a test">'
    );
    expect(document.head.innerHTML).toContain(
      '<meta http-equiv="refresh" content="60">'
    );
    expect(document.head.innerHTML).toContain(
      '<meta property="og:image" content="me">'
    );
    expect(document.head.innerHTML).not.toContain('<meta charset="utf-8">');
    expect(document.head.innerHTML).not.toContain(
      '<meta http-equiv="refresh" content="30">'
    );
    expect(document.head.innerHTML).not.toContain(
      '<meta name="description" content="This is a test">'
    );
    expect(document.head.innerHTML).not.toContain(
      '<meta property="og:description" content="This is a test">'
    );

    act(() => {
      rerender(
        <MyComponent>
          <p>hi</p>
        </MyComponent>
      );
    });

    expect(document.head.innerHTML).toContain('<meta charset="utf-8">');
    expect(document.head.innerHTML).toContain(
      '<meta http-equiv="refresh" content="30">'
    );
    expect(document.head.innerHTML).toContain(
      '<meta name="description" content="This is a test">'
    );
    expect(document.head.innerHTML).toContain(
      '<meta property="og:description" content="This is a test">'
    );
    expect(document.head.innerHTML).not.toContain(
      '<meta property="og:image" content="me">'
    );
    expect(document.head.innerHTML).not.toContain('<meta charset="utf-2">');
    expect(document.head.innerHTML).not.toContain(
      '<meta name="description" content="This is not a test">'
    );
    expect(document.head.innerHTML).not.toContain(
      '<meta property="og:description" content="This is not a test">'
    );
    expect(document.head.innerHTML).not.toContain(
      '<meta http-equiv="refresh" content="60">'
    );
  });
});
