'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createOrder } from '@/lib/api'
import { formatPostalCode, formatPhoneNumber } from '@/utils/format'

const checkoutSchema = z.object({
  name: z.string().min(1, '名前を入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  postalCode: z.string()
    .min(1, '郵便番号を入力してください')
    .regex(/^\d{3}-?\d{4}$/, '正しい郵便番号を入力してください'),
  address: z.string().min(1, '住所を入力してください'),
  phoneNumber: z.string()
    .min(1, '電話番号を入力してください')
    .regex(/^0\d{1,4}-?\d{1,4}-?\d{4}$/, '正しい電話番号を入力してください'),
  deliveryDate: z.string().min(1, '配達希望日を選択してください'),
  deliveryTime: z.string().min(1, '配達希望時間を選択してください'),
  paymentMethod: z.enum(['credit_card', 'bank_transfer'], {
    required_error: '支払い方法を選択してください',
  }),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

type Props = {
  cartItems: any[]
  totalAmount: number
}

export default function CheckoutForm({ cartItems, totalAmount }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

  // 配達可能日時の生成（3日後から14日後まで）
  const deliveryDates = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i + 3)
    return date.toISOString().split('T')[0]
  })

  const deliveryTimes = [
    '10:00-12:00',
    '12:00-14:00',
    '14:00-16:00',
    '16:00-18:00',
    '18:00-20:00',
  ]

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPostalCode(e.target.value)
    setValue('postalCode', formatted)
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setValue('phoneNumber', formatted)
  }

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsSubmitting(true)
      const order = await createOrder({
        ...data,
        items: cartItems,
        totalAmount,
      })
      router.push(`/checkout/complete?orderId=${order.id}`)
    } catch (error) {
      console.error('注文の作成に失敗しました:', error)
      alert('注文の作成に失敗しました。もう一度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          お名前
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          メールアドレス
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="postalCode"
          className="block text-sm font-medium text-gray-700"
        >
          郵便番号
        </label>
        <input
          type="text"
          id="postalCode"
          {...register('postalCode')}
          onChange={handlePostalCodeChange}
          placeholder="123-4567"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
        />
        {errors.postalCode && (
          <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700"
        >
          住所
        </label>
        <input
          type="text"
          id="address"
          {...register('address')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-gray-700"
        >
          電話番号
        </label>
        <input
          type="tel"
          id="phoneNumber"
          {...register('phoneNumber')}
          onChange={handlePhoneNumberChange}
          placeholder="090-1234-5678"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
        />
        {errors.phoneNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="deliveryDate"
          className="block text-sm font-medium text-gray-700"
        >
          配達希望日
        </label>
        <select
          id="deliveryDate"
          {...register('deliveryDate')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
        >
          <option value="">選択してください</option>
          {deliveryDates.map((date) => (
            <option key={date} value={date}>
              {new Date(date).toLocaleDateString('ja-JP')}
            </option>
          ))}
        </select>
        {errors.deliveryDate && (
          <p className="mt-1 text-sm text-red-600">{errors.deliveryDate.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="deliveryTime"
          className="block text-sm font-medium text-gray-700"
        >
          配達希望時間
        </label>
        <select
          id="deliveryTime"
          {...register('deliveryTime')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brown-500 focus:ring-brown-500"
        >
          <option value="">選択してください</option>
          {deliveryTimes.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        {errors.deliveryTime && (
          <p className="mt-1 text-sm text-red-600">{errors.deliveryTime.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          支払い方法
        </label>
        <div className="mt-2 space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              id="credit_card"
              value="credit_card"
              {...register('paymentMethod')}
              className="h-4 w-4 text-brown-600 focus:ring-brown-500"
            />
            <label
              htmlFor="credit_card"
              className="ml-2 block text-sm text-gray-700"
            >
              クレジットカード
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="bank_transfer"
              value="bank_transfer"
              {...register('paymentMethod')}
              className="h-4 w-4 text-brown-600 focus:ring-brown-500"
            />
            <label
              htmlFor="bank_transfer"
              className="ml-2 block text-sm text-gray-700"
            >
              銀行振込
            </label>
          </div>
        </div>
        {errors.paymentMethod && (
          <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-primary disabled:opacity-50"
      >
        {isSubmitting ? '処理中...' : '注文を確定する'}
      </button>
    </form>
  )
} 