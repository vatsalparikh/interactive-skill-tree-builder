/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import type { Connection, Edge } from 'reactflow';
import { describe, expect, it } from 'vitest';

import {
  addConnection,
  createEdge,
  isDuplicateEdge,
  isSelfLoop,
  validateConnection,
} from '../../src/helpers/edge-utils';

function makeConn(source: string | null, target: string | null): Connection {
  return {
    source,
    target,
    sourceHandle: null,
    targetHandle: null,
  };
}

describe('createEdge', () => {
  it('creates an edge with correct id, source, and target', () => {
    const edge = createEdge('A', 'B');

    expect(edge).toEqual({
      id: 'A->B',
      source: 'A',
      target: 'B',
    });
  });
});

describe('isSelfLoop', () => {
  it('returns true when source === target', () => {
    expect(isSelfLoop('A', 'A')).toBe(true);
  });

  it('returns false when source !== target', () => {
    expect(isSelfLoop('A', 'B')).toBe(false);
  });
});

describe('isDuplicateEdge', () => {
  const edges: Edge[] = [
    { id: 'A->B', source: 'A', target: 'B' },
    { id: 'B->C', source: 'B', target: 'C' },
  ];

  it('returns true when an identical edge exists', () => {
    expect(isDuplicateEdge(edges, 'A', 'B')).toBe(true);
  });

  it('returns false when no identical edge exists', () => {
    expect(isDuplicateEdge(edges, 'A', 'C')).toBe(false);
  });
});

describe('validateConnection', () => {
  const edges: Edge[] = [{ id: 'A->B', source: 'A', target: 'B' }];

  it('returns false when sourceId is missing', () => {
    const conn = makeConn(null, 'B');
    expect(validateConnection(edges, conn)).toBe(false);
  });

  it('returns false when targetId is missing', () => {
    const conn = makeConn('A', null);
    expect(validateConnection(edges, conn)).toBe(false);
  });

  it('returns false on a self-loop', () => {
    const conn = makeConn('A', 'A');
    expect(validateConnection(edges, conn)).toBe(false);
  });

  it('returns false on duplicate edge', () => {
    const conn = makeConn('A', 'B');
    expect(validateConnection(edges, conn)).toBe(false);
  });

  it('returns true on a valid new edge', () => {
    const conn = makeConn('B', 'C');
    expect(validateConnection(edges, conn)).toBe(true);
  });
});

describe('addConnection', () => {
  const edges: Edge[] = [{ id: 'A->B', source: 'A', target: 'B' }];

  it('returns original edges if source is missing', () => {
    const conn = makeConn(null, 'B');
    expect(addConnection(edges, conn)).toEqual(edges);
  });

  it('returns original edges if target is missing', () => {
    const conn = makeConn('A', null);
    expect(addConnection(edges, conn)).toEqual(edges);
  });

  it('does not add a duplicate edge', () => {
    const conn = makeConn('A', 'B');
    expect(addConnection(edges, conn)).toEqual(edges);
  });

  it('does not add a self-loop', () => {
    const conn = makeConn('A', 'A');
    expect(addConnection(edges, conn)).toEqual(edges);
  });

  it('adds a valid edge', () => {
    const conn = makeConn('B', 'C');
    const result = addConnection(edges, conn);

    expect(result).toEqual([
      { id: 'A->B', source: 'A', target: 'B' },
      { id: 'B->C', source: 'B', target: 'C' },
    ]);
  });
});
