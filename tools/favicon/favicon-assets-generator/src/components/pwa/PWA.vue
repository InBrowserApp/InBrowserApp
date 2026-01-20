<template>
  <ToolSectionHeader>
    <n-icon :component="LogoPwa" style="vertical-align: -0.15em" />
    {{ t('title') }}
  </ToolSectionHeader>
  <ToolSection>
    <a href="https://web.dev/articles/maskable-icon" target="_blank" class="link">
      <n-icon :component="BookInformation20Regular" style="vertical-align: -0.15em" size="1.2em" />
      <i18n-t keypath="purposeDifference" tag="span">
        <template #any>
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          <n-text code>"purpose": "any"</n-text>
        </template>
        <template #maskable>
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
          <n-text code>"purpose": "maskable"</n-text>
        </template>
      </i18n-t>
    </a>
  </ToolSection>
  <n-h3 prefix="bar" align-text>
    {{ t('pwaAny') }}
    <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
    <n-text code>"purpose": "any"</n-text>
  </n-h3>
  <n-grid x-gap="30" y-gap="20" :cols="5" item-responsive responsive="screen">
    <n-grid-item span="5 s:2">
      <PWAPreview :image="image" :options="options" :general-info-options="generalInfoOptions" />
    </n-grid-item>
    <n-grid-item span="5 s:3">
      <PWASettings :image="image" v-model:options="options" />
    </n-grid-item>
  </n-grid>
  <n-h3 prefix="bar" align-text>
    {{ t('pwaMaskable') }}
    <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
    <n-text code>"purpose": "maskable"</n-text>
  </n-h3>
  <n-grid x-gap="30" y-gap="20" :cols="5" item-responsive responsive="screen">
    <n-grid-item span="5 s:2">
      <PWAMaskablePreview
        :image="image"
        :options="options"
        :general-info-options="generalInfoOptions"
      />
    </n-grid-item>
    <n-grid-item span="5 s:3">
      <PWAMaskableSettings :image="image" v-model:options="options" />
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { NH3, NText, NGrid, NGridItem, NIcon } from 'naive-ui'
import type { PWAOptions } from '../../utils/favicon-generator/pwa'
import { useVModel } from '@vueuse/core'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'
import PWAPreview from './any/PWAPreview.vue'
import PWAMaskablePreview from './maskable/PWAMaskablePreview.vue'
import PWASettings from './any/PWASettings.vue'
import PWAMaskableSettings from './maskable/PWAMaskableSettings.vue'
import LogoPwa from '@vicons/ionicons5/LogoPwa'
import BookInformation20Regular from '@vicons/fluent/BookInformation20Regular'
import { useI18n } from 'vue-i18n'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'

const { t } = useI18n()

const props = defineProps<{
  image: Blob | undefined
  options: PWAOptions
  generalInfoOptions: GeneralInfoOptions
}>()

const emit = defineEmits(['update:options'])

const options = useVModel(props, 'options', emit)
</script>

<style scoped>
.link {
  color: inherit;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>

<i18n lang="json">
{
  "en": {
    "title": "Progressive Web App (PWA)",
    "purposeDifference": "What's the difference between {any} and {maskable}?",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  },
  "zh": {
    "title": "渐进式 Web 应用 (PWA)",
    "purposeDifference": "{any} 和 {maskable} 有什么区别？",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  },
  "zh-CN": {
    "title": "渐进式 Web 应用 (PWA)",
    "purposeDifference": "{any} 和 {maskable} 有什么区别？",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  },
  "zh-TW": {
    "title": "漸進式 Web 應用 (PWA)",
    "purposeDifference": "{any} 和 {maskable} 有什麼區別？",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  },
  "zh-HK": {
    "title": "漸進式 Web 應用 (PWA)",
    "purposeDifference": "{any} 和 {maskable} 有什麼區別？",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  },
  "es": {
    "title": "Aplicación Web Progresiva (PWA)",
    "purposeDifference": "¿Cuál es la diferencia entre {any} y {maskable}?",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  },
  "fr": {
    "title": "Application Web Progressive (PWA)",
    "purposeDifference": "Quelle est la différence entre {any} et {maskable} ?",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  },
  "de": {
    "title": "Progressive Web App (PWA)",
    "purposeDifference": "Was ist der Unterschied zwischen {any} und {maskable}?",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  },
  "it": {
    "title": "Applicazione Web Progressiva (PWA)",
    "purposeDifference": "Qual è la differenza tra {any} e {maskable}?",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  },
  "ja": {
    "title": "プログレッシブウェブアプリ (PWA)",
    "purposeDifference": "{any} と {maskable} の違いは何ですか？",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  },
  "ko": {
    "title": "프로그레시브 웹 앱 (PWA)",
    "purposeDifference": "{any}와 {maskable}의 차이점은 무엇인가요?",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  },
  "ru": {
    "title": "Прогрессивное веб-приложение (PWA)",
    "purposeDifference": "В чем разница между {any} и {maskable}?",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  },
  "pt": {
    "title": "Aplicativo Web Progressivo (PWA)",
    "purposeDifference": "Qual é a diferença entre {any} e {maskable}?",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  },
  "ar": {
    "title": "تطبيق الويب التقدمي (PWA)",
    "purposeDifference": "ما الفرق بين {any} و {maskable}؟",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  },
  "hi": {
    "title": "प्रोग्रेसिव वेब ऐप (PWA)",
    "purposeDifference": "{any} और {maskable} में क्या अंतर है?",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  },
  "tr": {
    "title": "İlerici Web Uygulaması (PWA)",
    "purposeDifference": "{any} ve {maskable} arasındaki fark nedir?",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  },
  "nl": {
    "title": "Progressive Web App (PWA)",
    "purposeDifference": "Wat is het verschil tussen {any} en {maskable}?",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  },
  "sv": {
    "title": "Progressiv webbapp (PWA)",
    "purposeDifference": "Vad är skillnaden mellan {any} och {maskable}?",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  },
  "pl": {
    "title": "Progresywna Aplikacja Internetowa (PWA)",
    "purposeDifference": "Jaka jest różnica między {any} a {maskable}?",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  },
  "vi": {
    "title": "Ứng dụng Web Tiến bộ (PWA)",
    "purposeDifference": "Sự khác biệt giữa {any} và {maskable} là gì?",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  },
  "th": {
    "title": "เว็บแอปพลิเคชันแบบก้าวหน้า (PWA)",
    "purposeDifference": "ความแตกต่างระหว่าง {any} และ {maskable} คืออะไร?",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  },
  "id": {
    "title": "Aplikasi Web Progresif (PWA)",
    "purposeDifference": "Apa perbedaan antara {any} dan {maskable}?",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  },
  "he": {
    "title": "אפליקציית ווב מתקדמת (PWA)",
    "purposeDifference": "מה ההבדל בין {any} ל-{maskable}?",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  },
  "ms": {
    "title": "Aplikasi Web Progresif (PWA)",
    "purposeDifference": "Apakah perbezaan antara {any} dan {maskable}?",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  },
  "no": {
    "title": "Progressiv Web App (PWA)",
    "purposeDifference": "Hva er forskjellen mellom {any} og {maskable}?",
    "pwaAny": "PWA",
    "pwaMaskable": "PWA"
  }
}
</i18n>
