// Fallback price estimates (in KM) when no real accepted-bid data exists yet.
// These are typical ranges for BiH and should be updated over time as real data grows.

export const fallbackEstimates: Record<string, { min: number; max: number }> = {
  'hitne-intervencije': { min: 50, max: 300 },
  'elektroinstalacije': { min: 100, max: 800 },
  'vodoinstalaterski-radovi': { min: 80, max: 700 },
  'keramika-i-plocice': { min: 300, max: 2500 },
  'molerski-radovi': { min: 200, max: 1500 },
  'adaptacija-stana': { min: 1000, max: 15000 },
  'zidarski-radovi': { min: 300, max: 3000 },
  'krovni-radovi': { min: 500, max: 5000 },
  'stolarija-i-prozori': { min: 400, max: 3500 },
  'parket-i-laminat': { min: 300, max: 2500 },
  'kupatilo-kljuc-u-ruke': { min: 1500, max: 12000 },
  'kuhinja-po-mjeri': { min: 1200, max: 10000 },
  'fasada-i-termoizolacija': { min: 1000, max: 10000 },
  'ograde-i-nadstresnice': { min: 500, max: 4000 },
  'bravarski-radovi': { min: 50, max: 300 },
  'ciscenje-i-odrzavanje': { min: 80, max: 500 },
  'selidbe': { min: 150, max: 800 },
  'basta-i-eksterijer': { min: 200, max: 2500 },
  'graficki-dizajn': { min: 100, max: 1000 },
};

export function getFallbackEstimate(slug: string) {
  return fallbackEstimates[slug] ?? { min: 200, max: 2000 };
}
