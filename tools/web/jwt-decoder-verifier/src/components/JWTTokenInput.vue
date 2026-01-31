<template>
  <div>
    <ToolSectionHeader>{{ t('token') }}</ToolSectionHeader>
    <ToolSection>
      <n-input
        v-model:value="value"
        :placeholder="placeholder"
        type="password"
        show-password-on="click"
      />
    </ToolSection>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NInput } from 'naive-ui'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'

defineProps<{
  placeholder?: string
}>()

const value = defineModel<string>('value', { required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "token": "Token"
  },
  "zh": {
    "token": "令牌"
  },
  "zh-CN": {
    "token": "令牌"
  },
  "zh-TW": {
    "token": "權杖"
  },
  "zh-HK": {
    "token": "權杖"
  },
  "es": {
    "token": "Token"
  },
  "fr": {
    "token": "Token"
  },
  "de": {
    "token": "Token"
  },
  "it": {
    "token": "Token"
  },
  "ja": {
    "token": "Token"
  },
  "ko": {
    "token": "Token"
  },
  "ru": {
    "token": "Token"
  },
  "pt": {
    "token": "Token"
  },
  "ar": {
    "token": "Token"
  },
  "hi": {
    "token": "Token"
  },
  "tr": {
    "token": "Token"
  },
  "nl": {
    "token": "Token"
  },
  "sv": {
    "token": "Token"
  },
  "pl": {
    "token": "Token"
  },
  "vi": {
    "token": "Token"
  },
  "th": {
    "token": "Token"
  },
  "id": {
    "token": "Token"
  },
  "he": {
    "token": "Token"
  },
  "ms": {
    "token": "Token"
  },
  "no": {
    "token": "Token"
  }
}
</i18n>
