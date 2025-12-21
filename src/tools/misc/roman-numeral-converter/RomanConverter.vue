<template>
  <div class="roman-converter">
    <!-- Arabic to Roman -->
    <div class="tool-section">
      <h2 class="section-title">{{ ui.arabicNumber }}</h2>
      <input
        v-model.number="arabicValue"
        type="number"
        :min="1"
        :max="3999"
        :placeholder="ui.arabicPlaceholder"
        class="input w-full"
      />
      <div v-if="romanFromArabic" class="result-box">
        <span class="result-text">{{ romanFromArabic }}</span>
        <button @click="copyToClipboard(romanFromArabic)" class="btn-secondary ml-2">
          {{ ui.copy }}
        </button>
      </div>
    </div>

    <!-- Roman to Arabic -->
    <div class="tool-section">
      <h2 class="section-title">{{ ui.romanNumeral }}</h2>
      <input
        v-model="romanValue"
        type="text"
        :placeholder="ui.romanPlaceholder"
        class="input w-full uppercase"
      />
      <div v-if="arabicFromRoman !== null" class="result-box">
        <span class="result-text">{{ arabicFromRoman }}</span>
        <button @click="copyToClipboard(String(arabicFromRoman))" class="btn-secondary ml-2">
          {{ ui.copy }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { arabicToRoman, romanToArabic } from './utils/conversion'

interface Props {
  ui: {
    arabicNumber: string
    romanNumeral: string
    arabicPlaceholder: string
    romanPlaceholder: string
    copy: string
  }
}

const props = defineProps<Props>()

const arabicValue = ref<number>(2024)
const romanValue = ref<string>('MMXXIV')

const romanFromArabic = computed(() => {
  if (!arabicValue.value || arabicValue.value < 1 || arabicValue.value > 3999) {
    return ''
  }
  return arabicToRoman(arabicValue.value)
})

const arabicFromRoman = computed(() => {
  if (!romanValue.value) {
    return null
  }
  return romanToArabic(romanValue.value.toUpperCase())
})

// Sync: when user changes arabic, don't update roman input
// when user changes roman, don't update arabic input

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

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.result-box {
  margin-top: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.result-text {
  font-size: 1.5rem;
  font-weight: bold;
  font-family: monospace;
}

.uppercase {
  text-transform: uppercase;
}
</style>
