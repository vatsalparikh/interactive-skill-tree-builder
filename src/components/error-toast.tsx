/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

interface ErrorToastProps {
  message: string;
}

export function ErrorToast({ message }: ErrorToastProps) {
  return (
    <div
      role='alert'
      aria-live='assertive'
      aria-atomic='true'
      className='bg-red-100 text-red-900 px-4 py-3 rounded-md shadow text-sm'
    >
      {message}
    </div>
  );
}
