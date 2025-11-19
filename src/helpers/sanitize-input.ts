/*
 * Copyright (c) 2025
 * This software may be modified and distributed under the terms of the MIT license.
 */

import DOMPurify from 'dompurify';

export function sanitizeText(input: string): string {
  // Prevent HTML injection
  const clean = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    RETURN_DOM: false, // Return string, not DOM
    RETURN_DOM_FRAGMENT: false,
    SAFE_FOR_TEMPLATES: true, // Extra safety for template injection
  });

  return clean.trim();
}
