# TOČKA 1 — STRATEŠKI OKVIR
**zaposli.ba** · marketplace za građevinske usluge u BiH · v1.0

> Status: odobreno od klijenta. Brend finalan. Backend: Firebase. Prioritet: demand strana (objavljeni projekti). Domena: github.io.

---

## 1.0 Brend okvir (iz brand booka — `strategy/brand-board.png`)

| Token | Vrijednost |
|---|---|
| Primarna | `#F97316` (orange) |
| Tamna | `#021117` (ink) |
| Siva | `#687280` (steel) |
| Svijetla | `#E5E7EB` (mist) / `#F0FAFC` (cloud) |
| Tipografija | Plus Jakarta Sans (Bold/SemiBold/Medium/Regular) |
| Mark | Pin + claw hammer (implementiran u `components/Logo.tsx`) |
| Tagline | **"Majstor na pravom mjestu. Kad ti treba."** |
| Trust vokabular | PROVJERENO · LOKALNO · PREPORUČENO · BRZA KOMUNIKACIJA · SIGURNO |
| Verifikacija | "PROVJERENI MAJSTOR" badge (kružni pečat iz brand primjena) |
| Vizualni jezik | Geometrijski, čist, fokusiran; fotografija = pravi majstori u radu |
| Atributi brenda | Čisto · Pouzdano · Moderno · Pristupačno · Lokalno |

**Brend odluke:**
- Hero copy kandidat iz boarda ("Brzo pronađi majstora kojem možeš vjerovati. Bez čekanja. Bez prevare.") ulazi kao B varijanta u A/B plan (Točka 9/CRO) — postojeća kopija ostaje do testa.
- Kategorije se proširuju (Klima, Stolarija, Čišćenje...) — detalj u Točki 2 (sitemap).
- Statistika na stranici (2,800+ firmi) ≠ statistika u boardu (10,000+ majstora) — koriste se **stvarni podaci**; board brojke su marketinški primjer, ne istina.

---

## 1.1 Pozicioniranje i value proposition

**Za klijenta:**
> Zaposli.ba je najbrži i najsigurniji način da nađete provjerenog majstora u BiH — besplatno objavite projekat i birajte između ponuda firmi čije su kvalitet i cijene potvrdili stvarni klijenti, ne sreća.

**Za firmu:**
> Zaposli.ba vam dovodi ozbiljne projekte s definisanim budžetom — bez ulaganja u marketing, bez hladnih poziva; plaćate samo kada rastete.

**Zašto ovako:** Klijent i firma su dvije različite publikacije s suprotnim strahovima — klijent se boji prevare, firma se boji bacanja novca. Jedna poruka ne može riješiti oba straha; zato dvije rečenice, dva funnel-a, dvije stranice. Glavni konkurent nije druga platforma nego **preporuka ("znam čovjeka")** — platforma pobjeđuje samo ako reproducira osjećaj sigurnosti preporuke, a dodaje izbor i transparentnost koje preporuka nema.

---

## 1.2 Konkurentske alternative (što klijent STVARNO radi danas)

| Alternativa | Što rade dobro | Gdje gube | Naša prilika |
|---|---|---|---|
| **Preporuka / "znam čovjeka"** | Povjerenje kroz poznanstvo | Nema izbora, nema referentne cijene, "zauzet do marta", nema garancije | Isti osjećaj sigurnosti + izbor + slobodan termin |
| **Facebook grupe** ("Majstori BiH") | Brzina, puno odgovora | Nula verifikacije, haos u komentarima, prevare, nema recenzija | Strukturirane ponude + verifikacija + istorija rada |
| **OLX.ba / pik.ba** | Velika publika | Anonimni oglasi, klijent zove jednog po jednog, nema ocjena | Jedna objava → više ponuda; klijent ne juri majstore |
| **Regionalne platforme** | Fokus na majstore | Mrtve baze, slab UX, naplaćuju unaprijed, slab brend | Besplatno za klijente + živa baza + moderan proizvod |
| **Google Maps direktno** | Recenzije postoje | Firme bez weba, zvanje jednog po jednog, nema usporedbe ponuda | Agregacija + standardizirana usporedba ponuda |

