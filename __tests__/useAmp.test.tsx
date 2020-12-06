import '@testing-library/jest-dom';
import * as React from 'react';
import { act, render, cleanup } from '@testing-library/react';
import { useAmp } from '../src';
import dispatcher from '../src/dispatcher';

describe('useAmp', () => {
  afterEach(() => {
    cleanup();
    dispatcher._reset!();
  });

  it('should fill in the amp-attributes (module)', async () => {
    jest.useFakeTimers();
    const Amp = () => {
      useAmp(true, false);
      return <p>hi</p>;
    };

    await act(async () => {
      await render(<Amp />);
    });
    jest.runAllTimers();
    expect(
      document.getElementsByTagName('html')[0].getAttribute('amp')
    ).toEqual('');

    const script = document.querySelectorAll(
      `script[src="https://cdn.ampproject.org/v0.mjs"]`
    )[0];
    expect(script.getAttribute('async')).toEqual('');
    expect(script.getAttribute('type')).toEqual('module');
    expect(script.getAttribute('src')).toEqual(
      'https://cdn.ampproject.org/v0.mjs'
    );
  });

  it('should fill in the amp-attributes (nomodule)', async () => {
    jest.useFakeTimers();
    const Amp = () => {
      useAmp(false, false);
      return <p>hi</p>;
    };

    await act(async () => {
      await render(<Amp />);
    });
    jest.runAllTimers();
    expect(
      document.getElementsByTagName('html')[0].getAttribute('amp')
    ).toEqual('');

    const script = document.querySelectorAll(
      `script[src="https://cdn.ampproject.org/v0.js"]`
    )[0];
    expect(script.getAttribute('async')).toEqual('');
    expect(script.getAttribute('type')).not.toEqual('module');
    expect(script.getAttribute('src')).toEqual(
      'https://cdn.ampproject.org/v0.js'
    );
  });
});
