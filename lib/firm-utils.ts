/**
 * Heuristika da li je naziv firma (zelena značka "Provjerena firma")
 * ili majstor (plava značka "Provjereni majstor").
 * Profili javno ne otkrivaju role, pa se tip zaključuje iz naziva.
 */
export function isCompanyName(name: string): boolean {
  return /(d\.?\s?o\.?\s?o\.?|doo|s\.?\s?p\.?|obrt|&|m&d|gradnja|bau|mont|invest|group|tim|centar|studio|servis|profi|master|gmbh)/i.test(name);
}
