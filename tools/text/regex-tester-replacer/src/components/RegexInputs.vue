<template>
  <ToolSectionHeader>{{ t('input-title') }}</ToolSectionHeader>
  <ToolSection>
    <TextOrFileInput
      v-model:value="textOrFile"
      accept="text/*,.txt,.log,.md,.json,.csv,.yaml,.yml"
      :placeholder="t('input-placeholder')"
      :wrap-with-form-item="false"
    />
  </ToolSection>

  <ToolSectionHeader>{{ t('pattern-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 s:2" :x-gap="12" :y-gap="12">
      <n-gi>
        <n-form-item
          :label="t('pattern-label')"
          :validation-status="patternStatus"
          :feedback="patternError"
          :show-feedback="!!patternError"
        >
          <n-input v-model:value="pattern" :placeholder="t('pattern-placeholder')" />
        </n-form-item>
      </n-gi>
      <n-gi>
        <n-form-item :label="t('flags-label')">
          <n-checkbox-group v-model:value="selectedFlags" class="flags-group">
            <n-checkbox v-for="flag in flagOptions" :key="flag" :value="flag">
              {{ flag }}
            </n-checkbox>
          </n-checkbox-group>
        </n-form-item>
      </n-gi>
      <n-gi :span="2">
        <n-form-item :label="t('replace-title')">
          <n-input v-model:value="replacement" :placeholder="t('replace-placeholder')" />
        </n-form-item>
      </n-gi>
      <n-gi :span="2">
        <n-form-item :label="t('options-title')" :show-feedback="false">
          <n-flex align="center" :size="12" wrap>
            <n-switch v-model:value="autoRun">{{ t('auto-run') }}</n-switch>
            <n-button @click="handleRun" :disabled="autoRun">
              {{ t('run') }}
            </n-button>
          </n-flex>
        </n-form-item>
      </n-gi>
    </n-grid>
    <n-flex vertical :size="6">
      <n-text depth="3" class="flags-hint">{{ t('flags-hint') }}</n-text>
      <n-text depth="3" class="hint">{{ t('auto-run-hint') }}</n-text>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import {
  NButton,
  NCheckbox,
  NCheckboxGroup,
  NFlex,
  NFormItem,
  NGi,
  NGrid,
  NInput,
  NSwitch,
  NText,
} from 'naive-ui'
import { TextOrFileInput } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import { messages } from './locale/regex-tester-replacer-messages'

const { t } = useI18n({ messages })

const { patternStatus, patternError, flagOptions } = defineProps<{
  patternStatus?: 'success' | 'error'
  patternError: string
  flagOptions: string[]
}>()

const emit = defineEmits<{ (event: 'run'): void }>()

const textOrFile = defineModel<string | File>('textOrFile', { required: true })
const pattern = defineModel<string>('pattern', { required: true })
const selectedFlags = defineModel<string[]>('selectedFlags', { required: true })
const replacement = defineModel<string>('replacement', { required: true })
const autoRun = defineModel<boolean>('autoRun', { required: true })

const handleRun = () => emit('run')
</script>

<style scoped>
.flags-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.flags-hint {
  display: block;
  margin-top: 8px;
}

.hint {
  display: block;
  margin-top: 8px;
}
</style>
