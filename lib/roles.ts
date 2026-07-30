export type UserRole = 'client' | 'firm' | 'majstor';

export function isFirmRole(role: string | null): boolean {
  return role === 'firm' || role === 'majstor';
}

export function roleLabel(role: string | null): string {
  if (role === 'client') return 'Klijent';
  if (role === 'firm') return 'Firma';
  if (role === 'majstor') return 'Majstor';
  return 'Nepoznato';
}

export function roleInputOptions() {
  return [
    { value: 'client', label: 'Klijent' },
    { value: 'firm', label: 'Firma' },
    { value: 'majstor', label: 'Majstor' },
  ];
}
