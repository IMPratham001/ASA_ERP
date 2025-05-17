
"use client";

import { JournalEntries } from "@/components/finance/journal-entries";

export default function JournalPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Journal Entries</h1>
      <JournalEntries />
    </div>
  );
}
