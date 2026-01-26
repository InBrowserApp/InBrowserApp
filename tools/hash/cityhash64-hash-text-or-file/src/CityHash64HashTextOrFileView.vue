<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <HashTextOrFileTemplate :hash="hashFunction" />
    <ToolSectionHeader>
      {{ t('seed-config') }}
    </ToolSectionHeader>
    <ToolSection>
      <n-form-item
        :label="t('seed-label')"
        :validation-status="seedStatus"
        :feedback="seedFeedback"
        :show-feedback="!!seedFeedback"
      >
        <n-input v-model:value="seedInput" :placeholder="t('seed-placeholder')" />
      </n-form-item>
    </ToolSection>
    <WhatIsCityHash />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout, ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { HashTextOrFileTemplate } from '@tools/hash-text-or-file-template'
import WhatIsCityHash from './WhatIsCityHash.vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NFormItem, NInput } from 'naive-ui'
import { cityHash64WithSeed, parseCityHash64Seed } from './cityhash64'

const { t } = useI18n()

const seedInput = ref('0')
const seedState = computed(() => parseCityHash64Seed(seedInput.value))
const seedStatus = computed(() => (seedState.value.isValid ? undefined : 'error'))
const seedFeedback = computed(() => (seedState.value.isValid ? '' : t('seed-invalid')))

const hashFunction = computed(() => {
  const seed = seedState.value.value
  return async (blob: Blob): Promise<ArrayBuffer> => {
    const arrayBuffer = await blob.arrayBuffer()
    const hash = cityHash64WithSeed(new Uint8Array(arrayBuffer), seed)
    const buffer = new ArrayBuffer(8)
    const view = new DataView(buffer)
    view.setBigUint64(0, hash, false) // big-endian
    return buffer
  }
})
</script>

