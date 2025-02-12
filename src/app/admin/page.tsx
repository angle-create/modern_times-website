import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">ダッシュボード</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          ようこそ {session?.user?.name || '管理者'} さん
        </h2>
        <p className="text-gray-600">
          Modern Times 管理画面へようこそ。
          左のメニューから各種管理機能にアクセスできます。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">商品管理</h3>
          <p className="text-gray-600">
            商品の登録、編集、在庫管理を行えます。
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">注文管理</h3>
          <p className="text-gray-600">
            注文の確認、ステータス更新を行えます。
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">お知らせ管理</h3>
          <p className="text-gray-600">
            お知らせの投稿、編集を行えます。
          </p>
        </div>
      </div>
    </div>
  )
} 