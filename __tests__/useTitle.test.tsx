import '@testing-library/jest-dom';
import * as React from 'react';
import { act, render } from '@testing-library/react';
import { useTitle } from '../src';

describe('useTitle', () => {
  it('should fill in the title', () => {
    const MyComponent = ({ title }: { title: string }) => {
      useTitle(title);
      return <p>hi</p>;
    };

    let rerender: any;

    act(() => {
      ({ rerender } = render(<MyComponent title="coolStoryBruh" />));
    });

    expect(document.title).toEqual('coolStoryBruh');

    rerender!(<MyComponent title="itWorks" />);
    expect(document.title).toEqual('itWorks');
  });

  it('should restore the title', () => {
    const MyComponent = ({ title }: { title: string }) => {
      useTitle(title);
      return <p>hi</p>;
    };

    let rerender: any;

    act(() => {
      ({ rerender } = render(<MyComponent title="coolStoryBruh" />));
    });

    expect(document.title).toEqual('coolStoryBruh');

    rerender!(<p>hi</p>);
    expect(document.title).toEqual('');
  });

  it('should deeply fill in the title', () => {
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

    act(() => {
      ({ rerender } = render(
        <MyComponent title="coolStoryBruh">
          <MyDeepComponent title="resettedBruv" />
        </MyComponent>
      ));
    });

    expect(document.title).toEqual('resettedBruv');

    rerender!(
      <MyComponent title="coolStoryBruh">
        <p>hi</p>
      </MyComponent>
    );
    expect(document.title).toEqual('coolStoryBruh');
  });

  it('should deeply restore the previous title', () => {});
});
