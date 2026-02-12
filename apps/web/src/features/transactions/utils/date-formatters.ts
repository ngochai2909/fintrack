/**
 * Format date header with Vietnamese labels
 * Returns: "📅 Hôm nay", "📅 Hôm qua", or "📅 Thứ hai, 12 tháng 1, 2024"
 */
export function formatTransactionDateHeader(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time to compare dates only
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return '📅 Hôm nay';
  } else if (date.getTime() === yesterday.getTime()) {
    return '📅 Hôm qua';
  } else {
    return (
      '📅 ' +
      date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
  }
}

/**
 * Format time in HH:mm format
 */
export function formatTransactionTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format date in short format (DD/MM/YYYY)
 */
export function formatTransactionDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
}
