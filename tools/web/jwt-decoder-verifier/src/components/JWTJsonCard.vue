<template>
  <ToolSection>
    <n-code :code="formatted" language="json" :hljs="hljs" />
  </ToolSection>
  <ToolSection>
    <CopyToClipboardButton :content="formatted" />
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NCode } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ToolSection } from '@shared/ui/tool'
import hljs from 'highlight.js/lib/core'
import jsonHighlight from 'highlight.js/lib/languages/json'

const props = defineProps<{
  json: object | null
}>()

hljs.registerLanguage('json', jsonHighlight)

const formatted = computed<string>(() => {
  try {
    if (props.json == null) return ''
    return JSON.stringify(props.json, null, 2)
  } catch {
    return ''
  }
})
</script>
