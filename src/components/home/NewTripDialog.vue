<script setup lang="ts">
import { ref } from 'vue'
import { toPlain } from '@/utils/plain'
import { useTripStore } from '@/stores/tripStore'
import { useUIStore } from '@/stores/uiStore'
import type { CreateTripInput, Currency } from '@/types'
import { CURRENCIES } from '@/types'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const tripStore = useTripStore()
const uiStore = useUIStore()

const form = ref<CreateTripInput>({
  title: '',
  destination: '',
  startDate: '',
  endDate: '',
  currency: 'CNY' as Currency,
  tags: [],
})

const tagInput = ref('')

function addTag() {
  const tag = tagInput.value.trim()
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
  }
  tagInput.value = ''
}

function removeTag(tag: string) {
  form.value.tags = form.value.tags.filter((t) => t !== tag)
}

const errors = ref<string[]>([])

async function submit() {
  errors.value = []
  if (!form.value.title) errors.value.push('标题')
  if (!form.value.destination) errors.value.push('目的地')
  if (!form.value.startDate) errors.value.push('开始日期')
  if (!form.value.endDate) errors.value.push('结束日期')
  if (errors.value.length > 0) {
    uiStore.showToast(`请填写：${errors.value.join('、')}`, 'error')
    return
  }
  try {
    await tripStore.createTrip(toPlain(form.value))
    uiStore.showToast('行程创建成功！', 'success')
    emit('close')
    form.value = {
      title: '',
      destination: '',
      startDate: '',
      endDate: '',
      currency: 'CNY' as Currency,
      tags: [],
    }
  } catch (e) {
    console.error('创建行程失败:', e)
    uiStore.showToast('创建失败，请查看控制台', 'error')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="emit('close')" />
        <div class="relative bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
          <h2 class="font-display text-2xl font-bold text-magazine-ink mb-6">创建行程</h2>

          <form class="space-y-4" @submit.prevent>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
              <input v-model="form.title" type="text"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-magazine-pink"
                placeholder="如：夏日东京漫游" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">目的地 *</label>
              <input v-model="form.destination" type="text"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-magazine-pink"
                placeholder="如：东京, 日本" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">开始日期 *</label>
                <input v-model="form.startDate" type="date"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-magazine-pink" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">结束日期 *</label>
                <input v-model="form.endDate" type="date"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-magazine-pink" />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">旅伴</label>
              <input v-model="form.companion" type="text"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-magazine-pink"
                placeholder="如：和朋友一起" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">预算</label>
                <input v-model.number="form.budget" type="number"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-magazine-pink"
                  placeholder="0" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">币种</label>
                <select v-model="form.currency"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-magazine-pink">
                  <option v-for="c in CURRENCIES" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">封面图片 URL</label>
              <input v-model="form.coverImage" type="text"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-magazine-pink"
                placeholder="通过 PicGo 上传后粘贴链接" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
              <textarea v-model="form.description" rows="3"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-magazine-pink"
                placeholder="简单描述一下这次旅程..." />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">标签</label>
              <div class="flex flex-wrap gap-1 mb-2">
                <span v-for="tag in form.tags" :key="tag"
                  class="inline-flex items-center gap-1 px-2 py-0.5 bg-magazine-pink/10 text-magazine-pink rounded-full text-xs">
                  {{ tag }}
                  <button type="button" @click="removeTag(tag)" class="hover:text-red-500">&times;</button>
                </span>
              </div>
              <div class="flex gap-2">
                <input v-model="tagInput" type="text" @keydown.enter.prevent="addTag"
                  class="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-magazine-pink"
                  placeholder="输入标签后按回车" />
                <button type="button" @click="addTag"
                  class="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                  添加
                </button>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="emit('close')"
                class="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                取消
              </button>
              <button type="button" @click="submit"
                class="px-6 py-2 bg-magazine-navy text-white text-sm rounded-lg hover:bg-gray-800 transition-colors">
                创建
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
