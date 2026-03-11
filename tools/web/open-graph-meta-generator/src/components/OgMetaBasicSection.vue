<template>
  <ToolSectionHeader>{{ t('basicTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('pageTitleLabel')" :show-feedback="false" :span="2">
        <n-input
          v-model:value="basic.title"
          :placeholder="t('pageTitlePlaceholder')"
          data-testid="basic-title"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('descriptionLabel')" :show-feedback="false" :span="2">
        <n-input
          v-model:value="basic.description"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 8 }"
          :placeholder="t('descriptionPlaceholder')"
          data-testid="basic-description"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('canonicalUrlLabel')" :show-feedback="false" :span="2">
        <n-input
          v-model:value="basic.canonicalUrl"
          :placeholder="t('urlPlaceholder')"
          data-testid="basic-canonical-url"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('siteNameLabel')" :show-feedback="false">
        <n-input
          v-model:value="basic.siteName"
          :placeholder="t('siteNamePlaceholder')"
          data-testid="basic-site-name"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('localeLabel')" :show-feedback="false">
        <n-input
          v-model:value="basic.locale"
          :placeholder="t('localePlaceholder')"
          data-testid="basic-locale"
        />
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { NFormItemGi, NGrid, NInput } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import type { BasicMeta } from '../state'
import { messages } from '../locale/messages'

const { t } = useI18n({ useScope: 'local', messages })
const basic = defineModel<BasicMeta>('basic', { required: true })
</script>
