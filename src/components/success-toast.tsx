/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { toast } from 'react-hot-toast';

export function showSuccessToast(message: string): void {
  toast.custom(
    <div className='bg-green-100 text-green-900 px-4 py-2 rounded-md shadow text-sm'>
      {message}
    </div>,
    { duration: 2000 },
  );
}
