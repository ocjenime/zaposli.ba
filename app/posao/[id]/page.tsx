import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';
import { MapPin, Clock, ArrowRight, Tag, Users, Wallet } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ShareButtons from '@/components/ShareButtons';
import CopyAdTextButton from '@/components/CopyAdTextButton';
import { JsonLd, jobPostingSchema, breadcrumbSchema } from '@/lib/jsonld';
import { getCategory } from '@/lib/data';
import { site } from '@/lib/site';
import { formatDate } from '@/lib/date';
import { plural } from '@/lib/plural';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface JobRow {
  id: string;
  title: string;
  description: string;
  city: string;
  category_slug: string;
  status: string;
  created_at: string;
  deadline: string | null;
  budget_mode: string | null;
  budget_min: number | null;
  budget_max: number | null;
  bids_count: number | null;
  job_images: { image_url: string }[] | null;
}

function createServerSupabase() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function fetchJob(id: string): Promise<JobRow | null> {
  try {
    const supabase = createServerSupabase();
    const { data } = await supabase
      .from('jobs')
      .select(
        'id, title, description, city, category_slug, status, created_at, deadline, budget_mode, budget_min, budget_max, bids_count, job_images(image_url)'
      )
      .eq('id', id)
      .single();
    return (data as JobRow | null) ?? null;
  } catch {
    return null;
  }
}

async function fetchRelated(categorySlug: string, excludeId: string): Promise<JobRow[]> {
  try {
    const supabase = createServerSupabase();
    const { data } = await supabase
      .from('jobs')
      .select('id, title, description, city, category_slug, status, created_at, deadline, budget_mode, budget_min, budget_max, bids_count')
      .eq('category_slug', categorySlug)
      .in('status', ['open', 'bidding'])
      .neq('id', excludeId)
      .order('created_at', { ascending: false })
      .limit(5);
    return (data as JobRow[]) || [];
  } catch {
    return [];
  }
}

function formatBudget(job: JobRow): string {
  if (job.budget_mode === 'open' || (!job.budget_min && !job.budget_max)) return 'Majstori predlažu';
  if (job.budget_min && job.budget_max) return `${job.budget_min} - ${job.budget_max} KM`;
  if (job.budget_min) return `od ${job.budget_min} KM`;
  return `do ${job.budget_max} KM`;
}

const isActive = (status: string) => status === 'open' || status === 'bidding';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const job = await fetchJob(id);
  if (!job) {
    return { title: 'Posao nije pronađen | Zaposli.ba', robots: { index: false, follow: true } };
  }
  const category = getCategory(job.category_slug);
  const desc = job.description.length > 155 ? `${job.description.slice(0, 152)}...` : job.description;
  return {
    title: `${job.title} - posao ${job.city} | Zaposli.ba`,
    description: `${desc} Kategorija: ${category?.name || job.category_slug}. Budžet: ${formatBudget(job)}. Pošaljite ponudu besplatno.`,
    keywords: [
      `posao ${job.city.toLowerCase()}`,
      `poslovi ${job.city.toLowerCase()}`,
      `${(category?.name || '').toLowerCase()} ${job.city.toLowerCase()}`,
      'majstor',
      'ponude',
      'objavi posao',
    ],
    alternates: { canonical: `${site.url}/posao/${job.id}/` },
    robots: isActive(job.status) ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title: `${job.title} - posao ${job.city}`,
      description: desc,
      url: `${site.url}/posao/${job.id}/`,
      siteName: site.name,
      locale: 'bs_BA',
      type: 'article',
    },
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await fetchJob(id);
  if (!job) notFound();

  const category = getCategory(job.category_slug);
  const related = isActive(job.status) ? await fetchRelated(job.category_slug, job.id) : [];
  const active = isActive(job.status);
  const budget = formatBudget(job);
  const images = job.job_images || [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <JsonLd
          data={jobPostingSchema({
            title: job.title,
            description: job.description,
            city: job.city,
            created_at: job.created_at,
            deadline: job.deadline,
            budget_mode: job.budget_mode || 'open',
            budget_min: job.budget_min,
            budget_max: job.budget_max,
          })}
        />
        <JsonLd
          data={breadcrumbSchema([
            { name: 'Početna', url: '/' },
            { name: 'Poslovi', url: '/poslovi/' },
            { name: job.title },
          ])}
        />
        <Breadcrumbs items={[{ name: 'Poslovi', href: '/poslovi/' }, { name: job.title }]} />

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-4">
          <div className="grid lg:grid-cols-3 gap-5">
            {/* Glavni sadržaj */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-50 text-brand-orange border border-orange-100">
                    <Tag className="w-3.5 h-3.5" />
                    {category?.name || job.category_slug}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-gray-400'}`} />
                    {active ? 'Otvoreno' : 'Zatvoreno'}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight mb-2">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-steel mb-4">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-brand-orange" />
                    {job.city}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-brand-orange" />
                    {formatDate(job.created_at)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-brand-orange" />
                    {job.bids_count || 0} {plural(job.bids_count || 0, ['ponuda', 'ponude', 'ponuda'])}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-brand-orange" />
                    <strong className="text-gray-900">{budget}</strong>
                  </span>
                </div>

                <h2 className="text-sm font-bold uppercase tracking-wider text-brand-orange mb-1.5">
                  Detalji posla
                </h2>
                <p className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-line mb-5">
                  {job.description}
                </p>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                    {images.slice(0, 6).map((img, idx) => (
                      <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-100">
                        <Image
                          src={img.image_url}
                          alt={`${job.title} - slika ${idx + 1}`}
                          fill
                          sizes="(max-width: 640px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Slični poslovi */}
              {related.length > 0 && (
                <div className="mt-5">
                  <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-3">
                    Slični poslovi
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {related.map((r) => (
                      <Link
                        key={r.id}
                        href={`/posao/${r.id}/`}
                        className="group bg-white rounded-2xl border border-gray-100 p-4 hover:border-brand-orange/40 hover:shadow-md transition-all"
                      >
                        <p className="font-bold text-gray-900 text-[15px] leading-snug line-clamp-2 group-hover:text-brand-orange transition-colors mb-1">
                          {r.title}
                        </p>
                        <p className="text-xs text-steel flex items-center gap-2">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {r.city}
                          </span>
                          <span aria-hidden="true">•</span>
                          <span>{formatBudget(r)}</span>
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-3">
              <div className="bg-cloud rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-steel">Budžet</span>
                  <strong className="text-gray-900">{budget}</strong>
                </div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-steel">Grad</span>
                  <strong className="text-gray-900">{job.city}</strong>
                </div>
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-steel">Ponuda</span>
                  <strong className="text-gray-900">
                    {job.bids_count || 0} {plural(job.bids_count || 0, ['ponuda', 'ponude', 'ponuda'])}
                  </strong>
                </div>
                {active ? (
                  <Link
                    href={`/poslovi/?expandId=${job.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white font-bold px-4 py-3.5 rounded-xl hover:shadow-xl hover:shadow-brand-orange/25 transition-all active:scale-95 min-h-[52px]"
                  >
                    Pošalji ponudu
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <p className="text-sm text-steel text-center bg-white rounded-xl px-4 py-3">
                    Ovaj posao je zatvoren za nove ponude.
                  </p>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 space-y-3">
                <ShareButtons title={job.title} path={`/posao/${job.id}/`} />
                <CopyAdTextButton
                  title={job.title}
                  category={category?.name || job.category_slug}
                  city={job.city}
                  budget={budget}
                  jobId={job.id}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
