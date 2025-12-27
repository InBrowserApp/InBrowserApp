<template>
  <div class="flex flex-col gap-6">
    <!-- Arabic Number Input -->
    <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {{ ui.arabicNumber }}
      </label>
      <div class="flex gap-3">
        <input
          v-model.number="arabicValue"
          type="number"
          :min="1"
          :max="3999"
          :placeholder="ui.arabicPlaceholder"
          class="flex-1 px-4 py-3 text-xl font-mono bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
          @input="onArabicInput"
        />
        <button
          @click="copyToClipboard(String(arabicValue))"
          class="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-blue-500 hover:text-white border-2 border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-200 group"
          :title="ui.copy"
        >
          <span class="i-fluent-copy-16-regular w-5 h-5 block text-gray-500 group-hover:text-white"></span>
        </button>
      </div>
    </div>

    <!-- Bidirectional Arrow -->
    <div class="flex justify-center">
      <div class="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full">
        <span class="i-carbon-arrows-vertical w-6 h-6 block text-blue-500"></span>
      </div>
    </div>

    <!-- Roman Numeral Input -->
    <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {{ ui.romanNumeral }}
      </label>
      <div class="flex gap-3">
        <input
          v-model="romanValue"
          type="text"
          :placeholder="ui.romanPlaceholder"
          class="flex-1 px-4 py-3 text-xl font-mono uppercase bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
          @input="onRomanInput"
        />
        <button
          @click="copyToClipboard(romanValue)"
          class="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-blue-500 hover:text-white border-2 border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-200 group"
          :title="ui.copy"
        >
          <span class="i-fluent-copy-16-regular w-5 h-5 block text-gray-500 group-hover:text-white"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { arabicToRoman, romanToArabic, isValidRomanNumeral } from './utils/conversion'

interface Props {
  ui: {
    arabicNumber: string
    romanNumeral: string
    arabicPlaceholder: string
    romanPlaceholder: string
    copy: string
  }
}

defineProps<Props>()

const arabicValue = ref<number>(2024)
const romanValue = ref<string>(arabicToRoman(2024))

// Flag to prevent circular updates
let isUpdating = false

function onArabicInput() {
  if (isUpdating) return
  isUpdating = true

  const value = arabicValue.value
  if (value && value >= 1 && value <= 3999) {
    try {
      romanValue.value = arabicToRoman(value)
    } catch {
      // Invalid input, keep previous value
    }
  }

  isUpdating = false
}

function onRomanInput() {
  if (isUpdating) return
  isUpdating = true

  const value = romanValue.value.toUpperCase()
  if (value && isValidRomanNumeral(value)) {
    try {
      arabicValue.value = romanToArabic(value)
    } catch {
      // Invalid input, keep previous value
    }
  }

  isUpdating = false
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}
</script>
