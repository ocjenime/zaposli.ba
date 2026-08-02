import { site } from '@/lib/site';

type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    logo: `${site.url}/icon.svg`,
    description: site.description,
    email: site.email,
    telephone: site.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Sarajevo',
      addressCountry: 'BA',
    },
    sameAs: [],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    inLanguage: 'bs',
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.url}`,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function localBusinessSchema(worker: {
  name: string;
  specialty: string;
  location: string;
  rating: number;
  reviews: number;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: worker.name,
    description: `${worker.specialty}: ${worker.location}`,
    url: `${site.url}${worker.url}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: worker.location,
      addressCountry: 'BA',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: worker.rating,
      reviewCount: worker.reviews,
      bestRating: 5,
    },
  };
}

export function articleSchema({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  author = site.name,
  image = `${site.url}/images/og-cover.webp`,
}: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: {
      '@type': 'Organization',
      name: author,
      url: site.url,
    },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      logo: {
        '@type': 'ImageObject',
        url: `${site.url}/images/logo-mark.png`,
      },
    },
    datePublished,
    dateModified: dateModified || datePublished,
    image,
    url: `${site.url}/savjeti/${slug}/`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${site.url}/savjeti/${slug}/`,
    },
  };
}

export function howToSchema({
  title,
  description,
  steps,
  totalTime,
  image = `${site.url}/images/og-cover.webp`,
}: {
  title: string;
  description: string;
  steps: { name: string; text: string }[];
  totalTime?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description,
    image,
    totalTime,
    step: steps.map((step) => ({
      '@type': 'HowToStep',
      name: step.name,
      text: step.text,
    })),
  };
}

export function serviceSchema(service: {
  name: string;
  description: string;
  area: string;
  url: string;
  providerCount?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.name,
    description: service.description,
    url: `${site.url}${service.url}`,
    areaServed: {
      '@type': 'City',
      name: service.area,
    },
    provider: {
      '@type': 'Organization',
      name: site.name,
      url: site.url,
    },
  };
}
