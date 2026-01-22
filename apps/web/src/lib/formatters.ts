/**
 * FORMATTERS UTILITY
 * 
 * Các hàm format số tiền, ngày tháng cho dễ đọc
 */

/**
 * Format số tiền dạng compact (gọn)
 * 
 * @example
 * formatCompactNumber(1000) => "1K"
 * formatCompactNumber(1500000) => "1.5M"
 * formatCompactNumber(1500000000) => "1.5B"
 */
export function formatCompactNumber(value: number): string {
  if (value === 0) return '0';
  
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (abs >= 1_000_000_000) {
    return sign + (abs / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  
  if (abs >= 1_000_000) {
    return sign + (abs / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  
  if (abs >= 1_000) {
    return sign + (abs / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  
  return sign + abs.toString();
}

/**
 * Format số tiền với currency (đầy đủ)
 * 
 * @example
 * formatCurrency(1500000) => "1.500.000 ₫"
 * formatCurrency(1500000, 'compact') => "1.5M ₫"
 */
export function formatCurrency(
  value: number | string,
  options?: {
    currency?: string;
    compact?: boolean;
    showSymbol?: boolean;
  }
): string {
  const {
    currency = 'VND',
    compact = false,
    showSymbol = true,
  } = options || {};
  
  // Convert to number if string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Handle invalid numbers
  if (isNaN(numValue)) return '0';
  
  // Compact format
  if (compact) {
    const formatted = formatCompactNumber(numValue);
    return showSymbol ? `${formatted} ₫` : formatted;
  }
  
  // Full format with thousand separators
  const formatted = new Intl.NumberFormat('vi-VN').format(numValue);
  
  if (!showSymbol) return formatted;
  
  // Add currency symbol
  return currency === 'VND' ? `${formatted} ₫` : `${formatted} ${currency}`;
}

/**
 * Format số tiền cho card hiển thị (tự động chọn compact nếu số quá lớn)
 * 
 * @example
 * formatCardAmount(15000) => "15.000 ₫"
 * formatCardAmount(1500000) => "1.5M ₫"
 * formatCardAmount(150000000) => "150M ₫"
 */
export function formatCardAmount(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '0 ₫';
  
  const abs = Math.abs(numValue);
  
  // Nếu > 1 triệu thì dùng compact
  if (abs >= 1_000_000) {
    return formatCurrency(numValue, { compact: true });
  }
  
  // Ngược lại hiển thị đầy đủ
  return formatCurrency(numValue, { compact: false });
}

/**
 * Format ngày tháng
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format ngày tháng ngắn gọn
 */
export function formatShortDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Format relative time (hôm qua, hôm nay, ...)
 */
export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Hôm nay';
  if (days === 1) return 'Hôm qua';
  if (days < 7) return `${days} ngày trước`;
  if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
  if (days < 365) return `${Math.floor(days / 30)} tháng trước`;
  return `${Math.floor(days / 365)} năm trước`;
}
