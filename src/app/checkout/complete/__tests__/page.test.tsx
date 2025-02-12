import { render, screen } from '@testing-library/react'
import CheckoutCompletePage from '../page'
import { getOrder } from '@/lib/api'

// APIのモック
jest.mock('@/lib/api', () => ({
  getOrder: jest.fn(),
}))

describe('CheckoutCompletePage', () => {
  const mockOrder = {
    id: '123',
    name: 'テスト太郎',
    email: 'test@example.com',
    postalCode: '123-4567',
    address: 'テスト県テスト市1-2-3',
    phoneNumber: '090-1234-5678',
    deliveryDate: '2024-03-01',
    deliveryTime: '10:00-12:00',
    paymentMethod: 'credit_card',
    items: [
      {
        id: '1',
        name: 'テスト商品1',
        price: 1000,
        quantity: 2,
      },
    ],
    totalAmount: 2000,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getOrder as jest.Mock).mockResolvedValue(mockOrder)
  })

  it('注文完了メッセージが表示されること', async () => {
    render(await CheckoutCompletePage({ searchParams: { orderId: '123' } }))

    expect(screen.getByText('ご注文ありがとうございました')).toBeInTheDocument()
    expect(
      screen.getByText('ご注文の確認メールをお送りしましたので、ご確認ください。')
    ).toBeInTheDocument()
  })

  it('注文情報が正しく表示されること', async () => {
    render(await CheckoutCompletePage({ searchParams: { orderId: '123' } }))

    // 注文番号
    expect(screen.getByText('123')).toBeInTheDocument()

    // お届け先情報
    expect(screen.getByText(/テスト太郎/)).toBeInTheDocument()
    expect(screen.getByText(/123-4567/)).toBeInTheDocument()
    expect(screen.getByText(/テスト県テスト市1-2-3/)).toBeInTheDocument()
    expect(screen.getByText(/090-1234-5678/)).toBeInTheDocument()

    // お届け日時
    expect(screen.getByText('2024年3月1日')).toBeInTheDocument()
    expect(screen.getByText('10:00-12:00')).toBeInTheDocument()

    // 支払い方法
    expect(screen.getByText('クレジットカード')).toBeInTheDocument()

    // 注文商品
    expect(screen.getByText(/テスト商品1/)).toBeInTheDocument()
    expect(screen.getByText(/× 2/)).toBeInTheDocument()
    expect(screen.getByText(/¥2,000/)).toBeInTheDocument()
  })

  it('トップページへのリンクが表示されること', async () => {
    render(await CheckoutCompletePage({ searchParams: { orderId: '123' } }))

    const link = screen.getByRole('link', { name: 'トップページへ戻る' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })

  it('注文情報の取得に失敗した場合エラーがスローされること', async () => {
    const error = new Error('Failed to fetch order')
    ;(getOrder as jest.Mock).mockRejectedValue(error)

    await expect(
      CheckoutCompletePage({ searchParams: { orderId: '123' } })
    ).rejects.toThrow('Failed to fetch order')
  })
}) 