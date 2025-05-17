
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  CUSTOMERS: {
    LIST: '/customers',
    CREATE: '/customers',
    DETAIL: (id: string) => `/customers/${id}`,
    INVOICES: (id: string) => `/customers/${id}/invoices`,
  },
  INVOICES: {
    LIST: '/invoices',
    CREATE: '/invoices',
    DETAIL: (id: string) => `/invoices/${id}`,
    ITEMS: (id: string) => `/invoices/${id}/items`,
  },
  PRODUCTS: {
    LIST: '/products',
    CREATE: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    STOCK: (id: string) => `/products/${id}/stock`,
  },
  INVENTORY: {
    LIST: '/inventory',
    DETAIL: (id: string) => `/inventory/${id}`,
    MOVEMENTS: '/inventory/movements',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    SALES: '/dashboard/sales',
    REVENUE: '/dashboard/revenue',
  }
};
