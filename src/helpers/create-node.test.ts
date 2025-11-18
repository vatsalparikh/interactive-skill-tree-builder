/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { SkillFormData } from '../types';
import { createSkillNode } from './create-node';

describe('createSkillNode', () => {
  const formData: SkillFormData = {
    name: 'Fireball',
    description: 'Launches a flaming projectile.',
    level: 3,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a valid SkillNode with randomized position and forced isUnlocked=false', () => {
    // deterministic UUID
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(
      'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    );

    // deterministic random offsets:
    // offsetX = (0.6 - 0.5) * 60 = +6
    // offsetY = (0.4 - 0.5) * 60 = -6
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.6).mockReturnValueOnce(0.4);

    const node = createSkillNode(formData);

    // 🔍 Node structural expectations
    expect(node.id).toBe('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    expect(node.type).toBe('skill');

    expect(node.position).toEqual({
      x: 200 + 6,
      y: 100 - 6,
    });

    // 🔍 Data merged + isUnlocked enforced
    expect(node.data).toEqual({
      name: 'Fireball',
      description: 'Launches a flaming projectile.',
      level: 3,
      isUnlocked: false,
    });
  });

  it('always overrides isUnlocked to false, even if provided in input formData', () => {
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('11111111-2222-3333-4444-44444444');
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // zero offsets

    // Extend the type in a safe, lint-approved way
    type BadFormData = SkillFormData & { isUnlocked: boolean };

    const badData: BadFormData = {
      ...formData,
      isUnlocked: true, // should be ignored
    };

    // Passing BadFormData where SkillFormData is expected is SAFE —
    // it is *more specific*, not less (structural subtyping).
    const node = createSkillNode(badData);

    expect(node.data.isUnlocked).toBe(false);
  });

  it('calls Math.random twice to compute offsets', () => {
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0.5);

    createSkillNode(formData);

    expect(spy).toHaveBeenCalledTimes(2);
  });
});
