/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { act, renderHook } from '@testing-library/react';
import type { Connection, Edge, EdgeChange, NodeChange } from 'reactflow';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { SkillNode } from '../../src/types';

/* ---------------------------------------------------------
 * Mock all imported helper modules
 * -------------------------------------------------------- */
vi.mock('../../src/helpers/local-storage', () => ({
  loadTree: vi.fn(),
  saveTree: vi.fn(),
}));

vi.mock('../../src/helpers/create-node', () => ({
  createSkillNode: vi.fn(),
}));

vi.mock('../../src/helpers/detect-cycle', () => ({
  hasCycle: vi.fn(),
}));

vi.mock('../../src/helpers/edge-utils', () => ({
  validateConnection: vi.fn(),
  addConnection: vi.fn(),
}));

vi.mock('../../src/helpers/toast-utils', () => ({
  showErrorToast: vi.fn(),
}));

vi.mock('../../src/components/success-toast', () => ({
  showSuccessToast: vi.fn(),
}));

vi.mock('../../src/helpers/unlock-utils', () => ({
  canUnlock: vi.fn(),
  unlockSkill: vi.fn(),
}));

// Typed mock for ReactFlow helpers
vi.mock('reactflow', () => ({
  applyNodeChanges: vi.fn((changes: NodeChange[], nodes: SkillNode[]) => nodes),
  applyEdgeChanges: vi.fn((changes: EdgeChange[], edges: Edge[]) => edges),
}));

/* ---------------------------------------------------------
 * Import mocks after mock definition
 * -------------------------------------------------------- */
import { applyEdgeChanges, applyNodeChanges } from 'reactflow';
import type { MockedFunction } from 'vitest';

import { showSuccessToast } from '../../src/components/success-toast';
import { createSkillNode } from '../../src/helpers/create-node';
import { hasCycle } from '../../src/helpers/detect-cycle';
import { addConnection, validateConnection } from '../../src/helpers/edge-utils';
import { loadTree, saveTree } from '../../src/helpers/local-storage';
import { showErrorToast } from '../../src/helpers/toast-utils';
import { canUnlock, unlockSkill } from '../../src/helpers/unlock-utils';

/* ---------------------------------------------------------
 * Strongly typed mocked functions
 * -------------------------------------------------------- */
const mockedLoadTree = loadTree as MockedFunction<typeof loadTree>;
const mockedSaveTree = saveTree as MockedFunction<typeof saveTree>;
const mockedCreateSkillNode = createSkillNode as MockedFunction<typeof createSkillNode>;
const mockedHasCycle = hasCycle as MockedFunction<typeof hasCycle>;
const mockedValidateConnection = validateConnection as MockedFunction<typeof validateConnection>;
const mockedAddConnection = addConnection as MockedFunction<typeof addConnection>;
const mockedShowErrorToast = showErrorToast as MockedFunction<typeof showErrorToast>;
const mockedShowSuccessToast = showSuccessToast as MockedFunction<typeof showSuccessToast>;
const mockedCanUnlock = canUnlock as MockedFunction<typeof canUnlock>;
const mockedUnlockSkill = unlockSkill as MockedFunction<typeof unlockSkill>;
const mockedApplyNodeChanges = applyNodeChanges as MockedFunction<typeof applyNodeChanges>;
const mockedApplyEdgeChanges = applyEdgeChanges as MockedFunction<typeof applyEdgeChanges>;

/* ---------------------------------------------------------
 * Test helpers
 * -------------------------------------------------------- */
function makeSkillNode(id: string, name = id): SkillNode {
  return {
    id,
    type: 'skill',
    position: { x: 0, y: 0 },
    data: {
      name,
      description: '',
      level: 1,
      isUnlocked: false,
    },
  };
}

function makeEdge(source: string, target: string, id?: string): Edge {
  return {
    id: id ?? `${source}->${target}`,
    source,
    target,
  };
}

/* ---------------------------------------------------------
 * Test setup
 * -------------------------------------------------------- */
beforeEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

afterEach(() => {
  vi.restoreAllMocks();
});

/* ---------------------------------------------------------
 * Tests
 * -------------------------------------------------------- */
