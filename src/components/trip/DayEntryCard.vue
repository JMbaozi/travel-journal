<script setup lang="ts">
import { ref } from 'vue'
import type { DayEntry } from '@/types'
import { formatShortDate } from '@/utils/date'
import { useRouter, useRoute } from 'vue-router'
import { useDayEntryStore } from '@/stores/dayEntryStore'
import { useUIStore } from '@/stores/uiStore'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const props = defineProps<{
  entry: DayEntry
  side: 'left' | 'right'
}>()

const router = useRouter()
const route = useRoute()
const dayEntryStore = useDayEntryStore()
const uiStore = useUIStore()
const showDeleteConfirm = ref(false)

function goToEntry() {
  router.push({ name: 'day-edit', params: { id: route.params.id, dayId: props.entry.id } })
}

async function deleteEntry() {
  try {
    await dayEntryStore.deleteEntry(props.entry.id)
    uiStore.showToast('日记已删除', 'info')
  } catch (e) {
    console.error('删除失败:', e)
    uiStore.showToast('删除失败', 'error')
  }
}

function stripHtml(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}
</script>

<template>
  <div
    :class="[
      'relative flex items-start gap-6',
      side === 'left' ? 'md:flex-row' : 'md:flex-row-reverse',
      'flex-row'
    ]"
  >
    <div class="absolute left-4 md:left-1/2 w-4 h-4 bg-magazine-pink rounded-full border-4 border-magazine-cream -translate-x-1/2 z-10 mt-1" />
    <div
      :class="[
        'ml-10 md:ml-0 md:w-[calc(50%-2rem)]',
        side === 'left' ? 'md:pr-0' : 'md:pl-0'
      ]"
    >
      <div
        class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100 group"
      >
        <div @click="goToEntry" class="cursor-pointer">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs font-medium bg-magazine-navy text-white px-2 py-0.5 rounded-full">
              Day {{ entry.dayNumber }}
            </span>
            <span class="text-xs text-gray-400">{{ formatShortDate(entry.date) }}</span>
            <span v-if="entry.mood" class="text-lg">{{ entry.mood }}</span>
            <span v-if="entry.weather" class="text-lg">{{ entry.weather }}</span>
          </div>
          <h3 v-if="entry.title" class="font-display text-lg font-semibold text-magazine-ink mb-2">
            {{ entry.title }}
          </h3>
          <p v-if="entry.content" class="text-sm text-gray-500 line-clamp-3 leading-relaxed">
            {{ stripHtml(entry.content) }}
          </p>
          <p v-if="entry.location" class="text-xs text-gray-400 mt-2">
            📍 {{ entry.location.name }}
          </p>
          <div v-if="entry.expenses && entry.expenses.length > 0" class="text-xs text-gray-400 mt-1">
            💰 {{ entry.expenses.length }} 笔消费
          </div>
        </div>
        <div v-if="!uiStore.isPublished" class="flex justify-end mt-2 pt-2 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            @click.stop="showDeleteConfirm = true"
            class="text-xs text-red-400 hover:text-red-600 transition-colors"
          >
            删除
          </button>
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
</template>
