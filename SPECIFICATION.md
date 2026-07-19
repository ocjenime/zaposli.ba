# Zaposli.ba - Detaljna Specifikacija Projekta

## 1. OSNOVNI OPIS PROJEKTA

### 1.1 Naziv
**Zaposli.ba**

### 1.2 Opis
Platforma koja spaja kupce (vlasnike nekretnina, investitore) sa građevinskim firmama i zanatlijama u Bosni i Hercegovini. Model zasnovan na Werkspot.nl/Thumbtack pristupu.

### 1.3 Ciljno tržište
- **Geografija**: Bosna i Hercegovina (Sarajevo, Banja Luka, Tuzla, Mostar, Zenica, itd.)
- **Kupci**: Vlasnici kuća/stanova, investitori, firme koje traže izvođače
- **Pružaoci usluga**: Građevinske firme, zanatlije, majstori svih profila

### 1.4 Web adresa
- **Domen**: zaposli.ba
- **URL**: https://zaposli.ba

### 1.4 Konkurentska prednost
- Lokalni fokus na BiH tržište
- Specifično građevinski sektori (ne opšti marketplace)
- Bolje razumijevanje lokalnih praksi i cijena
- Verificirani profili firmi
- Sistem recenzija i ocjena

### 1.5 Domen
**zaposli.ba** - kratko, pamtljivo, direktno povezano sa uslugom zapošljavanja/angаžovanja majstora

---

## 2. BUSINESS MODEL

### 2.1 Monetizacija

#### A) Lead Generation Model (primarni)
- Firmu plaća po kontaktu sa kupcem
- Cijena po lead-u: 5-25 KM (ovisno o veličini projekta)
- Kupac: BESPLATNO

#### B) Premium Članstvo
- **Basic**: Besplatno - osnovni profil, ograničen broj odgovora
- **Premium**: 49 KM/mjesečno - neograničeni odgovori, istaknuti profil, prioriteta
- **Pro**: 99 KM/mjesečno - sve iz Premium + analytics, promocija

#### C) Oglašavanje
- Banneri na platformi
- Istaknute kategorije
- Sponzorisirani listingi

### 2.2 Prihodni model (projekcija)
| Godina | Korisnici | Firmi | Mjesečni prihod |
|--------|-----------|-------|-----------------|
| 1 | 5,000 | 200 | 5,000 KM |
| 2 | 20,000 | 800 | 25,000 KM |
| 3 | 50,000 | 2,000 | 75,000 KM |

---

## 3. FUNKCIONALNOSTI

### 3.1 Za Kupce (Korisnike)

#### A) Registracija/Prijava
- Email registracija
- Google/Facebook OAuth
- Telefon verifikacija

#### B) Objavljivanje Projekta
- Naslov projekta
- Kategorija (građevinarstvo, elektro, vodoinstalacije, itd.)
- Opis posla
- Lokacija (grad, opština)
- Budžet (opcionalno)
- Rok izvršenja
- Fotografije (upload)
- Kontakt informacije

#### C) Pregled Ponuda
- Lista pristiglih ponuda
- Upoređivanje ponuda
- Profili firmi sa ocjenama
- Slanje poruka firmama

#### D) Odabir Izvođača
- Prihvatanje ponude
- Kontaktiranje firme
- Dogovaranje detalja

#### E) Recenzije
- Ocena završenog posla (1-5 zvjezdica)
- Tekstualni komentar
- Fotografije završenog posla

### 3.2 Za Firme/Zanatlije

#### A) Registracija Profila
- Naziv firme
- Kategorije usluga
- Lokacija (gradovi koje pokrivaju)
- Godine iskustva
- Broj zaposlenih
- Portfolio (fotografije radova)
- Kontakt informacije
- Radno vrijeme

#### B) Odgovaranje na Projekte
- Pregled dostupnih projekata
- Slanje ponude (cijena, rok, opis)
- Upload fotografija prethodnih radova

#### C) Upravljanje Profilom
- Ažuriranje informacija
- Dodavanje novih kategorija
- Upravljanje rasporedom

#### D) Dashboard
- Statistika (broj pregleda, ponuda, ugovora)
- Aktivni projekti
- Poruke
- Plaćanja

### 3.3 Za Admina

#### A) Upravljanje Korisnicima
- Pregled svih korisnika
- Verifikacija firmi
- Ban/ukloni korisnike

#### B) Upravljanje Sadržajem
- Moderacija recenzija
- Upravljanje kategorijama
- Blog/vijesti

#### C) Analitika
- Dashboard sa metrikama
- Izvještaji o prometu
- Financijski izvještaji

---

## 4. KATEGORIJE USLUGA

### 4.1 Građevinarstvo
- **Temelji i konstrukcije**
- **Zidarski radovi**
- **Krovopokrivanje**
- **Fasaderski radovi**
- **Betoniranje**
- **Armirački radovi**