<i18n lang="json">
{
  "en": {
    "seed-config": "Seed",
    "seed-label": "Seed (Optional)",
    "seed-placeholder": "0 or 0x...",
    "seed-invalid": "Enter a decimal number or a 0x hex value."
  },
  "zh": {
    "seed-config": "种子",
    "seed-label": "种子（可选）",
    "seed-placeholder": "0 或 0x...",
    "seed-invalid": "请输入十进制数字或 0x 十六进制数。"
  },
  "zh-CN": {
    "seed-config": "种子",
    "seed-label": "种子（可选）",
    "seed-placeholder": "0 或 0x...",
    "seed-invalid": "请输入十进制数字或 0x 十六进制数。"
  },
  "zh-TW": {
    "seed-config": "種子",
    "seed-label": "種子（可選）",
    "seed-placeholder": "0 或 0x...",
    "seed-invalid": "請輸入十進位數字或 0x 十六進位數。"
  },
  "zh-HK": {
    "seed-config": "種子",
    "seed-label": "種子（可選）",
    "seed-placeholder": "0 或 0x...",
    "seed-invalid": "請輸入十進位數字或 0x 十六進位數。"
  },
  "es": {
    "seed-config": "Semilla",
    "seed-label": "Semilla (Opcional)",
    "seed-placeholder": "0 o 0x...",
    "seed-invalid": "Introduce un número decimal o un valor hexadecimal 0x."
  },
  "fr": {
    "seed-config": "Graine",
    "seed-label": "Graine (optionnelle)",
    "seed-placeholder": "0 ou 0x...",
    "seed-invalid": "Saisissez un nombre décimal ou une valeur hexadécimale 0x."
  },
  "de": {
    "seed-config": "Seed",
    "seed-label": "Seed (optional)",
    "seed-placeholder": "0 oder 0x...",
    "seed-invalid": "Gib eine Dezimalzahl oder einen 0x-Hexwert ein."
  },
  "it": {
    "seed-config": "Seme",
    "seed-label": "Seme (facoltativo)",
    "seed-placeholder": "0 o 0x...",
    "seed-invalid": "Inserisci un numero decimale o un valore esadecimale 0x."
  },
  "ja": {
    "seed-config": "シード",
    "seed-label": "シード（任意）",
    "seed-placeholder": "0 または 0x...",
    "seed-invalid": "10進数または 0x の16進数を入力してください。"
  },
  "ko": {
    "seed-config": "시드",
    "seed-label": "시드(선택 사항)",
    "seed-placeholder": "0 또는 0x...",
    "seed-invalid": "10진수 또는 0x 16진수 값을 입력하세요."
  },
  "ru": {
    "seed-config": "Сид",
    "seed-label": "Сид (необязательно)",
    "seed-placeholder": "0 или 0x...",
    "seed-invalid": "Введите десятичное число или шестнадцатеричное значение с 0x."
  },
  "pt": {
    "seed-config": "Semente",
    "seed-label": "Semente (opcional)",
    "seed-placeholder": "0 ou 0x...",
    "seed-invalid": "Digite um número decimal ou um valor hexadecimal 0x."
  },
  "ar": {
    "seed-config": "البذرة",
    "seed-label": "البذرة (اختياري)",
    "seed-placeholder": "0 أو 0x...",
    "seed-invalid": "أدخل رقمًا عشريًا أو قيمة سداسية عشرية تبدأ بـ 0x."
  },
  "hi": {
    "seed-config": "सीड",
    "seed-label": "सीड (वैकल्पिक)",
    "seed-placeholder": "0 या 0x...",
    "seed-invalid": "दशमलव संख्या या 0x हेक्स मान दर्ज करें।"
  },
  "tr": {
    "seed-config": "Tohum",
    "seed-label": "Tohum (isteğe bağlı)",
    "seed-placeholder": "0 veya 0x...",
    "seed-invalid": "Ondalık bir sayı veya 0x onaltılık değer girin."
  },
  "nl": {
    "seed-config": "Seed",
    "seed-label": "Seed (optioneel)",
    "seed-placeholder": "0 of 0x...",
    "seed-invalid": "Voer een decimaal getal of een 0x-hexwaarde in."
  },
  "sv": {
    "seed-config": "Seed",
    "seed-label": "Seed (valfritt)",
    "seed-placeholder": "0 eller 0x...",
    "seed-invalid": "Ange ett decimaltal eller ett hexvärde med 0x."
  },
  "pl": {
    "seed-config": "Seed",
    "seed-label": "Seed (opcjonalnie)",
    "seed-placeholder": "0 lub 0x...",
    "seed-invalid": "Wprowadź liczbę dziesiętną lub wartość szesnastkową z 0x."
  },
  "vi": {
    "seed-config": "Hạt giống",
    "seed-label": "Hạt giống (tùy chọn)",
    "seed-placeholder": "0 hoặc 0x...",
    "seed-invalid": "Nhập số thập phân hoặc giá trị hex có 0x."
  },
  "th": {
    "seed-config": "ซีด",
    "seed-label": "ซีด (ไม่บังคับ)",
    "seed-placeholder": "0 หรือ 0x...",
    "seed-invalid": "กรอกตัวเลขฐานสิบหรือค่าเลขฐานสิบหกที่ขึ้นต้นด้วย 0x"
  },
  "id": {
    "seed-config": "Seed",
    "seed-label": "Seed (opsional)",
    "seed-placeholder": "0 atau 0x...",
    "seed-invalid": "Masukkan angka desimal atau nilai hex 0x."
  },
  "he": {
    "seed-config": "זרע",
    "seed-label": "זרע (אופציונלי)",
    "seed-placeholder": "0 או 0x...",
    "seed-invalid": "הזן מספר עשרוני או ערך הקסדצימלי עם ‎0x."
  },
  "ms": {
    "seed-config": "Seed",
    "seed-label": "Seed (pilihan)",
    "seed-placeholder": "0 atau 0x...",
    "seed-invalid": "Masukkan nombor perpuluhan atau nilai heks 0x."
  },
  "no": {
    "seed-config": "Seed",
    "seed-label": "Seed (valgfritt)",
    "seed-placeholder": "0 eller 0x...",
    "seed-invalid": "Skriv inn et desimaltall eller en 0x-heksverdi."
  }
}
</i18n>
