/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import type { Edge } from 'reactflow';
import { describe, expect, it } from 'vitest';

import type { SkillNode } from '../../src/types';
import { canUnlock, unlockSkill } from '../../src/helpers/unlock-utils';

function makeSkill(id: string, isUnlocked: boolean): SkillNode {
  return {
    id,
    type: 'skill',
    position: { x: 0, y: 0 },
    data: {
      name: id,
      description: '',
      level: 1,
      isUnlocked,
    },
  };
}

describe('canUnlock', () => {
  const edges: Edge[] = [
    { id: 'A->B', source: 'A', target: 'B' },
    { id: 'C->B', source: 'C', target: 'B' },
  ];

  it('returns true when a skill has no prerequisites', () => {
    const result = canUnlock([], [], 'X');
    expect(result).toBe(true);
  });

  it('returns false when prerequisites exist and none are unlocked', () => {
    const nodes = [makeSkill('A', false), makeSkill('C', false)];
    const result = canUnlock(nodes, edges, 'B');
    expect(result).toBe(false);
  });

  it('returns false when some prerequisites are unlocked but not all', () => {
    const nodes = [makeSkill('A', true), makeSkill('C', false)];
    const result = canUnlock(nodes, edges, 'B');
    expect(result).toBe(false);
  });

  it('returns true when all prerequisites are unlocked', () => {
    const nodes = [makeSkill('A', true), makeSkill('C', true)];
    const result = canUnlock(nodes, edges, 'B');
    expect(result).toBe(true);
  });

  it('returns false if a prereq node does not exist in the list', () => {
    const nodes = [makeSkill('A', true)]; // missing "C"
    const result = canUnlock(nodes, edges, 'B');
    expect(result).toBe(false);
  });
});

describe('unlockSkill', () => {
  it('unlocks the specified skill', () => {
    const nodes = [makeSkill('A', false), makeSkill('B', false)];

    const result = unlockSkill(nodes, 'A');
    const nodeA = result.find((node) => node.id === 'A');
    const nodeB = result.find((node) => node.id === 'B');

    expect(nodeA?.data.isUnlocked).toBe(true);
    expect(nodeB?.data.isUnlocked).toBe(false);
  });

  it('returns new objects without mutating original nodes', () => {
    const original = [makeSkill('A', false)];
    const result = unlockSkill(original, 'A');

    // original must remain unchanged
    expect(original[0].data.isUnlocked).toBe(false);

    // result must reflect changes
    expect(result[0].data.isUnlocked).toBe(true);

    // different references ensure immutability
    expect(result[0]).not.toBe(original[0]);
    expect(result[0].data).not.toBe(original[0].data);
  });
});
