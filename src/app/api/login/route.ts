import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const passphrase = form.get("passphrase")?.toString() ?? "";
  const next = form.get("next")?.toString() || "/";

  const expected = process.env.APP_PASSPHRASE;
  if (!expected || passphrase !== expected) {
    const url = new URL("/login", request.url);
    url.searchParams.set("error", "1");
    url.searchParams.set("next", next);
    return NextResponse.redirect(url, { status: 303 });
  }

  const res = NextResponse.redirect(new URL(next, request.url), { status: 303 });
  res.cookies.set("reps_auth", passphrase, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 90, path: "/" });
  return res;
}
