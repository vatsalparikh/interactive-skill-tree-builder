/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { toast } from 'react-hot-toast';

import { ErrorToast } from '../components/error-toast';

const activeToasts = new Set<string>();

export function showErrorToast(message: string): void {
  if (activeToasts.has(message)) return;

  activeToasts.add(message);

  toast.custom(<ErrorToast message={message} />, {
    duration: 2000,
  });

  setTimeout(() => {
    activeToasts.delete(message);
  }, 2000);
}
