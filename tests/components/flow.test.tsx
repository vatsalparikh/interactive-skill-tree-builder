/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import React from 'react';

import { render, screen } from '@testing-library/react';
import type { Edge } from 'reactflow';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { SkillNode } from '../../src/types';
import Flow from '../../src/components/flow';
import SkillView from '../../src/components/skill-view';

// ---- Types for the ReactFlow mock ----

interface MockNode {
  id: string;
  type: string;
}

interface MockReactFlowProps {
  nodes: SkillNode[];
  edges: Edge[];
  onNodesChange: (...args: unknown[]) => void;
  onEdgesChange: (...args: unknown[]) => void;
  onConnect: (...args: unknown[]) => void;
  onNodeClick: (event: unknown, node: MockNode) => void;
  nodeTypes: Record<string, React.FC<unknown>>;
  children?: React.ReactNode;
}

let passedProps: MockReactFlowProps | null = null;

// ---- Mock ReactFlow ----
vi.mock('reactflow', () => {
  return {
    __esModule: true,
    default: vi.fn((props: MockReactFlowProps) => {
      passedProps = props;
      return <div data-testid='reactflow'>{props.children}</div>;
    }),
    Background: () => <div data-testid='rf-background' />,
    Controls: () => <div data-testid='rf-controls' />,
    MarkerType: { ArrowClosed: 'ArrowClosed' },
  };
});

// ---- Helpers ----

function makeSkill(id: string): SkillNode {
  return {
    id,
    type: 'skill',
    data: {
      name: id,
      description: '',
      isUnlocked: false,
    },
    position: { x: 0, y: 0 },
  };
}

function makeEdge(src: string, tgt: string): Edge {
  return { id: `${src}->${tgt}`, source: src, target: tgt };
}

// ---- Tests ----
describe('Flow component', () => {
  beforeEach(() => {
    passedProps = null;
  });

  it('renders ReactFlow with correct props', () => {
    const skills = [makeSkill('A')];
    const prereqs = [makeEdge('A', 'B')];

    const handlers = {
      onNodesChange: vi.fn(),
      onEdgesChange: vi.fn(),
      onConnect: vi.fn(),
      onUnlock: vi.fn(),
    };

    render(
      <Flow
        skills={skills}
        prereqs={prereqs}
        highlightedNodeIds={new Set()}
        highlightedEdgeIds={new Set()}
        {...handlers}
      />,
    );

    expect(passedProps).not.toBeNull();
    if (!passedProps) throw new Error('passedProps null');

    expect(passedProps.nodes).toEqual(skills);
    expect(passedProps.edges).toEqual(prereqs);

    expect(passedProps.onNodesChange).toBe(handlers.onNodesChange);
    expect(passedProps.onEdgesChange).toBe(handlers.onEdgesChange);
    expect(passedProps.onConnect).toBe(handlers.onConnect);

    expect(passedProps.nodeTypes.skill).toBe(SkillView);
  });

  it('calls onUnlock when a skill node is clicked', () => {
    const skills = [makeSkill('A')];

    const onUnlock = vi.fn();

    render(
      <Flow
        skills={skills}
        prereqs={[]}
        highlightedNodeIds={new Set()}
        highlightedEdgeIds={new Set()}
        onNodesChange={vi.fn()}
        onEdgesChange={vi.fn()}
        onConnect={vi.fn()}
        onUnlock={onUnlock}
      />,
    );

    expect(passedProps).not.toBeNull();
    if (!passedProps) throw new Error('passedProps null');

    const fakeNode: MockNode = { id: 'A', type: 'skill' };

    passedProps.onNodeClick({}, fakeNode);

    expect(onUnlock).toHaveBeenCalledWith('A');
  });

  it('does not call onUnlock for non-skill nodes', () => {
    const onUnlock = vi.fn();

    render(
      <Flow
        skills={[]}
        prereqs={[]}
        highlightedNodeIds={new Set()}
        highlightedEdgeIds={new Set()}
        onNodesChange={vi.fn()}
        onEdgesChange={vi.fn()}
        onConnect={vi.fn()}
        onUnlock={onUnlock}
      />,
    );

    expect(passedProps).not.toBeNull();
    if (!passedProps) throw new Error('passedProps null');

    const fakeNode: MockNode = { id: 'X', type: 'other' };

    passedProps.onNodeClick({}, fakeNode);

    expect(onUnlock).not.toHaveBeenCalled();
  });

  it('renders Background and Controls components', () => {
    const { getByTestId } = render(
      <Flow
        skills={[]}
        prereqs={[]}
        highlightedNodeIds={new Set()}
        highlightedEdgeIds={new Set()}
        onNodesChange={vi.fn()}
        onEdgesChange={vi.fn()}
        onConnect={vi.fn()}
        onUnlock={vi.fn()}
      />,
    );

    expect(getByTestId('rf-background')).toBeInTheDocument();
    expect(getByTestId('rf-controls')).toBeInTheDocument();
  });
});

