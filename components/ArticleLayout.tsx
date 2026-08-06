import Link from 'next/link';
import type { Metadata } from 'next';
import type { LucideIcon } from 'lucide-react';
import { Calendar, Clock, ArrowRight, Hash, HelpCircle, Wallet, FileCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { site } from '@/lib/site';
import { JsonLd, articleSchema, breadcrumbSchema } from '@/lib/jsonld';

export interface RelatedArticle {
  slug: string;
  title: string;
  category: string;
}

export interface ArticleLayoutProps {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  datePublished: string;
  dateModified?: string;
  icon: LucideIcon;
  toc: { id: string; label: string }[];
  faqs?: { q: string; a: string }[];
  relatedArticles: RelatedArticle[];
  ctaText?: string;
  children: React.ReactNode;
}

export function generateArticleMetadata({
  title,
  excerpt,
  slug,
}: {
  title: string;
  excerpt: string;
  slug: string;
}): Metadata {
  return {
    title: `${title} | Zaposli.ba`,
    description: excerpt,
    alternates: { canonical: `${site.url}/savjeti/${slug}/` },
    openGraph: {
      title,
      description: excerpt,
      url: `${site.url}/savjeti/${slug}/`,
      siteName: site.name,
      locale: 'bs_BA',
      type: 'article',
    },
  };
}

export default function ArticleLayout({
  slug,
  title,
  subtitle,
  excerpt,
  category,
  date,
  readTime,
  datePublished,
  dateModified,
  icon: Icon,
  toc,
  faqs,
  relatedArticles,
  ctaText = 'Objavi posao besplatno',
  children,
}: ArticleLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Breadcrumbs items={[{ name: 'Savjeti', href: '/savjeti/' }, { name: title }]} />
        <JsonLd
          data={articleSchema({
            title,
            description: excerpt,
            slug,
            datePublished,
            dateModified,
          })}
        />
        <JsonLd
          data={breadcrumbSchema([
            { name: 'Početna', url: '/' },
            { name: 'Savjeti', url: '/savjeti/' },
            { name: title },
          ])}
        />
        <PageHero title={title} subtitle={subtitle} />

        <article className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            {/* Article meta */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-steel mb-6 pb-6 border-b border-gray-100">
              <span className="inline-flex items-center gap-1.5 bg-primary-50 px-3 py-1 rounded-full text-brand-orange font-semibold">
                <Icon className="w-3.5 h-3.5" />
                {category}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Objavljeno: {date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {readTime}
              </span>
            </div>

            {/* Table of contents */}
            <div className="bg-cloud rounded-2xl border border-gray-100 p-6 mb-10">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Hash className="w-4 h-4 text-brand-orange" />
                Sadržaj
              </h3>
              <ul className="space-y-2">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-sm text-steel hover:text-brand-orange hover:underline transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {children}

            {/* FAQ */}
            {faqs && faqs.length > 0 && (
              <>
                <h2 id="faq" className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                  Često pitanja
                </h2>
                <div className="space-y-3 mb-10">
                  {faqs.map((faq, i) => (
                    <details
                      key={i}
                      className="group bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden"
                    >
                      <summary className="flex items-center gap-3 cursor-pointer list-none px-5 py-4 hover:bg-cloud/60 transition-colors">
                        <HelpCircle className="w-5 h-5 text-brand-orange shrink-0" />
                        <span className="font-semibold text-gray-900">{faq.q}</span>
                      </summary>
                      <div className="px-5 pb-5 pl-12 text-steel leading-relaxed text-sm">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              </>
            )}

            {/* CTA */}
            <div className="bg-gradient-hero rounded-2xl p-8 text-center relative overflow-hidden mb-12">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-orange/10 rounded-full blur-3xl" />
              <div className="relative">
                <div className="w-14 h-14 bg-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Wallet className="w-7 h-7 text-brand-orange" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Trebate majstora?</h2>
                <p className="text-white/60 mb-6">
                  Objavite posao besplatno i primite ponude od provjerenih firmi - obično u roku od 24 sata.
                </p>
                <Link href="/objavi-projekat/" className="btn-primary">
                  {ctaText}
                </Link>
              </div>
            </div>

            {/* Related articles */}
            <div className="border-t border-gray-100 pt-10">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-brand-orange" />
                Povezani savjeti
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/savjeti/${article.slug}/`}
                    className="group flex items-center gap-3 bg-cloud rounded-xl border border-gray-100 p-4 hover:border-brand-orange/30 hover:shadow-card transition-all"
                  >
                    <span className="text-xs font-semibold bg-primary-50 text-brand-orange px-2.5 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="flex-1 text-sm font-medium text-gray-900 group-hover:text-brand-orange transition-colors">
                      {article.title}
                    </span>
                    <ArrowRight className="w-4 h-4 text-steel group-hover:text-brand-orange group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
