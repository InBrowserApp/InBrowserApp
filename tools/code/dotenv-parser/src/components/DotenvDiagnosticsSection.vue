<template>
  <ToolSectionHeader>{{ t('diagnosticsTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-space vertical :size="12">
      <n-alert v-if="diagnostics.length === 0" type="success" :bordered="false">
        {{ t('diagnosticsEmpty') }}
      </n-alert>
      <n-alert
        v-for="diagnostic in diagnostics"
        :key="`${diagnostic.line}-${diagnostic.code}`"
        :type="diagnostic.severity === 'error' ? 'error' : 'warning'"
      >
        <template #header>
          {{ diagnostic.severity === 'error' ? t('diagnosticsError') : t('diagnosticsWarning') }}
          {{ t('line') }} {{ diagnostic.line }}
        </template>
        {{ diagnostic.message }}
      </n-alert>
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { NAlert, NSpace } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { DotenvDiagnostic } from '@utils/dotenv'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { messages } from './locale/dotenv-parser-messages'

defineProps<{
  diagnostics: DotenvDiagnostic[]
}>()

const { t } = useI18n({ messages })
</script>
