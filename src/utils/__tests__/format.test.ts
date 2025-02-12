import {
  formatPrice,
  formatDate,
  formatPostalCode,
  formatPhoneNumber,
  validateEmail,
  validatePassword,
  validatePostalCode,
  validatePhoneNumber,
} from '../format'

describe('formatPrice', () => {
  it('価格を正しくフォーマットすること', () => {
    expect(formatPrice(1000)).toBe('￥1,000')
    expect(formatPrice(1234567)).toBe('￥1,234,567')
    expect(formatPrice(0)).toBe('￥0')
  })
})

describe('formatDate', () => {
  it('日付を正しくフォーマットすること', () => {
    const date = new Date('2024-02-12T10:00:00Z')
    expect(formatDate(date)).toMatch(/2024年2月12日 19:00/)
  })

  it('無効な日付の場合空文字を返すこと', () => {
    expect(formatDate(null)).toBe('')
    expect(formatDate(undefined)).toBe('')
    expect(formatDate('invalid')).toBe('')
  })
})

describe('formatPostalCode', () => {
  it('郵便番号を正しくフォーマットすること', () => {
    expect(formatPostalCode('1234567')).toBe('123-4567')
    expect(formatPostalCode('123-4567')).toBe('123-4567')
  })

  it('7桁未満の場合はそのまま返すこと', () => {
    expect(formatPostalCode('123')).toBe('123')
  })
})

describe('formatPhoneNumber', () => {
  it('11桁の電話番号を正しくフォーマットすること', () => {
    expect(formatPhoneNumber('08012345678')).toBe('080-1234-5678')
  })

  it('10桁の電話番号を正しくフォーマットすること', () => {
    expect(formatPhoneNumber('0312345678')).toBe('031-234-5678')
  })

  it('不正な形式の場合はそのまま返すこと', () => {
    expect(formatPhoneNumber('123')).toBe('123')
  })
})

describe('validateEmail', () => {
  it('有効なメールアドレスを検証できること', () => {
    expect(validateEmail('test@example.com')).toBe(true)
    expect(validateEmail('user.name+tag@example.co.jp')).toBe(true)
  })

  it('無効なメールアドレスを検証できること', () => {
    expect(validateEmail('invalid')).toBe(false)
    expect(validateEmail('test@')).toBe(false)
    expect(validateEmail('@example.com')).toBe(false)
  })
})

describe('validatePassword', () => {
  it('有効なパスワードを検証できること', () => {
    expect(validatePassword('Password123')).toBe(true)
    expect(validatePassword('Strong#Pass999')).toBe(true)
  })

  it('無効なパスワードを検証できること', () => {
    expect(validatePassword('pass')).toBe(false) // 8文字未満
    expect(validatePassword('password')).toBe(false) // 数字なし
    expect(validatePassword('12345678')).toBe(false) // 英字なし
  })
})

describe('validatePostalCode', () => {
  it('有効な郵便番号を検証できること', () => {
    expect(validatePostalCode('123-4567')).toBe(true)
    expect(validatePostalCode('1234567')).toBe(true)
  })

  it('無効な郵便番号を検証できること', () => {
    expect(validatePostalCode('123')).toBe(false)
    expect(validatePostalCode('123-456')).toBe(false)
    expect(validatePostalCode('abc-defg')).toBe(false)
  })
})

describe('validatePhoneNumber', () => {
  it('有効な電話番号を検証できること', () => {
    expect(validatePhoneNumber('03-1234-5678')).toBe(true)
    expect(validatePhoneNumber('0312345678')).toBe(true)
    expect(validatePhoneNumber('080-1234-5678')).toBe(true)
  })

  it('無効な電話番号を検証できること', () => {
    expect(validatePhoneNumber('123')).toBe(false)
    expect(validatePhoneNumber('abc-defg-hijk')).toBe(false)
  })
}) 