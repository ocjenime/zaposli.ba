import { UserPlus, Bell, FileText, Wallet, Wrench } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Registrujte se',
    description: 'Kreirajte profil firme ili majstora.',
  },
  {
    icon: Bell,
    title: 'Pronađite poslove',
    description: 'Dobijajte obavještenja o novim projektima.',
  },
  {
    icon: FileText,
    title: 'Pošaljite ponudu',
    description: 'Kontaktirajte klijenta i pošaljite ponudu.',
  },
  {
    icon: Wallet,
    title: 'Zaradite',
    description: 'Izvršite posao i uzmite zasluženu nagradu.',
  },
];

export function FirmProcessAnimation() {
  return (
    <div className="relative">
      {/* Desktop: circular diagram */}
      <div className="hidden md:block relative mx-auto max-w-3xl">
        <svg
          viewBox="0 0 520 520"
          className="w-full h-auto"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer rotating dashed ring */}
          <circle
            cx="260"
            cy="260"
            r="200"
            stroke="#E5E7EB"
            strokeWidth="2"
            strokeDasharray="12 8"
            className="origin-center animate-spin-slow"
            style={{ animationDuration: '40s' }}
          />
          {/* Inner accent ring */}
          <circle
            cx="260"
            cy="260"
            r="180"
            stroke="rgba(249, 115, 22, 0.15)"
            strokeWidth="1"
            strokeDasharray="4 6"
            className="origin-center animate-spin-slow"
            style={{ animationDuration: '60s', animationDirection: 'reverse' }}
          />
          {/* Center pulse */}
          <circle cx="260" cy="260" r="44" fill="#FFF7ED" stroke="#F97316" strokeWidth="2" />
          <g transform="translate(244, 244)">
            <Wrench className="w-8 h-8 text-brand-orange" />
          </g>
          {/* Decorative dots at cardinal points */}
          <circle cx="260" cy="60" r="4" fill="#F97316" opacity="0.4" />
          <circle cx="460" cy="260" r="4" fill="#F97316" opacity="0.4" />
          <circle cx="260" cy="460" r="4" fill="#F97316" opacity="0.4" />
          <circle cx="60" cy="260" r="4" fill="#F97316" opacity="0.4" />
        </svg>

        {/* Step 1 — top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-44">
          <div className="w-16 h-16 mx-auto rounded-full bg-white border border-gray-100 shadow-md flex items-center justify-center mb-3">
            <UserPlus className="w-7 h-7 text-brand-orange" strokeWidth={1.5} />
          </div>
          <div className="text-xs font-extrabold text-brand-orange uppercase tracking-wider mb-1">Korak 1</div>
          <h3 className="text-base font-bold text-gray-900 mb-1">{steps[0].title}</h3>
          <p className="text-sm text-steel">{steps[0].description}</p>
        </div>

        {/* Step 2 — right */}
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 text-center w-44">
          <div className="w-16 h-16 mx-auto rounded-full bg-white border border-gray-100 shadow-md flex items-center justify-center mb-3">
            <Bell className="w-7 h-7 text-brand-orange" strokeWidth={1.5} />
          </div>
          <div className="text-xs font-extrabold text-brand-orange uppercase tracking-wider mb-1">Korak 2</div>
          <h3 className="text-base font-bold text-gray-900 mb-1">{steps[1].title}</h3>
          <p className="text-sm text-steel">{steps[1].description}</p>
        </div>

        {/* Step 3 — bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-center w-44">
          <div className="w-16 h-16 mx-auto rounded-full bg-white border border-gray-100 shadow-md flex items-center justify-center mb-3">
            <FileText className="w-7 h-7 text-brand-orange" strokeWidth={1.5} />
          </div>
          <div className="text-xs font-extrabold text-brand-orange uppercase tracking-wider mb-1">Korak 3</div>
          <h3 className="text-base font-bold text-gray-900 mb-1">{steps[2].title}</h3>
          <p className="text-sm text-steel">{steps[2].description}</p>
        </div>

        {/* Step 4 — left */}
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 text-center w-44">
          <div className="w-16 h-16 mx-auto rounded-full bg-white border border-gray-100 shadow-md flex items-center justify-center mb-3">
            <Wallet className="w-7 h-7 text-brand-orange" strokeWidth={1.5} />
          </div>
          <div className="text-xs font-extrabold text-brand-orange uppercase tracking-wider mb-1">Korak 4</div>
          <h3 className="text-base font-bold text-gray-900 mb-1">{steps[3].title}</h3>
          <p className="text-sm text-steel">{steps[3].description}</p>
        </div>
      </div>

      {/* Mobile: vertical timeline */}
      <div className="md:hidden relative pl-8">
        <div className="absolute left-8 top-4 bottom-4 w-px bg-gradient-to-b from-gray-200 via-brand-orange/20 to-gray-200" />
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="relative flex items-start gap-4 mb-8 last:mb-0">
              <div className="absolute -left-8 top-0 w-16 h-16 -translate-x-1/2 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center z-10">
                <Icon className="w-7 h-7 text-brand-orange" strokeWidth={1.5} />
              </div>
              <div className="ml-4">
                <div className="text-xs font-extrabold text-brand-orange uppercase tracking-wider mb-1">
                  Korak {index + 1}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-sm text-steel leading-relaxed">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