describe('useSkillTree', () => {
  it('initializes from loadTree when present', async () => {
    const saved = {
      skills: [makeSkillNode('s1', 'SavedSkill')],
      prereqs: [makeEdge('s1', 's2')],
    };
    mockedLoadTree.mockReturnValue(saved);

    const mod = await import('../../src/hooks/use-skill-tree');
    const useSkillTree = mod.default;

    const { result } = renderHook(() => useSkillTree());

    expect(result.current.skills).toEqual(saved.skills);
    expect(result.current.prereqs).toEqual(saved.prereqs);
  });

  it('initializes to empty arrays when loadTree returns null', async () => {
    mockedLoadTree.mockReturnValue(null);

    const mod = await import('../../src/hooks/use-skill-tree');
    const useSkillTree = mod.default;

    const { result } = renderHook(() => useSkillTree());
    expect(result.current.skills).toEqual([]);
    expect(result.current.prereqs).toEqual([]);
  });

  it('persists state using saveTree when skills change', async () => {
    mockedLoadTree.mockReturnValue(null);

    const createdNode = makeSkillNode('created', 'Created');
    mockedCreateSkillNode.mockReturnValue(createdNode);

    const mod = await import('../../src/hooks/use-skill-tree');
    const useSkillTree = mod.default;

    const { result } = renderHook(() => useSkillTree());

    act(() => {
      result.current.handleAddSkill({ name: 'Created', description: '' });
    });

    expect(mockedSaveTree).toHaveBeenCalled();
    const lastCall = mockedSaveTree.mock.calls.at(-1);
    expect(lastCall).toBeTruthy(); // or toBeDefined()
  });

  it('handleNodesChange applies node changes', async () => {
    mockedLoadTree.mockReturnValue(null);

    mockedApplyNodeChanges.mockImplementationOnce(() => [makeSkillNode('x')]);

    const mod = await import('../../src/hooks/use-skill-tree');
    const useSkillTree = mod.default;

    const { result } = renderHook(() => useSkillTree());

    const changes: NodeChange[] = [{ id: 'x', type: 'position' }];

    act(() => {
      result.current.handleNodesChange(changes);
    });

    expect(mockedApplyNodeChanges).toHaveBeenCalledWith(changes, []);
    expect(result.current.skills).toEqual([makeSkillNode('x')]);
    expect(mockedSaveTree).toHaveBeenCalled();
  });

  it('handleEdgesChange applies edge changes', async () => {
    mockedLoadTree.mockReturnValue(null);

    mockedApplyEdgeChanges.mockImplementationOnce(() => [makeEdge('A', 'B')]);

    const mod = await import('../../src/hooks/use-skill-tree');
    const useSkillTree = mod.default;

    const { result } = renderHook(() => useSkillTree());

    const changes: EdgeChange[] = [{ id: 'e1', type: 'remove' }];

    act(() => {
      result.current.handleEdgesChange(changes);
    });

    expect(mockedApplyEdgeChanges).toHaveBeenCalledWith(changes, []);
    expect(result.current.prereqs).toEqual([makeEdge('A', 'B')]);
    expect(mockedSaveTree).toHaveBeenCalled();
  });

  /* ---------------------------------------------------------
   * handleConnect
   * -------------------------------------------------------- */
  describe('handleConnect', () => {
    const connection: Connection = {
      source: 'A',
      target: 'B',
      sourceHandle: null,
      targetHandle: null,
    };

    it('does nothing when source or target missing', async () => {
      mockedLoadTree.mockReturnValue(null);

      const mod = await import('../../src/hooks/use-skill-tree');
      const useSkillTree = mod.default;

      const { result } = renderHook(() => useSkillTree());

      act(() => {
        result.current.handleConnect({
          source: null,
          target: 'B',
          sourceHandle: null,
          targetHandle: null,
        });
      });

      expect(mockedValidateConnection).not.toHaveBeenCalled();
      expect(mockedShowErrorToast).not.toHaveBeenCalled();
    });

    it('shows error when connection invalid', async () => {
      mockedLoadTree.mockReturnValue(null);
      mockedValidateConnection.mockReturnValue(false);

      const mod = await import('../../src/hooks/use-skill-tree');
      const useSkillTree = mod.default;

      const { result } = renderHook(() => useSkillTree());

      act(() => {
        result.current.handleConnect(connection);
      });

      expect(mockedValidateConnection).toHaveBeenCalledWith([], connection);
      expect(mockedShowErrorToast).toHaveBeenCalledWith(
        'Invalid connection (self-loop or duplicate)',
      );
    });

    it('shows error when connection introduces a cycle', async () => {
      mockedLoadTree.mockReturnValue(null);
      mockedValidateConnection.mockReturnValue(true);
      mockedHasCycle.mockReturnValue(true);

      const mod = await import('../../src/hooks/use-skill-tree');
      const useSkillTree = mod.default;

      const { result } = renderHook(() => useSkillTree());

      act(() => {
        result.current.handleConnect(connection);
      });

      expect(mockedHasCycle).toHaveBeenCalled();
      expect(mockedShowErrorToast).toHaveBeenCalledWith('Cannot create circular prerequisites');
    });

    it('adds connection when valid and not cyclic', async () => {
      mockedLoadTree.mockReturnValue(null);
      mockedValidateConnection.mockReturnValue(true);
      mockedHasCycle.mockReturnValue(false);

      const newEdges = [makeEdge('A', 'B')];
      mockedAddConnection.mockReturnValue(newEdges);

      const mod = await import('../../src/hooks/use-skill-tree');
      const useSkillTree = mod.default;

      const { result } = renderHook(() => useSkillTree());

      act(() => {
        result.current.handleConnect(connection);
      });

      expect(mockedAddConnection).toHaveBeenCalledWith([], connection);
      expect(result.current.prereqs).toEqual(newEdges);
      expect(mockedSaveTree).toHaveBeenCalled();
    });
  });

  /* ---------------------------------------------------------
   * handleUnlock
   * -------------------------------------------------------- */
  describe('handleUnlock', () => {
    it('does nothing when skill already unlocked', async () => {
      mockedLoadTree.mockReturnValue({
        skills: [
          {
            ...makeSkillNode('A'),
            data: { ...makeSkillNode('A').data, isUnlocked: true },
          },
        ],
        prereqs: [],
      });

      const mod = await import('../../src/hooks/use-skill-tree');
      const useSkillTree = mod.default;

      const { result } = renderHook(() => useSkillTree());

      act(() => {
        result.current.handleUnlock('A');
      });

      expect(mockedCanUnlock).not.toHaveBeenCalled();
      expect(mockedShowSuccessToast).not.toHaveBeenCalled();
    });

    it('does nothing when cannot unlock', async () => {
      mockedLoadTree.mockReturnValue({
        skills: [makeSkillNode('A')],
        prereqs: [],
      });

      mockedCanUnlock.mockReturnValue(false);

      const mod = await import('../../src/hooks/use-skill-tree');
      const useSkillTree = mod.default;

      const { result } = renderHook(() => useSkillTree());

      act(() => {
        result.current.handleUnlock('A');
      });

      expect(mockedCanUnlock).toHaveBeenCalledWith(
        result.current.skills,
        result.current.prereqs,
        'A',
      );
      expect(mockedShowSuccessToast).not.toHaveBeenCalled();
    });

    it('unlocks skill and shows toast', async () => {
      const initial = {
        skills: [makeSkillNode('A'), makeSkillNode('B')],
        prereqs: [],
      };

      mockedLoadTree.mockReturnValue(initial);
      mockedCanUnlock.mockReturnValue(true);

      const unlocked = [
        {
          ...makeSkillNode('A'),
          data: { ...makeSkillNode('A').data, isUnlocked: true },
        },
        makeSkillNode('B'),
      ];
      mockedUnlockSkill.mockReturnValue(unlocked);

      const mod = await import('../../src/hooks/use-skill-tree');
      const useSkillTree = mod.default;

      const { result } = renderHook(() => useSkillTree());

      act(() => {
        result.current.handleUnlock('A');
      });

      expect(mockedUnlockSkill).toHaveBeenCalledWith(initial.skills, 'A');
      expect(result.current.skills).toEqual(unlocked);
      expect(mockedShowSuccessToast).toHaveBeenCalledWith("You've unlocked A 🔥");
      expect(mockedSaveTree).toHaveBeenCalled();
    });
  });
});
