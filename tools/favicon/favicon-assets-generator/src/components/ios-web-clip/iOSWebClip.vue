<template>
  <ToolSectionHeader>
    <n-icon :component="Apple" style="vertical-align: -0.15em" />
    <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
    <span>iOS Web Clip</span>
  </ToolSectionHeader>
  <n-grid x-gap="30" y-gap="20" :cols="5" item-responsive responsive="screen">
    <n-grid-item span="5 s:2">
      <IOSWebClipPreview :image="image" :options="options" :name="generalInfoOptions.short_name" />
    </n-grid-item>
    <n-grid-item span="5 s:3">
      <IOSWebClipSettings v-model:options="options" :image="image" />
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { NGrid, NGridItem, NIcon } from 'naive-ui'
import { toRef } from 'vue'
import IOSWebClipPreview from './iOSWebClipPreview.vue'
import IOSWebClipSettings from './iOSWebClipSettings.vue'
import type { iOSWebClipOptions } from '../../utils/favicon-generator/ios-web-clip'
import { useVModel } from '@vueuse/core'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'
import Apple from '@vicons/fa/Apple'
import { ToolSectionHeader } from '@shared/ui/tool'

const props = defineProps<{
  image: Blob | undefined
  options: iOSWebClipOptions
  generalInfoOptions: GeneralInfoOptions
}>()

const emit = defineEmits<{
  'update:options': [iOSWebClipOptions]
}>()

const options = useVModel(props, 'options', emit)

const image = toRef(props, 'image')
</script>
