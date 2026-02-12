import { formatCardAmount } from '@/lib/formatters';

interface DashboardSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  balanceChange: number;
  month: string;
}

interface DashboardSummaryCardsProps {
  summary: DashboardSummary;
}

export function DashboardSummaryCards({ summary }: DashboardSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <SummaryCard
        title="Tổng số dư"
        value={summary.totalBalance}
        icon="💰"
        color="blue"
        isCurrency
      />
      <SummaryCard
        title="Thu nhập tháng này"
        value={summary.monthlyIncome}
        icon="📈"
        color="green"
        isCurrency
        prefix="+"
      />
      <SummaryCard
        title="Chi tiêu tháng này"
        value={summary.monthlyExpense}
        icon="📉"
        color="red"
        isCurrency
        prefix="-"
      />
      <SummaryCard
        title="Chênh lệch"
        value={summary.balanceChange}
        icon={summary.balanceChange >= 0 ? '✅' : '⚠️'}
        color={summary.balanceChange >= 0 ? 'green' : 'yellow'}
        isCurrency
        prefix={summary.balanceChange >= 0 ? '+' : ''}
      />
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: number;
  icon: string;
  color: 'blue' | 'green' | 'red' | 'yellow';
  isCurrency?: boolean;
  prefix?: string;
}

function SummaryCard({
  title,
  value,
  icon,
  color,
  isCurrency = false,
  prefix = '',
}: SummaryCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    yellow: 'bg-yellow-50 border-yellow-200',
  };

  const textColorClasses = {
    blue: 'text-blue-700',
    green: 'text-green-700',
    red: 'text-red-700',
    yellow: 'text-yellow-700',
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6 shadow-sm`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-3xl">{icon}</span>
        <span className="text-sm font-medium text-gray-600">{title}</span>
      </div>
      <p className={`text-3xl font-bold ${textColorClasses[color]}`}>
        {prefix}
        {isCurrency ? formatCardAmount(value) : value}
      </p>
    </div>
  );
}
