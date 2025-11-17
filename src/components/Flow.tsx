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

import type { SkillNode } from '../types';
import SkillView from './SkillView';

const nodeTypes: NodeTypes = {
  skill: SkillView,
};

interface FlowProps {
  skills: SkillNode[];
  prereqs: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onUnlock: (id: string) => void;
  highlightedNodeIds: Set<string>;
  highlightedEdgeIds: Set<string>;
}

export default function Flow({
  skills,
  prereqs,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onUnlock,
  highlightedNodeIds,
  highlightedEdgeIds,
}: FlowProps) {
  const handleNodeClick: NodeMouseHandler = (_evt, node) => {
    if (node.type === 'skill') onUnlock(node.id);
  };

const viewSkills = skills.map((n) => ({
  ...n,
  className: highlightedNodeIds.size
    ? highlightedNodeIds.has(n.id)
      ? 'skill-node skill-node--highlighted'
      : 'skill-node skill-node--dimmed'
    : 'skill-node',
}));

  const viewPrereqs = prereqs.map((e) => ({
    ...e,
    style: highlightedEdgeIds.size && highlightedEdgeIds.has(e.id)
      ? { stroke: '#f59e0b', strokeWidth: 2.5 } // amber-500
      : highlightedEdgeIds.size
        ? { opacity: 0.35 }
        : undefined,
    markerEnd: { type: MarkerType.ArrowClosed },
  }));

  return (
    <div className='h-full w-full'>
      <ReactFlow
        nodes={viewSkills}
        edges={viewPrereqs}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
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
