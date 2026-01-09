<template>
  <div>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <ToolSection>
      <NText>{{ t('description') }}</NText>
      <NUl>
        <NLi>
          <NText strong>{{ t('basicColorsTitle') }}</NText>
          {{ t('basicColorsDesc') }}
        </NLi>
        <NLi>
          <NText strong>{{ t('extendedColorsTitle') }}</NText>
          {{ t('extendedColorsDesc') }}
        </NLi>
        <NLi>
          <NText strong>{{ t('usageTitle') }}</NText>
          {{ t('usageDesc') }}
        </NLi>
      </NUl>
    </ToolSection>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NText, NUl, NLi } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What are HTML Color Names?",
    "description": "HTML color names are predefined color keywords that can be used in CSS and HTML to specify colors without using hexadecimal or RGB values. These names are supported by all modern browsers.",
    "basicColorsTitle": "Basic Colors:",
    "basicColorsDesc": "The original 16 HTML colors (black, white, red, green, blue, etc.) have been supported since the earliest versions of HTML.",
    "extendedColorsTitle": "Extended Colors:",
    "extendedColorsDesc": "CSS3 introduced 140+ named colors, including variations like \"aliceblue\", \"coral\", \"darkslategray\", and many more.",
    "usageTitle": "Usage:",
    "usageDesc": "Simply use the color name in your CSS, e.g., \"color: tomato;\" or \"background-color: steelblue;\"."
  },
  "zh": {
    "title": "什么是 HTML 颜色名称？",
    "description": "HTML 颜色名称是预定义的颜色关键字，可以在 CSS 和 HTML 中使用来指定颜色，而无需使用十六进制或 RGB 值。所有现代浏览器都支持这些名称。",
    "basicColorsTitle": "基本颜色：",
    "basicColorsDesc": "最初的 16 种 HTML 颜色（黑色、白色、红色、绿色、蓝色等）自 HTML 最早版本起就已被支持。",
    "extendedColorsTitle": "扩展颜色：",
    "extendedColorsDesc": "CSS3 引入了 140 多种命名颜色，包括 \"aliceblue\"、\"coral\"、\"darkslategray\" 等多种变体。",
    "usageTitle": "用法：",
    "usageDesc": "只需在 CSS 中使用颜色名称，例如 \"color: tomato;\" 或 \"background-color: steelblue;\"。"
  }
}
</i18n>
