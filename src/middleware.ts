import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // ログインページは常にアクセス可能
  if (path === '/admin/login') {
    return NextResponse.next()
  }

  // 管理画面のパスチェック
  if (path.startsWith('/admin')) {
    const token = await getToken({ req: request })
    
    // 未認証の場合
    if (!token) {
      const url = new URL('/admin/login', request.url)
      return NextResponse.redirect(url)
    }

    // 管理者権限チェック
    if (token.role !== 'admin') {
      const url = new URL('/admin/login', request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
} 