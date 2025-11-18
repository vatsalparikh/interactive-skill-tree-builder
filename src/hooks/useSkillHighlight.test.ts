/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { renderHook } from '@testing-library/react';
import { type Edge, MarkerType } from 'reactflow';
import { describe, expect, it } from 'vitest';

import type { SkillNode } from '../types';
import useSkillHighlight from './useSkillHighlight';

function makeSkill(id: string, name: string): SkillNode {
  return {
    id,
    type: 'skill',
    position: { x: 0, y: 0 },
    data: {
      name,
      description: '',
      level: 1,
      isUnlocked: false,
    },
  };
}

function makeEdge(source: string, target: string): Edge {
  return {
    id: `${source}->${target}`,
    source,
    target,
  };
}

type HighlightedSkillData = SkillNode['data'] & {
  isHighlighted: boolean;
  isDimmed: boolean;
};

describe('useSkillHighlight', () => {
  const skills: SkillNode[] = [
    makeSkill('A', 'Fireball'),
    makeSkill('B', 'Ice Blast'),
    makeSkill('C', 'Flame Burst'),
  ];

  const edges: Edge[] = [makeEdge('A', 'C')];

  it('returns empty highlights when query is empty', () => {
    const { result } = renderHook(() => useSkillHighlight(skills, edges, ''));

    expect(result.current.highlightedNodeIds).toEqual(new Set());
    expect(result.current.highlightedEdgeIds).toEqual(new Set());

    // All skills should be NOT highlighted and NOT dimmed
    for (const skill of result.current.viewSkills) {
      const skillData = skill.data as HighlightedSkillData;
      expect(skillData.isHighlighted).toBe(false);
      expect(skillData.isDimmed).toBe(false);
    }

    // Prereqs should have default styling
    for (const edge of result.current.viewPrereqs) {
      expect(edge.style?.stroke).toBe('rgba(120,120,120,0.7)');
      expect(edge.style?.strokeWidth).toBe(1.5);
      expect(edge.style?.opacity).toBe(1);
    }
  });

  it('highlights skills matching the query and their ancestors', () => {
    const { result } = renderHook(() => useSkillHighlight(skills, edges, 'flame'));

    const viewSkills = result.current.viewSkills;

    const skillA = viewSkills.find((s) => s.id === 'A');
    const skillB = viewSkills.find((s) => s.id === 'B');
    const skillC = viewSkills.find((s) => s.id === 'C');

    expect(skillA).toBeDefined();
    if (!skillA) throw new Error('skillA missing');

    expect(skillB).toBeDefined();
    if (!skillB) throw new Error('skillB missing');

    expect(skillC).toBeDefined();
    if (!skillC) throw new Error('skillC missing');

    const dataA = skillA.data as HighlightedSkillData;
    const dataB = skillB.data as HighlightedSkillData;
    const dataC = skillC.data as HighlightedSkillData;

    expect(dataA.isHighlighted).toBe(true);
    expect(dataC.isHighlighted).toBe(true);
    expect(dataB.isDimmed).toBe(true);
  });

  it('applies highlighted and dimmed styling to edges', () => {
    const { result } = renderHook(() => useSkillHighlight(skills, edges, 'flame'));

    const viewEdges = result.current.viewPrereqs;
    const edgeAC = viewEdges.find((e) => e.id === 'A->C');
    expect(edgeAC).toBeDefined();
    if (!edgeAC) throw new Error('edge A->C missing');

    expect(edgeAC.style?.stroke).toBe('rgba(37,99,235,0.9)');
    expect(edgeAC.style?.strokeWidth).toBe(3);
    expect(edgeAC.style?.opacity).toBe(1);
    expect(edgeAC.markerEnd).toEqual({ type: MarkerType.ArrowClosed });
  });

  it('dims non-highlighted edges when some edges are highlighted', () => {
    const edges2: Edge[] = [makeEdge('A', 'C'), makeEdge('B', 'C')];

    const { result } = renderHook(() => useSkillHighlight(skills, edges2, 'flame'));

    const prereqs = result.current.viewPrereqs;
    const edgeAC = prereqs.find((e) => e.id === 'A->C');
    if (!edgeAC) throw new Error('Edge A->C missing');

    const edgeBC = prereqs.find((e) => e.id === 'B->C');
    if (!edgeBC) throw new Error('Edge B->C missing');

    // Both edges highlighted, no dimming
    expect(edgeAC.style?.opacity).toBe(1);
    expect(edgeBC.style?.opacity).toBe(1);
  });

  it('memoizes results properly when inputs do not change', () => {
    const { result, rerender } = renderHook(
      ({ skills, edges, query }) => useSkillHighlight(skills, edges, query),
      { initialProps: { skills, edges, query: 'flame' } },
    );

    const first = result.current;

    rerender({ skills, edges, query: 'flame' });

    const second = result.current;

    // reference equality ensures memoization
    expect(second.highlightedNodeIds).toBe(first.highlightedNodeIds);
    expect(second.highlightedEdgeIds).toBe(first.highlightedEdgeIds);
    expect(second.viewSkills).toBe(first.viewSkills);
    expect(second.viewPrereqs).toBe(first.viewPrereqs);
  });

  it('dims edges whose source/target nodes are not highlighted', () => {
    // Highlighted nodes will be A and C (flame -> C, ancestor -> A)
    // B is not highlighted
    const edges3: Edge[] = [
      makeEdge('A', 'C'), // highlighted
      makeEdge('A', 'B'), // NOT highlighted (B not in highlightedNodeIds)
    ];

    const { result } = renderHook(() => useSkillHighlight(skills, edges3, 'flame'));

    const viewEdges = result.current.viewPrereqs;

    const edgeAC = viewEdges.find((e) => e.id === 'A->C');
    if (!edgeAC) throw new Error('Edge A->C missing');

    const edgeAB = viewEdges.find((e) => e.id === 'A->B');
    if (!edgeAB) throw new Error('Edge A->B missing');

    // A->C highlighted
    expect(edgeAC.style?.opacity).toBe(1);

    // A->B dimmed
    expect(edgeAB.style?.opacity).toBe(0.25);
  });
});
