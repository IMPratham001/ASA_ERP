
import { Role } from '@prisma/client';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  emailVerified?: Date;
  permissions: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role?: Role;
}

export interface EmailVerification {
  token: string;
  userId: string;
  expiresAt: Date;
}
