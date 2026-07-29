import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontakt. Zaposli.ba',
  description:
    'Kontaktirajte tim Zaposli.ba: email info@zaposli.ba, telefon +387 61 123 456 ili putem kontakt forme. Odgovaramo u roku od 24 sata.',
  alternates: { canonical: 'https://ocjenime.github.io/zaposli.ba/kontakt/' },
};

export default function KontaktLayout({ children }: { children: React.ReactNode }) {
  return children;
}
