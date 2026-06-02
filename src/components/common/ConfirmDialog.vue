<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  dangerous?: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="emit('cancel')" />
        <div class="relative bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-semibold text-magazine-ink mb-2">{{ title }}</h3>
          <p class="text-gray-600 text-sm mb-6">{{ message }}</p>
          <div class="flex justify-end gap-3">
            <button
              @click="emit('cancel')"
              class="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              @click="emit('confirm')"
              :class="[
                'px-4 py-2 text-sm rounded-lg text-white transition-colors',
                dangerous ? 'bg-red-500 hover:bg-red-600' : 'bg-magazine-navy hover:bg-gray-800'
              ]"
            >
              {{ confirmLabel || '确认' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .relative { transform: scale(0.95); }
</style>
