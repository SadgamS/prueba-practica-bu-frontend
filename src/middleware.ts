import { NextRequest, NextResponse } from 'next/server';

export const middleware = (req: NextRequest) => {
  const token = req.cookies.get('token');

  try {
    if (req.nextUrl.pathname == '/') {
      if (token?.value) {
        const url = req.nextUrl.clone();
        url.pathname = '/admin/home';
        return NextResponse.redirect(url);
      } else {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }
    }

    if (req.nextUrl.pathname == '/login') {
      if (token?.value) {
        const url = req.nextUrl.clone();
        url.pathname = '/admin/home';
        return NextResponse.redirect(url);
      } else {
        return NextResponse.next();
      }
    }

    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (token?.value) {
        return NextResponse.next();
      } else {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  } catch (e) {
    console.error(e);
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
};

export const config = {
  matcher: ['/admin/:path*', '/login', '/'],
};
