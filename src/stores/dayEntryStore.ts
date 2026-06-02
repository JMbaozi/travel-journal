import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DayEntry, CreateDayEntryInput } from '@/types'
import { db } from '@/db'
import { generateId } from '@/utils/id'
import { toPlain } from '@/utils/plain'

export const useDayEntryStore = defineStore('dayEntries', () => {
  const entriesByTrip = ref<Record<string, DayEntry[]>>({})

  const isLoading = ref(false)

  function getEntriesForTrip(tripId: string): DayEntry[] {
    return entriesByTrip.value[tripId] || []
  }

  async function loadEntriesForTrip(tripId: string): Promise<DayEntry[]> {
    isLoading.value = true
    try {
      const entries = await db.dayEntries
        .where('tripId')
        .equals(tripId)
        .sortBy('dayNumber')
      entriesByTrip.value[tripId] = entries
      return entries
    } finally {
      isLoading.value = false
    }
  }

  async function getEntryById(id: string): Promise<DayEntry | undefined> {
    return db.dayEntries.get(id)
  }

  async function createEntry(input: CreateDayEntryInput): Promise<DayEntry> {
    const now = new Date().toISOString()
    const entry: DayEntry = toPlain({
      id: generateId(),
      ...input,
      createdAt: now,
      updatedAt: now,
    })
    await db.dayEntries.add(entry)
    // Refresh the trip's entries
    await loadEntriesForTrip(input.tripId)
    return entry
  }

  async function updateEntry(id: string, data: Partial<DayEntry>): Promise<void> {
    await db.dayEntries.update(id, toPlain({ ...data, updatedAt: new Date().toISOString() }))
    const entry = await db.dayEntries.get(id)
    if (entry) {
      await loadEntriesForTrip(entry.tripId)
    }
  }

  async function deleteEntry(id: string): Promise<void> {
    const entry = await db.dayEntries.get(id)
    if (!entry) return
    await db.deleteEntryCascade(id)
    await loadEntriesForTrip(entry.tripId)
  }

  async function getNextDayNumber(tripId: string): Promise<number> {
    const entries = await db.dayEntries
      .where('tripId')
      .equals(tripId)
      .toArray()
    if (entries.length === 0) return 1
    return Math.max(...entries.map((e) => e.dayNumber)) + 1
  }

  return {
    entriesByTrip,
    isLoading,
    getEntriesForTrip,
    loadEntriesForTrip,
    getEntryById,
    createEntry,
    updateEntry,
    deleteEntry,
    getNextDayNumber,
  }
})
