import Dexie, { type Table } from 'dexie'
import type { Trip, DayEntry, Photo, AppSettings } from '@/types'

class TravelJournalDB extends Dexie {
  trips!: Table<Trip, string>
  dayEntries!: Table<DayEntry, string>
  photos!: Table<Photo, string>
  settings!: Table<AppSettings & { key: string }, string>

  constructor() {
    super('TravelJournalDB')

    this.version(1).stores({
      trips: 'id, title, destination, startDate, endDate, createdAt',
      dayEntries: 'id, tripId, dayNumber, date, [tripId+dayNumber]',
      photos: 'id, entryId, tripId, takenAt',
      settings: 'key',
    })

    this.trips.hook('creating', (_primKey, obj) => {
      const now = new Date().toISOString()
      obj.createdAt = obj.createdAt || now
      obj.updatedAt = now
    })

    this.dayEntries.hook('creating', (_primKey, obj) => {
      const now = new Date().toISOString()
      obj.createdAt = obj.createdAt || now
      obj.updatedAt = now
    })
  }

  async deleteTripCascade(tripId: string): Promise<void> {
    await this.transaction('rw', this.trips, this.dayEntries, this.photos, async () => {
      await this.trips.delete(tripId)
      await this.dayEntries.where('tripId').equals(tripId).delete()
      await this.photos.where('tripId').equals(tripId).delete()
    })
  }

  async deleteEntryCascade(entryId: string): Promise<void> {
    await this.transaction('rw', this.dayEntries, this.photos, async () => {
      await this.dayEntries.delete(entryId)
      await this.photos.where('entryId').equals(entryId).delete()
    })
  }

  async exportAll(): Promise<string> {
    const [trips, dayEntries, photos, storedSettings] = await Promise.all([
      this.trips.toArray(),
      this.dayEntries.toArray(),
      this.photos.toArray(),
      this.settings.toArray(),
    ])
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      trips,
      dayEntries,
      photos,
      settings: storedSettings[0] || null,
    }
    return JSON.stringify(backup, null, 2)
  }

  async importAll(json: string): Promise<void> {
    const backup = JSON.parse(json)
    if (!backup.version || !backup.trips || !backup.dayEntries || !backup.photos) {
      throw new Error('无效的备份文件格式')
    }
    await this.transaction('rw', this.trips, this.dayEntries, this.photos, this.settings, async () => {
      await this.trips.clear()
      await this.dayEntries.clear()
      await this.photos.clear()
      await this.settings.clear()
      await this.trips.bulkAdd(backup.trips)
      await this.dayEntries.bulkAdd(backup.dayEntries)
      await this.photos.bulkAdd(backup.photos)
      if (backup.settings) {
        await this.settings.put(backup.settings)
      }
    })
  }
}

export const db = new TravelJournalDB()