### Ključni strateški insight

Niko na tržištu ne odgovara na pitanje koje klijenta najviše muči: **"Koliko bi ovo trebalo koštati?"** Strah od prevare je u osnovi strah od nepoznavanja fer cijene. Naša platforma **već prikazuje budžete u KM na karticama projekata** — to nije samo podatak, to je diferencijacija. Podižemo je na nivo brenda: **"Kod nas znaš koliko košta prije nego iko pokuca na vrata."**

---

## 1.3 Persone

### P1 — Amela, 41, Sarajevo · vlasnica stana, renovira kupatilo
- **JTBD:** "Hoću kupatilo gotovo bez da me iko prevari ili da jurim majstore telefonom."
- **Ciljevi:** fer cijena, pouzdan majstor, poštovan rok.
- **Frustracije:** prevara ("uzeo avans i nestao"), ne zna koliko šta košta, majstori koji ne dolaze, ne razumije stručne termine.
- **Ponašanje:** mobitel, navečer; Google + FB grupe + prijatelji. Sumnjičava: "svi su isti".
- **Što je uvjerava:** recenzije s fotografijama radova, verifikacijski badge, vidljiv budžet, brz odgovor platforme.
- **Dizajn za nju:** sve na mobitelu radi savršeno; forma za objavu traje 2 minute i objašnjava šta se dešava dalje.

### P2 — Marko, 38, Banja Luka · investitor, 4–6 projekata godišnje
- **JTBD:** "Trebam izvođače na brzinu, svaki put, bez traženja ispočetka."
- **Ciljevi:** brza usporedba ponuda, rokovi, ozbiljne firme.
- **Frustracije:** neuporedive ponude (svaka u svom formatu), gubljenje vremena na obilaske, nestručnost.
- **Ponašanje:** desktop + mobitel, racionalan, tabelarno uspoređuje.
- **Što ga uvjerava:** standardizirana ponuda (cijena / rok / ocjena / garancija), istorija firmi, broj završenih projekata.

### P3 — Senad, 47, Tuzla · vlasnik firme (4 radnika), vodoinstalacije + keramika
- **JTBD:** "Hoću kontinuitet poslova bez reklama koje ne rade."
- **Ciljevi:** redovni projekti, reputacija, minimum administracije.
- **Frustracije:** sezonske rupe, nelikvidni klijenti, "internet stvarima ne vjeruje" — ali vidi da konkurencija raste online.
- **Ponašanje:** mobitel na gradilištu, ne čita duge tekstove, Viber/WhatsApp logika.
- **Što ga uvjerava:** besplatan start, odmah vidi projekte u svojoj kategoriji i gradu, jednostavna ponuda u 3 klika.

---

## 1.4 User journey — klijent (primarni, jer je demand prioritet)

| Faza | Što klijent osjeća/želi | Što mu platforma mora dati | Trenje (friction) | Kako ga dizajn uklanja | Metrika |
|---|---|---|---|---|---|
| **Problem** | "Cijuri cijev, treba mi neko HITNO" | — | — | — | — |
| **Dolazak** | "Je li ovo za mene?" | Odgovor u 5 sekundi (vidi 1.5) | Generičan hero, nejasna ponuda | Hero: šta je + besplatno + provjereno, odmah | Bounce |
| **Objava projekta** | "Hoće li me sad zvati 50 ljudi? Koliko ovo traje?" | Multistep forma 2 min, jasno šta s podacima | Preduga forma, strah od spama | Koraci s progress barom, kontakt tek na kraju, obećanje o privatnosti uz polje | Završene objave (cilj >35% započetih) |
| **Čekanje ponuda** | Praznina, nelagoda | Očekivanje + status | Tišina nakon objave | "Prve ponude obično u 24h" + email/status notifikacije | Vrijeme do prve ponude (<24h) |
| **Usporedba** | "Kako da uporedim?" | Standardizirane ponude | Svaka ponuda u svom formatu | Tabela: cijena / rok / ocjena / projekti / badge | Ponuda po projektu (≥3) |
| **Odabir** | Strah od greške | Dokaz kvaliteta | Nepoznata firma | Recenzije s fotografijama, badge, "šta ako nisam zadovoljan" | Stopa odabira firme |
| **Realizacija + recenzija** | "Želim reći drugima" / zaborav | Laka recenzija | Komplikovano | 1-klik ocjena + opcionalno foto, email podsjetnik | % projekata s recenzijom |
| **Retencija** | "Sljedeći put opet" | Zapamćen kontekst | — | Istorija projekata u nalogu, brza re-objava | Ponovljene objave |