### 4.2 Instalacije
- **Vodoinstalacije**
- **Elektroinstalacije**
- **Grijanje i hlađenje**
- **Plinske instalacije**
- **Kanalizacija**

### 4.3 Unutrašnji radovi
- **Gipsarski radovi**
- **Tilerski radovi**
- **Laminat i parket**
- **Slikanje**
- **Tapetanje**
- **Postavljanje gipsanih ploča**

### 4.4 Vanjski radovi
- **Hortikultura i vrtlarstvo**
- **Kamenoreski radovi**
- **Asfaltiranje**
- **Ograde i kapije**
- **Bazeni**

### 4.5 Specijalizirani radovi
- **Demoliranje**
- **Izolacija**
- **Klimatizacija**
- **Solarni paneli**
- **Energetska efikasnost**

---

## 5. TECHNICAL ARCHITECTURE

### 5.1 Tech Stack

| Komponenta | Tehnologija |
|------------|-------------|
| **Frontend** | Next.js 15 + TypeScript + Tailwind CSS |
| **Backend** | Next.js API Routes + Prisma ORM |
| **Baza podataka** | PostgreSQL (Supabase ili Neon) |
| **Autentifikacija** | NextAuth.js |
| **Plaćanja** | Stripe Connect (ili mPay za BiH) |
| **Storage** | Cloudinary (slike) |
| **Email** | Resend ili SendGrid |
| **Hosting** | Vercel (frontend) + Supabase (baza) |
| **Analytics** | Vercel Analytics + Google Analytics |

### 5.2 Database Schema

```sql
-- Korisnici
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(50),
  role ENUM('customer', 'professional', 'admin'),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Firme/Zanatlije
CREATE TABLE professionals (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  company_name VARCHAR(255) NOT NULL,
  description TEXT,
  logo_url VARCHAR(500),
  cover_url VARCHAR(500),
  founded_year INTEGER,
  employee_count VARCHAR(50),
  website VARCHAR(255),
  verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Kategorije
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE,
  icon VARCHAR(50),
  parent_id INTEGER REFERENCES categories(id)
);

-- Projekti (Kupci objavljuju)
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  category_id INTEGER REFERENCES categories(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location_city VARCHAR(100),
  location_address TEXT,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  deadline DATE,
  status ENUM('open', 'in_progress', 'completed', 'cancelled'),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Fotografije projekata
CREATE TABLE project_images (
  id SERIAL PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Ponude firmi
CREATE TABLE bids (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  professional_id UUID REFERENCES professionals(id),
  price DECIMAL(10,2),
  description TEXT,
  estimated_days INTEGER,
  status ENUM('pending', 'accepted', 'rejected'),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Recenzije
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  professional_id UUID REFERENCES professionals(id),
  user_id UUID REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Poruke
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  content TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Lokacije (gradovi BiH)
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  region VARCHAR(100),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8)
);
```

### 5.3 API Endpoints

```
/api/auth/*          - Autentifikacija
/api/projects/*      - Upravljanje projektima
/api/professionals/* - Upravljanje firmama
/api/bids/*          - Upravljanje ponudama
/api/reviews/*       - Upravljanje recenzijama
/api/messages/*      - Poruke
/api/categories/*    - Kategorije
/api/upload/*        - Upload fajlova
```

---

## 6. UI/UX DESIGN

### 6.1 Design System

#### Boje
- **Primarna**: #2563EB (plava - pouzdanost)
- **Sekundarna**: #10B981 (zelena - uspjeh)
- **Akcent**: #F59E0B (žuta - istaknutost)
- **Pozadina**: #F9FAFB (svijetla siva)
- **Tekst**: #1F2937 (tamna)

#### Tipografija
- **Naslovi**: Inter, Bold
- **Tijelo**: Inter, Regular
- **Kod**: JetBrains Mono

#### Komponente
- Kartice sa sjenkom
- Zaobljeni uglovi (8px)
- Hover efekti
- Responsive dizajn

### 6.2 Stranice

#### Landing Page
- Hero sekcija sa CTA
- Kako funkcioniše (3 koraka)
- Popularne kategorije
- Statistike (broj firmi, projekata, recenzija)
- Testimoniali
- Footer sa linkovima

#### Kategorije
- Grid prikaz kategorija
- Filteri (grad, cijena, ocjena)
- Lista firmi

#### Profil Firme
- Cover fotografija
- Logo i naziv
- Ocjena i broj recenzija
- Opis firme
- Portfolio (galerija slika)
- Lokacija na mapi
- Kontakt informacije
- Lista recenzija

#### Objavljivanje Projekta
- Multi-step form
- Validacija
- Upload slika
- Pregled prije objave

#### Dashboard (Kupac)
- Aktivni projekti
- Primljene ponude
- Poruke
- Omiljene firme

