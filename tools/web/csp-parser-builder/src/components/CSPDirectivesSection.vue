<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-space vertical :size="12">
      <n-flex align="center" :wrap="true" :size="8">
        <n-select
          v-model:value="selectedDirective"
          :options="directiveOptions"
          :placeholder="t('placeholder')"
          style="width: 260px"
        />
        <n-button :disabled="!selectedDirective" @click="addDirective">{{ t('add') }}</n-button>
      </n-flex>

      <n-text v-if="directives.length === 0" depth="3">
        {{ t('empty') }}
      </n-text>

      <n-space v-else vertical :size="12">
        <CSPDirectiveCard
          v-for="(directive, index) in directives"
          :key="`${directive.name}-${index}`"
          :directive="directive"
          :known="isKnownDirective(directive.name)"
          :flag="isFlagDirective(directive.name)"
          :quick-tokens="quickAddTokensByDirective[directive.name] ?? []"
          :removable="true"
          @update:directive="updateDirective(index, $event)"
          @remove="removeDirective(index)"
        />
      </n-space>
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NSelect, NSpace, NText } from 'naive-ui'
import {
  createDirective,
  isFlagDirective,
  isKnownDirective,
  knownDirectiveNames,
  quickAddTokensByDirective,
} from '@utils/csp'
import type { CSPDirective } from '@utils/csp'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import CSPDirectiveCard from './CSPDirectiveCard.vue'

const directives = defineModel<CSPDirective[]>('directives', { required: true })
const selectedDirective = ref<string | null>(null)
const { t } = useI18n()

const directiveOptions = computed(() =>
  knownDirectiveNames
    .filter(
      (directiveName) => !directives.value.some((directive) => directive.name === directiveName),
    )
    .map((directiveName) => ({ label: directiveName, value: directiveName })),
)

function addDirective(): void {
  if (!selectedDirective.value) return
  directives.value = [...directives.value, createDirective(selectedDirective.value)]
  selectedDirective.value = null
}

function updateDirective(index: number, directive: CSPDirective): void {
  directives.value = directives.value.map((item, itemIndex) =>
    itemIndex === index ? directive : item,
  )
}

function removeDirective(index: number): void {
  directives.value = directives.value.filter((_, itemIndex) => itemIndex !== index)
}
</script>

<i18n lang="json">
{
  "en": {
    "title": "Directive Builder",
    "placeholder": "Add a directive",
    "add": "Add",
    "empty": "No directives are available yet. Paste a policy or add one manually."
  },
  "zh": {
    "title": "指令构建器",
    "placeholder": "添加指令",
    "add": "添加",
    "empty": "当前还没有指令。请粘贴策略或手动添加。"
  },
  "zh-CN": {
    "title": "指令构建器",
    "placeholder": "添加指令",
    "add": "添加",
    "empty": "当前还没有指令。请粘贴策略或手动添加。"
  },
  "zh-TW": {
    "title": "指令建構器",
    "placeholder": "新增指令",
    "add": "新增",
    "empty": "目前還沒有指令。請貼上策略或手動新增。"
  },
  "zh-HK": {
    "title": "指令建構器",
    "placeholder": "新增指令",
    "add": "新增",
    "empty": "目前還沒有指令。請貼上策略或手動新增。"
  },
  "es": {
    "title": "Directive Builder",
    "placeholder": "Add a directive",
    "add": "Add",
    "empty": "No directives are available yet. Paste a policy or add one manually."
  },
  "fr": {
    "title": "Directive Builder",
    "placeholder": "Add a directive",
    "add": "Add",
    "empty": "No directives are available yet. Paste a policy or add one manually."
  },
  "de": {
    "title": "Directive Builder",
    "placeholder": "Add a directive",
    "add": "Add",
    "empty": "No directives are available yet. Paste a policy or add one manually."
  },
  "it": {
    "title": "Directive Builder",
    "placeholder": "Add a directive",
    "add": "Add",
    "empty": "No directives are available yet. Paste a policy or add one manually."
  },
  "ja": {
    "title": "Directive Builder",
    "placeholder": "Add a directive",
    "add": "Add",
    "empty": "No directives are available yet. Paste a policy or add one manually."
  },
  "ko": {
    "title": "Directive Builder",
    "placeholder": "Add a directive",
    "add": "Add",
    "empty": "No directives are available yet. Paste a policy or add one manually."
  },
  "ru": {
    "title": "Directive Builder",
    "placeholder": "Add a directive",
    "add": "Add",
    "empty": "No directives are available yet. Paste a policy or add one manually."
  },
  "pt": {
    "title": "Directive Builder",
    "placeholder": "Add a directive",
    "add": "Add",
    "empty": "No directives are available yet. Paste a policy or add one manually."
  },
  "ar": {
    "title": "Directive Builder",
    "placeholder": "Add a directive",
    "add": "Add",
    "empty": "No directives are available yet. Paste a policy or add one manually."
  },
  "hi": {
    "title": "Directive Builder",
    "placeholder": "Add a directive",
    "add": "Add",
    "empty": "No directives are available yet. Paste a policy or add one manually."
  },
  "tr": {
    "title": "Directive Builder",
    "placeholder": "Add a directive",
    "add": "Add",
    "empty": "No directives are available yet. Paste a policy or add one manually."
  },
  "nl": {
    "title": "Directive Builder",
    "placeholder": "Add a directive",
    "add": "Add",
    "empty": "No directives are available yet. Paste a policy or add one manually."
  },
  "sv": {
    "title": "Directive Builder",
    "placeholder": "Add a directive",
    "add": "Add",
    "empty": "No directives are available yet. Paste a policy or add one manually."
  },
  "pl": {
    "title": "Directive Builder",
    "placeholder": "Add a directive",
    "add": "Add",
    "empty": "No directives are available yet. Paste a policy or add one manually."
  },
  "vi": {
    "title": "Directive Builder",
    "placeholder": "Add a directive",
    "add": "Add",
    "empty": "No directives are available yet. Paste a policy or add one manually."
  },
  "th": {
    "title": "Directive Builder",
    "placeholder": "Add a directive",
    "add": "Add",
    "empty": "No directives are available yet. Paste a policy or add one manually."
  },
  "id": {
    "title": "Directive Builder",
    "placeholder": "Add a directive",
    "add": "Add",
    "empty": "No directives are available yet. Paste a policy or add one manually."
  },
  "he": {
    "title": "Directive Builder",
    "placeholder": "Add a directive",
    "add": "Add",
    "empty": "No directives are available yet. Paste a policy or add one manually."
  },
  "ms": {
    "title": "Directive Builder",
    "placeholder": "Add a directive",
    "add": "Add",
    "empty": "No directives are available yet. Paste a policy or add one manually."
  },
  "no": {
    "title": "Directive Builder",
    "placeholder": "Add a directive",
    "add": "Add",
    "empty": "No directives are available yet. Paste a policy or add one manually."
  }
}
</i18n>
