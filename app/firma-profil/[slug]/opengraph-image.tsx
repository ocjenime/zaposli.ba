import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function fetchFirm(
  slug: string
): Promise<{ name: string; city: string | null; average_rating: number | null; review_count: number | null } | null> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const res = await fetch(
      `${url}/rest/v1/firms?select=name,city,average_rating,review_count&slug=eq.${encodeURIComponent(slug)}&limit=1`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as {
      name: string;
      city: string | null;
      average_rating: number | null;
      review_count: number | null;
    }[];
    return rows[0] || null;
  } catch {
    return null;
  }
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const firm = await fetchFirm(slug);
  const name = firm?.name || 'Firma';
  const short = name.length > 60 ? `${name.slice(0, 57)}...` : name;
  const city = firm?.city || 'BiH';
  const rating = firm?.average_rating ? Number(firm.average_rating).toFixed(1) : null;
  const reviews = firm?.review_count || 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #0f172a 0%, #431407 60%, #9a3412 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: '#f97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              fontWeight: 800,
            }}
          >
            Z
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800 }}>
            ZAPOSLI<span style={{ color: '#fb923c' }}>.BA</span>
          </div>
        </div>
        <div style={{ fontSize: '64px', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px' }}>
          {short}
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 700,
              background: '#f97316',
              borderRadius: '999px',
              padding: '10px 28px',
            }}
          >
            {city}
          </div>
          {rating && (
            <div style={{ fontSize: '28px', fontWeight: 700 }}>
              ★ {rating} ({reviews} {reviews === 1 ? 'recenzija' : 'recenzija'})
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
