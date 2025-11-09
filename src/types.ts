export const BILLING_CYCLE_MONTHS = 12 as const;

export type DiscountType = 'one-time' | 'monthly';
export type DiscountMode = 'percent' | 'amount';

export interface Discount {
  id: string;
  type: DiscountType;
  mode: DiscountMode;
  label?: string;
  value: number;
  months?: number;
}

export interface CartState {
  baseOneTime: number;
  baseMonthly: number;
  currency: string;
}
