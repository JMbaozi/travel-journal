<script setup lang="ts">
import { ref } from 'vue'
import type { Trip } from '@/types'
import { formatDateRange, getTripDuration } from '@/utils/date'
import { useRouter } from 'vue-router'

const props = defineProps<{
  trip: Trip
}>()

const router = useRouter()
const imgError = ref(false)

function goToTrip() {
  router.push({ name: 'trip', params: { id: props.trip.id } })
}
</script>

<template>
  <div
    @click="goToTrip"
    class="relative rounded-xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full"
  >
    <!-- Cover Image or Gradient -->
    <img
      v-if="trip.coverImage && !imgError"
      :src="trip.coverImage"
      :alt="trip.title"
      referrerpolicy="no-referrer"
      loading="lazy"
      class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      @error="imgError = true; console.warn('封面图加载失败:', trip.coverImage)"
    />
    <div
      v-else
      class="absolute inset-0 bg-gradient-to-br"
      :class="[
        trip.id.charCodeAt(0) % 3 === 0 ? 'from-magazine-pink to-magazine-navy' :
        trip.id.charCodeAt(0) % 3 === 1 ? 'from-magazine-sky to-magazine-navy' :
        'from-magazine-mint to-magazine-navy'
      ]"
    />
    <!-- Overlay -->
    <div class="absolute inset-0 card-overlay" />
    <!-- Content -->
    <div class="absolute bottom-0 left-0 right-0 p-5 text-white">
      <h3 class="font-display text-xl font-semibold leading-tight mb-1 line-clamp-2">{{ trip.title }}</h3>
      <p class="text-white/80 text-sm mb-1">{{ trip.destination }}</p>
      <p class="text-white/50 text-xs">
        {{ formatDateRange(trip.startDate, trip.endDate) }}
        · {{ getTripDuration(trip.startDate, trip.endDate) }} 天
      </p>
      <div v-if="trip.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
        <span
          v-for="tag in trip.tags.slice(0, 3)"
          :key="tag"
          class="px-2 py-0.5 bg-white/15 backdrop-blur rounded-full text-xs text-white/80"
        >
          {{ tag }}
        </span>
        <span v-if="trip.tags.length > 3" class="text-xs text-white/50">
          +{{ trip.tags.length - 3 }}
        </span>
      </div>
    </div>
  </div>
</template>
