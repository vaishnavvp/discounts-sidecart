import { create } from "zustand";
import type { Discount, CartState } from "@/types";
import { calcCartTotals } from "@/utils/calc";

export type CatalogItem = {
  id: string;
  title: string;
  summary: string;
  discount: Omit<Discount, "id">;
  enabled: boolean;
  editable?: boolean;
};

function buildSummary(d: Omit<Discount, "id">, currency = "€") {
  const head =
    d.mode === "percent" ? `- ${d.value} %` : `- ${currency} ${d.value.toFixed(2)}`;

  const tail =
    d.type === "monthly"
      ? d.months && d.months > 0
        ? `monthly first ${d.months} months`
        : "monthly"
      : "one time";

  return `${head} ${tail}`;
}

interface StoreState extends CartState {
  discounts: Discount[];
  catalog: CatalogItem[];

  addDiscount: (d: Discount) => void;
  updateDiscount: (id: string, patch: Partial<Discount>) => void;
  removeCatalogAndDiscount: (catalogId: string) => void;
  removeDiscount: (id: string) => void;
  clearAll: () => void;

  toggleCatalog: (id: string) => void;

  updateCatalogAndDiscount: (
    catalogId: string,
    patch: { title?: string } & Omit<Discount, "id">
  ) => void;

  addManualToCatalog: (
    args: { title?: string; desc?: string } & Omit<Discount, "id">
  ) => void;
}

export const useCartStore = create<StoreState>((set, get) => ({
  baseOneTime: 1000,
  baseMonthly: 10,
  currency: "€",

  catalog: [
    {
      id: "c1",
      title: "250 Euro Discount",
      summary: "- €250.00 one time",
      discount: { type: "one-time", mode: "amount", value: 250 },
      enabled: false,
    },
    {
      id: "c2",
      title: "5 percent Discount",
      summary: "- 5 % one time",
      discount: { type: "one-time", mode: "percent", value: 5 },
      enabled: false,
      editable: true,
    },
    {
      id: "c3",
      title: "250 Euro Monthly Discount",
      summary: "- €250.00 monthly",
      discount: { type: "monthly", mode: "amount", value: 250, months: 12 },
      enabled: false,
    },
    {
      id: "c4",
      title: "25 percent Monthly Discount",
      summary: "- 25 % monthly first 3 months",
      discount: { type: "monthly", mode: "percent", value: 25, months: 3 },
      enabled: false,
    },
  ],

  discounts: [],

  addDiscount: (d) => set((s) => ({ discounts: [...s.discounts, d] })), // append

  updateDiscount: (id, patch) =>
    set((s) => ({
      discounts: s.discounts.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    })),

  removeDiscount: (id) =>
    set((s) => ({ discounts: s.discounts.filter((d) => d.id !== id) })),

  clearAll: () => set({ discounts: [] }),

  toggleCatalog: (id) =>
    set((s) => {
      const item = s.catalog.find((c) => c.id === id);
      if (!item) return s;

      const nowEnabled = !item.enabled;
      const discountId = `from-${id}`;

      const filtered = s.discounts.filter((d) => d.id !== discountId);

      const next = nowEnabled
        ? [
            ...filtered,
            {
              id: discountId,
              ...item.discount,
              label: item.title,
            } as Discount,
          ]
        : filtered;

      return {
        catalog: s.catalog.map((c) => (c.id === id ? { ...c, enabled: nowEnabled } : c)),
        discounts: next,
      };
    }),

  updateCatalogAndDiscount: (
    catalogId,
    patch
  ) =>
    set((s) => {
      const idx = s.catalog.findIndex((c) => c.id === catalogId);
      if (idx === -1) return s;

      const current = s.catalog[idx];
      const newDisc: Omit<Discount, "id"> = {
        type: patch.type ?? current.discount.type,
        mode: patch.mode ?? current.discount.mode,
        value: patch.value ?? current.discount.value,
        months:
          (patch.type ?? current.discount.type) === "monthly"
            ? patch.months ?? current.discount.months
            : undefined,
      };

      const updatedCatalog = [...s.catalog];
      updatedCatalog[idx] = {
        ...current,
        title: patch.title ?? current.title,
        discount: newDisc,
        summary: buildSummary(newDisc, s.currency),
      };

      const did = `from-${catalogId}`;
      const hasPaired = s.discounts.some((d) => d.id === did);

      const updatedDiscounts = hasPaired
        ? s.discounts.map((d) =>
            d.id === did
              ? ({
                  id: did,
                  ...newDisc,
                  label: patch.title ?? current.title,
                } as Discount)
              : d
          )
        : s.discounts;

      return { catalog: updatedCatalog, discounts: updatedDiscounts };
    }),

removeCatalogAndDiscount: (catalogId: string) =>
  set((s) => ({
    catalog: s.catalog.filter((c) => c.id !== catalogId),
    discounts: s.discounts.filter((d) => d.id !== `from-${catalogId}`),
  })),


  addManualToCatalog: ({ title, desc, ...discount }) =>
    set((s) => {
      const catalogId = `manual-${crypto.randomUUID()}`;

      const newItem: CatalogItem = {
        id: catalogId,
        title: title || desc || "Discount name",
        summary: buildSummary(discount, s.currency),
        discount,
        enabled: true,
        editable: true,
      };

      const newDiscount: Discount = {
        id: `from-${catalogId}`,
        ...discount,
        label: newItem.title,
      };

      return {
        catalog: [...s.catalog, newItem],
        discounts: [...s.discounts, newDiscount],
      };
    }),
}));


export const useDerivedTotals = () => calcCartTotals(useCartStore.getState());
