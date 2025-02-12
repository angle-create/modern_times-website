/**
 * 価格を日本円表示にフォーマットする
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    currencyDisplay: 'symbol',
  }).format(price)
}

/**
 * 日付を日本語表示にフォーマットする
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return ''
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return ''
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  } catch {
    return ''
  }
}

/**
 * 郵便番号をフォーマットする
 */
export function formatPostalCode(code: string): string {
  const digits = code.replace(/[^\d]/g, '')
  if (digits.length === 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`
  }
  return code
}

/**
 * 電話番号をフォーマットする
 */
export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/[^\d]/g, '')
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return phone
}

/**
 * メールアドレスを検証する
 */
export function validateEmail(email: string): boolean {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return pattern.test(email)
}

/**
 * パスワードを検証する
 */
export function validatePassword(password: string): boolean {
  // 8文字以上、英字と数字を含む
  const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()]{8,}$/
  return pattern.test(password)
}

/**
 * 郵便番号を検証する
 */
export function validatePostalCode(code: string): boolean {
  const pattern = /^\d{3}-?\d{4}$/
  return pattern.test(code)
}

/**
 * 電話番号を検証する
 */
export function validatePhoneNumber(phone: string): boolean {
  const pattern = /^0\d{1,4}-?\d{1,4}-?\d{4}$/
  return pattern.test(phone)
} 