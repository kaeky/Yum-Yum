import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl;

  // Get subdomain from hostname
  // Example: demo-restaurant.yumyum.com -> demo-restaurant
  // or demo-restaurant.localhost:3001 -> demo-restaurant (for dev)
  const hostParts = hostname.split('.');

  // For development: handle localhost with subdomain (demo.localhost:3001)
  // For production: handle yumyum.com subdomains (demo.yumyum.com)
  let subdomain = '';

  if (hostname.includes('localhost')) {
    // Development: demo.localhost:3001
    // If accessing just localhost:3001, check for ?restaurant query param
    if (hostParts[0] === 'localhost' || hostParts.length === 1) {
      // Check if there's a restaurant query param for local development
      const restaurantParam = url.searchParams.get('restaurant');
      if (restaurantParam) {
        subdomain = restaurantParam;
      } else {
        subdomain = '';
      }
    } else {
      subdomain = hostParts[0];
    }
  } else {
    // Production: demo.yumyum.com
    // Remove main domain and get subdomain
    if (hostParts.length >= 3) {
      // demo.yumyum.com -> ['demo', 'yumyum', 'com']
      subdomain = hostParts[0];
    }
  }

  // Skip if no subdomain (main domain access - show marketplace)
  if (!subdomain || subdomain === 'www' || subdomain === 'yumyum') {
    // Show marketplace/landing page
    return NextResponse.next();
  }

  // If we have a subdomain, redirect to /restaurant page
  // and pass the slug via headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-restaurant-slug', subdomain);

  // If not already on /restaurant, redirect there
  if (url.pathname === '/' || url.pathname === '') {
    return NextResponse.rewrite(new URL('/restaurant', request.url), {
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
