/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import type { Edge } from 'reactflow';

import type { SkillNode } from '../types';

/**
 * Determines whether a skill can be unlocked.
 * A skill is unlockable only if ALL its prerequisite skills
 * (incoming edges) are already unlocked.
 */
export function canUnlock(nodes: SkillNode[], edges: Edge[], skillId: string): boolean {
  const prereqs = edges.filter((edge) => edge.target === skillId).map((edge) => edge.source);
  if (prereqs.length === 0) return true;

  return prereqs.every((id) => {
    const node = nodes.find((node) => node.id === id);
    return node?.data.isUnlocked === true;
  });
}

/**
 * Marks a skill as unlocked by returning a NEW array of skills.
 * Pure function — no mutation.
 */
export function unlockSkill(nodes: SkillNode[], skillId: string): SkillNode[] {
  return nodes.map((node) =>
    node.id === skillId ? { ...node, data: { ...node.data, isUnlocked: true } } : node,
  );
}
