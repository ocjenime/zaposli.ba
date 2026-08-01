import type { Metadata } from 'next';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Kontakt. Zaposli.ba',
  description:
    `Kontaktirajte tim Zaposli.ba: email ${site.email}${site.phone ? `, telefon ${site.phone}` : ''} ili putem kontakt forme. Odgovaramo u roku od 24 sata.`,
  alternates: { canonical: `${site.url}/kontakt/` },
};

export default function KontaktLayout({ children }: { children: React.ReactNode }) {
  return children;
}
