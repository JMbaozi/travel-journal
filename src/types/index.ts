// ===== Enums & Constants =====

export type Mood = '😄' | '😊' | '😐' | '😴' | '😢' | '🤩' | '😎' | '🥰' | '😤' | '😰' | '🤒' | '😱'

export const MOODS: { value: Mood; label: string }[] = [
  { value: '😄', label: '开心' },
  { value: '😊', label: '愉快' },
  { value: '😐', label: '平静' },
  { value: '😴', label: '疲惫' },
  { value: '😢', label: '难过' },
  { value: '🤩', label: '兴奋' },
  { value: '😎', label: '酷' },
  { value: '🥰', label: '幸福' },
  { value: '😤', label: '生气' },
  { value: '😰', label: '焦虑' },
  { value: '🤒', label: '不适' },
  { value: '😱', label: '震惊' },
]

export type Weather = '☀️' | '⛅' | '☁️' | '🌧️' | '⛈️' | '🌨️' | '🌫️' | '🌈' | '❄️' | '💨'

export const WEATHERS: { value: Weather; label: string }[] = [
  { value: '☀️', label: '晴天' },
  { value: '⛅', label: '多云' },
  { value: '☁️', label: '阴天' },
  { value: '🌧️', label: '下雨' },
  { value: '⛈️', label: '雷雨' },
  { value: '🌨️', label: '下雪' },
  { value: '🌫️', label: '雾' },
  { value: '🌈', label: '彩虹' },
  { value: '❄️', label: '寒冷' },
  { value: '💨', label: '大风' },
]

export type ExpenseCategory = 'food' | 'transport' | 'accommodation' | 'attractions' | 'shopping' | 'other'

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string; icon: string }[] = [
  { value: 'food', label: '餐饮', icon: '🍜' },
  { value: 'transport', label: '交通', icon: '🚇' },
  { value: 'accommodation', label: '住宿', icon: '🏨' },
  { value: 'attractions', label: '景点', icon: '🎫' },
  { value: 'shopping', label: '购物', icon: '🛍️' },
  { value: 'other', label: '其他', icon: '💰' },
]

export const CURRENCIES = ['CNY', 'USD', 'EUR', 'JPY', 'KRW', 'THB', 'GBP', 'AUD', 'TWD', 'HKD'] as const
export type Currency = (typeof CURRENCIES)[number]

// ===== Core Data Models =====

export interface Location {
  lat: number
  lng: number
  name: string
}

export interface ExpenseItem {
  id: string
  category: ExpenseCategory
  amount: number
  currency: Currency
  note: string
}

export interface Trip {
  id: string
  title: string
  coverImage?: string
  destination: string
  startDate: string
  endDate: string
  companion?: string
  budget?: number
  currency: Currency
  tags: string[]
  description?: string
  createdAt: string
  updatedAt: string
}

export interface DayEntry {
  id: string
  tripId: string
  dayNumber: number
  date: string
  title?: string
  content: string
  mood?: Mood
  weather?: Weather
  location?: Location
  expenses?: ExpenseItem[]
  createdAt: string
  updatedAt: string
}

export interface Photo {
  id: string
  entryId: string
  tripId: string
  url: string
  caption?: string
  takenAt?: string
  createdAt: string
}

// ===== App Settings =====

export interface AppSettings {
  theme: 'light' | 'dark'
  defaultCurrency: Currency
  lastExportDate?: string
}

// ===== Input Types =====

export interface CreateTripInput {
  title: string
  destination: string
  startDate: string
  endDate: string
  companion?: string
  budget?: number
  currency: Currency
  tags: string[]
  description?: string
  coverImage?: string
}

export interface CreateDayEntryInput {
  tripId: string
  dayNumber: number
  date: string
  title?: string
  content: string
  mood?: Mood
  weather?: Weather
  location?: Location
  expenses?: ExpenseItem[]
}

// ===== UI Types =====

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  duration: number
}

// ===== Backup Type =====

export interface BackupData {
  version: number
  exportedAt: string
  trips: Trip[]
  dayEntries: DayEntry[]
  photos: Photo[]
  settings: AppSettings | null
}