**Journey firme (sekundarni):** Dolazak na "Za firme" → vidi stvarne projekte u svojoj kategoriji/gradu (dokaz vrijednosti PRIJE registracije) → besplatna registracija → kompletan profil (portfolio = prodavnica) → prva ponuda → prvi posao → recenzije rastu → premium kada vidi ROI. Ključno: **vrijednost mora biti vidljiva prije paywalla.**

---

## 1.5 Hijerarhija poruke — prvih 5 sekundi

1. **Šta je ovo:** "Pronađite majstora za vaš projekat" — kategorija proizvoda jasna odmah.
2. **Kako i zašto bez rizika:** "Besplatno objavite → primate ponude od provjerenih firmi."
3. **Zašto vjerovati:** "2,800+ verificiranih firmi · 4.8 prosječna ocjena · 25,000+ projekata."

Postojeći hero (nakon rebrendinga) ovo već komunicira — strategija ga potvrđuje; riječi brenda su **"provjereno"** i **"verificirano"** i one se ponavljaju kroz cijeli sustav.

---

## 1.6 Ključne strateške odluke (obrazložene)

1. **"Objavi projekat besplatno" je jedini primarni CTA stranice.** Demand je prioritet: firme dolaze tamo gdje ima posla, a svaki objavljeni projekat je istovremeno SEO sadržaj i razlog aktivnosti firmi. "Za firme" živi u navigaciji i na svojoj stranici — nikad kao vizuelni konkurent primarnom CTA-u na istom ekranu.
2. **Diferencijacija = transparentnost cijene + verifikacija.** Budžeti u KM ostaju vidljivi na svim karticama i postaju dio brend komunacije; verifikacijski badge je dizajn-sistemski element koji se pojavljuje svugdje gdje se firma pojavljuje.
3. **Povjerenje je sistem, ne stranica.** Trust signali (badge, ocjena, broj projekata, fotografije radova) ugrađeni u svaku komponentu — ne zakopani u "Kako radi".
4. **Firebase uz statički frontend.** Auth (email/Google) + Firestore (firme, projekti, ponude, recenzije) + Storage (fotografije radova i projekata). SEO-kritičan sadržaj (kategorije, gradovi, javni profili firmi) generira se **statički pri buildu** (build-time fetch u Next.js SSG), dinamika se hidrira client-side. Zadržavamo GitHub Pages hosting, <2s performanse i potpunu SEO vidljivost — bez servera.
5. **Jezik: dosljedan bosanski.** Bez engleskih pozajmica u UI osim industrijskih standarda; svako stanje, greška i prazan prikaz na bosanskom.

---

## 1.7 KPI i definicija uspjeha (6 mjeseci)

| KPI | Bazna linija | Cilj |
|---|---|---|
| Stopa završenih objava (započeta → završena forma) | mjeriti | >35% |
| Vrijeme do prve ponude | mjeriti | <24h |
| Ponuda po projektu | mjeriti | ≥3 |
| CTR primarnog CTA (hero) | mjeriti | baseline +20% |
| % projekata s recenzijom | mjeriti | >40% |
| Organski promet na "majstor/kategorija + grad" upite | mjeriti | rast m/m |

**Sljedeće:** Točka 2 — Sitemap + programmatic SEO struktura + wireframes (na odobrenje).
