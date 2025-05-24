const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
    LOGOUT: `${BASE_URL}/auth/logout`,
  },
  CUSTOMERS: {
    LIST: `${BASE_URL}/customers`,
    CREATE: `${BASE_URL}/customers`,
    DETAIL: (id: string) => `${BASE_URL}/customers/${id}`,
    INVOICES: (id: string) => `${BASE_URL}/customers/${id}/invoices`,
  },
  INVOICES: {
    LIST: `${BASE_URL}/invoices`,
    CREATE: `${BASE_URL}/invoices`,
    DETAIL: (id: string) => `${BASE_URL}/invoices/${id}`,
    ITEMS: (id: string) => `${BASE_URL}/invoices/${id}/items`,
  },
  PRODUCTS: {
    LIST: `${BASE_URL}/products`,
    CREATE: `${BASE_URL}/products`,
    DETAIL: (id: string) => `${BASE_URL}/products/${id}`,
    STOCK: (id: string) => `${BASE_URL}/products/${id}/stock`,
  },
  INVENTORY: {
    LIST: `${BASE_URL}/inventory`,
    DETAIL: (id: string) => `${BASE_URL}/inventory/${id}`,
    MOVEMENTS: `${BASE_URL}/inventory/movements`,
    update: (id: number) => `${BASE_URL}/inventory/${id}`,
    getByProduct: (productId: number) => `${BASE_URL}/inventory/product/${productId}`,
    updateStock: (id: number) => `${BASE_URL}/inventory/${id}/stock`,
  },
  DASHBOARD: {
    STATS: `${BASE_URL}/dashboard/stats`,
    SALES: `${BASE_URL}/dashboard/sales`,
    REVENUE: `${BASE_URL}/dashboard/revenue`,
  },
  FINANCE: {
    TRANSACTIONS: `${BASE_URL}/finance/transactions`,
    REPORTS: `${BASE_URL}/finance/reports`,
    ACCOUNTS: `${BASE_URL}/finance/accounts`
  }
};