import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Lindungi semua route /admin/** (kecuali /admin/login) — redirect ke /admin/login
// kalau belum ada session Supabase Auth yang valid.
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isAdminPage = pathname.startsWith("/admin");
  // /api/projects, /api/writings, /api/upload* murni endpoint CRUD & upload untuk admin
  // (halaman publik ambil data langsung lewat Prisma di server component, bukan lewat API ini)
  const isAdminApi =
    pathname.startsWith("/api/projects") ||
    pathname.startsWith("/api/writings") ||
    pathname.startsWith("/api/upload");

  if (isAdminApi && !user) {
    return NextResponse.json({ error: "Unauthorized. Silakan login dulu." }, { status: 401 });
  }

  if (isAdminPage && !isLoginPage && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isLoginPage && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin";
    redirectUrl.searchParams.delete("next");
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/projects/:path*", "/api/writings/:path*", "/api/upload/:path*"]
};
