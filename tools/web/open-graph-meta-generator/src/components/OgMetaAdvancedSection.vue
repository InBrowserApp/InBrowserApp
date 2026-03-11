<template>
  <ToolSectionHeader>{{ t('advancedTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-button quaternary data-testid="toggle-advanced" @click="showAdvanced = !showAdvanced">
        {{ showAdvanced ? t('hideAdvanced') : t('showAdvanced') }}
      </n-button>
      <n-text depth="3">{{ t('advancedHint') }}</n-text>

      <n-grid v-if="showAdvanced" cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
        <n-form-item-gi :label="t('publishedTimeLabel')" :show-feedback="false">
          <n-input
            v-model:value="article.publishedTime"
            placeholder="2026-03-11T09:00:00Z"
            data-testid="article-published-time"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="t('modifiedTimeLabel')" :show-feedback="false">
          <n-input
            v-model:value="article.modifiedTime"
            placeholder="2026-03-11T10:30:00Z"
            data-testid="article-modified-time"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="t('authorLabel')" :show-feedback="false">
          <n-input v-model:value="article.author" data-testid="article-author" />
        </n-form-item-gi>
        <n-form-item-gi :label="t('sectionLabel')" :show-feedback="false">
          <n-input v-model:value="article.section" data-testid="article-section" />
        </n-form-item-gi>
        <n-form-item-gi :label="t('tagsLabel')" :show-feedback="false" :span="2">
          <n-input
            v-model:value="article.tags"
            :placeholder="t('tagsPlaceholder')"
            data-testid="article-tags"
          />
        </n-form-item-gi>
      </n-grid>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NButton, NFlex, NFormItemGi, NGrid, NInput, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import type { ArticleMeta } from '../state'
import { messages } from '../locale/messages'

const { t } = useI18n({ useScope: 'local', messages })
const article = defineModel<ArticleMeta>('article', { required: true })
const showAdvanced = defineModel<boolean>('showAdvanced', { required: true })
</script>
