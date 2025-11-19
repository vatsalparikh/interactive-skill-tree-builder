/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import type { Edge } from 'reactflow';

import type { SkillNode } from '../types';
import { sanitizeText } from './sanitize-input';

const STORAGE_KEY = 'skill-tree-state';

export interface SkillTree {
  skills: SkillNode[];
  prereqs: Edge[];
}

/* -------------------------------------------------------------------------- */
/*                                VALIDATION                                  */
/* -------------------------------------------------------------------------- */

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isValidSkillNode(value: unknown): value is SkillNode {
  if (!isObject(value)) return false;

  // id
  if (typeof value.id !== 'string') return false;

  // data
  if (!isObject(value.data)) return false;

  const data = value.data;

  // required strings
  if (typeof data.name !== 'string') return false;
  if (typeof data.description !== 'string') return false;

  // optional numeric level
  if (
    data.level !== undefined &&
    !(
      typeof data.level === 'number' &&
      Number.isInteger(data.level) &&
      data.level >= 0 &&
      data.level <= 999
    )
  ) {
    return false;
  }

  // optional boolean isUnlocked
  if (data.isUnlocked !== undefined && typeof data.isUnlocked !== 'boolean') {
    return false;
  }

  return true;
}

function isValidEdge(value: unknown): value is Edge {
  if (!isObject(value)) return false;
  if (typeof value.source !== 'string') return false;
  if (typeof value.target !== 'string') return false;
  return true;
}

/* -------------------------------------------------------------------------- */
/*                                  LOAD / SAVE                               */
/* -------------------------------------------------------------------------- */

export function loadTree(): SkillTree | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);

    if (!isObject(parsed)) return null;

    const skillsRaw = parsed.skills;
    const prereqsRaw = parsed.prereqs;

    if (!Array.isArray(skillsRaw) || !Array.isArray(prereqsRaw)) {
      return null;
    }

    const skills = skillsRaw.filter(isValidSkillNode).map((skill) => ({
      ...skill,
      data: {
        ...skill.data,
        name: sanitizeText(skill.data.name).slice(0, 50),
        description: sanitizeText(skill.data.description).slice(0, 150),
        level:
          skill.data.level !== undefined
            ? Math.min(999, Math.max(0, Math.floor(skill.data.level)))
            : undefined,
      },
    }));
    const prereqs = prereqsRaw.filter(isValidEdge);

    if (skills.length === 0) return null;

    return { skills, prereqs };
  } catch (err) {
    console.warn('[loadTree] Failed to parse stored state', err);
    return null;
  }
}

export function saveTree(data: SkillTree): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('[saveTree] Failed to save skill tree', err);
  }
}

export function resetTree(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('[resetTree] Failed to reset skill tree', err);
  }
}
