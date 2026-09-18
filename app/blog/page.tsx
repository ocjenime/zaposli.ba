import type { Metadata } from 'next';
import BlogClient from './BlogClient';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Blog - savjeti za renoviranje i građevinske radove | Zaposli.ba',
  description:
    'Praktični članci, ideje i vodiči za sve koji grade, renoviraju ili traže pouzdane majstore u Bosni i Hercegovini.',
  alternates: { canonical: `${site.url}/blog/` },
  openGraph: {
    title: 'Blog | Zaposli.ba',
    description:
      'Praktični članci, ideje i vodiči za sve koji grade, renoviraju ili traže pouzdane majstore u BiH.',
    url: `${site.url}/blog/`,
    images: [{ url: `${site.url}/images/og-cover.webp`, width: 1200, height: 630, alt: 'Zaposli.ba - Blog' }],
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
