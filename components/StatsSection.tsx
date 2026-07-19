import { Users, Building2, Star, CheckCircle, Shield, CreditCard, MessageSquare } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '12,500+',
    label: 'Zadovoljnih kupaca',
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Building2,
    value: '2,800+',
    label: 'Prijavljenih firmi',
    gradient: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Star,
    value: '4.8',
    label: 'Prosječna ocjena',
    gradient: 'from-brand-amber to-brand-orange',
    bg: 'bg-orange-50',
  },
  {
    icon: CheckCircle,
    value: '25,000+',
    label: 'Završenih projekata',
    gradient: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
  },
];

const trustCards = [
  {
    icon: Shield,
    title: 'Verificirane firme',
    description: 'Sve firme prolaze provjeru identiteta i poslovanja prije odobravanja profila.',
    gradient: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: CreditCard,
    title: 'Besplatno za kupce',
    description: 'Objavljivanje projekata i primanje ponuda je potpuno besplatno.',
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: MessageSquare,
    title: 'Ocjene i recenzije',
    description: 'Pročitajte iskustva drugih kupaca prije nego što odaberete firmu.',
    gradient: 'from-brand-amber to-brand-orange',
    bg: 'bg-orange-50',
  },
];

export default function StatsSection() {
  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-sm font-semibold mb-4">
            Zašto baš mi?
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Zašto Zaposli.ba?
          </h2>
          <p className="text-lg text-gray-500">
            Platforma kojoj vjeruju hiljade kupaca i firmi širom Bosne i Hercegovine
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${stat.bg} mb-4`}>
                <stat.icon className={`w-7 h-7 bg-gradient-to-r ${stat.gradient} bg-clip-text`} style={{color: 'inherit'}} />
              </div>
              <div className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {trustCards.map((card) => (
            <div key={card.title} className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 text-center relative overflow-hidden group">
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${card.bg} mb-5`}>
                <card.icon className="w-7 h-7 text-gray-700" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">{card.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}