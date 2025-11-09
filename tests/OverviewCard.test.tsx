import React from 'react';
import { render, screen } from '@testing-library/react';
import OverviewCard from '@/components/OverviewCard';
import { useCartStore } from '@/store/useCartStore';
import { resetCartStore } from './testUtils';

beforeEach(() => resetCartStore());

test('Shows first N months and next months totals for monthly discounts', () => {
  const add = useCartStore.getState().addManualToCatalog;
  // Add 25% off for the first 3 months
  add({ type: 'monthly', mode: 'percent', value: 25, months: 3, desc: 'Q1' });

  render(<OverviewCard />);

  // Headline (eventual monthly = base monthly after discounted window)
  expect(screen.getByText(/Eventually per month/i)).toBeInTheDocument();

  // The breakdown rows exist
  expect(screen.getByText(/First .* months \(total\)/i)).toBeInTheDocument();
  expect(screen.getByText(/Next .* months \(total\)/i)).toBeInTheDocument();
});
