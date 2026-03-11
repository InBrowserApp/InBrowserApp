<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <n-flex vertical :size="12">
      <n-flex :size="8" wrap>
        <n-button size="small" @click="emit('update:userAgent', '*')">{{ t('wildcard') }}</n-button>
        <n-button size="small" @click="emit('update:userAgent', 'Googlebot')">
          {{ t('googlebot') }}
        </n-button>
        <n-button size="small" @click="emit('update:userAgent', 'Bingbot')">
          {{ t('bingbot') }}
        </n-button>
        <n-button size="small" @click="emit('update:userAgent', 'Applebot')">
          {{ t('applebot') }}
        </n-button>
      </n-flex>

      <n-grid cols="1 m:2" responsive="screen" :x-gap="16" :y-gap="16">
        <n-gi>
          <n-form-item :label="t('userAgentLabel')" :show-feedback="false">
            <n-input
              :value="userAgent"
              :placeholder="t('userAgentPlaceholder')"
              @update:value="emit('update:userAgent', $event)"
            />
          </n-form-item>
        </n-gi>

        <n-gi>
          <n-form-item :label="t('targetLabel')" :show-feedback="false">
            <n-input
              :value="target"
              :placeholder="t('targetPlaceholder')"
              @update:value="emit('update:target', $event)"
            />
          </n-form-item>
        </n-gi>
      </n-grid>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NButton, NFlex, NFormItem, NGi, NGrid, NInput } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'

defineProps<{
  userAgent: string
  target: string
}>()

const emit = defineEmits<{
  'update:userAgent': [value: string]
  'update:target': [value: string]
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "title": "Test Scenario",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "Enter a crawler token like Googlebot",
    "targetLabel": "URL or path",
    "targetPlaceholder": "https://example.com/private/report.html or /private/report.html"
  },
  "zh": {
    "title": "测试场景",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "输入爬虫标识，例如 Googlebot",
    "targetLabel": "URL 或路径",
    "targetPlaceholder": "https://example.com/private/report.html 或 /private/report.html"
  },
  "zh-CN": {
    "title": "测试场景",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "输入爬虫标识，例如 Googlebot",
    "targetLabel": "URL 或路径",
    "targetPlaceholder": "https://example.com/private/report.html 或 /private/report.html"
  },
  "zh-TW": {
    "title": "測試情境",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "輸入爬蟲識別，例如 Googlebot",
    "targetLabel": "URL 或路徑",
    "targetPlaceholder": "https://example.com/private/report.html 或 /private/report.html"
  },
  "zh-HK": {
    "title": "測試情境",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "輸入爬蟲識別，例如 Googlebot",
    "targetLabel": "URL 或路徑",
    "targetPlaceholder": "https://example.com/private/report.html 或 /private/report.html"
  },
  "es": {
    "title": "Test Scenario",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "Enter a crawler token like Googlebot",
    "targetLabel": "URL or path",
    "targetPlaceholder": "https://example.com/private/report.html or /private/report.html"
  },
  "fr": {
    "title": "Test Scenario",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "Enter a crawler token like Googlebot",
    "targetLabel": "URL or path",
    "targetPlaceholder": "https://example.com/private/report.html or /private/report.html"
  },
  "de": {
    "title": "Test Scenario",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "Enter a crawler token like Googlebot",
    "targetLabel": "URL or path",
    "targetPlaceholder": "https://example.com/private/report.html or /private/report.html"
  },
  "it": {
    "title": "Test Scenario",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "Enter a crawler token like Googlebot",
    "targetLabel": "URL or path",
    "targetPlaceholder": "https://example.com/private/report.html or /private/report.html"
  },
  "ja": {
    "title": "Test Scenario",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "Enter a crawler token like Googlebot",
    "targetLabel": "URL or path",
    "targetPlaceholder": "https://example.com/private/report.html or /private/report.html"
  },
  "ko": {
    "title": "Test Scenario",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "Enter a crawler token like Googlebot",
    "targetLabel": "URL or path",
    "targetPlaceholder": "https://example.com/private/report.html or /private/report.html"
  },
  "ru": {
    "title": "Test Scenario",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "Enter a crawler token like Googlebot",
    "targetLabel": "URL or path",
    "targetPlaceholder": "https://example.com/private/report.html or /private/report.html"
  },
  "pt": {
    "title": "Test Scenario",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "Enter a crawler token like Googlebot",
    "targetLabel": "URL or path",
    "targetPlaceholder": "https://example.com/private/report.html or /private/report.html"
  },
  "ar": {
    "title": "Test Scenario",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "Enter a crawler token like Googlebot",
    "targetLabel": "URL or path",
    "targetPlaceholder": "https://example.com/private/report.html or /private/report.html"
  },
  "hi": {
    "title": "Test Scenario",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "Enter a crawler token like Googlebot",
    "targetLabel": "URL or path",
    "targetPlaceholder": "https://example.com/private/report.html or /private/report.html"
  },
  "tr": {
    "title": "Test Scenario",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "Enter a crawler token like Googlebot",
    "targetLabel": "URL or path",
    "targetPlaceholder": "https://example.com/private/report.html or /private/report.html"
  },
  "nl": {
    "title": "Test Scenario",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "Enter a crawler token like Googlebot",
    "targetLabel": "URL or path",
    "targetPlaceholder": "https://example.com/private/report.html or /private/report.html"
  },
  "sv": {
    "title": "Test Scenario",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "Enter a crawler token like Googlebot",
    "targetLabel": "URL or path",
    "targetPlaceholder": "https://example.com/private/report.html or /private/report.html"
  },
  "pl": {
    "title": "Test Scenario",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "Enter a crawler token like Googlebot",
    "targetLabel": "URL or path",
    "targetPlaceholder": "https://example.com/private/report.html or /private/report.html"
  },
  "vi": {
    "title": "Test Scenario",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "Enter a crawler token like Googlebot",
    "targetLabel": "URL or path",
    "targetPlaceholder": "https://example.com/private/report.html or /private/report.html"
  },
  "th": {
    "title": "Test Scenario",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "Enter a crawler token like Googlebot",
    "targetLabel": "URL or path",
    "targetPlaceholder": "https://example.com/private/report.html or /private/report.html"
  },
  "id": {
    "title": "Test Scenario",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "Enter a crawler token like Googlebot",
    "targetLabel": "URL or path",
    "targetPlaceholder": "https://example.com/private/report.html or /private/report.html"
  },
  "he": {
    "title": "Test Scenario",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "Enter a crawler token like Googlebot",
    "targetLabel": "URL or path",
    "targetPlaceholder": "https://example.com/private/report.html or /private/report.html"
  },
  "ms": {
    "title": "Test Scenario",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "Enter a crawler token like Googlebot",
    "targetLabel": "URL or path",
    "targetPlaceholder": "https://example.com/private/report.html or /private/report.html"
  },
  "no": {
    "title": "Test Scenario",
    "wildcard": "*",
    "googlebot": "Googlebot",
    "bingbot": "Bingbot",
    "applebot": "Applebot",
    "userAgentLabel": "User-agent",
    "userAgentPlaceholder": "Enter a crawler token like Googlebot",
    "targetLabel": "URL or path",
    "targetPlaceholder": "https://example.com/private/report.html or /private/report.html"
  }
}
</i18n>
