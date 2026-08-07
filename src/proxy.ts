import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "reps_auth";

export function proxy(request: NextRequest) {
  const passphrase = process.env.APP_PASSPHRASE;
  if (!passphrase) return NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/login")) return NextResponse.next();
  if (request.nextUrl.pathname.startsWith("/api/login")) return NextResponse.next();
  if (request.nextUrl.pathname.startsWith("/api/cron")) return NextResponse.next();

  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (cookie === passphrase) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
