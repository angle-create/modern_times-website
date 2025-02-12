import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Modern Times',
  description: '記念日ケーキ専門店 - 大切な記念日を彩る特別なケーキをお届けします',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="relative w-80 h-16">
                  <Image
                    src="/images/site-logo.png"
                    alt="Modern Times - 記念日ケーキ専門店"
                    fill
                    className="object-contain"
                    priority
                  />
                </Link>
              </div>
              <nav className="hidden sm:flex sm:space-x-8 items-center">
                <Link
                  href="/products"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-brown-600"
                >
                  商品一覧
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-brown-600"
                >
                  店舗案内
                </Link>
                <Link
                  href="/news"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-brown-600"
                >
                  お知らせ
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-brown-600"
                >
                  お問い合わせ
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-white">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <Link href="/" className="relative w-80 h-16 mb-4 inline-block">
                  <Image
                    src="/images/site-logo.png"
                    alt="Modern Times - 記念日ケーキ専門店"
                    fill
                    className="object-contain"
                  />
                </Link>
                <p className="text-gray-500 text-sm">
                  記念日ケーキ専門店 - 大切な記念日を彩る特別なケーキをお届けします
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  ショップ情報
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      href="/products"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      商品一覧
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      店舗案内
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/news"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      お知らせ
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  カスタマーサポート
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      href="/contact"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      お問い合わせ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      プライバシーポリシー
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      利用規約
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-200 pt-8">
              <p className="text-base text-gray-400 text-center">
                &copy; {new Date().getFullYear()} Modern Times. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
} 