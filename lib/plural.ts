/**
 * Bosnian pluralization helper.
 * Forms: [singular, paucal (2-4), genitive plural (5+)]
 * Rules: n%10===1 && n%100!==11 → singular;
 *        n%10 in 2-4 && n%100 not in 12-14 → paucal;
 *        otherwise genitive plural.
 * Example: plural(n, ['ponuda', 'ponude', 'ponuda'])
 */
export function plural(n: number, forms: [string, string, string]): string {
  const abs = Math.abs(n);
  const last = abs % 10;
  const lastTwo = abs % 100;
  if (last === 1 && lastTwo !== 11) return forms[0];
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return forms[1];
  return forms[2];
}
