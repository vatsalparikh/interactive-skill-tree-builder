/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ErrorToast } from '../../src/components/error-toast';

describe('ErrorToast', () => {
  it('renders the provided error message', () => {
    render(<ErrorToast message='Something went wrong!' />);

    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
  });

  it('applies the correct Tailwind classes', () => {
    render(<ErrorToast message='Error text' />);

    const el = screen.getByText('Error text');

    expect(el.className).toContain('bg-red-100');
    expect(el.className).toContain('text-red-900');
    expect(el.className).toContain('px-4');
    expect(el.className).toContain('py-3');
    expect(el.className).toContain('rounded-md');
    expect(el.className).toContain('shadow');
    expect(el.className).toContain('text-sm');
  });

  it('matches snapshot', () => {
    const { container } = render(<ErrorToast message='Snapshot test' />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
