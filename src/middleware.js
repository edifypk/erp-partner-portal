import { NextResponse } from 'next/server';

const getUserProfile = async (token) => {
  if (!token) return null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/users/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      // Edge runtime fetch defaults are fine; no need for cache here
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const json = await res.json();

    return json?.data ?? null;
  } catch (error) {
    return null;
  }
};

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;



  const user = await getUserProfile(token);





  // Redirect to login if accessing dashboard without token or valid user
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (pathname === '/login' && user) {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
}


export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
