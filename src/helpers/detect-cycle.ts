import type { Edge } from 'reactflow';

export function buildGraph(edges: Edge[]): Record<string, string[]> {
  const graph: Record<string, string[]> = {};

  for (const { source, target } of edges) {
    if (!graph[source]) graph[source] = [];
    graph[source].push(target);
  }

  return graph;
}

export function hasPath(
  graph: Record<string, string[]>,
  current: string,
  goal: string,
  visited: Set<string> = new Set(),
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

export function hasCycle(edges: Edge[], source: string, target: string): boolean {
  const graph = buildGraph(edges);

  // add the new edge temporarily to graph
  if (!graph[source]) graph[source] = [];
  graph[source].push(target);

  return hasPath(graph, target, source);
}
