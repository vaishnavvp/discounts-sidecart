import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DiscountFormModal from '@/components/DiscountFormModal';
import { resetCartStore } from './testUtils';
import { useCartStore } from '@/store/useCartStore';

beforeEach(() => resetCartStore());

function ModalHarness(props: React.ComponentProps<typeof DiscountFormModal>) {
  return <DiscountFormModal {...props} />;
}

test('Duration field is hidden when "one-time" is selected', async () => {
  render(<ModalHarness open edit={false} onClose={() => {}} />);
  // default is monthly -> Duration visible
  expect(screen.getByText(/Duration/i)).toBeInTheDocument();

  // Click "One time price"
  await userEvent.click(screen.getByRole('button', { name: /One time price/i }));
  // Duration should disappear
  expect(screen.queryByText(/Duration/i)).not.toBeInTheDocument();
});

test('Add flow creates enabled manual monthly discount', async () => {
  render(<ModalHarness open edit={false} onClose={() => {}} />);

  // Keep monthly; type 15% for 3 months; description "Promo"
  const valueInput = screen.getByLabelText(/discount-value/i);
await userEvent.clear(valueInput);
await userEvent.type(valueInput, '15');

const descInput = screen.getByRole('textbox');
await userEvent.type(descInput, 'Promo');

await userEvent.click(screen.getByRole('button', { name: /^Add$/ }));
  const s = useCartStore.getState();
  const created = s.catalog.find((c) => c.title === 'Promo');
  expect(created?.enabled).toBe(true);
  const paired = s.discounts.find((d) => d.id === `from-${created?.id}`);
  expect(paired).toBeTruthy();
});
