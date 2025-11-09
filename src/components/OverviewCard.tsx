import { useCartStore, useDerivedTotals } from "@/store/useCartStore";
import { moneyEU } from "@/utils/format";
import type { Discount } from "@/types";

function oneTimeAmount(baseOneTime: number, d: Discount) {
  if (d.type !== "one-time") return 0;
  return d.mode === "percent" ? (baseOneTime * d.value) / 100 : d.value;
}

export default function OverviewCard() {
  const { baseOneTime, baseMonthly, discounts } = useCartStore((s) => ({
    baseOneTime: s.baseOneTime,
    baseMonthly: s.baseMonthly,
    discounts: s.discounts,
  }));

  const totals = useDerivedTotals();

  const oneTimes = discounts.filter((d) => d.type === "one-time");
  const monthlyDiscounts = discounts.filter((d) => d.type === "monthly");
  const hasMonthly = monthlyDiscounts.length > 0;

  const oneTimeSum = oneTimes.reduce((acc, d) => acc + oneTimeAmount(baseOneTime, d), 0);

  const fmtValue = (d: Discount) =>
    d.mode === "percent" ? `- ${d.value} %` : `- ${moneyEU(d.value)}`;

  const fmtScope = (d: Discount) =>
    d.months && d.months > 0 ? `first ${d.months} months` : `every month`;

  const N = totals.monthly.discountedMonths;
  const perFirst = totals.monthly.firstNMonthsMonthly;
  const perAfter = totals.monthly.remainingMonthsMonthly;
  const totalFirst = totals.monthly.firstNMonthsTotal;
  const totalAfter = totals.monthly.remainingMonthsTotal;
  const hasShortTerm = hasMonthly && N > 0;

  return (
    <aside className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-4 pt-4">
        <div className="mx-auto mb-2 h-10 w-10 flex items-center justify-center rounded-full overflow-hidden">
          <img
            src="/images/chargernew.svg"
            alt="charger"
            className="h-full w-full object-contain"
          />
        </div>
      </div>

      <div className="px-4 pb-3">
        <h3 className="text-lg font-semibold text-[#8A8A8A] mb-2">Overview</h3>

        <div className="flex items-start justify-between text-sm">
          <span className="text-gray-700">Webasto Pure II laadpaal type 2</span>
          <span>{moneyEU(baseOneTime)}</span>
        </div>
        <div className="mt-1 flex items-start justify-between text-sm">
          <span className="italic text-gray-500">Maandelijkse prijs</span>
          <span>{moneyEU(baseMonthly)}</span>
        </div>

        <button className="mt-2 text-[13px] text-[#26B7CD] hover:underline">Edit</button>
      </div>
      <div className="border-t border-gray-200 " />
      <div className="flex items-center justify-between bg-[#eaf6fa] px-4 py-3 text-sm">
        <span className="font-medium text-gray-700">Eventually per month excl. btw</span>
        <span className="font-medium">{moneyEU(perAfter)}</span>
      </div>
      <div className="border-gray-200" />

      {/* MONTHLY SECTION */}
      {hasMonthly && (
        <>
          <div className="px-4 py-3 space-y-1 text-sm bg-[#eaf6fa]">
            <div className="text-gray-600 font-medium mb-1 ">Monthly discounts</div>
            {monthlyDiscounts
              .sort((a, b) => (b.months ?? 0) - (a.months ?? 0)) // short-term first
              .map((d) => (
                <div key={d.id} className="flex items-center justify-between">
                  <span className="text-gray-600">
                    {d.id ?? "Discount"} — {fmtValue(d)}{" "}
                    <span className="ml-1 italic text-gray-500">({fmtScope(d)})</span>
                  </span>
                </div>
              ))}
          </div>
          <div className="px-4 py-3 space-y-2 text-sm bg-[#eaf6fa]">
            {hasShortTerm ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    First {N} months (total)
                    <span className="ml-2 text-gray-500">
                      ({moneyEU(perFirst)} / mo)
                    </span>
                  </span>
                  <span className="font-medium">{moneyEU(totalFirst)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    Next {Math.max(12 - N, 0)} months (total)
                    <span className="ml-2 text-gray-500">
                      ({moneyEU(perAfter)} / mo)
                    </span>
                  </span>
                  <span className="font-medium">{moneyEU(totalAfter)}</span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  12 months (total)
                  <span className="ml-2 text-gray-500">
                    ({moneyEU(perAfter)} / mo)
                  </span>
                </span>
                <span className="font-medium">
                  {moneyEU(perAfter * 12)}
                </span>
              </div>
            )}
          </div>
          <div className="border-t border-gray-200" />
        </>
      )}
      <br></br>

      {/* ONE-TIME SECTION */}
      <div className="px-4 py-4 space-y-2 text-sm bg-[#eaf6fa]">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal onetime costs excl. btw</span>
          <span>{moneyEU(baseOneTime)}</span>
        </div>

        {oneTimes.map((d) => {
          const val = oneTimeAmount(baseOneTime, d);
          return (
            <div key={d.id} className="flex justify-between">
              <span className="italic text-gray-600">{d.id ?? "Discount name"}</span>
              <span className="text-[#333333]">- {moneyEU(val)}</span>
            </div>
          );
        })}

        {oneTimes.length > 1 && (
          <div className="flex justify-between">
            <span className="italic text-gray-600">Discounts total</span>
            <span className="text-[#333333]">- {moneyEU(oneTimeSum)}</span>
          </div>
        )}

        <div className="flex justify-between font-semibold">
          <span>Onetime costs excl. btw</span>
          <span>{moneyEU(totals.oneTimeTotal)}</span>
        </div>
      </div>
    </aside>
  );
}
