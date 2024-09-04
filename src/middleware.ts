import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const privatePath = ['/my-info'];
const authPath = ['/login', '/register'];


// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  // Check private path
  if (privatePath.includes(pathname) && !accessToken) {
    return Response.redirect(new URL('/login', request.url));
  }

  // Không cho vào trang đăng nhập và đăng ký nếu đã đăng nhập rồi
  if (authPath.includes(pathname) && accessToken) {
    return Response.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/my-info', '/login', '/register'
  ],
}