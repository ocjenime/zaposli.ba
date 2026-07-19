import { ClipboardList, Users, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: ClipboardList,
    number: '01',
    title: 'Objavite projekat',
    description: 'Opišite šta vam je potrebno, dodajte fotografije i postavite budžet. Traje samo 2 minute.',
    color: 'bg-primary-100 text-primary-600',
  },
  {
    icon: Users,
    number: '02',
    title: 'Primite ponude',
    description: 'Provjereni majstori i firme će vam poslati svoje ponude sa cijenama i rokovima.',
    color: 'bg-success-100 text-success-600',
  },
  {
    icon: CheckCircle,
    number: '03',
    title: 'Odaberite i zaposlite',
    description: 'Uporedite ponude, pročitajte recenzije i odaberite najboljeg izvođača za vaš projekat.',
    color: 'bg-accent-100 text-accent-600',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Kako funkcioniše?</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Jednostavan proces u 3 koraka do idealnog majstora za vaš projekat
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gray-200">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full" />
                </div>
              )}
              
              <div className="text-center relative">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${step.color} mb-6`}>
                  <step.icon className="w-10 h-10" />
                </div>
                
                {/* Number */}
                <div className="text-sm font-bold text-gray-400 mb-2">KORAK {step.number}</div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                
                {/* Description */}
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}