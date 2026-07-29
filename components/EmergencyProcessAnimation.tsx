/* Animirana scena hitne intervencije — custom SVG samo za /kategorije/hitne-intervencije */

const SKIN = '#d4a574';
const INK = '#021117';
const RED = '#DC2626';
const ORANGE = '#F97316';
const CLOUD = '#F0FAFC';
const WATER = '#60A5FA';

export function EmergencyProcessAnimation() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <svg viewBox="0 0 720 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        {/* Pozadinski krugovi za svaki korak */}
        <circle cx="120" cy="110" r="90" fill={CLOUD} />
        <circle cx="360" cy="110" r="90" fill={CLOUD} />
        <circle cx="600" cy="110" r="90" fill={CLOUD} />

        {/* Strelica 1 */}
        <path d="M230 110 L290 110" stroke="#E5E7EB" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" />
        <path d="M280 104 L290 110 L280 116" fill="#E5E7EB" />

        {/* Strelica 2 */}
        <path d="M470 110 L530 110" stroke="#E5E7EB" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" />
        <path d="M520 104 L530 110 L520 116" fill="#E5E7EB" />

        {/* === KORAK 1: Problem === */}
        {/* Kuća sa prozorom */}
        <g>
          <polygon points="70,130 120,90 170,130" fill={INK} />
          <rect x="82" y="130" width="76" height="52" rx="4" fill={INK} />
          <rect x="95" y="145" width="22" height="22" rx="2" fill="#fff" />
          <rect x="125" y="145" width="22" height="22" rx="2" fill="#fff" />
          {/* Voda curi iz prozora */}
          <path d="M125 155 Q125 170 132 175" stroke={WATER} strokeWidth="4" strokeLinecap="round" fill="none" className="anim-water-drop" />
          <ellipse cx="132" cy="178" rx="5" ry="3" fill={WATER} className="anim-water-drop" />
        </g>

        {/* Osoba panično drži telefon */}
        <g className="anim-shake-soft">
          <circle cx="160" cy="82" r="11" fill={SKIN} />
          <path d="M149 79a11 11 0 0 1 22 0Z" fill={INK} />
          <circle cx="156" cy="82" r="1.5" fill={INK} />
          <circle cx="164" cy="82" r="1.5" fill={INK} />
          <path d="M154 87q6 -4 12 0" stroke={INK} strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <rect x="150" y="94" width="22" height="28" rx="7" fill={INK} />
          <rect x="152" y="122" width="7" height="18" rx="3.5" fill={INK} />
          <rect x="161" y="122" width="7" height="18" rx="3.5" fill={INK} />
          {/* Ruka sa telefonom */}
          <rect x="138" y="98" width="14" height="7" rx="3.5" fill={INK} transform="rotate(-20 145 102)" />
          <rect x="136" y="94" width="10" height="16" rx="2" fill={ORANGE} transform="rotate(-20 141 102)" />
        </g>

        {/* Sirena */}
        <g className="anim-siren-flash">
          <path d="M60 78 L48 58 M60 78 L72 58 M60 78 L60 54" stroke={RED} strokeWidth="3" strokeLinecap="round" />
          <rect x="52" y="78" width="16" height="12" rx="3" fill={RED} />
          <circle cx="60" cy="72" r="9" fill={RED} opacity="0.3" className="anim-ping-dot" />
        </g>

        {/* 24/7 */}
        <text x="120" y="200" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fontWeight="800" fill={INK}>PROBLEM</text>

        {/* === KORAK 2: Odgovor === */}
        {/* Telefon sa notifikacijom */}
        <g className="anim-wiggle">
          <rect x="318" y="62" width="34" height="58" rx="6" fill={INK} />
          <rect x="322" y="68" width="26" height="46" rx="3" fill="#fff" />
          {/* Notifikacija */}
          <rect x="326" y="78" width="18" height="24" rx="3" fill={RED} />
          <path d="M331 86 L339 86 M331 92 L337 92" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          {/* Ping */}
          <circle cx="335" cy="62" r="7" fill={RED} className="anim-ping-dot" />
        </g>

        {/* Majstor koji kreće */}
        <g className="anim-rush">
          <circle cx="400" cy="78" r="12" fill={SKIN} />
          <path d="M388 75a12 12 0 0 1 24 0Z" fill={ORANGE} />
          <circle cx="396" cy="78" r="1.6" fill={INK} />
          <circle cx="404" cy="78" r="1.6" fill={INK} />
          <path d="M396 83q4 3 8 0" stroke={INK} strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <rect x="388" y="92" width="26" height="32" rx="8" fill={ORANGE} />
          <rect x="392" y="124" width="7" height="20" rx="3.5" fill={INK} />
          <rect x="401" y="124" width="7" height="20" rx="3.5" fill={INK} />
          {/* Aktivni korak / brzina */}
          <path d="M370 132 L382 132" stroke="#E5E7EB" strokeWidth="3" strokeLinecap="round" className="anim-speed-line" />
          <path d="M374 140 L386 140" stroke="#E5E7EB" strokeWidth="3" strokeLinecap="round" className="anim-speed-line" />
          {/* Toolbox */}
          <rect x="408" y="106" width="16" height="12" rx="2" fill={INK} />
          <rect x="412" y="104" width="8" height="3" rx="1.5" fill={INK} />
        </g>

        <text x="360" y="200" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fontWeight="800" fill={INK}>ODGOVOR</text>

        {/* === KORAK 3: Dolazak === */}
        {/* Vrata */}
        <g>
          <rect x="548" y="62" width="56" height="96" rx="4" fill={INK} />
          <rect x="556" y="72" width="40" height="76" rx="2" fill="#fff" />
          <circle cx="588" cy="112" r="3" fill={INK} />
        </g>

        {/* Majstor na vratima sa alatom */}
        <g className="anim-float-soft">
          <circle cx="630" cy="82" r="12" fill={SKIN} />
          <path d="M618 79a12 12 0 0 1 24 0Z" fill={ORANGE} />
          <circle cx="626" cy="82" r="1.6" fill={INK} />
          <circle cx="634" cy="82" r="1.6" fill={INK} />
          <path d="M626 87q4 3 8 0" stroke={INK} strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <rect x="618" y="96" width="26" height="34" rx="8" fill={ORANGE} />
          <rect x="622" y="130" width="7" height="18" rx="3.5" fill={INK} />
          <rect x="631" y="130" width="7" height="18" rx="3.5" fill={INK} />
          {/* Alat u ruci */}
          <rect x="602" y="100" width="6" height="28" rx="2" fill="#9CA3AF" transform="rotate(-30 605 114)" />
          <rect x="594" y="96" width="10" height="10" rx="2" fill={INK} transform="rotate(-30 599 101)" />
        </g>

        {/* Check badge */}
        <g className="anim-pop">
          <circle cx="576" cy="52" r="12" fill={ORANGE} stroke="#fff" strokeWidth="2" />
          <path d="M570 53 L574 57 L582 48" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        <text x="600" y="200" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fontWeight="800" fill={INK}>RIJEŠENO</text>
      </svg>
    </div>
  );
}
