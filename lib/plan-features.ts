// Canonical feature lists shown on /za-firme/ and /dashboard/firma/pretplata/
// so both pages always stay in sync.

export const planFeatures: Record<string, string[]> = {
  besplatno: [
    'Profil firme / majstora',
    '5 ponuda mjesečno',
    'Direktan kontakt sa klijentima',
    'Osnovni portfolio',
  ],
  start: [
    '10 ponuda mjesečno',
    'Verifikacija profila',
    'Istaknuti kontakt',
    'Prioritet u listi',
    'Vlastiti logotip na profilu',
    'Email podrška',
  ],
  pro: [
    '30 ponuda mjesečno',
    'Istaknuti profil',
    'Verifikacija profila',
    'Prioritetna podrška',
    'Statistika posjetitelja',
    '1 oglas mjesecno',
    'Vlastiti logotip na profilu',
  ],
  premium: [
    'Neograničene ponude',
    'Premium istaknutost',
    'Verifikacija profila',
    'Prioritetna podrška',
    'Napredna analitika',
    '3 oglasa mjesecno',
    'Vlastiti logotip na profilu',
  ],
};
