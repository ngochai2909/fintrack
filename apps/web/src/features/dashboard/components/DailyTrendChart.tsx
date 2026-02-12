import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatShortDate, formatCurrency } from '@/lib/formatters';

interface DailyTrendData {
  date: string;
  income: number;
  expense: number;
}

interface DailyTrendChartProps {
  data: DailyTrendData[];
}

export function DailyTrendChart({ data }: DailyTrendChartProps) {
  if (data.length === 0) {
    return <EmptyChart message="Chưa có dữ liệu trong 30 ngày qua" />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        📈 Xu hướng 30 ngày
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => formatShortDate(date)}
            fontSize={12}
          />
          <YAxis fontSize={12} tickFormatter={(value) => formatCurrency(value)} />
          <Tooltip
            content={<CustomTooltip />}
            formatter={(value: number) => formatCurrency(value)}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#10B981"
            strokeWidth={2}
            name="Thu nhập"
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#EF4444"
            strokeWidth={2}
            name="Chi tiêu"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  return (
    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
      <p className="text-sm font-semibold text-gray-700 mb-2">
        {formatShortDate(data.date)}
      </p>
      <p className="text-sm text-green-600">
        Thu: {formatCurrency(data.income)}
      </p>
      <p className="text-sm text-red-600">Chi: {formatCurrency(data.expense)}</p>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
      <div className="text-center">
        <div className="text-4xl mb-2">📊</div>
        <p className="text-gray-500">{message}</p>
      </div>
    </div>
  );
}
