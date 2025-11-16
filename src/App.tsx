/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { useState } from 'react';

import Flow from './components/Flow';
import SkillForm from './components/SkillForm';
import type { SkillFormData } from './types';

function App() {
  const [skills, setSkills] = useState<SkillFormData[]>([]);

  const handleAddSkill = (data: SkillFormData) => {
    setSkills((prev) => [...prev, data]);
    console.log('form submitted');
  };
  return (
    <div className='flex h-screen'>
      <div className='w-1/5'>
        <SkillForm onSubmit={handleAddSkill} />
      </div>
      <div className='w-4/5'>
        <Flow />
      </div>
    </div>
  );
}

export default App;
