import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { access_token, refresh_token, expires_at } = body ?? {};

    if (!access_token && !refresh_token) {
      return NextResponse.json({ ok: false, error: "missing_tokens" }, { status: 400 });
    }

    const now = Math.floor(Date.now() / 1000);
    const accessMaxAge =
      typeof expires_at === "number" && expires_at > now ? expires_at - now : 60 * 60;
    const refreshMaxAge = 7 * 24 * 60 * 60;

    const res = NextResponse.json({ ok: true });
    const isProd = process.env.NODE_ENV === "production";

    if (access_token) {
      res.cookies.set({
        name: "sb-access-token",
        value: access_token,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProd,
        maxAge: accessMaxAge,
      });
    }

    if (refresh_token) {
      res.cookies.set({
        name: "sb-refresh-token",
        value: refresh_token,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProd,
        maxAge: refreshMaxAge,
      });
    }

    return res;
  } catch (err) {
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
