import { ClipboardList, Users, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    icon: ClipboardList,
    number: '1',
    title: 'Objavite projekat',
    description: 'Opišite šta vam je potrebno, dodajte fotografije i postavite budžet. Traje samo 2 minute.',
  },
  {
    icon: Users,
    number: '2',
    title: 'Primite ponude',
    description: 'Provjereni majstori i firme će vam poslati svoje ponude sa cijenama i rokovima.',
  },
  {
    icon: CheckCircle,
    number: '3',
    title: 'Odaberite majstora',
    description: 'Uporedite ponude, pročitajte recenzije i odaberite najboljeg izvođača za vaš projekat.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-14 md:py-20 bg-white relative overflow-hidden">
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block px-4 py-1.5 bg-primary-50 text-brand-orange rounded-full text-sm font-semibold mb-3">
            Jednostavno &amp; brzo
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-3 tracking-tight">
            Kako funkcioniše?
          </h2>
          <p className="text-steel max-w-xl mx-auto">
            Jednostavan proces u 3 koraka do idealnog majstora za vaš projekat
          </p>
        </div>

        <div className="relative">
          {/* Povezana linija koraka (desktop) */}
          <div className="hidden md:block absolute top-7 left-[18%] right-[18%] border-t-2 border-dashed border-primary-200" aria-hidden="true" />

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative bg-white rounded-2xl border border-gray-100 p-5 md:p-6 hover:shadow-xl hover:border-primary-100 hover:-translate-y-1 transition-all duration-300 group flex md:block items-start gap-4"
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-brand-orange to-brand-orange-dark flex items-center justify-center shadow-md shadow-brand-orange/25 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <step.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-ink text-white text-[11px] font-extrabold flex items-center justify-center ring-2 ring-white">
                    {step.number}
                  </span>
                </div>
                <div className="md:mt-5">
                  <h3 className="text-lg font-bold text-ink mb-1.5">{step.title}</h3>
                  <p className="text-steel text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8 md:mt-10">
          <Link
            href="/objavi-projekat/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-orange to-brand-orange-dark text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-orange/25 transition-all active:scale-95"
          >
            Objavite projekat besplatno
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
