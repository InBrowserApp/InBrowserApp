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
import IOSWebClipSettingsDisplay from './iOSWebClipSettingsDisplay.vue'
import IOSWebClipSettingsDedicatedImage from './iOSWebClipSettingsDedicatedImage.vue'
import IOSWebClipSettingsDownload from './iOSWebClipSettingsDownload.vue'
import { useI18n } from 'vue-i18n'
import { messages } from '../locale/settings-messages'

defineProps<{
  image: Blob | undefined
}>()

const { t } = useI18n({ messages })

const options = defineModel<iOSWebClipOptions>('options', { required: true })
</script>
