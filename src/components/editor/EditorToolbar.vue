<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { ref } from 'vue'

defineProps<{
  editor: Editor | null | undefined
}>()

const imageUrl = ref('')
const showImageDialog = ref(false)

function addImage(editor: Editor) {
  if (imageUrl.value && editor) {
    editor.chain().focus().setImage({ src: imageUrl.value }).run()
    imageUrl.value = ''
    showImageDialog.value = false
  }
}
</script>

<template>
  <div v-if="editor" class="flex flex-wrap items-center gap-0.5 px-2 py-2 bg-gray-50 border-b border-gray-100">
    <!-- Text formatting -->
    <button type="button" @click="editor.chain().focus().toggleBold().run()"
      :class="['w-8 h-8 rounded text-sm flex items-center justify-center', editor.isActive('bold') ? 'bg-gray-200 text-magazine-ink' : 'text-gray-500 hover:bg-gray-100']"
      title="粗体 (Ctrl+B)"><strong>B</strong></button>
    <button type="button" @click="editor.chain().focus().toggleItalic().run()"
      :class="['w-8 h-8 rounded text-sm flex items-center justify-center', editor.isActive('italic') ? 'bg-gray-200 text-magazine-ink' : 'text-gray-500 hover:bg-gray-100']"
      title="斜体 (Ctrl+I)"><em>I</em></button>
    <button type="button" @click="editor.chain().focus().toggleUnderline().run()"
      :class="['w-8 h-8 rounded text-sm flex items-center justify-center', editor.isActive('underline') ? 'bg-gray-200 text-magazine-ink' : 'text-gray-500 hover:bg-gray-100']"
      title="下划线 (Ctrl+U)"><u>U</u></button>

    <div class="w-px h-5 bg-gray-200 mx-1" />

    <!-- Headings -->
    <button type="button" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      :class="['w-8 h-8 rounded text-xs flex items-center justify-center font-bold', editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-magazine-ink' : 'text-gray-500 hover:bg-gray-100']"
      title="标题1">H1</button>
    <button type="button" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      :class="['w-8 h-8 rounded text-xs flex items-center justify-center font-bold', editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-magazine-ink' : 'text-gray-500 hover:bg-gray-100']"
      title="标题2">H2</button>
    <button type="button" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      :class="['w-8 h-8 rounded text-xs flex items-center justify-center font-bold', editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-magazine-ink' : 'text-gray-500 hover:bg-gray-100']"
      title="标题3">H3</button>

    <div class="w-px h-5 bg-gray-200 mx-1" />

    <!-- Lists -->
    <button type="button" @click="editor.chain().focus().toggleBulletList().run()"
      :class="['w-8 h-8 rounded text-sm flex items-center justify-center', editor.isActive('bulletList') ? 'bg-gray-200 text-magazine-ink' : 'text-gray-500 hover:bg-gray-100']"
      title="无序列表">•≡</button>
    <button type="button" @click="editor.chain().focus().toggleOrderedList().run()"
      :class="['w-8 h-8 rounded text-sm flex items-center justify-center', editor.isActive('orderedList') ? 'bg-gray-200 text-magazine-ink' : 'text-gray-500 hover:bg-gray-100']"
      title="有序列表">1.</button>

    <div class="w-px h-5 bg-gray-200 mx-1" />

    <!-- Block -->
    <button type="button" @click="editor.chain().focus().toggleBlockquote().run()"
      :class="['w-8 h-8 rounded text-sm flex items-center justify-center', editor.isActive('blockquote') ? 'bg-gray-200 text-magazine-ink' : 'text-gray-500 hover:bg-gray-100']"
      title="引用">❝</button>
    <button type="button" @click="editor.chain().focus().setHorizontalRule().run()"
      class="w-8 h-8 rounded text-sm flex items-center justify-center text-gray-500 hover:bg-gray-100"
      title="分隔线">—</button>

    <div class="w-px h-5 bg-gray-200 mx-1" />

    <!-- Align -->
    <button type="button" @click="editor.chain().focus().setTextAlign('left').run()"
      :class="['w-8 h-8 rounded text-sm flex items-center justify-center', editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 text-magazine-ink' : 'text-gray-500 hover:bg-gray-100']"
      title="左对齐">⇤</button>
    <button type="button" @click="editor.chain().focus().setTextAlign('center').run()"
      :class="['w-8 h-8 rounded text-sm flex items-center justify-center', editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 text-magazine-ink' : 'text-gray-500 hover:bg-gray-100']"
      title="居中">⇔</button>
    <button type="button" @click="editor.chain().focus().setTextAlign('right').run()"
      :class="['w-8 h-8 rounded text-sm flex items-center justify-center', editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 text-magazine-ink' : 'text-gray-500 hover:bg-gray-100']"
      title="右对齐">⇥</button>

    <div class="w-px h-5 bg-gray-200 mx-1" />

    <!-- Image -->
    <button type="button" @click="showImageDialog = !showImageDialog"
      class="w-8 h-8 rounded text-sm flex items-center justify-center text-gray-500 hover:bg-gray-100"
      title="插入图片">🖼</button>

    <div class="w-px h-5 bg-gray-200 mx-1" />

    <!-- Undo/Redo -->
    <button type="button" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()"
      class="w-8 h-8 rounded text-sm flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30"
      title="撤销">↩</button>
    <button type="button" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()"
      class="w-8 h-8 rounded text-sm flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30"
      title="重做">↪</button>
  </div>

  <!-- Image URL dialog -->
  <div v-if="showImageDialog" class="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
    <input
      v-model="imageUrl"
      type="url"
      placeholder="粘贴图片 URL (通过 PicGo 上传后获取)"
      class="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-magazine-pink bg-white"
      @keydown.enter.prevent="addImage(editor!)"
    />
    <button @click="addImage(editor!)" class="px-3 py-1.5 bg-magazine-pink text-white text-xs rounded-lg hover:bg-magazine-pink/80 transition-colors">添加</button>
    <button @click="showImageDialog = false" class="px-3 py-1.5 text-xs text-gray-400 hover:text-gray-600">取消</button>
  </div>
</template>
