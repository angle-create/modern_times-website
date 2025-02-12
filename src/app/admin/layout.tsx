'use client'

import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const navigation = [
  { name: 'ダッシュボード', href: '/admin' },
  { name: '商品管理', href: '/admin/products' },
  { name: '在庫管理', href: '/admin/inventory' },
  { name: '注文管理', href: '/admin/orders' },
  { name: 'レビュー管理', href: '/admin/reviews' },
  { name: 'お知らせ管理', href: '/admin/news' },
  { name: 'お問い合わせ管理', href: '/admin/inquiries' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session || session.user.role !== 'admin') {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin" className="text-2xl font-bold text-brown-600">
                  Modern Times 管理画面
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-2">
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        group flex items-center px-3 py-2 text-sm font-medium rounded-md
                        ${
                          isActive
                            ? 'bg-brown-100 text-brown-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>

            <main className="col-span-12 lg:col-span-10">
              <div className="bg-white shadow rounded-lg p-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
} 