import { NextResponse } from "next/server";

type AccessRequest = {
  buyerEmail: string;
  transferReference: string;
  plan: "six-month";
  amount: number;
};

export async function POST(request: Request) {
  let payload: AccessRequest;

  try {
    payload = (await request.json()) as AccessRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!payload.buyerEmail || !payload.transferReference) {
    return NextResponse.json({ error: "Buyer email and transfer reference are required." }, { status: 400 });
  }

  const record = {
    ...payload,
    status: "PAYMENT_LOGGED",
    created_at: new Date().toISOString(),
  };
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    const response = await fetch(`${supabaseUrl}/rest/v1/access_requests`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(record),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Payment logging unavailable." }, { status: 503 });
    }
  } else if (process.env.DRYDOCK_REQUEST_WEBHOOK_URL) {
    const response = await fetch(process.env.DRYDOCK_REQUEST_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "disputeshield_access_request", ...record }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Payment logging unavailable." }, { status: 503 });
    }
  } else {
    return NextResponse.json({ error: "Payment logging is not configured." }, { status: 503 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
