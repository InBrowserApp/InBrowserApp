<template>
  <div class="roman-converter">
    <!-- Arabic Number Input -->
    <div class="tool-section">
      <h2 class="section-title">{{ ui.arabicNumber }}</h2>
      <div class="input-group">
        <input
          v-model.number="arabicValue"
          type="number"
          :min="1"
          :max="3999"
          :placeholder="ui.arabicPlaceholder"
          class="input w-full"
          @input="onArabicInput"
        />
        <button @click="copyToClipboard(String(arabicValue))" class="btn-copy" :title="ui.copy">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Roman Numeral Input -->
    <div class="tool-section">
      <h2 class="section-title">{{ ui.romanNumeral }}</h2>
      <div class="input-group">
        <input
          v-model="romanValue"
          type="text"
          :placeholder="ui.romanPlaceholder"
          class="input w-full uppercase"
          @input="onRomanInput"
        />
        <button @click="copyToClipboard(romanValue)" class="btn-copy" :title="ui.copy">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
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

<style scoped>
.roman-converter {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.tool-section {
  padding: 1.5rem;
  background: var(--c-bg-soft, #f5f5f5);
  border-radius: 0.75rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--c-text-1, #333);
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.input {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1.25rem;
  border: 2px solid var(--c-border, #e0e0e0);
  border-radius: 0.5rem;
  background: var(--c-bg, #fff);
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--c-brand, #646cff);
}

.btn-copy {
  padding: 0.75rem;
  background: var(--c-bg, #fff);
  border: 2px solid var(--c-border, #e0e0e0);
  border-radius: 0.5rem;
  cursor: pointer;
  color: var(--c-text-2, #666);
  transition: all 0.2s;
}

.btn-copy:hover {
  background: var(--c-brand, #646cff);
  border-color: var(--c-brand, #646cff);
  color: #fff;
}

.uppercase {
  text-transform: uppercase;
}
</style>
