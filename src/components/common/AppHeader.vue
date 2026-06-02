<script setup lang="ts">
import { useUIStore } from '@/stores/uiStore'

const uiStore = useUIStore()
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100 no-print">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <router-link to="/" class="font-display text-2xl font-bold text-magazine-navy hover:text-magazine-pink transition-colors">
          旅游手帐
        </router-link>
        <span v-if="uiStore.isPublished" class="text-xs px-2 py-0.5 bg-magazine-pink/10 text-magazine-pink rounded-full font-medium">
          Published
        </span>
      </div>
      <nav class="flex items-center gap-4">
        <router-link to="/" class="text-sm text-gray-600 hover:text-magazine-pink transition-colors" active-class="text-magazine-pink font-medium">
          首页
        </router-link>
        <router-link v-if="!uiStore.isPublished" to="/settings" class="text-sm text-gray-600 hover:text-magazine-pink transition-colors" active-class="text-magazine-pink font-medium">
          设置
        </router-link>
      </nav>
    </div>
  </header>
</template>
