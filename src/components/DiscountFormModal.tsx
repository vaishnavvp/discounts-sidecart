import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import type { DiscountMode, DiscountType } from "@/types";
import PriceTypeToggle from "@/components/PriceTypeToggle";

export default function DiscountFormModal({
  open,
  edit,
  catalogId,
  onClose,
}: {
  open: boolean;
  edit?: boolean;
  catalogId?: string;
  onClose: () => void;
}) {
  const catalog = useCartStore((s) => s.catalog);
  const addManualToCatalog = useCartStore((s) => s.addManualToCatalog);
  const updateCatalogAndDiscount = useCartStore(
    (s) => s.updateCatalogAndDiscount
  );

  const [type, setType] = useState<DiscountType>("monthly");
  const [mode, setMode] = useState<DiscountMode>("percent");
  const [value, setValue] = useState<number>(10);
  const [months, setMonths] = useState<number>(3);
  const [desc, setDesc] = useState("");

  useEffect(() => {
    if (!open) return;

    if (edit && catalogId) {
      const item = catalog.find((c) => c.id === catalogId);
      if (item) {
        setType(item.discount.type);
        setMode(item.discount.mode);
        setValue(item.discount.value);
        setMonths(item.discount.months ?? 3);
        setDesc(item.title);
        return;
      }
    }
    setType("monthly");
    setMode("percent");
    setValue(10);
    setMonths(3);
    setDesc("");
  }, [open, edit, catalogId, catalog]);

  if (!open) return null;

  const onSave = () => {
    if (edit && catalogId) {
      updateCatalogAndDiscount(catalogId, {
        title: desc,
        type,
        mode,
        value,
        months: type === "monthly" ? months : undefined,
      });
    } else {
      addManualToCatalog({
        type,
        mode,
        value,
        months: type === "monthly" ? months : undefined,
        desc,
      });
    }
    onClose();
  };

  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onMouseDown={onBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="discount-modal-title"
    >
      <div
        className="w-full max-w-xl rounded-xl bg-white shadow-xl p-6"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2
          id="discount-modal-title"
          className="text-lg font-semibold text-gray-800"
        >
          {edit ? "Edit discount" : "Add manual discount"}
        </h2>

        <p className="mt-3 text-sm text-gray-600">
          For which price do you calculate the discount?
        </p>

        <PriceTypeToggle value={type} onChange={(v) => setType(v)} />

        <label className="mt-5 block text-sm font-medium text-gray-700">Discount</label>
<div className="mt-1 flex w-full">
  <select
    aria-label="discount-mode"
    className="h-10 w-16 rounded-l border border-gray-300 bg-gray-100 text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-[#cd2626]"
    value={mode}
    onChange={(e) => setMode(e.target.value as DiscountMode)}
  >
    <option value="percent">%</option>
    <option value="amount">€</option>
  </select>

  <input
    aria-label="discount-value"
    className="h-10 flex-1 rounded-r border border-l-0 border-gray-300 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#26B7CD]"
    type="number"
    min={0}
    value={value}
    onChange={(e) => setValue(Number(e.target.value))}
    placeholder={mode === 'percent' ? 'e.g. 10' : 'e.g. 50'}
  />
</div>

{type === 'monthly' && (
  <>
    <label className="mt-4 block text-sm font-medium text-gray-700">Duration</label>
    <input
      aria-label="discount-months"
      className="mt-1 h-10 w-full rounded border border-gray-300 px-3 text-sm"
      type="number"
      min={1}
      max={12}
      value={months}
      onChange={(e) => setMonths(Number(e.target.value))}
      placeholder="Number of months"
    />
  </>
)}


        <label className="mt-4 block text-sm font-medium text-gray-700">
          Description
        </label>
        <input
          className="mt-1 h-10 w-full rounded border border-gray-300 px-3 text-sm"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder=""
        />

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-rose-700 hover:underline text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="bg-rose-700 px-5 py-2 text-white text-sm font-medium hover:bg-[#ae0e0e]"
          >
            {edit ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
