import { useCartStore } from '@/store/useCartStore';
import type { Discount } from '@/types';
import { resetCartStore } from './testUtils';

beforeEach(() => resetCartStore());

describe('useCartStore actions', () => {
  test('addManualToCatalog creates catalog row + paired discount and enables it', () => {
    const addManualToCatalog = useCartStore.getState().addManualToCatalog;

    addManualToCatalog({
      title: 'My monthly',
      type: 'monthly',
      mode: 'percent',
      value: 20,
      months: 3,
      desc: 'My monthly',
    });

    const { catalog, discounts } = useCartStore.getState();
    const manual = catalog.find((c) => c.title === 'My monthly');
    expect(manual).toBeTruthy();
    expect(manual?.enabled).toBe(true);

    const paired = discounts.find((d) => d.id.startsWith('from-manual-'));
    expect(paired).toBeTruthy();
    expect(paired).toMatchObject<Partial<Discount>>({
      type: 'monthly',
      mode: 'percent',
      value: 20,
      months: 3,
    });
  });

  test('toggleCatalog adds/removes the discount effect', () => {
    const { toggleCatalog, discounts } = useCartStore.getState();
    // initially disabled
    expect(discounts).toHaveLength(0);
    // toggle c1 on
    toggleCatalog('c1');
    expect(useCartStore.getState().discounts).toHaveLength(1);
    // toggle c1 off
    toggleCatalog('c1');
    expect(useCartStore.getState().discounts).toHaveLength(0);
  });

  test('updateCatalogAndDiscount modifies both summary and paired discount', () => {
    const { addManualToCatalog, updateCatalogAndDiscount } = useCartStore.getState();
    addManualToCatalog({
      desc: 'Edit me',
      type: 'monthly',
      mode: 'percent',
      value: 10,
      months: 2,
    });
    const cat = useCartStore.getState().catalog.find((c) => c.title === 'Edit me')!;
    updateCatalogAndDiscount(cat.id, {
      title: 'Edited',
      type: 'monthly',
      mode: 'amount',
      value: 5,
      months: 3,
    });

    const updated = useCartStore.getState().catalog.find((c) => c.id === cat.id)!;
    expect(updated.title).toBe('Edited');
    expect(updated.summary).toContain('€');
    const paired = useCartStore.getState().discounts.find((d) => d.id === `from-${cat.id}`)!;
    expect(paired).toMatchObject({ mode: 'amount', value: 5, months: 3 });
  });
});
