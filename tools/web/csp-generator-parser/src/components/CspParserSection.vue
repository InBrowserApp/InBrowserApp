<template>
  <ToolSectionHeader>{{ labels.parserTitle }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1" :y-gap="12">
      <n-form-item-gi :show-feedback="false" label-style="width: 100%">
        <template #label>
          <div class="field-label">
            <span>{{ labels.parserLabel }}</span>
            <span class="field-action">
              <n-button
                secondary
                size="small"
                :disabled="!canApplyParsed"
                @click="emit('apply-parsed')"
              >
                {{ labels.applyParsed }}
              </n-button>
            </span>
          </div>
        </template>
        <n-input
          :value="input"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 10 }"
          :placeholder="labels.parserPlaceholder"
          :status="inputStatus"
          @update:value="emit('update:input', $event)"
        />
        <template #feedback>
          <n-text v-show="inputError" type="error">{{ labels.parserError }}</n-text>
        </template>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>

  <ToolSectionHeader>{{ labels.parsedTitle }}</ToolSectionHeader>
  <ToolSection>
    <ParsedDirectivesList
      :directives="directives"
      :empty-label="labels.parsedEmpty"
      :no-values-label="labels.noValues"
    />
  </ToolSection>
</template>

<script setup lang="ts">
import type { FormValidationStatus } from 'naive-ui'
import { NButton, NFormItemGi, NGrid, NInput, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ParsedDirectivesList from './ParsedDirectivesList.vue'
import type { CspDirective } from '../utils/csp'

defineProps<{
  input: string
  inputStatus?: FormValidationStatus
  inputError: boolean
  directives: CspDirective[]
  labels: {
    parserTitle: string
    parserLabel: string
    parserPlaceholder: string
    parserError: string
    parsedTitle: string
    parsedEmpty: string
    noValues: string
    applyParsed: string
  }
  canApplyParsed: boolean
}>()

const emit = defineEmits<{
  'update:input': [string]
  'apply-parsed': []
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
