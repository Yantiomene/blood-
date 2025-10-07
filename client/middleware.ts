import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Build backend API root: prefer NEXT_PUBLIC_API_URL, fallback to NEXT_PUBLIC_API_BASE_URL, then localhost:2000/api
function getBackendApiRoot() {
  const rawBase = process.env.NEXT_PUBLIC_API_URL
    || process.env.NEXT_PUBLIC_API_BASE_URL
    || 'http://localhost:2000/api';
  const apiBase = rawBase.replace(/\/api\/?$/, '').replace(/\/$/, '');
  return `${apiBase}/api`;
}

function getAdminEmails(): string[] {
  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS || process.env.ADMIN_EMAILS || '';
  return raw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Require auth cookie
  const token = req.cookies.get('token')?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/site/blog';
    return NextResponse.redirect(url);
  }

  // Validate user and admin via backend profile
  try {
    const apiRoot = getBackendApiRoot();
    const res = await fetch(`${apiRoot}/profile`, {
      headers: {
        // Pass cookie so backend passport-jwt can authenticate
        cookie: `token=${token}`,
      },
      // In middleware on server, credentials option is not needed; cookie header is sufficient
      method: 'GET',
    });

    if (!res.ok) {
      const url = req.nextUrl.clone();
      url.pathname = '/site/blog';
      return NextResponse.redirect(url);
    }

    const data = await res.json();
    const email = String(data?.user?.email || data?.email || '').toLowerCase();
    const admins = getAdminEmails();
    const isAdmin = email && admins.includes(email);
    if (!isAdmin) {
      const url = req.nextUrl.clone();
      url.pathname = '/site/blog';
      return NextResponse.redirect(url);
    }
  } catch (err) {
    const url = req.nextUrl.clone();
    url.pathname = '/site/blog';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};