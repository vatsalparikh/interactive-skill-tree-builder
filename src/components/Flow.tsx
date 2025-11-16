/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import ReactFlow, { Background, Controls, type NodeTypes } from 'reactflow';
import SkillNode from './SkillNode';
import type { SkillNodeType } from '../types';

const nodeTypes: NodeTypes = {
  skill: SkillNode
}

interface FlowProps {
  skills: SkillNodeType[];
}

export default function Flow({ skills }: FlowProps) {
  return (
    <div className='h-full w-full'>
      <ReactFlow 
        nodes={skills} 
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
