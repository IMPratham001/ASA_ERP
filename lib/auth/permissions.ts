
import { Role, Permission, ModuleAccess, UserPermissions, User } from './types';

export const DEFAULT_PERMISSIONS: Record<Role, UserPermissions> = {
  owner: {
    canManageUsers: true,
    canManageRoles: true,
    canManagePermissions: true,
    canViewReports: true,
    canManageInventory: true,
    canManageSales: true,
    canManageFinance: true,
    canManageSettings: true,
    storeAccess: ['*'],
    departmentAccess: ['*'],
    moduleAccess: [
      { module: '*', permissions: ['view', 'create', 'edit', 'delete'] }
    ]
  },
  admin: {
    canManageUsers: true,
    canManageRoles: true,
    canManagePermissions: false,
    canViewReports: true,
    canManageInventory: true,
    canManageSales: true,
    canManageFinance: true,
    canManageSettings: true,
    storeAccess: [],
    departmentAccess: [],
    moduleAccess: []
  },
  manager: {
    canManageUsers: false,
    canManageRoles: false,
    canManagePermissions: false,
    canViewReports: true,
    canManageInventory: true,
    canManageSales: true,
    canManageFinance: true,
    canManageSettings: false,
    storeAccess: [],
    departmentAccess: [],
    moduleAccess: []
  },
  accountant: {
    canManageUsers: false,
    canManageRoles: false,
    canManagePermissions: false,
    canViewReports: true,
    canManageInventory: false,
    canManageSales: false,
    canManageFinance: true,
    canManageSettings: false,
    storeAccess: [],
    departmentAccess: [],
    moduleAccess: []
  },
  inventory_manager: {
    canManageUsers: false,
    canManageRoles: false,
    canManagePermissions: false,
    canViewReports: true,
    canManageInventory: true,
    canManageSales: false,
    canManageFinance: false,
    canManageSettings: false,
    storeAccess: ['*'],
    departmentAccess: ['*'],
    moduleAccess: ['inventory', 'dashboard']
  },
  sales_staff: {
    canManageUsers: false,
    canManageRoles: false,
    canManagePermissions: false,
    canViewReports: false,
    canManageInventory: false,
    canManageSales: true,
    canManageFinance: false,
    canManageSettings: false,
    storeAccess: [],
    departmentAccess: [],
    moduleAccess: []
  },
  employee: {
    canManageUsers: false,
    canManageRoles: false,
    canManagePermissions: false,
    canViewReports: false,
    canManageInventory: false,
    canManageSales: false,
    canManageFinance: false,
    canManageSettings: false,
    storeAccess: [],
    departmentAccess: [],
    moduleAccess: []
  }
};

export function hasPermission(
  user: User | null,
  module: string,
  permission: Permission,
  storeId?: string,
  departmentId?: string
): boolean {
  if (!user) return false;
  
  // Owner has all permissions
  if (user.role === 'owner') return true;

  // Check basic permissions
  const userPerms = user.permissions;
  
  // Check store access
  if (storeId && 
      !userPerms.storeAccess.includes('*') && 
      !userPerms.storeAccess.includes(storeId)) {
    return false;
  }

  // Check department access
  if (departmentId && 
      !userPerms.departmentAccess.includes('*') && 
      !userPerms.departmentAccess.includes(departmentId)) {
    return false;
  }

  // Check module permissions
  const moduleAccess = userPerms.moduleAccess.find(
    m => m.module === module || m.module === '*'
  );

  return moduleAccess?.permissions.includes(permission) || false;
}

export function canAccessModule(user: User | null, module: string): boolean {
  if (!user) return false;
  if (user.role === 'owner') return true;
  
  return user.permissions.moduleAccess.some(
    m => m.module === module || m.module === '*'
  );
}
