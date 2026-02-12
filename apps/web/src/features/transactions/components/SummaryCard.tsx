import { formatCardAmount } from '@/lib/formatters';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: string;
  color: 'green' | 'red' | 'blue' | 'yellow';
}

export function SummaryCard({ title, amount, icon, color }: SummaryCardProps) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    blue: 'bg-blue-50 border-blue-200',
    yellow: 'bg-yellow-50 border-yellow-200',
  };

  const textColorClasses = {
    green: 'text-green-700',
    red: 'text-red-700',
    blue: 'text-blue-700',
    yellow: 'text-yellow-700',
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm font-medium text-gray-600">{title}</span>
      </div>
      <p className={`text-2xl font-bold ${textColorClasses[color]}`}>
        {formatCardAmount(amount)}
      </p>
    </div>
  );
}
