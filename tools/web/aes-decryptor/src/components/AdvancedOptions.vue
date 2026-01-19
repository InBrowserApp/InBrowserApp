<template>
  <ToolSection v-if="!isJweMode">
    <n-collapse>
      <n-collapse-item :title="t('advancedOptions')" name="advanced">
        <n-grid :cols="2" :x-gap="12" :y-gap="12">
          <n-form-item-gi v-if="keyType === 'password'" :label="t('pbkdf2Iterations')">
            <n-input-number
              :value="pbkdf2Iterations"
              :min="1000"
              :max="10000000"
              :step="10000"
              style="width: 100%"
              @update:value="$event !== null && $emit('update:pbkdf2Iterations', $event)"
            />
          </n-form-item-gi>
          <n-form-item-gi v-if="keyType === 'password'" :label="t('pbkdf2Hash')">
            <n-select
              :value="pbkdf2Hash"
              :options="pbkdf2HashOptions"
              @update:value="$emit('update:pbkdf2Hash', $event)"
            />
          </n-form-item-gi>
        </n-grid>
      </n-collapse-item>
    </n-collapse>
  </ToolSection>
</template>

<script setup lang="ts">
import { NGrid, NFormItemGi, NCollapse, NCollapseItem, NInputNumber, NSelect } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import type { KeyType, Pbkdf2Hash } from '@utils/aes'

defineProps<{
  isJweMode: boolean
  keyType: KeyType
  pbkdf2Iterations: number
  pbkdf2Hash: Pbkdf2Hash
}>()

defineEmits<{
  'update:pbkdf2Iterations': [value: number]
  'update:pbkdf2Hash': [value: Pbkdf2Hash]
}>()

const { t } = useI18n()

const pbkdf2HashOptions = [
  { label: 'SHA-1', value: 'SHA-1' },
  { label: 'SHA-256', value: 'SHA-256' },
  { label: 'SHA-384', value: 'SHA-384' },
  { label: 'SHA-512', value: 'SHA-512' },
] satisfies Array<{ label: string; value: Pbkdf2Hash }>
</script>

<i18n lang="json">
{
  "en": {
    "advancedOptions": "Advanced Options",
    "pbkdf2Iterations": "PBKDF2 Iterations",
    "pbkdf2Hash": "PBKDF2 Hash"
  },
  "zh": {
    "advancedOptions": "高级选项",
    "pbkdf2Iterations": "PBKDF2 迭代次数",
    "pbkdf2Hash": "PBKDF2 哈希"
  },
  "zh-CN": {
    "advancedOptions": "高级选项",
    "pbkdf2Iterations": "PBKDF2 迭代次数",
    "pbkdf2Hash": "PBKDF2 哈希"
  },
  "zh-TW": {
    "advancedOptions": "高級選項",
    "pbkdf2Iterations": "PBKDF2 迭代次數",
    "pbkdf2Hash": "PBKDF2 哈希"
  },
  "zh-HK": {
    "advancedOptions": "高級選項",
    "pbkdf2Iterations": "PBKDF2 迭代次數",
    "pbkdf2Hash": "PBKDF2 哈希"
  },
  "es": {
    "advancedOptions": "Opciones avanzadas",
    "pbkdf2Iterations": "Iteraciones de PBKDF2",
    "pbkdf2Hash": "Hash de PBKDF2"
  },
  "fr": {
    "advancedOptions": "Options avancées",
    "pbkdf2Iterations": "Itérations PBKDF2",
    "pbkdf2Hash": "Hachage PBKDF2"
  },
  "de": {
    "advancedOptions": "Erweiterte Optionen",
    "pbkdf2Iterations": "PBKDF2-Iterationen",
    "pbkdf2Hash": "PBKDF2-Hash"
  },
  "it": {
    "advancedOptions": "Opzioni avanzate",
    "pbkdf2Iterations": "Iterazioni PBKDF2",
    "pbkdf2Hash": "Hash PBKDF2"
  },
  "ja": {
    "advancedOptions": "詳細オプション",
    "pbkdf2Iterations": "PBKDF2 反復回数",
    "pbkdf2Hash": "PBKDF2 ハッシュ"
  },
  "ko": {
    "advancedOptions": "고급 옵션",
    "pbkdf2Iterations": "PBKDF2 반복 횟수",
    "pbkdf2Hash": "PBKDF2 해시"
  },
  "ru": {
    "advancedOptions": "Дополнительные параметры",
    "pbkdf2Iterations": "Итерации PBKDF2",
    "pbkdf2Hash": "Хэш PBKDF2"
  },
  "pt": {
    "advancedOptions": "Opções avançadas",
    "pbkdf2Iterations": "Iterações PBKDF2",
    "pbkdf2Hash": "Hash PBKDF2"
  },
  "ar": {
    "advancedOptions": "خيارات متقدمة",
    "pbkdf2Iterations": "تكرارات PBKDF2",
    "pbkdf2Hash": "تجزئة PBKDF2"
  },
  "hi": {
    "advancedOptions": "उन्नत विकल्प",
    "pbkdf2Iterations": "PBKDF2 पुनरावृत्तियाँ",
    "pbkdf2Hash": "PBKDF2 हैश"
  },
  "tr": {
    "advancedOptions": "Gelişmiş seçenekler",
    "pbkdf2Iterations": "PBKDF2 yinelemeleri",
    "pbkdf2Hash": "PBKDF2 karması"
  },
  "nl": {
    "advancedOptions": "Geavanceerde opties",
    "pbkdf2Iterations": "PBKDF2-iteraties",
    "pbkdf2Hash": "PBKDF2-hash"
  },
  "sv": {
    "advancedOptions": "Avancerade alternativ",
    "pbkdf2Iterations": "PBKDF2-iterationer",
    "pbkdf2Hash": "PBKDF2-hash"
  },
  "pl": {
    "advancedOptions": "Opcje zaawansowane",
    "pbkdf2Iterations": "Iteracje PBKDF2",
    "pbkdf2Hash": "Skrót PBKDF2"
  },
  "vi": {
    "advancedOptions": "Tùy chọn nâng cao",
    "pbkdf2Iterations": "Số vòng lặp PBKDF2",
    "pbkdf2Hash": "Băm PBKDF2"
  },
  "th": {
    "advancedOptions": "ตัวเลือกขั้นสูง",
    "pbkdf2Iterations": "จำนวนรอบ PBKDF2",
    "pbkdf2Hash": "แฮช PBKDF2"
  },
  "id": {
    "advancedOptions": "Opsi lanjutan",
    "pbkdf2Iterations": "Iterasi PBKDF2",
    "pbkdf2Hash": "Hash PBKDF2"
  },
  "he": {
    "advancedOptions": "אפשרויות מתקדמות",
    "pbkdf2Iterations": "איטרציות PBKDF2",
    "pbkdf2Hash": "האש PBKDF2"
  },
  "ms": {
    "advancedOptions": "Pilihan lanjutan",
    "pbkdf2Iterations": "Lelaran PBKDF2",
    "pbkdf2Hash": "Hash PBKDF2"
  },
  "no": {
    "advancedOptions": "Avanserte alternativer",
    "pbkdf2Iterations": "PBKDF2-iterasjoner",
    "pbkdf2Hash": "PBKDF2-hash"
  }
}
</i18n>
