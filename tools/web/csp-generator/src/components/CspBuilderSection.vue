<template>
  <ToolSectionHeader>{{ labels.builderTitle }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1" :y-gap="12">
      <n-card v-for="directive in directives" :key="directive.id" size="small">
        <n-grid cols="1 s:2" :x-gap="12" :y-gap="12">
          <n-form-item-gi :label="labels.directiveName" :show-feedback="false">
            <n-input
              :value="directive.name"
              :placeholder="labels.namePlaceholder"
              @update:value="emit('update-name', directive.id, $event)"
            />
          </n-form-item-gi>
          <n-form-item-gi :label="labels.directiveValues" :show-feedback="false">
            <n-input
              :value="directive.valuesText"
              :placeholder="labels.valuesPlaceholder"
              @update:value="emit('update-values', directive.id, $event)"
            />
          </n-form-item-gi>
        </n-grid>
        <div class="row-actions">
          <n-button text type="error" @click="emit('remove', directive.id)">
            {{ labels.removeDirective }}
          </n-button>
        </div>
      </n-card>
    </n-grid>
    <n-button secondary @click="emit('add')">{{ labels.addDirective }}</n-button>
  </ToolSection>

  <ToolSectionHeader>{{ labels.outputTitle }}</ToolSectionHeader>
  <ToolSection>
    <div class="field-label">
      <span>{{ labels.outputLabel }}</span>
      <span class="field-action">
        <CopyToClipboardButton v-if="hasOutput" :content="generatedPolicy" />
      </span>
    </div>
    <n-input v-if="hasOutput" :value="generatedPolicy" type="textarea" readonly />
    <n-empty v-else :description="labels.outputEmpty" />
  </ToolSection>
</template>

<script setup lang="ts">
import { NButton, NCard, NEmpty, NFormItemGi, NGrid, NInput } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

export type BuilderDirective = {
  id: string
  name: string
  valuesText: string
}

defineProps<{
  directives: BuilderDirective[]
  generatedPolicy: string
  hasOutput: boolean
  labels: {
    builderTitle: string
    directiveName: string
    directiveValues: string
    namePlaceholder: string
    valuesPlaceholder: string
    addDirective: string
    removeDirective: string
    outputTitle: string
    outputLabel: string
    outputEmpty: string
  }
}>()

const emit = defineEmits<{
  add: []
  remove: [string]
  'update-name': [string, string]
  'update-values': [string, string]
}>()
</script>

<style scoped>
.row-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.field-label {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  margin-bottom: 8px;
}

.field-action {
  align-items: center;
  display: inline-flex;
  flex-shrink: 0;
}
</style>
