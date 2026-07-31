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
const BLUE = '#2563EB';
const HAT_YELLOW = '#FACC15';

function Majstor(props: {
  x: number;
  y: number;
  scale?: number;
  arm?: 'clipboard' | 'phone' | 'document' | 'wallet';
  face?: 'smile' | 'neutral';
  toolBelt?: boolean;
}) {
  const { x, y, scale = 1, arm = 'clipboard', face = 'smile', toolBelt = true } = props;
  const s = scale;
  const t = (tx: number, ty: number) => `translate(${x + tx * s} ${y + ty * s}) scale(${s})`;

  return (
    <g className="anim-float-subtle">
      {/* Noge / cipele */}
      <g transform={t(0, 0)}>
        <rect x="-16" y="54" width="14" height="14" rx="4" fill="#1E293B" stroke={INK} strokeWidth="2" />
        <rect x="2" y="54" width="14" height="14" rx="4" fill="#1E293B" stroke={INK} strokeWidth="2" />
      </g>

      {/* Telo — radno odjelo / kombinezon */}
      <g transform={t(0, 0)}>
        <rect x="-20" y="12" width="40" height="48" rx="12" fill={BLUE} stroke={INK} strokeWidth="2" />
        {/* Reflektirajuća traka */}
        <rect x="-20" y="34" width="40" height="6" rx="1" fill={YELLOW} opacity="0.9" />
        <rect x="-20" y="44" width="40" height="6" rx="1" fill={YELLOW} opacity="0.9" />
        {/* Džepovi na kombinezonu */}
        <rect x="-16" y="22" width="10" height="12" rx="2" fill="#1E3A8A" stroke={INK} strokeWidth="1.5" />
        <rect x="6" y="22" width="10" height="12" rx="2" fill="#1E3A8A" stroke={INK} strokeWidth="1.5" />
        {/* Kopča / sredina */}
        <rect x="-2" y="14" width="4" height="30" rx="2" fill="#1E3A8A" />
      </g>

      {/* Vrat */}
      <g transform={t(0, 0)}>
        <rect x="-5" y="2" width="10" height="14" rx="3" fill={SKIN} />
      </g>

      {/* Glava */}
      <g transform={t(0, 0)}>
        <circle cx="0" cy="-8" r="15" fill={SKIN} stroke={INK} strokeWidth="2" />
        {/* Oči */}
        <circle cx="-5" cy="-9" r="2" fill={INK} />
        <circle cx="5" cy="-9" r="2" fill={INK} />
        {/* Osmiјeh ili neutral */}
        {face === 'smile' ? (
          <path d="M-5 -2 Q0 2 5 -2" stroke={INK} strokeWidth="1.5" strokeLinecap="round" fill="none" />
        ) : (
          <line x1="-4" y1="-2" x2="4" y2="-2" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
        )}
      </g>

      {/* Zaštitni šlem */}
      <g transform={t(0, 0)}>
        {/* Kruna šlema */}
        <path d="M-16 -16 C-16 -34 16 -34 16 -16" fill={HAT_YELLOW} stroke={INK} strokeWidth="2" />
        {/* Greben na sredini šlema */}
        <path d="M-2 -30 L-2 -18" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <path d="M2 -30 L2 -18" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        {/* Obod / šilt */}
        <rect x="-18" y="-16" width="36" height="6" rx="3" fill={HAT_YELLOW} stroke={INK} strokeWidth="2" />
      </g>

      {/* Tool belt */}
      {toolBelt && (
        <g transform={t(0, 0)}>
          <rect x="-22" y="38" width="44" height="8" rx="2" fill="#3E2723" stroke={INK} strokeWidth="1.5" />
          {/* Džep na pojasu */}
          <rect x="12" y="36" width="10" height="14" rx="2" fill="#3E2723" stroke={INK} strokeWidth="1.5" />
          {/* Ključ viri */}
          <g transform="rotate(-25 16 38)">
            <rect x="14" y="28" width="4" height="16" rx="1" fill={STEEL} stroke={INK} strokeWidth="1.5" />
            <circle cx="16" cy="26" r="5" fill={STEEL} stroke={INK} strokeWidth="1.5" />
            <circle cx="16" cy="26" r="2" fill="#3E2723" />
          </g>
        </g>
      )}

      {/* Lijeva ruka (obično dole) */}
      <g transform={t(0, 0)}>
        <rect x="-32" y="18" width="10" height="20" rx="5" fill={SKIN} stroke={INK} strokeWidth="1.5" />
      </g>

      {/* Desna ruka s objektom */}
      {arm === 'clipboard' && (
        <g transform={t(0, 0)}>
          <rect x="22" y="10" width="8" height="18" rx="4" fill={SKIN} stroke={INK} strokeWidth="1.5" />
        </g>
      )}
      {arm === 'phone' && (
        <g transform={t(0, 0)}>
          <rect x="20" y="6" width="8" height="22" rx="4" fill={SKIN} stroke={INK} strokeWidth="1.5" transform="rotate(-10 24 17)" />
        </g>
      )}
      {arm === 'document' && (
        <g transform={t(0, 0)}>
          <rect x="22" y="8" width="8" height="20" rx="4" fill={SKIN} stroke={INK} strokeWidth="1.5" />
        </g>
      )}
      {arm === 'wallet' && (
        <g transform={t(0, 0)}>
          <rect x="20" y="12" width="8" height="18" rx="4" fill={SKIN} stroke={INK} strokeWidth="1.5" transform="rotate(-15 24 21)" />
        </g>
      )}
    </g>
  );
}

