/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { useEffect, useMemo, useState } from 'react';
import { type Edge } from 'reactflow';

import Flow from './components/Flow';
import SkillForm from './components/SkillForm';
import { loadTree, saveTree } from './helpers/local-storage';
import type { SkillNode } from './types';

import { createHandlers } from './handlers/flow-handlers';



import SearchBar from './components/SearchBar';

import {
  getHighlightedNodeIds,
  getHighlightedEdgeIds,
} from './helpers/search-utils';

function App() {
  const savedTree = loadTree();
  const [skills, setSkills] = useState<SkillNode[]>(savedTree?.skills ?? []);
  const [prereqs, setPrereqs] = useState<Edge[]>(savedTree?.prereqs ?? []);
  const [query, setQuery] = useState('');

  useEffect(() => {
    saveTree({ skills, prereqs });
  }, [skills, prereqs]);

  const { handleAddSkill, handleNodesChange, handleEdgesChange, handleConnect, handleUnlock } =
    createHandlers(skills, prereqs, setSkills, setPrereqs);

  const highlightedNodeIds = useMemo(
    () => getHighlightedNodeIds(skills, prereqs, query),
    [skills, prereqs, query],
  );
  const highlightedEdgeIds = useMemo(
    () => getHighlightedEdgeIds(prereqs, highlightedNodeIds),
    [prereqs, highlightedNodeIds],
  );


  return (
    <div className='flex h-screen'>
      <div className='w-1/5'>
        <SearchBar value={query} onChange={setQuery} />
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
          highlightedNodeIds={highlightedNodeIds}
          highlightedEdgeIds={highlightedEdgeIds}
        />
      </div>
    </div>
  );
}

export default App;
