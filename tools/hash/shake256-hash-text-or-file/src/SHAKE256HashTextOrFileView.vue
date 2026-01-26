<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ToolSectionHeader>
      {{ t('output-length') }}
    </ToolSectionHeader>
    <ToolSection>
      <n-form-item
        :label="t('output-length')"
        :validation-status="lengthStatus"
        :feedback="lengthFeedback"
        :show-feedback="!!lengthFeedback"
      >
        <n-input-number
          v-model:value="lengthInput"
          :min="minLength"
          :max="maxLength"
          :step="8"
          :precision="0"
          style="width: 100%"
          :placeholder="t('output-length-placeholder')"
        />
      </n-form-item>
    </ToolSection>
    <HashTextOrFileTemplate :hash="hashFunction" />
    <WhatIsSHAKE256 />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout, ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { HashTextOrFileTemplate } from '@tools/hash-text-or-file-template'
import { shake256 } from '@noble/hashes/sha3'
import WhatIsSHAKE256 from './WhatIsSHAKE256.vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NFormItem, NInputNumber } from 'naive-ui'

const { t } = useI18n()

const minLength = 8
const maxLength = 65536
const defaultLength = 512

const lengthInput = ref<number | null>(defaultLength)

const parseOutputLength = (value: number | null) => {
  if (value === null) {
    return { value: defaultLength, isValid: true }
  }

  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    return { value: defaultLength, isValid: false }
  }

  if (value < minLength || value > maxLength || value % 8 !== 0) {
    return { value: defaultLength, isValid: false }
  }

  return { value, isValid: true }
}

const lengthState = computed(() => parseOutputLength(lengthInput.value))
const lengthStatus = computed(() => (lengthState.value.isValid ? undefined : 'error'))
const lengthFeedback = computed(() => (lengthState.value.isValid ? '' : t('output-length-invalid')))

const hashFunction = computed(() => {
  const outputBits = lengthState.value.value
  const outputBytes = outputBits / 8

  return async (blob: Blob): Promise<ArrayBuffer> => {
    const arrayBuffer = await blob.arrayBuffer()
    const hashBytes = shake256(new Uint8Array(arrayBuffer), { dkLen: outputBytes })
    const buffer = new ArrayBuffer(hashBytes.byteLength)
    new Uint8Array(buffer).set(hashBytes)
    return buffer
  }
})
</script>

