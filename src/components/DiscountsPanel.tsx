import { useState } from 'react';
import DiscountFormModal from '@/components/DiscountFormModal';
import DiscountTable from '@/components/DiscountTable';

export default function DiscountsPanel() {
  const [open, setOpen] = useState(false);

  return (
    <section className="overflow-hidden border bg-white">
      <div className="flex items-center justify-between bg-brand-teal px-5 py-3 text-white">
        <h2 className="font-medium">Discounts</h2>
      </div>

      <div className="flex justify-end px-5 py-3">
        <button className="text-[#26B7CD] text-sm" onClick={() => setOpen(true)}>
          + Add manual discount
        </button>
      </div>

      <DiscountTable />
      <DiscountFormModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
