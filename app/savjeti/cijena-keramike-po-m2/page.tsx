import ArticleLayout, { generateArticleMetadata } from '@/components/ArticleLayout';
import { SquareMenu } from 'lucide-react';

export const metadata = generateArticleMetadata({
  title: 'Cijena keramičarskih radova po m² u BiH 2026',
  excerpt:
    'Koliko košta postavljanje pločica po m² u BiH 2026: cijene radova, uticaj formata pločica, priprema podloge i najčešće greške.',
  slug: 'cijena-keramike-po-m2',
});

const toc = [
  { id: 'cijene', label: 'Cijene po tipu prostora' },
  { id: 'format', label: 'Uticaj formata pločica' },
  { id: 'priprema', label: 'Priprema podloge' },
  { id: 'greske', label: 'Greške koje poskupljuju' },
];

const faqs = [
  {
    q: 'Koliko košta keramika u kupatilu od 4 m²?',
    a: 'Rad na postavljanju pločica u kupatilu od 4 m² košta između 300 i 700 KM, bez materijala. Materijal dodatno iznosi 400-1.500 KM.',
  },
  {
    q: 'Da li se cijena razlikuje za podne i zidne pločice?',
    a: 'Da, podne pločice su obično jeftinije za postavljanje, dok zidne pločice zahtijevaju više preciznosti i vremena.',
  },
  {
    q: 'Koji format pločica je najjeftiniji?',
    a: 'Standardni formati 30x30 i 33x33 su najjeftiniji. Velikoformatne pločice (60x120 i veće) koštaju i do 50% više zbog težine i preciznosti.',
  },
];

const related = [
  { slug: 'cijena-adaptacije-kupatila', title: 'Koliko košta adaptacija kupatila', category: 'Cijene' },
  { slug: 'cijena-molerskih-radova-po-m2', title: 'Cijena molerskih radova po m²', category: 'Cijene' },
];

export default function CijenaKeramikePage() {
  return (
    <ArticleLayout
      slug="cijena-keramike-po-m2"
      title="Cijena keramičarskih radova po m² u BiH 2026"
      subtitle="Cijene postavljanja pločica, uticaj formata i najčešće greške"
      excerpt="Koliko košta postavljanje pločica po m² u BiH 2026: cijene radova, uticaj formata pločica, priprema podloge i najčešće greške."
      category="Cijene"
      date="22. juli 2026."
      readTime="6 min čitanja"
      datePublished="2026-07-22"
      icon={SquareMenu}
      toc={toc}
      faqs={faqs}
      relatedArticles={related}
    >
      <p className="text-steel leading-relaxed mb-6">
        Keramičarski radovi su ključni za kupatila, kuhinje i terase. U BiH u 2026. godini cijena postavljanja
        pločica kreće se od <strong className="text-gray-900">15 do 45 KM po m²</strong>, zavisno od formata,
        podloge i složenosti prostora.
      </p>

      <h2 id="cijene" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Cijene po tipu prostora</h2>
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-ink text-white">
              <th className="text-left px-4 py-3 font-semibold">Prostor</th>
              <th className="text-right px-4 py-3 font-semibold">Cijena rada (KM/m²)</th>
            </tr>
          </thead>
          <tbody>
            {[
              { space: 'Kupatilo (standardni format)', price: '20 - 35' },
              { space: 'Kuhinja (pod + zid)', price: '18 - 30' },
              { space: 'Hodnik / terasa', price: '15 - 25' },
              { space: 'Velikoformatne pločice', price: '30 - 45' },
              { space: 'Mozaik / dekorativni radovi', price: '35 - 60' },
            ].map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-cloud/50'}>
                <td className="px-4 py-3 text-gray-900">{row.space}</td>
                <td className="px-4 py-3 text-right font-semibold text-brand-orange-dark whitespace-nowrap">{row.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="format" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Uticaj formata pločica</h2>
      <p className="text-steel leading-relaxed mb-4">
        Manji formati (30x30) su brži za postavljanje i troše manje ljepila po m². Velikoformatne pločica
        zahtijevaju savršeno ravnu podlogu, specijalno ljepilo i iskusnijeg keramičara. Svaki prelaz na veći
        format može povećati cijenu rada za 30-50%.
      </p>

      <h2 id="priprema" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Priprema podloge</h2>
      <p className="text-steel leading-relaxed mb-4">
        Priprema podloge često čini trećinu ukupnog vremena. U cijenu se mora uračunati: čišćenje, nivelacija,
        hidroizolacija u kupatilima i grundiranje. Ako podloga nije ravna, dodaje se estrih ili samonivelirajuća
        masa.
      </p>

      <h2 id="greske" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Greške koje poskupljuju</h2>
      <ul className="list-disc marker:text-brand-orange ml-5 mb-6 text-steel leading-relaxed space-y-2">
        <li><strong className="text-gray-900">Neravna podloga</strong> - pločice pucaju ili odstupaju.</li>
        <li><strong className="text-gray-900">Loša hidroizolacija</strong> - curenje u kupatilu košta skupo kasnije.</li>
        <li><strong className="text-gray-900">Nedovoljno ljepilo</strong> - pločice se odlepljuju nakon godinu dana.</li>
        <li><strong className="text-gray-900">Nepravilna fugna</strong> - utiče na izgled i trajnost.</li>
      </ul>
    </ArticleLayout>
  );
}
