
"use client";

import { useState } from "react";
import { useAccountingStore, Account, AccountType } from "@/lib/store/accounting";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const accountTypes: AccountType[] = [
  "asset",
  "liability", 
  "equity",
  "revenue",
  "expense",
];

export function ChartOfAccounts() {
  const { accounts, addAccount } = useAccountingStore();
  const [newAccount, setNewAccount] = useState<Partial<Account>>({
    code: "",
    name: "",
    type: "asset",
    description: "",
    isGroup: false,
    currency: "INR",
  });

  const handleAddAccount = () => {
    if (!newAccount.code || !newAccount.name || !newAccount.type) return;

    addAccount({
      id: Math.random().toString(),
      code: newAccount.code,
      name: newAccount.name,
      type: newAccount.type,
      parentId: newAccount.parentId || null,
      description: newAccount.description || "",
      balance: 0,
      currency: newAccount.currency || "INR",
      isGroup: newAccount.isGroup || false,
      storeId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setNewAccount({
      code: "",
      name: "",
      type: "asset",
      description: "",
      isGroup: false,
      currency: "INR",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Chart of Accounts</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Account</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Account Code"
                value={newAccount.code}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, code: e.target.value })
                }
              />
              <Input
                placeholder="Account Name"
                value={newAccount.name}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, name: e.target.value })
                }
              />
              <Select
                value={newAccount.type}
                onValueChange={(value: AccountType) =>
                  setNewAccount({ ...newAccount, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Description"
                value={newAccount.description}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, description: e.target.value })
                }
              />
              <Button onClick={handleAddAccount}>Add Account</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell>{account.code}</TableCell>
              <TableCell>{account.name}</TableCell>
              <TableCell className="capitalize">{account.type}</TableCell>
              <TableCell>₹{account.balance.toFixed(2)}</TableCell>
              <TableCell>{account.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