#### Dashboard (Firma)
- Dostupni projekti
- Poslane ponude
- Aktivni ugovori
- Statistika
- Poruke

---

## 7. SEKCIJE I KOMPONENTE

### 7.1 Header
- Logo
- Navigacija (Početna, Kategorije, Kako radi, Za firme)
- Pretraga
- Prijava/Registracija
- Mobilni meni

### 7.2 Footer
- O nama
- Kontakt
- Uslovi korištenja
- Privacy policy
- Društvene mreže
- Newsletter

### 7.3 Zajedničke komponente
- Button (primarni, sekundarni, outline)
- Input, Textarea, Select
- Card (projekt, firma, recenzija)
- Modal
- Toast notifikacije
- Loading spinner
- Pagination
- Star rating

---

## 8. LOKACIJE (GRADOVI BIH)

### 8.1 Federacija BiH
- Sarajevo (Centar, Novi Grad, Ilidža, Vogošća, Ilijaš, Trnovo)
- Mostar
- Tuzla
- Zenica
- Bihać
- Bugojno
- Travnik
- Livno
- Konjic
- Jablanica

### 8.2 Republika Srpska
- Banja Luka
- Bijeljina
- Doboj
- Zvornik
- Prijedor
- Trebinje
- Mrkonjić Grad
- Kičinovo (Istočno Sarajevo)

### 8.3 Brčko Distrikt
- Brčko

---

## 9. ROADMAP

### Faza 1: MVP (1-2 mjeseca)
- [x] Landing page
- [ ] Registracija/Prijava
- [ ] Osnovno objavljivanje projekata
- [ ] Profili firmi
- [ ] Slanje ponuda
- [ ] Osnovne recenzije

### Faza 2: Core Features (2-3 mjeseca)
- [ ] Chat sistem
- [ ] Napredne recenzije sa slikama
- [ ] Dashboard za kupce
- [ ] Dashboard za firme
- [ ] Email notifikacije
- [ ] Mobilna optimizacija

### Faza 3: Premium (3-4 mjeseca)
- [ ] Premium članstvo
- [ ] Napredna analitika
- [ ] Blog/sekcija savjeta
- [ ] Integracija sa kartama
- [ ] Mobilne aplikacije (React Native)

### Faza 4: Scale (6+ mjeseci)
- [ ] AI matching sistema
- [ ] Video pozivi
- [ ] Digitalni ugovori
- [ ] Escrow plaćanja
- [ ] Ekspanzija na region

---

## 10. TROŠKOVI RAZVOJA

### 10.1 MVP (Minimalni)
- Hosting: 0-50 KM/mjesečno (Vercel free tier)
- Baza: 0-30 KM/mjesečno (Supabase free tier)
- Domen: ~30 KM/godišnje
- Ukupno: **~100 KM/mjesečno**

### 10.2 Produkcija
- Hosting: 100-300 KM/mjesečno
- Baza: 50-100 KM/mjesečno
- Storage: 50-100 KM/mjesečno
- Email: 50-100 KM/mjesečno
- Ukupno: **~500 KM/mjesečno**

### 10.3 Razvoj (angаžovanje developera)
- MVP: 5,000-15,000 KM
- Full platform: 20,000-50,000 KM
- Mobilne aplikacije: 15,000-30,000 KM

---

## 11. MARKETING STRATEGIJA

### 11.1 Branding
- **Naziv**: Zaposli.ba
- **Slogan**: "Pronađite majstora za vaš projekat"
- **Boje**: Plava (pouzdanost), Zelena (uspjeh)
- **Tone**: Profesionalan, pristupačan, pouzdan

### 11.2 Organic
- SEO optimizacija (lokalne ključne riječi: "majstor Sarajevo", "građevinska firma Banja Luka")
- Blog sa savjetima za građevinarstvo
- Društvene mreže (Facebook, Instagram)
- Google My Business za svaki grad

### 11.3 Paid
- Google Ads (lokalne kampanje)
- Facebook/Instagram Ads
- Sponzorisani sadržaj na portalima

### 11.4 Partnerships
- Saradnja sa građevinskim firmama
- Partnerstvo sa dobavljačima materijala
- Saradnja sa nekretninskim agencijama

---

## 12. ZAKLJUČAK

**Zaposli.ba** ima veliki potencijal na bosanskom tržištu jer:
1. Ne postoji dominantna lokalna platforma za građevinske usluge
2. Velika potražnja za kvalificiranim radnicima
3. Rastuće tržište nekretnina u BiH
4. Mogućnost širenja na region (Srbija, Hrvatska, Crna Gora)
5. Kratko i pamtljivo ime domene (zaposli.ba)

Sa ispravnom implementacijom i marketing strategijom, **Zaposli.ba** može postati vodeći marketplace za građevinske usluge u Bosni i Hercegovini.