/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import type { ReactElement } from 'react';
import React from 'react';
import { toast } from 'react-hot-toast';
import { beforeEach, describe, expect, it, type MockedFunction, vi } from 'vitest';

import { showSuccessToast } from './SuccessToast';

// -------------------------------------------------------------
// Types for the toast element props and toast.custom
// -------------------------------------------------------------
interface SuccessToastProps {
  className?: string;
  children?: string;
}

type ToastCustomFn = (
  el: ReactElement<SuccessToastProps>,
  options?: { duration?: number },
) => unknown;

// -------------------------------------------------------------
// Strongly typed mock
// -------------------------------------------------------------
vi.mock('react-hot-toast', () => ({
  toast: {
    custom: vi.fn<ToastCustomFn>(), // <-- CORRECT Vitest typing
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('showSuccessToast', () => {
  it('calls toast.custom with the correct JSX and duration', () => {
    showSuccessToast('Saved!');

    const mockedToastCustom = toast.custom as MockedFunction<ToastCustomFn>;

    expect(mockedToastCustom).toHaveBeenCalledTimes(1);

    expect(mockedToastCustom.mock.calls.length).toBeGreaterThan(0);

    const call = mockedToastCustom.mock.calls[0];

    const jsxElement = call[0];
    const options = call[1];

    expect(jsxElement).toBeDefined();

    // Runtime narrowing
    if (!React.isValidElement(jsxElement)) {
      throw new Error('toast.custom must receive a React element');
    }

    // Type-safe React element
    const element = jsxElement;

    expect(element.props.children).toBe('Saved!');
    expect(element.props.className).toContain('bg-green-100');
    expect(element.props.className).toContain('text-green-900');

    expect(options).toEqual({ duration: 2000 });
  });

  it('passes through any message string', () => {
    showSuccessToast('Hello World');

    const mockedToastCustom = toast.custom as MockedFunction<ToastCustomFn>;

    expect(mockedToastCustom.mock.calls.length).toBeGreaterThan(0);

    const call = mockedToastCustom.mock.calls[0];

    const jsxElement = call[0];

    expect(jsxElement).toBeDefined();

    if (!React.isValidElement(jsxElement)) {
      throw new Error('toast.custom must receive a React element');
    }

    const element = jsxElement;
    expect(element.props.children).toBe('Hello World');
  });
});
