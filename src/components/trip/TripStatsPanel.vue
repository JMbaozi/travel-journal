<script setup lang="ts">
import { computed } from 'vue'
import { useDayEntryStore } from '@/stores/dayEntryStore'
import { usePhotoStore } from '@/stores/photoStore'
import { useTripStore } from '@/stores/tripStore'
import { getTripDuration } from '@/utils/date'
import { formatAmount } from '@/utils/currency'
import EmptyState from '@/components/common/EmptyState.vue'
import type { Photo } from '@/types'
import { ref, onMounted } from 'vue'

const props = defineProps<{
  tripId: string
}>()

const dayEntryStore = useDayEntryStore()
const photoStore = usePhotoStore()
const tripStore = useTripStore()

const photos = ref<Photo[]>([])

onMounted(async () => {
  photos.value = await photoStore.getPhotosForTrip(props.tripId)
})

const trip = computed(() => tripStore.trips.find((t) => t.id === props.tripId))
const entries = computed(() => dayEntryStore.getEntriesForTrip(props.tripId))

const stats = computed(() => {
  const entryList = entries.value
  if (!trip.value || entryList.length === 0) return null

  const totalDays = getTripDuration(trip.value.startDate, trip.value.endDate)
  const daysWritten = entryList.length
  const totalWords = entryList.reduce((sum, e) => {
    const div = document.createElement('div')
    div.innerHTML = e.content
    return sum + (div.textContent || '').length
  }, 0)

  // Mood frequency
  const moodCounts: Record<string, number> = {}
  entryList.forEach((e) => {
    if (e.mood) moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1
  })
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]

  // Expense totals by category
  const expenseByCategory: Record<string, number> = {}
  let totalExpense = 0
  entryList.forEach((e) => {
    if (e.expenses) {
      e.expenses.forEach((exp) => {
        expenseByCategory[exp.category] = (expenseByCategory[exp.category] || 0) + exp.amount
        totalExpense += exp.amount
      })
    }
  })

  return {
    totalDays,
    daysWritten,
    totalWords,
    photoCount: photos.value.length,
    locationCount: entryList.filter((e) => e.location).length,
    topMood,
    expenseByCategory,
    totalExpense,
    currency: trip.value.currency,
  }
})
</script>

<template>
  <div v-if="trip">
    <div v-if="!stats" class="py-16">
      <EmptyState icon="📊" title="还没有数据" description="添加日记后这里会显示统计信息" />
    </div>
    <div v-else class="space-y-6">
      <!-- Overview cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <p class="font-display text-3xl font-bold text-magazine-navy">{{ stats.daysWritten }}/{{ stats.totalDays }}</p>
          <p class="text-xs text-gray-400 mt-1">记录天数</p>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <p class="font-display text-3xl font-bold text-magazine-pink">{{ stats.photoCount }}</p>
          <p class="text-xs text-gray-400 mt-1">照片数量</p>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <p class="font-display text-3xl font-bold text-magazine-mint">{{ stats.locationCount }}</p>
          <p class="text-xs text-gray-400 mt-1">打卡地点</p>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <p class="font-display text-3xl font-bold text-magazine-gold">{{ (stats.totalWords / 1000).toFixed(1) }}k</p>
          <p class="text-xs text-gray-400 mt-1">总字数</p>
        </div>
      </div>

      <!-- Mood & Expense -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Top mood -->
        <div v-if="stats.topMood" class="bg-white rounded-xl p-6 border border-gray-100">
          <h3 class="font-display text-lg font-semibold text-magazine-ink mb-3">最常心情</h3>
          <div class="text-center">
            <span class="text-6xl">{{ stats.topMood[0] }}</span>
            <p class="text-sm text-gray-400 mt-1">出现 {{ stats.topMood[1] }} 次</p>
          </div>
        </div>

        <!-- Expenses -->
        <div class="bg-white rounded-xl p-6 border border-gray-100">
          <h3 class="font-display text-lg font-semibold text-magazine-ink mb-3">消费统计</h3>
          <div v-if="Object.keys(stats.expenseByCategory).length > 0" class="space-y-2">
            <div v-for="(amount, cat) in stats.expenseByCategory" :key="cat" class="flex items-center justify-between">
              <span class="text-sm text-gray-600 capitalize">{{ cat }}</span>
              <span class="text-sm font-medium text-magazine-ink">{{ formatAmount(amount, stats.currency) }}</span>
            </div>
            <div class="magazine-rule my-2" />
            <div class="flex items-center justify-between font-semibold">
              <span class="text-sm text-magazine-ink">合计</span>
              <span class="text-sm text-magazine-pink">{{ formatAmount(stats.totalExpense, stats.currency) }}</span>
            </div>
          </div>
          <p v-else class="text-sm text-gray-400 text-center py-4">暂无消费记录</p>
        </div>
      </div>
    </div>
  </div>
</template>
