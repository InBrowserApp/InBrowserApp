<template>
  <n-grid-item :span="2">
    <n-form-item :label="t('appName')">
      <n-input v-model:value="options.name" />
    </n-form-item>
  </n-grid-item>
  <n-grid-item :span="2">
    <n-form-item :label="t('shortName')">
      <n-input v-model:value="options.short_name" />
    </n-form-item>
  </n-grid-item>
  <n-grid-item :span="4">
    <n-form-item :label="t('description')">
      <n-input v-model:value="options.description" />
    </n-form-item>
  </n-grid-item>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { NGridItem, NFormItem, NInput } from 'naive-ui'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ options: GeneralInfoOptions }>()
const { options } = toRefs(props)

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "appName": "App Name",
    "shortName": "Short Name",
    "description": "Description"
  },
  "zh": {
    "appName": "应用名称",
    "shortName": "短名称",
    "description": "描述"
  },
  "zh-CN": {
    "appName": "应用名称",
    "shortName": "短名称",
    "description": "描述"
  },
  "zh-TW": {
    "appName": "應用名稱",
    "shortName": "短名稱",
    "description": "描述"
  },
  "zh-HK": {
    "appName": "應用名稱",
    "shortName": "短名稱",
    "description": "描述"
  },
  "es": {
    "appName": "Nombre de la Aplicación",
    "shortName": "Nombre Corto",
    "description": "Descripción"
  },
  "fr": {
    "appName": "Nom de l'Application",
    "shortName": "Nom Court",
    "description": "Description"
  },
  "de": {
    "appName": "App-Name",
    "shortName": "Kurzname",
    "description": "Beschreibung"
  },
  "it": {
    "appName": "Nome dell'App",
    "shortName": "Nome Breve",
    "description": "Descrizione"
  },
  "ja": {
    "appName": "アプリ名",
    "shortName": "短い名前",
    "description": "説明"
  },
  "ko": {
    "appName": "앱 이름",
    "shortName": "짧은 이름",
    "description": "설명"
  },
  "ru": {
    "appName": "Название Приложения",
    "shortName": "Короткое Название",
    "description": "Описание"
  },
  "pt": {
    "appName": "Nome do Aplicativo",
    "shortName": "Nome Curto",
    "description": "Descrição"
  },
  "ar": {
    "appName": "اسم التطبيق",
    "shortName": "الاسم المختصر",
    "description": "الوصف"
  },
  "hi": {
    "appName": "ऐप का नाम",
    "shortName": "संक्षिप्त नाम",
    "description": "विवरण"
  },
  "tr": {
    "appName": "Uygulama Adı",
    "shortName": "Kısa Ad",
    "description": "Açıklama"
  },
  "nl": {
    "appName": "App-naam",
    "shortName": "Korte Naam",
    "description": "Beschrijving"
  },
  "sv": {
    "appName": "App-namn",
    "shortName": "Kortnamn",
    "description": "Beskrivning"
  },
  "pl": {
    "appName": "Nazwa Aplikacji",
    "shortName": "Krótka Nazwa",
    "description": "Opis"
  },
  "vi": {
    "appName": "Tên Ứng dụng",
    "shortName": "Tên Ngắn",
    "description": "Mô tả"
  },
  "th": {
    "appName": "ชื่อแอป",
    "shortName": "ชื่อย่อ",
    "description": "คำอธิบาย"
  },
  "id": {
    "appName": "Nama Aplikasi",
    "shortName": "Nama Pendek",
    "description": "Deskripsi"
  },
  "he": {
    "appName": "שם האפליקציה",
    "shortName": "שם קצר",
    "description": "תיאור"
  },
  "ms": {
    "appName": "Nama Aplikasi",
    "shortName": "Nama Pendek",
    "description": "Penerangan"
  },
  "no": {
    "appName": "App-navn",
    "shortName": "Kortnavn",
    "description": "Beskrivelse"
  }
}
</i18n>
