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

  const viewSkills = skills.map((n) => {
    const isHighlighted = highlightedNodeIds.has(n.id);
    const isDimming = highlightedNodeIds.size > 0 && !isHighlighted;

    return {
      ...n,
      className: `
      transition-opacity transition-shadow duration-150
      ${
        isHighlighted
          ? 'opacity-100 shadow-[0_0_8px_2px_gold]'
          : isDimming
            ? 'opacity-25'
            : 'opacity-100'
      }
    `,
    };
  });

  const viewPrereqs = prereqs.map((e) => {
    const isHighlighted = highlightedEdgeIds.has(e.id);
    const isDimming = highlightedEdgeIds.size > 0 && !isHighlighted;

    return {
      ...e,
      style: {
        stroke: isHighlighted ? 'gold' : undefined,
        strokeWidth: isHighlighted ? 3 : 1.5,
        opacity: isDimming ? 0.25 : 1,
      },
      markerEnd: { type: MarkerType.ArrowClosed },
    };
  });

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
