<template>
  <ToolSectionHeader>{{ t('summaryTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="2 s:4" responsive="screen" :x-gap="12" :y-gap="12">
      <n-gi>
        <n-card size="small">
          <n-statistic :label="t('summaryEntries')" :value="stats.entryCount" />
        </n-card>
      </n-gi>
      <n-gi>
        <n-card size="small">
          <n-statistic :label="t('summaryResolved')" :value="stats.resolvedCount" />
        </n-card>
      </n-gi>
      <n-gi>
        <n-card size="small">
          <n-statistic :label="t('summaryDuplicates')" :value="stats.duplicateCount" />
        </n-card>
      </n-gi>
      <n-gi>
        <n-card size="small">
          <n-statistic :label="t('summaryInvalid')" :value="stats.invalidLineCount" />
        </n-card>
      </n-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { NCard, NGi, NGrid, NStatistic } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { DotenvStats } from '@utils/dotenv'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { messages } from './locale/dotenv-parser-messages'

defineProps<{
  stats: DotenvStats
}>()

const { t } = useI18n({ messages })
</script>
