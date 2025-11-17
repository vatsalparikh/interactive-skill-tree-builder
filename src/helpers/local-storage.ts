/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import type { Edge } from 'reactflow';

import type { SkillNode } from '../types';

const STORAGE_KEY = 'skill-tree-state';

export interface SkillTree {
  skills: SkillNode[];
  prereqs: Edge[];
}

export function loadTree(): SkillTree | null {
  try {
    const tree = localStorage.getItem(STORAGE_KEY);
    if (!tree) return null;

    return JSON.parse(tree) as SkillTree;
  } catch {
    return null;
  }
}

export function saveTree(data: SkillTree): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
