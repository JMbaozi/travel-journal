<script setup lang="ts">
import { useTripStore } from '@/stores/tripStore'
import { computed } from 'vue'

const tripStore = useTripStore()

const totalDays = computed(() =>
  tripStore.trips.reduce((sum, t) => {
    const days = Math.ceil((new Date(t.endDate).getTime() - new Date(t.startDate).getTime()) / 86400000) + 1
    return sum + days
  }, 0)
)

const destinationCount = computed(() => {
  const dests = new Set(tripStore.trips.map((t) => t.destination))
  return dests.size
})
</script>

<template>
  <div class="relative rounded-2xl overflow-hidden mb-8">
    <div class="bg-gradient-to-r from-magazine-navy via-gray-700 to-magazine-navy p-8 md:p-12">
      <div class="absolute top-0 right-0 w-64 h-64 bg-magazine-pink/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-magazine-gold/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
      <div class="relative flex flex-wrap justify-center gap-8 md:gap-16 text-white">
        <div class="text-center">
          <p class="font-display text-5xl font-bold">{{ tripStore.tripCount }}</p>
          <p class="text-white/50 text-sm mt-2 tracking-wider uppercase">Trips</p>
        </div>
        <div class="text-center">
          <p class="font-display text-5xl font-bold">{{ totalDays }}</p>
          <p class="text-white/50 text-sm mt-2 tracking-wider uppercase">Days</p>
        </div>
        <div class="text-center">
          <p class="font-display text-5xl font-bold">{{ destinationCount }}</p>
          <p class="text-white/50 text-sm mt-2 tracking-wider uppercase">Cities</p>
        </div>
        <div class="text-center">
          <p class="font-display text-5xl font-bold">{{ tripStore.allTags.length }}</p>
          <p class="text-white/50 text-sm mt-2 tracking-wider uppercase">Tags</p>
        </div>
      </div>
    </div>
  </div>
</template>
