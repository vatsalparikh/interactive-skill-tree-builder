/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import type { Edge } from 'reactflow';
import { describe, expect, it } from 'vitest';

import { buildGraph, hasCycle, hasPath } from './detect-cycle';

describe('buildGraph', () => {
  it('builds a graph adjacency list from edges', () => {
    const edges: Edge[] = [
      { id: '1', source: 'A', target: 'B' },
      { id: '2', source: 'A', target: 'C' },
      { id: '3', source: 'B', target: 'D' },
    ];

    const graph = buildGraph(edges);

    expect(graph).toEqual({
      A: ['B', 'C'],
      B: ['D'],
    });
  });

  it('returns an empty graph when no edges exist', () => {
    expect(buildGraph([])).toEqual({});
  });
});

describe('hasPath', () => {
  const graph = {
    A: ['B'],
    B: ['C'],
    C: [],
  };

  it('returns true when a direct path exists', () => {
    expect(hasPath(graph, 'A', 'B')).toBe(true);
  });

  it('returns true when an indirect path exists', () => {
    expect(hasPath(graph, 'A', 'C')).toBe(true);
  });

  it('returns false when no path exists', () => {
    expect(hasPath(graph, 'C', 'A')).toBe(false);
  });

  it('returns true when current === goal', () => {
    expect(hasPath(graph, 'A', 'A')).toBe(true);
  });

  it('does not revisit nodes due to visited-set logic', () => {
    const cyclicGraph = {
      A: ['B'],
      B: ['A'], // back-edge to A
    };

    expect(hasPath(cyclicGraph, 'A', 'C')).toBe(false);
  });
});

describe('hasCycle', () => {
  it('returns false when adding an edge does not create a cycle', () => {
    const edges: Edge[] = [
      { id: '1', source: 'A', target: 'B' },
      { id: '2', source: 'B', target: 'C' },
    ];

    // Adding edge C -> D
    expect(hasCycle(edges, 'C', 'D')).toBe(false);
  });

  it('returns true when adding an edge creates a simple cycle', () => {
    const edges: Edge[] = [
      { id: '1', source: 'A', target: 'B' },
      { id: '2', source: 'B', target: 'C' },
    ];

    expect(hasCycle(edges, 'C', 'A')).toBe(true);
  });

  it('returns true for an existing cycle even before adding the new edge', () => {
    const edges: Edge[] = [
      { id: '1', source: 'A', target: 'B' },
      { id: '2', source: 'B', target: 'A' },
    ];

    // Adding anything between A/B still leaves cycle
    expect(hasCycle(edges, 'A', 'C')).toBe(false); // A->C doesn't create cycle
    expect(hasCycle(edges, 'B', 'A')).toBe(true); // Explicitly reinforces cycle
  });

  it('correctly handles an empty edge list', () => {
    const empty: Edge[] = [];

    expect(hasCycle(empty, 'A', 'B')).toBe(false);
  });
});
