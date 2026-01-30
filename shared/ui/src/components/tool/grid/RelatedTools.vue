<template>
  <ToolSectionHeader v-if="!noRelatedTools">{{ t('related-tools') }}</ToolSectionHeader>
  <ToolSection>
    <ToolsGrid v-if="!noRelatedTools" :tools="relatedTools" />
  </ToolSection>
</template>

<script setup lang="ts">
import { ToolSectionHeader, ToolSection } from '../layouts'
import ToolsGrid from './ToolsGrid.vue'
import type { ToolInfo } from '@shared/tools'
import { useI18n } from 'vue-i18n'
import { computedAsync } from '@vueuse/core'
import { computed } from 'vue'

const props = defineProps<{
  tool: Pick<ToolInfo, 'toolID' | 'tags'>
}>()

const relatedTools = computedAsync(async () => {
  const allTools = (await import('@registry/tools')).tools
  return allTools.filter(
    (tool) =>
      tool.toolID !== props.tool.toolID && tool.tags.some((tag) => props.tool.tags.includes(tag)),
  )
})

const noRelatedTools = computed(() => relatedTools.value && relatedTools.value.length === 0)

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "related-tools": "Related Tools"
  },
  "zh": {
    "related-tools": "相关工具"
  },
  "zh-CN": {
    "related-tools": "相关工具"
  },
  "zh-TW": {
    "related-tools": "相关工具"
  },
  "zh-HK": {
    "related-tools": "相关工具"
  },
  "es": {
    "related-tools": "Herramientas relacionadas"
  },
  "fr": {
    "related-tools": "Outils connexes"
  },
  "de": {
    "related-tools": "Verwandte Werkzeuge"
  },
  "it": {
    "related-tools": "Strumenti correlati"
  },
  "ja": {
    "related-tools": "関連ツール"
  },
  "ko": {
    "related-tools": "관련 도구"
  },
  "ru": {
    "related-tools": "Связанные инструменты"
  },
  "pt": {
    "related-tools": "Ferramentas relacionadas"
  },
  "ar": {
    "related-tools": "الأدوات ذات الصلة"
  },
  "hi": {
    "related-tools": "संबंधित उपकरण"
  },
  "tr": {
    "related-tools": "İlgili Araçlar"
  },
  "nl": {
    "related-tools": "Gerelateerde hulpmiddelen"
  },
  "sv": {
    "related-tools": "Relaterade verktyg"
  },
  "pl": {
    "related-tools": "Powiązane narzędzia"
  },
  "vi": {
    "related-tools": "Công cụ liên quan"
  },
  "th": {
    "related-tools": "เครื่องมือที่เกี่ยวข้อง"
  },
  "id": {
    "related-tools": "Alat terkait"
  },
  "he": {
    "related-tools": "כלים קשורים"
  },
  "ms": {
    "related-tools": "Alat Berkaitan"
  },
  "no": {
    "related-tools": "Relaterte verktøy"
  }
}
</i18n>
