/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

interface SuccessToastProps {
  message: string;
}

export function SuccessToast({ message }: SuccessToastProps) {
  return (
    <div
      role='status'
      aria-live='polite'
      aria-atomic='true'
      className='bg-green-100 text-green-900 px-4 py-2 rounded-md shadow text-sm'
    >
      {message}
    </div>
  );
}
