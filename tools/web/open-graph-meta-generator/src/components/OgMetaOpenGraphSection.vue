<template>
  <ToolSectionHeader>{{ t('openGraphTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('ogTypeLabel')" :show-feedback="false">
        <n-select v-model:value="openGraph.type" :options="ogTypeOptions" data-testid="og-type" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('ogUrlLabel')" :show-feedback="false">
        <n-input
          v-model:value="openGraph.url"
          :placeholder="t('urlPlaceholder')"
          data-testid="og-url"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('ogImageLabel')" :show-feedback="false" :span="2">
        <n-input
          v-model:value="openGraph.image.url"
          :placeholder="t('urlPlaceholder')"
          data-testid="og-image-url"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('ogImageAltLabel')" :show-feedback="false" :span="2">
        <n-input
          v-model:value="openGraph.image.alt"
          :placeholder="t('ogImageAltLabel')"
          data-testid="og-image-alt"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('imageWidthLabel')" :show-feedback="false">
        <n-input v-model:value="openGraph.image.width" data-testid="og-image-width" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('imageHeightLabel')" :show-feedback="false">
        <n-input v-model:value="openGraph.image.height" data-testid="og-image-height" />
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { NFormItemGi, NGrid, NInput, NSelect } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import { ogTypeOptions, type OpenGraphMeta } from '../state'
import { messages } from '../locale/messages'

const { t } = useI18n({ useScope: 'local', messages })
const openGraph = defineModel<OpenGraphMeta>('openGraph', { required: true })
</script>
