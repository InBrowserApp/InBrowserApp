<template>
  <n-grid cols="1 l:2" responsive="screen" :x-gap="24" :y-gap="24">
    <n-gi>
      <CodeShotInputSection v-model:code="code" />
      <CodeShotStyleSection
        v-model:language="language"
        v-model:render-mode="renderMode"
        v-model:theme-id="themeId"
        v-model:background-type="backgroundType"
        v-model:background-preset-id="backgroundPresetId"
        v-model:background-color="backgroundColor"
        v-model:window-style="windowStyle"
        v-model:show-line-numbers="showLineNumbers"
      />
      <CodeShotLayoutSection
        v-model:font-size="fontSize"
        v-model:line-height="lineHeight"
        v-model:card-padding="cardPadding"
        v-model:frame-padding="framePadding"
        v-model:radius="radius"
        v-model:shadow="shadow"
        v-model:tab-size="tabSize"
        :is-background-none="isBackgroundNone"
      />
    </n-gi>

    <n-gi>
      <CodeShotPreviewSection
        :lines="styledLines"
        :line-numbers="lineNumbers"
        :layout="layoutConfig"
        :theme="activeTheme"
        :background="backgroundConfig"
      />
      <CodeShotExportSection
        v-model:filename="fileName"
        :svg-markup="svgOutput.svg"
        :svg-width="svgOutput.width"
        :svg-height="svgOutput.height"
        :html-snippet="htmlSnippet"
        :html-document="htmlDocument"
        :jpg-background="jpgBackground"
      />
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useDebounce, useStorage } from '@vueuse/core'
import { NGrid, NGi } from 'naive-ui'
import hljs from 'highlight.js/lib/core'
import { registerHighlightLanguages } from '../utils/languages'
import { DEFAULT_MONO_FONT, getBackgroundPreset, getThemeById } from '../utils/themes'
import {
  applyTokenStyles,
  buildCodeShotSvg,
  buildHtmlDocument,
  buildHtmlSnippet,
  buildLineNumbers,
  highlightToTokens,
  normalizeCode,
  tokensToLines,
  type BackgroundConfig,
  type RenderMode,
  type WindowStyle,
} from '../utils/render'
import CodeShotExportSection from './CodeShotExportSection.vue'
import CodeShotInputSection from './CodeShotInputSection.vue'
import CodeShotLayoutSection from './CodeShotLayoutSection.vue'
import CodeShotPreviewSection from './CodeShotPreviewSection.vue'
import CodeShotStyleSection from './CodeShotStyleSection.vue'

registerHighlightLanguages(hljs)

const defaultCode = `const createShot = (code) => ({
  code,
  theme: 'nebula',
  background: 'aurora',
  formats: ['png', 'svg', 'webp', 'html'],
})`

const code = useStorage<string>('tools:code-shot:code', defaultCode)
const language = useStorage<string>('tools:code-shot:language', 'auto')
const renderMode = useStorage<RenderMode>('tools:code-shot:renderMode', 'highlight')
const themeId = useStorage<string>('tools:code-shot:theme', 'nebula')
const backgroundType = useStorage<'preset' | 'solid' | 'transparent' | 'none'>(
  'tools:code-shot:backgroundType',
  'preset',
)
const backgroundPresetId = useStorage<string>('tools:code-shot:backgroundPreset', 'aurora')
const backgroundColor = useStorage<string>('tools:code-shot:backgroundColor', '#0f172a')
const windowStyle = useStorage<WindowStyle>('tools:code-shot:windowStyle', 'mac')
const showLineNumbers = useStorage<boolean>('tools:code-shot:lineNumbers', true)
const fontSize = useStorage<number>('tools:code-shot:fontSize', 16)
const lineHeight = useStorage<number>('tools:code-shot:lineHeight', 1.6)
const cardPadding = useStorage<number>('tools:code-shot:cardPadding', 24)
const framePadding = useStorage<number>('tools:code-shot:framePadding', 48)
const radius = useStorage<number>('tools:code-shot:radius', 18)
const shadow = useStorage<boolean>('tools:code-shot:shadow', true)
const tabSize = useStorage<number>('tools:code-shot:tabSize', 2)
const fileName = useStorage<string>('tools:code-shot:fileName', 'code-shot')
const storedFramePadding = useStorage<number>('tools:code-shot:framePadding:stored', 48)
const storedShadow = useStorage<boolean>('tools:code-shot:shadow:stored', true)

const debouncedCode = useDebounce(code, 180)

const normalizedCode = computed(() => normalizeCode(debouncedCode.value ?? ''))
const activeTheme = computed(() => getThemeById(themeId.value))

const backgroundConfig = computed<BackgroundConfig>(() => {
  if (backgroundType.value === 'transparent') {
    return { type: 'transparent' }
  }
  if (backgroundType.value === 'none') {
    return { type: 'none' }
  }
  if (backgroundType.value === 'solid') {
    return { type: 'solid', color: backgroundColor.value }
  }
  return {
    type: 'preset',
    preset: getBackgroundPreset(backgroundPresetId.value),
  }
})

const isBackgroundNone = computed(() => backgroundType.value === 'none')

const effectiveFramePadding = computed(() =>
  backgroundType.value === 'none' ? 0 : framePadding.value,
)
const effectiveShadow = computed(() => (backgroundType.value === 'none' ? false : shadow.value))

watch(
  [framePadding, shadow],
  ([nextPadding, nextShadow]) => {
    if (backgroundType.value !== 'none') {
      storedFramePadding.value = nextPadding
      storedShadow.value = nextShadow
    }
  },
  { immediate: true },
)

watch(
  backgroundType,
  (next, prev) => {
    if (next === 'none') {
      framePadding.value = 0
      shadow.value = false
      return
    }
    if (prev === 'none') {
      framePadding.value = storedFramePadding.value
      shadow.value = storedShadow.value
    }
  },
  { immediate: true },
)

const layoutConfig = computed(() => ({
  fontSize: fontSize.value,
  lineHeight: lineHeight.value,
  padding: cardPadding.value,
  framePadding: effectiveFramePadding.value,
  radius: radius.value,
  shadow: effectiveShadow.value,
  windowStyle: windowStyle.value,
  showLineNumbers: showLineNumbers.value,
  tabSize: tabSize.value,
  fontFamily: DEFAULT_MONO_FONT,
}))

const highlightedTokens = computed(() =>
  highlightToTokens(hljs, normalizedCode.value, language.value, renderMode.value),
)
const styledTokens = computed(() =>
  applyTokenStyles(highlightedTokens.value, activeTheme.value, tabSize.value),
)
const styledLines = computed(() => tokensToLines(styledTokens.value))
const lineNumbers = computed(() => buildLineNumbers(styledLines.value.length))

const svgOutput = computed(() =>
  buildCodeShotSvg(
    styledLines.value,
    layoutConfig.value,
    activeTheme.value,
    backgroundConfig.value,
  ),
)
const htmlSnippet = computed(() =>
  buildHtmlSnippet(
    styledLines.value,
    layoutConfig.value,
    activeTheme.value,
    backgroundConfig.value,
  ),
)
const htmlDocument = computed(() => buildHtmlDocument(htmlSnippet.value, backgroundConfig.value))

const jpgBackground = computed(() =>
  backgroundConfig.value.type === 'transparent' || backgroundConfig.value.type === 'none'
    ? activeTheme.value.background
    : '',
)
</script>
