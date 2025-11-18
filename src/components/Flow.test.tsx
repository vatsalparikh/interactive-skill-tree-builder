/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { render } from '@testing-library/react';
import type { Edge } from 'reactflow';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { SkillNode } from '../types';
import Flow from './Flow';
import SkillView from './SkillView';

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
