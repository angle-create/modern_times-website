import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function middleware(request: NextRequest) {
  // APIエンドポイントとアセットのリクエストは除外
  if (
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // アクセス統計の記録
  try {
    await prisma.pageView.create({
      data: {
        path: request.nextUrl.pathname,
        userAgent: request.headers.get('user-agent') || undefined
      }
    })
  } catch (error) {
    console.error('Page view logging error:', error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*'
} 