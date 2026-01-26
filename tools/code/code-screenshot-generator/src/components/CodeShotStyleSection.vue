<template>
  <ToolSectionHeader>{{ t('styleTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <CodeShotSyntaxOptions
        v-model:language="languageProxy"
        v-model:render-mode="renderModeProxy"
        v-model:theme-id="themeIdProxy"
      />
      <CodeShotBackgroundOptions
        v-model:background-type="backgroundTypeProxy"
        v-model:background-preset-id="backgroundPresetIdProxy"
        v-model:background-color="backgroundColorProxy"
      />
      <CodeShotWindowOptions
        v-model:window-style="windowStyleProxy"
        v-model:show-line-numbers="showLineNumbersProxy"
      />
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NGrid } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { RenderMode, WindowStyle } from '../utils/render'
import CodeShotBackgroundOptions from './CodeShotBackgroundOptions.vue'
import CodeShotSyntaxOptions from './CodeShotSyntaxOptions.vue'
import CodeShotWindowOptions from './CodeShotWindowOptions.vue'

type BackgroundType = 'preset' | 'solid' | 'transparent' | 'none'

const props = defineProps<{
  language: string
  renderMode: RenderMode
  themeId: string
  backgroundType: BackgroundType
  backgroundPresetId: string
  backgroundColor: string
  windowStyle: WindowStyle
  showLineNumbers: boolean
}>()

const emit = defineEmits<{
  (e: 'update:language', value: string): void
  (e: 'update:renderMode', value: RenderMode): void
  (e: 'update:themeId', value: string): void
  (e: 'update:backgroundType', value: BackgroundType): void
  (e: 'update:backgroundPresetId', value: string): void
  (e: 'update:backgroundColor', value: string): void
  (e: 'update:windowStyle', value: WindowStyle): void
  (e: 'update:showLineNumbers', value: boolean): void
}>()

const { t } = useI18n()

const languageProxy = computed({
  get: () => props.language,
  set: (value: string) => emit('update:language', value),
})

const renderModeProxy = computed({
  get: () => props.renderMode,
  set: (value: RenderMode) => emit('update:renderMode', value),
})

const themeIdProxy = computed({
  get: () => props.themeId,
  set: (value: string) => emit('update:themeId', value),
})

const backgroundTypeProxy = computed({
  get: () => props.backgroundType,
  set: (value: BackgroundType) => emit('update:backgroundType', value),
})

const backgroundPresetIdProxy = computed({
  get: () => props.backgroundPresetId,
  set: (value: string) => emit('update:backgroundPresetId', value),
})

const backgroundColorProxy = computed({
  get: () => props.backgroundColor,
  set: (value: string) => emit('update:backgroundColor', value),
})

const windowStyleProxy = computed({
  get: () => props.windowStyle,
  set: (value: WindowStyle) => emit('update:windowStyle', value),
})

const showLineNumbersProxy = computed({
  get: () => props.showLineNumbers,
  set: (value: boolean) => emit('update:showLineNumbers', value),
})
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
