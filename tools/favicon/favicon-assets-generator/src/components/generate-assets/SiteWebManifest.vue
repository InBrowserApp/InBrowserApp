<template>
  <n-code language="json" :code="code" :hljs="hljs" />
  <!-- <div /> -->
</template>

<script setup lang="ts">
import { NCode } from 'naive-ui'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'
import { computed } from 'vue'
import { generateManifestText } from '../../utils/favicon-generator/general-info'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
const props = defineProps<{
  generalInfoOptions: GeneralInfoOptions
}>()

hljs.registerLanguage('json', json)

const code = computed(() => {
  return generateManifestText(props.generalInfoOptions)
})
</script>
