/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { useMemo } from 'react';
import type { Edge } from 'reactflow';
import { MarkerType } from 'reactflow';

import { getHighlightedEdgeIds, getHighlightedNodeIds } from '../helpers/search-utils';
import type { SkillNode } from '../types';

export function useSkillHighlight(skills: SkillNode[], prereqs: Edge[], query: string) {
  const highlightedNodeIds: Set<string> = useMemo(() => {
    // reuse existing helper (which already does filtering + ancestor lookup)
    // but if you prefer, call getAncestorNodeIds separately. Using existing helper keeps this minimal.
    return getHighlightedNodeIds(skills, prereqs, query);
  }, [skills, prereqs, query]);

  const highlightedEdgeIds: Set<string> = useMemo(() => {
    return getHighlightedEdgeIds(prereqs, highlightedNodeIds);
  }, [prereqs, highlightedNodeIds]);

  const viewSkills: SkillNode[] = useMemo(() => {
    const hasHighlights = highlightedNodeIds.size > 0;
    return skills.map((n) => {
      const isHighlighted = highlightedNodeIds.has(n.id);
      const isDimmed = hasHighlights && !isHighlighted;
      return {
        ...n,
        data: {
          ...n.data,
          isHighlighted,
          isDimmed,
        },
      };
    });
  }, [skills, highlightedNodeIds]);

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
