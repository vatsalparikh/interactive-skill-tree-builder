/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms
 * of the MIT license.
 */

import {
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type NodeChange,
} from 'reactflow';

import { addConnection, validateConnection } from '../helpers/edge-utils';
import { hasCycle } from '../helpers/detect-cycle';
import { canUnlock, unlockSkill } from '../helpers/unlock-utils';
import type { SkillFormData, SkillNodeType } from '../types';
import { createSkillNode } from '../helpers/create-node';

export function createHandlers(
  skills: SkillNodeType[],
  prereqs: Edge[],
  setSkills: (fn: (prev: SkillNodeType[]) => SkillNodeType[]) => void,
  setPrereqs: (fn: (prev: Edge[]) => Edge[]) => void,
) {
  function handleAddSkill(data: SkillFormData): void {
    setSkills((prev) => [...prev, createSkillNode(data)]);
  }

  function handleNodesChange(changes: NodeChange[]): void {
    setSkills((prev) => applyNodeChanges(changes, prev) as SkillNodeType[]);
  }

  function handleEdgesChange(changes: EdgeChange[]): void {
    setPrereqs((prev) => applyEdgeChanges(changes, prev));
  }

  function handleConnect(connection: Connection): void {
    const { source, target } = connection;

    if (!source || !target) {
      alert('Invalid connection (missing endpoints).');
      return;
    }

    if (!validateConnection(prereqs, connection)) {
      alert('Invalid connection (self-loop or duplicate).');
      return;
    }

    if (hasCycle(prereqs, source, target)) {
      alert('Cannot create circular prerequisites.');
      return;
    }

    setPrereqs((prev) => addConnection(prev, connection));
  }

  function handleUnlock(id: string): void {
    if (!canUnlock(skills, prereqs, id)) return;
    setSkills((prev) => unlockSkill(prev, id));
  }

  // return all handlers as a clear interface
  return {
    handleAddSkill,
    handleNodesChange,
    handleEdgesChange,
    handleConnect,
    handleUnlock,
  };
}
