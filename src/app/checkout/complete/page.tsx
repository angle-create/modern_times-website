import { Metadata } from 'next'
import Link from 'next/link'
import { getOrder } from '@/lib/api'
import { formatPrice } from '@/utils/format'

export const metadata: Metadata = {
  title: '注文完了 - Modern Times',
  description: 'ご注文ありがとうございました。',
}

export default async function CheckoutCompletePage({
  searchParams,
}: {
  searchParams: { orderId: string }
}) {
  const order = await getOrder(searchParams.orderId)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-brown-900 mb-4">
          ご注文ありがとうございました
        </h1>
        <p className="text-gray-600 mb-8">
          ご注文の確認メールをお送りしましたので、ご確認ください。
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-brown-900 mb-4">注文内容</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">注文番号</p>
            <p className="text-gray-900">{order.id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">お届け先</p>
            <p className="text-gray-900">
              〒{order.postalCode}
              <br />
              {order.address}
              <br />
              {order.name} 様
              <br />
              {order.phoneNumber}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">お届け希望日時</p>
            <p className="text-gray-900">
              {new Date(order.deliveryDate).toLocaleDateString('ja-JP')}
              <br />
              {order.deliveryTime}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">支払い方法</p>
            <p className="text-gray-900">
              {order.paymentMethod === 'credit_card'
                ? 'クレジットカード'
                : '銀行振込'}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">注文商品</p>
            <div className="mt-2 space-y-2">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-gray-900">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between">
              <span className="text-base font-medium text-gray-900">合計</span>
              <span className="text-lg font-bold text-brown-900">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link href="/" className="btn-primary">
          トップページへ戻る
        </Link>
      </div>
    </div>
  )
}