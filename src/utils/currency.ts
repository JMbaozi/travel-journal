const SYMBOLS: Record<string, string> = {
  CNY: '¥', USD: '$', EUR: '€', JPY: '¥', KRW: '₩', THB: '฿', GBP: '£', AUD: 'A$', TWD: 'NT$', HKD: 'HK$',
}

export function getCurrencySymbol(code: string): string {
  return SYMBOLS[code] || code
}

export function formatAmount(amount: number, currency: string): string {
  return `${getCurrencySymbol(currency)}${amount.toLocaleString()}`
}
