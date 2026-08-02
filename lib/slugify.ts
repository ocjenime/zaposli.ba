const charMap: Record<string, string> = {
  'ć': 'c', 'č': 'c', 'đ': 'd', 'š': 's', 'ž': 'z',
  'Ć': 'C', 'Č': 'C', 'Đ': 'D', 'Š': 'S', 'Ž': 'Z',
  'ä': 'a', 'ö': 'o', 'ü': 'u', 'ß': 'ss', 'å': 'a', 'ø': 'o',
  'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
  'á': 'a', 'à': 'a', 'â': 'a', 'ã': 'a',
  'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
  'ó': 'o', 'ò': 'o', 'ô': 'o', 'õ': 'o',
  'ú': 'u', 'ù': 'u', 'û': 'u',
  'ñ': 'n', 'ç': 'c',
};

function transliterate(value: string): string {
  return value
    .split('')
    .map((char) => charMap[char] || char)
    .join('');
}

export function slugify(value: string): string {
  return transliterate(value)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export async function generateUniqueFirmSlug(supabase: any, name: string, existingId?: string): Promise<string> {
  let base = slugify(name);
  if (!base) base = 'firma';

  let slug = base;
  let suffix = 0;

  while (true) {
    const query = supabase.from('firms').select('id').eq('slug', slug);
    if (existingId) query.neq('id', existingId);
    const { data } = await query.maybeSingle();
    if (!data) return slug;
    suffix++;
    slug = `${base}-${suffix}`;
  }
}
