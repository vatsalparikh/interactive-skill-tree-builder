/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { useMemo, useState } from 'react';
import { Toaster } from 'react-hot-toast';

import Flow from './components/Flow';
import SearchBar from './components/SearchBar';
import SkillForm from './components/SkillForm';
import { getHighlightedEdgeIds, getHighlightedNodeIds } from './helpers/search-utils';
import { useSkillTree } from './hooks/useSkillTree';

function App() {
  const {
    skills,
    prereqs,
    handleAddSkill,
    handleNodesChange,
    handleEdgesChange,
    handleConnect,
    handleUnlock,
  } = useSkillTree();

  const [query, setQuery] = useState('');

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
      <Toaster position='top-right' />
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
