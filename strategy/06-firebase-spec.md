# TOČKA 6 — TEHNIČKA SPECIFIKACIJA: Firebase + statički frontend

> Arhitektura: **Next.js static export (GitHub Pages) + Firebase** (Auth, Firestore, Storage).
> SEO-kritičan sadržaj se generira statički pri buildu; dinamika se hidrira client-side.

---

## 6.1 Zašto Firebase (obrazloženje)

| Kriterij | Firebase | Supabase | Formspree MVP |
|---|---|---|---|
| Cijena (start) | Besplatni Spark tier (dovoljan za launch) | Besplatni tier | Besplatno do 50/mj |
| Auth (email + Google) | Ugrađen | Ugrađen | Nema |
| Baza + realtime | Firestore, realtime po defaultu | Postgres, realtime dodatno | Nema |
| Storage (fotografije) | Ugrađen | Ugrađen | Nema |
| Integracija uz statički frontend | SDK u browseru, bez servera | Isto | Samo forme |
| Kriva učenja | Niska | Srednja (SQL) | Nema |

Firebase pobjeđuje jer marketplace treba realtime (nove ponude), auth za obje uloge i storage za fotografije projekata — sve bez servera kojeg bi trebalo održavati.

---

## 6.2 Data model (Firestore kolekcije)

### `firme/{firmaId}`
```ts
{
  ime: string;                 // "Edin Kovačević"
  tip: 'majstor' | 'firma';
  kategorije: string[];        // ['vodoinstalacije']
  grad: string;                // "Sarajevo"
  opis: string;
  usluge: string[];
  telefon: string;             // vidljiv tek nakon odobrenja kontakta
  email: string;
  verifikovana: boolean;
  paket: 'basic' | 'premium' | 'pro';
  ocjena: number;              // denormalizirano, računa se iz recenzija
  brojRecenzija: number;       // denormalizirano
  brojProjekata: number;
  kreirana: Timestamp;
}
```

### `projekti/{projekatId}`
```ts
{
  naslov: string;
  kategorija: string;          // slug
  opis: string;
  grad: string;
  budzetMin: number | null;
  budzetMax: number | null;
  rok: Timestamp | null;
  hitno: boolean;
  fotografije: string[];       // Storage URL-ovi
  klijentId: string;             // uid
  kontaktIme: string;
  kontaktTelefon: string;      // vidljiv samo firmi koju klijent odobere
  status: 'aktivan' | 'dodijeljen' | 'zavrsen' | 'zatvoren';
  brojPonuda: number;          // denormalizirano
  objavljen: Timestamp;
}
```

### `projekti/{projekatId}/ponude/{ponudaId}`
```ts
{
  firmaId: string;
  cijena: number;
  rokDani: number;
  poruka: string;
  status: 'poslana' | 'prihvacena' | 'odbijena';
  poslana: Timestamp;
}
```

### `recenzije/{recenzijaId}`
```ts
{
  firmaId: string;
  projekatId: string;
  klijentId: string;
  ocjena: 1 | 2 | 3 | 4 | 5;
  tekst: string;
  fotografije: string[];
  odgovorFirme: string | null;
  kreirana: Timestamp;
}
```

### `users/{uid}`
```ts
{
  uloga: 'klijent' | 'firma' | 'admin';
  ime: string;
  email: string;
  firmaId: string | null;      // ako je uloga = 'firma'
  kreiran: Timestamp;
}
```

**Denormalizacija (svjesna odluka):** `ocjena`, `brojRecenzija`, `brojPonuda` drže se denormalizirane i ažuriraju Cloud Function triggerima — čitanje kartica ne zahtijeva agregacije, što je ključno za brzinu i cijenu.

---

## 6.3 Security rules (kratak nacrt)

```
firme:     read = svi javni podaci; write = vlasnik (firmaId) ili admin
projekti:  read = svi (bez kontakt polja); create = auth klijent; update = vlasnik projekta
ponude:    read = vlasnik projekta + autor ponude; create = auth firma (limit po paketu)
recenzije: read = svi; create = klijent vezan uz završen projekat; update odgovora = firma
kontakt:   vidljiv samo firmi čija je ponuda prihvaćena (custom claims + rules)
```

---

## 6.4 Integracija sa statičkim buildom

1. **Build-time (SSG):** kategorije, gradovi, javni profili firmi i javni projekti povuku se iz Firestorea u `generateStaticParams`/`generateStaticProps` fazi → SEO sadržaj ostaje statički HTML. Redeploy (GitHub Action) radi se po rasporedu (npr. dnevno) + webhookom pri važnim promjenama.
2. **Runtime (client):** Firebase JS SDK (modularni) učitava se lijeno (`next/dynamic`, ssr:false) samo na stranicama koje trebaju dinamiku: objava projekta, prijava, ponude, recenzije.
3. **Env varijable:** `NEXT_PUBLIC_FIREBASE_*` u GitHub Secrets → build workflow.
4. **Pravila bez osjetljivih ključeva u repou** — Firebase web config je javna po dizajnu; sigurnost je u Security rules.

---

## 6.5 Notifikacije (faza 2)

- Cloud Functions: nova ponuda → email klijentu (SendGrid/Resend); novi projekat u kategoriji+gradu → email/push firmi.
- Firestore trigger `onCreate(ponude)` i `onCreate(projekti)`.

---

## 6.6 Migracioni put (bez prekida)

1. Kreirati Firebase projekat + kolekcije + rules.
2. Seed: postojeći `lib/data.ts` sadržaj importovati u Firestore (skripta).
3. Auth na prijavi/registraciji (email + Google).
4. Objava projekta → Firestore write + success state (već postoji UI).
5. Ponude + recenzije → realtime.
6. Premium naplata (faza 2): Stripe/Paddle + custom claims.
