<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTripStore } from '@/stores/tripStore'
import { useDayEntryStore } from '@/stores/dayEntryStore'
import { usePhotoStore } from '@/stores/photoStore'
import { useUIStore } from '@/stores/uiStore'
import type { Mood, Weather, Location, ExpenseItem } from '@/types'
import { getDayDate } from '@/utils/date'
import RichTextEditor from '@/components/editor/RichTextEditor.vue'
import DayEditorSidebar from '@/components/editor/DayEditorSidebar.vue'
import PhotoUrlInput from '@/components/editor/PhotoUrlInput.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const props = defineProps<{
  tripId: string
  dayId?: string
}>()

const router = useRouter()
const tripStore = useTripStore()
const dayEntryStore = useDayEntryStore()
const photoStore = usePhotoStore()
const uiStore = useUIStore()

const isEdit = !!props.dayId
const isLoading = ref(false)
const isSaving = ref(false)
const tripTitle = ref('')

// Form fields
const title = ref('')
const dayNumber = ref(1)
const date = ref('')
const content = ref('')
const mood = ref<Mood | undefined>()
const weather = ref<Weather | undefined>()
const location = ref<Location | undefined>()
const expenses = ref<ExpenseItem[]>([])

const sidebarData = ref<{
  mood: Mood | undefined
  weather: Weather | undefined
  location: Location | undefined
  expenses: ExpenseItem[]
}>({
  mood: mood.value,
  weather: weather.value,
  location: location.value ? { ...location.value } : undefined,
  expenses: [...expenses.value],
})

onMounted(async () => {
  const trip = await tripStore.getTripById(props.tripId)
  if (!trip) {
    router.replace({ name: 'not-found' })
    return
  }
  tripTitle.value = trip.title

  if (isEdit && props.dayId) {
    isLoading.value = true
    const entry = await dayEntryStore.getEntryById(props.dayId)
    if (!entry) {
      router.replace({ name: 'trip', params: { id: props.tripId } })
      return
    }
    title.value = entry.title || ''
    dayNumber.value = entry.dayNumber
    date.value = entry.date
    content.value = entry.content
    mood.value = entry.mood
    weather.value = entry.weather
    location.value = entry.location
    expenses.value = entry.expenses || []
    sidebarData.value = {
      mood: entry.mood,
      weather: entry.weather,
      location: entry.location ? { ...entry.location } : undefined,
      expenses: entry.expenses ? [...entry.expenses] : [],
    }
    isLoading.value = false
  } else {
    dayNumber.value = await dayEntryStore.getNextDayNumber(props.tripId)
    date.value = getDayDate(trip.startDate, dayNumber.value)
  }
})

function updateSidebar() {
  mood.value = sidebarData.value.mood
  weather.value = sidebarData.value.weather
  location.value = sidebarData.value.location ? { ...sidebarData.value.location } : undefined
  expenses.value = [...sidebarData.value.expenses]
}

const showDeleteConfirm = ref(false)

async function save() {
  if (isSaving.value) return
  isSaving.value = true
  updateSidebar()

  try {
    if (isEdit && props.dayId) {
      await dayEntryStore.updateEntry(props.dayId, {
        title: title.value || undefined,
        content: content.value,
        mood: mood.value,
        weather: weather.value,
        location: location.value,
        expenses: expenses.value.length > 0 ? expenses.value : undefined,
      })
      uiStore.showToast('日记保存成功！', 'success')
    } else {
      const entry = await dayEntryStore.createEntry({
        tripId: props.tripId,
        dayNumber: dayNumber.value,
        date: date.value,
        title: title.value || undefined,
        content: content.value,
        mood: mood.value,
        weather: weather.value,
        location: location.value,
        expenses: expenses.value.length > 0 ? expenses.value : undefined,
      })
      // Reassign photos saved during editing (before entry had an ID) to the new entry
      await photoStore.reassignPhotos('', entry.id, props.tripId)
      router.replace({ name: 'day-edit', params: { id: props.tripId, dayId: entry.id } })
    }
  } catch (e) {
    console.error('保存日记失败:', e)
    uiStore.showToast('保存失败，请重试', 'error')
  } finally {
    isSaving.value = false
  }
}

async function deleteEntry() {
  if (!props.dayId) return
  try {
    await dayEntryStore.deleteEntry(props.dayId)
    uiStore.showToast('日记已删除', 'info')
    router.replace({ name: 'trip', params: { id: props.tripId } })
  } catch (e) {
    console.error('删除日记失败:', e)
    uiStore.showToast('删除失败', 'error')
  }
}
</script>

<template>
  <div>
    <LoadingSpinner v-if="isLoading" />
    <div v-else class="min-h-[calc(100vh-8rem)]">
    <!-- Header -->
    <div class="sticky top-16 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <router-link :to="{ name: 'trip', params: { id: tripId } }" class="text-gray-400 hover:text-gray-600">
            ← 返回
          </router-link>
          <div>
            <p class="text-xs text-gray-400">{{ tripTitle }}</p>
            <h1 class="font-display text-lg font-semibold text-magazine-ink">
              {{ isEdit ? '编辑日记' : `Day ${dayNumber}` }}
            </h1>
          </div>
        </div>
        <div v-if="!uiStore.isPublished" class="flex items-center gap-3">
          <button
            v-if="isEdit"
            @click="showDeleteConfirm = true"
            class="px-3 py-2 text-red-500 text-sm rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
          >
            删除
          </button>
          <button
            @click="save"
            :disabled="isSaving"
            class="px-5 py-2 bg-magazine-navy text-white text-sm rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {{ isSaving ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Body: two-column layout -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Main editor area -->
        <div class="flex-1 min-w-0">
          <input
            v-model="title"
            type="text"
            :readonly="uiStore.isPublished"
            placeholder="日记标题（可选）"
            class="w-full text-2xl font-display font-semibold text-magazine-ink placeholder-gray-300 border-none outline-none mb-4 bg-transparent"
          />
          <RichTextEditor v-model="content" :readonly="uiStore.isPublished" />
          <div v-if="!uiStore.isPublished" class="mt-6">
            <h3 class="font-display text-lg font-semibold text-magazine-ink mb-3">照片</h3>
            <PhotoUrlInput :entry-id="dayId || ''" :trip-id="tripId" />
          </div>
        </div>

        <!-- Sidebar -->
        <div class="w-full lg:w-80 flex-shrink-0">
          <div class="lg:sticky lg:top-[9rem]">
            <DayEditorSidebar
              :trip-id="tripId"
              :trip-start-date="date"
              :day-number="dayNumber"
              :model-value="sidebarData"
              @update:model-value="sidebarData = $event"
            />
          </div>
        </div>
      </div>
    </div>
    <ConfirmDialog
      :open="showDeleteConfirm"
      title="删除日记"
      message="确定要删除这篇日记吗？删除后不可恢复。"
      confirm-label="确认删除"
      :dangerous="true"
      @confirm="deleteEntry"
      @cancel="showDeleteConfirm = false"
    />
  </div>
  </div>
</template>
