import { cookies } from "next/headers";

export const instant = false;

type ProblemRequest = {
  id: number;
  branch: string;
  problem: string;
  monthlyBudget: string;
  urgency: string;
  details: string;
  email: string;
  status: string;
  created_at: string;
};

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const cookieStore = await cookies();
  const params = await searchParams;
  const authenticated =
    Boolean(process.env.DRYDOCK_ADMIN_PASSWORD) &&
    cookieStore.get("drydock_admin")?.value === process.env.DRYDOCK_ADMIN_PASSWORD;

  if (!authenticated) {
    return (
      <main className="grid-background min-h-[calc(100vh-128px)]">
        <div className="mx-auto max-w-md px-5 py-20">
          <p className="font-mono text-[10px] text-[#8E8E93]">DRYDOCK // PRIVATE</p>
          <h1 className="mt-3 text-2xl font-semibold">Request inbox</h1>
          <form action="/api/admin/login" method="post" className="mt-6">
            <input name="password" type="password" required placeholder="Admin password" className="h-11 w-full rounded-lg border border-[#333338] bg-[#09090B] px-4 text-sm outline-none focus:border-[#5A5A62]" />
            {params.error && <p className="mt-3 text-sm text-red-400">Incorrect password.</p>}
            <button type="submit" className="mt-3 h-11 w-full rounded-lg bg-[#FAFAFA] text-sm font-semibold text-[#09090B]">Enter inbox</button>
          </form>
        </div>
      </main>
    );
  }

  let requests: ProblemRequest[] = [];
  let unavailable = false;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/problem_requests?select=*&order=created_at.desc`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        cache: "no-store",
      },
    );
    unavailable = !response.ok;
    if (response.ok) requests = (await response.json()) as ProblemRequest[];
  } else {
    unavailable = true;
  }

  return (
    <main className="grid-background min-h-[calc(100vh-128px)]">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <p className="font-mono text-[10px] tracking-[0.14em] text-[#8E8E93]">DRYDOCK // ADMIN</p>
        <h1 className="mt-3 text-3xl font-semibold">Problem requests</h1>
        {unavailable ? (
          <div className="mt-8 rounded-xl border border-[#222226] bg-[#111113] p-6 text-sm text-[#8E8E93]">
            Connect Supabase to display stored requests.
          </div>
        ) : (
          <div className="mt-8 grid gap-3">
            {requests.length === 0 && (
              <div className="rounded-xl border border-[#222226] bg-[#111113] p-6 text-sm text-[#8E8E93]">
                No problem requests yet.
              </div>
            )}
            {requests.map((request) => (
              <article key={request.id} className="rounded-xl border border-[#222226] bg-[#111113] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-mono text-[10px] text-[#10B981]">{request.status} // {request.branch}</p>
                  <p className="font-mono text-[9px] text-[#8E8E93]">{new Date(request.created_at).toLocaleString()}</p>
                </div>
                <p className="mt-4 text-sm leading-6">{request.problem}</p>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#8E8E93]">
                  <span>Budget: {request.monthlyBudget}</span>
                  <span>Urgency: {request.urgency}</span>
                  <span>Email: {request.email}</span>
                </div>
                {request.details && <p className="mt-3 text-xs leading-5 text-[#8E8E93]">{request.details}</p>}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
