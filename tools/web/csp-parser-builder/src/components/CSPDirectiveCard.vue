<template>
  <n-card size="small" :data-testid="`directive-card-${directive.name || 'custom'}`">
    <template #header>
      <n-flex align="center" justify="space-between" :wrap="true" :size="12">
        <n-input
          v-if="!known"
          v-model:value="draftName"
          :placeholder="t('custom-directive')"
          style="max-width: 240px"
          @update:value="emitDirective"
        />
        <n-text v-else code>{{ directive.name }}</n-text>

        <n-button
          v-if="removable"
          quaternary
          type="error"
          data-testid="remove-directive"
          @click="$emit('remove')"
        >
          {{ t('remove') }}
        </n-button>
      </n-flex>
    </template>

    <n-space vertical :size="12">
      <n-text v-if="flag" depth="3">{{ t('enabled-no-values') }}</n-text>

      <template v-else>
        <n-dynamic-input
          v-model:value="draftTokens"
          :on-create="createToken"
          @update:value="emitDirective"
        >
          <template #create-button-default>{{ t('add-token') }}</template>
          <template #default="{ index }">
            <n-input
              v-model:value="draftTokens[index]"
              :placeholder="t('source-expression')"
              :data-testid="`token-input-${index}`"
              @update:value="emitDirective"
            />
          </template>
        </n-dynamic-input>

        <n-flex v-if="quickTokens.length > 0" :wrap="true" :size="8">
          <n-button
            v-for="token in quickTokens"
            :key="token"
            size="small"
            secondary
            @click="appendToken(token)"
          >
            {{ token }}
          </n-button>
        </n-flex>
      </template>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { NButton, NCard, NDynamicInput, NFlex, NInput, NSpace, NText } from 'naive-ui'
import { parseTokenValue, serializeToken } from '@utils/csp'
import type { CSPDirective } from '@utils/csp'

const props = defineProps<{
  directive: CSPDirective
  known: boolean
  removable?: boolean
  flag: boolean
  quickTokens: string[]
}>()

const emit = defineEmits<{
  (e: 'update:directive', value: CSPDirective): void
  (e: 'remove'): void
}>()

const draftName = ref(props.directive.name)
const draftTokens = ref(props.directive.tokens.map(serializeToken))
const { t } = useI18n()

watch(
  () => props.directive,
  (directive) => {
    draftName.value = directive.name
    draftTokens.value = directive.tokens.map(serializeToken)
  },
  { deep: true },
)

function emitDirective(): void {
  emit('update:directive', {
    name: draftName.value.trim().toLowerCase(),
    tokens: draftTokens.value.map((token) => parseTokenValue(token)),
  })
}

function appendToken(token: string): void {
  draftTokens.value = [...draftTokens.value, token]
  emitDirective()
}

function createToken(): string {
  return ''
}
</script>

