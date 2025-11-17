/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import type { SkillFormData, SkillNode } from '../types';

export function createSkillNode(data: SkillFormData): SkillNode {
  return {
    id: crypto.randomUUID(),
    type: 'skill',
    position: { x: 200, y: 100 },
    data: {
      ...data,
      isUnlocked: false,
    },
    // TODO: fix styling to use tailwind css
    style: {
      width: 160,
      height: 80,
      backgroundColor: 'white',
      border: '2px solid black',
      borderRadius: '6px',
      boxSizing: 'border-box',
      padding: 12,
      overflow: 'auto',
    },
  };
}
