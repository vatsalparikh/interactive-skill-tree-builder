import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { SuccessToast } from '../../src/components/success-toast';

describe('SuccessToast', () => {
  it('renders the message text', () => {
    render(<SuccessToast message="Saved successfully!" />);

    expect(screen.getByText('Saved successfully!')).toBeInTheDocument();
  });

  it('applies correct accessibility attributes', () => {
    render(<SuccessToast message="Hello" />);

    const toast = screen.getByRole('status');

    expect(toast).toHaveAttribute('aria-live', 'polite');
    expect(toast).toHaveAttribute('aria-atomic', 'true');
  });

  it('applies correct styling classes', () => {
    render(<SuccessToast message="Styled message" />);

    const toast = screen.getByRole('status');

    expect(toast.className).toContain('bg-green-100');
    expect(toast.className).toContain('text-green-900');
    expect(toast.className).toContain('px-4');
    expect(toast.className).toContain('py-2');
    expect(toast.className).toContain('rounded-md');
    expect(toast.className).toContain('shadow');
    expect(toast.className).toContain('text-sm');
  });

  it('matches snapshot', () => {
    const { container } = render(<SuccessToast message="Snapshot test" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
