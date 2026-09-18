import ArticleLayout, { generateArticleMetadata } from '@/components/ArticleLayout';
import { Paintbrush } from 'lucide-react';

export const metadata = generateArticleMetadata({
  title: 'Cijena molerskih radova po m² u BiH 2026',
  excerpt:
    'Koliko košta krečenje i farbanje po m² u BiH 2026: cijene radova, materijala, faktori koji utiču na cijenu i savjeti za uštedu.',
  slug: 'cijena-molerskih-radova-po-m2',
});

const toc = [
  { id: 'cijene', label: 'Cijene po vrsti rada' },
  { id: 'materijal', label: 'Cijena materijala' },
  { id: 'faktori', label: 'Šta utiče na cijenu' },
  { id: 'ušteda', label: 'Kako uštedjeti' },
];

const faqs = [
  {
    q: 'Koliko košta krečenje stana od 50 m²?',
    a: 'Ako računamo samo rad bez materijala, krečenje stana od 50 m² košta između 400 i 800 KM, zavisno od stanja zidova i broja slojeva boje.',
  },
  {
    q: 'Da li cijena uključuje materijal?',
    a: 'U većini slučajeva cijena po m² odnosi se samo na rad. Materijal (boja, kit, grund) se dodatno plaća ili klijent kupuje sam.',
  },
  {
    q: 'Kada je najjeftinije krečiti?',
    a: 'Cijene su obično niže zimi i početkom proljeća, kada majstori imaju manje posla.',
  },
];

const related = [
  { slug: 'cijena-adaptacije-kupatila', title: 'Koliko košta adaptacija kupatila', category: 'Cijene' },
  { slug: 'cijena-fasade-po-m2', title: 'Cijena fasade po m² u BiH', category: 'Cijene' },
];

export default function CijenaMolerskihRadovaPage() {
  return (
    <ArticleLayout
      slug="cijena-molerskih-radova-po-m2"
      title="Cijena molerskih radova po m² u BiH 2026"
      subtitle="Realne cijene krečenja, farbanja i završnih zidnih radova"
      excerpt="Koliko košta krečenje i farbanje po m² u BiH 2026: cijene radova, materijala, faktori koji utiču na cijenu i savjeti za uštedu."
      category="Cijene"
      date="20. juli 2026."
      readTime="5 min čitanja"
      datePublished="2026-07-20"
      icon={Paintbrush}
      toc={toc}
      faqs={faqs}
      relatedArticles={related}
    >
      <p className="text-steel leading-relaxed mb-6">
        Molerski radovi su često završna faza renoviranja koja najviše utiče na dojam cijelog prostora.
        U 2026. godini cijena krečenja u BiH kreće se od <strong className="text-gray-900">3 do 8 KM po m²</strong> za rad,
        dok farbanje i specijalne tehnike koštaju više. Evo detaljnog pregleda.
      </p>

      <h2 id="cijene" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Cijene po vrsti rada</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-ink text-white">
              <th className="text-left px-4 py-3 font-semibold">Vrsta rada</th>
              <th className="text-right px-4 py-3 font-semibold">Cijena (KM/m²)</th>
            </tr>
          </thead>
          <tbody>
            {[
              { type: 'Krečenje zidova (2 sloja)', price: '3 - 6' },
              { type: 'Krečenje sa prethodnim špaklovanjem', price: '5 - 8' },
              { type: 'Farbanje bojom po izboru', price: '4 - 7' },
              { type: 'Bojenje stropova', price: '4 - 7' },
              { type: 'Dekorativne tehnike', price: '10 - 25' },
              { type: 'Skidanje stare boje', price: '2 - 4' },
            ].map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-cloud/50'}>
                <td className="px-4 py-3 text-gray-900">{row.type}</td>
                <td className="px-4 py-3 text-right font-semibold text-brand-orange-dark whitespace-nowrap">{row.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="materijal" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Cijena materijala</h2>
      <p className="text-steel leading-relaxed mb-4">
        Kvalitetna boja za unutrašnje zidove košta između 8 i 25 KM po litru, a potrebnih litara zavisi od
        upijanja podloge. Za standardan stan od 60 m², potrebno je otprilike 15-20 litara boje za dva sloja.
        Dodajte još kit, grund i silikon: ukupno materijal za prosječan stan iznosi 300-700 KM.
      </p>

      <h2 id="faktori" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Šta utiče na cijenu</h2>
      <ul className="list-disc marker:text-brand-orange ml-5 mb-6 text-steel leading-relaxed space-y-2">
        <li><strong className="text-gray-900">Stanje zidova</strong> - pukotine, fleke i stara boja zahtijevaju više pripreme.</li>
        <li><strong className="text-gray-900">Visina prostorija</strong> - stropovi iznad 3 metra skuplji su zbog skele.</li>
        <li><strong className="text-gray-900">Boja</strong> - tamne i jake nijanse često trebaju tri sloja.</li>
        <li><strong className="text-gray-900">Sezona</strong> - ljeto je najskuplje, zima najpovoljnije.</li>
      </ul>

      <h2 id="ušteda" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Kako uštedjeti</h2>
      <p className="text-steel leading-relaxed mb-6">
        Najbolji način da platite poštenu cijenu je da prikupite ponude od tri majstora i da jasno navedete
        obim rada. Objavite posao na Zaposli.ba i uporedite ponude sa stvarnim recenzijama.
      </p>
    </ArticleLayout>
  );
}
