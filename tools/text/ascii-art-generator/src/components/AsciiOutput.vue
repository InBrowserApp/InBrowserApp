<template>
  <ToolSectionHeader>
    <NFlex align="center" justify="space-between">
      <span>{{ t('output') }}</span>
      <CopyToClipboardButton v-if="output" :content="output" size="small" />
    </NFlex>
  </ToolSectionHeader>
  <ToolSection>
    <NCode v-if="output" :code="output" style="white-space: pre; overflow-x: auto" />
    <NText v-else depth="3">{{ t('outputPlaceholder') }}</NText>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computedAsync } from '@vueuse/core'
import { NCode, NFlex, NText } from 'naive-ui'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import { generateAsciiArt } from '../utils/fonts'

const props = defineProps<{
  text: string
  font: string
}>()

const { t } = useI18n()

const output = computedAsync(() => generateAsciiArt(props.text, props.font), '')
</script>

<i18n lang="json">
{
  "en": {
    "output": "ASCII Art Output",
    "outputPlaceholder": "ASCII art will appear here..."
  },
  "zh": {
    "output": "ASCII 艺术输出",
    "outputPlaceholder": "ASCII 艺术字将显示在这里..."
  },
  "zh-CN": {
    "output": "ASCII 艺术输出",
    "outputPlaceholder": "ASCII 艺术字将显示在这里..."
  },
  "zh-TW": {
    "output": "ASCII 藝術輸出",
    "outputPlaceholder": "ASCII 藝術字將顯示在這裡..."
  },
  "zh-HK": {
    "output": "ASCII 藝術輸出",
    "outputPlaceholder": "ASCII 藝術字將顯示在這裡..."
  },
  "es": {
    "output": "Salida de Arte ASCII",
    "outputPlaceholder": "El arte ASCII aparecera aqui..."
  },
  "fr": {
    "output": "Sortie Art ASCII",
    "outputPlaceholder": "L'art ASCII apparaitra ici..."
  },
  "de": {
    "output": "ASCII-Kunst Ausgabe",
    "outputPlaceholder": "ASCII-Kunst wird hier angezeigt..."
  },
  "it": {
    "output": "Output Arte ASCII",
    "outputPlaceholder": "L'arte ASCII apparira qui..."
  },
  "ja": {
    "output": "ASCII アート出力",
    "outputPlaceholder": "ASCII アートがここに表示されます..."
  },
  "ko": {
    "output": "ASCII 아트 출력",
    "outputPlaceholder": "ASCII 아트가 여기에 표시됩니다..."
  },
  "ru": {
    "output": "Вывод ASCII-арта",
    "outputPlaceholder": "ASCII-арт появится здесь..."
  },
  "pt": {
    "output": "Saida de Arte ASCII",
    "outputPlaceholder": "A arte ASCII aparecera aqui..."
  },
  "ar": {
    "output": "مخرجات فن ASCII",
    "outputPlaceholder": "سيظهر فن ASCII هنا..."
  },
  "hi": {
    "output": "ASCII आर्ट आउटपुट",
    "outputPlaceholder": "ASCII आर्ट यहाँ दिखाई देगी..."
  },
  "tr": {
    "output": "ASCII Sanati Ciktisi",
    "outputPlaceholder": "ASCII sanati burada gorunecek..."
  },
  "nl": {
    "output": "ASCII-kunst Uitvoer",
    "outputPlaceholder": "ASCII-kunst verschijnt hier..."
  },
  "sv": {
    "output": "ASCII-konst Utdata",
    "outputPlaceholder": "ASCII-konst visas har..."
  },
  "pl": {
    "output": "Wynik Sztuki ASCII",
    "outputPlaceholder": "Sztuka ASCII pojawi sie tutaj..."
  },
  "vi": {
    "output": "Ket Qua Nghe Thuat ASCII",
    "outputPlaceholder": "Nghe thuat ASCII se hien thi o day..."
  },
  "th": {
    "output": "ผลลัพธ์ ASCII Art",
    "outputPlaceholder": "ASCII Art จะแสดงที่นี่..."
  },
  "id": {
    "output": "Output Seni ASCII",
    "outputPlaceholder": "Seni ASCII akan muncul di sini..."
  },
  "he": {
    "output": "פלט אמנות ASCII",
    "outputPlaceholder": "אמנות ASCII תופיע כאן..."
  },
  "ms": {
    "output": "Output Seni ASCII",
    "outputPlaceholder": "Seni ASCII akan muncul di sini..."
  },
  "no": {
    "output": "ASCII-kunst Utdata",
    "outputPlaceholder": "ASCII-kunst vises her..."
  }
}
</i18n>
