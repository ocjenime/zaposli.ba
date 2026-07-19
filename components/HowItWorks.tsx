import { ClipboardList, Users, CheckCircle, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: ClipboardList,
    number: '01',
    title: 'Objavite projekat',
    description: 'Opišite šta vam je potrebno, dodajte fotografije i postavite budžet. Traje samo 2 minute.',
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    stepColor: 'text-blue-400',
  },
  {
    icon: Users,
    number: '02',
    title: 'Primite ponude',
    description: 'Provjereni majstori i firme će vam poslati svoje ponude sa cijenama i rokovima.',
    color: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    stepColor: 'text-emerald-400',
  },
  {
    icon: CheckCircle,
    number: '03',
    title: 'Odaberite majstora',
    description: 'Uporedite ponude, pročitajte recenzije i odaberite najboljeg izvođača za vaš projekat.',
    color: 'from-brand-orange to-brand-orange-dark',
    bg: 'bg-orange-50',
    iconColor: 'text-brand-orange',
    stepColor: 'text-brand-orange',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-50 rounded-full translate-y-1/2 -translate-x-1/2 opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold mb-4">
            Jednostavno &amp; brzo
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Kako funkcioniše?
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Jednostavan proces u 3 koraka do idealnog majstora za vaš projekat
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-6">
          {steps.map((step, index) => (
            <div key={step.number} className="relative group">
              <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 h-full relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${step.bg} mb-6`}>
                  <step.icon className={`w-8 h-8 ${step.iconColor}`} />
                </div>

                <div className={`text-xs font-bold ${step.stepColor} uppercase tracking-widest mb-2`}>
                  Korak {step.number}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>

                <p className="text-gray-500 leading-relaxed">{step.description}</p>

                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 z-10 w-8 h-8 items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-gray-300" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}