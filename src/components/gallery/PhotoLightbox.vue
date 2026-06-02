<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Photo } from '@/types'

const props = defineProps<{
  photos: Photo[]
  initialIndex: number
}>()

const emit = defineEmits<{
  close: []
}>()

const currentIndex = ref(props.initialIndex)

function prev() {
  if (currentIndex.value > 0) currentIndex.value--
}

function next() {
  if (currentIndex.value < props.photos.length - 1) currentIndex.value++
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" @click="emit('close')">
      <button @click.stop="emit('close')" class="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10">
        ✕
      </button>
      <button
        v-if="currentIndex > 0"
        @click.stop="prev"
        class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white text-xl hover:bg-white/30 transition-colors z-10"
      >
        ‹
      </button>
      <button
        v-if="currentIndex < photos.length - 1"
        @click.stop="next"
        class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white text-xl hover:bg-white/30 transition-colors z-10"
      >
        ›
      </button>
      <div @click.stop class="max-w-[90vw] max-h-[90vh] flex flex-col items-center">
        <img
          :src="photos[currentIndex].url"
          :alt="photos[currentIndex].caption || '照片'"
          referrerpolicy="no-referrer"
          class="max-w-full max-h-[80vh] object-contain rounded-lg"
        />
        <p v-if="photos[currentIndex].caption" class="text-white/70 text-sm mt-3">
          {{ photos[currentIndex].caption }}
        </p>
        <p class="text-white/40 text-xs mt-1">
          {{ currentIndex + 1 }} / {{ photos.length }}
        </p>
      </div>
    </div>
  </Teleport>
</template>
