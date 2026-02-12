import { TransactionType } from '@/types/category';

interface TransactionFiltersProps {
  filterType: string;
  searchQuery: string;
  onFilterTypeChange: (type: string) => void;
  onSearchQueryChange: (query: string) => void;
  totalCount: number;
  filteredCount: number;
}

export function TransactionFilters({
  filterType,
  searchQuery,
  onFilterTypeChange,
  onSearchQueryChange,
  totalCount,
  filteredCount,
}: TransactionFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Type Filter */}
        <div className="flex gap-2">
          <FilterButton
            label="Tất cả"
            active={filterType === 'ALL'}
            onClick={() => onFilterTypeChange('ALL')}
          />
          <FilterButton
            label="💰 Thu"
            active={filterType === TransactionType.INCOME}
            onClick={() => onFilterTypeChange(TransactionType.INCOME)}
          />
          <FilterButton
            label="💸 Chi"
            active={filterType === TransactionType.EXPENSE}
            onClick={() => onFilterTypeChange(TransactionType.EXPENSE)}
          />
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Tìm kiếm giao dịch..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Results count */}
      <div className="mt-3 text-sm text-gray-600">
        Hiển thị {filteredCount} / {totalCount} giao dịch
      </div>
    </div>
  );
}

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterButton({ label, active, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        active
          ? 'bg-blue-500 text-white shadow-md'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
}
