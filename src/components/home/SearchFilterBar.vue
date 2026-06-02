<script setup lang="ts">
import { useTripStore } from '@/stores/tripStore'

const tripStore = useTripStore()

function toggleTag(tag: string) {
  tripStore.activeTagFilter = tripStore.activeTagFilter === tag ? null : tag
}
</script>

<template>
  <div class="sticky top-16 z-40 bg-magazine-cream/80 backdrop-blur py-4 mb-6">
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          v-model="tripStore.searchQuery"
          type="text"
          placeholder="搜索行程标题、目的地、标签..."
          class="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-magazine-pink transition-colors"
        />
      </div>
      <button
        v-if="tripStore.activeTagFilter"
        @click="tripStore.activeTagFilter = null"
        class="px-3 py-2 text-xs rounded-lg bg-magazine-ink text-white hover:bg-gray-700 transition-colors whitespace-nowrap"
      >
        清除筛选 ✕
      </button>
    </div>
    <div v-if="tripStore.allTags.length > 0" class="flex flex-wrap gap-2 mt-3">
      <button
        v-for="tag in tripStore.allTags"
        :key="tag"
        @click="toggleTag(tag)"
        :class="[
          'px-3 py-1 rounded-full text-xs transition-colors',
          tripStore.activeTagFilter === tag
            ? 'bg-magazine-pink text-white'
            : 'bg-white text-gray-600 border border-gray-200 hover:border-magazine-pink hover:text-magazine-pink'
        ]"
      >
        {{ tag }}
      </button>
    </div>
  </div>
</template>
