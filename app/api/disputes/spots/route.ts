import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL?.trim().replace(/^["']|["']$/g, "").replace(/\/+$/, "");
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim().replace(/^["']|["']$/g, "");

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ total: 10, claimed: 0, remaining: 10 }, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    const now = new Date().toISOString();
    const response = await fetch(
      `${supabaseUrl}/rest/v1/access_keys?select=key_code&status=eq.active&expires_at=gt.${encodeURIComponent(now)}&key_code=neq.DRYDOCK-6M-FOUNDER`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return NextResponse.json({ total: 10, claimed: 0, remaining: 10 }, {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      });
    }

    const rows = (await response.json()) as Array<{ key_code: string }>;
    const claimed = rows.length;
    return NextResponse.json(
      { total: 10, claimed, remaining: Math.max(0, 10 - claimed) },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ total: 10, claimed: 0, remaining: 10 }, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
