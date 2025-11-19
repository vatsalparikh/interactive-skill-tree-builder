/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

export function SkillLegend() {
  return (
    <div className='pl-1 text-xs text-gray-600 space-y-2' role='list'>
      <div className='flex items-center space-x-2' role='listitem'>
        <span role='presentation' className='w-3 h-3 rounded-sm bg-white border border-gray-300' />
        <span>Locked (click a skill to unlock)</span>
      </div>

      <div className='flex items-center space-x-2' role='listitem'>
        <span
          role='presentation'
          className='
        w-3 h-3 rounded-sm bg-white 
        border border-green-400/60
        shadow-[inset_0_0_0_2px_rgba(16,185,129,0.55)]
      '
        />
        <span>Unlocked</span>
      </div>

      <div className='flex items-center space-x-2' role='listitem'>
        <span
          role='presentation'
          className='
        w-3 h-3 rounded-sm bg-white
        shadow-[0_0_6px_2px_rgba(37,99,235,0.8)]
      '
        />
        <span>Highlighted (search)</span>
      </div>

      <div className='flex items-center space-x-2 pt-1' role='listitem'>
        <span className='w-3 h-3 flex items-center justify-center text-[10px]'>●</span>
        <span>Connect bottom handle to top handle</span>
      </div>
    </div>
  );
}

export default SkillLegend;
