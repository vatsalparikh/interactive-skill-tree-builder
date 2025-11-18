/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

// src/components/__tests__/SkillView.test.tsx
import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock reactflow so tests don't need ReactFlowProvider.
// Provide a simple Handle component and Position enum values the component uses.
vi.mock('reactflow', () => {
  interface MockHandleProps {
    type: string;
    position: string;
  }

  return {
    Handle: ({ type, position }: MockHandleProps) => (
      <div
        data-testid={`handle-${type}`}
        data-handle-type={type}
        data-position={position}
      />
    ),
    Position: {
      Bottom: 'bottom',
      Top: 'top',
    },
  };
});



// Import the component under test after mocking reactflow.
import SkillView from './SkillView';

describe('SkillView', () => {
  it('renders locked (default) state with name and description and no level', () => {
    const data = {
      name: 'Locked Skill',
      description: 'This is locked',
      // isUnlocked undefined / false -> locked branch
      isUnlocked: false,
    };

    const { container } = render(
      <SkillView
        data={data}
        type={''}
        id={''}
        selected={false}
        zIndex={0}
        isConnectable={false}
        xPos={0}
        yPos={0}
        dragging={false}
      />,
    );

    const article = container.querySelector('article');
    expect(article).toBeInTheDocument();

    // base classes present
    expect(article).toHaveClass('w-[180px]');
    expect(article).toHaveClass('rounded-xl');

    // locked classes (from locked string) should be present
    expect(article).toHaveClass('border-gray-300');

    // Level badge should NOT be present
    expect(screen.queryByText(/Level/)).toBeNull();

    // name and description present
    expect(screen.getByText('Locked Skill')).toBeInTheDocument();
    expect(screen.getByText('This is locked')).toBeInTheDocument();

    // Handles should render via mocked Handle
    expect(screen.getByTestId('handle-source')).toHaveAttribute('data-handle-type', 'source');
    expect(screen.getByTestId('handle-target')).toHaveAttribute('data-handle-type', 'target');

    // Ensure handle positions were passed correctly (mocked Position)
    expect(screen.getByTestId('handle-source')).toHaveAttribute('data-position', 'bottom');
    expect(screen.getByTestId('handle-target')).toHaveAttribute('data-position', 'top');
  });

  it('renders unlocked state with level, dimmed content and highlighted style', () => {
    const data = {
      name: 'Unlocked Skill',
      description: 'This is unlocked and highlighted',
      isUnlocked: true,
      isHighlighted: true,
      isDimmed: true,
      level: 3,
    };

    const { container } = render(
      <SkillView
        data={data}
        type={''}
        id={''}
        selected={false}
        zIndex={0}
        isConnectable={false}
        xPos={0}
        yPos={0}
        dragging={false}
      />,
    );

    const article = container.querySelector('article');
    expect(article).toBeInTheDocument();

    // Unlocked classes should be present
    expect(article).toHaveClass('border-green-400/60');

    // Level badge present and shows correct level
    expect(screen.getByText('Level 3')).toBeInTheDocument();

    // Dimmed child div should have opacity-40 class
    const dimmedDiv = container.querySelector('div.opacity-40');
    expect(dimmedDiv).toBeInTheDocument();

    // Highlight style should be applied (boxShadow)
    // Use toHaveStyle provided by jest-dom
    expect(article).toHaveStyle('box-shadow: 0 0 10px 2px rgba(37, 99, 235, 0.8)');

    // Handles still present
    expect(screen.getByTestId('handle-source')).toBeInTheDocument();
    expect(screen.getByTestId('handle-target')).toBeInTheDocument();
  });

  it('does not apply highlight style when isHighlighted is false', () => {
    const data = {
      name: 'Unlocked No Highlight',
      description: 'Unlocked but not highlighted',
      isUnlocked: true,
      isHighlighted: false,
      isDimmed: false,
      level: undefined,
    };

    const { container } = render(
      <SkillView
        data={data}
        type={''}
        id={''}
        selected={false}
        zIndex={0}
        isConnectable={false}
        xPos={0}
        yPos={0}
        dragging={false}
      />,
    );
    const article = container.querySelector('article');
    expect(article).toBeInTheDocument();

    // It should still be in unlocked class branch
    expect(article).toHaveClass('border-green-400/60');

    // But no box-shadow style should be applied
    // toHaveStyle with empty box-shadow would fail; check that the style does not include box-shadow
    expect(article).not.toHaveStyle('box-shadow: 0 0 10px 2px rgba(37, 99, 235, 0.8)');

    // Content should be fully opaque
    const contentDiv = container.querySelector('div.opacity-100');
    expect(contentDiv).toBeInTheDocument();

    // Level should not be rendered when undefined
    expect(screen.queryByText(/Level/)).toBeNull();
  });
});
