/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { showSuccessToast } from '../components/success-toast';

export function ResetButton({ onReset }: { onReset: () => void }) {
  function handleClick(): void {
    onReset();
    showSuccessToast('Skill tree reset successfully');
  }

  return (
    <button
      type='button'
      aria-label='Reset skill tree and clear all saved progress'
      onClick={handleClick}
      className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded 
           hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-gray-300 
           cursor-pointer"

    >
      Reset tree
    </button>
  );
}
