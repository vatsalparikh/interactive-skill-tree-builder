/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SkillLegend } from '../../src/components/SkillLegend';

describe('SkillLegend', () => {
  it('renders all legend items', () => {
    render(<SkillLegend />);

    expect(screen.getByText('Locked')).toBeInTheDocument();
    expect(screen.getByText('Unlocked')).toBeInTheDocument();
    expect(screen.getByText('Highlighted (search)')).toBeInTheDocument();
  });

  it('renders one decorative square before each label', () => {
    render(<SkillLegend />);

    const labels = [
      screen.getByText('Locked'),
      screen.getByText('Unlocked'),
      screen.getByText('Highlighted (search)'),
    ];

    for (const label of labels) {
      // previousElementSibling = the square indicator span
      const square = label.previousElementSibling;

      expect(square).not.toBeNull();
      expect(square?.getAttribute('role')).toBe('presentation');
    }
  });

  it('decorative squares do not expose any accessible text', () => {
    render(<SkillLegend />);

    const squares = screen.getAllByRole('presentation');

    for (const sq of squares) {
      // Decorative squares should not expose any text content
      expect(sq).toBeInTheDocument();
      expect(sq).toHaveTextContent('');
    }
  });
});
