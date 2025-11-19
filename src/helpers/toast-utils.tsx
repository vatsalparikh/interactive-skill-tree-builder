/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import { toast } from 'react-hot-toast';

import { ErrorToast } from '../components/error-toast';
import { SuccessToast } from '../components/success-toast';

export function showSuccessToast(message: string) {
  toast.remove();
  toast.custom(<SuccessToast message={message} />, { duration: 2000 });
}

export function showErrorToast(message: string) {
  toast.remove();
  toast.custom(<ErrorToast message={message} />, { duration: 2000 });
}
