# Platform Architecture Plan — Zaposli.ba

## 1. Stack

| Layer | Izbor | Razlog |
|---|---|---|
| **Frontend** | Next.js (App Router, static export) | Već postoji; ostaje na GitHub Pages dok se ne kupi domen |
| **Hosting** | GitHub Pages (privremeno) → Vercel (kad se kupi domen) | Besplatno dok ne krene produkcija |
| **Baza** | Supabase (PostgreSQL) | Auth built-in, Row Level Security, real-time, storage za slike |
| **Upload** | Supabase Storage | 1GB besplatno, integrisan sa RLS, limit 2MB na clientu |
| **ORM** | Supabase JS (@supabase/supabase-js) | Direktno iz browsera, RLS na nivou baze |

## 2. Privremeni rad (GitHub Pages — statički export)

- `next.config.js` ostaje `output: 'export'` — ne diramo
- API rute (`app/api/*`) se NE koriste — Supabase SDK ide direktno iz browsera
- Auth: Supabase Auth (PKCE flow, radi i na statičkim sajtovima)
- Sve Supabase pozive radimo u `'use client'` komponentama
- GitHub Actions deploy ostaje isti

## 3. Baza — Tabele

```
firms
  id          uuid PK
  name        text
  slug        text UNIQUE
  email       text
  phone       text
  city        text
  categories  uuid[] → categories.id
  verified    boolean
  logo        text (storage URL)
  description text
  created_at  timestamptz

users (auth — Supabase Auth)
  id            uuid PK (← auth.users)
  email         text
  full_name     text
  avatar_url    text
  role          'client' | 'firm'

jobs
  id            uuid PK
  client_id     uuid → users.id
  category_id   uuid → categories.id
  title         text
  description   text
  city          text
  status        'open' | 'bidding' | 'in_progress' | 'completed' | 'cancelled'
  created_at    timestamptz
  updated_at    timestamptz

bids
  id            uuid PK
  job_id        uuid → jobs.id
  firm_id       uuid → firms.id
  amount        decimal(10,2)
  message       text
  status        'pending' | 'accepted' | 'rejected'
  created_at    timestamptz

messages
  id            uuid PK
  job_id        uuid → jobs.id
  sender_id     uuid → users.id
  content       text
  created_at    timestamptz

reviews
  id            uuid PK
  job_id        uuid → jobs.id        (veza: samo završeni poslovi)
  client_id     uuid → users.id
  firm_id       uuid → firms.id
  rating        smallint CHECK(1-5)
  comment       text
  image_url     text                  (opcionalno, Storage URL)
  created_at    timestamptz
  UNIQUE(job_id)                      (jedna recenzija po poslu)
```

## 4. Auth Flow

- **Supabase Auth** — email+password, Google OAuth opcionalno
- Dva tipa korisnika: `client` (kupac) i `firm` (firma/majstor)
- Role se čuvaju u `users.role` + RLS politike

**Registracija:**
1. `/registracija/` — izbor: "Tražim majstora" (client) ili "Ja sam firma" (firm)
2. Client: email+password → automatski kreiran client profil
3. Firm: email+password → dodatni onboarding (naziv firme, kategorije, grad)

## 5. Stranice / Rute

### Postojeće (ostaju statičke):
- `/` — homepage
- `/kategorije/`, `/kategorije/[slug]/` — katalog
- `/usluge/[slug]/` — SEO stranice
- `/gradovi/`, `/gradovi/[slug]/`
- `/savjeti/*`, `/o-nama/`, `/faq/`, `/kontakt/`, `/privacy/`

### Nove (dinamičke, auth required):
- `/dashboard/firma/` — pregled poslova, ponude koje su poslane
- `/dashboard/firma/poslovi/[id]/` — detalji posla, chat, završi posao
- `/dashboard/firma/recenzije/` — pregled primljenih recenzija
- `/dashboard/firma/profil/` — uredi profil firme
- `/dashboard/klijent/` — moji poslovi
- `/dashboard/klijent/poslovi/[id]/` — detalji posla, chat, ponude
- `/dashboard/klijent/objavi/` — objavi novi posao
- `/dashboard/klijent/recenzije/[job_id]/` — ostavi recenziju (samo za completed poslove)

## 6. API rute

```
POST   /api/auth/register          — registracija (client/firm)
POST   /api/auth/login             — login
POST   /api/auth/logout            — logout

GET    /api/jobs                   — lista poslova (filtriranje)
POST   /api/jobs                   — objavi posao (client)
GET    /api/jobs/[id]              — detalji posla
PATCH  /api/jobs/[id]/status       — promijeni status (client: cancel, firm: complete)

POST   /api/jobs/[id]/bids         — pošalji ponudu (firm)
PATCH  /api/jobs/[id]/bids/[bidId] — prihvati/odbij (client)

GET    /api/jobs/[id]/messages     — chat poruke
POST   /api/jobs/[id]/messages     — pošalji poruku

POST   /api/jobs/[id]/review       — ostavi recenziju (client)
POST   /api/upload                 — upload slike (max 2MB, Storage)

GET    /api/firms/[id]             — profil firme
PATCH  /api/firms/[id]             — uredi profil firme
```

## 7. Recenzije — tok

1. Firma označi posao kao `completed`
2. Client dobija notifikaciju (i link) da ostavi recenziju
3. Client vidi formu: 1-5 zvjezdica (interaktivno), tekst, upload slike
4. Upload: validacija na clientu (type=image/*, max 2MB) → resize na 1200px širine na serveru → Storage
5. Recenzija se čuva u `reviews` tabeli
6. Prosječna ocjena firme se računa preko `AVG(rating)` na READ

## 8. Sigurnost

- **Row Level Security (Supabase):** svaka tabela ima politiku ko može čitati/pisati
- Primjer: `reviews` — INSERT samo client koji je vlasnik posla, UPDATE niko, DELETE admin
- Upload slika: Storage bucket `review-images` s RLS: INSERT authenticated, SELECT public
- Sve API rute provjeravaju sesiju (Supabase `getSession`)

## 9. Deployment

**Trenutno:** GitHub Pages (static export)
**Novo:** Vercel (besplatni plan, automatski deploy sa GitHub repoa)

Koraci:
1. Povezati repo sa Vercel
2. Ukloniti `output: 'export'` i `basePath` iz `next.config.js`
3. Postaviti env varijable (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Obrisati `.github/workflows/deploy.yml`
5. Vercel automatski gradi i deploya na push

## 10. Faze implementacije

**Faza 1 — Setup**
- Vercel + Supabase projekat
- Auth: registracija/login
- Role: client / firm

**Faza 2 — Dashboard firme**
- Pregled poslova
- Slanje ponuda
- Chat sa klijentom
- Oznaka "završi posao"

**Faza 3 — Dashboard klijenta**
- Objavi posao
- Pregled ponuda
- Prihvati/odbij ponudu
- Chat sa firmom

**Faza 4 — Recenzije**
- Upload slike (2MB limit)
- 1-5 zvjezdica
- Prikaz prosječne ocjene na profilu firme
