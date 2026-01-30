<template>
  <n-tabs type="line" animated>
    <n-tab-pane name="settings" :tab="t('settings')" display-directive="show">
      <IOSWebClipSettingsDisplay v-model:options="options" />
    </n-tab-pane>
    <n-tab-pane name="dedicated-image" :tab="t('dedicatedImage')" display-directive="show">
      <IOSWebClipSettingsDedicatedImage v-model:options="options" />
    </n-tab-pane>
    <n-tab-pane name="download" :tab="t('downloadSeparately')" display-directive="show">
      <IOSWebClipSettingsDownload :options="options" :image="image" />
    </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
import { NTabs, NTabPane } from 'naive-ui'
import type { iOSWebClipOptions } from '../../utils/favicon-generator/ios-web-clip'
import { useVModel } from '@vueuse/core'
import IOSWebClipSettingsDisplay from './iOSWebClipSettingsDisplay.vue'
import IOSWebClipSettingsDedicatedImage from './iOSWebClipSettingsDedicatedImage.vue'
import IOSWebClipSettingsDownload from './iOSWebClipSettingsDownload.vue'
import { useI18n } from 'vue-i18n'
import { messages } from '../locale/settings-messages'

const props = defineProps<{
  image: Blob | undefined
  options: iOSWebClipOptions
}>()

const emit = defineEmits<{
  'update:options': [iOSWebClipOptions]
}>()

const { t } = useI18n({ messages })

const options = useVModel(props, 'options', emit)
</script>
