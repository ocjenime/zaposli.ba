/* Animirana scena kako rade firme i majstori na Zaposli.ba — 4 koraka */

const INK = '#021117';
const ORANGE = '#F97316';
const ORANGE_LIGHT = '#FFF7ED';
const CLOUD = '#F0FAFC';
const STEEL = '#64748B';
const WHITE = '#FFFFFF';
const GREEN = '#22C55E';
const YELLOW = '#FACC15';
const SKIN = '#E8B89A';
const BLUE = '#38BDF8';

export function FirmProcessAnimation() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <svg
        viewBox="0 0 1100 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-labelledby="firm-title"
        role="img"
      >
        <title id="firm-title">
          Kako funkcioniše za firme i majstore: 1. Registruj se, 2. Pronađi posao, 3. Pošalji
          ponudu, 4. Zaradi
        </title>

        {/* Pozadinski okruženje za svaki korak */}
        <circle cx="150" cy="120" r="108" fill={CLOUD} opacity="0.9" />
        <circle cx="390" cy="120" r="108" fill={CLOUD} opacity="0.9" />
        <circle cx="630" cy="120" r="108" fill={CLOUD} opacity="0.9" />
        <circle cx="870" cy="120" r="108" fill={CLOUD} opacity="0.9" />

        {/* Dekorativni akcenti */}
        <circle cx="100" cy="90" r="8" fill={ORANGE_LIGHT} />
        <circle cx="1020" cy="80" r="10" fill={ORANGE_LIGHT} />
        <rect x="350" y="72" width="24" height="24" rx="6" fill={ORANGE_LIGHT} transform="rotate(12 362 84)" />
        <rect x="590" y="78" width="20" height="20" rx="5" fill={ORANGE_LIGHT} transform="rotate(-8 600 88)" />

        {/* Linija vremenske ose */}
        <line x1="220" y1="120" x2="320" y2="120" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 6" />
        <line x1="460" y1="120" x2="560" y2="120" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 6" />
        <line x1="700" y1="120" x2="800" y2="120" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 6" />

        {/* Pokretni markeri */}
        <g className="anim-timeline-dot">
          <circle cx="270" cy="120" r="5" fill={ORANGE} opacity="0.85" />
        </g>
        <g className="anim-timeline-dot anim-timeline-dot-delay">
          <circle cx="510" cy="120" r="5" fill={ORANGE} opacity="0.85" />
        </g>
        <g className="anim-timeline-dot anim-timeline-dot-delay-2">
          <circle cx="750" cy="120" r="5" fill={ORANGE} opacity="0.85" />
        </g>

        {/* Strelica 1 */}
        <path d="M308 120 L320 120" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M314 115 L320 120 L314 125" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Strelica 2 */}
        <path d="M548 120 L560 120" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M554 115 L560 120 L554 125" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Strelica 3 */}
        <path d="M788 120 L800 120" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M794 115 L800 120 L794 125" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* ========== KORAK 1: REGISTRUJ SE ========== */}
        <g>
          {/* Majstor sa šlemom i kliještima */}
          <g className="anim-float-subtle">
            {/* Telo — radna odjeća */}
            <rect x="116" y="116" width="42" height="54" rx="12" fill={ORANGE} stroke={INK} strokeWidth="2" />
            {/* Pregrada na kombinezonu */}
            <rect x="116" y="140" width="42" height="6" rx="1" fill={INK} opacity="0.15" />
            {/* Vrat */}
            <rect x="133" y="106" width="8" height="12" rx="3" fill={SKIN} />
            {/* Glava */}
            <circle cx="137" cy="96" r="16" fill={SKIN} stroke={INK} strokeWidth="2" />
            {/* Šlem */}
            <path d="M117 88 C117 72 138 68 157 78 C153 66 135 62 123 70 C111 78 113 88 117 88" fill={INK} />
            <rect x="118" y="86" width="38" height="6" rx="3" fill={STEEL} />
            {/* Oči */}
            <circle cx="132" cy="96" r="2" fill={INK} />
            <circle cx="144" cy="96" r="2" fill={INK} />
            {/* Osmiјeh */}
            <path d="M132 106 Q138 110 144 106" stroke={INK} strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* Ruka */}
            <rect x="100" y="128" width="8" height="18" rx="4" fill={SKIN} stroke={INK} strokeWidth="1.5" />
            {/* Kliješta u ruci */}
            <g transform="rotate(-25 98 148)">
              <rect x="94" y="140" width="5" height="22" rx="2" fill={STEEL} stroke={INK} strokeWidth="1.5" />
              <circle cx="96.5" cy="138" r="4" fill={STEEL} stroke={INK} strokeWidth="1.5" />
            </g>
          </g>

          {/* Clipboard sa profilom */}
          <g transform="translate(170, 94)">
            <rect x="0" y="0" width="52" height="72" rx="8" fill={WHITE} stroke={INK} strokeWidth="2" />
            <rect x="-6" y="-8" width="64" height="12" rx="4" fill={ORANGE} stroke={INK} strokeWidth="2" />
            {/* Profilna slika */}
            <circle cx="18" cy="24" r="10" fill={ORANGE_LIGHT} stroke={INK} strokeWidth="1.5" />
            <circle cx="18" cy="20" r="4" fill={INK} opacity="0.2" />
            <path d="M10 30 Q18 34 26 30" stroke={INK} strokeWidth="1.5" fill="none" opacity="0.2" />
            {/* Linije teksta */}
            <rect x="32" y="18" width="14" height="4" rx="2" fill={STEEL} />
            <rect x="32" y="26" width="10" height="4" rx="2" fill={STEEL} />
            <rect x="10" y="44" width="34" height="4" rx="2" fill={ORANGE_LIGHT} />
            <rect x="10" y="52" width="28" height="4" rx="2" fill={ORANGE_LIGHT} />
            <rect x="10" y="60" width="22" height="4" rx="2" fill={ORANGE_LIGHT} />
            {/* Olovka */}
            <rect x="48" y="58" width="6" height="28" rx="2" fill="#94A3B8" stroke={INK} strokeWidth="1.5" transform="rotate(-45 51 72)" />
          </g>

          {/* Badge sa brojem 1 */}
          <g>
            <circle cx="106" cy="78" r="14" fill={ORANGE} stroke={WHITE} strokeWidth="2" />
            <text x="106" y="83" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="12" fontWeight="800" fill={WHITE}>1</text>
          </g>
        </g>

        <text x="150" y="222" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="12" fontWeight="700" fill={INK} letterSpacing="0.05em">REGISTRUJ SE</text>
        <text x="150" y="240" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="10" fill={STEEL}>Profil firme/majstora</text>

        {/* ========== KORAK 2: PRONAĐI POSAO ========== */}
        <g>
          {/* Telefon sa notifikacijama i oglasom */}
          <g className="anim-float-subtle">
            <rect x="342" y="72" width="40" height="72" rx="8" fill={WHITE} stroke={INK} strokeWidth="2" />
            <rect x="346" y="82" width="32" height="52" rx="4" fill={CLOUD} />
            {/* Header oglasa */}
            <rect x="348" y="88" width="28" height="10" rx="3" fill={INK} />
            <rect x="350" y="90" width="8" height="6" rx="1" fill={WHITE} opacity="0.3" />
            {/* Notifikacija na telefonu */}
            <rect x="348" y="104" width="28" height="32" rx="6" fill={ORANGE_LIGHT} stroke={ORANGE} strokeWidth="1.5" />
            <circle cx="362" cy="114" r="5" fill={ORANGE} />
            <path d="M359 114 L361 116 L365 112" stroke={WHITE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="353" y="124" width="18" height="3" rx="1.5" fill={STEEL} />
            <rect x="353" y="130" width="12" height="3" rx="1.5" fill={STEEL} />
            {/* Ping */}
            <circle cx="362" cy="72" r="8" fill={ORANGE} className="anim-ping-ring" />
            <circle cx="362" cy="72" r="6" fill={ORANGE} />
          </g>

          {/* Majstor gleda telefon */}
          <g className="anim-float-subtle">
            <rect x="300" y="132" width="22" height="34" rx="8" fill={ORANGE} stroke={INK} strokeWidth="2" />
            <rect x="307" y="124" width="8" height="10" rx="3" fill={SKIN} />
            <circle cx="311" cy="116" r="10" fill={SKIN} stroke={INK} strokeWidth="2" />
            <path d="M299 110 C299 98 312 96 323 102 C321 94 309 92 302 98 C295 104 297 112 299 110" fill={INK} />
            <circle cx="308" cy="116" r="1.5" fill={INK} />
            <circle cx="316" cy="116" r="1.5" fill={INK} />
            <path d="M308 122 Q312 125 316 122" stroke={INK} strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <rect x="282" y="138" width="6" height="14" rx="3" fill={SKIN} stroke={INK} strokeWidth="1.5" />
          </g>

          {/* Kartica oglasa pored */}
          <g className="anim-float-subtle" transform="translate(0, 0)">
            <rect x="400" y="92" width="56" height="64" rx="8" fill={WHITE} stroke={INK} strokeWidth="2" />
            <rect x="406" y="100" width="16" height="16" rx="4" fill={ORANGE_LIGHT} />
            <rect x="426" y="102" width="24" height="4" rx="2" fill={INK} />
            <rect x="426" y="110" width="18" height="4" rx="2" fill={STEEL} />
            <rect x="406" y="124" width="44" height="4" rx="2" fill={ORANGE_LIGHT} />
            <rect x="406" y="132" width="36" height="4" rx="2" fill={ORANGE_LIGHT} />
            <rect x="406" y="144" width="28" height="10" rx="5" fill={ORANGE} />
            <text x="420" y="152" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="7" fontWeight="700" fill={WHITE}>NOVO</text>
          </g>

          {/* Badge sa brojem 2 */}
          <g>
            <circle cx="334" cy="78" r="14" fill={ORANGE} stroke={WHITE} strokeWidth="2" />
            <text x="334" y="83" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="12" fontWeight="800" fill={WHITE}>2</text>
          </g>
        </g>

        <text x="390" y="222" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="12" fontWeight="700" fill={INK} letterSpacing="0.05em">PRONAĐI POSAO</text>
        <text x="390" y="240" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="10" fill={STEEL}>Dobijaj notifikacije</text>

        {/* ========== KORAK 3: POŠALJI PONUDU ========== */}
        <g>
          {/* Majstor sa ponudom */}
          <g className="anim-float-subtle">
            <rect x="574" y="112" width="42" height="54" rx="12" fill={ORANGE} stroke={INK} strokeWidth="2" />
            <rect x="591" y="102" width="8" height="12" rx="3" fill={SKIN} />
            <circle cx="595" cy="94" r="16" fill={SKIN} stroke={INK} strokeWidth="2" />
            <path d="M575 86 C575 70 596 66 615 76 C611 64 593 60 581 68 C569 76 571 86 575 86" fill={INK} />
            <rect x="576" y="84" width="38" height="6" rx="3" fill={STEEL} />
            <circle cx="590" cy="94" r="2" fill={INK} />
            <circle cx="602" cy="94" r="2" fill={INK} />
            <path d="M590 104 Q596 108 602 104" stroke={INK} strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <rect x="558" y="126" width="8" height="18" rx="4" fill={SKIN} stroke={INK} strokeWidth="1.5" />
          </g>

          {/* Dokument / ponuda */}
          <g className="anim-float-subtle">
            <rect x="622" y="86" width="60" height="72" rx="8" fill={WHITE} stroke={INK} strokeWidth="2" />
            <rect x="628" y="96" width="48" height="6" rx="2" fill={INK} />
            <rect x="628" y="108" width="36" height="4" rx="2" fill={STEEL} />
            <rect x="628" y="116" width="40" height="4" rx="2" fill={STEEL} />
            <rect x="628" y="128" width="24" height="4" rx="2" fill={ORANGE_LIGHT} />
            <rect x="628" y="136" width="30" height="4" rx="2" fill={ORANGE_LIGHT} />
            {/* Iznos */}
            <rect x="628" y="146" width="48" height="12" rx="4" fill={ORANGE} />
            <text x="652" y="155" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="8" fontWeight="800" fill={WHITE}>500 KM</text>
            {/* Pečat */}
            <circle cx="664" cy="102" r="10" fill={GREEN} stroke={WHITE} strokeWidth="2" />
            <path d="M658 102 L662 107 L670 98" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Badge sa brojem 3 */}
          <g>
            <circle cx="574" cy="78" r="14" fill={ORANGE} stroke={WHITE} strokeWidth="2" />
            <text x="574" y="83" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="12" fontWeight="800" fill={WHITE}>3</text>
          </g>
        </g>

        <text x="630" y="222" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="12" fontWeight="700" fill={INK} letterSpacing="0.05em">POŠALJI PONUDU</text>
        <text x="630" y="240" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="10" fill={STEEL}>Brzo i jednostavno</text>

        {/* ========== KORAK 4: ZARADI ========== */}
        <g>
          {/* Majstor sa novčanikom i kešom */}
          <g className="anim-float-subtle">
            <rect x="814" y="112" width="42" height="54" rx="12" fill={ORANGE} stroke={INK} strokeWidth="2" />
            <rect x="831" y="102" width="8" height="12" rx="3" fill={SKIN} />
            <circle cx="835" cy="94" r="16" fill={SKIN} stroke={INK} strokeWidth="2" />
            <path d="M815 86 C815 70 836 66 855 76 C851 64 833 60 821 68 C809 76 811 86 815 86" fill={INK} />
            <rect x="816" y="84" width="38" height="6" rx="3" fill={STEEL} />
            <circle cx="830" cy="94" r="2" fill={INK} />
            <circle cx="842" cy="94" r="2" fill={INK} />
            <path d="M830 104 Q836 108 842 104" stroke={INK} strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <rect x="798" y="126" width="8" height="18" rx="4" fill={SKIN} stroke={INK} strokeWidth="1.5" />
            <rect x="800" y="138" width="14" height="20" rx="4" fill={WHITE} stroke={INK} strokeWidth="2" transform="rotate(-15 807 148)" />
            <rect x="802" y="142" width="10" height="10" rx="2" fill={GREEN} transform="rotate(-15 807 148)" />
          </g>

          {/* Novčanik */}
          <g className="anim-float-subtle">
            <rect x="860" y="98" width="66" height="44" rx="10" fill={INK} stroke={INK} strokeWidth="2" />
            <rect x="864" y="106" width="58" height="28" rx="6" fill={WHITE} />
            <circle cx="912" cy="120" r="6" fill={INK} />
            <rect x="872" y="114" width="34" height="6" rx="2" fill={ORANGE} />
            <rect x="872" y="124" width="22" height="5" rx="2" fill={ORANGE_LIGHT} />
            <text x="890" y="122" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="8" fontWeight="700" fill={WHITE}>KM</text>
          </g>

          {/* Keš novčanice */}
          <g className="anim-cash-float">
            <rect x="942" y="96" width="28" height="16" rx="3" fill={GREEN} stroke={INK} strokeWidth="1.5" />
            <circle cx="956" cy="104" r="4" fill={WHITE} opacity="0.4" />
            <text x="956" y="108" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="8" fontWeight="700" fill={WHITE}>KM</text>
          </g>
          <g className="anim-cash-float anim-cash-float-delay">
            <rect x="930" y="124" width="24" height="14" rx="3" fill={YELLOW} stroke={INK} strokeWidth="1.5" />
            <circle cx="942" cy="131" r="3" fill={INK} opacity="0.2" />
          </g>
          <g className="anim-cash-float anim-cash-float-delay-2">
            <rect x="948" y="142" width="26" height="14" rx="3" fill={GREEN} stroke={INK} strokeWidth="1.5" />
            <circle cx="961" cy="149" r="3" fill={WHITE} opacity="0.4" />
            <text x="961" y="152" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="6" fontWeight="700" fill={WHITE}>KM</text>
          </g>

          {/* Zvjezdica / ocjena */}
          <g className="anim-check-pop">
            <circle cx="958" cy="80" r="14" fill={YELLOW} stroke={INK} strokeWidth="2" />
            <path d="M958 70 L961 80 L972 80 L963 86 L966 96 L958 90 L950 96 L953 86 L944 80 L955 80 Z" fill={INK} />
          </g>

          {/* Check badge */}
          <g className="anim-check-pop">
            <circle cx="800" cy="112" r="12" fill={GREEN} stroke={WHITE} strokeWidth="2.5" />
            <path d="M795 112 L798 116 L805 109" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Badge sa brojem 4 */}
          <g>
            <circle cx="814" cy="78" r="14" fill={ORANGE} stroke={WHITE} strokeWidth="2" />
            <text x="814" y="83" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="12" fontWeight="800" fill={WHITE}>4</text>
          </g>
        </g>

        <text x="870" y="222" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="12" fontWeight="700" fill={INK} letterSpacing="0.05em">ZARADI</text>
        <text x="870" y="240" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="10" fill={STEEL}>Keš + ocjene</text>
      </svg>
    </div>
  );
}
