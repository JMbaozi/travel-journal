<script setup lang="ts">
import { useTripStore } from '@/stores/tripStore'
import TripCard from './TripCard.vue'

const tripStore = useTripStore()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[320px]">
    <TripCard
      v-for="(trip, index) in tripStore.filteredTrips"
      :key="trip.id"
      :trip="trip"
      :class="index % 5 === 0 ? 'sm:row-span-2' : ''"
    />
  </div>
</template>
