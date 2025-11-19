/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { SkillTree } from '../../src/helpers/local-storage';
import { loadTree, saveTree } from '../../src/helpers/local-storage';

import type { SkillNode } from '../../src/types';
import type { Edge } from 'reactflow';

const STORAGE_KEY = 'skill-tree-state';

function createMockLocalStorage() {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string): string | null => {
      return key in store ? store[key] : null;
    }),

    setItem: vi.fn((key: string, value: string): void => {
      store[key] = value;
    }),

    clear: (): void => {
      store = {};
    },
  };
}

describe('local-storage', () => {
  const mock = createMockLocalStorage();

  beforeEach(() => {
    mock.clear();
    // @ts-expect-error overriding for test environment
    globalThis.localStorage = mock;
  });

  /* ---------------------------------------------------------- */
  /*                       loadTree tests                       */
  /* ---------------------------------------------------------- */

  it('returns null when no tree is stored', () => {
    expect(loadTree()).toBeNull();
    expect(mock.getItem).toHaveBeenCalledWith(STORAGE_KEY);
  });

  it('returns null when stored JSON is invalid', () => {
    mock.setItem(STORAGE_KEY, '{ bad json ');
    expect(loadTree()).toBeNull();
  });

  it('returns null when parsed value is not an object', () => {
    mock.setItem(STORAGE_KEY, JSON.stringify(42));
    expect(loadTree()).toBeNull();
  });

  it('returns null when skills/prereqs are not arrays', () => {
    const invalidShape = { skills: {}, prereqs: [] };
    mock.setItem(STORAGE_KEY, JSON.stringify(invalidShape));
    expect(loadTree()).toBeNull();
  });

  it('filters invalid skill nodes and returns null if none remain', () => {
    const tree = {
      skills: [
        // invalid: id is number
        { id: 123, data: { name: 'x', description: 'y' } },
      ],
      prereqs: [],
    };
    mock.setItem(STORAGE_KEY, JSON.stringify(tree));

    expect(loadTree()).toBeNull();
  });

  it('filters invalid edges and keeps valid ones', () => {
    const validSkill: SkillNode = {
      id: '1',
      type: 'skill',
      position: { x: 0, y: 0 },
      data: { name: 'A', description: 'desc', isUnlocked: false },
    };

    const tree = {
      skills: [validSkill],
      prereqs: [
        { id: 'a', source: '1', target: '2' }, // valid
        { id: 'b', target: '2' }, // invalid: missing source
      ],
    };

    mock.setItem(STORAGE_KEY, JSON.stringify(tree));

    const loaded = loadTree();

    expect(loaded).not.toBeNull();
    expect(loaded?.prereqs.length).toBe(1);
  });

  it('rejects skills with level values outside 0–999 even after sanitization', () => {
    const dirtySkill: SkillNode = {
      id: '1',
      type: 'skill',
      position: { x: 10, y: 20 },
      data: {
        name: '<b>Hello</b>',
        description: '<img src=x onerror=alert(1)>Cool',
        level: 2000, // invalid, should reject skill entirely
        isUnlocked: false,
      },
    };

    mock.setItem(STORAGE_KEY, JSON.stringify({ skills: [dirtySkill], prereqs: [] }));

    expect(loadTree()).toBeNull();
  });

  it('rejects skills with fractional levels', () => {
    const skill: SkillNode = {
      id: '1',
      type: 'skill',
      position: { x: 0, y: 0 },
      data: {
        name: 'Test',
        description: 'desc',
        level: 3.9, // invalid
        isUnlocked: false,
      },
    };

    const tree = { skills: [skill], prereqs: [] };
    mock.setItem(STORAGE_KEY, JSON.stringify(tree));

    expect(loadTree()).toBeNull();
  });

  it('keeps undefined level unchanged', () => {
    const skill: SkillNode = {
      id: 'x',
      type: 'skill',
      position: { x: 0, y: 0 },
      data: {
        name: 'Name',
        description: 'Desc',
        isUnlocked: false,
      },
    };

    const tree = { skills: [skill], prereqs: [] };
    mock.setItem(STORAGE_KEY, JSON.stringify(tree));

    const loaded = loadTree();
    expect(loaded?.skills[0].data.level).toBeUndefined();
  });

  it('returns sanitized SkillTree with valid data', () => {
    const skill: SkillNode = {
      id: '1',
      type: 'skill',
      position: { x: 5, y: 5 },
      data: {
        name: 'A',
        description: 'Desc',
        isUnlocked: true,
      },
    };

    const edge: Edge = { id: '1->2', source: '1', target: '2' };

    const tree: SkillTree = { skills: [skill], prereqs: [edge] };
    mock.setItem(STORAGE_KEY, JSON.stringify(tree));

    const loaded = loadTree();
    expect(loaded).not.toBeNull();
    expect(loaded?.skills.length).toBe(1);
    expect(loaded?.prereqs.length).toBe(1);
  });

  it('handles errors thrown inside loadTree catch block', () => {
    mock.getItem.mockImplementationOnce(() => {
      throw new Error('storage failure');
    });

    expect(loadTree()).toBeNull();
  });

  /* ---------------------------------------------------------- */
  /*                       saveTree tests                        */
  /* ---------------------------------------------------------- */

  it('saves valid SkillTree to storage', () => {
    const sample: SkillTree = { skills: [], prereqs: [] };

    saveTree(sample);
    expect(mock.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(sample));
  });

  it('handles errors thrown inside saveTree catch block', () => {
    mock.setItem.mockImplementationOnce(() => {
      throw new Error('write error');
    });

    const sample: SkillTree = { skills: [], prereqs: [] };

    // Should NOT throw
    expect(() => saveTree(sample)).not.toThrow();
  });

  it('rejects skill when value is not an object', () => {
    mock.setItem(STORAGE_KEY, JSON.stringify({ skills: [null], prereqs: [] }));
    expect(loadTree()).toBeNull();
  });

  it('rejects skill when id is not a string', () => {
    const bad = {
      skills: [
        {
          id: 123, // invalid
          type: 'skill',
          position: { x: 0, y: 0 },
          data: { name: 'A', description: 'B', isUnlocked: false },
        },
      ],
      prereqs: [],
    };
    mock.setItem(STORAGE_KEY, JSON.stringify(bad));
    expect(loadTree()).toBeNull();
  });

  it('rejects skill when data is not an object', () => {
    const bad = {
      skills: [
        {
          id: '1',
          type: 'skill',
          position: { x: 0, y: 0 },
          data: null, // invalid
        },
      ],
      prereqs: [],
    };
    mock.setItem(STORAGE_KEY, JSON.stringify(bad));
    expect(loadTree()).toBeNull();
  });

  it('rejects skill when name is not a string', () => {
    const bad = {
      skills: [
        {
          id: '1',
          type: 'skill',
          position: { x: 0, y: 0 },
          data: { name: 42, description: 'desc', isUnlocked: false },
        },
      ],
      prereqs: [],
    };
    mock.setItem(STORAGE_KEY, JSON.stringify(bad));
    expect(loadTree()).toBeNull();
  });

  it('rejects skill when description is not a string', () => {
    const bad = {
      skills: [
        {
          id: '1',
          type: 'skill',
          position: { x: 0, y: 0 },
          data: { name: 'A', description: 99, isUnlocked: false },
        },
      ],
      prereqs: [],
    };
    mock.setItem(STORAGE_KEY, JSON.stringify(bad));
    expect(loadTree()).toBeNull();
  });

  it('rejects skill when level is fractional', () => {
    const bad = {
      skills: [
        {
          id: '1',
          type: 'skill',
          position: { x: 0, y: 0 },
          data: { name: 'A', description: 'B', isUnlocked: false, level: 1.5 },
        },
      ],
      prereqs: [],
    };
    mock.setItem(STORAGE_KEY, JSON.stringify(bad));
    expect(loadTree()).toBeNull();
  });

  it('rejects skill when level is out of bounds', () => {
    const bad = {
      skills: [
        {
          id: '1',
          type: 'skill',
          position: { x: 0, y: 0 },
          data: { name: 'A', description: 'B', isUnlocked: false, level: 2000 },
        },
      ],
      prereqs: [],
    };
    mock.setItem(STORAGE_KEY, JSON.stringify(bad));
    expect(loadTree()).toBeNull();
  });

  it('rejects skill when isUnlocked is not a boolean', () => {
    const bad = {
      skills: [
        {
          id: '1',
          type: 'skill',
          position: { x: 0, y: 0 },
          data: { name: 'A', description: 'B', isUnlocked: 'yes' }, // invalid
        },
      ],
      prereqs: [],
    };
    mock.setItem(STORAGE_KEY, JSON.stringify(bad));
    expect(loadTree()).toBeNull();
  });

  /* ------------------------ EDGE VALIDATOR ------------------------ */

  it('rejects edge when value is not an object', () => {
    const validSkill: SkillNode = {
      id: '1',
      type: 'skill',
      position: { x: 0, y: 0 },
      data: { name: 'A', description: 'B', isUnlocked: false },
    };

    const badTree = {
      skills: [validSkill],
      prereqs: [null], // invalid edge
    };

    mock.setItem(STORAGE_KEY, JSON.stringify(badTree));

    // loads skill but no edges
    const loaded = loadTree();
    expect(loaded).not.toBeNull();
    expect(loaded?.prereqs).toHaveLength(0);
  });

  it('rejects edge when source is not a string', () => {
    const validSkill: SkillNode = {
      id: '1',
      type: 'skill',
      position: { x: 0, y: 0 },
      data: { name: 'A', description: 'B', isUnlocked: false },
    };

    const badTree = {
      skills: [validSkill],
      prereqs: [
        { id: 'e', source: 123, target: '2' }, // invalid
      ],
    };

    mock.setItem(STORAGE_KEY, JSON.stringify(badTree));

    const loaded = loadTree();
    expect(loaded).not.toBeNull();
    expect(loaded?.prereqs).toHaveLength(0);
  });

  it('rejects edge when target is not a string', () => {
    const validSkill: SkillNode = {
      id: '1',
      type: 'skill',
      position: { x: 0, y: 0 },
      data: { name: 'A', description: 'B', isUnlocked: false },
    };

    const badTree = {
      skills: [validSkill],
      prereqs: [
        { id: 'e', source: '1', target: 99 }, // invalid
      ],
    };

    mock.setItem(STORAGE_KEY, JSON.stringify(badTree));

    const loaded = loadTree();
    expect(loaded).not.toBeNull();
    expect(loaded?.prereqs).toHaveLength(0);
  });
});
