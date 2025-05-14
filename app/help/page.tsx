
"use client";

import { useStore } from "@/lib/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Keyboard, AlertCircle } from "lucide-react";

export default function HelpPage() {
  const { user } = useStore();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <p>Please login to access the user manual.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show only relevant tabs based on user role
  const showAdminContent = user.role === 'super_admin' || user.role === 'admin';
  const showManagerContent = showAdminContent || user.role === 'manager';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">User Manual</h2>
      </div>

      <Tabs defaultValue="shortcuts">
        <TabsList>
          <TabsTrigger value="shortcuts">Keyboard Shortcuts</TabsTrigger>
          {showAdminContent && <TabsTrigger value="admin">Admin Guide</TabsTrigger>}
          {showManagerContent && <TabsTrigger value="manager">Manager Guide</TabsTrigger>}
          <TabsTrigger value="staff">Staff Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="shortcuts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <Keyboard className="h-4 w-4 inline mr-2" />
                Keyboard Shortcuts
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Navigation</h3>
                <ul className="space-y-2">
                  <li><kbd>Alt + D</kbd> - Dashboard</li>
                  <li><kbd>Alt + I</kbd> - Inventory</li>
                  <li><kbd>Alt + O</kbd> - Orders</li>
                  <li><kbd>Alt + F</kbd> - Finance</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Actions</h3>
                <ul className="space-y-2">
                  <li><kbd>Alt + N</kbd> - New Invoice</li>
                  <li><kbd>Alt + S</kbd> - Save</li>
                  <li><kbd>Alt + P</kbd> - Print</li>
                  <li><kbd>Esc</kbd> - Close Modal</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {showAdminContent && (
          <TabsContent value="admin" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Administrator Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <section>
                    <h3 className="font-semibold mb-2">User Management</h3>
                    <p>Access the Users section to manage staff accounts and permissions. You can:</p>
                    <ul className="list-disc pl-6">
                      <li>Create new user accounts</li>
                      <li>Assign roles and permissions</li>
                      <li>Manage store access</li>
                      <li>Reset passwords</li>
                    </ul>
                  </section>
                  <section>
                    <h3 className="font-semibold mb-2">System Configuration</h3>
                    <p>Configure system-wide settings including:</p>
                    <ul className="list-disc pl-6">
                      <li>Tax rates and financial settings</li>
                      <li>Store locations and hierarchy</li>
                      <li>Product categories and attributes</li>
                      <li>Workflow automation rules</li>
                    </ul>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {showManagerContent && (
          <TabsContent value="manager" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Manager Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <section>
                    <h3 className="font-semibold mb-2">Store Management</h3>
                    <p>Manage your store operations:</p>
                    <ul className="list-disc pl-6">
                      <li>Monitor inventory levels</li>
                      <li>Review sales reports</li>
                      <li>Handle staff scheduling</li>
                      <li>Process returns and exchanges</li>
                    </ul>
                  </section>
                  <section>
                    <h3 className="font-semibold mb-2">Reporting</h3>
                    <p>Access and analyze store performance:</p>
                    <ul className="list-disc pl-6">
                      <li>Daily sales reports</li>
                      <li>Inventory valuation</li>
                      <li>Staff performance metrics</li>
                      <li>Customer satisfaction data</li>
                    </ul>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <section>
                  <h3 className="font-semibold mb-2">Daily Operations</h3>
                  <p>Essential tasks for daily work:</p>
                  <ul className="list-disc pl-6">
                    <li>Creating invoices</li>
                    <li>Processing sales</li>
                    <li>Checking inventory</li>
                    <li>Customer service</li>
                  </ul>
                </section>
                <section>
                  <h3 className="font-semibold mb-2">Common Procedures</h3>
                  <p>Step-by-step guides for common tasks:</p>
                  <ul className="list-disc pl-6">
                    <li>Opening/closing procedures</li>
                    <li>Returns processing</li>
                    <li>Inventory counts</li>
                    <li>End of day reporting</li>
                  </ul>
                </section>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
