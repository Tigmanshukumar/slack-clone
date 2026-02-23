export function formatTimestamp(d: Date) {
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const sameYear = d.getFullYear() === now.getFullYear();
  const time = d.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).replace(/\sAM|\sPM/, m => m.toLowerCase().trim());
  if (sameDay) return time; // e.g., 10:43 am
  const datePart = d.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
  return `${datePart} ${time}`; // e.g., Mar 5 3:15 pm or Mar 5, 2025 3:15 pm
}
