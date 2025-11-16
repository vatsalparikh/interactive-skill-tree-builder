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

import Flow from './components/Flow';
import SkillForm from './components/SkillForm';
import { createSkillNode } from './helpers/create-node';
import { addConnection, validateConnection } from './helpers/edge-utils';
import { loadTree, saveTree } from './helpers/local-storage';
import { canUnlock, unlockSkill } from './helpers/unlock-utils';
import type { SkillFormData, SkillNodeType } from './types';
import { hasCycle } from './helpers/detect-cycle';

function App() {
  const savedTree = loadTree();
  const [skills, setSkills] = useState<SkillNodeType[]>(savedTree?.skills ?? []);
  const [prereqs, setPrereqs] = useState<Edge[]>(savedTree?.prereqs ?? []);

  useEffect(() => {
    saveTree({ skills, prereqs });
  }, [skills, prereqs]);

  const handleAddSkill = (data: SkillFormData) => {
    setSkills((prev) => [...prev, createSkillNode(data)]);
  };

  // typical React Flow event handler for node changes
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    setSkills((prev) => applyNodeChanges(changes, prev) as SkillNodeType[]);
  }, []);

  // typical React Flow event handler for edge changes
  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    setPrereqs((prev) => applyEdgeChanges(changes, prev));
  }, []);

  // typical React Flow event handler for connections
  // connection logic is implemented in edge-utils.ts file
  const handleConnect = useCallback(
    (connection: Connection): void => {
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

      setPrereqs((prev: Edge[]) => addConnection(prev, connection));
    },
    [prereqs],
  );

  const handleUnlock = useCallback(
    (id: string) => {
      if (!canUnlock(skills, prereqs, id)) return;
      setSkills((prev) => unlockSkill(prev, id));
    },
    [skills, prereqs],
  );

  return (
    <div className='flex h-screen'>
      <div className='w-1/5'>
        <SkillForm onSubmit={handleAddSkill} />
      </div>
      <div className='w-4/5'>
        <Flow
          skills={skills}
          prereqs={prereqs}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={handleConnect}
          onUnlock={handleUnlock}
        />
      </div>
    </div>
  );
}

export default App;
