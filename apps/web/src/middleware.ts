import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicRoutes = ['/login', '/register', '/'];

// Routes that require authentication
const protectedRoutes = ['/dashboard'];

export function middleware(request: NextRequest) {
  // ════════════════════════════════════════════════════════════
  // TẠM THỜI TẮT MIDDLEWARE
  // ════════════════════════════════════════════════════════════
  // Lý do: Đang dùng localStorage thay vì cookies
  // Middleware (server-side) không thể đọc localStorage (client-side)
  // 
  // TODO: Implement client-side authentication check sau
  // ════════════════════════════════════════════════════════════
  
  return NextResponse.next();

  // ═══ CODE CŨ (COMMENTED) ═══
  // const { pathname } = request.nextUrl;
  // const accessToken = request.cookies.get('accessToken')?.value;
  // const isProtectedRoute = protectedRoutes.some((route) =>
  //   pathname.startsWith(route),
  // );
  // const isAuthRoute = pathname === '/login' || pathname === '/register';
  // if (isProtectedRoute && !accessToken) {
  //   const loginUrl = new URL('/login', request.url);
  //   loginUrl.searchParams.set('callbackUrl', pathname);
  //   return NextResponse.redirect(loginUrl);
  // }
  // if (isAuthRoute && accessToken) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url));
  // }
  // return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};

