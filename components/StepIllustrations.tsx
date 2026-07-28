/* Animirane ilustracije za 3 koraka — brend stil, transform/opacity animacije */

export function StepOneIllustration() {
  return (
    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Pozadinski krug */}
      <circle cx="100" cy="75" r="62" fill="#F0FAFC" />

      {/* Kartica forme */}
      <rect x="50" y="22" width="100" height="112" rx="10" fill="#fff" stroke="#E5E7EB" strokeWidth="2" />
      <rect x="62" y="36" width="52" height="7" rx="3.5" fill="#021117" />
      <rect x="62" y="51" width="76" height="5" rx="2.5" fill="#E5E7EB" />
      <rect x="62" y="63" width="62" height="5" rx="2.5" fill="#E5E7EB" />

      {/* Foto thumbnail */}
      <rect x="62" y="76" width="36" height="30" rx="6" fill="#dbeff5" stroke="#9fcfdd" strokeWidth="1.5" />
      <circle cx="70" cy="84" r="3" fill="#F97316" />
      <path d="M64 100 L74 89 L82 96 L90 88 L96 100 Z" fill="#9fcfdd" />

      {/* Budžet tag */}
      <rect x="104" y="76" width="34" height="14" rx="7" fill="#F97316" />
      <text x="121" y="86" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="8" fontWeight="800" fill="#fff">KM</text>
      <rect x="104" y="96" width="34" height="5" rx="2.5" fill="#E5E7EB" />

      {/* Olovka — wiggle */}
      <g className="anim-wiggle">
        <rect x="146" y="88" width="7" height="30" rx="3" fill="#F97316" transform="rotate(35 149 103)" />
        <path d="M154.5 116 l4.5 6.5 l2.5 -7.5 Z" fill="#021117" transform="rotate(35 157 117)" />
      </g>

      {/* Upload pin */}
      <circle cx="152" cy="30" r="11" fill="#021117" />
      <circle cx="152" cy="30" r="11" fill="#F97316" className="anim-ping-dot" />
      <path d="M152 25v10M147 30h10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function StepTwoIllustration() {
  return (
    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="100" cy="75" r="62" fill="#F0FAFC" />

      {/* Ponuda 3 (pozadi) */}
      <g className="anim-float-soft" style={{ animationDelay: '1.6s' }}>
        <rect x="28" y="52" width="88" height="58" rx="8" fill="#fff" stroke="#E5E7EB" strokeWidth="2" transform="rotate(-6 72 81)" />
        <circle cx="48" cy="68" r="7" fill="#021117" />
        <rect x="60" y="64" width="34" height="5" rx="2.5" fill="#E5E7EB" transform="rotate(-6 77 66)" />
        <text x="60" y="92" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="800" fill="#F97316" transform="rotate(-6 60 92)">2.400 KM</text>
      </g>

      {/* Ponuda 2 (sredina) */}
      <g className="anim-float-soft" style={{ animationDelay: '0.8s' }}>
        <rect x="82" y="42" width="88" height="58" rx="8" fill="#fff" stroke="#E5E7EB" strokeWidth="2" transform="rotate(4 126 71)" />
        <circle cx="102" cy="58" r="7" fill="#021117" />
        <rect x="114" y="54" width="34" height="5" rx="2.5" fill="#E5E7EB" transform="rotate(4 131 56)" />
        <text x="112" y="82" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="800" fill="#F97316" transform="rotate(4 112 82)">3.100 KM</text>
      </g>

      {/* Ponuda 1 (naprijed) */}
      <g className="anim-float-soft">
        <rect x="56" y="68" width="92" height="60" rx="8" fill="#fff" stroke="#E5E7EB" strokeWidth="2" />
        <circle cx="76" cy="86" r="8" fill="#021117" />
        <circle cx="76" cy="82" r="3" fill="#F97316" />
        <path d="M70 92c1.5-4 10.5-4 12 0" stroke="#F97316" strokeWidth="2.5" fill="none" />
        <rect x="90" y="80" width="40" height="5" rx="2.5" fill="#E5E7EB" />
        <rect x="90" y="90" width="28" height="5" rx="2.5" fill="#E5E7EB" />
        <text x="66" y="118" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fontWeight="800" fill="#F97316">2.800 KM</text>
      </g>

      {/* Notifikacija */}
      <circle cx="160" cy="34" r="10" fill="#F97316" />
      <circle cx="160" cy="34" r="10" fill="#F97316" className="anim-ping-dot" />
      <path d="M160 29c-2.8 0-4.5 2-4.5 4.5v2.5l-1.5 2.5h12l-1.5-2.5v-2.5c0-2.5-1.7-4.5-4.5-4.5Z" fill="#fff" />
    </svg>
  );
}

export function StepThreeIllustration() {
  return (
    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="100" cy="75" r="62" fill="#F0FAFC" />

      {/* Profil kartica */}
      <rect x="52" y="30" width="96" height="98" rx="10" fill="#fff" stroke="#E5E7EB" strokeWidth="2" />

      {/* Avatar sa kacigom */}
      <circle cx="100" cy="60" r="17" fill="#021117" />
      <path d="M84 56a16 16 0 0 1 32 0Z" fill="#F97316" />
      <rect x="82" y="54" width="36" height="5" rx="2.5" fill="#F97316" />
      <circle cx="94" cy="60" r="2" fill="#fff" />
      <circle cx="106" cy="60" r="2" fill="#fff" />
      <path d="M95 67q5 4 10 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Zvjezdice — pop na srednjoj */}
      <g>
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d="M0 -5 L1.4 -1.6 L5 -1.5 L2.2 1 L3.3 4.6 L0 2.6 L-3.3 4.6 L-2.2 1 L-5 -1.5 L-1.4 -1.6 Z"
            fill="#F97316"
            transform={`translate(${80 + i * 10}, 92)`}
            className={i === 2 ? 'anim-pop' : undefined}
          />
        ))}
      </g>

      {/* Dugme */}
      <rect x="66" y="106" width="68" height="14" rx="7" fill="#F97316" />
      <rect x="84" y="111" width="32" height="4" rx="2" fill="#fff" />

      {/* Check badge */}
      <g className="anim-pop">
        <circle cx="142" cy="34" r="12" fill="#F97316" stroke="#fff" strokeWidth="2.5" />
        <path d="M136.5 34.5l3.5 3.5l7 -7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
