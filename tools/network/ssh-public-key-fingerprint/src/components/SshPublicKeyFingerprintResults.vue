<template>
  <n-alert v-show="hasError" type="error" :title="t('errorTitle')">
    {{ errorMessage }}
  </n-alert>

  <ToolSectionHeader>{{ t('resultsTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-empty v-if="entries.length === 0" :description="t('resultsEmpty')" />
    <n-grid v-else cols="1 s:2 l:3" responsive="screen" :x-gap="12" :y-gap="12">
      <n-gi v-for="(entry, index) in entries" :key="`${entry.keyType}-${index}`">
        <n-card size="small" :title="t('keyLabel', { index: index + 1 })">
          <n-descriptions label-placement="left" bordered :column="1">
            <n-descriptions-item :label="t('keyType')">
              <n-text>{{ entry.keyType }}</n-text>
            </n-descriptions-item>
            <n-descriptions-item :label="t('keySize')">
              <n-text>{{ formatKeySize(entry.keySize) }}</n-text>
            </n-descriptions-item>
            <n-descriptions-item :label="t('curve')">
              <n-text>{{ formatValue(entry.curve) }}</n-text>
            </n-descriptions-item>
            <n-descriptions-item :label="t('comment')">
              <n-text>{{ formatValue(entry.comment) }}</n-text>
            </n-descriptions-item>
          </n-descriptions>

          <n-form label-placement="top" :show-feedback="false" class="fingerprint-form">
            <n-flex vertical :size="12" class="fingerprint-list">
              <n-form-item :label="t('fingerprintSha256')">
                <n-flex align="center" :wrap="false" class="fingerprint-row">
                  <n-input
                    :value="entry.fingerprints.sha256"
                    size="small"
                    readonly
                    class="fingerprint-input"
                  />
                  <CopyToClipboardButton :content="entry.fingerprints.sha256" />
                </n-flex>
              </n-form-item>
              <n-form-item :label="t('fingerprintMd5')">
                <n-flex align="center" :wrap="false" class="fingerprint-row">
                  <n-input
                    :value="entry.fingerprints.md5"
                    size="small"
                    readonly
                    class="fingerprint-input"
                  />
                  <CopyToClipboardButton :content="entry.fingerprints.md5" />
                </n-flex>
              </n-form-item>
            </n-flex>
          </n-form>
        </n-card>
      </n-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  NAlert,
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NEmpty,
  NFlex,
  NForm,
  NFormItem,
  NGi,
  NGrid,
  NInput,
  NText,
} from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { ParsedSshPublicKey } from '../ssh-public-key-fingerprint'

const { t } = useI18n()

const { entries, errorMessage, hasError } = defineProps<{
  entries: ParsedSshPublicKey[]
  errorMessage: string
  hasError: boolean
}>()

function formatValue(value?: string) {
  return value && value.length > 0 ? value : '-'
}

function formatKeySize(value?: number) {
  return value ? `${value} ${t('bits')}` : '-'
}
</script>

<style scoped>
.fingerprint-form {
  margin-top: 12px;
}

.fingerprint-form :deep(.n-form-item) {
  margin-bottom: 0;
}

.fingerprint-list {
  width: 100%;
}

.fingerprint-row {
  width: 100%;
}

.fingerprint-input {
  flex: 1;
  min-width: 0;
}

.fingerprint-input :deep(input) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}
</style>

<i18n lang="json">
{
  "en": {
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "zh": {
    "resultsTitle": "指纹",
    "resultsEmpty": "粘贴公钥以查看指纹。",
    "errorTitle": "解析错误",
    "keyLabel": "密钥 {index}",
    "keyType": "密钥类型",
    "keySize": "密钥长度",
    "curve": "曲线",
    "comment": "注释",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "位"
  },
  "zh-CN": {
    "resultsTitle": "指纹",
    "resultsEmpty": "粘贴公钥以查看指纹。",
    "errorTitle": "解析错误",
    "keyLabel": "密钥 {index}",
    "keyType": "密钥类型",
    "keySize": "密钥长度",
    "curve": "曲线",
    "comment": "注释",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "位"
  },
  "zh-TW": {
    "resultsTitle": "指紋",
    "resultsEmpty": "貼上公鑰以查看指紋。",
    "errorTitle": "解析錯誤",
    "keyLabel": "密鑰 {index}",
    "keyType": "密鑰類型",
    "keySize": "密鑰長度",
    "curve": "曲線",
    "comment": "註解",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "位元"
  },
  "zh-HK": {
    "resultsTitle": "指紋",
    "resultsEmpty": "貼上公鑰以查看指紋。",
    "errorTitle": "解析錯誤",
    "keyLabel": "密鑰 {index}",
    "keyType": "密鑰類型",
    "keySize": "密鑰長度",
    "curve": "曲線",
    "comment": "註解",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "位元"
  },
  "es": {
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "fr": {
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "de": {
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "it": {
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "ja": {
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "ko": {
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "ru": {
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "pt": {
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "ar": {
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "hi": {
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "tr": {
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "nl": {
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "sv": {
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "pl": {
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "vi": {
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "th": {
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "id": {
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "he": {
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "ms": {
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  },
  "no": {
    "resultsTitle": "Fingerprints",
    "resultsEmpty": "Paste a public key to see fingerprints.",
    "errorTitle": "Parsing Error",
    "keyLabel": "Key {index}",
    "keyType": "Key Type",
    "keySize": "Key Size",
    "curve": "Curve",
    "comment": "Comment",
    "fingerprintSha256": "SHA-256",
    "fingerprintMd5": "MD5",
    "bits": "bits"
  }
}
</i18n>
