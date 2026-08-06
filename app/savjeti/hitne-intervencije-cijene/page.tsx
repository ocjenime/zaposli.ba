import ArticleLayout, { generateArticleMetadata } from '@/components/ArticleLayout';
import { AlertTriangle } from 'lucide-react';

export const metadata = generateArticleMetadata({
  title: 'Cijene hitnih majstorskih intervencija u BiH 2026',
  excerpt:
    'Cijene hitnih intervencija - vodoinstalater, električar, bravar - po satnici i po dolasku u BiH 2026.',
  slug: 'hitne-intervencije-cijene',
});

const toc = [
  { id: 'satnica', label: 'Cijena po dolasku i satnici' },
  { id: 'voda', label: 'Hitne vodoinstalaterske intervencije' },
  { id: 'struja', label: 'Hitne elektrointervencije' },
  { id: 'savjeti', label: 'Kako brzo pronaći majstora' },
];

const faqs = [
  {
    q: 'Koliko košta hitna intervencija električara?',
    a: 'Dolazak električara na teren košta 50-100 KM, a satnica 30-50 KM. Noćne intervencije i praznici mogu koštati 50-100% više.',
  },
  {
    q: 'Da li se plaća dolazak majstora ako se ne uradi ništa?',
    a: 'Većina majstora naplaćuje dolazak na teren čak i kada je problem sitan, zato jer gube vrijeme i gorivo. Provjerite unaprijed.',
  },
  {
    q: 'Koliko traje dolazak hitnog majstora?',
    a: 'U gradovima poput Sarajeva, Banja Luke i Mostara majstor može stići u roku od 30-90 minuta. Van gradskih središta rok je duži.',
  },
];

const related = [
  { slug: 'cijena-adaptacije-kupatila', title: 'Koliko košta adaptacija kupatila', category: 'Cijene' },
  { slug: 'cijena-keramike-po-m2', title: 'Cijena keramike po m²', category: 'Cijene' },
];

export default function HitneIntervencijePage() {
  return (
    <ArticleLayout
      slug="hitne-intervencije-cijene"
      title="Cijene hitnih majstorskih intervencija u BiH 2026"
      subtitle="Koliko košta hitan dolazak vodoinstalatera, električara ili bravara"
      excerpt="Cijene hitnih intervencija - vodoinstalater, električar, bravar - po satnici i po dolasku u BiH 2026."
      category="Cijene"
      date="27. juli 2026."
      readTime="5 min čitanja"
      datePublished="2026-07-27"
      icon={AlertTriangle}
      toc={toc}
      faqs={faqs}
      relatedArticles={related}
    >
      <p className="text-steel leading-relaxed mb-6">
        Curenje cijevi, nestanak struje ili zaključana vrata - ponekad jednostavno ne možete čekati.
        U BiH cijene hitnih majstorskih intervencija u 2026. godini kreću se od <strong className="text-gray-900">50 do 150 KM za dolazak</strong>,
        zavisno od vrste problema i vremena dana.
      </p>

      <h2 id="satnica" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Cijena po dolasku i satnici</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-ink text-white">
              <th className="text-left px-4 py-3 font-semibold">Vrsta majstora</th>
              <th className="text-right px-4 py-3 font-semibold">Dolazak</th>
              <th className="text-right px-4 py-3 font-semibold">Satnica</th>
            </tr>
          </thead>
          <tbody>
            {[
              { type: 'Vodoinstalater', arrival: '50 - 100', hourly: '25 - 45' },
              { type: 'Električar', arrival: '50 - 100', hourly: '30 - 50' },
              { type: 'Bravar', arrival: '40 - 80', hourly: '20 - 40' },
              { type: 'Klima-tehničar', arrival: '50 - 120', hourly: '30 - 50' },
              { type: 'Stolar', arrival: '50 - 100', hourly: '25 - 45' },
            ].map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-cloud/50'}>
                <td className="px-4 py-3 text-gray-900">{row.type}</td>
                <td className="px-4 py-3 text-right font-semibold text-brand-orange-dark whitespace-nowrap">{row.arrival} KM</td>
                <td className="px-4 py-3 text-right font-semibold text-brand-orange-dark whitespace-nowrap">{row.hourly} KM</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="voda" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Hitne vodoinstalaterske intervencije</h2>
      <p className="text-steel leading-relaxed mb-4">
        Curenje slavine, pukla cijev ili zapušen odvod su najčešći razlozi za pozivanje vodoinstalatera.
        Ako voda curi na struju, prvo isključite osigurače. Manji kvarovi se rješavaju u roku od sat vremena,
        dok zamjena cijevi može koštati 200-500 KM.
      </p>

      <h2 id="struja" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Hitne elektrointervencije</h2>
      <p className="text-steel leading-relaxed mb-4">
        Nestanak struje, iskakanje osigurača ili pregorele utičnice mogu biti opasni. Električar provjerava
        tablu, zamjenu osigurača i kratki spoj. Cijena zavisi od opasnosti i težine kvara.
      </p>

      <h2 id="savjeti" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Kako brzo pronaći majstora</h2>
      <p className="text-steel leading-relaxed mb-4">
        Najbrži način je da na Zaposli.ba objavite hitan posao, označite ga kao hitan i opišite problem.
        Aktivne firme u vašem gradu vide oglas odmah i mogu vam odgovoriti unutar nekoliko minuta.
      </p>
    </ArticleLayout>
  );
}
