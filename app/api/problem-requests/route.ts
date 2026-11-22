import { NextResponse } from "next/server";

type ProblemRequest = {
  branch: string;
  problem: string;
  monthlyBudget: string;
  urgency: string;
  details: string;
  email: string;
};

export async function POST(request: Request) {
  let payload: ProblemRequest;

  try {
    payload = (await request.json()) as ProblemRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (
    !payload.branch ||
    !payload.problem ||
    !payload.monthlyBudget ||
    !payload.urgency ||
    !payload.email
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const record = {
    ...payload,
    status: "NEW",
    created_at: new Date().toISOString(),
  };
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    const response = await fetch(`${supabaseUrl}/rest/v1/problem_requests`, {
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
      return NextResponse.json({ error: "Storage unavailable" }, { status: 503 });
    }
  } else if (process.env.DRYDOCK_REQUEST_WEBHOOK_URL) {
    const response = await fetch(process.env.DRYDOCK_REQUEST_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Request service unavailable" }, { status: 503 });
    }
  } else {
    return NextResponse.json({ error: "Request storage is not configured" }, { status: 503 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
