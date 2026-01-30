<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ToolSectionHeader>
      {{ t('crc-input') }}
    </ToolSectionHeader>
    <TextOrFileInput v-model:value="textOrFile" />
    <ToolSectionHeader v-if="textOrFile">
      {{ t('crc-result') }}
    </ToolSectionHeader>
    <ToolSection v-show="textOrFile">
      <n-grid v-if="crcResults" cols="1 400:2 800:4 1200:5">
        <n-grid-item v-for="result in crcResults" :key="result.name">
          <n-text>
            <n-text strong>{{ result.name }}: </n-text>
            <CopyToClipboardTooltip :content="result.crc" #="{ copy }">
              <n-text
                code
                style="cursor: pointer"
                class="crc-result"
                :class="{ processing: processing }"
                @click="copy"
              >
                {{ result.crc }}
              </n-text>
            </CopyToClipboardTooltip>
          </n-text>
        </n-grid-item>
      </n-grid>
    </ToolSection>
    <WhatIsCRC />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout, ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import WhatIsCRC from './WhatIsCRC.vue'
import { ref, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { computedAsync } from '@vueuse/core'
import { NText, NGrid, NGridItem } from 'naive-ui'
import { TextOrFileInput } from '@shared/ui/base'
import { CopyToClipboardTooltip } from '@shared/ui/base'
import CRCWorker from './crc-calulator.worker?worker'
import * as Comlink from 'comlink'
import type { CRCCalculatorType } from './crc-calulator.worker'

const { t } = useI18n()

const textOrFile = ref<string | File>('')
const processing = shallowRef(false)

const crcResults = computedAsync<
  {
    name: string
    crc: string
  }[]
>(
  async () => {
    const input = textOrFile.value
    const blob = typeof input === 'string' ? new Blob([input], { type: 'text/plain' }) : input
    const CRCCalculator = Comlink.wrap<CRCCalculatorType>(new CRCWorker())
    const instance = await new CRCCalculator()
    const results = await instance.calculate(blob)
    return results
  },
  undefined,
  processing,
)
</script>

<style scoped>
.crc-result {
  transition: filter 0.3s ease-in-out;
}

.crc-result.processing {
  filter: blur(5px);
}
</style>

<i18n lang="json">
{
  "en": {
    "crc-input": "Text or File Input",
    "crc-result": "CRC Results"
  },
  "zh": {
    "crc-input": "文本或文件输入",
    "crc-result": "CRC 结果"
  },
  "zh-CN": {
    "crc-input": "文本或文件输入",
    "crc-result": "CRC 结果"
  },
  "zh-TW": {
    "crc-input": "文字或檔案輸入",
    "crc-result": "CRC 結果"
  },
  "zh-HK": {
    "crc-input": "文字或檔案輸入",
    "crc-result": "CRC 結果"
  },
  "es": {
    "crc-input": "Entrada de Texto o Archivo",
    "crc-result": "Resultados CRC"
  },
  "fr": {
    "crc-input": "Entrée de Texte ou Fichier",
    "crc-result": "Résultats CRC"
  },
  "de": {
    "crc-input": "Text- oder Dateieingabe",
    "crc-result": "CRC-Ergebnisse"
  },
  "it": {
    "crc-input": "Input di Testo o File",
    "crc-result": "Risultati CRC"
  },
  "ja": {
    "crc-input": "テキストまたはファイル入力",
    "crc-result": "CRC 結果"
  },
  "ko": {
    "crc-input": "텍스트 또는 파일 입력",
    "crc-result": "CRC 결과"
  },
  "ru": {
    "crc-input": "Ввод текста или файла",
    "crc-result": "Результаты CRC"
  },
  "pt": {
    "crc-input": "Entrada de Texto ou Arquivo",
    "crc-result": "Resultados CRC"
  },
  "ar": {
    "crc-input": "إدخال نص أو ملف",
    "crc-result": "نتائج CRC"
  },
  "hi": {
    "crc-input": "टेक्स्ट या फ़ाइल इनपुट",
    "crc-result": "CRC परिणाम"
  },
  "tr": {
    "crc-input": "Metin veya Dosya Girişi",
    "crc-result": "CRC Sonuçları"
  },
  "nl": {
    "crc-input": "Tekst- of Bestandsinvoer",
    "crc-result": "CRC-resultaten"
  },
  "sv": {
    "crc-input": "Text- eller filinmatning",
    "crc-result": "CRC-resultat"
  },
  "pl": {
    "crc-input": "Wprowadzanie tekstu lub pliku",
    "crc-result": "Wyniki CRC"
  },
  "vi": {
    "crc-input": "Nhập văn bản hoặc tệp",
    "crc-result": "Kết quả CRC"
  },
  "th": {
    "crc-input": "การป้อนข้อความหรือไฟล์",
    "crc-result": "ผลลัพธ์ CRC"
  },
  "id": {
    "crc-input": "Input Teks atau File",
    "crc-result": "Hasil CRC"
  },
  "he": {
    "crc-input": "קלט טקסט או קובץ",
    "crc-result": "תוצאות CRC"
  },
  "ms": {
    "crc-input": "Input Teks atau Fail",
    "crc-result": "Keputusan CRC"
  },
  "no": {
    "crc-input": "Tekst- eller filinndata",
    "crc-result": "CRC-resultater"
  }
}
</i18n>
