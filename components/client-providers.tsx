
"use client";

import { useKeyboardShortcuts } from "@/lib/shortcuts";

export function ClientProviders() {
  useKeyboardShortcuts();
  return null;
}
