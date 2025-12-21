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
      <div v-if="romanValue" class="result-box">
        <span class="result-text">{{ romanValue }}</span>
        <button @click="copyToClipboard(romanValue)" class="btn-secondary ml-2">
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
      <div v-if="arabicValue" class="result-box">
        <span class="result-text">{{ arabicValue }}</span>
        <button @click="copyToClipboard(String(arabicValue))" class="btn-secondary ml-2">
          {{ ui.copy }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
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
const romanValue = ref<string>(arabicToRoman(2024))

// Watch Arabic input and convert to Roman
watch(arabicValue, (newValue) => {
  if (newValue && newValue >= 1 && newValue <= 3999) {
    try {
      romanValue.value = arabicToRoman(newValue)
    } catch (e) {
      // Invalid input, keep previous value
    }
  }
})

// Watch Roman input and convert to Arabic
watch(romanValue, (newValue) => {
  if (newValue) {
    try {
      arabicValue.value = romanToArabic(newValue.toUpperCase())
    } catch (e) {
      // Invalid input, keep previous value
    }
  }
})

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
