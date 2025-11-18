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
    relative w-[180px] min-h-[80px] box-border rounded-xl
    bg-white border border-gray-200 p-3 transition-shadow duration-150
    ${unlocked ? 'shadow-[inset_0_0_0_2px_rgba(16,185,129,0.55)]' : ''}
  `}
>

      {/* Handles */}
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />

      {/* Name + optional level */}
      <header className="flex items-start gap-2">
        <h3 className="font-semibold text-sm text-gray-900 leading-tight">
          {data.name}
        </h3>

        {data.level !== undefined && (
<span className="ml-auto text-[10px] bg-gray-100 text-gray-700 px-2 py-[2px] rounded-md font-medium">
  Level {data.level}
</span>

        )}
      </header>

      {/* Description */}
      <p className="mt-1 text-xs text-gray-600 leading-snug max-h-[3.2rem] overflow-hidden">
        {data.description}
      </p>
    </article>
  );
}
