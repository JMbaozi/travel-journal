<script setup lang="ts">
import type { ExpenseItem, ExpenseCategory, Currency } from '@/types'
import { EXPENSE_CATEGORIES, CURRENCIES } from '@/types'
import { generateId } from '@/utils/id'
import { formatAmount } from '@/utils/currency'

const props = defineProps<{
  modelValue: ExpenseItem[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ExpenseItem[]]
}>()

function addExpense() {
  const newItem: ExpenseItem = {
    id: generateId(),
    category: 'food' as ExpenseCategory,
    amount: 0,
    currency: 'CNY' as Currency,
    note: '',
  }
  emit('update:modelValue', [...props.modelValue, newItem])
}

function removeExpense(id: string) {
  emit('update:modelValue', props.modelValue.filter((e) => e.id !== id))
}

function updateExpense(id: string, field: keyof ExpenseItem, value: string | number) {
  emit('update:modelValue', props.modelValue.map((e) =>
    e.id === id ? { ...e, [field]: value } : e
  ))
}

const total = props.modelValue.reduce((sum, e) => sum + (e.amount || 0), 0)
</script>

<template>
  <div>
    <div v-if="modelValue.length === 0" class="text-center py-4">
      <p class="text-xs text-gray-400">暂无消费记录</p>
    </div>
    <div v-else class="space-y-2">
      <div v-for="expense in modelValue" :key="expense.id" class="flex items-center gap-2 text-xs">
        <select
          :value="expense.category"
          @change="updateExpense(expense.id, 'category', ($event.target as HTMLSelectElement).value)"
          class="w-16 px-1 py-1 border border-gray-200 rounded text-xs bg-white"
        >
          <option v-for="cat in EXPENSE_CATEGORIES" :key="cat.value" :value="cat.value">
            {{ cat.icon }}
          </option>
        </select>
        <input
          :value="expense.amount || ''"
          @input="updateExpense(expense.id, 'amount', Number(($event.target as HTMLInputElement).value))"
          type="number"
          min="0"
          step="0.01"
          placeholder="金额"
          class="w-20 px-2 py-1 border border-gray-200 rounded text-xs"
        />
        <select
          :value="expense.currency"
          @change="updateExpense(expense.id, 'currency', ($event.target as HTMLSelectElement).value)"
          class="w-14 px-0.5 py-1 border border-gray-200 rounded text-xs bg-white"
        >
          <option v-for="c in CURRENCIES" :key="c" :value="c">{{ c }}</option>
        </select>
        <input
          :value="expense.note"
          @input="updateExpense(expense.id, 'note', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="备注"
          class="flex-1 px-2 py-1 border border-gray-200 rounded text-xs"
        />
        <button @click="removeExpense(expense.id)" class="text-red-400 hover:text-red-600 text-lg leading-none">
          ×
        </button>
      </div>
      <div class="text-right text-xs font-medium text-magazine-ink pt-1 border-t border-gray-100">
        合计: {{ formatAmount(total, modelValue[0]?.currency || 'CNY') }}
      </div>
    </div>
    <button
      @click="addExpense"
      class="mt-3 w-full py-1.5 border border-dashed border-gray-300 rounded-lg text-xs text-gray-400 hover:border-magazine-pink hover:text-magazine-pink transition-colors"
    >
      + 添加消费
    </button>
  </div>
</template>
