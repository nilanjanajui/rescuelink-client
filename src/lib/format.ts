export function timeAgo(date: string | Date): string {
  const then = new Date(date).getTime();
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));

  const units: [string, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];

  for (const [label, secondsInUnit] of units) {
    const value = Math.floor(seconds / secondsInUnit);
    if (value >= 1) return `${value} ${label}${value > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
}

export function urgencyColor(urgency: 'critical' | 'moderate' | 'low'): string {
  return {
    critical: 'bg-red-600',
    moderate: 'bg-amber-500',
    low: 'bg-teal-600',
  }[urgency];
}
