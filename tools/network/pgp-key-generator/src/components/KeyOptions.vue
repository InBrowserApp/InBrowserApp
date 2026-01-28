<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('options') }}</ToolSectionHeader>
    <n-grid cols="1 m:2" responsive="screen" :x-gap="20" :y-gap="16">
      <KeyIdentityFields
        :name="name"
        :email="email"
        :comment="comment"
        @update:name="$emit('update:name', $event)"
        @update:email="$emit('update:email', $event)"
        @update:comment="$emit('update:comment', $event)"
      />
      <KeyAlgorithmFields
        :algorithm="algorithm"
        :rsa-key-size="rsaKeySize"
        @update:algorithm="$emit('update:algorithm', $event)"
        @update:rsa-key-size="$emit('update:rsaKeySize', $event)"
      />
      <KeyExpirationFields
        :expiration-days="expirationDays"
        :passphrase="passphrase"
        @update:expiration-days="$emit('update:expirationDays', $event)"
        @update:passphrase="$emit('update:passphrase', $event)"
      />
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NGrid } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import KeyAlgorithmFields from './KeyAlgorithmFields.vue'
import KeyExpirationFields from './KeyExpirationFields.vue'
import KeyIdentityFields from './KeyIdentityFields.vue'
import type { KeyAlgorithm, RsaKeySize } from '../pgp-keygen'

defineProps<{
  algorithm: KeyAlgorithm
  rsaKeySize: RsaKeySize
  name: string
  email: string
  comment: string
  passphrase: string
  expirationDays: number
}>()

defineEmits<{
  'update:algorithm': [value: KeyAlgorithm]
  'update:rsaKeySize': [value: RsaKeySize]
  'update:name': [value: string]
  'update:email': [value: string]
  'update:comment': [value: string]
  'update:passphrase': [value: string]
  'update:expirationDays': [value: number]
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "options": "Options"
  },
  "zh": {
    "options": "选项"
  },
  "zh-CN": {
    "options": "选项"
  },
  "zh-TW": {
    "options": "選項"
  },
  "zh-HK": {
    "options": "選項"
  },
  "es": {
    "options": "Opciones"
  },
  "fr": {
    "options": "Options"
  },
  "de": {
    "options": "Optionen"
  },
  "it": {
    "options": "Opzioni"
  },
  "ja": {
    "options": "オプション"
  },
  "ko": {
    "options": "옵션"
  },
  "ru": {
    "options": "Параметры"
  },
  "pt": {
    "options": "Opções"
  },
  "ar": {
    "options": "الخيارات"
  },
  "hi": {
    "options": "विकल्प"
  },
  "tr": {
    "options": "Seçenekler"
  },
  "nl": {
    "options": "Opties"
  },
  "sv": {
    "options": "Alternativ"
  },
  "pl": {
    "options": "Opcje"
  },
  "vi": {
    "options": "Tùy chọn"
  },
  "th": {
    "options": "ตัวเลือก"
  },
  "id": {
    "options": "Opsi"
  },
  "he": {
    "options": "אפשרויות"
  },
  "ms": {
    "options": "Pilihan"
  },
  "no": {
    "options": "Alternativer"
  }
}
</i18n>
