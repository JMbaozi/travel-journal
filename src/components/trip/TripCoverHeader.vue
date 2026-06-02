<script setup lang="ts">
import type { Trip } from '@/types'
import { formatDateRange, getTripDuration } from '@/utils/date'
import { useRouter } from 'vue-router'

const props = defineProps<{
  trip: Trip
}>()

const router = useRouter()
</script>

<template>
  <div class="relative h-[50vh] min-h-[320px] overflow-hidden">
    <img
      v-if="trip.coverImage"
      :src="trip.coverImage"
      :alt="trip.title"
      referrerpolicy="no-referrer"
      class="absolute inset-0 w-full h-full object-cover"
      @error="(e: Event) => console.warn('封面图加载失败:', (e.target as HTMLImageElement).src)"
    />
    <div
      v-else
      class="absolute inset-0 bg-gradient-to-br from-magazine-navy via-gray-700 to-magazine-pink"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    <div class="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
      <h1 class="font-display text-4xl md:text-5xl font-bold mb-2">{{ trip.title }}</h1>
      <p class="text-xl text-white/80 mb-1">{{ trip.destination }}</p>
      <p class="text-white/60 text-sm mb-3">
        {{ formatDateRange(trip.startDate, trip.endDate) }} · {{ getTripDuration(trip.startDate, trip.endDate) }} 天
        <span v-if="trip.companion"> · 与 {{ trip.companion }}</span>
      </p>
      <div v-if="trip.tags.length > 0" class="flex flex-wrap gap-2">
        <span
          v-for="tag in trip.tags"
          :key="tag"
          class="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs text-white/90"
        >
          {{ tag }}
        </span>
      </div>
      <p v-if="trip.description" class="text-white/70 text-sm mt-3 max-w-2xl leading-relaxed">
        {{ trip.description }}
      </p>
    </div>
    <button
      @click="router.push({ name: 'home' })"
      class="absolute top-4 left-4 w-10 h-10 bg-black/30 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
    >
      ←
    </button>
  </div>
</template>
