import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-brown-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="text-2xl font-bold text-brown-600">
              Modern Times
            </Link>
            <p className="text-gray-500 text-sm">
              手作りにこだわった、温かみのあるケーキをお届けします。
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">メニュー</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      href="/menu#cake"
                      className="text-sm text-gray-500 hover:text-brown-600"
                    >
                      ケーキ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/menu#sweets"
                      className="text-sm text-gray-500 hover:text-brown-600"
                    >
                      焼き菓子
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/menu#drink"
                      className="text-sm text-gray-500 hover:text-brown-600"
                    >
                      ドリンク
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  店舗情報
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      href="/store#access"
                      className="text-sm text-gray-500 hover:text-brown-600"
                    >
                      アクセス
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/store#hours"
                      className="text-sm text-gray-500 hover:text-brown-600"
                    >
                      営業時間
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/store#parking"
                      className="text-sm text-gray-500 hover:text-brown-600"
                    >
                      駐車場情報
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  お問い合わせ
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      href="/contact"
                      className="text-sm text-gray-500 hover:text-brown-600"
                    >
                      お問い合わせフォーム
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Modern Times. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 