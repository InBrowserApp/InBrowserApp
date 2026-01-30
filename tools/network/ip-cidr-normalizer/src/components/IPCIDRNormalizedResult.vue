<template>
  <CopyToClipboardTooltip :content="normalized" #="{ copy }">
    <n-text code style="font-size: 1.5em; cursor: pointer" @click="copy">{{ normalized }}</n-text>
  </CopyToClipboardTooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { normalizeCidr } from 'cidr-tools'
import { CopyToClipboardTooltip } from '@shared/ui/base'
import { NText } from 'naive-ui'

const props = defineProps<{
  ipcidr: string
}>()

const normalized = computed(() => {
  return normalizeCidr(props.ipcidr)
})
</script>
