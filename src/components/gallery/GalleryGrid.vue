<script setup lang="ts">
import { ref } from 'vue'
import { usePhotoStore } from '@/stores/photoStore'
import type { Photo } from '@/types'
import PhotoLightbox from './PhotoLightbox.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const props = defineProps<{
  tripId: string
}>()

const photoStore = usePhotoStore()
const photos = ref<Photo[]>([])
const lightboxIndex = ref<number | null>(null)

// Load photos
photoStore.getPhotosForTrip(props.tripId).then((p) => {
  photos.value = p
})

function openLightbox(index: number) {
  lightboxIndex.value = index
}
</script>

<template>
  <div>
    <div v-if="photos.length === 0" class="py-16">
      <EmptyState
        icon="🖼️"
        title="还没有照片"
        description="在日记中添加照片后，它们会显示在这里"
      />
    </div>
    <div v-else class="columns-2 md:columns-3 lg:columns-4 gap-4">
      <div
        v-for="(photo, index) in photos"
        :key="photo.id"
        @click="openLightbox(index)"
        class="break-inside-avoid mb-4 cursor-pointer group"
      >
        <img
          :src="photo.url"
          :alt="photo.caption || '照片'"
          referrerpolicy="no-referrer"
          loading="lazy"
          class="w-full rounded-lg group-hover:opacity-90 transition-opacity"
          @error="(e: Event) => { const t = e.target as HTMLImageElement; console.warn('照片加载失败:', t.src); t.style.display = 'none'; }"
        />
        <p v-if="photo.caption" class="text-xs text-gray-500 mt-1 px-1">{{ photo.caption }}</p>
      </div>
    </div>
    <PhotoLightbox
      v-if="lightboxIndex !== null"
      :photos="photos"
      :initial-index="lightboxIndex"
      @close="lightboxIndex = null"
    />
  </div>
</template>
