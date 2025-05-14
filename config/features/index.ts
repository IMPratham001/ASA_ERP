
export const FEATURES = {
  enableBilling: true,
  enableInventory: true,
  enableFinance: true,
  enableMultiStore: true,
  enableUserManagement: true,
} as const;

export type Features = typeof FEATURES;
