/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { Handle, type NodeProps, Position } from 'reactflow';

import type { SkillData } from '../types';

export default function SkillNode({ data }: NodeProps<SkillData>) {
  return (
    /* TODO fix css styling */
    <article
      style={{
        background: data.isUnlocked ? 'lightgreen' : 'lightgray',
        padding: 8,
        border: '1px solid black',
        borderRadius: 6,
        width: 100,
      }}
    >
      <Handle type='source' position={Position.Bottom} />
      <Handle type='target' position={Position.Top} />

      <div>Name: {data.name}</div>
      {data.level !== undefined && <div>Level: {data.level}</div>}
      <div>Description: {data.description}</div>
    </article>
  );
}
