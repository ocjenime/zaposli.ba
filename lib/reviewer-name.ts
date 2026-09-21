// Formats a reviewer's display name as "Firstname L." (full first name +
// first letter of last name). Falls back to 'Klijent' when unknown.
export function formatReviewerName(fullName: string | null | undefined): string {
  if (!fullName) return 'Klijent';
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'Klijent';
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1].charAt(0).toUpperCase()}.`;
}
