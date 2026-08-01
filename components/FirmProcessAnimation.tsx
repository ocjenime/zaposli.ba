import { UserPlus, Bell, FileText, Wallet } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Registrujte se',
    description:
      'Kreirajte profil firme ili majstora. Popunite područja rada, lokacije i portfolio.',
  },
  {
    icon: Bell,
    title: 'Pronađite poslove',
    description:
      'Dobijajte obavještenja o novim projektima koji odgovaraju vašim vještinama.',
  },
  {
    icon: FileText,
    title: 'Pošaljite ponudu',
    description:
      'Kontaktirajte klijenta, dogovorite detalje i pošaljite personaliziranu ponudu.',
  },
  {
    icon: Wallet,
    title: 'Zaradite',
    description:
      'Kada vas klijent izabere, izvršite posao i uzmite zasluženu nagradu.',
  },
];

export function FirmProcessAnimation() {
  return (
    <div className="relative">
      {/* Desktop connecting line */}
      <div className="hidden md:block absolute left-0 right-0 top-8 h-px bg-gray-200" />
      {/* Mobile vertical connecting line */}
      <div className="md:hidden absolute left-8 top-8 bottom-8 w-px bg-gray-200" />

      <div className="grid md:grid-cols-4 gap-8 md:gap-6 relative">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="relative flex md:flex-col items-start md:items-center gap-4 md:gap-5"
          >
            <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center">
              <step.icon className="w-7 h-7 text-brand-orange" strokeWidth={1.5} />
            </div>
            <div className="md:text-center">
              <div className="text-xs font-extrabold text-brand-orange uppercase tracking-wider mb-1">
                Korak {index + 1}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{step.title}</h3>
              <p className="text-sm text-steel leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
