"use client";

import { useStore } from "@/lib/store/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HelpPage() {
  const { user } = useStore();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Card>
          <CardContent className="pt-6">
            <p>Please login to access help resources.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const showAdminContent = user.role === 'owner' || user.role === 'admin';
  const showManagerContent = showAdminContent || user.role === 'manager';

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Help Center</h1>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          {showManagerContent && <TabsTrigger value="manager">Management</TabsTrigger>}
          {showAdminContent && <TabsTrigger value="admin">Administration</TabsTrigger>}
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <section>
                  <h3 className="font-semibold mb-2">Basic Navigation</h3>
                  <ul className="list-disc pl-6">
                    <li>Use the sidebar menu to navigate between different sections</li>
                    <li>Click on the profile section to manage your account</li>
                    <li>Use the theme switcher to toggle between light and dark modes</li>
                  </ul>
                </section>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {showManagerContent && (
          <TabsContent value="manager" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Management Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <section>
                    <h3 className="font-semibold mb-2">Store Management</h3>
                    <ul className="list-disc pl-6">
                      <li>Monitor inventory levels</li>
                      <li>Review sales reports</li>
                      <li>Handle staff scheduling</li>
                      <li>Process returns and exchanges</li>
                    </ul>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {showAdminContent && (
          <TabsContent value="admin" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Administration Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <section>
                    <h3 className="font-semibold mb-2">System Administration</h3>
                    <ul className="list-disc pl-6">
                      <li>User management and permissions</li>
                      <li>Store configuration</li>
                      <li>System settings and customization</li>
                      <li>Data backup and maintenance</li>
                    </ul>
                  </section>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}