import { Role } from '@prisma/client';  // Keep this import if you use Prisma for roles

// Permission types for module actions
export type Permission = 'view' | 'create' | 'edit' | 'delete';

// Defines access for a particular module
export interface ModuleAccess {
  module: string;            // Module name or '*'
  permissions: Permission[]; // Array of permissions for this module
}

// User permissions structure as used in DEFAULT_PERMISSIONS
export interface UserPermissions {
  canManageUsers: boolean;
  canManageRoles: boolean;
  canManagePermissions: boolean;
  canViewReports: boolean;
  canManageInventory: boolean;
  canManageSales: boolean;
  canManageFinance: boolean;
  canManageSettings: boolean;
  storeAccess: string[];       // e.g., ['*'] or list of store IDs
  departmentAccess: string[];  // e.g., ['*'] or list of department IDs
  moduleAccess: ModuleAccess[]; 
}

// User interface with structured permissions
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  emailVerified?: Date;
  permissions: UserPermissions;  // <-- Changed from string[] to structured UserPermissions
}

// Auth response containing token and user info
export interface AuthResponse {
  token: string;
  user: User;
}

// Credentials for login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Data required for user registration
export interface RegisterData extends LoginCredentials {
  name: string;
  role?: Role;
}

// Email verification token and expiry
export interface EmailVerification {
  token: string;
  userId: string;
  expiresAt: Date;
}
