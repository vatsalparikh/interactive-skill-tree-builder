/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import type { Edge } from 'reactflow';

import type { SkillNodeType } from '../types';

export function canUnlock(nodes: SkillNodeType[], edges: Edge[], skillId: string): boolean {
  const prereqs = edges.filter((edge) => edge.target === skillId).map((edge) => edge.source);
  if (prereqs.length === 0) return true;

  return prereqs.every((id) => {
    const node = nodes.find((n) => n.id === id);
    return node?.data.isUnlocked === true;
  });
}

export function unlockSkill(nodes: SkillNodeType[], skillId: string): SkillNodeType[] {
  return nodes.map((node) =>
    node.id === skillId ? { ...node, data: { ...node.data, isUnlocked: true } } : node,
  );
}
