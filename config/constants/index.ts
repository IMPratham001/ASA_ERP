
export const APP_CONFIG = {
  name: 'ERP System',
  version: '1.0.0',
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    timeout: 30000,
  },
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
} as const;
