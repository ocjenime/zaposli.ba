import ArticleLayout, { generateArticleMetadata } from '@/components/ArticleLayout';
import { FileText } from 'lucide-react';

export const metadata = generateArticleMetadata({
  title: 'Kako napisati oglas za posao koji privlači majstore',
  excerpt:
    'Napišite jasan oglas za majstora i dobijte više kvalitetnih ponuda. Primjer dobro napisanog oglasa i lista grešaka koje izbjegavati.',
  slug: 'kako-napisati-oglas-za-posao',
});

const toc = [
  { id: 'naslov', label: 'Jasan naslov i kategorija' },
  { id: 'opis', label: 'Šta mora sadržavati opis' },
  { id: 'budzet', label: 'Budžet i rok' },
  { id: 'primjer', label: 'Primjer dobrog oglasa' },
];

const faqs = [
  {
    q: 'Da li moram navesti budžet u oglasu?',
    a: 'Nije obavezno, ali približan budžet pomaže firmama da brže procijene da li mogu preuzeti posao.',
  },
  {
    q: 'Koliko ponuda trebam dobiti?',
    a: 'Preporučljivo je prikupiti 3 ponude prije nego što odlučite. Tako najbolje procijenite tržišnu cijenu.',
  },
  {
    q: 'Šta ako ne znam tačno šta mi treba?',
    a: 'Napišite šta želite postići (npr. "želim osvježiti kupatilo"). Majstori će vam pomoći sa detaljima.',
  },
];

const related = [
  { slug: 'cijena-molerskih-radova-po-m2', title: 'Cijena molerskih radova po m²', category: 'Cijene' },
  { slug: 'hitne-intervencije-cijene', title: 'Cijene hitnih intervencija', category: 'Cijene' },
];

export default function KakoNapisatiOglasPage() {
  return (
    <ArticleLayout
      slug="kako-napisati-oglas-za-posao"
      title="Kako napisati oglas za posao koji privlači majstore"
      subtitle="Jasan oglas = više ponuda, bolje cijene i brži završetak"
      excerpt="Napišite jasan oglas za majstora i dobijte više kvalitetnih ponuda. Primjer dobro napisanog oglasa i lista grešaka koje izbjegavati."
      category="Savjeti"
      date="28. juli 2026."
      readTime="4 min čitanja"
      datePublished="2026-07-28"
      icon={FileText}
      toc={toc}
      faqs={faqs}
      relatedArticles={related}
    >
      <p className="text-steel leading-relaxed mb-6">
        Dobro napisan oglas je polovina uspjeha. Majstori i firme brže odgovaraju na jasne oglase sa dovoljno
        detalja. Evo kako napisati oglas koji donosi više ponuda i manje nejasnoća.
      </p>

      <h2 id="naslov" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Jasan naslov i kategorija</h2>
      <p className="text-steel leading-relaxed mb-4">
        Naslov treba da sadrži glavnu uslugu i grad. Primjer: <em>Krečenje dvosobnog stana u Sarajevu</em>.
        Odaberite točnu kategoriju kako bi pravi majstori vidjeli vaš oglas.
      </p>

      <h2 id="opis" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Šta mora sadržavati opis</h2>
      <ul className="list-disc marker:text-brand-orange ml-5 mb-6 text-steel leading-relaxed space-y-2">
        <li><strong className="text-gray-900">Veličina prostora</strong> - kvadratura, broj soba, etaža.</li>
        <li><strong className="text-gray-900">Trenutno stanje</strong> - novogradnja, staro stanje, postojeća šteta.</li>
        <li><strong className="text-gray-900">Materijali</strong> - da li kupujete više ili želite ponudu sa materijalom.</li>
        <li><strong className="text-gray-900">Rok</strong> - kada treba početi i završiti.</li>
        <li><strong className="text-gray-900">Dostupnost</strong> - kada je moguće doći na uvid.</li>
      </ul>

      <h2 id="budzet" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Budžet i rok</h2>
      <p className="text-steel leading-relaxed mb-4">
        Ako imate predstavu o budžetu, navedite raspon. Ako niste sigurni, napišite da očekujete ponude.
        Jasno navedite prioritet - brzina ili cijena - kako bi majstori znali kako da formiraju ponudu.
      </p>

      <h2 id="primjer" className="text-2xl font-bold text-gray-900 mt-10 mb-4">Primjer dobrog oglasa</h2>
      <div className="bg-cloud border border-gray-100 rounded-2xl p-6 text-sm text-steel leading-relaxed">
        <p className="font-semibold text-gray-900 mb-2">Naslov: Adaptacija kupatila od 5 m² u Mostaru</p>
        <p className="mb-2">
          Potreban keramičar i vodoinstalater za potpunu adaptaciju kupatila u stanu iz 1980-ih.
          Staru keramiku treba skinuti, zamijeniti cijevi, postaviti nove pločice 30x60 i ugraditi wc školjku,
          lavabo i tuš kabinu. Materijal kupujem ja, ali očekujem savjet pri odabiru.
        </p>
        <p className="mb-2">Rok: početak avgust, završetak do 15. septembra.</p>
        <p>Budžet: 6.000 - 9.000 KM za rad.</p>
      </div>
    </ArticleLayout>
  );
}
