<template>
  <n-tabs type="line" animated>
    <n-tab-pane name="settings" :tab="t('settings')" display-directive="show">
      <PWASettingsDisplay v-model:options="options" />
    </n-tab-pane>
    <n-tab-pane name="dedicated-image" :tab="t('dedicatedImage')" display-directive="show">
      <PWASettingsDedicatedImage v-model:options="options" />
    </n-tab-pane>
    <n-tab-pane name="download" :tab="t('downloadSeparately')" display-directive="show">
      <PWASettingsDownload :options="options" :image="image" />
    </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
import { NTabs, NTabPane } from 'naive-ui'
import type { PWAOptions } from '../../../utils/favicon-generator/pwa'
import PWASettingsDisplay from './PWASettingsDisplay.vue'
import PWASettingsDedicatedImage from './PWASettingsDedicatedImage.vue'
import PWASettingsDownload from './PWASettingsDownload.vue'
import { useI18n } from 'vue-i18n'
import { messages } from '../../locale/settings-messages'

defineProps<{
  image: Blob | undefined
}>()

const { t } = useI18n({ messages })

const options = defineModel<PWAOptions>('options', { required: true })
</script>
