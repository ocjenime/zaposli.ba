// Helpers that format dates deterministically as dd/mm/yyyy (or dd/mm/yyyy HH:mm)
// regardless of Node.js/Deno ICU locale support.

export function formatDate(iso: string | Date): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDateTime(iso: string | Date): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Optional compact variant without leading zeros if you prefer "5/8/2026"
export function formatDateCompact(iso: string | Date): string {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export function formatMonthYear(iso: string | Date | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}/${year}`;
}
