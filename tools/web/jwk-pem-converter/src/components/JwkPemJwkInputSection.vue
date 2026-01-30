<template>
  <ToolSectionHeader>{{ t('jwkInputTitle') }}</ToolSectionHeader>
  <ToolSection>
    <TextOrFileInput
      v-model:value="inputModel"
      class="monospace-field"
      :placeholder="t('jwkInputPlaceholder')"
      :accept="accept"
      :status="status"
      :wrap-with-form-item="false"
    />
    <n-text depth="3" class="input-hint">{{ t('jwkInputHint') }}</n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { TextOrFileInput } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  accept: string
  status?: 'error' | 'success'
}>()

const { t } = useI18n()

const inputModel = defineModel<string | File>({ required: true })
</script>

<style scoped>
.monospace-field :deep(textarea) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}

.input-hint {
  display: block;
  margin-top: 8px;
}
</style>

<i18n lang="json">
{
  "en": {
    "jwkInputTitle": "JWK Input",
    "jwkInputPlaceholder": "Paste a JWK or JWK Set JSON...",
    "jwkInputHint": "Supports RSA, EC, and OKP (Ed25519/X25519/Ed448/X448)."
  },
  "zh": {
    "jwkInputTitle": "JWK 输入",
    "jwkInputPlaceholder": "粘贴 JWK 或 JWK Set JSON...",
    "jwkInputHint": "支持 RSA、EC 与 OKP（Ed25519/X25519/Ed448/X448）。"
  },
  "zh-CN": {
    "jwkInputTitle": "JWK 输入",
    "jwkInputPlaceholder": "粘贴 JWK 或 JWK Set JSON...",
    "jwkInputHint": "支持 RSA、EC 与 OKP（Ed25519/X25519/Ed448/X448）。"
  },
  "zh-TW": {
    "jwkInputTitle": "JWK 輸入",
    "jwkInputPlaceholder": "貼上 JWK 或 JWK Set JSON...",
    "jwkInputHint": "支援 RSA、EC 與 OKP（Ed25519/X25519/Ed448/X448）。"
  },
  "zh-HK": {
    "jwkInputTitle": "JWK 輸入",
    "jwkInputPlaceholder": "貼上 JWK 或 JWK Set JSON...",
    "jwkInputHint": "支援 RSA、EC 與 OKP（Ed25519/X25519/Ed448/X448）。"
  },
  "es": {
    "jwkInputTitle": "Entrada JWK",
    "jwkInputPlaceholder": "Pega un JSON JWK o JWK Set...",
    "jwkInputHint": "Admite RSA, EC y OKP (Ed25519/X25519/Ed448/X448)."
  },
  "fr": {
    "jwkInputTitle": "Entrée JWK",
    "jwkInputPlaceholder": "Collez un JSON JWK ou JWK Set...",
    "jwkInputHint": "Prend en charge RSA, EC et OKP (Ed25519/X25519/Ed448/X448)."
  },
  "de": {
    "jwkInputTitle": "JWK-Eingabe",
    "jwkInputPlaceholder": "JWK- oder JWK-Set-JSON einfügen...",
    "jwkInputHint": "Unterstützt RSA, EC und OKP (Ed25519/X25519/Ed448/X448)."
  },
  "it": {
    "jwkInputTitle": "Input JWK",
    "jwkInputPlaceholder": "Incolla un JSON JWK o JWK Set...",
    "jwkInputHint": "Supporta RSA, EC e OKP (Ed25519/X25519/Ed448/X448)."
  },
  "ja": {
    "jwkInputTitle": "JWK 入力",
    "jwkInputPlaceholder": "JWK または JWK Set の JSON を貼り付け...",
    "jwkInputHint": "RSA、EC、OKP（Ed25519/X25519/Ed448/X448）に対応。"
  },
  "ko": {
    "jwkInputTitle": "JWK 입력",
    "jwkInputPlaceholder": "JWK 또는 JWK Set JSON을 붙여넣기...",
    "jwkInputHint": "RSA, EC, OKP(Ed25519/X25519/Ed448/X448) 지원."
  },
  "ru": {
    "jwkInputTitle": "Ввод JWK",
    "jwkInputPlaceholder": "Вставьте JSON JWK или JWK Set...",
    "jwkInputHint": "Поддерживает RSA, EC и OKP (Ed25519/X25519/Ed448/X448)."
  },
  "pt": {
    "jwkInputTitle": "Entrada JWK",
    "jwkInputPlaceholder": "Cole um JSON JWK ou JWK Set...",
    "jwkInputHint": "Suporta RSA, EC e OKP (Ed25519/X25519/Ed448/X448)."
  },
  "ar": {
    "jwkInputTitle": "إدخال JWK",
    "jwkInputPlaceholder": "الصق JSON لـ JWK أو JWK Set...",
    "jwkInputHint": "يدعم RSA وEC وOKP ‏(Ed25519/X25519/Ed448/X448)."
  },
  "hi": {
    "jwkInputTitle": "JWK इनपुट",
    "jwkInputPlaceholder": "JWK या JWK Set JSON पेस्ट करें...",
    "jwkInputHint": "RSA, EC और OKP (Ed25519/X25519/Ed448/X448) समर्थित।"
  },
  "tr": {
    "jwkInputTitle": "JWK Girdi",
    "jwkInputPlaceholder": "JWK veya JWK Set JSON yapıştırın...",
    "jwkInputHint": "RSA, EC ve OKP (Ed25519/X25519/Ed448/X448) desteklenir."
  },
  "nl": {
    "jwkInputTitle": "JWK-invoer",
    "jwkInputPlaceholder": "Plak JWK- of JWK Set-JSON...",
    "jwkInputHint": "Ondersteunt RSA, EC en OKP (Ed25519/X25519/Ed448/X448)."
  },
  "sv": {
    "jwkInputTitle": "JWK-inmatning",
    "jwkInputPlaceholder": "Klistra in JWK- eller JWK Set-JSON...",
    "jwkInputHint": "Stöd för RSA, EC och OKP (Ed25519/X25519/Ed448/X448)."
  },
  "pl": {
    "jwkInputTitle": "Wejście JWK",
    "jwkInputPlaceholder": "Wklej JSON JWK lub JWK Set...",
    "jwkInputHint": "Obsługuje RSA, EC i OKP (Ed25519/X25519/Ed448/X448)."
  },
  "vi": {
    "jwkInputTitle": "Nhập JWK",
    "jwkInputPlaceholder": "Dán JSON JWK hoặc JWK Set...",
    "jwkInputHint": "Hỗ trợ RSA, EC và OKP (Ed25519/X25519/Ed448/X448)."
  },
  "th": {
    "jwkInputTitle": "อินพุต JWK",
    "jwkInputPlaceholder": "วาง JSON ของ JWK หรือ JWK Set...",
    "jwkInputHint": "รองรับ RSA, EC และ OKP (Ed25519/X25519/Ed448/X448)."
  },
  "id": {
    "jwkInputTitle": "Input JWK",
    "jwkInputPlaceholder": "Tempel JSON JWK atau JWK Set...",
    "jwkInputHint": "Mendukung RSA, EC, dan OKP (Ed25519/X25519/Ed448/X448)."
  },
  "he": {
    "jwkInputTitle": "קלט JWK",
    "jwkInputPlaceholder": "הדבק JSON של JWK או JWK Set...",
    "jwkInputHint": "תומך ב‑RSA, EC ו‑OKP (Ed25519/X25519/Ed448/X448)."
  },
  "ms": {
    "jwkInputTitle": "Input JWK",
    "jwkInputPlaceholder": "Tampal JSON JWK atau JWK Set...",
    "jwkInputHint": "Menyokong RSA, EC dan OKP (Ed25519/X25519/Ed448/X448)."
  },
  "no": {
    "jwkInputTitle": "JWK-inndata",
    "jwkInputPlaceholder": "Lim inn JWK- eller JWK Set-JSON...",
    "jwkInputHint": "Støtter RSA, EC og OKP (Ed25519/X25519/Ed448/X448)."
  }
}
</i18n>
