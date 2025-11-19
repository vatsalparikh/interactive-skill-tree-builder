/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import SearchBar from '../../src/components/search-bar';

describe('SearchBar', () => {
  it('renders input with the provided value', () => {
    render(<SearchBar value='Fireball' onChange={vi.fn()} />);

    const input = screen.getByRole('searchbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Fireball');
  });

  it('renders the placeholder text', () => {
    render(<SearchBar value='' onChange={vi.fn()} />);

    const input = screen.getByPlaceholderText('Search skills by name');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange with updated value when typing', () => {
    const onChange = vi.fn();
    render(<SearchBar value='' onChange={onChange} />);

    const input = screen.getByRole('searchbox');

    fireEvent.change(input, { target: { value: 'flame' } });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('flame');
  });

  it('has correct id and type attributes', () => {
    render(<SearchBar value='' onChange={vi.fn()} />);

    const input = screen.getByRole('searchbox');

    expect(input).toHaveAttribute('id', 'skill-search');
    expect(input).toHaveAttribute('type', 'search');
  });

  it('renders the hidden label for accessibility', () => {
    render(<SearchBar value='' onChange={vi.fn()} />);

    const label = screen.getByText('Search skills by name');
    expect(label).toBeInTheDocument();
    expect(label.className).toContain('sr-only');
  });

  it('matches snapshot', () => {
    const { container } = render(<SearchBar value='snapshot-test' onChange={vi.fn()} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
