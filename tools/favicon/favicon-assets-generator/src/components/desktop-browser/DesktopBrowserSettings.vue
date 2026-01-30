<template>
  <n-tabs type="line" animated>
    <n-tab-pane name="settings" :tab="t('settings')" display-directive="show">
      <DesktopBrowserSettingsDisplay v-model:options="options" />
    </n-tab-pane>
    <n-tab-pane name="dedicated-image" :tab="t('dedicatedImage')" display-directive="show">
      <DesktopBrowserSettingsDedicatedImage v-model:options="options" />
    </n-tab-pane>
    <n-tab-pane name="download" :tab="t('downloadSeparately')" display-directive="show">
      <DesktopBrowserSettingsDownload :options="options" :image="image" />
    </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
import { NTabs, NTabPane } from 'naive-ui'
import type { DesktopBrowserOptions } from '../../utils/favicon-generator/desktop-browser'
import { useI18n } from 'vue-i18n'
import DesktopBrowserSettingsDisplay from './DesktopBrowserSettingsDisplay.vue'
import DesktopBrowserSettingsDownload from './DesktopBrowserSettingsDownload.vue'
import DesktopBrowserSettingsDedicatedImage from './DesktopBrowserSettingsDedicatedImage.vue'
import { messages } from '../locale/settings-messages'

defineProps<{
  image: Blob | undefined
}>()

const { t } = useI18n({ messages })

const options = defineModel<DesktopBrowserOptions>('options', { required: true })
</script>
