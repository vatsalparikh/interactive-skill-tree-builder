/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

/**
 * Accessibility:
 * 1. Hides the ReactFlow canvas from screen readers (aria-hidden)
 *    because the canvas is spatial/visual and would be noisy in SR output.
 * 2. Adds an sr-only textual fallback list of skills (id + name + level + prereqs)
 *    so screen reader users can discover nodes and read their names.
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
import SkillView from './skill-view';

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
}: FlowProps) {
  const handleNodeClick: NodeMouseHandler = (_evt, node) => {
    if (node.type === 'skill') onUnlock(node.id);
  };

  return (
    <div className='h-full w-full' aria-hidden='true'>
      <ReactFlow
        nodes={skills}
        edges={prereqs}
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

      {/* Screen-reader-friendly fallback: textual list of skills and prereqs */}
      <div role='region' aria-label='Skill list' className='sr-only'>
        <ul>
          {skills.map((skill) => {
            const incoming = prereqs.filter((prereq) => prereq.target === skill.id);

            const prereqNames = incoming
              .map((prereq) => skills.find((skill) => skill.id === prereq.source)?.data.name)
              .filter(Boolean);

            return (
              <li key={skill.id}>
                {skill.data.name}

                {skill.data.level !== undefined && (
                  <>
                    {' — Level '}
                    {skill.data.level}
                  </>
                )}

                {skill.data.isUnlocked ? ' (unlocked)' : ' (locked)'}

                {prereqNames.length > 0 && <> — Prerequisites: {prereqNames.join(', ')}</>}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
