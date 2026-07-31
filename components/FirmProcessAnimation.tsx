/* Animirana scena kako rade firme/majstori na Zaposli.ba */

const INK = '#021117';
const ORANGE = '#F97316';
const ORANGE_LIGHT = '#FFF7ED';
const CLOUD = '#F0FAFC';
const STEEL = '#64748B';
const WHITE = '#FFFFFF';
const GREEN = '#22C55E';
const YELLOW = '#FACC15';
const SKIN = '#E8B89A';

export function FirmProcessAnimation() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <svg
        viewBox="0 0 900 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-labelledby="firm-title"
        role="img"
      >
        <title id="firm-title">Kako funkcioniše za firme i majstore: registruj se, pronađi posao, zaradi</title>

        {/* Pozadinski okruženje za svaki korak */}
        <circle cx="170" cy="120" r="108" fill={CLOUD} opacity="0.9" />
        <circle cx="450" cy="120" r="108" fill={CLOUD} opacity="0.9" />
        <circle cx="730" cy="120" r="108" fill={CLOUD} opacity="0.9" />

        {/* Dekorativni akcenti */}
        <circle cx="120" cy="90" r="8" fill={ORANGE_LIGHT} />
        <circle cx="800" cy="80" r="10" fill={ORANGE_LIGHT} />
        <rect x="390" y="72" width="24" height="24" rx="6" fill={ORANGE_LIGHT} transform="rotate(12 402 84)" />

        {/* Linija vremenske ose */}
        <line x1="240" y1="120" x2="380" y2="120" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 6" />
        <line x1="520" y1="120" x2="660" y2="120" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 6" />

        {/* Pokretni markeri */}
        <g className="anim-timeline-dot">
          <circle cx="310" cy="120" r="5" fill={ORANGE} opacity="0.85" />
        </g>
        <g className="anim-timeline-dot anim-timeline-dot-delay">
          <circle cx="590" cy="120" r="5" fill={ORANGE} opacity="0.85" />
        </g>

        {/* Strelica 1 */}
        <path d="M366 120 L378 120" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M372 115 L378 120 L372 125" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Strelica 2 */}
        <path d="M646 120 L658 120" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M652 115 L658 120 L652 125" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* ========== KORAK 1: REGISTRUJ SE ========== */}
        <g>
          {/* Osoba koja popunjava formu */}
          <g className="anim-float-subtle">
            {/* Telo */}
            <rect x="140" y="112" width="32" height="48" rx="12" fill={ORANGE} stroke={INK} strokeWidth="2" />
            {/* Vrat */}
            <rect x="152" y="104" width="8" height="12" rx="3" fill={SKIN} />
            {/* Glava */}
            <circle cx="156" cy="96" r="14" fill={SKIN} stroke={INK} strokeWidth="2" />
            {/* Kosa / kaciga */}
            <path d="M140 94 C140 80 154 78 170 84 C168 76 154 72 144 78 C134 84 136 94 140 94" fill={INK} />
            {/* Oči */}
            <circle cx="152" cy="96" r="2" fill={INK} />
            <circle cx="162" cy="96" r="2" fill={INK} />
            {/* Osmiјeh */}
            <path d="M152 104 Q157 108 162 104" stroke={INK} strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* Ruka */}
            <rect x="126" y="122" width="8" height="18" rx="4" fill={SKIN} stroke={INK} strokeWidth="1.5" />
          </g>

          {/* Clipboard sa profilom */}
          <g transform="translate(180, 98)">
            <rect x="0" y="0" width="48" height="64" rx="8" fill={WHITE} stroke={INK} strokeWidth="2" />
            <rect x="-6" y="-8" width="60" height="12" rx="4" fill={ORANGE} stroke={INK} strokeWidth="2" />
            <circle cx="10" cy="22" r="8" fill={ORANGE_LIGHT} stroke={INK} strokeWidth="1.5" />
            <rect x="22" y="16" width="18" height="4" rx="2" fill={STEEL} />
            <rect x="22" y="24" width="14" height="4" rx="2" fill={STEEL} />
            <rect x="8" y="40" width="32" height="4" rx="2" fill={ORANGE_LIGHT} />
            <rect x="8" y="48" width="24" height="4" rx="2" fill={ORANGE_LIGHT} />
            {/* Olovka */}
            <rect x="44" y="52" width="6" height="28" rx="2" fill="#94A3B8" stroke={INK} strokeWidth="1.5" transform="rotate(-45 47 66)" />
          </g>

          {/* Alat pored - ključ */}
          <g transform="rotate(-35 120 170)">
            <rect x="116" y="150" width="6" height="28" rx="2" fill="#94A3B8" stroke={INK} strokeWidth="1.5" />
            <circle cx="119" cy="148" r="7" fill="#94A3B8" stroke={INK} strokeWidth="1.5" />
            <circle cx="119" cy="148" r="3" fill={WHITE} />
          </g>
        </g>

        <text x="170" y="210" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="12" fontWeight="700" fill={INK} letterSpacing="0.05em">REGISTRUJ SE</text>
        <text x="170" y="228" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="10" fill={STEEL}>Napravi profil za 5 min</text>

        {/* ========== KORAK 2: PRONAĐI POSAO ========== */}
        <g>
          {/* Telefon sa notifikacijama */}
          <g className="anim-float-subtle">
            <rect x="372" y="72" width="36" height="64" rx="8" fill={WHITE} stroke={INK} strokeWidth="2" />
            <rect x="376" y="80" width="28" height="48" rx="4" fill={CLOUD} />
            {/* Notifikacija */}
            <rect x="378" y="88" width="24" height="32" rx="6" fill={ORANGE_LIGHT} stroke={ORANGE} strokeWidth="1.5" />
            <circle cx="390" cy="98" r="5" fill={ORANGE} />
            <path d="M387 98 L389 100 L393 96" stroke={WHITE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="383" y="108" width="14" height="3" rx="1.5" fill={STEEL} />
            <rect x="383" y="114" width="10" height="3" rx="1.5" fill={STEEL} />
            {/* Ping */}
            <circle cx="390" cy="72" r="8" fill={ORANGE} className="anim-ping-ring" />
            <circle cx="390" cy="72" r="6" fill={ORANGE} />
          </g>

          {/* Majstor sa kutijom alata */}
          <g className="anim-drive-subtle">
            {/* Kutija alata */}
            <rect x="440" y="118" width="88" height="40" rx="8" fill={INK} stroke={INK} strokeWidth="2" />
            <rect x="448" y="126" width="72" height="24" rx="4" fill={WHITE} opacity="0.95" />
            {/* Ručka */}
            <path d="M472 118 L472 110 L496 110 L496 118" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Alati u kutiji */}
            <rect x="456" y="132" width="4" height="14" rx="2" fill={STEEL} />
            <rect x="466" y="130" width="4" height="16" rx="2" fill={STEEL} />
            <rect x="476" y="134" width="4" height="12" rx="2" fill={STEEL} />
            {/* Točkovi kutije */}
            <circle cx="458" cy="160" r="6" fill={WHITE} stroke={INK} strokeWidth="2" />
            <circle cx="458" cy="160" r="3" fill={INK} />
            <circle cx="510" cy="160" r="6" fill={WHITE} stroke={INK} strokeWidth="2" />
            <circle cx="510" cy="160" r="3" fill={INK} />
            {/* Brzinske linije */}
            <path d="M392 146 L408 146" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" className="anim-speed-line" />
            <path d="M386 156 L402 156" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" className="anim-speed-line anim-speed-line-delay" />
          </g>

          {/* Profesionalac pored */}
          <g className="anim-float-subtle">
            <circle cx="536" cy="98" r="12" fill={SKIN} stroke={INK} strokeWidth="2" />
            <path d="M524 94 C524 84 536 82 548 88 C546 80 534 78 528 82 C522 86 522 92 524 94" fill={INK} />
            <circle cx="532" cy="98" r="1.8" fill={INK} />
            <circle cx="540" cy="98" r="1.8" fill={INK} />
            <path d="M532 104 Q536 107 540 104" stroke={INK} strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <rect x="526" y="112" width="20" height="30" rx="8" fill={ORANGE} stroke={INK} strokeWidth="2" />
          </g>
        </g>

        <text x="450" y="210" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="12" fontWeight="700" fill={INK} letterSpacing="0.05em">PRONAĐI POSAO</text>
        <text x="450" y="228" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="10" fill={STEEL}>Dobijaj ponude i odaberi</text>

        {/* ========== KORAK 3: ZARADI ========== */}
        <g>
          {/* Novčanik */}
          <g className="anim-float-subtle">
            <rect x="680" y="96" width="72" height="48" rx="10" fill={INK} stroke={INK} strokeWidth="2" />
            <rect x="684" y="104" width="64" height="32" rx="6" fill={WHITE} />
            <circle cx="742" cy="120" r="6" fill={INK} />
            <rect x="692" y="114" width="36" height="8" rx="2" fill={ORANGE} />
            <rect x="692" y="126" width="24" height="6" rx="2" fill={ORANGE_LIGHT} />
            {/* Znak KM */}
            <text x="710" y="124" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="10" fontWeight="700" fill={WHITE}>KM</text>
          </g>

          {/* Osoba sa zvjezdicom */}
          <g className="anim-float-subtle">
            <rect x="764" y="112" width="28" height="42" rx="12" fill={ORANGE} stroke={INK} strokeWidth="2" />
            <rect x="774" y="104" width="8" height="12" rx="3" fill={SKIN} />
            <circle cx="778" cy="96" r="14" fill={SKIN} stroke={INK} strokeWidth="2" />
            <path d="M764 94 C764 80 778 78 794 84 C792 76 778 72 768 78 C758 84 760 94 764 94" fill={INK} />
            <circle cx="774" cy="96" r="2" fill={INK} />
            <circle cx="784" cy="96" r="2" fill={INK} />
            <path d="M774 104 Q779 108 784 104" stroke={INK} strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <rect x="758" y="122" width="8" height="18" rx="4" fill={SKIN} stroke={INK} strokeWidth="1.5" />
          </g>

          {/* Zvjezdica / ocjena */}
          <g className="anim-check-pop">
            <circle cx="820" cy="80" r="16" fill={YELLOW} stroke={INK} strokeWidth="2" />
            <path d="M820 70 L823 79 L832 79 L825 85 L827 94 L820 88 L813 94 L815 85 L808 79 L817 79 Z" fill={INK} />
          </g>

          {/* Check badge */}
          <g className="anim-check-pop" transform="translate(0, 0)">
            <circle cx="650" cy="116" r="14" fill={GREEN} stroke={WHITE} strokeWidth="2.5" />
            <path d="M644 116 L648 121 L656 113" stroke={WHITE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>

        <text x="730" y="210" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="12" fontWeight="700" fill={INK} letterSpacing="0.05em">ZARADI</text>
        <text x="730" y="228" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="10" fill={STEEL}>Istakni se ocjenama</text>
      </svg>
    </div>
  );
}
