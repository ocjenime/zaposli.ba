/**
 * Plural for Bosnian profession names.
 * Used for /usluge/ section titles, e.g. "Keramičar" -> "Keramičari u Velikoj Kladuši".
 * Falls back to the original string for complex/unknown phrases.
 */

function pluralizeWord(word: string): string {
  // Varilac -> Varioci, Rušilac -> Rušioci
  if (/lac$/i.test(word)) return word.slice(0, -3) + 'oci';
  // Betonirac -> Betonirci
  if (/ac$/i.test(word) && !/ač$/i.test(word)) {
    // keep diacritics simple: ...ac -> ...ci
    return word.slice(0, -2) + 'ci';
  }
  // ...ač -> ...ači (Krovopokrivač, Staklorezač)
  if (/ač$/i.test(word)) return word + 'i';
  // ...ar, ...er, ...or, ...ir, ...ur -> +i (Zidar -> Zidari)
  if (/(ar|er|or|ir|ur|al|am|an|ik|ič|aš)$/i.test(word)) return word + 'i';
  // ...telj, ...ter, ...tar, ...tor, ...cer, ...đer -> +i
  if (/(elj|elj|ter|tor|cer|đer|žer|zer)$/i.test(word)) return word + 'i';
  // ...a (Arhitekta, Malterdžija) -> ...e
  if (/a$/i.test(word)) return word.slice(0, -1) + 'e';
  // consonant fallback
  if (/[bcčćdđfghjklmnpqrsštvwxyzž]$/i.test(word)) return word + 'i';
  return word;
}

function pluralizePhrase(phrase: string): string {
  const p = phrase.trim();
  if (!p) return p;

  // "Betonirac / Armirač" style: pluralize each side
  if (p.includes(' / ')) {
    return p
      .split(' / ')
      .map((s) => pluralizePhrase(s.trim()))
      .join(' / ');
  }

  // "Majstor za X", "Firma za X", "Agencija za X" -> pluralize first word
  const zaIdx = p.indexOf(' za ');
  if (zaIdx > 0) {
    const [head, ...rest] = p.split(' za ');
    return `${pluralizeWord(head)} za ${rest.join(' za ')}`;
  }

  const tokens = p.split(' ');
  if (tokens.length === 1) return pluralizeWord(p);

  const first = tokens[0];
  // Modifiers stay singular, pluralize the last word:
  // "Auto majstor", "Solar instalater", "IT tehničar",
  // "Pejzažni arhitekta", "Energetski certifikator", "Stručni nadzornik"
  if (/^(Auto|Solar|IT|Pejzažni|Energetski|Stručni|Tehničar)$/i.test(first)) {
    const last = tokens[tokens.length - 1];
    tokens[tokens.length - 1] = pluralizeWord(last);
    return tokens.join(' ');
  }

  // Default for multi-word professions: pluralize the first word
  // "Postavljač podova" -> "Postavljači podova"
  // "Dekorater zidova" -> "Dekorateri zidova"
  // "Dizajner interijera" -> "Dizajneri interijera"
  // "Montaža pergole / tende" -> "Montaže pergole / tende"
  tokens[0] = pluralizeWord(first);
  return tokens.join(' ');
}

/** Already-plural or non-person phrases stay as-is. */
const KEEP_AS_IS = new Set([
  'Građevinske firme',
  'Hitne intervencije 24/7',
  'Firma za rušenje',
  'Firma za održavanje zgrada',
  'Firma za selidbe',
  'Agencija za čišćenje',
  'Montaža pergole / tende',
]);

export function getProfessionPlural(profession: string): string {
  if (KEEP_AS_IS.has(profession)) {
    // "Firme za ..." variants for the section title
    if (profession.startsWith('Firma za ')) return profession.replace('Firma za ', 'Firme za ');
    if (profession.startsWith('Agencija za ')) return profession.replace('Agencija za ', 'Agencije za ');
    return profession;
  }
  return pluralizePhrase(profession);
}
