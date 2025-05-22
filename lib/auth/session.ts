
import { jwtDecode } from 'jwt-decode';

export interface SessionUser {
  id: string;
  email: string;
  role: string;
}

export const getSession = (): SessionUser | null => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem('token');
};

export const setSession = (token: string) => {
  localStorage.setItem('token', token);
};
