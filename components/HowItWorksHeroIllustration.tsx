/* Premium animated hero illustration for /kako-funkcionise/ */

const SKIN = '#E8C39E';
const SKIN_DARK = '#D4A574';
const INK = '#0F172A';
const ORANGE = '#F97316';
const ORANGE_LIGHT = '#FDBA74';
const AMBER = '#F59E0B';
const CLOUD = '#F0F9FF';
const WHITE = '#FFFFFF';

export function HowItWorksHeroIllustration() {
  return (
    <svg
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Soft ambient background glow */}
      <circle cx="220" cy="110" r="90" fill={ORANGE} opacity="0.08" className="anim-pulse-slow" />
      <circle cx="220" cy="110" r="70" fill={AMBER} opacity="0.06" />

      {/* Floating tool — wrench */}
      <g className="anim-float-soft" style={{ animationDelay: '0.2s' }}>
        <rect x="40" y="80" width="12" height="52" rx="6" fill={AMBER} transform="rotate(-25 46 106)" />
        <circle cx="42" cy="84" r="10" fill={AMBER} />
        <circle cx="50" cy="84" r="10" fill={AMBER} />
        <circle cx="42" cy="84" r="4" fill={INK} />
        <circle cx="50" cy="84" r="4" fill={INK} />
      </g>

      {/* Floating checklist card */}
      <g className="anim-float-soft" style={{ animationDelay: '0.6s' }}>
        <rect x="28" y="165" width="78" height="62" rx="12" fill={WHITE} stroke="#E5E7EB" strokeWidth="2" />
        <rect x="42" y="182" width="34" height="5" rx="2.5" fill="#E5E7EB" />
        <rect x="42" y="194" width="26" height="5" rx="2.5" fill="#E5E7EB" />
        <rect x="42" y="206" width="30" height="5" rx="2.5" fill="#E5E7EB" />
        <circle cx="36" cy="185" r="4" fill={ORANGE} />
        <circle cx="36" cy="197" r="4" fill={ORANGE} />
        <circle cx="36" cy="209" r="4" fill={ORANGE} />
      </g>

      {/* Floating verified badge */}
      <g className="anim-pop" style={{ animationDelay: '0.4s' }}>
        <circle cx="260" cy="210" r="22" fill={ORANGE} />
        <circle cx="260" cy="210" r="18" fill={WHITE} />
        <path d="M252 210l5.5 5.5l10.5-10.5" stroke={ORANGE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Main character — professional worker */}
      <g className="anim-float-soft" style={{ animationDelay: '0.1s' }}>
        {/* Hard hat */}
        <path d="M175 55c0-16 18-24 36-24s36 8 36 24v8c0 3-2 5-5 5h-62c-3 0-5-2-5-5v-8Z" fill={AMBER} />
        <rect x="168" y="62" width="86" height="10" rx="5" fill={AMBER} />
        <rect x="205" y="38" width="12" height="12" rx="2" fill={AMBER} />

        {/* Face */}
        <circle cx="211" cy="88" r="22" fill={SKIN} />
        <circle cx="204" cy="86" r="2.5" fill={INK} />
        <circle cx="218" cy="86" r="2.5" fill={INK} />
        <path d="M202 96q9 5 18 0" stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Neck */}
        <rect x="203" y="108" width="16" height="12" rx="4" fill={SKIN_DARK} />

        {/* Body — orange safety vest */}
        <rect x="176" y="118" width="70" height="70" rx="18" fill={ORANGE} />
        <rect x="196" y="118" width="30" height="70" rx="4" fill={ORANGE_LIGHT} opacity="0.5" />
        <rect x="200" y="122" width="22" height="66" rx="2" fill={WHITE} opacity="0.25" />
        <rect x="186" y="178" width="50" height="10" rx="5" fill={INK} opacity="0.15" />

        {/* Reflective strips */}
        <rect x="180" y="142" width="62" height="6" rx="3" fill={WHITE} opacity="0.6" />
        <rect x="184" y="162" width="54" height="6" rx="3" fill={WHITE} opacity="0.6" />

        {/* Arms */}
        <rect x="160" y="128" width="22" height="10" rx="5" fill={SKIN} transform="rotate(-20 171 133)" />
        <rect x="240" y="128" width="22" height="10" rx="5" fill={SKIN} transform="rotate(20 251 133)" />

        {/* Hands */}
        <circle cx="155" cy="143" r="7" fill={SKIN_DARK} />
        <circle cx="267" cy="143" r="7" fill={SKIN_DARK} />

        {/* Legs */}
        <rect x="188" y="186" width="18" height="44" rx="6" fill={INK} />
        <rect x="216" y="186" width="18" height="44" rx="6" fill={INK} />
      </g>

      {/* Floating hammer */}
      <g className="anim-float-soft" style={{ animationDelay: '0.8s' }}>
        <rect x="270" y="95" width="10" height="42" rx="5" fill={INK} transform="rotate(35 275 116)" />
        <rect x="258" y="82" width="34" height="16" rx="4" fill={INK} transform="rotate(35 275 90)" />
      </g>

      {/* Small decorative sparkles */}
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d="M0 -5 L1.3 -1.6 L5 -1.5 L2.2 0.9 L3.2 4.6 L0 2.5 L-3.2 4.6 L-2.2 0.9 L-5 -1.5 L-1.3 -1.6 Z"
          fill={ORANGE}
          opacity="0.5"
          transform={`translate(${120 + i * 38}, ${60 + (i % 2) * 18})`}
          className="anim-pop"
          style={{ animationDelay: `${0.3 + i * 0.2}s` }}
        />
      ))}
    </svg>
  );
}
