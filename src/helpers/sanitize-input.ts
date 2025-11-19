/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import DOMPurify from 'dompurify';

export function sanitizeText(input: string): string {
  // Prevent HTML injection
  const clean = DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

  // Sanitize always returns a string; trimming for consistency
  return clean.trim();
}
