import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const configuredPassword = process.env.DRYDOCK_ADMIN_PASSWORD;

  if (!configuredPassword || password !== configuredPassword) {
    return NextResponse.redirect(new URL("/admin/requests?error=1", request.url));
  }

  const response = NextResponse.redirect(new URL("/admin/requests", request.url));
  response.cookies.set("drydock_admin", configuredPassword, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
