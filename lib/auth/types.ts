
export type Role = 
  | 'owner'
  | 'admin'
  | 'manager' 
  | 'accountant'
  | 'inventory_manager'
  | 'sales_staff'
  | 'employee';

export type Permission = 
  | 'view' 
  | 'create' 
  | 'edit' 
  | 'delete' 
  | 'manage_users'
  | 'manage_roles'
  | 'manage_permissions'
  | 'view_reports'
  | 'manage_inventory'
  | 'manage_sales'
  | 'manage_finance'
  | 'manage_settings';

export type ModuleAccess = {
  module: string;
  permissions: Permission[];
  departmentId?: string;
  storeId?: string;
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

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  storeId?: string;
  departmentId?: string;
  permissions: UserPermissions;
  isActive: boolean;
  lastLogin?: Date;
};
