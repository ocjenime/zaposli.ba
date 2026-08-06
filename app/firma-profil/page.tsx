import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profil firme | Zaposli.ba',
  robots: { index: false, follow: true },
};

export default async function FirmProfileIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const { slug } = await searchParams;
  if (slug) {
    redirect(`/firma-profil/${slug}/`);
  }
  redirect('/top-firme/');
}
