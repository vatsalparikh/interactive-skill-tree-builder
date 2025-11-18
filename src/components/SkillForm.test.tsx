/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, type MockedFunction, vi } from 'vitest';

import type { SkillFormData } from '../types';
import SkillForm from './SkillForm';

// Strongly typed mock
let onSubmit: MockedFunction<(data: SkillFormData) => void>;

function fillName(value: string) {
  fireEvent.change(screen.getByLabelText('Name *'), {
    target: { value },
  });
}

function fillDescription(value: string) {
  fireEvent.change(screen.getByLabelText('Description *'), {
    target: { value },
  });
}

function fillLevel(value: string) {
  fireEvent.change(screen.getByLabelText('Level (optional)'), {
    target: { value },
  });
}

function submitForm() {
  fireEvent.click(screen.getByRole('button', { name: /add new skill/i }));
}

describe('SkillForm', () => {
  beforeEach(() => {
    onSubmit = vi.fn<(data: SkillFormData) => void>();
  });

  it('renders all fields', () => {
    render(<SkillForm onSubmit={onSubmit} />);

    expect(screen.getByLabelText('Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Description *')).toBeInTheDocument();
    expect(screen.getByLabelText('Level (optional)')).toBeInTheDocument();
  });

  it('validates empty name on blur', () => {
    render(<SkillForm onSubmit={onSubmit} />);

    const nameInput = screen.getByLabelText('Name *');
    fireEvent.blur(nameInput);

    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('validates empty description on blur', () => {
    render(<SkillForm onSubmit={onSubmit} />);

    const descInput = screen.getByLabelText('Description *');
    fireEvent.blur(descInput);

    expect(screen.getByText('Description is required')).toBeInTheDocument();
  });

  it('shows error when description > 150 chars', () => {
    render(<SkillForm onSubmit={onSubmit} />);

    fillDescription('x'.repeat(151));
    fireEvent.blur(screen.getByLabelText('Description *'));

    expect(screen.getByText('Description must be 150 characters or less')).toBeInTheDocument();
  });

  it('shows error when level is invalid', () => {
    render(<SkillForm onSubmit={onSubmit} />);

    fillLevel('2000');
    fireEvent.blur(screen.getByLabelText('Level (optional)'));

    expect(screen.getByText('Level must be a number >= 0 and <= 999')).toBeInTheDocument();
  });

  it('submits valid form with trimmed values', () => {
    render(<SkillForm onSubmit={onSubmit} />);

    fillName('  Fireball  ');
    fillDescription('  Flames everywhere  ');
    fillLevel('5');

    submitForm();

    expect(onSubmit).toHaveBeenCalledTimes(1);

    expect(onSubmit.mock.calls.length).toBeGreaterThan(0);

    const call = onSubmit.mock.calls[0] as [SkillFormData];
    const submitted = call[0];

    expect(submitted).toEqual({
      name: 'Fireball',
      description: 'Flames everywhere',
      level: 5,
    });
  });

  it('submits form with undefined level when empty', () => {
    render(<SkillForm onSubmit={onSubmit} />);

    fillName('Skill');
    fillDescription('Desc');
    fillLevel('');

    submitForm();

    expect(onSubmit.mock.calls.length).toBeGreaterThan(0);

    const [submitted] = onSubmit.mock.calls[0] as [SkillFormData];

    expect(submitted.level).toBeUndefined();
  });

  it('resets form after successful submit', () => {
    render(<SkillForm onSubmit={onSubmit} />);

    fillName('Skill');
    fillDescription('Desc');
    fillLevel('5');

    submitForm();

    expect(screen.getByLabelText('Name *')).toHaveValue('');
    expect(screen.getByLabelText('Description *')).toHaveValue('');

    const levelInput = screen.getByRole('spinbutton');
    expect(levelInput).toHaveValue(null);
  });

  it('updates character counter', () => {
    render(<SkillForm onSubmit={onSubmit} />);

    fillDescription('abc');

    expect(screen.getByText('3/150')).toBeInTheDocument();
  });

  it('does not submit when validation fails', () => {
    render(<SkillForm onSubmit={onSubmit} />);

    fillName('Only name');

    submitForm();

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
