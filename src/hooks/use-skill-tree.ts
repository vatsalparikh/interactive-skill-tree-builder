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
import { loadTree, resetTree, saveTree } from '../helpers/local-storage';
import { sanitizeText } from '../helpers/sanitize-input';
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
    const safeData: SkillFormData = {
      name: sanitizeText(data.name),
      description: sanitizeText(data.description),
      level: data.level,
    };

    setSkills((prev) => [...prev, createSkillNode(safeData)]);
  }, []);

  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    setSkills((prev) => applyNodeChanges(changes, prev) as SkillNode[]);
  }, []);

  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    setPrereqs((prev) => applyEdgeChanges(changes, prev));
  }, []);

  const handleConnect = useCallback(
    (connection: Connection) => {
      setPrereqs((prev) => {
        const { source, target } = connection;

        if (!source || !target) return prev;

        // Always use fresh prereqs from prev
        const currentEdges = prev;

        const sourceSkill = skills.find((skill) => skill.id === source);
        const targetSkill = skills.find((skill) => skill.id === target);

        // blocks connecting a locked skill to an already unlocked skill
        if (!sourceSkill?.data.isUnlocked && targetSkill?.data.isUnlocked) {
          showErrorToast('Cannot add locked skill as a prerequisite of an unlocked skill');
          return prev;
        }

        if (!validateConnection(currentEdges, connection)) {
          showErrorToast('Invalid connection (self-loop or duplicate)');
          return prev;
        }

        if (hasCycle(currentEdges, source, target)) {
          showErrorToast('Cannot create circular prerequisites');
          return prev;
        }

        return addConnection(currentEdges, connection);
      });
    },
    [skills],
  );

  const handleUnlock = useCallback(
    (id: string) => {
      const skill = skills.find((skill) => skill.id === id);

      if (!skill) return;

      // don't unlock again
      if (skill.data.isUnlocked) return;
      if (!canUnlock(skills, prereqs, id)) return;

      setSkills((prev) => unlockSkill(prev, id));
      showSuccessToast(`You've unlocked ${sanitizeText(skill.data.name)} 🔥`);
    },
    [skills, prereqs],
  );

  function resetState(): void {
    // storage side-effect
    resetTree();

    // in-memory reset
    setSkills([]);
    setPrereqs([]);
  }

  return {
    skills,
    prereqs,

    handleAddSkill,
    handleNodesChange,
    handleEdgesChange,
    handleConnect,
    handleUnlock,
    resetState,
  };
}

export default useSkillTree;
