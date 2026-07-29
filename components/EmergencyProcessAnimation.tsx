/* Premium animirana scena hitne intervencije — custom SVG za /kategorije/hitne-intervencije */

const INK = '#021117';
const RED = '#DC2626';
const ORANGE = '#F97316';
const ORANGE_LIGHT = '#FFF7ED';
const CLOUD = '#F0FAFC';
const WATER = '#38BDF8';
const SKIN = '#E8B89A';
const STEEL = '#64748B';
const WHITE = '#FFFFFF';

export function EmergencyProcessAnimation() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <svg
        viewBox="0 0 900 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        aria-labelledby="emergency-title"
        role="img"
      >
        <title id="emergency-title">Kako funkcioniše hitna intervencija: problem, odgovor, rješenje</title>

        {/* Pozadinski okruženje za svaki korak */}
        <circle cx="170" cy="120" r="108" fill={CLOUD} opacity="0.9" />
        <circle cx="450" cy="120" r="108" fill={CLOUD} opacity="0.9" />
        <circle cx="730" cy="120" r="108" fill={CLOUD} opacity="0.9" />

        {/* Dekorativni akcenti u pozadini */}
        <circle cx="120" cy="90" r="8" fill={ORANGE_LIGHT} />
        <circle cx="800" cy="80" r="10" fill={ORANGE_LIGHT} />
        <rect x="390" y="72" width="24" height="24" rx="6" fill={ORANGE_LIGHT} transform="rotate(12 402 84)" />

        {/* Linija vremenske ose između koraka */}
        <line x1="240" y1="120" x2="380" y2="120" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 6" />
        <line x1="520" y1="120" x2="660" y2="120" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 6" />

        {/* Pokretni markeri na vremenskoj osi */}
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

        {/* ========== KORAK 1: PROBLEM ========== */}
        <g>
          {/* Kuća — moderan, zaobljen oblik */}
          <rect x="98" y="88" width="76" height="74" rx="10" fill={WHITE} stroke={INK} strokeWidth="2" />
          <path d="M96 100 L136 66 L176 100" fill={INK} />
          <rect x="104" y="104" width="20" height="20" rx="4" fill={CLOUD} stroke={INK} strokeWidth="1.5" />
          <rect x="148" y="104" width="20" height="20" rx="4" fill={CLOUD} stroke={INK} strokeWidth="1.5" />
          <rect x="124" y="132" width="24" height="30" rx="5" fill={ORANGE_LIGHT} stroke={INK} strokeWidth="1.5" />
          <circle cx="142" cy="147" r="2" fill={INK} />

          {/* Cijev koja curi */}
          <rect x="156" y="122" width="12" height="28" rx="3" fill={STEEL} stroke={INK} strokeWidth="1.5" />
          <path d="M165 150 L165 168" stroke={WATER} strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="165" cy="174" rx="6" ry="4" fill={WATER} className="anim-water-puddle" />

          {/* Voda koja kaplje */}
          <circle cx="165" cy="156" r="4" fill={WATER} className="anim-water-drop-1" />
          <circle cx="165" cy="148" r="3" fill={WATER} className="anim-water-drop-2" />

          {/* Osoba s telefonom — panični korisnik */}
          <g className="anim-float-subtle" transform="translate(0, 0)">
            {/* Telo */}
            <rect x="184" y="112" width="28" height="42" rx="12" fill={ORANGE} stroke={INK} strokeWidth="2" />
            {/* Vrat */}
            <rect x="194" y="104" width="8" height="12" rx="3" fill={SKIN} />
            {/* Glava */}
            <circle cx="198" cy="96" r="14" fill={SKIN} stroke={INK} strokeWidth="2" />
            {/* Kosa */}
            <path d="M184 94 C184 80 196 78 212 84 C210 76 198 72 188 78 C178 84 180 94 184 94" fill={INK} />
            {/* Oči */}
            <circle cx="194" cy="96" r="2" fill={INK} />
            <circle cx="204" cy="96" r="2" fill={INK} />
            {/* Usta — zabrinut izraz */}
            <path d="M195 104 Q199 100 203 104" stroke={INK} strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* Ruka + telefon */}
            <rect x="176" y="116" width="12" height="22" rx="4" fill={WHITE} stroke={INK} strokeWidth="2" transform="rotate(-15 182 127)" />
            <rect x="180" y="122" width="10" height="10" rx="2" fill={RED} transform="rotate(-15 185 127)" />
            <rect x="196" y="126" width="8" height="18" rx="4" fill={SKIN} stroke={INK} strokeWidth="1.5" transform="rotate(-15 200 135)" />
          </g>

          {/* Hitna oznaka */}
          <g className="anim-ping-ring" transform="translate(0, 0)">
            <circle cx="110" cy="74" r="14" fill={RED} opacity="0.12" />
            <circle cx="110" cy="74" r="10" fill={RED} />
            <path d="M110 68 L110 80 M104 74 L116 74" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </g>

        {/* Label koraka */}
        <text x="170" y="210" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="12" fontWeight="700" fill={INK} letterSpacing="0.05em">PROBLEM</text>
        <text x="170" y="228" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="10" fill={STEEL}>Kvar se desi</text>

        {/* ========== KORAK 2: ODGOVOR ========== */}
        <g>
          {/* Notifikacija na telefonu */}
          <g className="anim-float-subtle" transform="translate(0, 0)">
            <rect x="372" y="72" width="36" height="64" rx="8" fill={WHITE} stroke={INK} strokeWidth="2" />
            <rect x="376" y="80" width="28" height="48" rx="4" fill={CLOUD} />
            {/* Urgentna notifikacija */}
            <rect x="378" y="92" width="24" height="28" rx="5" fill={RED} />
            <path d="M384 102 L396 102 M384 108 L394 108" stroke={WHITE} strokeWidth="2" strokeLinecap="round" />
            <path d="M388 116 L392 116" stroke={WHITE} strokeWidth="2" strokeLinecap="round" />
            {/* Ping ring */}
            <circle cx="390" cy="72" r="8" fill={RED} className="anim-ping-ring" />
            <circle cx="390" cy="72" r="6" fill={RED} />
          </g>

          {/* Servisni kombi */}
          <g className="anim-drive-subtle" transform="translate(0, 0)">
            {/* Kombi body: duži, kutiji dio sa strane + kabina */}
            <rect x="420" y="118" width="96" height="44" rx="8" fill={INK} stroke={INK} strokeWidth="2" />
            {/* Kabina / prozor vozača */}
            <path d="M500 118 L500 146 L516 146 L516 132 C516 124 510 118 500 118Z" fill={WHITE} opacity="0.95" stroke={INK} strokeWidth="1.5" />
            {/* Bočni prozor/kutija karakteristika */}
            <rect x="430" y="128" width="56" height="22" rx="3" fill={WHITE} opacity="0.95" />
            {/* Linija na karoseriji */}
            <path d="M420 140 L516 140" stroke={INK} strokeWidth="1.5" />
            {/* Sirena / rotacija svjetlo na krovu */}
            <rect x="468" y="110" width="14" height="8" rx="4" fill={RED} />
            <path d="M475 110 L475 102" stroke={RED} strokeWidth="2" strokeLinecap="round" />
            <circle cx="475" cy="102" r="5" fill={RED} className="anim-siren-pulse" />
            {/* Točkovi kombija (tri točna, duži radni kombi) */}
            <circle cx="442" cy="162" r="8" fill={WHITE} stroke={INK} strokeWidth="2" />
            <circle cx="442" cy="162" r="4" fill={INK} />
            <circle cx="490" cy="162" r="8" fill={WHITE} stroke={INK} strokeWidth="2" />
            <circle cx="490" cy="162" r="4" fill={INK} />
            {/* Brzinske linije */}
            <path d="M392 146 L408 146" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" className="anim-speed-line" />
            <path d="M386 156 L402 156" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" className="anim-speed-line anim-speed-line-delay" />
          </g>

          {/* Profesionalac kao vozač */}
          <g className="anim-float-subtle" transform="translate(0, 0)">
            <circle cx="520" cy="98" r="12" fill={SKIN} stroke={INK} strokeWidth="2" />
            <path d="M508 94 C508 84 520 82 532 88 C530 80 518 78 512 82 C506 86 506 92 508 94" fill={INK} />
            <circle cx="516" cy="98" r="1.8" fill={INK} />
            <circle cx="524" cy="98" r="1.8" fill={INK} />
            <path d="M516 104 Q520 107 524 104" stroke={INK} strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <rect x="510" y="112" width="20" height="30" rx="8" fill={ORANGE} stroke={INK} strokeWidth="2" />
          </g>
        </g>

        {/* Label koraka */}
        <text x="450" y="210" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="12" fontWeight="700" fill={INK} letterSpacing="0.05em">ODGOVOR</text>
        <text x="450" y="228" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="10" fill={STEEL}>24/7 reakcija</text>

        {/* ========== KORAK 3: RIJEŠENJE ========== */}
        <g>
          {/* Kuća sa popravkom */}
          <rect x="676" y="88" width="76" height="74" rx="10" fill={WHITE} stroke={INK} strokeWidth="2" />
          <path d="M674 100 L714 66 L754 100" fill={INK} />
          <rect x="682" y="104" width="20" height="20" rx="4" fill={CLOUD} stroke={INK} strokeWidth="1.5" />
          <rect x="726" y="104" width="20" height="20" rx="4" fill={CLOUD} stroke={INK} strokeWidth="1.5" />
          <rect x="702" y="132" width="24" height="30" rx="5" fill={ORANGE_LIGHT} stroke={INK} strokeWidth="1.5" />
          <circle cx="720" cy="147" r="2" fill={INK} />

          {/* Vrata u fokusu */}
          <rect x="694" y="118" width="40" height="44" rx="4" fill={WHITE} stroke={INK} strokeWidth="2" />
          <rect x="700" y="124" width="28" height="32" rx="2" fill={CLOUD} />
          <circle cx="722" cy="140" r="2.5" fill={INK} />

          {/* Majstor sa alatom */}
          <g className="anim-float-subtle" transform="translate(0, 0)">
            {/* Telo */}
            <rect x="750" y="112" width="28" height="42" rx="12" fill={ORANGE} stroke={INK} strokeWidth="2" />
            {/* Vrat */}
            <rect x="760" y="104" width="8" height="12" rx="3" fill={SKIN} />
            {/* Glava */}
            <circle cx="764" cy="96" r="14" fill={SKIN} stroke={INK} strokeWidth="2" />
            {/* Kosa / kaciga */}
            <path d="M750 94 C750 80 762 78 778 84 C776 76 764 72 754 78 C744 84 746 94 750 94" fill={INK} />
            {/* Oči */}
            <circle cx="760" cy="96" r="2" fill={INK} />
            <circle cx="770" cy="96" r="2" fill={INK} />
            {/* Osmiјeh */}
            <path d="M760 104 Q765 108 770 104" stroke={INK} strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* Ruka */}
            <rect x="742" y="122" width="8" height="18" rx="4" fill={SKIN} stroke={INK} strokeWidth="1.5" />
            {/* Alat — ključ */}
            <g transform="rotate(-35 746 132)">
              <rect x="740" y="118" width="6" height="28" rx="2" fill="#94A3B8" stroke={INK} strokeWidth="1.5" />
              <circle cx="743" cy="116" r="7" fill="#94A3B8" stroke={INK} strokeWidth="1.5" />
              <circle cx="743" cy="116" r="3" fill={WHITE} />
            </g>
          </g>

          {/* Check badge */}
          <g className="anim-check-pop" transform="translate(0, 0)">
            <circle cx="660" cy="80" r="16" fill={ORANGE} stroke={WHITE} strokeWidth="2.5" />
            <path d="M653 80 L657 85 L667 75" stroke={WHITE} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>

        {/* Label koraka */}
        <text x="730" y="210" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="12" fontWeight="700" fill={INK} letterSpacing="0.05em">RIJEŠENJE</text>
        <text x="730" y="228" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="10" fill={STEEL}>Majstor popravlja</text>
      </svg>
    </div>
  );
}