describe('Flow A11y List Rendering', () => {
  function renderFlow(skills: SkillNode[], prereqs: Edge[]) {
    return render(
      <Flow
        skills={skills}
        prereqs={prereqs}
        onNodesChange={() => {}}
        onEdgesChange={() => {}}
        onConnect={() => {}}
        onUnlock={() => {}}
        highlightedNodeIds={new Set()}
        highlightedEdgeIds={new Set()}
      />,
    );
  }

  it('renders a list of skills with basic fields', () => {
    const skills: SkillNode[] = [
      {
        id: 'a',
        type: 'skill',
        position: { x: 0, y: 0 },
        data: {
          name: 'Skill A',
          description: 'Desc',
          isUnlocked: false,
        },
      },
    ];

    renderFlow(skills, []);

    const region = screen.getByRole('region', {
      name: 'Skill list',
      hidden: true,
    });
    expect(region).toBeInTheDocument();

    const list = screen.getByRole('list', { hidden: true });
    expect(list).toBeInTheDocument();

    const items = screen.getAllByRole('listitem', { hidden: true });
    expect(items.length).toBe(1);

    expect(items[0]).toHaveTextContent('Skill A (locked)');
  });

  it('shows level only when defined', () => {
    const skills: SkillNode[] = [
      {
        id: 'b',
        type: 'skill',
        position: { x: 0, y: 0 },
        data: {
          name: 'Skill B',
          description: 'Desc',
          isUnlocked: true,
          level: 3,
        },
      },
    ];

    renderFlow(skills, []);

    const text = screen.getByText(/Skill B — Level 3 \(unlocked\)/);
    expect(text).toBeInTheDocument();
  });

  it('omits level when undefined', () => {
    const skills: SkillNode[] = [
      {
        id: 'c',
        type: 'skill',
        position: { x: 0, y: 0 },
        data: {
          name: 'Skill C',
          description: 'Desc',
          isUnlocked: true,
          // no level
        },
      },
    ];

    renderFlow(skills, []);

    const item = screen.getByText(/Skill C \(unlocked\)/);
    expect(item).toBeInTheDocument();
    expect(item).not.toHaveTextContent('Level');
  });

  it('shows prerequisites when they exist', () => {
    const skills: SkillNode[] = [
      {
        id: 'x',
        type: 'skill',
        position: { x: 0, y: 0 },
        data: { name: 'Skill X', description: 'D', isUnlocked: true },
      },
      {
        id: 'y',
        type: 'skill',
        position: { x: 0, y: 0 },
        data: { name: 'Skill Y', description: 'D', isUnlocked: false },
      },
    ];

    const prereqs: Edge[] = [{ id: 'x->y', source: 'x', target: 'y' }];

    renderFlow(skills, prereqs);

    const item = screen.getByText(/Skill Y \(locked\) — Prerequisites: Skill X/);
    expect(item).toBeInTheDocument();
  });

  it('handles multiple prerequisites', () => {
    const skills: SkillNode[] = [
      {
        id: 'a',
        type: 'skill',
        position: { x: 0, y: 0 },
        data: { name: 'Alpha', description: 'D', isUnlocked: true },
      },
      {
        id: 'b',
        type: 'skill',
        position: { x: 0, y: 0 },
        data: { name: 'Beta', description: 'D', isUnlocked: true },
      },
      {
        id: 'c',
        type: 'skill',
        position: { x: 0, y: 0 },
        data: { name: 'Gamma', description: 'D', isUnlocked: false },
      },
    ];

    const prereqs: Edge[] = [
      { id: 'a->c', source: 'a', target: 'c' },
      { id: 'b->c', source: 'b', target: 'c' },
    ];

    renderFlow(skills, prereqs);

    const item = screen.getByText(/Gamma \(locked\) — Prerequisites: Alpha, Beta/);
    expect(item).toBeInTheDocument();
  });

  it('ignores prereqs whose source node does not exist', () => {
    const skills: SkillNode[] = [
      {
        id: 't',
        type: 'skill',
        position: { x: 0, y: 0 },
        data: { name: 'Target', description: 'D', isUnlocked: false },
      },
    ];

    const prereqs: Edge[] = [
      { id: 'ghost->t', source: 'ghost', target: 't' }, // no matching skill
    ];

    renderFlow(skills, prereqs);

    // Should NOT include "Prerequisites"
    const item = screen.getByText(/Target \(locked\)$/); // end-of-line
    expect(item).toBeInTheDocument();
  });
});