<i18n lang="json">
{
  "en": {
    "custom-directive": "custom-directive",
    "remove": "Remove",
    "enabled-no-values": "Enabled without values.",
    "add-token": "Add token",
    "source-expression": "source expression"
  },
  "zh": {
    "custom-directive": "自定义指令",
    "remove": "删除",
    "enabled-no-values": "已启用且无值。",
    "add-token": "添加令牌",
    "source-expression": "来源表达式"
  },
  "zh-CN": {
    "custom-directive": "自定义指令",
    "remove": "删除",
    "enabled-no-values": "已启用且无值。",
    "add-token": "添加令牌",
    "source-expression": "来源表达式"
  },
  "zh-TW": {
    "custom-directive": "自訂指令",
    "remove": "移除",
    "enabled-no-values": "已啟用且沒有值。",
    "add-token": "新增令牌",
    "source-expression": "來源表達式"
  },
  "zh-HK": {
    "custom-directive": "自訂指令",
    "remove": "移除",
    "enabled-no-values": "已啟用且沒有值。",
    "add-token": "新增令牌",
    "source-expression": "來源表達式"
  },
  "es": {
    "custom-directive": "custom-directive",
    "remove": "Remove",
    "enabled-no-values": "Enabled without values.",
    "add-token": "Add token",
    "source-expression": "source expression"
  },
  "fr": {
    "custom-directive": "custom-directive",
    "remove": "Remove",
    "enabled-no-values": "Enabled without values.",
    "add-token": "Add token",
    "source-expression": "source expression"
  },
  "de": {
    "custom-directive": "custom-directive",
    "remove": "Remove",
    "enabled-no-values": "Enabled without values.",
    "add-token": "Add token",
    "source-expression": "source expression"
  },
  "it": {
    "custom-directive": "custom-directive",
    "remove": "Remove",
    "enabled-no-values": "Enabled without values.",
    "add-token": "Add token",
    "source-expression": "source expression"
  },
  "ja": {
    "custom-directive": "custom-directive",
    "remove": "Remove",
    "enabled-no-values": "Enabled without values.",
    "add-token": "Add token",
    "source-expression": "source expression"
  },
  "ko": {
    "custom-directive": "custom-directive",
    "remove": "Remove",
    "enabled-no-values": "Enabled without values.",
    "add-token": "Add token",
    "source-expression": "source expression"
  },
  "ru": {
    "custom-directive": "custom-directive",
    "remove": "Remove",
    "enabled-no-values": "Enabled without values.",
    "add-token": "Add token",
    "source-expression": "source expression"
  },
  "pt": {
    "custom-directive": "custom-directive",
    "remove": "Remove",
    "enabled-no-values": "Enabled without values.",
    "add-token": "Add token",
    "source-expression": "source expression"
  },
  "ar": {
    "custom-directive": "custom-directive",
    "remove": "Remove",
    "enabled-no-values": "Enabled without values.",
    "add-token": "Add token",
    "source-expression": "source expression"
  },
  "hi": {
    "custom-directive": "custom-directive",
    "remove": "Remove",
    "enabled-no-values": "Enabled without values.",
    "add-token": "Add token",
    "source-expression": "source expression"
  },
  "tr": {
    "custom-directive": "custom-directive",
    "remove": "Remove",
    "enabled-no-values": "Enabled without values.",
    "add-token": "Add token",
    "source-expression": "source expression"
  },
  "nl": {
    "custom-directive": "custom-directive",
    "remove": "Remove",
    "enabled-no-values": "Enabled without values.",
    "add-token": "Add token",
    "source-expression": "source expression"
  },
  "sv": {
    "custom-directive": "custom-directive",
    "remove": "Remove",
    "enabled-no-values": "Enabled without values.",
    "add-token": "Add token",
    "source-expression": "source expression"
  },
  "pl": {
    "custom-directive": "custom-directive",
    "remove": "Remove",
    "enabled-no-values": "Enabled without values.",
    "add-token": "Add token",
    "source-expression": "source expression"
  },
  "vi": {
    "custom-directive": "custom-directive",
    "remove": "Remove",
    "enabled-no-values": "Enabled without values.",
    "add-token": "Add token",
    "source-expression": "source expression"
  },
  "th": {
    "custom-directive": "custom-directive",
    "remove": "Remove",
    "enabled-no-values": "Enabled without values.",
    "add-token": "Add token",
    "source-expression": "source expression"
  },
  "id": {
    "custom-directive": "custom-directive",
    "remove": "Remove",
    "enabled-no-values": "Enabled without values.",
    "add-token": "Add token",
    "source-expression": "source expression"
  },
  "he": {
    "custom-directive": "custom-directive",
    "remove": "Remove",
    "enabled-no-values": "Enabled without values.",
    "add-token": "Add token",
    "source-expression": "source expression"
  },
  "ms": {
    "custom-directive": "custom-directive",
    "remove": "Remove",
    "enabled-no-values": "Enabled without values.",
    "add-token": "Add token",
    "source-expression": "source expression"
  },
  "no": {
    "custom-directive": "custom-directive",
    "remove": "Remove",
    "enabled-no-values": "Enabled without values.",
    "add-token": "Add token",
    "source-expression": "source expression"
  }
}
</i18n>
