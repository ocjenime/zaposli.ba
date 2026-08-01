/* Refined step illustrations: clean, modern vector scenes with subtle animations */

const SKIN = '#E8C39E';
const SKIN_DARK = '#D4A574';
const INK = '#0F172A';
const ORANGE = '#F97316';
const ORANGE_LIGHT = '#FDBA74';
const CLOUD = '#F0F9FF';
const WHITE = '#FFFFFF';

export function StepOneIllustration() {
  return (
    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="100" cy="75" r="62" fill={CLOUD} />

      {/* Phone with form */}
      <g className="anim-wiggle">
        <rect x="48" y="34" width="58" height="96" rx="10" fill={INK} />
        <rect x="52" y="40" width="50" height="84" rx="6" fill={WHITE} />
        {/* House icon on screen */}
        <polygon points="65,66 77,55 89,66" fill={ORANGE} />
        <rect x="68" y="66" width="18" height="14" rx="2" fill={CLOUD} stroke={ORANGE} strokeWidth="1.5" />
        {/* Form lines */}
        <rect x="58" y="86" width="34" height="4" rx="2" fill="#E5E7EB" />
        <rect x="58" y="94" width="26" height="4" rx="2" fill="#E5E7EB" />
        <rect x="58" y="104" width="22" height="10" rx="5" fill={ORANGE} />
        <text x="69" y="112" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="7" fontWeight="800" fill="#fff">KM</text>
      </g>

      {/* Person with modern hairstyle */}
      <g className="anim-float-soft">
        {/* Hair - modern, neat style */}
        <path d="M124 45c0-8 6-14 14-14s14 6 14 14v6c0 4-3 7-7 7h-14c-4 0-7-3-7-7v-6Z" fill="#3E2723" />
        <ellipse cx="138" cy="48" rx="13" ry="12" fill="#3E2723" />
        {/* Face */}
        <circle cx="138" cy="58" r="11" fill={SKIN} />
        <circle cx="135" cy="57" r="1.4" fill={INK} />
        <circle cx="141" cy="57" r="1.4" fill={INK} />
        <path d="M134 62q4 2.5 8 0" stroke={INK} strokeWidth="1.4" strokeLinecap="round" fill="none" />
        {/* Body */}
        <rect x="124" y="71" width="28" height="34" rx="9" fill={INK} />
        {/* Arm to phone */}
        <rect x="112" y="75" width="16" height="8" rx="4" fill={INK} transform="rotate(-15 120 79)" />
        <circle cx="113" cy="77" r="4" fill={SKIN} />
        {/* Legs */}
        <rect x="128" y="105" width="8" height="22" rx="4" fill={INK} />
        <rect x="140" y="105" width="8" height="22" rx="4" fill={INK} />
      </g>

      {/* Ping dot on phone */}
      <circle cx="100" cy="38" r="8" fill={ORANGE} className="anim-ping-dot" />
      <circle cx="100" cy="38" r="8" fill={ORANGE} />
      <path d="M100 34v8M96 38h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function StepTwoIllustration() {
  return (
    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="100" cy="75" r="62" fill={CLOUD} />

      {/* Professional 1 (left) */}
      <g className="anim-float-soft" style={{ animationDelay: '0.4s' }}>
        {/* Hair */}
        <ellipse cx="48" cy="60" rx="12" ry="11" fill="#2D3748" />
        <path d="M36 58c0-7 5-12 12-12s12 5 12 12" fill="#2D3748" />
        {/* Face */}
        <circle cx="48" cy="68" r="10" fill={SKIN} />
        <circle cx="45" cy="67" r="1.3" fill={INK} />
        <circle cx="51" cy="67" r="1.3" fill={INK} />
        <path d="M44 72q3 2 6 0" stroke={INK} strokeWidth="1.3" strokeLinecap="round" fill="none" />
        {/* Body */}
        <rect x="36" y="80" width="24" height="30" rx="8" fill={ORANGE} />
        <rect x="40" y="110" width="7" height="18" rx="3.5" fill={INK} />
        <rect x="49" y="110" width="7" height="18" rx="3.5" fill={INK} />
      </g>

      {/* Professional 2 (right) */}
      <g className="anim-float-soft" style={{ animationDelay: '1.2s' }}>
        {/* Hair - short neat style */}
        <ellipse cx="152" cy="60" rx="12" ry="11" fill="#4A3426" />
        <path d="M140 58c0-7 5-12 12-12s12 5 12 12" fill="#4A3426" />
        {/* Face */}
        <circle cx="152" cy="68" r="10" fill={SKIN_DARK} />
        <circle cx="149" cy="67" r="1.3" fill={INK} />
        <circle cx="155" cy="67" r="1.3" fill={INK} />
        <path d="M148 72q3 2 6 0" stroke={INK} strokeWidth="1.3" strokeLinecap="round" fill="none" />
        {/* Body */}
        <rect x="140" y="80" width="24" height="30" rx="8" fill={INK} />
        <rect x="144" y="110" width="7" height="18" rx="3.5" fill={INK} />
        <rect x="153" y="110" width="7" height="18" rx="3.5" fill={INK} />
      </g>

      {/* Bid card 1 */}
      <g className="anim-float-soft" style={{ animationDelay: '0.8s' }}>
        <rect x="66" y="30" width="68" height="40" rx="7" fill={WHITE} stroke="#E5E7EB" strokeWidth="2" transform="rotate(-4 100 50)" />
        <circle cx="80" cy="46" r="6" fill={INK} />
        <text x="92" y="44" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="9" fontWeight="800" fill={ORANGE} transform="rotate(-4 92 44)">PONUDA</text>
        <rect x="92" y="50" width="30" height="4" rx="2" fill="#E5E7EB" transform="rotate(-4 107 52)" />
      </g>

      {/* Bid card 2 */}
      <g className="anim-float-soft">
        <rect x="72" y="52" width="68" height="40" rx="7" fill={WHITE} stroke="#E5E7EB" strokeWidth="2" transform="rotate(3 106 72)" />
        <circle cx="86" cy="68" r="6" fill={INK} />
        <text x="98" y="66" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="9" fontWeight="800" fill={ORANGE} transform="rotate(3 98 66)">PONUDA</text>
        <rect x="98" y="72" width="30" height="4" rx="2" fill="#E5E7EB" transform="rotate(3 113 74)" />
      </g>

      {/* Notification bell */}
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

      {/* Client (left) */}
      <g className="anim-float-soft" style={{ animationDelay: '0.5s' }}>
        {/* Hair */}
        <ellipse cx="58" cy="64" rx="12" ry="11" fill="#5D4037" />
        <path d="M46 62c0-7 5-12 12-12s12 5 12 12" fill="#5D4037" />
        {/* Face */}
        <circle cx="58" cy="72" r="10" fill={SKIN} />
        <circle cx="55" cy="71" r="1.3" fill={INK} />
        <circle cx="61" cy="71" r="1.3" fill={INK} />
        <path d="M54 76q3 2 6 0" stroke={INK} strokeWidth="1.3" strokeLinecap="round" fill="none" />
        {/* Body */}
        <rect x="46" y="84" width="24" height="30" rx="8" fill={INK} />
        <rect x="50" y="114" width="7" height="16" rx="3.5" fill={INK} />
        <rect x="59" y="114" width="7" height="16" rx="3.5" fill={INK} />
        {/* Arm to handshake */}
        <rect x="66" y="88" width="18" height="8" rx="4" fill={INK} transform="rotate(12 75 92)" />
      </g>

      {/* Professional (right) */}
      <g className="anim-float-soft" style={{ animationDelay: '1s' }}>
        {/* Hair - short professional */}
        <ellipse cx="142" cy="64" rx="12" ry="11" fill="#263238" />
        <path d="M130 62c0-7 5-12 12-12s12 5 12 12" fill="#263238" />
        {/* Face */}
        <circle cx="142" cy="72" r="10" fill={SKIN_DARK} />
        <circle cx="139" cy="71" r="1.3" fill={INK} />
        <circle cx="145" cy="71" r="1.3" fill={INK} />
        <path d="M138 76q3 2 6 0" stroke={INK} strokeWidth="1.3" strokeLinecap="round" fill="none" />
        {/* Body */}
        <rect x="130" y="84" width="24" height="30" rx="8" fill={ORANGE} />
        <rect x="134" y="114" width="7" height="16" rx="3.5" fill={INK} />
        <rect x="143" y="114" width="7" height="16" rx="3.5" fill={INK} />
        {/* Arm to handshake */}
        <rect x="116" y="88" width="18" height="8" rx="4" fill={ORANGE} transform="rotate(-12 125 92)" />
      </g>

      {/* Handshake */}
      <circle cx="100" cy="96" r="5" fill={SKIN} />

      {/* Check badge */}
      <g className="anim-pop">
        <circle cx="100" cy="36" r="14" fill={ORANGE} stroke="#fff" strokeWidth="3" />
        <path d="M93.5 36.5l4.5 4.5l8.5-8.5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Sparkles */}
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
