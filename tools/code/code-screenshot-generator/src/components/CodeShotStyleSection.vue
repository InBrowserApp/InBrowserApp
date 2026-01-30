<template>
  <ToolSectionHeader>{{ t('styleTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <CodeShotSyntaxOptions
        v-model:language="language"
        v-model:render-mode="renderMode"
        v-model:theme-id="themeId"
      />
      <CodeShotBackgroundOptions
        v-model:background-type="backgroundType"
        v-model:background-preset-id="backgroundPresetId"
        v-model:background-color="backgroundColor"
      />
      <CodeShotWindowOptions
        v-model:window-style="windowStyle"
        v-model:show-line-numbers="showLineNumbers"
      />
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NGrid } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { RenderMode, WindowStyle } from '../utils/render'
import CodeShotBackgroundOptions from './CodeShotBackgroundOptions.vue'
import CodeShotSyntaxOptions from './CodeShotSyntaxOptions.vue'
import CodeShotWindowOptions from './CodeShotWindowOptions.vue'

type BackgroundType = 'preset' | 'solid' | 'transparent' | 'none'

const language = defineModel<string>('language', { required: true })
const renderMode = defineModel<RenderMode>('renderMode', { required: true })
const themeId = defineModel<string>('themeId', { required: true })
const backgroundType = defineModel<BackgroundType>('backgroundType', { required: true })
const backgroundPresetId = defineModel<string>('backgroundPresetId', { required: true })
const backgroundColor = defineModel<string>('backgroundColor', { required: true })
const windowStyle = defineModel<WindowStyle>('windowStyle', { required: true })
const showLineNumbers = defineModel<boolean>('showLineNumbers', { required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "styleTitle": "Style"
  },
  "zh": {
    "styleTitle": "样式"
  },
  "zh-CN": {
    "styleTitle": "样式"
  },
  "zh-TW": {
    "styleTitle": "樣式"
  },
  "zh-HK": {
    "styleTitle": "樣式"
  },
  "es": {
    "styleTitle": "Estilo"
  },
  "fr": {
    "styleTitle": "Style"
  },
  "de": {
    "styleTitle": "Stil"
  },
  "it": {
    "styleTitle": "Stile"
  },
  "ja": {
    "styleTitle": "スタイル"
  },
  "ko": {
    "styleTitle": "스타일"
  },
  "ru": {
    "styleTitle": "Стиль"
  },
  "pt": {
    "styleTitle": "Estilo"
  },
  "ar": {
    "styleTitle": "النمط"
  },
  "hi": {
    "styleTitle": "स्टाइल"
  },
  "tr": {
    "styleTitle": "Stil"
  },
  "nl": {
    "styleTitle": "Stijl"
  },
  "sv": {
    "styleTitle": "Stil"
  },
  "pl": {
    "styleTitle": "Styl"
  },
  "vi": {
    "styleTitle": "Phong cách"
  },
  "th": {
    "styleTitle": "สไตล์"
  },
  "id": {
    "styleTitle": "Gaya"
  },
  "he": {
    "styleTitle": "סגנון"
  },
  "ms": {
    "styleTitle": "Gaya"
  },
  "no": {
    "styleTitle": "Stil"
  }
}
</i18n>
