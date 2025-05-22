
export type Role = 'owner' | 'admin' | 'manager' | 'accountant' | 'inventory_manager' | 'sales_staff' | 'employee';

export type Permission = 'view' | 'create' | 'edit' | 'delete';

export type ModuleAccess = {
  module: string;
  permissions: Permission[];
};

export type UserPermissions = {
  canManageUsers: boolean;
  canManageRoles: boolean;
  canManagePermissions: boolean;
  canViewReports: boolean;
  canManageInventory: boolean;
  canManageSales: boolean;
  canManageFinance: boolean;
  canManageSettings: boolean;
  storeAccess: string[];
  departmentAccess: string[];
  moduleAccess: ModuleAccess[];
};

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  permissions: UserPermissions;
  stores: string[];
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}
