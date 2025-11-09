import { useCartStore } from '@/store/useCartStore';
import type { Discount } from '@/types';

function Row({ d }: { d: Discount }) {
  const update = useCartStore((s) => s.updateDiscount);
  const remove = useCartStore((s) => s.removeDiscount);

  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center py-2 gap-3">
      <div className="text-sm">
        <div className="font-medium">
          {d.type === 'monthly' ? 'Monthly' : 'One-time'} · {d.mode === 'percent' ? `${d.value}%` : d.value}
          {d.type === 'monthly' && d.months ? ` · ${d.months} mo` : null}
        </div>
        <div className="text-gray-500">id: {d.id.slice(0, 6)}</div>
      </div>
      <button
        className="text-xs px-2 py-1 rounded-lg border hover:bg-gray-50"
        onClick={() =>
          update(d.id, d.type === 'monthly' ? { months: Math.min(12, (d.months ?? 1) + 1) } : { value: d.value + 5 })
        }
      >
        Edit
      </button>
      <button
        className="text-xs px-2 py-1 rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
        onClick={() => remove(d.id)}
      >
        Delete
      </button>
    </div>
  );
}

export default function DiscountList() {
  const discounts = useCartStore((s) => s.discounts);
  if (discounts.length === 0) return <p className="text-sm text-gray-500">No discounts added yet.</p>;
  return <div className="divide-y">{discounts.map((d) => <Row key={d.id} d={d} />)}</div>;
}
