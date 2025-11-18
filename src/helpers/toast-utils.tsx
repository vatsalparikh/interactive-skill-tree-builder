/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { toast } from 'react-hot-toast';

import { ErrorToast } from '../components/ErrorToast';

export function showErrorToast(message: string): void {
  toast.custom(<ErrorToast message={message} />, { duration: 2000 });
}
