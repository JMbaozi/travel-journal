import { format, parseISO, differenceInDays, addDays } from 'date-fns'

export function formatDateRange(start: string, end: string): string {
  const s = parseISO(start)
  const e = parseISO(end)
  return `${format(s, 'MMM d')} – ${format(e, 'MMM d, yyyy')}`
}

export function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr), 'EEE, MMM d')
}

export function formatDayLabel(dayNumber: number, dateStr: string): string {
  return `Day ${dayNumber} — ${format(parseISO(dateStr), 'MMM d')}`
}

export function getTripDuration(start: string, end: string): number {
  return differenceInDays(parseISO(end), parseISO(start)) + 1
}

export function getDayDate(tripStart: string, dayNumber: number): string {
  return format(addDays(parseISO(tripStart), dayNumber - 1), 'yyyy-MM-dd')
}

export { format, parseISO, addDays, differenceInDays }
