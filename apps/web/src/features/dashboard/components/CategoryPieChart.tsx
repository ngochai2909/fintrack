import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '@/lib/formatters';

interface CategoryData {
  categoryName: string;
  amount: number;
  count: number;
  categoryId?: string;
}

interface CategoryPieChartProps {
  data: CategoryData[];
  title: string;
  icon: string;
  type: 'income' | 'expense';
}

const COLORS = {
  income: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'],
  expense: ['#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2'],
};

export function CategoryPieChart({ data, title, icon, type }: CategoryPieChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          {icon} {title}
        </h2>
        <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-500">Chưa có dữ liệu</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.categoryName,
    value: item.amount,
    count: item.count,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        {icon} {title}
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[type][index % COLORS[type].length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomPieTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function renderCustomLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
  const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

  if (percent < 0.05) return null; // Hide labels < 5%

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function CustomPieTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  return (
    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
      <p className="text-sm font-semibold text-gray-700 mb-1">{data.name}</p>
      <p className="text-sm text-gray-600">
        Số tiền: <span className="font-semibold">{formatCurrency(data.value)}</span>
      </p>
      <p className="text-sm text-gray-600">
        Số lượng: <span className="font-semibold">{data.payload.count}</span> giao dịch
      </p>
    </div>
  );
}
