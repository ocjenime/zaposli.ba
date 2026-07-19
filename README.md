# Zaposli.ba

Platforma koja spaja kupce sa građevinskim firmama i zanatlijama u Bosni i Hercegovini.

## Opis

**Zaposli.ba** je online marketplace inspirisan Werkspot.nl modelom, dizajniran specifično za tržište Bosne i Hercegovine. Platforma omogućava kupcima (vlasnicima nekretnina, investitorima) da objave građevinske projekte i prime ponude od provjerenih firmi i zanatlija.

## Karakteristike

### Za Kupce
- Besplatno objavljivanje projekata
- Primanje ponuda od više firmi
- Upoređivanje cijena i uslova
- Ocjene i recenzije firmi
- Direktna komunikacija sa majstorima

### Za Firme/Zanatlije
- Besplatna registracija profila
- Pristup hiljadama projekata
- Slanje ponuda za nove projekte
- Izgradnja reputacije kroz recenzije
- Portfolio radova

## Tech Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Baza podataka**: PostgreSQL (Supabase)
- **Autentifikacija**: NextAuth.js
- **Plaćanja**: Stripe Connect
- **Hosting**: Vercel

## Instalacija

```bash
# Klonirajte repozitorij
git clone https://github.com/username/zaposli-ba.git

# Idite u direktorij projekta
cd zaposli-ba

# Instalirajte zavisnosti
npm install

# Pokrenite razvojni server
npm run dev
```

## Struktura projekta

```
zaposli-ba/
├── app/
│   ├── layout.tsx          # Glavni layout
│   ├── page.tsx            # Početna stranica
│   ├── globals.css         # Globalni stilovi
│   ├── kategorije/         # Stranica kategorija
│   ├── kako-radi/          # Kako funkcioniše
│   ├── objavi-projekat/    # Forma za objavu projekta
│   ├── za-firme/           # Stranica za firme
│   ├── prijava/            # Prijava
│   └── registracija/       # Registracija
├── components/
│   ├── Header.tsx          # Navigacija
│   ├── Footer.tsx          # Podnožje
│   ├── HeroSection.tsx     # Hero sekcija
│   ├── HowItWorks.tsx      # Kako funkcioniše
│   ├── PopularCategories.tsx # Popularne kategorije
│   ├── StatsSection.tsx    # Statistike
│   ├── RecentProjects.tsx  # Nedavni projekti
│   ├── Testimonials.tsx    # Testimoniali
│   └── CTASection.tsx      # Call to action
├── public/                 # Statički fajlovi
├── SPECIFICATION.md        # Detaljna specifikacija
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## Kategorije usluga

- Građevinarstvo
- Vodoinstalacije
- Elektroinstalacije
- Slikanje
- Krovopokrivanje
- Tilerski radovi
- Vrtlarstvo
- Adaptacije
- Grijanje i hlađenje
- Izolacija
- Stolarija

## Monetizacija

1. **Lead Generation**: Firmu plaća po kontaktu sa kupcem (5-25 KM)
2. **Premium članstvo**: 49-99 KM/mjesečno za dodatne funkcije
3. **Oglašavanje**: Banneri i istaknuti listingi

## Planovi za budućnost

- [ ] Mobilne aplikacije (React Native)
- [ ] AI matching sistema
- [ ] Video pozivi
- [ ] Digitalni ugovori
- [ ] Escrow plaćanja
- [ ] Ekspanzija na region

## Kontakt

- Email: info@zaposli.ba
- Web: https://zaposli.ba

## Licenca

© 2026 Zaposli.ba. Sva prava zadržana.