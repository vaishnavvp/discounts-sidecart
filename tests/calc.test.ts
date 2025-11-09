import { calcMonthlyBreakdown, calcOneTime, calcCartTotals } from '@/utils/calc';
import type { Discount } from '@/types';

describe('calc functions', () => {
  test('calcOneTime stacks percent/amount correctly', () => {
    const base = 1000;
    const ds: Discount[] = [
      { id: 'a', type: 'one-time', mode: 'percent', value: 10 }, // 100 off => 900
      { id: 'b', type: 'one-time', mode: 'amount', value: 50 },  // => 850
    ];
    expect(calcOneTime(base, ds)).toBe(850);
  });

  test('calcMonthlyBreakdown combines multiple monthly discounts and counts N discounted months', () => {
    const base = 10;
    const ds: Discount[] = [
      { id: 'm1', type: 'monthly', mode: 'percent', value: 25, months: 3 }, // 7.5 first 3 months
      { id: 'm2', type: 'monthly', mode: 'amount', value: 2, months: 2 },   // then 7.5-2=5.5 for first 2 months
    ];

    const m = calcMonthlyBreakdown(base, ds);
    // first 2 months: 10 -> -25% = 7.5 -> -2 = 5.5
    // month 3: only -25% = 7.5
    // months 4..12: base (10)
    expect(m.prices.slice(0, 5)).toEqual([5.5, 5.5, 7.5, 10, 10]);
    expect(m.discountedMonths).toBe(3);
    expect(m.firstNMonthsMonthly).toBe(5.5);
    expect(m.remainingMonthsMonthly).toBe(10);
    // totals
    expect(m.firstNMonthsTotal).toBeCloseTo(5.5 + 5.5 + 7.5, 5);
    expect(m.remainingMonthsTotal).toBeCloseTo(9 * 10, 5);
  });

  test('calcCartTotals returns combined year total', () => {
    const state = {
      baseOneTime: 1000,
      baseMonthly: 10,
      currency: '€',
      discounts: [
        { id: 'ot', type: 'one-time', mode: 'amount', value: 100 },
        { id: 'm', type: 'monthly', mode: 'percent', value: 50, months: 12 },
      ] as Discount[],
    };
    const t = calcCartTotals(state);
    expect(t.oneTimeTotal).toBe(900);
    expect(t.monthly.prices.every((v) => v === 5)).toBe(true);
    expect(t.grandTotalYear).toBe(900 + 12 * 5);
  });
});
