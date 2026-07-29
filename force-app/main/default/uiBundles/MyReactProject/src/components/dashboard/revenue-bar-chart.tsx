import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import type { AccountRecord } from '@/store/slices/AccountsSlice';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function RevenueBarChart({ accounts }: { accounts: AccountRecord[] }) {
  const labels = accounts.map((account) => account.name);
  const data = accounts.map((account) => account.annualRevenue || 0);

  if (accounts.length === 0) {
    return <div className="p-6 text-sm text-slate-500">No annual revenue data available.</div>;
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Annual revenue',
        data,
        backgroundColor: 'rgba(14, 165, 233, 0.85)',
        borderRadius: 6,
        maxBarThickness: 36,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: { parsed: { y: number | null } }) =>
            formatCurrency(context.parsed.y ?? 0),
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: string | number) => formatCurrency(Number(value)),
        },
      },
    },
  };

  return (
    <div className="space-y-4 p-4">

      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
