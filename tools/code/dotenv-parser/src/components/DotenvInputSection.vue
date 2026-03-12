<template>
  <ToolSectionHeader>{{ t('inputTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex justify="space-between" align="center" :wrap="false" class="input-toolbar">
      <n-text depth="3">{{ t('privacyNote') }}</n-text>
      <n-button text @click="$emit('load-sample')">{{ t('loadSample') }}</n-button>
    </n-flex>

    <TextOrFileInput
      v-model:value="value"
      accept=".env,.env.local,.env.development,.env.production,.env.test,.env.example,.txt,.conf"
      :placeholder="t('inputPlaceholder')"
      :status="status"
      class="monospace-input"
      :wrap-with-form-item="false"
    />
  </ToolSection>
</template>

<script setup lang="ts">
import { NButton, NFlex, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { TextOrFileInput } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { messages } from './locale/dotenv-parser-messages'

defineProps<{
  status?: 'success' | 'error'
}>()

defineEmits<{
  'load-sample': []
}>()

const value = defineModel<string | File>('value', { required: true })
const { t } = useI18n({ messages })
</script>

<style scoped>
.input-toolbar {
  margin-bottom: 12px;
}

.monospace-input :deep(textarea) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}
</style>
