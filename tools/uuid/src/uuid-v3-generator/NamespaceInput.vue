<template>
  <n-form-item :label="t('namespace')" :show-feedback="false">
    <UUIDInput v-model:uuid="namespace" :show-random="true" />
  </n-form-item>
  <n-space style="margin-top: 0.3em; margin-bottom: 1em">
    <n-tag
      v-for="predefinedNamespace in predefinedNamespaces"
      :key="predefinedNamespace.value"
      :bordered="false"
      style="cursor: pointer"
      @click="namespace = predefinedNamespace.value"
    >
      {{ predefinedNamespace.name }}
    </n-tag>
  </n-space>
</template>

<script setup lang="ts">
import { NFormItem, NSpace, NTag } from 'naive-ui'
import { UUIDInput } from '@shared/ui/domain/uuid'
import { useI18n } from 'vue-i18n'
import type { UUID } from '@utils/uuid'

const { t } = useI18n()

const namespace = defineModel<UUID>('namespace', { required: true })

const predefinedNamespaces: { name: string; value: UUID }[] = [
  {
    name: 'ns:DNS',
    value: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  },
  {
    name: 'ns:URL',
    value: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
  },
  {
    name: 'ns:OID',
    value: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
  },
  {
    name: 'ns:X.500 DN',
    value: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
  },
]
</script>

<i18n lang="json">
{
  "en": {
    "namespace": "Namespace UUID"
  },
  "zh": {
    "namespace": "命名空间 UUID"
  },
  "zh-CN": {
    "namespace": "命名空间 UUID"
  },
  "zh-TW": {
    "namespace": "命名空間 UUID"
  },
  "zh-HK": {
    "namespace": "命名空間 UUID"
  },
  "es": {
    "namespace": "UUID de espacio de nombres"
  },
  "fr": {
    "namespace": "UUID d'espace de noms"
  },
  "de": {
    "namespace": "Namensraum-UUID"
  },
  "it": {
    "namespace": "UUID dello spazio dei nomi"
  },
  "ja": {
    "namespace": "名前空間 UUID"
  },
  "ko": {
    "namespace": "네임스페이스 UUID"
  },
  "ru": {
    "namespace": "UUID пространства имен"
  },
  "pt": {
    "namespace": "UUID do espaço de nomes"
  },
  "ar": {
    "namespace": "UUID مساحة الاسم"
  },
  "hi": {
    "namespace": "नेमस्पेस UUID"
  },
  "tr": {
    "namespace": "Ad alanı UUID"
  },
  "nl": {
    "namespace": "Naamruimte UUID"
  },
  "sv": {
    "namespace": "Namnrymd UUID"
  },
  "pl": {
    "namespace": "UUID przestrzeni nazw"
  },
  "vi": {
    "namespace": "UUID không gian tên"
  },
  "th": {
    "namespace": "UUID namespace"
  },
  "id": {
    "namespace": "UUID namespace"
  },
  "he": {
    "namespace": "UUID מרחב שמות"
  },
  "ms": {
    "namespace": "UUID ruang nama"
  },
  "no": {
    "namespace": "Navnerom UUID"
  }
}
</i18n>
