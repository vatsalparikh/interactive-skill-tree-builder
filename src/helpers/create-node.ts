/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import type { SkillFormData, SkillNode } from '../types';

export function createSkillNode(data: SkillFormData): SkillNode {
  // this randomizes the position of the nodes after creation
  // to avoid complete node overlap
  const offsetX = (Math.random() - 0.5) * 60; // -30 to +30
  const offsetY = (Math.random() - 0.5) * 60;

  return {
    id: crypto.randomUUID(),
    type: 'skill',
    position: { x: 200 + offsetX, y: 100 + offsetY },
    data: {
      ...data,
      isUnlocked: false,
    },
  };
}
