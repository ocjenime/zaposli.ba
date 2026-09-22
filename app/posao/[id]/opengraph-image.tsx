import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function fetchJob(id: string): Promise<{ title: string; city: string } | null> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const res = await fetch(
      `${url}/rest/v1/jobs?select=title,city&id=eq.${encodeURIComponent(id)}&limit=1`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as { title: string; city: string }[];
    return rows[0] || null;
  } catch {
    return null;
  }
}

export default async function OgImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await fetchJob(id);
  const title = job?.title || 'Posao';
  const city = job?.city || 'BiH';
  const short = title.length > 90 ? `${title.slice(0, 87)}...` : title;

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
        <div style={{ fontSize: '56px', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px' }}>
          {short}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 700,
              background: '#f97316',
              borderRadius: '999px',
              padding: '10px 28px',
            }}
          >
            Posao · {city}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
