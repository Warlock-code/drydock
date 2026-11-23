import { NextResponse } from "next/server";

type AccessRequest = {
  email?: string;
  reference?: string;
  plan?: string;
  buyerEmail?: string;
  transferReference?: string;
  amount?: number;
};

export async function POST(request: Request) {
  let payload: AccessRequest;

  try {
    payload = (await request.json()) as AccessRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = payload.email?.trim() || payload.buyerEmail?.trim();
  const reference = payload.reference?.trim() || payload.transferReference?.trim();
  const plan = payload.plan || "six-month";

  if (plan !== "six-month") {
    return NextResponse.json({ error: "Unsupported access plan." }, { status: 400 });
  }

  if (!email || !reference) {
    return NextResponse.json({ error: "Email and transfer reference are required." }, { status: 400 });
  }

  const record = {
    email,
    reference,
    plan,
    amount: 399,
    status: "PAYMENT_LOGGED",
    created_at: new Date().toISOString(),
  };
  const supabaseUrl = process.env.SUPABASE_URL?.trim().replace(/^["']|["']$/g, "").replace(/\/+$/, "");
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim().replace(/^["']|["']$/g, "");
  const webhookUrl = process.env.DRYDOCK_REQUEST_WEBHOOK_URL;
  let stored = false;
  let storageError = "";

  if (supabaseUrl && supabaseKey) {
    try {
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
      if (response.ok) {
        stored = true;
      } else {
        const responseBody = await response.text().catch(() => "");
        storageError = `Supabase logging failed (${response.status})${responseBody ? `: ${responseBody.slice(0, 240)}` : "."}`;
      }
    } catch (error) {
      const detail = error instanceof Error ? error.message : "unknown fetch error";
      storageError = `Supabase logging unavailable: ${detail}`;
    }
  }

  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "disputeshield_access_request", ...record }),
      });
      if (response.ok) {
        stored = true;
      } else if (!storageError) {
        storageError = `Webhook logging failed (${response.status}).`;
      }
    } catch {
      if (!storageError) storageError = "Webhook logging unavailable.";
    }
  }

  if (!stored) {
    if (!supabaseUrl && !supabaseKey && !webhookUrl) {
      return NextResponse.json({ error: "Payment logging is not configured." }, { status: 503 });
    }
    return NextResponse.json({ error: storageError || "Payment logging unavailable." }, { status: 503 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
