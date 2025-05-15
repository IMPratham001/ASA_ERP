import { Role, Permission, ModuleAccess } from '@prisma/client';

export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  isValid: boolean;
}

export interface UserAuth {
  id: string;
  email: string;
  password: string; // Hashed
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  status: 'active' | 'inactive' | 'suspended';
  resetToken?: string;
  resetTokenExpiry?: Date;
  roles: Role[];
  permissions: Permission[];
  lastLogin?: Date;
  lastIp?: string;
}

export interface LoginHistory {
  id: string;
  userId: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  success: boolean;
}

export interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  moduleAccess: ModuleAccess[];
}