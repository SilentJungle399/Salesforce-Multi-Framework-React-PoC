import { useEffect, type ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAccounts } from '@/store/slices/AccountsSlice';
import { fetchContacts } from '@/store/slices/ContactsSlice';
import { fetchTestObjects } from '@/store/slices/testObjectSlice';
import { ObjectStoryboard } from '@/components/dashboard/data-storyboard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

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

function SummaryCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="border-slate-200/80 bg-white/80 shadow-sm backdrop-blur">
      <CardContent className="pt-6">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          {value}
        </div>
        <p className="mt-2 text-sm text-slate-500">{hint}</p>
      </CardContent>
    </Card>
  );
}

function SectionShell({
  title,
  description,
  recordsLabel,
  children,
}: {
  title: string;
  description: string;
  recordsLabel: string;
  children: ReactNode;
}) {
  return (
    <Card className="border-slate-200/80 bg-white/85 shadow-xl shadow-slate-200/60 backdrop-blur gap-0 pb-0">
      <CardHeader className="space-y-2 border-b border-slate-100">
        <div className="flex flex-wrap items-start justify-between ">
          <div>
            <CardTitle className="text-xl text-slate-950">{title}</CardTitle>
          </div>
          <Badge
            variant="outline"
            className="border-slate-200 bg-slate-50 text-slate-700"
          >
            {recordsLabel}
          </Badge>
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
  const testObjects = useAppSelector((state) => state.testObjects);

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchContacts());
    dispatch(fetchTestObjects());
  }, [dispatch]);

  const totalRecords =
    accounts.records.length + contacts.records.length + testObjects.records.length;
  const anyError = accounts.error ?? contacts.error ?? testObjects.error;

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

        <ObjectStoryboard
          accounts={accounts.records}
          contacts={contacts.records}
          testObjects={testObjects.records}
        />

        <Tabs defaultValue="accounts" className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-3 bg-slate-100 p-1">
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="testObjects">Test Objects</TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" className="mt-4">
            <SectionShell
              title="Accounts"
              description="Operational account data rendered as a clean summary table with business-friendly formatting."
              recordsLabel={`${accounts.records.length} records`}
            >
              {accounts.loading ? (
                <LoadingTable columns={6} />
              ) : accounts.records.length === 0 ? (
                <div className="p-6 text-sm text-slate-500">No account records were returned.</div>
              ) : (
                <div className="overflow-x-auto">
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
                </div>
              )}
            </SectionShell>
          </TabsContent>

          <TabsContent value="contacts" className="mt-4">
            <SectionShell
              title="Contacts"
              description="A contact experience that emphasizes communication details and source context."
              recordsLabel={`${contacts.records.length} records`}
            >
              {contacts.loading ? (
                <LoadingTable columns={7} />
              ) : contacts.records.length === 0 ? (
                <div className="p-6 text-sm text-slate-500">No contact records were returned.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-100 bg-slate-50/80 hover:bg-slate-50">
                        <TableHead>Name</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Lead Source</TableHead>
                        <TableHead>Languages</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.records.map((record) => (
                        <TableRow key={`${record.name}-${record.email}`}>
                          <TableCell className="font-medium text-slate-950">{record.name}</TableCell>
                          <TableCell>{record.title || '—'}</TableCell>
                          <TableCell>{record.department || '—'}</TableCell>
                          <TableCell className="text-slate-600">{record.email || '—'}</TableCell>
                          <TableCell>{record.phone || '—'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{record.leadSource || 'N/A'}</Badge>
                          </TableCell>
                          <TableCell>{record.languages || '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </SectionShell>
          </TabsContent>

          <TabsContent value="testObjects" className="mt-4">
            <SectionShell
              title="Test Objects"
              description="A small custom object surface that proves the pattern works for non-standard data shapes too."
              recordsLabel={`${testObjects.records.length} records`}
            >
              {testObjects.loading ? (
                <LoadingTable columns={3} />
              ) : testObjects.records.length === 0 ? (
                <div className="p-6 text-sm text-slate-500">No custom object records were returned.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-100 bg-slate-50/80 hover:bg-slate-50">
                        <TableHead>Name</TableHead>
                        <TableHead>Test Value</TableHead>
                        <TableHead>Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testObjects.records.map((record) => (
                        <TableRow key={`${record.name}-${record.address}`}>
                          <TableCell className="font-medium text-slate-950">{record.name}</TableCell>
                          <TableCell>{record.testValue}</TableCell>
                          <TableCell className="text-slate-600">{record.address}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </SectionShell>
          </TabsContent>
        </Tabs>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-2 text-sm text-slate-500">
          <span>Built with Redux slices, Salesforce GraphQL, shadcn UI, and Tailwind CSS.</span>
          <span>Responsive layout optimized for quick proof-of-concept demos.</span>
        </div>
      </div>
    </div>
  );
}
