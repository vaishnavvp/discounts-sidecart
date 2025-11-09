import DiscountList from '@/components/DiscountList';
import { useCartStore, useDerivedTotals } from '@/store/useCartStore';

export default function SideCart() {
  const { baseOneTime, baseMonthly, currency } = useCartStore();
  const totals = useDerivedTotals();

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm sticky top-6">
      <h2 className="text-lg font-semibold mb-4">Overview</h2>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between"><span>Base one-time</span><span>{currency}{baseOneTime.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Base monthly</span><span>{currency}{baseMonthly.toFixed(2)}</span></div>
      </div>

      <div className="border rounded-xl p-4 mb-4">
        <h3 className="font-medium mb-2">Add discount</h3>
        {/* <DiscountForm /> */}
      </div>

      <div className="border rounded-xl p-4 mb-4">
        <h3 className="font-medium mb-2">Discounts</h3>
        <DiscountList />
      </div>

      <div className="border rounded-xl p-4 space-y-2">
        <h3 className="font-medium">Totals</h3>
        <div className="flex justify-between text-sm">
          <span>One-time total</span>
          <span>{totals.currency}{totals.oneTimeTotal.toFixed(2)}</span>
        </div>

        <div className="pt-2">
          <div className="text-sm text-gray-600">Monthly breakdown (12 months)</div>
          <div className="flex justify-between text-sm">
            <span>First {totals.monthly.discountedMonths} months</span>
            <span>
              {totals.currency}{totals.monthly.firstNMonthsMonthly.toFixed(2)} /mo · total {totals.currency}{totals.monthly.firstNMonthsTotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Remaining {12 - totals.monthly.discountedMonths} months</span>
            <span>
              {totals.currency}{totals.monthly.remainingMonthsMonthly.toFixed(2)} /mo · total {totals.currency}{totals.monthly.remainingMonthsTotal.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex justify-between font-semibold pt-2 border-t">
          <span>Grand total (year)</span>
          <span>{totals.currency}{totals.grandTotalYear.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
