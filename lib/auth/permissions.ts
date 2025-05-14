import { Role, Permission, ModulePermission, UserPermissions } from './types';

export const DEFAULT_PERMISSIONS: Record<Role, UserPermissions> = {
  super_admin: {
    canCreateInvoice: true,
    canViewFinancials: true,
    canManageProducts: true,
    canManageStaff: true,
    canSwitchStores: true,
  },
  store_manager: {
    canCreateInvoice: true,
    canViewFinancials: true,
    canManageProducts: true,
    canManageStaff: false,
    canSwitchStores: false,
  },
  marketing_staff: {
    canCreateInvoice: false,
    canViewFinancials: false,
    canManageProducts: true,
    canManageStaff: false,
    canSwitchStores: false,
  },
  sales_staff: {
    canCreateInvoice: true,
    canViewFinancials: false,
    canManageProducts: false,
    canManageStaff: false,
    canSwitchStores: false,
  },
  accounting_staff: {
    canCreateInvoice: false,
    canViewFinancials: true,
    canManageProducts: false,
    canManageStaff: false,
    canSwitchStores: false,
  },
};

export const DEFAULT_MODULE_ACCESS: Record<Role, ModulePermission[]> = {
  super_admin: [
    { module: 'dashboard', permissions: ['view', 'create', 'edit', 'delete'] },
    { module: 'inventory', permissions: ['view', 'create', 'edit', 'delete'] },
    { module: 'sales', permissions: ['view', 'create', 'edit', 'delete'] },
    { module: 'finance', permissions: ['view', 'create', 'edit', 'delete'] },
    { module: 'users', permissions: ['view', 'create', 'edit', 'delete'] },
  ],
  store_manager: [
    { module: 'dashboard', permissions: ['view'] },
    { module: 'inventory', permissions: ['view', 'edit'] },
    { module: 'sales', permissions: ['view', 'create', 'edit'] },
    { module: 'finance', permissions: ['view'] },
  ],
  marketing_staff: [
    { module: 'dashboard', permissions: ['view'] },
    { module: 'inventory', permissions: ['view'] },
  ],
  sales_staff: [
    { module: 'dashboard', permissions: ['view'] },
    { module: 'sales', permissions: ['view', 'create'] },
  ],
  accounting_staff: [
    { module: 'dashboard', permissions: ['view'] },
    { module: 'finance', permissions: ['view', 'create', 'edit'] },
  ],
};

export function hasPermission(user: User | null, module: string, permission: Permission): boolean {
  if (!user) return false;
  if (user.role === 'super_admin') return true;
  
  const moduleAccess = user.moduleAccess.find(m => m.module === module);
  return moduleAccess?.permissions.includes(permission) || false;
}

export function canAccessStore(user: User | null, storeId: string): boolean {
  if (!user) return false;
  if (user.role === 'super_admin') return true;
  return user.storeId === storeId;
}