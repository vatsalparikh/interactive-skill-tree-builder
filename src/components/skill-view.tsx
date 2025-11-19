/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { Handle, type NodeProps, Position } from 'reactflow';

import type { SkillData } from '../types';

export default function SkillView({
  data,
}: NodeProps<
  SkillData & {
    isHighlighted?: boolean;
    isDimmed?: boolean;
  }
>) {
  const { isUnlocked, isHighlighted, isDimmed } = data;

  const base = `
    relative w-[180px] rounded-xl box-border p-3
    border transition-shadow transition-opacity duration-150
    bg-white
  `;

  const locked = `
  bg-white
  border-gray-300
  hover:border-gray-500
  hover:bg-white
`;

  const unlocked = `
    border-green-400/60 bg-white
    hover:border-green-500
    shadow-[inset_0_0_0_2px_rgba(16,185,129,0.55)]
  `;

  const highlightStyle = isHighlighted ? { boxShadow: '0 0 10px 2px rgba(37, 99, 235, 0.8)' } : {};

  return (
    <article
      role='group'
      aria-label={
        data.level !== undefined ? `${data.name}, Level ${String(data.level)}` : data.name
      }
      className={[base, isUnlocked ? unlocked : locked].join(' ')}
      style={highlightStyle}
    >
      <Handle type='source' position={Position.Bottom} aria-hidden='true' />
      <Handle type='target' position={Position.Top} aria-hidden='true' />
      <div className={isDimmed ? 'opacity-60' : 'opacity-100'}>
        <header className='flex items-start gap-2'>
          <p className='font-semibold text-sm text-gray-900 leading-tight break-words whitespace-normal overflow-hidden max-w-full'>
            {data.name}
          </p>

          {data.level !== undefined && (
            <span className='ml-auto text-[10px] bg-gray-100 text-gray-700 px-2 py-[2px] rounded-md font-medium'>
              Level {data.level}
            </span>
          )}
        </header>

        <p className='mt-1 text-xs text-gray-600 leading-snug break-words'>{data.description}</p>
      </div>
    </article>
  );
}
