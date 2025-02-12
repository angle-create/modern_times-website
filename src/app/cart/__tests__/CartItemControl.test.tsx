import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CartItemControl from '../CartItemControl'
import { updateCartItem, removeCartItem } from '@/lib/api'

// APIのモック
jest.mock('@/lib/api', () => ({
  updateCartItem: jest.fn(),
  removeCartItem: jest.fn(),
}))

// window.confirmのモック
const mockConfirm = jest.fn(() => true)
window.confirm = mockConfirm

describe('CartItemControl', () => {
  const mockProductId = '1'
  const mockInitialQuantity = 2

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('初期数量が正しく表示されること', () => {
    render(
      <CartItemControl
        productId={mockProductId}
        initialQuantity={mockInitialQuantity}
      />
    )

    expect(screen.getByText(mockInitialQuantity.toString())).toBeInTheDocument()
  })

  it('数量を増やすボタンが機能すること', async () => {
    render(
      <CartItemControl
        productId={mockProductId}
        initialQuantity={mockInitialQuantity}
      />
    )

    const increaseButton = screen.getByText('+')
    fireEvent.click(increaseButton)

    await waitFor(() => {
      expect(updateCartItem).toHaveBeenCalledWith(mockProductId, mockInitialQuantity + 1)
    })
  })

  it('数量を減らすボタンが機能すること', async () => {
    render(
      <CartItemControl
        productId={mockProductId}
        initialQuantity={mockInitialQuantity}
      />
    )

    const decreaseButton = screen.getByText('-')
    fireEvent.click(decreaseButton)

    await waitFor(() => {
      expect(updateCartItem).toHaveBeenCalledWith(mockProductId, mockInitialQuantity - 1)
    })
  })

  it('数量が1の時に減らすボタンが無効化されること', () => {
    render(
      <CartItemControl
        productId={mockProductId}
        initialQuantity={1}
      />
    )

    const decreaseButton = screen.getByText('-')
    expect(decreaseButton).toBeDisabled()
  })

  it('削除ボタンをクリックすると確認ダイアログが表示されること', async () => {
    render(
      <CartItemControl
        productId={mockProductId}
        initialQuantity={mockInitialQuantity}
      />
    )

    const deleteButton = screen.getByText('削除')
    fireEvent.click(deleteButton)

    expect(mockConfirm).toHaveBeenCalledWith('この商品をカートから削除してもよろしいですか？')
  })

  it('削除が確認された場合、APIが呼び出されること', async () => {
    render(
      <CartItemControl
        productId={mockProductId}
        initialQuantity={mockInitialQuantity}
      />
    )

    const deleteButton = screen.getByText('削除')
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(removeCartItem).toHaveBeenCalledWith(mockProductId)
    })
  })

  it('APIエラー時にアラートが表示されること', async () => {
    const mockError = new Error('API Error')
    ;(updateCartItem as jest.Mock).mockRejectedValueOnce(mockError)
    
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation()

    render(
      <CartItemControl
        productId={mockProductId}
        initialQuantity={mockInitialQuantity}
      />
    )

    const increaseButton = screen.getByText('+')
    fireEvent.click(increaseButton)

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('数量の更新に失敗しました。もう一度お試しください。')
    })
  })
}) 