import { UserPlus, Briefcase, Wallet } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Kreirajte profil',
    description: 'Besplatna registracija firme ili majstora u par minuta.',
    icon: UserPlus,
  },
  {
    number: '02',
    title: 'Pronađite i odradite posao',
    description: 'Dobijajte upite, šaljite ponude i rješavajte projekte.',
    icon: Briefcase,
  },
  {
    number: '03',
    title: 'Naplatite i gradite reputaciju',
    description: 'Primajte uplatu direktno i skupljajte ocjene klijenata.',
    icon: Wallet,
  },
];

export function FirmProcessAnimation() {
  return (
    <div className="relative">
      {/* Desktop connecting line */}
      <div className="hidden md:block absolute top-8 left-[22%] right-[22%] h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Mobile vertical timeline */}
      <div className="md:hidden absolute left-[1.875rem] top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent" />

      <div className="grid md:grid-cols-3 gap-10 md:gap-6 lg:gap-10">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="group relative flex md:flex-col items-start md:items-center gap-5 md:gap-6 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                <span className="absolute inset-0 flex items-center justify-center text-5xl md:text-6xl font-extrabold text-gray-100 select-none transition-colors duration-300 group-hover:text-orange-100">
                  {step.number}
                </span>
                <Icon
                  className="relative w-5 h-5 md:w-6 md:h-6 text-brand-orange transition-transform duration-300 group-hover:scale-110"
                  strokeWidth={1.5}
                />
              </div>

              <div className="flex-1 md:text-center">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-steel leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
