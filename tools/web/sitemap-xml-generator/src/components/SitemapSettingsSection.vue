<template>
  <ToolSectionHeader>{{ t('settings') }}</ToolSectionHeader>
  <ToolSection>
    <n-space vertical :size="12">
      <n-text depth="3">{{ t('baseUrl') }}</n-text>
      <n-input v-model:value="baseUrl" placeholder="https://example.com" data-testid="base-url" />
      <n-flex align="center" justify="space-between">
        <n-text>{{ t('autoJoin') }}</n-text>
        <n-switch v-model:value="autoJoin" data-testid="auto-join" />
      </n-flex>
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { NFlex, NInput, NSpace, NSwitch, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const baseUrl = defineModel<string>('baseUrl', { required: true })
const autoJoin = defineModel<boolean>('autoJoin', { required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "settings": "Settings",
    "baseUrl": "Base URL",
    "autoJoin": "Auto-join relative URLs"
  },
  "zh": {
    "settings": "设置",
    "baseUrl": "基础 URL",
    "autoJoin": "自动拼接相对 URL"
  },
  "zh-CN": {
    "settings": "设置",
    "baseUrl": "基础 URL",
    "autoJoin": "自动拼接相对 URL"
  },
  "zh-TW": {
    "settings": "設定",
    "baseUrl": "基礎 URL",
    "autoJoin": "自動拼接相對 URL"
  },
  "zh-HK": {
    "settings": "設定",
    "baseUrl": "基礎 URL",
    "autoJoin": "自動拼接相對 URL"
  },
  "es": {
    "settings": "Configuración",
    "baseUrl": "URL base",
    "autoJoin": "Unir automáticamente URLs relativas"
  },
  "fr": {
    "settings": "Paramètres",
    "baseUrl": "URL de base",
    "autoJoin": "Assembler automatiquement les URL relatives"
  },
  "de": {
    "settings": "Einstellungen",
    "baseUrl": "Basis-URL",
    "autoJoin": "Relative URLs automatisch verbinden"
  },
  "it": {
    "settings": "Impostazioni",
    "baseUrl": "URL di base",
    "autoJoin": "Unisci automaticamente URL relative"
  },
  "ja": {
    "settings": "設定",
    "baseUrl": "ベース URL",
    "autoJoin": "相対 URL を自動結合"
  },
  "ko": {
    "settings": "설정",
    "baseUrl": "기본 URL",
    "autoJoin": "상대 URL 자동 결합"
  },
  "ru": {
    "settings": "Настройки",
    "baseUrl": "Базовый URL",
    "autoJoin": "Автоматически объединять относительные URL"
  },
  "pt": {
    "settings": "Configurações",
    "baseUrl": "URL base",
    "autoJoin": "Unir URLs relativas automaticamente"
  },
  "ar": {
    "settings": "الإعدادات",
    "baseUrl": "عنوان URL الأساسي",
    "autoJoin": "دمج عناوين URL النسبية تلقائيا"
  },
  "hi": {
    "settings": "सेटिंग्स",
    "baseUrl": "बेस URL",
    "autoJoin": "रिलेटिव URL ऑटो-जोइन करें"
  },
  "tr": {
    "settings": "Ayarlar",
    "baseUrl": "Temel URL",
    "autoJoin": "Göreli URL'leri otomatik birleştir"
  },
  "nl": {
    "settings": "Instellingen",
    "baseUrl": "Basis-URL",
    "autoJoin": "Relatieve URL's automatisch samenvoegen"
  },
  "sv": {
    "settings": "Inställningar",
    "baseUrl": "Bas-URL",
    "autoJoin": "Slå ihop relativa URL:er automatiskt"
  },
  "pl": {
    "settings": "Ustawienia",
    "baseUrl": "Bazowy URL",
    "autoJoin": "Automatycznie łącz względne URL"
  },
  "vi": {
    "settings": "Cài đặt",
    "baseUrl": "URL cơ sở",
    "autoJoin": "Tự động ghép URL tương đối"
  },
  "th": {
    "settings": "การตั้งค่า",
    "baseUrl": "URL พื้นฐาน",
    "autoJoin": "รวม URL แบบสัมพันธ์อัตโนมัติ"
  },
  "id": {
    "settings": "Pengaturan",
    "baseUrl": "URL dasar",
    "autoJoin": "Gabungkan URL relatif secara otomatis"
  },
  "he": {
    "settings": "הגדרות",
    "baseUrl": "URL בסיסי",
    "autoJoin": "איחוד אוטומטי של URL יחסיים"
  },
  "ms": {
    "settings": "Tetapan",
    "baseUrl": "URL asas",
    "autoJoin": "Gabung URL relatif secara automatik"
  },
  "no": {
    "settings": "Innstillinger",
    "baseUrl": "Basis-URL",
    "autoJoin": "Slå sammen relative URL-er automatisk"
  }
}
</i18n>
