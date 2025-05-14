
export type Role = 
  | 'brand_owner' 
  | 'super_manager' 
  | 'store_manager' 
  | 'department_head' 
  | 'accountant' 
  | 'inventory_manager' 
  | 'sales_staff' 
  | 'hr_staff'
  | 'temp_staff';

export type Permission = 'view' | 'create' | 'edit' | 'delete';

export type ModulePermission = {
  module: string;
  permissions: Permission[];
  storeId?: string;
  validUntil?: Date;
  ipRestrictions?: string[];
  requires2FA: boolean;
};

export type UserPermissions = {
  canManageStores: boolean;
  canViewAllStores: boolean;
  canTransferInventory: boolean;
  canViewFinancials: boolean;
  canManageStaff: boolean;
  canManageRoles: boolean;
  canAccessEcommerce: boolean;
  canManageInventory: boolean;
  storeAccess: string[];
  departmentAccess: string[];
};

export type Store = {
  id: string;
  name: string;
  parentStoreId?: string;
  managerId: string;
  superManagerId?: string;
  region: string;
  status: 'active' | 'inactive';
  inventoryAlertRoles: string[];
  ipWhitelist?: string[];
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  storeId: string | null;
  permissions: UserPermissions;
  moduleAccess: ModulePermission[];
  requires2FA: boolean;
  temporaryAccess?: {
    validUntil: Date;
    permissions: ModulePermission[];
  };
};