export function FirmProcessAnimation() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <svg
        viewBox="0 0 1100 280"
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
        <circle cx="150" cy="130" r="108" fill={CLOUD} opacity="0.9" />
        <circle cx="390" cy="130" r="108" fill={CLOUD} opacity="0.9" />
        <circle cx="630" cy="130" r="108" fill={CLOUD} opacity="0.9" />
        <circle cx="870" cy="130" r="108" fill={CLOUD} opacity="0.9" />

        {/* Dekorativni akcenti */}
        <circle cx="100" cy="100" r="8" fill={ORANGE_LIGHT} />
        <circle cx="1020" cy="90" r="10" fill={ORANGE_LIGHT} />
        <rect x="350" y="82" width="24" height="24" rx="6" fill={ORANGE_LIGHT} transform="rotate(12 362 94)" />
        <rect x="590" y="88" width="20" height="20" rx="5" fill={ORANGE_LIGHT} transform="rotate(-8 600 98)" />

        {/* Linija vremenske ose */}
        <line x1="220" y1="130" x2="320" y2="130" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 6" />
        <line x1="460" y1="130" x2="560" y2="130" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 6" />
        <line x1="700" y1="130" x2="800" y2="130" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 6" />

        {/* Pokretni markeri */}
        <g className="anim-timeline-dot">
          <circle cx="270" cy="130" r="5" fill={ORANGE} opacity="0.85" />
        </g>
        <g className="anim-timeline-dot anim-timeline-dot-delay">
          <circle cx="510" cy="130" r="5" fill={ORANGE} opacity="0.85" />
        </g>
        <g className="anim-timeline-dot anim-timeline-dot-delay-2">
          <circle cx="750" cy="130" r="5" fill={ORANGE} opacity="0.85" />
        </g>

        {/* Strelica 1 */}
        <path d="M308 130 L320 130" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M314 125 L320 130 L314 135" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Strelica 2 */}
        <path d="M548 130 L560 130" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M554 125 L560 130 L554 135" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Strelica 3 */}
        <path d="M788 130 L800 130" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M794 125 L800 130 L794 135" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* ========== KORAK 1: REGISTRUJ SE ========== */}
        <g>
          <Majstor x={126} y={138} scale={1} arm="clipboard" face="smile" />

          {/* Clipboard sa profilom */}
          <g transform="translate(172, 102)">
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

          {/* Kliješta u desnoj ruci */}
          <g transform="translate(150, 150) rotate(-25)">
            <rect x="0" y="0" width="5" height="22" rx="2" fill={STEEL} stroke={INK} strokeWidth="1.5" />
            <circle cx="2.5" cy="-2" r="4" fill={STEEL} stroke={INK} strokeWidth="1.5" />
          </g>

          {/* Badge sa brojem 1 */}
          <g>
            <circle cx="106" cy="88" r="14" fill={ORANGE} stroke={WHITE} strokeWidth="2" />
            <text x="106" y="93" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="12" fontWeight="800" fill={WHITE}>1</text>
          </g>
        </g>

        <text x="150" y="232" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="12" fontWeight="700" fill={INK} letterSpacing="0.05em">REGISTRUJ SE</text>
        <text x="150" y="250" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="10" fill={STEEL}>Profil firme/majstora</text>

        {/* ========== KORAK 2: PRONAĐI POSAO ========== */}
        <g>
          <Majstor x={366} y={138} scale={1} arm="phone" face="neutral" />

          {/* Telefon u ruci */}
          <g transform="translate(386, 132) rotate(-10)">
            <rect x="0" y="0" width="22" height="40" rx="5" fill={WHITE} stroke={INK} strokeWidth="2" />
            <rect x="2" y="4" width="18" height="32" rx="3" fill={CLOUD} />
            {/* Notifikacija */}
            <rect x="4" y="10" width="14" height="20" rx="4" fill={ORANGE_LIGHT} stroke={ORANGE} strokeWidth="1.5" />
            <circle cx="11" cy="16" r="4" fill={ORANGE} />
            <path d="M8 16 L10 18 L14 14" stroke={WHITE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="6" y="24" width="10" height="2" rx="1" fill={STEEL} />
            <rect x="6" y="28" width="6" height="2" rx="1" fill={STEEL} />
            {/* Ping */}
            <circle cx="11" cy="0" r="6" fill={ORANGE} className="anim-ping-ring" />
            <circle cx="11" cy="0" r="4" fill={ORANGE} />
          </g>

          {/* Kartica oglasa pored */}
          <g className="anim-float-subtle">
            <rect x="420" y="100" width="56" height="64" rx="8" fill={WHITE} stroke={INK} strokeWidth="2" />
            <rect x="426" y="108" width="16" height="16" rx="4" fill={ORANGE_LIGHT} />
            <rect x="446" y="110" width="24" height="4" rx="2" fill={INK} />
            <rect x="446" y="118" width="18" height="4" rx="2" fill={STEEL} />
            <rect x="426" y="132" width="44" height="4" rx="2" fill={ORANGE_LIGHT} />
            <rect x="426" y="140" width="36" height="4" rx="2" fill={ORANGE_LIGHT} />
            <rect x="426" y="152" width="28" height="10" rx="5" fill={ORANGE} />
            <text x="440" y="160" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="7" fontWeight="700" fill={WHITE}>NOVO</text>
          </g>

          {/* Radni kombi / vozilo u pozadini */}
          <g className="anim-drive-subtle">
            <rect x="286" y="152" width="54" height="26" rx="6" fill={INK} stroke={INK} strokeWidth="1.5" />
            <rect x="326" y="152" width="12" height="20" rx="2" fill={WHITE} opacity="0.9" stroke={INK} strokeWidth="1.5" />
            <rect x="294" y="158" width="28" height="12" rx="2" fill={WHITE} opacity="0.9" />
            <circle cx="302" cy="178" r="5" fill={WHITE} stroke={INK} strokeWidth="1.5" />
            <circle cx="302" cy="178" r="2.5" fill={INK} />
            <circle cx="326" cy="178" r="5" fill={WHITE} stroke={INK} strokeWidth="1.5" />
            <circle cx="326" cy="178" r="2.5" fill={INK} />
            <rect x="308" y="148" width="8" height="6" rx="3" fill={YELLOW} />
            <rect x="284" y="158" width="6" height="2" rx="1" fill="#CBD5E1" className="anim-speed-line" />
            <rect x="280" y="164" width="6" height="2" rx="1" fill="#CBD5E1" className="anim-speed-line anim-speed-line-delay" />
          </g>

          {/* Badge sa brojem 2 */}
          <g>
            <circle cx="346" cy="88" r="14" fill={ORANGE} stroke={WHITE} strokeWidth="2" />
            <text x="346" y="93" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="12" fontWeight="800" fill={WHITE}>2</text>
          </g>
        </g>

        <text x="390" y="232" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="12" fontWeight="700" fill={INK} letterSpacing="0.05em">PRONAĐI POSAO</text>
        <text x="390" y="250" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="10" fill={STEEL}>Dobijaj notifikacije</text>

        {/* ========== KORAK 3: POŠALJI PONUDU ========== */}
        <g>
          <Majstor x={606} y={138} scale={1} arm="document" face="smile" />

          {/* Dokument / ponuda */}
          <g className="anim-float-subtle">
            <rect x="636" y="96" width="60" height="72" rx="8" fill={WHITE} stroke={INK} strokeWidth="2" />
            <rect x="642" y="106" width="48" height="6" rx="2" fill={INK} />
            <rect x="642" y="118" width="36" height="4" rx="2" fill={STEEL} />
            <rect x="642" y="126" width="40" height="4" rx="2" fill={STEEL} />
            <rect x="642" y="138" width="24" height="4" rx="2" fill={ORANGE_LIGHT} />
            <rect x="642" y="146" width="30" height="4" rx="2" fill={ORANGE_LIGHT} />
            {/* Iznos */}
            <rect x="642" y="156" width="48" height="12" rx="4" fill={ORANGE} />
            <text x="666" y="165" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="8" fontWeight="800" fill={WHITE}>500 KM</text>
            {/* Pečat */}
            <circle cx="678" cy="112" r="10" fill={GREEN} stroke={WHITE} strokeWidth="2" />
            <path d="M672 112 L676 117 L684 109" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Badge sa brojem 3 */}
          <g>
            <circle cx="586" cy="88" r="14" fill={ORANGE} stroke={WHITE} strokeWidth="2" />
            <text x="586" y="93" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="12" fontWeight="800" fill={WHITE}>3</text>
          </g>
        </g>

        <text x="630" y="232" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="12" fontWeight="700" fill={INK} letterSpacing="0.05em">POŠALJI PONUDU</text>
        <text x="630" y="250" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="10" fill={STEEL}>Brzo i jednostavno</text>

        {/* ========== KORAK 4: ZARADI ========== */}
        <g>
          <Majstor x={846} y={138} scale={1} arm="wallet" face="smile" />

          {/* Novčanik u ruci */}
          <g transform="translate(866, 140) rotate(-15)">
            <rect x="0" y="0" width="44" height="28" rx="6" fill={INK} stroke={INK} strokeWidth="2" />
            <rect x="4" y="4" width="36" height="20" rx="4" fill={WHITE} />
            <circle cx="36" cy="14" r="4" fill={INK} />
            <rect x="10" y="10" width="20" height="6" rx="2" fill={ORANGE} />
            <text x="20" y="16" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="5" fontWeight="700" fill={WHITE}>KM</text>
          </g>

          {/* Keš novčanice */}
          <g className="anim-cash-float">
            <rect x="920" y="100" width="28" height="16" rx="3" fill={GREEN} stroke={INK} strokeWidth="1.5" />
            <circle cx="934" cy="108" r="4" fill={WHITE} opacity="0.4" />
            <text x="934" y="112" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="8" fontWeight="700" fill={WHITE}>KM</text>
          </g>
          <g className="anim-cash-float anim-cash-float-delay">
            <rect x="908" y="126" width="24" height="14" rx="3" fill={YELLOW} stroke={INK} strokeWidth="1.5" />
            <circle cx="920" cy="133" r="3" fill={INK} opacity="0.2" />
            <text x="920" y="137" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="6" fontWeight="700" fill={INK}>KM</text>
          </g>
          <g className="anim-cash-float anim-cash-float-delay-2">
            <rect x="926" y="142" width="26" height="14" rx="3" fill={GREEN} stroke={INK} strokeWidth="1.5" />
            <circle cx="939" cy="149" r="3" fill={WHITE} opacity="0.4" />
            <text x="939" y="153" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="6" fontWeight="700" fill={WHITE}>KM</text>
          </g>

          {/* Kovanice */}
          <g className="anim-cash-float anim-cash-float-delay">
            <circle cx="900" cy="102" r="8" fill={YELLOW} stroke={INK} strokeWidth="1.5" />
            <text x="900" y="106" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="7" fontWeight="700" fill={INK}>2</text>
          </g>
          <g className="anim-cash-float anim-cash-float-delay-2">
            <circle cx="940" cy="82" r="8" fill={YELLOW} stroke={INK} strokeWidth="1.5" />
            <text x="940" y="86" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="7" fontWeight="700" fill={INK}>5</text>
          </g>

          {/* Zvjezdica / ocjena */}
          <g className="anim-check-pop">
            <circle cx="950" cy="92" r="14" fill={YELLOW} stroke={INK} strokeWidth="2" />
            <path d="M950 82 L953 92 L964 92 L955 98 L958 108 L950 102 L942 108 L945 98 L936 92 L947 92 Z" fill={INK} />
          </g>

          {/* Check badge */}
          <g className="anim-check-pop">
            <circle cx="786" cy="122" r="12" fill={GREEN} stroke={WHITE} strokeWidth="2.5" />
            <path d="M780 122 L784 127 L792 119" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Badge sa brojem 4 */}
          <g>
            <circle cx="826" cy="88" r="14" fill={ORANGE} stroke={WHITE} strokeWidth="2" />
            <text x="826" y="93" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="12" fontWeight="800" fill={WHITE}>4</text>
          </g>
        </g>

        <text x="870" y="232" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="12" fontWeight="700" fill={INK} letterSpacing="0.05em">ZARADI</text>
        <text x="870" y="250" textAnchor="middle" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" fontSize="10" fill={STEEL}>Keš + ocjene</text>
      </svg>
    </div>
  );
}
