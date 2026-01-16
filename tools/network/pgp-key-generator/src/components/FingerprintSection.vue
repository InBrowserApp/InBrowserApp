<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('details') }}</ToolSectionHeader>
    <n-descriptions :column="1" bordered label-placement="left">
      <n-descriptions-item v-if="userId" :label="t('userId')">
        <n-text>{{ userId }}</n-text>
      </n-descriptions-item>
      <n-descriptions-item :label="t('fingerprint')">
        <n-text>{{ fingerprint }}</n-text>
      </n-descriptions-item>
      <n-descriptions-item :label="t('keyId')">
        <n-text>{{ keyId }}</n-text>
      </n-descriptions-item>
    </n-descriptions>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NDescriptions, NDescriptionsItem, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  fingerprint: string
  keyId: string
  userId: string
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "details": "Key Details",
    "userId": "User ID",
    "fingerprint": "Fingerprint",
    "keyId": "Key ID"
  },
  "zh": {
    "details": "密钥详情",
    "userId": "用户 ID",
    "fingerprint": "指纹",
    "keyId": "密钥 ID"
  },
  "zh-CN": {
    "details": "密钥详情",
    "userId": "用户 ID",
    "fingerprint": "指纹",
    "keyId": "密钥 ID"
  },
  "zh-TW": {
    "details": "金鑰詳情",
    "userId": "使用者 ID",
    "fingerprint": "指紋",
    "keyId": "金鑰 ID"
  },
  "zh-HK": {
    "details": "金鑰詳情",
    "userId": "使用者 ID",
    "fingerprint": "指紋",
    "keyId": "金鑰 ID"
  },
  "es": {
    "details": "Detalles de la clave",
    "userId": "ID de usuario",
    "fingerprint": "Huella",
    "keyId": "ID de clave"
  },
  "fr": {
    "details": "Détails de la clé",
    "userId": "ID utilisateur",
    "fingerprint": "Empreinte",
    "keyId": "ID de clé"
  },
  "de": {
    "details": "Schlüsseldetails",
    "userId": "Benutzer-ID",
    "fingerprint": "Fingerprint",
    "keyId": "Schlüssel-ID"
  },
  "it": {
    "details": "Dettagli della chiave",
    "userId": "ID utente",
    "fingerprint": "Impronta",
    "keyId": "ID chiave"
  },
  "ja": {
    "details": "鍵の詳細",
    "userId": "ユーザー ID",
    "fingerprint": "フィンガープリント",
    "keyId": "キー ID"
  },
  "ko": {
    "details": "키 세부 정보",
    "userId": "사용자 ID",
    "fingerprint": "지문",
    "keyId": "키 ID"
  },
  "ru": {
    "details": "Детали ключа",
    "userId": "ID пользователя",
    "fingerprint": "Отпечаток",
    "keyId": "ID ключа"
  },
  "pt": {
    "details": "Detalhes da chave",
    "userId": "ID do usuário",
    "fingerprint": "Impressão digital",
    "keyId": "ID da chave"
  },
  "ar": {
    "details": "تفاصيل المفتاح",
    "userId": "معرّف المستخدم",
    "fingerprint": "البصمة",
    "keyId": "معرّف المفتاح"
  },
  "hi": {
    "details": "कुंजी विवरण",
    "userId": "उपयोगकर्ता ID",
    "fingerprint": "फिंगरप्रिंट",
    "keyId": "कुंजी ID"
  },
  "tr": {
    "details": "Anahtar ayrıntıları",
    "userId": "Kullanıcı ID",
    "fingerprint": "Parmak izi",
    "keyId": "Anahtar ID"
  },
  "nl": {
    "details": "Sleuteldetails",
    "userId": "Gebruikers-ID",
    "fingerprint": "Vingerafdruk",
    "keyId": "Sleutel-ID"
  },
  "sv": {
    "details": "Nyckeldetaljer",
    "userId": "Användar-ID",
    "fingerprint": "Fingeravtryck",
    "keyId": "Nyckel-ID"
  },
  "pl": {
    "details": "Szczegóły klucza",
    "userId": "ID użytkownika",
    "fingerprint": "Odcisk",
    "keyId": "ID klucza"
  },
  "vi": {
    "details": "Chi tiết khóa",
    "userId": "ID người dùng",
    "fingerprint": "Vân tay",
    "keyId": "ID khóa"
  },
  "th": {
    "details": "รายละเอียดคีย์",
    "userId": "รหัสผู้ใช้",
    "fingerprint": "ลายนิ้วมือ",
    "keyId": "รหัสคีย์"
  },
  "id": {
    "details": "Detail kunci",
    "userId": "ID pengguna",
    "fingerprint": "Sidik jari",
    "keyId": "ID kunci"
  },
  "he": {
    "details": "פרטי מפתח",
    "userId": "מזהה משתמש",
    "fingerprint": "טביעת אצבע",
    "keyId": "מזהה מפתח"
  },
  "ms": {
    "details": "Butiran kunci",
    "userId": "ID pengguna",
    "fingerprint": "Cap jari",
    "keyId": "ID kunci"
  },
  "no": {
    "details": "Nøkkeldetaljer",
    "userId": "Bruker-ID",
    "fingerprint": "Fingeravtrykk",
    "keyId": "Nøkkel-ID"
  }
}
</i18n>
