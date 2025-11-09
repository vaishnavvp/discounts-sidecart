import type { CartState, Discount } from '@/types';

const clamp0 = (n: number) => Math.max(0, n);

export function applyOnce(
  base: number,
  mode: 'percent' | 'amount',
  value: number
) {
  const delta = mode === 'percent' ? (value / 100) * base : value;
  return clamp0(base - delta);
}

export function calcOneTime(base: number, discounts: Discount[]) {
  return discounts
    .filter((d) => d.type === 'one-time')
    .reduce((acc, d) => applyOnce(acc, d.mode, d.value), base);
}

export function calcMonthlyBreakdown(base: number, discounts: Discount[]) {
  const monthly = discounts.filter((d) => d.type === 'monthly');

  const prices: number[] = [];
  for (let m = 1; m <= 12; m++) {
    const active = monthly.filter((d) => (Number(d.months ?? Infinity)) >= m);
    const priceM = active.reduce(
      (acc, d) => applyOnce(acc, d.mode, d.value),
      base
    );
    prices.push(priceM);
  }

  let discountedMonths = 0;
  for (let i = 0; i < 12; i++) {
    if (prices[i] !== base) discountedMonths++;
    else break;
  }

  const firstNMonthsMonthly = prices[0] ?? base;                   // month 1 price
  const remainingMonthsMonthly = prices[discountedMonths] ?? base; // price after discounted window

  const firstNMonthsTotal = prices.slice(0, discountedMonths).reduce((a, b) => a + b, 0);
  const remainingMonthsTotal = prices.slice(discountedMonths).reduce((a, b) => a + b, 0);

  return {
    prices,
    discountedMonths,
    firstNMonthsMonthly,
    remainingMonthsMonthly,
    firstNMonthsTotal,
    remainingMonthsTotal,
    hasAnyMonthly: monthly.length > 0,
  };
}

export function calcCartTotals(state: CartState & { discounts: Discount[] }) {
  const { baseOneTime, baseMonthly, currency } = state;
  const ds = state.discounts ?? [];

  const oneTimeTotal = calcOneTime(baseOneTime, ds);
  const monthly = calcMonthlyBreakdown(baseMonthly, ds);
  const grandTotalYear = oneTimeTotal + monthly.firstNMonthsTotal + monthly.remainingMonthsTotal;

  return { currency, oneTimeTotal, monthly, grandTotalYear };
}
