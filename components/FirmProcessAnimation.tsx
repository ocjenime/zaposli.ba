import { UserPlus, ClipboardList, Bell, FileText, Briefcase, Wallet, Star } from 'lucide-react';

const phases = [
  {
    number: 1,
    title: 'Pripremite profil',
    description: 'Brza registracija i detalji koji izdvajaju vaš rad.',
    accent: 'bg-orange-50 border-orange-100',
    steps: [
      { icon: UserPlus, title: 'Registruj se', description: 'Kreiraj profil firme ili majstora.' },
      { icon: ClipboardList, title: 'Popuni profil', description: 'Dodaj usluge, gradove i reference.' },
    ],
  },
  {
    number: 2,
    title: 'Pronađite i odradite posao',
    description: 'Dobijajte upite, šaljite ponude i naplatite rad.',
    accent: 'bg-white border-gray-100',
    steps: [
      { icon: Bell, title: 'Dobijaj poslove', description: 'Primaj obavještenja za nove projekte.' },
      { icon: FileText, title: 'Pošalji ponudu', description: 'Kontaktiraj klijenta i ponudi cijenu.' },
      { icon: Briefcase, title: 'Odradi posao', description: 'Dogovori detalje i izvedi rad.' },
      { icon: Wallet, title: 'Naplati', description: 'Direktno od klijenta, bez provizije.' },
    ],
  },
  {
    number: 3,
    title: 'Gradite reputaciju',
    description: 'Ocjene i recenzije donose vam nove klijente.',
    accent: 'bg-orange-50 border-orange-100',
    steps: [
      { icon: Star, title: 'Skupljaj ocjene', description: 'Građi reputaciju i dobijaj više posla.' },
    ],
  },
];

export function FirmProcessAnimation() {
  return (
    <div className="relative">
      {/* Desktop phase connector */}
      <div className="hidden lg:block absolute top-10 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-gray-200 via-brand-orange/30 to-gray-200" />

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {phases.map((phase) => (
          <div
            key={phase.title}
            className={`relative rounded-2xl border p-5 ${phase.accent}`}
          >
            {/* Phase number */}
            <div className="absolute -top-3 left-5">
              <span className="w-7 h-7 rounded-full bg-brand-orange text-white text-sm font-bold flex items-center justify-center border-2 border-white shadow-sm">
                {phase.number}
              </span>
            </div>

            <div className="mb-4 pt-2">
              <h3 className="text-lg font-bold text-gray-900">{phase.title}</h3>
              <p className="text-sm text-steel mt-1">{phase.description}</p>
            </div>

            <div className="space-y-3">
              {phase.steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center">
                      <Icon className="w-4 h-4 text-brand-orange" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-brand-orange">{index + 1}.</span>
                        <h4 className="text-sm font-semibold text-gray-900">{step.title}</h4>
                      </div>
                      <p className="text-xs text-steel leading-snug mt-0.5">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
