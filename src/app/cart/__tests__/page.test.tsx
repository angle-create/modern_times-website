import { render, screen, fireEvent } from '@testing-library/react'
import Cart from '../page'
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
  {
    id: '2',
    productId: '2',
    name: 'テスト商品2',
    price: 2000,
    quantity: 1,
    imageUrl: '/images/test2.jpg',
  },
]

// APIレスポンスのモック
jest.mock('@/lib/api', () => ({
  getCartItems: jest.fn(() => Promise.resolve(mockCartItems)),
  updateCartItem: jest.fn(() => Promise.resolve({ success: true })),
  removeCartItem: jest.fn(() => Promise.resolve({ success: true })),
}))

// ルーターのモック
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('Cart', () => {
  beforeEach(() => {
    // ルーターのモックをリセット
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: jest.fn(),
    }))
  })

  it('カート内の商品が表示されること', async () => {
    render(<Cart />)
    
    // カート内の商品が表示されることを確認
    const cartItems = await screen.findAllByRole('listitem')
    expect(cartItems).toHaveLength(2)
    
    // 商品の詳細が正しく表示されることを確認
    expect(screen.getByText('テスト商品1')).toBeInTheDocument()
    expect(screen.getByText('2,000円')).toBeInTheDocument()
    expect(screen.getByText('数量: 2')).toBeInTheDocument()
  })

  it('商品の数量を更新できること', async () => {
    render(<Cart />)
    
    // 数量を変更
    const quantityInputs = await screen.findAllByRole('spinbutton')
    fireEvent.change(quantityInputs[0], { target: { value: '3' } })
    
    // 更新ボタンをクリック
    const updateButtons = screen.getAllByRole('button', { name: /更新/i })
    fireEvent.click(updateButtons[0])
    
    // 成功メッセージが表示されることを確認
    expect(await screen.findByText(/数量を更新しました/i)).toBeInTheDocument()
  })

  it('商品を削除できること', async () => {
    render(<Cart />)
    
    // 削除ボタンをクリック
    const deleteButtons = await screen.findAllByRole('button', { name: /削除/i })
    fireEvent.click(deleteButtons[0])
    
    // 確認ダイアログで「はい」をクリック
    const confirmButton = screen.getByRole('button', { name: /はい/i })
    fireEvent.click(confirmButton)
    
    // 成功メッセージが表示されることを確認
    expect(await screen.findByText(/商品を削除しました/i)).toBeInTheDocument()
  })

  it('合計金額が正しく計算されること', async () => {
    render(<Cart />)
    
    // 合計金額が正しく表示されることを確認
    expect(await screen.findByText('合計: 4,000円')).toBeInTheDocument()
  })

  it('注文手続きに進めること', async () => {
    const mockPush = jest.fn()
    ;(useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush,
    }))
    
    render(<Cart />)
    
    // 注文手続きボタンをクリック
    const checkoutButton = await screen.findByRole('button', { name: /注文手続きへ/i })
    fireEvent.click(checkoutButton)
    
    // 注文ページに遷移することを確認
    expect(mockPush).toHaveBeenCalledWith('/checkout')
  })
}) 