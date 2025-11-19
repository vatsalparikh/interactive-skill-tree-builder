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

import { createSkillNode } from '../helpers/create-node';
import { hasCycle } from '../helpers/detect-cycle';
import { addConnection, validateConnection } from '../helpers/edge-utils';
import { loadTree, resetTree, saveTree } from '../helpers/local-storage';
import { sanitizeText } from '../helpers/sanitize-input';
import { showErrorToast, showSuccessToast } from '../helpers/toast-utils';
import { canUnlock, unlockSkill } from '../helpers/unlock-utils';
import type { SkillFormData, SkillNode } from '../types';

// Manages all skill tree state: skills, edges, unlock logic, connection validation, and persistence.
export function useSkillTree() {
  const savedTree = loadTree();

  const [skills, setSkills] = useState<SkillNode[]>(savedTree?.skills ?? []);
  const [prereqs, setPrereqs] = useState<Edge[]>(savedTree?.prereqs ?? []);

  // Persist the current skill tree to localStorage whenever skills or edges change.
  useEffect(() => {
    saveTree({ skills, prereqs });
  }, [skills, prereqs]);

  // Add a new skill node after sanitizing user input
  const handleAddSkill = useCallback((data: SkillFormData) => {
    const safeData: SkillFormData = {
      name: sanitizeText(data.name),
      description: sanitizeText(data.description),
      level: data.level,
    };

    setSkills((prev) => [...prev, createSkillNode(safeData)]);
  }, []);

  // Apply ReactFlow-driven node position/size changes to local state.
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    setSkills((prev) => applyNodeChanges(changes, prev) as SkillNode[]);
  }, []);

  // Apply ReactFlow-driven edge changes (deletions, moves) to local state.
  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    setPrereqs((prev) => applyEdgeChanges(changes, prev));
  }, []);

  // Validate and add a new prerequisite edge, preventing invalid connections and cycles.
  const handleConnect = useCallback(
    (connection: Connection) => {
      setPrereqs((prev) => {
        const { source, target } = connection;

        if (!source || !target) return prev;

        // Always use fresh prereqs from prev
        const currentEdges = prev;

        const sourceSkill = skills.find((skill) => skill.id === source);
        const targetSkill = skills.find((skill) => skill.id === target);

        // Reject connecting locked to unlocked to prevent impossible prerequisite chains.
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
  // Unlock a skill only if all its prerequisites are already unlocked.
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

  // Reset the entire tree, clearing both local state and persisted data.
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
