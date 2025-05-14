"use client";

import { useState } from "react";
import { useAccountingStore } from "@/lib/store/accounting";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartOfAccounts } from "@/components/finance/chart-of-accounts";
import { JournalEntries } from "@/components/finance/journal-entries";
import { TrialBalance } from "@/components/finance/trial-balance";
import { TaxSettings } from "@/components/finance/tax-settings";

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("chart-of-accounts");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Finance & Accounting</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="chart-of-accounts">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="journal-entries">Journal Entries</TabsTrigger>
          <TabsTrigger value="trial-balance">Trial Balance</TabsTrigger>
          <TabsTrigger value="tax-settings">Tax Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="chart-of-accounts">
          <ChartOfAccounts />
        </TabsContent>

        <TabsContent value="journal-entries">
          <JournalEntries />
        </TabsContent>

        <TabsContent value="trial-balance">
          <TrialBalance />
        </TabsContent>

        <TabsContent value="tax-settings">
          <TaxSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}