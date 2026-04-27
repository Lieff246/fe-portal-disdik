export function timeAgo(timestamp: number): string {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) {
    if (diffInMinutes <= 0) return 'Baru saja';
    return `${diffInMinutes} menit yang lalu`;
  }
  
  if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  }

  if (diffInDays <= 7) {
    return `${diffInDays} hari yang lalu`;
  }

  // Fallback to normal date format DD/MM/YYYY
  const date = new Date(timestamp);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}
