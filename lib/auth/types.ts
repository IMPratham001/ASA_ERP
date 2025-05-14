export type Role = 'super_admin' | 'store_manager' | 'marketing_staff' | 'sales_staff' | 'accounting_staff';

export type Permission = 'view' | 'create' | 'edit' | 'delete';

export type ModulePermission = {
  module: string;
  permissions: Permission[];
};

export type UserPermissions = {
  canCreateInvoice: boolean;
  canViewFinancials: boolean;
  canManageProducts: boolean;
  canManageStaff: boolean;
  canSwitchStores: boolean;
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  storeId: string | null;
  permissions: UserPermissions;
  moduleAccess: ModulePermission[];
};