<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('options') }}</ToolSectionHeader>
    <n-grid cols="1 m:2" responsive="screen" :x-gap="20" :y-gap="16">
      <n-gi>
        <KeyIdentityFields v-model:name="name" v-model:email="email" v-model:comment="comment" />
      </n-gi>
      <n-gi>
        <KeyAlgorithmFields v-model:algorithm="algorithm" v-model:rsa-key-size="rsaKeySize" />
      </n-gi>
      <n-gi>
        <KeyExpirationFields
          v-model:expiration-days="expirationDays"
          v-model:passphrase="passphrase"
        />
      </n-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NGrid, NGi } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import KeyAlgorithmFields from './KeyAlgorithmFields.vue'
import KeyExpirationFields from './KeyExpirationFields.vue'
import KeyIdentityFields from './KeyIdentityFields.vue'
import type { KeyAlgorithm, RsaKeySize } from '../pgp-keygen'

const algorithm = defineModel<KeyAlgorithm>('algorithm', { required: true })
const rsaKeySize = defineModel<RsaKeySize>('rsaKeySize', { required: true })
const name = defineModel<string>('name', { required: true })
const email = defineModel<string>('email', { required: true })
const comment = defineModel<string>('comment', { required: true })
const passphrase = defineModel<string>('passphrase', { required: true })
const expirationDays = defineModel<number>('expirationDays', { required: true })

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
