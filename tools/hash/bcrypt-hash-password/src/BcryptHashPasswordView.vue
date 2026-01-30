<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ToolSectionHeader>
      {{ t('input-header') }}
    </ToolSectionHeader>
    <ToolSection>
      <n-form-item :label="t('input')">
        <n-input
          v-model:value="text"
          :placeholder="t('input')"
          type="password"
          show-password-on="click"
          :input-props="{ autocomplete: 'off' }"
        />
      </n-form-item>
      <n-form-item :label="t('rounds')" :show-feedback="false">
        <n-slider v-model:value="rounds" :min="1" :max="15" :step="1" />
      </n-form-item>
    </ToolSection>

    <ToolSectionHeader>
      {{ t('output-header') }}
    </ToolSectionHeader>
    <ToolSection>
      <CopyToClipboardTooltip :content="result" #="{ copy }">
        <n-text
          code
          class="bcrypt-result"
          :class="{ 'bcrypt-result-processing': processing }"
          @click="copy"
        >
          {{ result }}
        </n-text>
      </CopyToClipboardTooltip>
    </ToolSection>
    <ToolSection>
      <CopyToClipboardButton :content="result" />
    </ToolSection>
    <WhatIsBcrypt />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout, ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import WhatIsBcrypt from './WhatIsBcrypt.vue'
import { useI18n } from 'vue-i18n'
import { NSlider, NInput, NFormItem, NText } from 'naive-ui'
import { hash } from 'bcrypt-ts'
import { computedAsync } from '@vueuse/core'
import { ref } from 'vue'
import { CopyToClipboardTooltip, CopyToClipboardButton } from '@shared/ui/base'

const { t } = useI18n()
const text = ref('')
const rounds = ref(10)
const processing = ref(false)

const result = computedAsync<string>(
  async () => {
    return await hash(text.value, rounds.value)
  },
  undefined,
  processing,
)
</script>

<style scoped>
.bcrypt-result {
  cursor: pointer;
  font-size: 1.5em;
  word-break: break-all;
  transition: filter 0.3s ease-in-out;
}

.bcrypt-result-processing {
  cursor: not-allowed;
  filter: blur(10px);
}
</style>

<i18n lang="json">
{
  "en": {
    "input-header": "Input",
    "input": "Text to Hash",
    "rounds": "Salt Rounds",
    "output-header": "Bcrypt Hash Output"
  },
  "zh": {
    "input-header": "输入",
    "input": "要加密的文本",
    "rounds": "盐值轮数",
    "output-header": "Bcrypt 哈希输出"
  },
  "zh-CN": {
    "input-header": "输入",
    "input": "要加密的文本",
    "rounds": "盐值轮数",
    "output-header": "Bcrypt 哈希输出"
  },
  "zh-TW": {
    "input-header": "輸入",
    "input": "要加密的文字",
    "rounds": "鹽值輪數",
    "output-header": "Bcrypt 雜湊輸出"
  },
  "zh-HK": {
    "input-header": "輸入",
    "input": "要加密的文字",
    "rounds": "鹽值輪數",
    "output-header": "Bcrypt 雜湊輸出"
  },
  "es": {
    "input-header": "Entrada",
    "input": "Texto a Hashear",
    "rounds": "Rondas de Salt",
    "output-header": "Salida Hash Bcrypt"
  },
  "fr": {
    "input-header": "Entrée",
    "input": "Texte à Hacher",
    "rounds": "Rounds de Salt",
    "output-header": "Sortie Hash Bcrypt"
  },
  "de": {
    "input-header": "Eingabe",
    "input": "Zu hashender Text",
    "rounds": "Salt-Runden",
    "output-header": "Bcrypt-Hash-Ausgabe"
  },
  "it": {
    "input-header": "Input",
    "input": "Testo da Hashare",
    "rounds": "Rounds di Salt",
    "output-header": "Output Hash Bcrypt"
  },
  "ja": {
    "input-header": "入力",
    "input": "ハッシュ化するテキスト",
    "rounds": "ソルトラウンド",
    "output-header": "Bcryptハッシュ出力"
  },
  "ko": {
    "input-header": "입력",
    "input": "해시할 텍스트",
    "rounds": "솔트 라운드",
    "output-header": "Bcrypt 해시 출력"
  },
  "ru": {
    "input-header": "Ввод",
    "input": "Текст для хеширования",
    "rounds": "Раунды соли",
    "output-header": "Вывод хеша Bcrypt"
  },
  "pt": {
    "input-header": "Entrada",
    "input": "Texto para Hash",
    "rounds": "Rounds de Salt",
    "output-header": "Saída Hash Bcrypt"
  },
  "ar": {
    "input-header": "الإدخال",
    "input": "النص المراد تشفيره",
    "rounds": "جولات الملح",
    "output-header": "إخراج تشفير Bcrypt"
  },
  "hi": {
    "input-header": "इनपुट",
    "input": "हैश करने के लिए टेक्स्ट",
    "rounds": "सॉल्ट राउंड्स",
    "output-header": "Bcrypt हैश आउटपुट"
  },
  "tr": {
    "input-header": "Giriş",
    "input": "Hash'lenecek Metin",
    "rounds": "Salt Turları",
    "output-header": "Bcrypt Hash Çıktısı"
  },
  "nl": {
    "input-header": "Invoer",
    "input": "Te hashen tekst",
    "rounds": "Salt rondes",
    "output-header": "Bcrypt hash uitvoer"
  },
  "sv": {
    "input-header": "Inmatning",
    "input": "Text att hasha",
    "rounds": "Salt-rundor",
    "output-header": "Bcrypt hash-utdata"
  },
  "pl": {
    "input-header": "Wejście",
    "input": "Tekst do hashowania",
    "rounds": "Rundy salt",
    "output-header": "Wyjście hash Bcrypt"
  },
  "vi": {
    "input-header": "Đầu vào",
    "input": "Văn bản để băm",
    "rounds": "Vòng salt",
    "output-header": "Đầu ra băm Bcrypt"
  },
  "th": {
    "input-header": "อินพุต",
    "input": "ข้อความที่จะแฮช",
    "rounds": "รอบของ Salt",
    "output-header": "เอาต์พุต Bcrypt Hash"
  },
  "id": {
    "input-header": "Masukan",
    "input": "Teks untuk di-hash",
    "rounds": "Putaran Salt",
    "output-header": "Output Hash Bcrypt"
  },
  "he": {
    "input-header": "קלט",
    "input": "טקסט לגיבוב",
    "rounds": "סיבובי מלח",
    "output-header": "פלט גיבוב Bcrypt"
  },
  "ms": {
    "input-header": "Input",
    "input": "Teks untuk di-hash",
    "rounds": "Pusingan Salt",
    "output-header": "Output Hash Bcrypt"
  },
  "no": {
    "input-header": "Inndata",
    "input": "Tekst å hashe",
    "rounds": "Salt-runder",
    "output-header": "Bcrypt hash-utdata"
  }
}
</i18n>
