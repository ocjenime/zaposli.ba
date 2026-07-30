/* Cartoon ilustracije koraka (werkspot stil): likovi + transform/opacity animacije */

const SKIN = '#d4a574';
const INK = '#021117';
const ORANGE = '#F97316';
const CLOUD = '#F0FAFC';

export function StepOneIllustration() {
  return (
    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="100" cy="75" r="62" fill={CLOUD} />

      {/* Telefon sa poslom */}
      <g className="anim-wiggle">
        <rect x="46" y="32" width="58" height="98" rx="10" fill={INK} />
        <rect x="50" y="38" width="50" height="86" rx="6" fill="#fff" />
        {/* Kućica na ekranu */}
        <polygon points="63,66 75,55 87,66" fill={ORANGE} />
        <rect x="66" y="66" width="18" height="14" rx="2" fill={CLOUD} stroke={ORANGE} strokeWidth="1.5" />
        {/* Linije forme */}
        <rect x="58" y="86" width="34" height="4" rx="2" fill="#E5E7EB" />
        <rect x="58" y="94" width="26" height="4" rx="2" fill="#E5E7EB" />
        {/* KM tag */}
        <rect x="58" y="104" width="22" height="10" rx="5" fill={ORANGE} />
        <text x="69" y="112" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="7" fontWeight="800" fill="#fff">KM</text>
      </g>

      {/* Kupac: osoba */}
      <g className="anim-float-soft">
        {/* Glava */}
        <circle cx="138" cy="56" r="12" fill={SKIN} />
        <path d="M126 53a12 12 0 0 1 24 0Z" fill={INK} />
        <circle cx="134" cy="56" r="1.6" fill={INK} />
        <circle cx="142" cy="56" r="1.6" fill={INK} />
        <path d="M134 62q4 3 8 0" stroke={INK} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Tijelo */}
        <rect x="124" y="70" width="28" height="34" rx="9" fill={INK} />
        {/* Ruka ka telefonu */}
        <rect x="112" y="74" width="16" height="8" rx="4" fill={INK} transform="rotate(-15 120 78)" />
        <circle cx="113" cy="76" r="4" fill={SKIN} />
        {/* Noge */}
        <rect x="128" y="104" width="8" height="22" rx="4" fill={INK} />
        <rect x="140" y="104" width="8" height="22" rx="4" fill={INK} />
      </g>

      {/* Ping na telefonu */}
      <circle cx="98" cy="36" r="8" fill={ORANGE} className="anim-ping-dot" />
      <circle cx="98" cy="36" r="8" fill={ORANGE} />
      <path d="M98 32v8M94 36h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function StepTwoIllustration() {
  return (
    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="100" cy="75" r="62" fill={CLOUD} />

      {/* Majstor 1 (lijevo) */}
      <g className="anim-float-soft" style={{ animationDelay: '0.4s' }}>
        <circle cx="48" cy="66" r="11" fill={SKIN} />
        <path d="M37 63a11 11 0 0 1 22 0Z" fill={ORANGE} />
        <rect x="35" y="61" width="26" height="4" rx="2" fill={ORANGE} />
        <circle cx="45" cy="66" r="1.5" fill={INK} />
        <circle cx="51" cy="66" r="1.5" fill={INK} />
        <path d="M45 71q3 2.5 6 0" stroke={INK} strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <rect x="36" y="79" width="24" height="30" rx="8" fill={ORANGE} />
        <rect x="40" y="109" width="7" height="18" rx="3.5" fill={INK} />
        <rect x="49" y="109" width="7" height="18" rx="3.5" fill={INK} />
      </g>

      {/* Majstor 2 (desno) */}
      <g className="anim-float-soft" style={{ animationDelay: '1.2s' }}>
        <circle cx="152" cy="66" r="11" fill={SKIN} />
        <path d="M141 63a11 11 0 0 1 22 0Z" fill={ORANGE} />
        <rect x="139" y="61" width="26" height="4" rx="2" fill={ORANGE} />
        <circle cx="149" cy="66" r="1.5" fill={INK} />
        <circle cx="155" cy="66" r="1.5" fill={INK} />
        <path d="M149 71q3 2.5 6 0" stroke={INK} strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <rect x="140" y="79" width="24" height="30" rx="8" fill={ORANGE} />
        <rect x="144" y="109" width="7" height="18" rx="3.5" fill={INK} />
        <rect x="153" y="109" width="7" height="18" rx="3.5" fill={INK} />
      </g>

      {/* Ponuda 1 */}
      <g className="anim-float-soft" style={{ animationDelay: '0.8s' }}>
        <rect x="66" y="30" width="68" height="40" rx="7" fill="#fff" stroke="#E5E7EB" strokeWidth="2" transform="rotate(-4 100 50)" />
        <circle cx="80" cy="46" r="6" fill={INK} />
        <text x="92" y="44" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="9" fontWeight="800" fill={ORANGE} transform="rotate(-4 92 44)">2.400 KM</text>
        <rect x="92" y="50" width="30" height="4" rx="2" fill="#E5E7EB" transform="rotate(-4 107 52)" />
      </g>

      {/* Ponuda 2 */}
      <g className="anim-float-soft">
        <rect x="72" y="52" width="68" height="40" rx="7" fill="#fff" stroke="#E5E7EB" strokeWidth="2" transform="rotate(3 106 72)" />
        <circle cx="86" cy="68" r="6" fill={INK} />
        <text x="98" y="66" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="9" fontWeight="800" fill={ORANGE} transform="rotate(3 98 66)">2.800 KM</text>
        <rect x="98" y="72" width="30" height="4" rx="2" fill="#E5E7EB" transform="rotate(3 113 74)" />
      </g>

      {/* Notifikacija */}
      <circle cx="106" cy="24" r="9" fill={ORANGE} className="anim-ping-dot" />
      <circle cx="106" cy="24" r="9" fill={ORANGE} />
      <path d="M106 19.5c-2.5 0-4 1.8-4 4v2.2l-1.3 2.2h10.6l-1.3-2.2v-2.2c0-2.2-1.5-4-4-4Z" fill="#fff" />
    </svg>
  );
}

