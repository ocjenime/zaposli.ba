import type { LucideIcon } from 'lucide-react';

export interface HeroStyle {
  gradient: string;
  accent: string;
  eyebrow: string;
}

const groupStyles: Record<string, HeroStyle> = {
  'Hitno 24/7': {
    gradient: 'bg-gradient-to-br from-red-900 via-red-800 to-orange-900',
    accent: 'text-red-400',
    eyebrow: 'Hitan majstor dostupan odmah',
  },
  'Građevina i zidarski radovi': {
    gradient: 'bg-gradient-to-br from-slate-900 via-orange-950 to-amber-950',
    accent: 'text-orange-400',
    eyebrow: 'Građevinski radovi',
  },
  'Krov, fasada i izolacija': {
    gradient: 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950',
    accent: 'text-blue-400',
    eyebrow: 'Krov, fasada i izolacija',
  },
  'Boje, zidovi i podovi': {
    gradient: 'bg-gradient-to-br from-orange-950 via-amber-900 to-yellow-950',
    accent: 'text-amber-400',
    eyebrow: 'Završni radovi',
  },
  'Kupatila, kuhinje i adaptacije': {
    gradient: 'bg-gradient-to-br from-cyan-950 via-blue-900 to-slate-950',
    accent: 'text-cyan-400',
    eyebrow: 'Adaptacije i renoviranje',
  },
  'Stolarija i namještaj': {
    gradient: 'bg-gradient-to-br from-amber-950 via-orange-900 to-yellow-950',
    accent: 'text-amber-400',
    eyebrow: 'Stolarija i namještaj',
  },
  Instalacije: {
    gradient: 'bg-gradient-to-br from-blue-950 via-cyan-900 to-slate-950',
    accent: 'text-cyan-400',
    eyebrow: 'Vodoinstalaterski i električarski radovi',
  },
  'Pametni dom i sigurnost': {
    gradient: 'bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950',
    accent: 'text-purple-400',
    eyebrow: 'Sigurnosni sistemi i tehnologija',
  },
  'Čišćenje i održavanje': {
    gradient: 'bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-950',
    accent: 'text-emerald-400',
    eyebrow: 'Čišćenje i održavanje',
  },
  'Dvorište, bašta i okolica': {
    gradient: 'bg-gradient-to-br from-green-950 via-emerald-900 to-teal-950',
    accent: 'text-green-400',
    eyebrow: 'Bašta, dvorište i eksterijer',
  },
  'Metalne konstrukcije i zavarivanje': {
    gradient: 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950',
    accent: 'text-blue-400',
    eyebrow: 'Metalne konstrukcije',
  },
  'Selidbe i prevoz': {
    gradient: 'bg-gradient-to-br from-slate-900 via-orange-950 to-amber-950',
    accent: 'text-orange-400',
    eyebrow: 'Selidbe i transport',
  },
  'Auto usluge': {
    gradient: 'bg-gradient-to-br from-slate-900 via-red-950 to-slate-950',
    accent: 'text-red-400',
    eyebrow: 'Auto servisi i usluge',
  },
  'Projektovanje i dizajn': {
    gradient: 'bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950',
    accent: 'text-violet-400',
    eyebrow: 'Arhitektura i dizajn',
  },
  Ostalo: {
    gradient: 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950',
    accent: 'text-gray-400',
    eyebrow: 'Ostale usluge',
  },
};

export function getGroupHeroStyle(group?: string): HeroStyle {
  return groupStyles[group || 'Ostalo'] || groupStyles.Ostalo;
}

export interface PageHeroPreset {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  gradient?: string;
  icon?: LucideIcon;
  image?: string;
}
