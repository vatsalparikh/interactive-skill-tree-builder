/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import type { Edge } from 'reactflow';

import type { SkillNode } from '../types';

export function getAncestorNodeIds(edges: Edge[], targets: Set<string>) {
  const ancestors = new Set<string>();

  for (const id of targets) {
    if (!ancestors.has(id)) dfs(id); // if matching node id already in ancestor, don't do dfs on it
  }

  function dfs(nodeId: string): void {
    for (const edge of edges) {
      if (edge.target === nodeId && !ancestors.has(edge.source)) {
        ancestors.add(edge.source);
        dfs(edge.source);
      }
    }
  }

  return ancestors;
}

export function getHighlightedNodeIds(
  skills: SkillNode[],
  edges: Edge[],
  query: string,
): Set<string> {
  const trimmedQuery = query.trim().toLowerCase();
  if (!trimmedQuery) return new Set();

  const matches = new Set(
    skills
      .filter((skill) => skill.data.name.toLocaleLowerCase().includes(trimmedQuery))
      .map((skill) => skill.id),
  );
  if (matches.size === 0) return new Set();

  const ancestors = getAncestorNodeIds(edges, matches);
  return new Set([...matches, ...ancestors]);
}

export function getHighlightedEdgeIds(edges: Edge[], highlightedNodeIds: Set<string>): Set<string> {
  const highlightedEdges = new Set<string>();

  for (const edge of edges) {
    if (highlightedNodeIds.has(edge.source) && highlightedNodeIds.has(edge.target)) {
      highlightedEdges.add(edge.id);
    }
  }

  return highlightedEdges;
}
