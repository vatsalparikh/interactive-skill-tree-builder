/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import ReactFlow, {
  Background,
  Controls,
  type Edge,
  MarkerType,
  type NodeMouseHandler,
  type NodeTypes,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from 'reactflow';

import type { SkillNodeType } from '../types';
import SkillNode from './SkillNode';

const nodeTypes: NodeTypes = {
  skill: SkillNode,
};

interface FlowProps {
  skills: SkillNodeType[];
  prereqs: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onUnlock: (id: string) => void;
}

export default function Flow({
  skills,
  prereqs,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onUnlock,
}: FlowProps) {
  const handleNodeClick: NodeMouseHandler = (_evt, node) => {
    if (node.type !== 'skill') return;
    onUnlock(node.id);
  };

  return (
    <div className='h-full w-full'>
      <ReactFlow
        nodes={skills}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={prereqs}
        onEdgesChange={onEdgesChange}
        defaultEdgeOptions={{
          markerEnd: { type: MarkerType.ArrowClosed },
        }}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
