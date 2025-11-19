/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

/**
 * Detects whether adding an edge (source to target) would create a cycle.
 * This performs a DFS from the target to see if the source is reachable.
 * If it is, adding this edge would form a loop.
 */

import type { Edge } from 'reactflow';

// Convert the flat edge list into an adjacency list for fast graph traversal.
export function buildGraph(edges: Edge[]): Record<string, string[]> {
  const graph: Record<string, string[]> = {};

  for (const { source, target } of edges) {
    graph[source] = graph[source] ?? [];
    graph[source].push(target);
  }

  return graph;
}

// Depth-first search to check if source is reachable from target in the graph.
export function hasPath(
  graph: Record<string, string[]>,
  current: string,
  goal: string,
  visited = new Set<string>(),
): boolean {
  if (current === goal) return true;

  visited.add(current);

  for (const neighbor of graph[current] ?? []) {
    if (!visited.has(neighbor)) {
      if (hasPath(graph, neighbor, goal, visited)) {
        return true;
      }
    }
  }

  return false;
}

// Detect whether adding a new edge would create a cycle by checking if target to source becomes reachable.
export function hasCycle(edges: Edge[], source: string, target: string): boolean {
  const graph = buildGraph(edges);

  // add the new edge temporarily to graph
  graph[source] = graph[source] ?? [];
  graph[source].push(target);

  return hasPath(graph, target, source);
}
