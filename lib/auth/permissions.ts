
import { Role, Permission, ModulePermission, UserPermissions, Store } from './types';

export const DEFAULT_PERMISSIONS: Record<Role, UserPermissions> = {
  brand_owner: {
    canManageStores: true,
    canViewAllStores: true,
    canTransferInventory: true,
    canViewFinancials: true,
    canManageStaff: true,
    canManageRoles: true,
    canAccessEcommerce: true,
    canManageInventory: true,
    storeAccess: ['*'],
    departmentAccess: ['*'],
  },
  super_manager: {
    canManageStores: false,
    canViewAllStores: true,
    canTransferInventory: true,
    canViewFinancials: true,
    canManageStaff: true,
    canManageRoles: false,
    canAccessEcommerce: true,
    canManageInventory: true,
    storeAccess: [],
    departmentAccess: ['*'],
  },
  // Add other roles with their default permissions
};

export function hasPermission(
  user: User | null, 
  module: string, 
  permission: Permission, 
  storeId?: string,
  ip?: string
): boolean {
  if (!user) return false;
  
  // Brand owner has all permissions
  if (user.role === 'brand_owner') return true;
  
  const moduleAccess = user.moduleAccess.find(m => m.module === module);
  
  if (!moduleAccess) return false;
  
  // Check IP restrictions
  if (moduleAccess.ipRestrictions && ip && 
      !moduleAccess.ipRestrictions.includes(ip)) {
    return false;
  }
  
  // Check store access
  if (storeId && !user.permissions.storeAccess.includes(storeId) && 
      !user.permissions.storeAccess.includes('*')) {
    return false;
  }
  
  // Check temporary access expiration
  if (user.temporaryAccess && new Date() > user.temporaryAccess.validUntil) {
    return false;
  }
  
  return moduleAccess.permissions.includes(permission);
}

export function canAccessStore(user: User | null, store: Store): boolean {
  if (!user) return false;
  if (user.role === 'brand_owner') return true;
  
  // Super manager can access assigned stores
  if (user.role === 'super_manager' && store.superManagerId === user.id) {
    return true;
  }
  
  return user.permissions.storeAccess.includes(store.id);
}
