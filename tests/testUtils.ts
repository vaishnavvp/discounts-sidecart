import { useCartStore } from '@/store/useCartStore';

export function resetCartStore() {
  const s = useCartStore.getState();
  // Carefully reset only the mutable parts; keep base prices/currency.
  useCartStore.setState({
    discounts: [],
    catalog: [
      {
        id: 'c1',
        title: 'Discount name',
        summary: '+ €250.00 one time',
        discount: { type: 'one-time', mode: 'amount', value: 250 },
        enabled: false,
      },
      {
        id: 'c2',
        title: 'Discount name',
        summary: '- 5 % one time',
        discount: { type: 'one-time', mode: 'percent', value: 5 },
        enabled: false,
        editable: true,
      },
      {
        id: 'c3',
        title: 'Discount name',
        summary: '+ €250.00 monthly',
        discount: { type: 'monthly', mode: 'amount', value: 250, months: 12 },
        enabled: false,
      },
      {
        id: 'c4',
        title: 'Discount name',
        summary: '- 25 % monthly first 3 months',
        discount: { type: 'monthly', mode: 'percent', value: 25, months: 3 },
        enabled: false,
      },
    ],
  });
}
