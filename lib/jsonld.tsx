import { site } from '@/lib/site';

export function JsonLd({ data }: { data: Record<string, unknown> }) {
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

export function serviceSchema(service: {
  name: string;
  description: string;
  area: string;
  url: string;
  providerCount: number;
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
