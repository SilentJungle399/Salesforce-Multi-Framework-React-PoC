import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import RevenueBarChart from '@/components/dashboard/revenue-bar-chart';

describe('RevenueBarChart', () => {
  it('renders a chart canvas for account revenue data', () => {
    const { container } = render(
      <RevenueBarChart
        accounts={[
          { name: 'Acme Corp', annualRevenue: 120000000, accountNumber: 'A1', rating: 'Hot', phone: '', type: '', ownership: '', industry: '', numberOfEmployees: 120 },
          { name: 'Globex', annualRevenue: 45000000, accountNumber: 'A2', rating: 'Warm', phone: '', type: '', ownership: '', industry: '', numberOfEmployees: 40 },
        ]}
      />
    );

    expect(screen.getByText('Annual revenue by account')).toBeInTheDocument();
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });
});
