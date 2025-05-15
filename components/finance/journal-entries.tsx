"use client";

import { useState } from "react";
import { useAccountingStore, JournalEntry } from "@/lib/store/accounting";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

export function JournalEntries() {
  const { journalEntries, accounts, addJournalEntry } = useAccountingStore();
  const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
    number: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    reference: "",
    items: [],
  });

  const handleAddEntry = () => {
    if (!newEntry.number || !newEntry.date || !newEntry.description) return;

    addJournalEntry({
      id: Math.random().toString(),
      number: newEntry.number,
      date: newEntry.date,
      description: newEntry.description,
      reference: newEntry.reference || "",
      storeId: "1",
      status: "draft",
      items: newEntry.items || [],
      createdBy: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      postDate: null,
    });

    setNewEntry({
      number: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
      reference: "",
      items: [],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Journal Entries</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button>New Entry</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Journal Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Entry Number"
                value={newEntry.number}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, number: e.target.value })
                }
              />
              <Input
                type="date"
                value={newEntry.date}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, date: e.target.value })
                }
              />
              <Input
                placeholder="Description"
                value={newEntry.description}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, description: e.target.value })
                }
              />
              <Input
                placeholder="Reference"
                value={newEntry.reference}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, reference: e.target.value })
                }
              />
              <Button onClick={handleAddEntry}>Create Entry</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reference</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {journalEntries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.number}</TableCell>
              <TableCell>{format(new Date(entry.date), "dd/MM/yyyy")}</TableCell>
              <TableCell>{entry.description}</TableCell>
              <TableCell className="capitalize">{entry.status}</TableCell>
              <TableCell>{entry.reference}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}