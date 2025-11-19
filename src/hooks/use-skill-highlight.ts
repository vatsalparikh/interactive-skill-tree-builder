/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { useMemo } from 'react';
import type { Edge } from 'reactflow';
import { MarkerType } from 'reactflow';

import { getHighlightedEdgeIds, getHighlightedNodeIds } from '../helpers/search-utils';
import type { SkillNode } from '../types';

// Computes highlighted nodes/edges and returns memoized view-model versions of skills and prereqs.
export function useSkillHighlight(skills: SkillNode[], prereqs: Edge[], query: string) {
  const highlightedNodeIds: Set<string> = useMemo(() => {
    // Determine which nodes match the search query and include all their ancestor nodes
    return getHighlightedNodeIds(skills, prereqs, query);
  }, [skills, prereqs, query]);

  // Highlight edges that belong to the prerequisite path of highlighted nodes.
  const highlightedEdgeIds: Set<string> = useMemo(() => {
    return getHighlightedEdgeIds(prereqs, highlightedNodeIds);
  }, [prereqs, highlightedNodeIds]);

  // Produce a view-model of skills with isHighlighted/isDimmed flags applied.
  const viewSkills: SkillNode[] = useMemo(() => {
    const hasHighlights = highlightedNodeIds.size > 0;
    return skills.map((skill) => {
      const isHighlighted = highlightedNodeIds.has(skill.id);
      const isDimmed = hasHighlights && !isHighlighted;
      return {
        ...skill,
        data: {
          ...skill.data,
          isHighlighted,
          isDimmed,
        },
      };
    });
  }, [skills, highlightedNodeIds]);

  // Apply highlight/dim styling to prerequisite edges for visual emphasis.
  const viewPrereqs: Edge[] = useMemo(() => {
    const hasHighlightedEdges = highlightedEdgeIds.size > 0;
    return prereqs.map((e) => {
      const isHighlighted = highlightedEdgeIds.has(e.id);
      const isDimming = hasHighlightedEdges && !isHighlighted;
      return {
        ...e,
        style: {
          stroke: isHighlighted ? 'rgba(37,99,235,0.9)' : 'rgba(120,120,120,0.7)',
          strokeWidth: isHighlighted ? 3 : 1.5,
          opacity: isDimming ? 0.25 : 1,
        },
        markerEnd: { type: MarkerType.ArrowClosed },
      };
    });
  }, [prereqs, highlightedEdgeIds]);

  return {
    highlightedNodeIds,
    highlightedEdgeIds,
    viewSkills,
    viewPrereqs,
  };
}

export default useSkillHighlight;
