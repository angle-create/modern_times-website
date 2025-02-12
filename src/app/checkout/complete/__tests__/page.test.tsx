import { render, screen } from '@testing-library/react'
import OrderComplete from '../page'
import { useRouter, useSearchParams } from 'next/navigation'

// モックデータ
const mockOrder = {
  id: '123',
  items: [
    {
      id: '1',
      name: 'テスト商品1',
      price: 1000,
      quantity: 2,
      imageUrl: '/images/test1.jpg',
    },
  ],
  totalAmount: 2000,
  orderDate: '2024-02-12T10:00:00Z',
  shippingAddress: {
    name: 'テストユーザー',
    postalCode: '123-4567',
    prefecture: '東京都',
    city: '渋谷区',
    street: '1-2-3',
  },
  paymentMethod: 'クレジットカード',
  status: '注文受付',
}

// APIレスポンスのモック
jest.mock('@/lib/api', () => ({
  getOrder: jest.fn(() => Promise.resolve(mockOrder)),
}))

// ルーターとクエリパラメータのモック
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))

describe('OrderComplete', () => {
  beforeEach(() => {
    // ルーターのモックをリセット
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: jest.fn(),
    }))
    
    // クエリパラメータのモックをリセット
    ;(useSearchParams as jest.Mock).mockImplementation(() => ({
      get: jest.fn().mockReturnValue('123'),
    }))
  })

  it('注文完了メッセージが表示されること', async () => {
    render(<OrderComplete />)
    
    // 注文完了メッセージが表示されることを確認
    expect(await screen.findByText(/ご注文ありがとうございます/i)).toBeInTheDocument()
    expect(screen.getByText(/注文番号: 123/i)).toBeInTheDocument()
  })

  it('注文内容が表示されること', async () => {
    render(<OrderComplete />)
    
    // 注文内容が表示されることを確認
    expect(await screen.findByText('テスト商品1')).toBeInTheDocument()
    expect(screen.getByText('2,000円')).toBeInTheDocument()
    expect(screen.getByText('数量: 2')).toBeInTheDocument()
    
    // 合計金額が表示されることを確認
    expect(screen.getByText('合計: 2,000円')).toBeInTheDocument()
  })

  it('配送先情報が表示されること', async () => {
    render(<OrderComplete />)
    
    // 配送先情報が表示されることを確認
    expect(await screen.findByText('テストユーザー')).toBeInTheDocument()
    expect(screen.getByText('123-4567')).toBeInTheDocument()
    expect(screen.getByText('東京都渋谷区1-2-3')).toBeInTheDocument()
  })

  it('支払い方法が表示されること', async () => {
    render(<OrderComplete />)
    
    // 支払い方法が表示されることを確認
    expect(await screen.findByText('クレジットカード')).toBeInTheDocument()
  })

  it('注文ステータスが表示されること', async () => {
    render(<OrderComplete />)
    
    // 注文ステータスが表示されることを確認
    expect(await screen.findByText('注文受付')).toBeInTheDocument()
  })

  it('注文日時が表示されること', async () => {
    render(<OrderComplete />)
    
    // 注文日時が表示されることを確認
    expect(await screen.findByText(/2024年2月12日 19:00/)).toBeInTheDocument()
  })
}) 