import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Toast } from '@/types'
import { generateId } from '@/utils/id'

export const useUIStore = defineStore('ui', () => {
  const activeTripTab = ref<'journal' | 'gallery' | 'map' | 'stats'>('journal')
  const isNewTripDialogOpen = ref(false)
  const toasts = ref<Toast[]>([])
  const isPublished = ref(false)

  function showToast(message: string, type: Toast['type'] = 'info', duration = 3000): void {
    const toast: Toast = { id: generateId(), message, type, duration }
    toasts.value.push(toast)
    setTimeout(() => removeToast(toast.id), duration)
  }

  function removeToast(id: string): void {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function setTripTab(tab: 'journal' | 'gallery' | 'map' | 'stats'): void {
    activeTripTab.value = tab
  }

  return {
    activeTripTab,
    isNewTripDialogOpen,
    toasts,
    isPublished,
    showToast,
    removeToast,
    setTripTab,
  }
})
