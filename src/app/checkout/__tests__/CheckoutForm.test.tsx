import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CheckoutForm from '../CheckoutForm'
import { createOrder } from '@/lib/api'

// APIのモック
jest.mock('@/lib/api', () => ({
  createOrder: jest.fn(),
}))

describe('CheckoutForm', () => {
  const mockCartItems = [
    {
      id: '1',
      name: 'テスト商品1',
      price: 1000,
      quantity: 2,
    },
  ]
  const mockTotalAmount = 2000

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('必須フィールドが空の場合にエラーメッセージが表示されること', async () => {
    render(<CheckoutForm cartItems={mockCartItems} totalAmount={mockTotalAmount} />)

    const submitButton = screen.getByRole('button', { name: '注文を確定する' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('名前を入力してください')).toBeInTheDocument()
      expect(screen.getByText('メールアドレスを入力してください')).toBeInTheDocument()
      expect(screen.getByText('郵便番号を入力してください')).toBeInTheDocument()
      expect(screen.getByText('住所を入力してください')).toBeInTheDocument()
      expect(screen.getByText('電話番号を入力してください')).toBeInTheDocument()
      expect(screen.getByText('配達希望日を選択してください')).toBeInTheDocument()
      expect(screen.getByText('配達希望時間を選択してください')).toBeInTheDocument()
      expect(screen.getByText('支払い方法を選択してください')).toBeInTheDocument()
    })
  })

  it('無効なメールアドレスの場合にエラーメッセージが表示されること', async () => {
    render(<CheckoutForm cartItems={mockCartItems} totalAmount={mockTotalAmount} />)

    const emailInput = screen.getByLabelText('メールアドレス')
    await userEvent.type(emailInput, 'invalid-email')

    const submitButton = screen.getByRole('button', { name: '注文を確定する' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('有効なメールアドレスを入力してください')).toBeInTheDocument()
    })
  })

  it('郵便番号が自動的にフォーマットされること', async () => {
    render(<CheckoutForm cartItems={mockCartItems} totalAmount={mockTotalAmount} />)

    const postalCodeInput = screen.getByLabelText('郵便番号')
    await userEvent.type(postalCodeInput, '1234567')

    expect(postalCodeInput).toHaveValue('123-4567')
  })

  it('電話番号が自動的にフォーマットされること', async () => {
    render(<CheckoutForm cartItems={mockCartItems} totalAmount={mockTotalAmount} />)

    const phoneInput = screen.getByLabelText('電話番号')
    await userEvent.type(phoneInput, '09012345678')

    expect(phoneInput).toHaveValue('090-1234-5678')
  })

  it('有効なデータで送信が成功すること', async () => {
    const mockOrder = { id: '123' }
    ;(createOrder as jest.Mock).mockResolvedValueOnce(mockOrder)

    render(<CheckoutForm cartItems={mockCartItems} totalAmount={mockTotalAmount} />)

    // フォームに有効なデータを入力
    await userEvent.type(screen.getByLabelText('お名前'), 'テスト太郎')
    await userEvent.type(screen.getByLabelText('メールアドレス'), 'test@example.com')
    await userEvent.type(screen.getByLabelText('郵便番号'), '1234567')
    await userEvent.type(screen.getByLabelText('住所'), 'テスト県テスト市1-2-3')
    await userEvent.type(screen.getByLabelText('電話番号'), '09012345678')
    
    // 配達希望日時を選択
    const deliveryDateSelect = screen.getByLabelText('配達希望日')
    const deliveryTimeSelect = screen.getByLabelText('配達希望時間')
    fireEvent.change(deliveryDateSelect, { target: { value: deliveryDateSelect.options[1].value } })
    fireEvent.change(deliveryTimeSelect, { target: { value: '10:00-12:00' } })

    // 支払い方法を選択
    const creditCardRadio = screen.getByLabelText('クレジットカード')
    fireEvent.click(creditCardRadio)

    // フォームを送信
    const submitButton = screen.getByRole('button', { name: '注文を確定する' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(createOrder).toHaveBeenCalled()
    })
  })

  it('送信中は送信ボタンが無効化されること', async () => {
    ;(createOrder as jest.Mock).mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(<CheckoutForm cartItems={mockCartItems} totalAmount={mockTotalAmount} />)

    // フォームに有効なデータを入力
    await userEvent.type(screen.getByLabelText('お名前'), 'テスト太郎')
    await userEvent.type(screen.getByLabelText('メールアドレス'), 'test@example.com')
    await userEvent.type(screen.getByLabelText('郵便番号'), '1234567')
    await userEvent.type(screen.getByLabelText('住所'), 'テスト県テスト市1-2-3')
    await userEvent.type(screen.getByLabelText('電話番号'), '09012345678')
    
    const submitButton = screen.getByRole('button', { name: '注文を確定する' })
    fireEvent.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(screen.getByText('処理中...')).toBeInTheDocument()
  })

  it('APIエラー時にアラートが表示されること', async () => {
    const mockError = new Error('API Error')
    ;(createOrder as jest.Mock).mockRejectedValueOnce(mockError)
    
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation()

    render(<CheckoutForm cartItems={mockCartItems} totalAmount={mockTotalAmount} />)

    // フォームに有効なデータを入力
    await userEvent.type(screen.getByLabelText('お名前'), 'テスト太郎')
    await userEvent.type(screen.getByLabelText('メールアドレス'), 'test@example.com')
    await userEvent.type(screen.getByLabelText('郵便番号'), '1234567')
    await userEvent.type(screen.getByLabelText('住所'), 'テスト県テスト市1-2-3')
    await userEvent.type(screen.getByLabelText('電話番号'), '09012345678')

    const submitButton = screen.getByRole('button', { name: '注文を確定する' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('注文の作成に失敗しました。もう一度お試しください。')
    })
  })
}) 