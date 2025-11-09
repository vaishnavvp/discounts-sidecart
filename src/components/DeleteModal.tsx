import { useCartStore } from "@/store/useCartStore";

export default function DeleteModal({
  open,
  catalogId,
  onClose,
}: {
  open: boolean;
  catalogId?: string;
  onClose: () => void;
}) {
  const removeCatalogAndDiscount = useCartStore(
    (s) => s.removeCatalogAndDiscount
  );
  const catalog = useCartStore((s) => s.catalog);
  const itemTitle =
    catalog.find((c) => c.id === catalogId)?.title ?? "this discount";

  if (!open) return null;

  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const onDelete = () => {
    if (!catalogId) return onClose();
    removeCatalogAndDiscount(catalogId);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-discount-title"
      onMouseDown={onBackdrop}
    >
      <div
        className="w-full max-w-xl rounded-lg bg-white shadow-xl p-6"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2
            id="delete-discount-title"
            className="text-lg font-semibold text-gray-800"
          >
            Delete discount
          </h2>
          <button
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-700">
          Are you sure you want to delete this discount?
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="rounded bg-[#D9534F] px-5 py-2 text-sm font-medium text-white hover:bg-[#c64541]"
          >
            Delete discount
          </button>
        </div>
      </div>
    </div>
  );
}
