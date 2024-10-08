import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJWT } from './lib/utils';
import { ADMIN_ROLE, PayloadJWT, USER_ROLE } from './type';

const privatePath = ['/my-info', '/dashboard', '/users', '/booking', '/admin-chat'];
const authPath = ['/login', '/register'];
const adminPath = ['/dashboard', '/users', '/profile', '/update-data', '/chat'];


// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  // Check private path
  if (privatePath.some((path) => pathname.startsWith(path)) && !accessToken) {
    return Response.redirect(new URL('/login', request.url));
  }

  if (accessToken) {
    const payloadJWT = decodeJWT<PayloadJWT>(accessToken);
    const role = payloadJWT.scope.split('ROLE_')[1];

    // Không cho người dùng vào trang admin
    if (adminPath.some((path) => pathname.startsWith(path)) && role !== ADMIN_ROLE) {
      return Response.redirect(new URL('/', request.url));
    }

    // Không cho admin vào path khác ngoài admin path
    if (!adminPath.some((path) => pathname.startsWith(path)) && role === ADMIN_ROLE) {
      return Response.redirect(new URL('/dashboard', request.url));
    }

    // Không cho vào trang đăng nhập và đăng ký nếu đã đăng nhập rồi
    if (authPath.some((path) => pathname.startsWith(path)) && role === USER_ROLE) {
      return Response.redirect(new URL('/', request.url));
    }

    if (authPath.some((path) => pathname.startsWith(path)) && role === ADMIN_ROLE) {
      return Response.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/my-info', '/login', '/register', '/dashboard', '/users/:path*', '/profile', '/booking', '/update-data', '/chat/:path*', '/admin-chat',
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}