<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-32 text-center">
    <span class="text-6xl mb-4">🗺️</span>
    <h1 class="font-display text-3xl font-bold text-magazine-ink mb-2">页面不存在</h1>
    <p class="text-gray-500 mb-6">你找的页面似乎已经走丢了</p>
    <button
      @click="router.push('/')"
      class="px-5 py-2.5 bg-magazine-navy text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
    >
      回到首页
    </button>
  </div>
</template>
