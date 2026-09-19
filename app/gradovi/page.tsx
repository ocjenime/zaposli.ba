import type { Metadata } from 'next';
import GradoviClient from './GradoviClient';
import { cities } from '@/lib/data';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: `Majstori po gradovima - ${cities.length} gradova u BiH | Zaposli.ba`,
  description: `Pronađite provjerene majstore i građevinske firme u ${cities.length} gradova širom Bosne i Hercegovine. Sarajevo, Banja Luka, Mostar, Tuzla i ostali - objavite posao besplatno.`,
  keywords: [
    'majstori po gradovima',
    'građevinske firme BiH',
    'majstor Sarajevo',
    'majstor Banja Luka',
    'majstor Mostar',
    'majstor Tuzla',
    'objavi posao',
    'ponude majstora',
  ],
  alternates: { canonical: `${site.url}/gradovi/` },
};

export default function CitiesPage() {
  return <GradoviClient />;
}
