import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kupi oglas | Zaposli.ba',
  description: 'Kreirajte premium oglas za vašu firmu ili majstorski profil na Zaposli.ba. Homepage banner, homepage mini oglas ili oglas na stranici svih oglasa.',
};

export default function BuyAdLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
