import { UserPlus, ClipboardList, Bell, FileText, Briefcase, Wallet, Star } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Registruj se',
    description: 'Kreiraj profil firme ili majstora.',
  },
  {
    icon: ClipboardList,
    title: 'Popuni profil',
    description: 'Dodaj usluge, gradove i reference.',
  },
  {
    icon: Bell,
    title: 'Dobijaj poslove',
    description: 'Primaj obavještenja za nove projekte.',
  },
  {
    icon: FileText,
    title: 'Pošalji ponudu',
    description: 'Kontaktiraj klijenta i ponudi cijenu.',
  },
  {
    icon: Briefcase,
    title: 'Odradi posao',
    description: 'Dogovori detalje i izvedi rad.',
  },
  {
    icon: Wallet,
    title: 'Naplati',
    description: 'Direktno od klijenta, bez provizije.',
  },
  {
    icon: Star,
    title: 'Skupljaj ocjene',
    description: 'Građi reputaciju i dobijaj više posla.',
  },
];

export function FirmProcessAnimation() {
  return (
    <div className="relative">
      {/* Desktop horizontal connector */}
      <div className="hidden lg:block absolute top-5 left-[calc(100%/14)] right-[calc(100%/14)] h-0.5 bg-gray-200" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 lg:gap-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;
          return (
            <div
              key={step.title}
              className="relative flex flex-col items-center text-center p-3 rounded-xl bg-white/60 border border-gray-100 lg:bg-transparent lg:border-0 lg:p-0"
            >
              <div className="relative z-10 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center">
                  <Icon className="w-5 h-5 text-brand-orange" strokeWidth={1.5} />
                </div>
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-orange text-white text-[10px] font-bold flex items-center justify-center border border-white">
                  {index + 1}
                </span>
              </div>

              <h3 className="text-sm font-bold text-gray-900 mb-0.5">{step.title}</h3>
              <p className="text-xs text-steel leading-snug max-w-[140px]">{step.description}</p>

              {/* Mobile vertical connector (except last) */}
              {!isLast && (
                <div className="md:hidden absolute top-5 left-full w-4 h-0.5 bg-gray-200 -translate-x-1/2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
