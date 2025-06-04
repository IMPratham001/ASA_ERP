import { Role, Permission, ModuleAccess, UserPermissions, User } from './types';

// Ensure moduleAccess is always an array of ModuleAccess objects
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
    ],
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
    moduleAccess: [
      // Add modules with explicit permissions or empty to deny access by default
      { module: 'dashboard', permissions: ['view'] },
      { module: 'users', permissions: ['view', 'edit', 'create', 'delete'] },
      // Add more modules as per your app's needs
    ],
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
    moduleAccess: [
      { module: 'dashboard', permissions: ['view'] },
      { module: 'inventory', permissions: ['view', 'edit'] },
      { module: 'sales', permissions: ['view', 'edit'] },
      { module: 'finance', permissions: ['view', 'edit'] },
    ],
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
    moduleAccess: [
      { module: 'finance', permissions: ['view', 'edit'] },
      { module: 'reports', permissions: ['view'] },
    ],
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
    moduleAccess: [
      { module: 'inventory', permissions: ['view', 'edit', 'create', 'delete'] },
      { module: 'dashboard', permissions: ['view'] },
    ],
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
    moduleAccess: [
      { module: 'sales', permissions: ['view', 'create', 'edit'] },
    ],
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
    moduleAccess: [],
  },
};

/**
 * Checks if a user has a specific permission for a module, considering store and department access.
 * @param user User object (null means no user)
 * @param module Module name to check permission for
 * @param permission Permission string (e.g. 'view', 'edit', 'create', 'delete')
 * @param storeId Optional store ID to check store access
 * @param departmentId Optional department ID to check department access
 */
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

  const userPerms = user.permissions;

  // Store access check
  if (
    storeId &&
    !userPerms.storeAccess.includes('*') &&
    !userPerms.storeAccess.includes(storeId)
  ) {
    return false;
  }

  // Department access check
  if (
    departmentId &&
    !userPerms.departmentAccess.includes('*') &&
    !userPerms.departmentAccess.includes(departmentId)
  ) {
    return false;
  }

  // Find module access entry for this module or wildcard '*'
  const moduleAccess =
    userPerms.moduleAccess.find(
      (m) => m.module === module || m.module === '*'
    ) || null;

  // Check if the permission exists in moduleAccess.permissions array
  if (!moduleAccess || !moduleAccess.permissions) return false;

  return moduleAccess.permissions.includes(permission);
}

/**
 * Checks if the user can access a module at all (any permission)
 * @param user User object or null
 * @param module Module name to check access for
 */
export function canAccessModule(user: User | null, module: string): boolean {
  if (!user) return false;

  if (user.role === 'owner') return true;

  const userPerms = user.permissions;

  // If any moduleAccess entry matches the module or '*' with at least one permission, allow access
  return userPerms.moduleAccess.some(
    (m) =>
      (m.module === module || m.module === '*') &&
      Array.isArray(m.permissions) &&
      m.permissions.length > 0
  );
}
