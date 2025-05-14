
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartOfAccounts } from "@/components/features/finance/chart-of-accounts";
import { JournalEntries } from "@/components/features/finance/journal-entries";
import { TrialBalance } from "@/components/features/finance/trial-balance";
import { TaxSettings } from "@/components/features/finance/tax-settings";

export default function FinancePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Finance</h2>
      </div>
      
      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="journal">Journal Entries</TabsTrigger>
          <TabsTrigger value="trial-balance">Trial Balance</TabsTrigger>
          <TabsTrigger value="tax">Tax Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accounts" className="space-y-4">
          <ChartOfAccounts />
        </TabsContent>
        
        <TabsContent value="journal" className="space-y-4">
          <JournalEntries />
        </TabsContent>
        
        <TabsContent value="trial-balance" className="space-y-4">
          <TrialBalance />
        </TabsContent>
        
        <TabsContent value="tax" className="space-y-4">
          <TaxSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
