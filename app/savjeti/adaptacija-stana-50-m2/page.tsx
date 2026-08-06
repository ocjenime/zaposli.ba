import ArticleLayout, { generateArticleMetadata } from '@/components/ArticleLayout';
import { Home } from 'lucide-react';

export const metadata = generateArticleMetadata({
  title: 'Koliko košta adaptacija stana od 50 m² u BiH 2026',
  excerpt:
    'Kompletna adaptacija stana od 50 m² u BiH: cijene po fazama, šta uključuje i kako planirati budžet bez skrivenih troškova.',
  slug: 'adaptacija-stana-50-m2',
});

const toc = [
  { id: 'budzet', label: 'Ukupni budžet' },
  { id: 'faze', label: 'Cijene po fazama' },
  { id: 'kako', label: 'Kako planirati adaptaciju' },
  { id: 'ušteda', label: 'Savjeti za uštedu' },
];

const faqs = [
  {
    q: 'Koliko košta kompletna adaptacija stana od 50 m²?',
    a: 'Kompletna adaptacija stana od 50 m² u BiH košta između 15.000 i 35.000 KM, zavisno od obima radova i kvaliteta materijala.',
  },
  {
    q: 'Šta obično uključuje kompletna adaptacija?',
    a: 'Uključuje rušenje, elektro i vodoinstalacije, zamjenu keramike, krečenje, zamjenu vrata i podova, te kuhinju po mjeri.',
  },
  {
    q: 'Koliko traje adaptacija stana od 50 m²?',
    a: 'Prosječno 6 do 12 sedmica, zavisno od dostupnosti majstora i materijala.',
  },
];

const related = [
  { slug: 'cijena-adaptacije-kupatila', title: 'Koliko košta adaptacija kupatila', category: 'Cijene' },
  { slug: 'cijena-molerskih-radova-po-m2', title: 'Cijena molerskih radova po m²', category: 'Cijene' },
];

export default function AdaptacijaStanaPage() {
  return (
    <ArticleLayout
      slug="adaptacija-stana-50-m2"
      title="Koliko košta adaptacija stana od 50 m² u BiH 2026"
      subtitle="Kompletan vodič kroz budžet, faze i skrivene troškove adaptacije"
      excerpt="Kompletna adaptacija stana od 50 m² u BiH: cijene po fazama, šta uključuje i kako planirati budžet bez skrivenih troškova."
      category="Cijene"
      date="25. juli 2026."
      readTime="7 min čitanja"
      datePublished="2026-07-25"
      icon={Home}
      toc={toc}
      faqs={faqs}
      relatedArticles={related}
    >
      <p className="text-steel leading-relaxed mb-6">
        Adaptacija stana od 50 m² je jedan od najčešćih projekata u BiH. Bilo da kupujete stariji stan ili
        želite osvježiti postojeći, važno je imati realnu predstavu o troškovima. U 2026. godini kompletna
        adaptacija ovakvog stana kreće se od <strong className="text-gray-900">15.000 do 35.000 KM</strong>.
      </p>

      <h2 id="budzet" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Ukupni budžet</h2>
      <p className="text-steel leading-relaxed mb-4">
        Budžet zavisi od toga da li radite kozmetičku adaptaciju (krečenje, podovi, kuhinja) ili kompletnu
        adaptaciju sa rušenjem, novim instalacijama i kupatilom. Pravilo je da materijal čini 40-50% ukupnog
        budžeta, a rad 50-60%.
      </p>

      <h2 id="faze" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Cijene po fazama</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-ink text-white">
              <th className="text-left px-4 py-3 font-semibold">Faza</th>
              <th className="text-right px-4 py-3 font-semibold">Cijena (KM)</th>
            </tr>
          </thead>
          <tbody>
            {[
              { phase: 'Demontaža i odvoz šuta', price: '500 - 1.500' },
              { phase: 'Elektroinstalacije', price: '1.500 - 3.500' },
              { phase: 'Vodoinstalacije', price: '2.000 - 4.500' },
              { phase: 'Adaptacija kupatila', price: '4.000 - 10.000' },
              { phase: 'Postavljanje podova', price: '3.000 - 7.000' },
              { phase: 'Moleraj i završni radovi', price: '2.500 - 5.500' },
              { phase: 'Kuhinja po mjeri', price: '3.500 - 10.000' },
              { phase: 'Vrata i prozori', price: '2.000 - 6.000' },
            ].map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-cloud/50'}>
                <td className="px-4 py-3 text-gray-900">{row.phase}</td>
                <td className="px-4 py-3 text-right font-semibold text-brand-orange-dark whitespace-nowrap">{row.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="kako" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Kako planirati adaptaciju</h2>
      <ol className="list-decimal marker:text-brand-orange marker:font-bold ml-5 mb-6 text-steel leading-relaxed space-y-2">
        <li><strong className="text-gray-900">Napravite listu prioriteta</strong> - razdvojite ono što mora biti urađeno od onoga što želite.</li>
        <li><strong className="text-gray-900">Prikupite 3 ponude</strong> - cijene mogu varirati i do 50%.</li>
        <li><strong className="text-gray-900">Rezervišite 15% rezerve</strong> - uvijek postoje nepredviđeni troškovi.</li>
        <li><strong className="text-gray-900">Planirajte redoslijed radova</strong> - prvo rušenje, pa instalacije, pa keramika, pa moleraj.</li>
      </ol>

      <h2 id="ušteda" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Savjeti za uštedu</h2>
      <p className="text-steel leading-relaxed mb-4">
        Kupujte materijal van sezone kada su popusti veći. Raspitajte se o kompletnim paketima za kupatilo.
        Ako imate vještina, možete sami uraditi demontažu i čišćenje, čime štedite na prvoj fazi.
      </p>
    </ArticleLayout>
  );
}
