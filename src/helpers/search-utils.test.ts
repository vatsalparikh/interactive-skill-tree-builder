/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import type { Edge } from 'reactflow';
import { describe, expect, it } from 'vitest';

import type { SkillNode } from '../types';
import { getAncestorNodeIds, getHighlightedEdgeIds, getHighlightedNodeIds } from './search-utils';

function makeSkill(id: string, name: string, extras?: Partial<SkillNode['data']>): SkillNode {
  return {
    id,
    type: 'skill',
    position: { x: 0, y: 0 },
    data: {
      name,
      description: '',
      level: 1,
      isUnlocked: false,
      ...(extras ?? {}),
    },
  };
}

describe('getAncestorNodeIds', () => {
  const edges: Edge[] = [
    { id: 'A->B', source: 'A', target: 'B' },
    { id: 'B->C', source: 'B', target: 'C' },
    { id: 'C->D', source: 'C', target: 'D' },
  ];

  it('returns direct ancestors', () => {
    const result = getAncestorNodeIds(edges, new Set(['B']));
    expect(result).toEqual(new Set(['A']));
  });

  it('returns multiple ancestors recursively', () => {
    const result = getAncestorNodeIds(edges, new Set(['D']));
    expect(result).toEqual(new Set(['C', 'B', 'A']));
  });

  it('returns empty for nodes with no ancestors', () => {
    const result = getAncestorNodeIds(edges, new Set(['A']));
    expect(result).toEqual(new Set());
  });

  it('dedupes ancestors to avoid repeated DFS', () => {
    const edges2: Edge[] = [
      { id: 'A->C', source: 'A', target: 'C' },
      { id: 'B->C', source: 'B', target: 'C' },
    ];

    const result = getAncestorNodeIds(edges2, new Set(['C']));
    expect(result).toEqual(new Set(['A', 'B']));
  });

  it('skips dfs for a target that is already an ancestor of another target', () => {
    const edges: Edge[] = [
      { id: 'A->B', source: 'A', target: 'B' },
      { id: 'B->C', source: 'B', target: 'C' },
    ];

    // Order matters: C first, then A
    const targets = new Set(['C', 'A']);

    const result = getAncestorNodeIds(edges, targets);

    // DFS(C) discovers B and A as ancestors
    // When loop reaches id = 'A', ancestors.has('A') === true
    expect(result).toEqual(new Set(['B', 'A']));
  });
});

describe('getHighlightedNodeIds', () => {
  const skills: SkillNode[] = [
    makeSkill('A', 'Fireball'),
    makeSkill('B', 'Ice Blast'),
    makeSkill('C', 'Flame Burst'),
    makeSkill('D', 'Mana Surge'),
  ];

  const edges: Edge[] = [
    { id: 'A->C', source: 'A', target: 'C' },
    { id: 'C->D', source: 'C', target: 'D' },
  ];

  it('returns empty set when query is empty or whitespace', () => {
    expect(getHighlightedNodeIds(skills, edges, '')).toEqual(new Set());
    expect(getHighlightedNodeIds(skills, edges, '   ')).toEqual(new Set());
  });

  it('returns empty set when there are no matches', () => {
    expect(getHighlightedNodeIds(skills, edges, 'zzz')).toEqual(new Set());
  });

  it('returns matched node ids (case-insensitive)', () => {
    const result = getHighlightedNodeIds(skills, edges, 'fire');
    expect(result).toEqual(new Set(['A']));
  });

  it('includes ancestors of matched nodes', () => {
    // ancestors: A (A->C)
    const result = getHighlightedNodeIds(skills, edges, 'flame');
    expect(result).toEqual(new Set(['C', 'A']));
  });

  it('returns all matching nodes + all their ancestors', () => {
    const skills2: SkillNode[] = [
      makeSkill('X', 'Power Strike'),
      makeSkill('Y', 'Strike Mastery'),
      makeSkill('Z', 'Strike Aura'),
    ];

    const edges2: Edge[] = [
      { id: 'X->Y', source: 'X', target: 'Y' },
      { id: 'Y->Z', source: 'Y', target: 'Z' },
    ];

    const result = getHighlightedNodeIds(skills2, edges2, 'strike');

    // Matches: X, Y, Z
    expect(result).toEqual(new Set(['X', 'Y', 'Z']));
  });
});

describe('getHighlightedEdgeIds', () => {
  const edges: Edge[] = [
    { id: 'A->B', source: 'A', target: 'B' },
    { id: 'B->C', source: 'B', target: 'C' },
    { id: 'C->D', source: 'C', target: 'D' },
  ];

  it('returns edges where both source and target are highlighted', () => {
    const highlight = new Set(['A', 'B', 'C']);
    const result = getHighlightedEdgeIds(edges, highlight);

    expect(result).toEqual(new Set(['A->B', 'B->C']));
  });

  it('returns empty set when no edges fully match', () => {
    const highlight = new Set(['A']);
    const result = getHighlightedEdgeIds(edges, highlight);

    expect(result).toEqual(new Set());
  });

  it('returns all edges when all nodes are highlighted', () => {
    const highlight = new Set(['A', 'B', 'C', 'D']);
    const result = getHighlightedEdgeIds(edges, highlight);

    expect(result).toEqual(new Set(['A->B', 'B->C', 'C->D']));
  });
});
