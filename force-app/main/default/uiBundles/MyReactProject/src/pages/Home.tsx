import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { useEffect, type ReactNode } from 'react';
import { Pie } from 'react-chartjs-2';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAccounts } from '@/store/slices/AccountsSlice';
import { fetchContacts } from '@/store/slices/ContactsSlice';
import { ObjectStoryboard } from '@/components/dashboard/data-storyboard';
import RevenueBarChart from '@/components/dashboard/revenue-bar-chart';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

ChartJS.register(ArcElement, Tooltip, Legend);

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}


function SectionShell({
  title,
  recordsLabel,
  children,
}: {
  title: string;
  recordsLabel?: string | undefined;
  children: ReactNode;
}) {
  return (
    <Card className="h-full border-slate-200/80 bg-white/85 shadow-xl shadow-slate-200/60 backdrop-blur pb-0 gap-0">
      <CardHeader className="space-y-2 border-b border-slate-100 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-xl text-slate-950">{title}</CardTitle>

          </div>
          {recordsLabel && (<Badge
            variant="outline"
            className="border-slate-200 bg-slate-50 text-slate-700"
          >
            {recordsLabel}
          </Badge>)}
        </div>
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}

function LoadingTable({
  columns,
  rows = 5,
}: {
  columns: number;
  rows?: number;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-100 hover:bg-transparent">
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead key={index}>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className="border-slate-100">
              {Array.from({ length: columns }).map((__, cellIndex) => (
                <TableCell key={cellIndex}>
                  <Skeleton className="h-4 w-full max-w-40" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function Home() {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector((state) => state.accounts);
  const contacts = useAppSelector((state) => state.contacts);

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchContacts());
  }, [dispatch]);

  const anyError = accounts.error ?? contacts.error;

  const departmentCounts = contacts.records.reduce<Record<string, number>>((accumulator, record) => {
    const department = record.department || 'Unspecified';
    accumulator[department] = (accumulator[department] ?? 0) + 1;
    return accumulator;
  }, {});

  const departmentChartData = {
    labels: Object.keys(departmentCounts),
    datasets: [
      {
        data: Object.values(departmentCounts),
        backgroundColor: ['#0ea5e9', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444', '#64748b'],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const departmentChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: { label: string; parsed: number }) =>
            `${context.label}: ${context.parsed} contacts`,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.12),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_55%,_#f8fafc_100%)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {anyError ? (
          <Card className="border-amber-200 bg-amber-50 text-amber-950 shadow-sm">
            <CardContent className="p-6">
              <p className="font-medium">Some data could not be loaded.</p>
              <p className="mt-2 text-sm text-amber-900/80">{anyError}</p>
            </CardContent>
          </Card>
        ) : null}

        <section className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-12">
            <SectionShell
              title="Operational relationship map"
            >
              <div className="p-4">
                <ObjectStoryboard
                  accounts={accounts.records}
                  contacts={contacts.records}
                />
              </div>
            </SectionShell>
          </div>

          <div className="lg:col-span-7">
            <SectionShell
              title="Contacts"
              recordsLabel={`${contacts.records.length} records`}
            >
              <div className="max-h-[18rem] overflow-auto">
                {contacts.loading ? (
                  <LoadingTable columns={3} />
                ) : contacts.records.length === 0 ? (
                  <div className="p-6 text-sm text-slate-500">No contact records were returned.</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-100 bg-slate-50/80 hover:bg-slate-50">
                        <TableHead>Name</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Department</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.records.map((record) => (
                        <TableRow key={`${record.name}-${record.email}`}>
                          <TableCell className="font-medium text-slate-950">{record.name}</TableCell>
                          <TableCell>{record.title || '—'}</TableCell>
                          <TableCell>{record.department || '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </SectionShell>
          </div>
          <div className="lg:col-span-5">
            <SectionShell
              title="Contacts by Department"
            >
              <div className="p-4">
                {contacts.loading ? (
                  <LoadingTable columns={1} />
                ) : contacts.records.length === 0 ? (
                  <div className="p-6 text-sm text-slate-500">No contact records were returned.</div>
                ) : (
                  <div className="h-64">
                    <Pie data={departmentChartData} options={departmentChartOptions} />
                  </div>
                )}
              </div>
            </SectionShell>
          </div>
        </section>

        <div className="lg:col-span-12">
          <SectionShell
            title="Accounts"
            recordsLabel={`${accounts.records.length} records`}
          >
            <div className="max-h-[22rem] overflow-auto">
              {accounts.loading ? (
                <LoadingTable columns={6} />
              ) : accounts.records.length === 0 ? (
                <div className="p-6 text-sm text-slate-500">No account records were returned.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-100 bg-slate-50/80 hover:bg-slate-50">
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead className="text-right">Annual Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.records.map((record) => (
                      <TableRow key={`${record.name}-${record.accountNumber}`}>
                        <TableCell className="font-medium text-slate-950">{record.name}</TableCell>
                        <TableCell>{record.type || '—'}</TableCell>
                        <TableCell>{record.industry || '—'}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                            {record.rating || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatNumber(record.numberOfEmployees)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(record.annualRevenue)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </SectionShell>
        </div>
        <div className="lg:col-span-12">
          <SectionShell
            title="Accounts by Annual Revenue"
          >
            <div className="max-h-[24rem] overflow-auto">
              {accounts.loading ? (
                <LoadingTable columns={1} />
              ) : accounts.records.length === 0 ? (
                <div className="p-6 text-sm text-slate-500">No account records were returned.</div>
              ) : (
                <RevenueBarChart accounts={accounts.records} />
              )}
            </div>
          </SectionShell>
        </div>
      </div>
    </div>
  );
}
