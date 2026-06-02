import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AppSettings, Currency } from '@/types'
import { db } from '@/db'

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  defaultCurrency: 'CNY' as Currency,
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<AppSettings>({ ...DEFAULT_SETTINGS })

  async function loadSettings(): Promise<void> {
    const stored = await db.settings.get('app')
    if (stored) {
      settings.value = stored
    }
  }

  async function updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): Promise<void> {
    settings.value[key] = value
    await db.settings.put({ ...settings.value, key: 'app' } as AppSettings & { key: string })
  }

  async function getStorageStats(): Promise<{
    tripsCount: number
    entriesCount: number
    photosCount: number
  }> {
    const [tripsCount, entriesCount, photosCount] = await Promise.all([
      db.trips.count(),
      db.dayEntries.count(),
      db.photos.count(),
    ])
    return { tripsCount, entriesCount, photosCount }
  }

  async function exportAllData(): Promise<string> {
    return db.exportAll()
  }

  async function importAllData(json: string): Promise<void> {
    await db.importAll(json)
  }

  async function clearAllData(): Promise<void> {
    await db.transaction('rw', db.trips, db.dayEntries, db.photos, db.settings, async () => {
      await db.trips.clear()
      await db.dayEntries.clear()
      await db.photos.clear()
      await db.settings.clear()
    })
  }

  return {
    settings,
    loadSettings,
    updateSetting,
    getStorageStats,
    exportAllData,
    importAllData,
    clearAllData,
  }
})
