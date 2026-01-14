<template>
  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :show-feedback="false" label-style="width: 100%">
        <template #label>
          <div class="field-label">
            <span>{{ labels.inputLabel }}</span>
            <span class="field-action">
              <n-button text :disabled="!canUseCurrent" @click="emit('use-current')">
                <template #icon>
                  <n-icon :component="GlobePerson20Regular" />
                </template>
                {{ labels.useCurrent }}
              </n-button>
            </span>
          </div>
        </template>
        <n-input
          :value="userAgent"
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 14 }"
          :placeholder="labels.inputPlaceholder"
          :status="inputStatus"
          @update:value="emit('update:userAgent', $event)"
        />
        <template v-if="inputError" #feedback>
          <n-text type="error">{{ labels.inputError }}</n-text>
        </template>
      </n-form-item-gi>

      <n-form-item-gi :show-feedback="false" label-style="width: 100%">
        <template #label>
          <div class="field-label">
            <span>{{ labels.jsonOutput }}</span>
            <span class="field-action">
              <CopyToClipboardButton v-if="hasOutput" :content="renderedJson" />
            </span>
          </div>
        </template>
        <n-card v-if="hasOutput" size="small">
          <n-code :code="renderedJson" language="json" :hljs="hljs" word-wrap />
        </n-card>
        <n-empty v-else :description="labels.emptyState" />
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import type { FormValidationStatus } from 'naive-ui'
import { NButton, NCard, NCode, NEmpty, NFormItemGi, NGrid, NIcon, NInput, NText } from 'naive-ui'
import { ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import { GlobePerson20Regular } from '@shared/icons/fluent'
import hljs from 'highlight.js/lib/core'
import jsonLang from 'highlight.js/lib/languages/json'

hljs.registerLanguage('json', jsonLang)

defineProps<{
  userAgent: string
  inputStatus?: FormValidationStatus
  inputError: boolean
  canUseCurrent: boolean
  hasOutput: boolean
  renderedJson: string
  labels: {
    inputLabel: string
    useCurrent: string
    inputPlaceholder: string
    inputError: string
    jsonOutput: string
    emptyState: string
  }
}>()

const emit = defineEmits<{
  'update:userAgent': [string]
  'use-current': []
}>()
</script>

<style scoped>
.field-label {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  width: 100%;
}

.field-action {
  align-items: center;
  display: inline-flex;
  flex-shrink: 0;
}
</style>
