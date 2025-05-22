
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

interface Role {
  id?: string;
  name: string;
  permissions: string[];
}

export function RoleManager() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState<Role>({ name: '', permissions: [] });

  const availablePermissions = [
    'create_template',
    'edit_template',
    'delete_template',
    'manage_users',
    'manage_roles',
    'view_reports',
    'manage_documents'
  ];

  const handleSaveRole = async () => {
    try {
      // Save role logic here
      setRoles([...roles, newRole]);
      setNewRole({ name: '', permissions: [] });
      toast({
        title: "Success",
        description: "Role saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save role",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Role Name"
              value={newRole.name}
              onChange={(e) => setNewRole({...newRole, name: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-2">
              {availablePermissions.map(permission => (
                <div key={permission} className="flex items-center space-x-2">
                  <Checkbox
                    checked={newRole.permissions.includes(permission)}
                    onCheckedChange={(checked) => {
                      const permissions = checked
                        ? [...newRole.permissions, permission]
                        : newRole.permissions.filter(p => p !== permission);
                      setNewRole({...newRole, permissions});
                    }}
                  />
                  <span className="capitalize">{permission.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
            <Button onClick={handleSaveRole}>Save Role</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {roles.map((role, index) => (
              <div key={index} className="flex justify-between items-center p-2 border rounded">
                <span>{role.name}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setRoles(roles.filter((_, i) => i !== index))}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
