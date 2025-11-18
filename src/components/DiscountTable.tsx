import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import Toggle from "./Toggle";
import IconEdit from "./IconEdit";
import DiscountFormModal from "./DiscountFormModal";
import DeleteModal from "./DeleteModal";

function IconTrash({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <path d="M3 5h14" />
      <path d="M8 5V3h4v2" />
      <path d="M6 5l1 12h6l1-12" />
    </svg>
  );
}

function Row({
  id,
  title,
  summary,
  enabled,
  editable,
}: {
  id: string;
  title: string;
  summary: string;
  enabled: boolean;
  editable?: boolean;
}) {
  const toggle = useCartStore((s) => s.toggleCatalog);
  const removeCatalogAndDiscount = useCartStore(
    (s) => s.removeCatalogAndDiscount
  );
  const [open, setOpen] = useState(false);
  const [deleteDiscount, setDeleteDiscount] = useState(false);

  return (
    <div className="grid grid-cols-[1fr_minmax(320px,auto)_auto] items-center px-6 py-4 border-t border-brand-line hover:bg-brand-row">
      <div className="text-[14px] text-gray-700">{title}</div>

      <div className="justify-self-center w-[340px]">
        <div className="grid grid-cols-[48px_minmax(0,1fr)] items-center gap-2 text-[14px] text-gray-600">
          <div className="flex items-center justify-center gap-2 w-12">
            {editable ? (
              <>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  title="Edit"
                  aria-label="Edit discount"
                  className="text-brand-teal hover:opacity-90"
                >
                   <img
                src="/images/edit.svg"
                alt="Average icon"
                className="h-3 w-3 cursor-pointer"
                onClick={() => setOpen(true)}
              />
                </button>

                <button
                  type="button"
                 onClick={() => setDeleteDiscount(true)}
                  title="Delete"
                  aria-label="Delete discount"
                  className="text-red-500 hover:text-red-600"
                >
                   <img
                src="/images/delete.svg"
                alt="Average icon"
                className="h-3 w-3 cursor-pointer"
                onClick={() => setDeleteDiscount(true)}
              />
                </button>
              </>
            ) : (
              <span className="invisible flex gap-2">
                <IconEdit className="h-4 w-4" />
                <IconTrash className="h-4 w-4" />
              </span>
            )}
          </div>

          <div className="text-gray-700 truncate">{summary}</div>
        </div>
      </div>

      <div className="justify-self-end">
        <Toggle checked={enabled} onChange={() => toggle(id)} />
      </div>

      {editable && (
        <DiscountFormModal
          open={open}
          edit
          catalogId={id}
          onClose={() => setOpen(false)}
        />
      )}
      <DeleteModal
          open={deleteDiscount}
          catalogId={id}
          onClose={() => setDeleteDiscount(false)}
        />
    </div>
  );
}

export default function DiscountTable() {
  const catalog = useCartStore((s) => s.catalog);
  return (
    <div className="bg-white">
      {catalog.map((c) => (
        <Row key={c.id} {...c} />
      ))}

      <div className="flex items-center justify-between px-6 py-4 border-t border-brand-line text-sm">
        <button className="text-rose-700 hover:underline">Previous</button>
        <button className="bg-rose-700 px-4 py-2 text-white hover:bg-sky-700">
          Next
        </button>
      </div>
    </div>
  );
}
