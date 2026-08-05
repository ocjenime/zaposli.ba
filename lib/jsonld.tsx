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
    logo: `${site.url}/images/logo-mark.png`,
    description: site.description,
    email: site.email,
    telephone: site.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Sarajevo',
      addressCountry: 'BA',
    },
    sameAs: site.sameAs ?? [],
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

export function breadcrumbSchema(items: { name: string; url?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: `${site.url}${item.url}` } : {}),
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
  image?: string | null;
  telephone?: string | null;
  email?: string | null;
  priceRange?: string | null;
}) {
  const fullUrl = worker.url.startsWith('http')
    ? worker.url
    : `${site.url}${worker.url}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': fullUrl,
    name: worker.name,
    description: `${worker.specialty}: ${worker.location}`,
    url: fullUrl,
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
    ...(worker.image ? { image: worker.image } : {}),
    ...(worker.telephone ? { telephone: worker.telephone } : {}),
    ...(worker.email ? { email: worker.email } : {}),
    ...(worker.priceRange ? { priceRange: worker.priceRange } : {}),
  };
}

export interface JobPostingInput {
  title: string;
  description: string;
  city: string;
  created_at: string;
  deadline?: string | null;
  budget_mode?: string | null;
  budget_min?: number | null;
  budget_max?: number | null;
}

export function jobPostingSchema(job: JobPostingInput) {
  const posted = new Date(job.created_at);
  const validThrough = job.deadline
    ? new Date(job.deadline).toISOString()
    : new Date(posted.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const baseSalary = (() => {
    if (job.budget_mode === 'open') return undefined;
    if (!job.budget_min && !job.budget_max) return undefined;
    const amount: Record<string, unknown> = {
      '@type': 'MonetaryAmount',
      currency: 'BAM',
    };
    if (job.budget_min && job.budget_max) {
      amount.minValue = job.budget_min;
      amount.maxValue = job.budget_max;
    } else if (job.budget_min) {
      amount.value = job.budget_min;
    } else if (job.budget_max) {
      amount.value = job.budget_max;
    }
    return amount;
  })();

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: posted.toISOString(),
    validThrough,
    employmentType: 'https://schema.org/Contractor',
    hiringOrganization: {
      '@type': 'Organization',
      name: site.name,
      url: site.url,
      logo: `${site.url}/images/logo-mark.png`,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.city,
        addressCountry: 'BA',
      },
    },
    ...(baseSalary ? { baseSalary } : {}),
  };
}

export function jobListSchema(jobs: JobPostingInput[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: jobs.map((job, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: jobPostingSchema(job),
    })),
  };
}

export function localBusinessListSchema(workers: Parameters<typeof localBusinessSchema>[0][]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: workers.map((worker, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: localBusinessSchema(worker),
    })),
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
