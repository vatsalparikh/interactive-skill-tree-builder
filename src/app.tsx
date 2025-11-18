/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

import Flow from './components/flow';
import SearchBar from './components/search-bar';
import SkillForm from './components/skill-form';
import { SkillLegend } from './components/skill-legend';
import useSkillHighlight from './hooks/use-skill-highlight';
import { useSkillTree } from './hooks/use-skill-tree';

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

  const { highlightedNodeIds, highlightedEdgeIds, viewSkills, viewPrereqs } = useSkillHighlight(
    skills,
    prereqs,
    query,
  );

  return (
    <div className='flex h-screen'>
      <Toaster position='top-right' />
      <div className='w-1/5 p-4 space-y-6 bg-white flex flex-col'>
        <h1 className='text-2xl font-bold text-indigo-600 text-center'>Build Your Skill Tree ⚡</h1>

        <SearchBar value={query} onChange={setQuery} />
        <SkillForm onSubmit={handleAddSkill} />
        <div className='mt-auto pt-4'>
          <SkillLegend />
        </div>
      </div>
      <div className='w-4/5'>
        <Flow
          skills={viewSkills}
          prereqs={viewPrereqs}
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
