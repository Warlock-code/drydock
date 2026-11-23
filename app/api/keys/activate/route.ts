import { NextResponse } from "next/server";

type AccessKeyRow = {
  key_code: string;
  status: "issued" | "active" | "revoked";
  activated_at: string | null;
  expires_at: string | null;
};

export async function POST(request: Request) {
  let payload: { keyCode?: string };
  try {
    payload = (await request.json()) as { keyCode?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const keyCode = payload.keyCode?.trim().toUpperCase();
  if (!keyCode) {
    return NextResponse.json({ error: "Access key is required" }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL?.trim().replace(/^["']|["']$/g, "").replace(/\/+$/, "");
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim().replace(/^["']|["']$/g, "");
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Access key verification is not configured" }, { status: 503 });
  }

  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
  };

  try {
    const lookup = await fetch(
      `${supabaseUrl}/rest/v1/access_keys?select=key_code,status,activated_at,expires_at&key_code=eq.${encodeURIComponent(keyCode)}&limit=1`,
      { headers, cache: "no-store" },
    );
    if (!lookup.ok) {
      return NextResponse.json({ error: "Unable to verify access key" }, { status: 503 });
    }

    const rows = (await lookup.json()) as AccessKeyRow[];
    const row = rows[0];
    if (!row || row.status === "revoked") {
      return NextResponse.json({ error: "Invalid or revoked access key" }, { status: 404 });
    }

    if (row.status === "active") {
      if (!row.expires_at || new Date(row.expires_at) <= new Date()) {
        return NextResponse.json({ error: "This 6-month access key has expired" }, { status: 403 });
      }
      return NextResponse.json({
        valid: true,
        keyCode: row.key_code,
        expiresAt: row.expires_at,
      });
    }

    if (row.status !== "issued") {
      return NextResponse.json({ error: "Invalid or revoked access key" }, { status: 404 });
    }

    if (keyCode !== "DRYDOCK-6M-FOUNDER") {
      const now = new Date().toISOString();
      const countResponse = await fetch(
        `${supabaseUrl}/rest/v1/access_keys?select=key_code&status=eq.active&expires_at=gt.${encodeURIComponent(now)}&key_code=neq.DRYDOCK-6M-FOUNDER`,
        { headers, cache: "no-store" },
      );
      if (!countResponse.ok) {
        return NextResponse.json({ error: "Unable to verify founding pass availability" }, { status: 503 });
      }
      const activeRows = (await countResponse.json()) as Array<{ key_code: string }>;
      if (activeRows.length >= 10) {
        return NextResponse.json({ error: "All 10 founding spots have been activated" }, { status: 403 });
      }
    }

    const activatedAt = new Date();
    const expiresAt = new Date(activatedAt.getTime() + 180 * 24 * 60 * 60 * 1000);
    const update = await fetch(
      `${supabaseUrl}/rest/v1/access_keys?key_code=eq.${encodeURIComponent(row.key_code)}`,
      {
        method: "PATCH",
        headers: {
          ...headers,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          status: "active",
          activated_at: activatedAt.toISOString(),
          expires_at: expiresAt.toISOString(),
        }),
        cache: "no-store",
      },
    );

    if (!update.ok) {
      return NextResponse.json({ error: "Unable to activate access key" }, { status: 503 });
    }

    const updatedRows = (await update.json()) as AccessKeyRow[];
    const updated = updatedRows[0];
    return NextResponse.json({
      valid: true,
      keyCode: row.key_code,
      expiresAt: updated?.expires_at || expiresAt.toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Unable to verify access key" }, { status: 503 });
  }
}
