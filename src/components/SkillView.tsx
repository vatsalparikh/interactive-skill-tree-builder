/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { Handle, type NodeProps, Position } from 'reactflow';

import type { SkillData } from '../types';

export default function SkillView({ data }: NodeProps<SkillData>) {
  const unlocked = data.isUnlocked;

  return (
    <article
      className={`
        w-[160px] h-[80px] 
        box-border overflow-auto
        border-2 border-black rounded-md 
        p-3
        transition-colors duration-200
        ${unlocked ? 'bg-green-200' : 'bg-gray-200'}
      `}
    >
      <Handle type='source' position={Position.Bottom} />
      <Handle type='target' position={Position.Top} />

      <div>Name: {data.name}</div>
      {data.level !== undefined && <div>Level: {data.level}</div>}
      <div>Description: {data.description}</div>
    </article>
  );
}