<i18n lang="json">
{
  "en": {
    "output-length": "Output Length",
    "output-length-placeholder": "e.g. 512 (bits)",
    "output-length-invalid": "Enter a multiple of 8 between 8 and 65536."
  },
  "zh": {
    "output-length": "输出长度",
    "output-length-placeholder": "例如 512（位）",
    "output-length-invalid": "请输入 8 到 65536 之间的 8 的倍数。"
  },
  "zh-CN": {
    "output-length": "输出长度",
    "output-length-placeholder": "例如 512（位）",
    "output-length-invalid": "请输入 8 到 65536 之间的 8 的倍数。"
  },
  "zh-TW": {
    "output-length": "輸出長度",
    "output-length-placeholder": "例如 512（位）",
    "output-length-invalid": "請輸入 8 到 65536 之間的 8 的倍數。"
  },
  "zh-HK": {
    "output-length": "輸出長度",
    "output-length-placeholder": "例如 512（位）",
    "output-length-invalid": "請輸入 8 到 65536 之間的 8 的倍數。"
  },
  "es": {
    "output-length": "Longitud de Salida",
    "output-length-placeholder": "p. ej., 512 (bits)",
    "output-length-invalid": "Introduce un múltiplo de 8 entre 8 y 65536."
  },
  "fr": {
    "output-length": "Longueur de Sortie",
    "output-length-placeholder": "ex. 512 (bits)",
    "output-length-invalid": "Entrez un multiple de 8 entre 8 et 65536."
  },
  "de": {
    "output-length": "Ausgabelänge",
    "output-length-placeholder": "z. B. 512 (bits)",
    "output-length-invalid": "Gib ein Vielfaches von 8 zwischen 8 und 65536 ein."
  },
  "it": {
    "output-length": "Lunghezza di Output",
    "output-length-placeholder": "es. 512 (bits)",
    "output-length-invalid": "Inserisci un multiplo di 8 tra 8 e 65536."
  },
  "ja": {
    "output-length": "出力長",
    "output-length-placeholder": "例: 512（bits）",
    "output-length-invalid": "8〜65536 の範囲で 8 の倍数を入力してください。"
  },
  "ko": {
    "output-length": "출력 길이",
    "output-length-placeholder": "예: 512 (bits)",
    "output-length-invalid": "8~65536 범위의 8의 배수를 입력하세요."
  },
  "ru": {
    "output-length": "Длина Вывода",
    "output-length-placeholder": "например, 512 (bits)",
    "output-length-invalid": "Введите число, кратное 8, в диапазоне 8–65536."
  },
  "pt": {
    "output-length": "Comprimento de Saída",
    "output-length-placeholder": "ex.: 512 (bits)",
    "output-length-invalid": "Digite um múltiplo de 8 entre 8 e 65536."
  },
  "ar": {
    "output-length": "طول الإخراج",
    "output-length-placeholder": "مثال: 512 (bits)",
    "output-length-invalid": "أدخل مضاعفًا للعدد 8 بين 8 و 65536."
  },
  "hi": {
    "output-length": "आउटपुट लंबाई",
    "output-length-placeholder": "उदा. 512 (bits)",
    "output-length-invalid": "8 से 65536 के बीच 8 का गुणज दर्ज करें।"
  },
  "tr": {
    "output-length": "Çıktı Uzunluğu",
    "output-length-placeholder": "örn. 512 (bits)",
    "output-length-invalid": "8 ile 65536 arasında 8'in katını girin."
  },
  "nl": {
    "output-length": "Uitvoerlengte",
    "output-length-placeholder": "bijv. 512 (bits)",
    "output-length-invalid": "Voer een veelvoud van 8 in tussen 8 en 65536."
  },
  "sv": {
    "output-length": "Utdatalängd",
    "output-length-placeholder": "t.ex. 512 (bits)",
    "output-length-invalid": "Ange en multipel av 8 mellan 8 och 65536."
  },
  "pl": {
    "output-length": "Długość Wyjścia",
    "output-length-placeholder": "np. 512 (bits)",
    "output-length-invalid": "Wprowadź wielokrotność 8 z zakresu 8–65536."
  },
  "vi": {
    "output-length": "Độ Dài Đầu Ra",
    "output-length-placeholder": "vd: 512 (bits)",
    "output-length-invalid": "Nhập bội số của 8 trong khoảng 8–65536."
  },
  "th": {
    "output-length": "ความยาวเอาต์พุต",
    "output-length-placeholder": "เช่น 512 (bits)",
    "output-length-invalid": "กรอกจำนวนที่เป็นพหุคูณของ 8 ระหว่าง 8 ถึง 65536"
  },
  "id": {
    "output-length": "Panjang Output",
    "output-length-placeholder": "mis. 512 (bits)",
    "output-length-invalid": "Masukkan kelipatan 8 antara 8 dan 65536."
  },
  "he": {
    "output-length": "אורך פלט",
    "output-length-placeholder": "למשל 512 (bits)",
    "output-length-invalid": "הזן כפולה של 8 בין 8 ל‑65536."
  },
  "ms": {
    "output-length": "Panjang Output",
    "output-length-placeholder": "cth. 512 (bits)",
    "output-length-invalid": "Masukkan gandaan 8 antara 8 hingga 65536."
  },
  "no": {
    "output-length": "Utdatalengde",
    "output-length-placeholder": "f.eks. 512 (bits)",
    "output-length-invalid": "Skriv inn et multiplum av 8 mellom 8 og 65536."
  }
}
</i18n>
