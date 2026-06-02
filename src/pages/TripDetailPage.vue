<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTripStore } from '@/stores/tripStore'
import { useDayEntryStore } from '@/stores/dayEntryStore'
import { useUIStore } from '@/stores/uiStore'
import type { Trip } from '@/types'
import TripCoverHeader from '@/components/trip/TripCoverHeader.vue'
import TabNavigation from '@/components/trip/TabNavigation.vue'
import TimelineView from '@/components/trip/TimelineView.vue'
import GalleryGrid from '@/components/gallery/GalleryGrid.vue'
import TripMap from '@/components/map/TripMap.vue'
import TripStatsPanel from '@/components/trip/TripStatsPanel.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const props = defineProps<{
  tripId: string
}>()

const router = useRouter()
const tripStore = useTripStore()
const dayEntryStore = useDayEntryStore()
const uiStore = useUIStore()

const trip = ref<Trip | null>(null)
const isLoading = ref(true)

const activeTab = ref<'journal' | 'gallery' | 'map' | 'stats'>('journal')

const currentTrip = computed(() => trip.value!)

onMounted(async () => {
  try {
    isLoading.value = true
    trip.value = (await tripStore.getTripById(props.tripId)) ?? null
    if (!trip.value) {
      router.replace({ name: 'not-found' })
      return
    }
    await dayEntryStore.loadEntriesForTrip(props.tripId)
  } catch (e) {
    console.error('加载行程失败:', e)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div>
    <LoadingSpinner v-if="isLoading" />
    <div v-else-if="trip">
      <TripCoverHeader :trip="currentTrip" />
      <div class="max-w-7xl mx-auto px-4 py-6">
        <TabNavigation v-model="activeTab" />
        <div class="mt-6">
          <TimelineView v-if="activeTab === 'journal'" :trip-id="tripId" />
          <GalleryGrid v-else-if="activeTab === 'gallery'" :trip-id="tripId" />
          <TripMap v-else-if="activeTab === 'map'" :trip-id="tripId" />
          <TripStatsPanel v-else :trip-id="tripId" />
        </div>
      </div>
      <router-link
        v-if="!uiStore.isPublished"
        :to="{ name: 'day-new', params: { id: tripId } }"
        class="fixed bottom-8 right-8 w-14 h-14 bg-magazine-pink text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center text-2xl z-40 no-print"
        title="添加日记"
      >
        +
      </router-link>
    </div>
  </div>
</template>
