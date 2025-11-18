/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { useCallback, useEffect, useState } from 'react';
import {
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type NodeChange,
} from 'reactflow';

import { showSuccessToast } from '../components/success-toast';
import { createSkillNode } from '../helpers/create-node';
import { hasCycle } from '../helpers/detect-cycle';
import { addConnection, validateConnection } from '../helpers/edge-utils';
import { loadTree, saveTree } from '../helpers/local-storage';
import { showErrorToast } from '../helpers/toast-utils';
import { canUnlock, unlockSkill } from '../helpers/unlock-utils';
import type { SkillFormData, SkillNode } from '../types';

export function useSkillTree() {
  const savedTree = loadTree();

  const [skills, setSkills] = useState<SkillNode[]>(savedTree?.skills ?? []);
  const [prereqs, setPrereqs] = useState<Edge[]>(savedTree?.prereqs ?? []);

  useEffect(() => {
    saveTree({ skills, prereqs });
  }, [skills, prereqs]);

  const handleAddSkill = useCallback((data: SkillFormData) => {
    setSkills((prev) => [...prev, createSkillNode(data)]);
  }, []);

  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    setSkills((prev) => applyNodeChanges(changes, prev) as SkillNode[]);
  }, []);

  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    setPrereqs((prev) => applyEdgeChanges(changes, prev));
  }, []);

  const handleConnect = useCallback(
    (connection: Connection) => {
      const { source, target } = connection;

      if (!source || !target) {
        return;
      }

      if (!validateConnection(prereqs, connection)) {
        showErrorToast('Invalid connection (self-loop or duplicate)');
        return;
      }

      if (hasCycle(prereqs, source, target)) {
        showErrorToast('Cannot create circular prerequisites');
        return;
      }

      setPrereqs((prev) => addConnection(prev, connection));
    },
    [prereqs],
  );

  const handleUnlock = useCallback(
    (id: string) => {
      const skill = skills.find((s) => s.id === id);

      // don't unlock again
      if (skill?.data.isUnlocked) return;
      if (!canUnlock(skills, prereqs, id)) return;

      setSkills((prev) => unlockSkill(prev, id));

      if (skill) {
        showSuccessToast(`You've unlocked ${skill.data.name} 🔥`);
      }
    },
    [skills, prereqs],
  );

  return {
    skills,
    prereqs,

    handleAddSkill,
    handleNodesChange,
    handleEdgesChange,
    handleConnect,
    handleUnlock,
  };
}

export default useSkillTree;
