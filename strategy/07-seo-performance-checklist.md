# TOČKA 7 — SEO + PERFORMANCE CHECKLIST

> Status: ✅ implementirano · ⏳ faza 2 · svaka stavka provjerena prije deploya.

## Tehnički SEO

| Stavka | Status |
|---|---|
| Semantički HTML5 (header/main/footer/nav/h1) | ✅ |
| Jedan H1 po stranici | ✅ |
| XML sitemap (`/sitemap.xml` — 190+ URL-ova) | ✅ |
| robots.txt → sitemap | ✅ |
| Canonical tag na svakoj stranici | ✅ |
| Čisti URL-ovi (`/usluge/vodoinstalater-sarajevo/`) | ✅ |
| trailingSlash konzistentno | ✅ |
| lang="bs" | ✅ |
| 404 stranica | ✅ (Next default) |
| hreflang | ⏳ kada dodamo hr/sr verzije |

## Schema.org (JSON-LD)

| Tip | Gdje | Status |
|---|---|---|
| Organization | Početna | ✅ |
| WebSite | Početna | ✅ |
| BreadcrumbList | Sve podstranice | ✅ |
| Service | Kategorije + 156 usluge stranica | ✅ |
| LocalBusiness + AggregateRating | Profili firmi | ✅ (zvjezdice u Google rezultatima) |
| FAQPage | FAQ + usluge stranice | ✅ |
| Review | Profili firmi | ⏳ faza 2 (dinamičke recenzije) |

## On-page SEO

| Stavka | Status |
|---|---|
| Meta title ≤60 znakova, unikatan po stranici | ✅ |
| Meta description ≤155 znakova, unikatna | ✅ |
| OG + Twitter Card tagovi | ✅ |
| og-image 1200×630 brendirana | ✅ |
| Programmatic stranice: unikatni H1 + intro + cijene + FAQ | ✅ (156 stranica) |
| Blog po search intentu (cijene, provjera majstora) | ✅ (3 članka, proširivo) |
| Interno linkanje (kategorija ↔ grad ↔ firma ↔ projekti) | ✅ |
| Alt tekstovi | ✅ (hero, og) |

## Performance

| Stavka | Status |
|---|---|
| Statički HTML (SSG) — nula server response vremena | ✅ |
| First Load JS ~115 kB (cilj <150 kB) | ✅ |
| Font: 1 porodica (Plus Jakarta Sans), display=swap | ✅ |
| Slike: og-cover optimizirana (347 KB PNG) | ✅ |
| CLS: fiksne dimenzije slika, skeleton patterni | ✅ |
| Animacije: samo transform/opacity, 60fps | ✅ |
| prefers-reduced-motion | ✅ |
| Subset fonta (latin-ext) | ⏳ faza 2 |
| Preload kritičnog fonta | ⏳ faza 2 |
| AVIF/WebP za sadržajne fotografije | ⏳ kada dođu prave fotografije |

## Dostupnost (WCAG 2.2 AA)

| Stavka | Status |
|---|---|
| Fokus stanja (outline orange) | ✅ |
| Kontrasti: ink na white 16:1, orange CTA white text 3.5:1+ | ✅ |
| Keyboard navigacija (nav, forme, details/summary FAQ) | ✅ |
| aria-current na breadcrumbs | ✅ |
| Form labeli vezani uz inpute | ✅ |

## Core Web Vitals — ciljevi

| Metrika | Cilj | Napomena |
|---|---|---|
| LCP | <2.5s | statički HTML + GitHub CDN ✓ |
| INP | <200ms | minimalan client JS ✓ |
| CLS | <0.1 | fiksne dimenzije ✓ |
| Lighthouse | 95+ | provjeriti nakon deploya |

## Prije svakog deploya

1. `npm run build` prolazi bez greške
2. Screenshot provjera 3 ključne stranice
3. Sitemap sadrži nove stranice
4. Canonical → ispravna domena
5. Dijakritici (đšžćč) ispravni u build outputu
