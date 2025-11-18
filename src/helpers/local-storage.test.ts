/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import type { Edge } from 'reactflow';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { SkillNode } from '../types';
import { loadTree, saveTree, type SkillTree } from './local-storage';

const STORAGE_KEY = 'skill-tree-state';

// Create a fully-typed mock localStorage
function mockLocalStorage() {
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

describe('local-storage utilities', () => {
  const mock = mockLocalStorage();

  // Replace global localStorage with our mock
  beforeEach(() => {
    mock.clear();
    // @ts-expect-error: We intentionally override global.localStorage in tests
    globalThis.localStorage = mock;
  });

  it('returns null when nothing is stored', () => {
    expect(loadTree()).toBeNull();
    expect(mock.getItem).toHaveBeenCalledWith(STORAGE_KEY);
  });

  it('returns null if stored JSON is invalid', () => {
    mock.setItem(STORAGE_KEY, '{ bad json');
    expect(loadTree()).toBeNull();
  });

  it('loads a valid SkillTree from storage', () => {
    const sampleTree: SkillTree = {
      skills: [
        {
          id: '1',
          type: 'skill',
          position: { x: 0, y: 0 },
          data: { name: 'A', description: 'desc', level: 1, isUnlocked: false },
        } satisfies SkillNode,
      ],
      prereqs: [{ id: '1->2', source: '1', target: '2' } satisfies Edge],
    };

    mock.setItem(STORAGE_KEY, JSON.stringify(sampleTree));

    const loaded = loadTree();

    expect(loaded).toEqual(sampleTree);
  });

  it('saves a SkillTree to storage', () => {
    const sampleTree: SkillTree = {
      skills: [],
      prereqs: [],
    };

    saveTree(sampleTree);

    expect(mock.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(sampleTree));
  });
});
