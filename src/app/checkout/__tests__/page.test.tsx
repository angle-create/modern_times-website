import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Checkout from '../page'
import { useRouter } from 'next/navigation'

// モックデータ
const mockCartItems = [
  {
    id: '1',
    productId: '1',
    name: 'テスト商品1',
    price: 1000,
    quantity: 2,
    imageUrl: '/images/test1.jpg',
  },
]

const mockUser = {
  id: '1',
  name: 'テストユーザー',
  email: 'test@example.com',
  address: {
    postalCode: '123-4567',
    prefecture: '東京都',
    city: '渋谷区',
    street: '1-2-3',
  },
}

// APIレスポンスのモック
jest.mock('@/lib/api', () => ({
  getCartItems: jest.fn(() => Promise.resolve(mockCartItems)),
  getUser: jest.fn(() => Promise.resolve(mockUser)),
  createOrder: jest.fn(() => Promise.resolve({ orderId: '123' })),
}))

// ルーターのモック
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('Checkout', () => {
  beforeEach(() => {
    // ルーターのモックをリセット
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: jest.fn(),
    }))
  })

  it('注文内容が表示されること', async () => {
    render(<Checkout />)
    
    // 商品情報が表示されることを確認
    expect(await screen.findByText('テスト商品1')).toBeInTheDocument()
    expect(screen.getByText('2,000円')).toBeInTheDocument()
    expect(screen.getByText('数量: 2')).toBeInTheDocument()
    
    // 合計金額が表示されることを確認
    expect(screen.getByText('合計: 2,000円')).toBeInTheDocument()
  })

  it('配送先情報が表示されること', async () => {
    render(<Checkout />)
    
    // ユーザー情報が表示されることを確認
    expect(await screen.findByText('テストユーザー')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('123-4567')).toBeInTheDocument()
    expect(screen.getByText('東京都渋谷区1-2-3')).toBeInTheDocument()
  })

  it('支払い方法を選択できること', async () => {
    render(<Checkout />)
    
    // 支払い方法を選択
    const creditCardRadio = screen.getByLabelText('クレジットカード')
    fireEvent.click(creditCardRadio)
    
    expect(creditCardRadio).toBeChecked()
  })

  it('注文を確定できること', async () => {
    const mockPush = jest.fn()
    ;(useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush,
    }))
    
    render(<Checkout />)
    
    // 支払い方法を選択
    const creditCardRadio = await screen.findByLabelText('クレジットカード')
    fireEvent.click(creditCardRadio)
    
    // 注文確定ボタンをクリック
    const confirmButton = screen.getByRole('button', { name: /注文を確定する/i })
    fireEvent.click(confirmButton)
    
    // 注文完了ページに遷移することを確認
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/checkout/complete?orderId=123')
    })
  })

  it('必須項目が未入力の場合エラーが表示されること', async () => {
    render(<Checkout />)
    
    // 支払い方法を選択せずに注文確定ボタンをクリック
    const confirmButton = await screen.findByRole('button', { name: /注文を確定する/i })
    fireEvent.click(confirmButton)
    
    // エラーメッセージが表示されることを確認
    expect(screen.getByText(/支払い方法を選択してください/i)).toBeInTheDocument()
  })
}) 