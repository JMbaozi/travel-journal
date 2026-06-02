<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePhotoStore } from '@/stores/photoStore'
import { useUIStore } from '@/stores/uiStore'
import type { Photo } from '@/types'

const props = defineProps<{
  entryId: string
  tripId: string
}>()

const photoStore = usePhotoStore()
const uiStore = useUIStore()

const urlInput = ref('')
const captionInput = ref('')
const photos = ref<Photo[]>([])

onMounted(async () => {
  if (props.entryId) {
    photos.value = await photoStore.getPhotosForEntry(props.entryId)
  }
})

async function addPhoto() {
  const url = urlInput.value.trim()
  if (!url) return

  try {
    const photo = await photoStore.addPhoto(props.entryId, props.tripId, url, captionInput.value || undefined)
    photos.value.push(photo)
    urlInput.value = ''
    captionInput.value = ''
    uiStore.showToast('照片添加成功！', 'success')
  } catch {
    uiStore.showToast('添加照片失败', 'error')
  }
}

async function deletePhoto(id: string) {
  await photoStore.deletePhoto(id)
  photos.value = photos.value.filter((p) => p.id !== id)
}
</script>

<template>
  <div>
    <!-- URL input -->
    <div class="flex gap-2 mb-3">
      <input
        v-model="urlInput"
        type="url"
        placeholder="通过 PicGo 上传后粘贴图片 URL"
        class="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-magazine-pink"
        @keydown.enter.prevent="addPhoto"
      />
      <button
        @click="addPhoto"
        :disabled="!urlInput.trim()"
        class="px-4 py-2 bg-magazine-navy text-white text-sm rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        添加
      </button>
    </div>
    <input
      v-model="captionInput"
      type="text"
      placeholder="图片标题（可选）"
      class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-magazine-pink mb-4"
    />

    <!-- Photo strip -->
    <div v-if="photos.length > 0" class="flex gap-3 overflow-x-auto pb-2">
      <div
        v-for="photo in photos"
        :key="photo.id"
        class="relative flex-shrink-0 w-32 group"
      >
        <img
          :src="photo.url"
          :alt="photo.caption || '照片'"
          referrerpolicy="no-referrer"
          class="w-32 h-24 object-cover rounded-lg border border-gray-200"
          @error="(e: Event) => { const t = e.target as HTMLImageElement; console.warn('照片加载失败:', t.src); t.style.display = 'none'; }"
        />
        <p v-if="photo.caption" class="text-xs text-gray-500 mt-1 truncate">{{ photo.caption }}</p>
        <button
          @click="deletePhoto(photo.id)"
          class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      </div>
    </div>
    <p v-else class="text-xs text-gray-400">使用 PicGo 上传图片到 Cloudflare R2，然后粘贴 URL 到上方输入框。</p>
  </div>
</template>
