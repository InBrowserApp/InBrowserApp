<template>
  <ToolSectionHeader>{{ t('optionsTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 s:3" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('parserMode')" :show-feedback="false">
        <n-select v-model:value="mode" :options="modeOptions" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('duplicateStrategy')" :show-feedback="false">
        <n-select v-model:value="duplicateStrategy" :options="duplicateOptions" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('valueVisibility')" :show-feedback="false">
        <n-flex align="center" :size="12">
          <n-switch v-model:value="maskValues" />
          <span>{{ maskValues ? t('maskedValues') : t('visibleValues') }}</span>
        </n-flex>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFlex, NFormItemGi, NGrid, NSelect, NSwitch } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { DotenvDuplicateStrategy, DotenvParserMode } from '@utils/dotenv'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { messages } from './locale/dotenv-parser-messages'

const mode = defineModel<DotenvParserMode>('mode', { required: true })
const duplicateStrategy = defineModel<DotenvDuplicateStrategy>('duplicateStrategy', {
  required: true,
})
const maskValues = defineModel<boolean>('maskValues', { required: true })

const { t } = useI18n({ messages })

const modeOptions = computed(() => [
  { label: t('compatibleMode'), value: 'compatible' },
  { label: t('strictMode'), value: 'strict' },
])

const duplicateOptions = computed(() => [
  { label: t('lastWins'), value: 'last-wins' },
  { label: t('firstWins'), value: 'first-wins' },
])
</script>
