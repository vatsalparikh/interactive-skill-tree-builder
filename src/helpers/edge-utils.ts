/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import type { Connection, Edge } from 'reactflow';

export function createEdge(source: string, target: string): Edge {
  return {
    id: `${source}->${target}`,
    source,
    target,
  };
}

export function isSelfLoop(source: string, target: string): boolean {
  return source === target;
}

export function isDuplicateEdge(edges: Edge[], source: string, target: string): boolean {
  return edges.some((e) => e.source === source && e.target === target);
}

export function validateConnection(edges: Edge[], conn: Connection): boolean {
  const sourceId = conn.source;
  const targetId = conn.target;

  if (!sourceId || !targetId) return false;
  if (isSelfLoop(sourceId, targetId)) return false;
  if (isDuplicateEdge(edges, sourceId, targetId)) return false;

  return true;
}

/**
 * Ensures an edge is valid before adding it:
 * - Rejects self-loops
 * - Rejects duplicates
 * - Ensures well-formed connection object
 */
export function addConnection(edges: Edge[], conn: Connection): Edge[] {
  const sourceId = conn.source;
  const targetId = conn.target;

  if (!sourceId || !targetId) return edges;
  if (!validateConnection(edges, conn)) return edges;

  return [...edges, createEdge(sourceId, targetId)];
}
