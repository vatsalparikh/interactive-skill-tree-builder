/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

/**
 * Accessibility:
 * 1. The ReactFlow canvas is left exposed to assistive technologies, since
 *    hiding focusable controls (zoom, fit-view) would violate a11y rules.
 * 2. A screen-reader-friendly fallback list is provided in an `sr-only` region,
 *    giving full access to skill names, levels, and prerequisites in a
 *    structured, readable format.
 * 3. Visual graph interaction remains mouse/keyboard-driven, while the textual
 *    list ensures the same information is available non-visually.
 */

import { useCallback, useMemo } from 'react';
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
  const handleNodeClick: NodeMouseHandler = useCallback(
    (_evt, node) => {
      if (node.type === 'skill') onUnlock(node.id);
    },
    [onUnlock],
  );

  const defaultEdgeOptions = useMemo(
    () => ({
      markerEnd: { type: MarkerType.ArrowClosed },
    }),
    [],
  );

  return (
    <div className='h-full w-full'>
      <ReactFlow
        nodes={skills}
        edges={prereqs}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        defaultEdgeOptions={defaultEdgeOptions}
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