export function StepThreeIllustration() {
  return (
    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="100" cy="75" r="62" fill={CLOUD} />

      {/* Kupac (lijevo) */}
      <g className="anim-float-soft" style={{ animationDelay: '0.5s' }}>
        <circle cx="58" cy="70" r="11" fill={SKIN} />
        <path d="M47 67a11 11 0 0 1 22 0Z" fill={INK} />
        <circle cx="55" cy="70" r="1.5" fill={INK} />
        <circle cx="61" cy="70" r="1.5" fill={INK} />
        <path d="M55 75q3 2.5 6 0" stroke={INK} strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <rect x="46" y="83" width="24" height="30" rx="8" fill={INK} />
        <rect x="50" y="113" width="7" height="16" rx="3.5" fill={INK} />
        <rect x="59" y="113" width="7" height="16" rx="3.5" fill={INK} />
        {/* Ruka ka rukovanju */}
        <rect x="66" y="88" width="18" height="8" rx="4" fill={INK} transform="rotate(12 75 92)" />
      </g>

      {/* Majstor (desno, kaciga) */}
      <g className="anim-float-soft" style={{ animationDelay: '1s' }}>
        <circle cx="142" cy="70" r="11" fill={SKIN} />
        <path d="M131 67a11 11 0 0 1 22 0Z" fill={ORANGE} />
        <rect x="129" y="65" width="26" height="4" rx="2" fill={ORANGE} />
        <circle cx="139" cy="70" r="1.5" fill={INK} />
        <circle cx="145" cy="70" r="1.5" fill={INK} />
        <path d="M139 75q3 2.5 6 0" stroke={INK} strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <rect x="130" y="83" width="24" height="30" rx="8" fill={ORANGE} />
        <rect x="134" y="113" width="7" height="16" rx="3.5" fill={INK} />
        <rect x="143" y="113" width="7" height="16" rx="3.5" fill={INK} />
        {/* Ruka ka rukovanju */}
        <rect x="116" y="88" width="18" height="8" rx="4" fill={ORANGE} transform="rotate(-12 125 92)" />
      </g>

      {/* Rukovanje */}
      <circle cx="100" cy="94" r="5" fill={SKIN} />

      {/* Check badge iznad */}
      <g className="anim-pop">
        <circle cx="100" cy="36" r="14" fill={ORANGE} stroke="#fff" strokeWidth="3" />
        <path d="M93.5 36.5l4.5 4.5l8.5-8.5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Zvjezdice oko badgea */}
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d="M0-4 L1.1-1.3 L4-1.2 L1.8 0.8 L2.6 3.7 L0 2 L-2.6 3.7 L-1.8 0.8 L-4-1.2 L-1.1-1.3 Z"
          fill={ORANGE}
          opacity="0.6"
          transform={`translate(${72 + i * 28}, ${i === 1 ? 14 : 20})`}
        />
      ))}
    </svg>
  );
}
