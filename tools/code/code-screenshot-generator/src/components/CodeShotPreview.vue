<template>
  <div class="code-shot-preview" :style="canvasStyle">
    <div class="code-shot-card" :style="cardStyle">
      <div v-if="layout.windowStyle !== 'none'" class="code-shot-header" :style="headerStyle">
        <div v-if="layout.windowStyle === 'mac'" class="window-controls mac">
          <span class="control control--red"></span>
          <span class="control control--yellow"></span>
          <span class="control control--green"></span>
        </div>
        <div v-else class="window-controls windows">
          <span class="control control--light"></span>
          <span class="control control--light"></span>
          <span class="control control--danger"></span>
        </div>
      </div>
      <div class="code-shot-body" :style="bodyStyle">
        <div v-if="layout.showLineNumbers" class="line-numbers" :style="lineNumberStyle">
          <div v-for="line in lineNumbers" :key="line" class="line-number" :style="lineRowStyle">
            {{ line }}
          </div>
        </div>
        <div class="code-lines" :style="codeStyle">
          <div
            v-for="(line, lineIndex) in lines"
            :key="lineIndex"
            class="code-line"
            :style="lineRowStyle"
          >
            <template v-if="line.length">
              <span
                v-for="(token, tokenIndex) in line"
                :key="tokenIndex"
                class="code-token"
                :style="tokenStyle(token)"
              >
                {{ token.text }}
              </span>
            </template>
            <template v-else> </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import type { BackgroundConfig, CodeShotLayout, StyledToken } from '../utils/render'
import type { Theme } from '../utils/themes'
import { getBackgroundPreviewCss, getBackgroundPreviewSize } from '../utils/render'

const props = defineProps<{
  lines: StyledToken[][]
  lineNumbers: string[]
  layout: CodeShotLayout
  theme: Theme
  background: BackgroundConfig
}>()

const backgroundCss = computed(() => getBackgroundPreviewCss(props.background))
const backgroundSize = computed(() => getBackgroundPreviewSize(props.background))

const canvasStyle = computed<CSSProperties>(() => ({
  padding: `${props.layout.framePadding}px`,
  background: backgroundCss.value,
  backgroundSize: backgroundSize.value,
  borderRadius: `${props.layout.radius + 12}px`,
}))

const cardStyle = computed<CSSProperties>(() => ({
  background: props.theme.background,
  borderRadius: `${props.layout.radius}px`,
  border: `1px solid ${props.theme.border}`,
  boxShadow: props.layout.shadow ? '0 18px 45px rgba(15, 23, 42, 0.35)' : 'none',
  overflow: 'hidden',
}))

const headerStyle = computed<CSSProperties>(() => ({
  background: props.theme.header,
  height: `${Math.max(props.layout.fontSize * 1.8, 34)}px`,
  display: 'flex',
  alignItems: 'center',
  padding: `0 ${props.layout.padding}px`,
}))

const bodyStyle = computed<CSSProperties>(() => ({
  display: 'flex',
  gap: '16px',
  padding: `${props.layout.padding}px`,
  fontFamily: props.layout.fontFamily,
  fontSize: `${props.layout.fontSize}px`,
  lineHeight: `${props.layout.lineHeight}`,
}))

const lineNumberStyle = computed<CSSProperties>(() => ({
  color: props.theme.lineNumber,
  textAlign: 'right',
  userSelect: 'none',
  fontFamily: props.layout.fontFamily,
  fontSize: `${props.layout.fontSize}px`,
  lineHeight: `${props.layout.lineHeight}`,
}))

const codeStyle = computed<CSSProperties>(() => ({
  color: props.theme.foreground,
  fontFamily: props.layout.fontFamily,
  fontSize: `${props.layout.fontSize}px`,
  lineHeight: `${props.layout.lineHeight}`,
  whiteSpace: 'pre',
  tabSize: `${props.layout.tabSize}`,
}))

const lineRowStyle = computed<CSSProperties>(() => ({
  lineHeight: `${props.layout.lineHeight}`,
  minHeight: `${props.layout.lineHeight}em`,
}))

const tokenStyle = (token: StyledToken) => ({
  color: token.color,
  fontStyle: token.fontStyle,
  fontWeight: token.fontWeight,
})
</script>

<style scoped>
.code-shot-preview {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  min-height: 280px;
  border-radius: 18px;
  background-repeat: repeat;
}

.code-shot-preview::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.18), transparent 55%),
    radial-gradient(circle at 80% 0%, rgba(255, 255, 255, 0.1), transparent 45%);
  pointer-events: none;
  opacity: 0.6;
}

.code-shot-card {
  position: relative;
  z-index: 1;
  animation: shot-reveal 0.6s ease;
}

.code-shot-header {
  display: flex;
  align-items: center;
}

.window-controls {
  display: flex;
  gap: 10px;
}

.window-controls.windows {
  margin-left: auto;
}

.control {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  display: inline-block;
}

.windows .control {
  border-radius: 3px;
  width: 10px;
  height: 10px;
}

.control--red {
  background: #ff5f57;
}

.control--yellow {
  background: #febc2e;
}

.control--green {
  background: #28c840;
}

.control--light {
  background: #9ca3af;
}

.control--danger {
  background: #f87171;
}

.code-shot-body {
  align-items: flex-start;
}

.line-numbers {
  text-align: right;
  display: flex;
  flex-direction: column;
}

.line-number {
  padding-right: 2px;
}

.code-lines {
  white-space: pre;
  display: flex;
  flex-direction: column;
}

.code-line {
}

.code-token {
  white-space: pre;
}

@keyframes shot-reveal {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .code-shot-card {
    animation: none;
  }
}
</style>
