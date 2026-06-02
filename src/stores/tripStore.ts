import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Trip, CreateTripInput } from '@/types'
import { db } from '@/db'
import { generateId } from '@/utils/id'
import { toPlain } from '@/utils/plain'

export const useTripStore = defineStore('trips', () => {
  const trips = ref<Trip[]>([])
  const isLoading = ref(false)
  const searchQuery = ref('')
  const activeTagFilter = ref<string | null>(null)

  const filteredTrips = computed(() => {
    let result = trips.value
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      )
    }
    if (activeTagFilter.value) {
      result = result.filter((t) => t.tags.includes(activeTagFilter.value!))
    }
    return result
  })

  const allTags = computed(() => {
    const tagSet = new Set<string>()
    trips.value.forEach((t) => t.tags.forEach((tag) => tagSet.add(tag)))
    return Array.from(tagSet).sort()
  })

  const tripCount = computed(() => trips.value.length)

  async function loadAllTrips() {
    isLoading.value = true
    try {
      trips.value = await db.trips.orderBy('startDate').reverse().toArray()
    } finally {
      isLoading.value = false
    }
  }

  async function getTripById(id: string): Promise<Trip | undefined> {
    return db.trips.get(id)
  }

  async function createTrip(input: CreateTripInput): Promise<Trip> {
    const now = new Date().toISOString()
    const trip: Trip = toPlain({
      id: generateId(),
      ...input,
      createdAt: now,
      updatedAt: now,
    })
    await db.trips.add(trip)
    await loadAllTrips()
    return trip
  }

  async function updateTrip(id: string, data: Partial<Trip>): Promise<void> {
    await db.trips.update(id, { ...data, updatedAt: new Date().toISOString() })
    await loadAllTrips()
  }

  async function deleteTrip(id: string): Promise<void> {
    await db.deleteTripCascade(id)
    await loadAllTrips()
  }

  return {
    trips,
    isLoading,
    searchQuery,
    activeTagFilter,
    filteredTrips,
    allTags,
    tripCount,
    loadAllTrips,
    getTripById,
    createTrip,
    updateTrip,
    deleteTrip,
  }
})
