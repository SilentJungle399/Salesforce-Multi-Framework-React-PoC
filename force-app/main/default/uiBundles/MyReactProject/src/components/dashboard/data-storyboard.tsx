import { Building2, Users, Boxes } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { AccountRecord } from '@/store/slices/AccountsSlice';
import type { ContactRecord } from '@/store/slices/ContactsSlice';
import type { TestObjectRecord } from '@/store/slices/testObjectSlice';

function countBy<T>(items: T[], selector: (item: T) => string) {
  return items.reduce<Record<string, number>>((accumulator, item) => {
    const key = selector(item) || 'Unknown';
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});
}

function getTopEntry(counts: Record<string, number>) {
  return Object.entries(counts).sort((left, right) => right[1] - left[1])[0];
}

function MetricBar({
  label,
  value,
  percent,
}: {
  label: string;
  value: string;
  percent: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-500"
          style={{ width: `${Math.max(percent, 8)}%` }}
        />
      </div>
    </div>
  );
}

function ObjectCard({
  icon,
  title,
  badge,
  metrics,
  accentClassName,
}: {
  icon: React.ReactNode;
  title: string;
  badge: string;
  metrics: Array<{ label: string; value: string; percent: number }>;
  accentClassName: string;
}) {
  return (
    <Card className="overflow-hidden pt-0 border-slate-200/80 bg-white/90 shadow-lg shadow-slate-200/60 backdrop-blur">
      <div className={`h-1 ${accentClassName}`} />
      <CardHeader className="space-y-3 border-b border-slate-100 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
              {icon}
            </div>
            <div>
              <CardTitle className="text-xl text-slate-950">{title}</CardTitle>
            </div>
          </div>
          <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
            {badge}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {metrics.map((metric) => (
          <MetricBar
            key={metric.label}
            label={metric.label}
            value={metric.value}
            percent={metric.percent}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export function ObjectStoryboard({
  accounts,
  contacts,
  testObjects,
}: {
  accounts: AccountRecord[];
  contacts: ContactRecord[];
  testObjects: TestObjectRecord[];
}) {
  const accountTypes = countBy(accounts, (record) => record.type);
  const accountIndustries = countBy(accounts, (record) => record.industry);
  const contactLeadSources = countBy(contacts, (record) => record.leadSource);
  const contactDepartments = countBy(contacts, (record) => record.department);
  const accountTopType = getTopEntry(accountTypes);
  const accountTopIndustry = getTopEntry(accountIndustries);
  const contactTopSource = getTopEntry(contactLeadSources);
  const contactTopDepartment = getTopEntry(contactDepartments);

  const accountRevenue = accounts.reduce((total, record) => total + (record.annualRevenue || 0), 0);
  const accountEmployees = accounts.reduce((total, record) => total + (record.numberOfEmployees || 0), 0);
  const avgTestValueLength = testObjects.length
    ? Math.round(
        testObjects.reduce((total, record) => total + (record.testValue?.length ?? 0), 0) /
          testObjects.length
      )
    : 0;

  const maxCategoryCount = Math.max(
    accountTopType?.[1] ?? 1,
    accountTopIndustry?.[1] ?? 1,
    contactTopSource?.[1] ?? 1,
    contactTopDepartment?.[1] ?? 1,
    1
  );

  return (
    <section className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <ObjectCard
          icon={<Building2 className="h-5 w-5" />}
          title="Accounts"
          badge={`${accounts.length} records`}
          accentClassName="bg-gradient-to-r from-cyan-500 to-sky-500"
          metrics={[
            {
              label: 'Top type',
              value: accountTopType ? `${accountTopType[0]} (${accountTopType[1]})` : 'None yet',
              percent: accountTopType ? (accountTopType[1] / maxCategoryCount) * 100 : 0,
            },
            {
              label: 'Top industry',
              value: accountTopIndustry ? `${accountTopIndustry[0]} (${accountTopIndustry[1]})` : 'None yet',
              percent: accountTopIndustry ? (accountTopIndustry[1] / maxCategoryCount) * 100 : 0,
            },
            {
              label: 'Revenue footprint',
              value: accountRevenue > 0 ? `$${Math.round(accountRevenue).toLocaleString()}` : 'No revenue value',
              percent: accounts.length ? 100 : 0,
            },
          ]}
        />

        <ObjectCard
          icon={<Users className="h-5 w-5" />}
          title="Contacts"
          badge={`${contacts.length} records`}
          accentClassName="bg-gradient-to-r from-amber-500 to-orange-500"
          metrics={[
            {
              label: 'Top lead source',
              value: contactTopSource ? `${contactTopSource[0]} (${contactTopSource[1]})` : 'None yet',
              percent: contactTopSource ? (contactTopSource[1] / maxCategoryCount) * 100 : 0,
            },
            {
              label: 'Top department',
              value: contactTopDepartment ? `${contactTopDepartment[0]} (${contactTopDepartment[1]})` : 'None yet',
              percent: contactTopDepartment ? (contactTopDepartment[1] / maxCategoryCount) * 100 : 0,
            },
            {
              label: 'Employee touchpoints',
              value: accountEmployees > 0 ? `${accountEmployees.toLocaleString()} potential contacts` : 'Not derived yet',
              percent: contacts.length ? 100 : 0,
            },
          ]}
        />

        <ObjectCard
          icon={<Boxes className="h-5 w-5" />}
          title="Test Object"
          badge={`${testObjects.length} records`}
          accentClassName="bg-gradient-to-r from-violet-500 to-fuchsia-500"
          metrics={[
            {
              label: 'Field depth',
              value: '3 exposed fields',
              percent: 100,
            },
            {
              label: 'Address coverage',
              value: testObjects.some((record) => Boolean(record.address)) ? 'Address captured' : 'No address yet',
              percent: testObjects.length ? 100 : 0,
            },
            {
              label: 'Value length signal',
              value: avgTestValueLength > 0 ? `${avgTestValueLength} chars avg` : 'No values yet',
              percent: testObjects.length ? 100 : 0,
            },
          ]}
        />
      </div>
    </section>
  );
}
