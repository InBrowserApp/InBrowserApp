<template>
  <ToolSectionHeader>{{ t('input-header') }}</ToolSectionHeader>
  <ToolSection>
    <n-form-item :label="t('secret-key')">
      <n-input
        :value="secretKey"
        :placeholder="t('secret-key-placeholder')"
        type="password"
        show-password-on="click"
        :input-props="{ autocomplete: 'off' }"
        @update:value="$emit('update:secretKey', $event)"
      />
    </n-form-item>
    <n-form-item :label="t('algorithm')" :show-feedback="false">
      <n-select
        :value="algorithm"
        :options="ALGORITHM_OPTIONS"
        @update:value="$emit('update:algorithm', $event)"
      />
    </n-form-item>
  </ToolSection>

  <ToolSectionHeader>{{ t('message-header') }}</ToolSectionHeader>
  <TextOrFileInput :value="message" @update:value="$emit('update:message', $event)" />
</template>

<script setup lang="ts">
import type { HmacAlgorithm } from '../types'
import { ALGORITHM_OPTIONS } from '../types'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { TextOrFileInput } from '@shared/ui/base'
import { NInput, NFormItem, NSelect } from 'naive-ui'
import { useI18n } from 'vue-i18n'

defineProps<{
  secretKey: string
  algorithm: HmacAlgorithm
  message: string | File
}>()

defineEmits<{
  'update:secretKey': [value: string]
  'update:algorithm': [value: HmacAlgorithm]
  'update:message': [value: string | File]
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "input-header": "Configuration",
    "secret-key": "Secret Key",
    "secret-key-placeholder": "Enter your secret key",
    "algorithm": "Algorithm",
    "message-header": "Message"
  },
  "zh": {
    "input-header": "配置",
    "secret-key": "密钥",
    "secret-key-placeholder": "输入您的密钥",
    "algorithm": "算法",
    "message-header": "消息"
  },
  "zh-CN": {
    "input-header": "配置",
    "secret-key": "密钥",
    "secret-key-placeholder": "输入您的密钥",
    "algorithm": "算法",
    "message-header": "消息"
  },
  "zh-TW": {
    "input-header": "設定",
    "secret-key": "密鑰",
    "secret-key-placeholder": "輸入您的密鑰",
    "algorithm": "演算法",
    "message-header": "訊息"
  },
  "zh-HK": {
    "input-header": "設定",
    "secret-key": "密鑰",
    "secret-key-placeholder": "輸入您的密鑰",
    "algorithm": "演算法",
    "message-header": "訊息"
  },
  "es": {
    "input-header": "Configuración",
    "secret-key": "Clave Secreta",
    "secret-key-placeholder": "Ingrese su clave secreta",
    "algorithm": "Algoritmo",
    "message-header": "Mensaje"
  },
  "fr": {
    "input-header": "Configuration",
    "secret-key": "Clé Secrète",
    "secret-key-placeholder": "Entrez votre clé secrète",
    "algorithm": "Algorithme",
    "message-header": "Message"
  },
  "de": {
    "input-header": "Konfiguration",
    "secret-key": "Geheimer Schlüssel",
    "secret-key-placeholder": "Geben Sie Ihren geheimen Schlüssel ein",
    "algorithm": "Algorithmus",
    "message-header": "Nachricht"
  },
  "it": {
    "input-header": "Configurazione",
    "secret-key": "Chiave Segreta",
    "secret-key-placeholder": "Inserisci la tua chiave segreta",
    "algorithm": "Algoritmo",
    "message-header": "Messaggio"
  },
  "ja": {
    "input-header": "設定",
    "secret-key": "秘密鍵",
    "secret-key-placeholder": "秘密鍵を入力してください",
    "algorithm": "アルゴリズム",
    "message-header": "メッセージ"
  },
  "ko": {
    "input-header": "구성",
    "secret-key": "비밀 키",
    "secret-key-placeholder": "비밀 키를 입력하세요",
    "algorithm": "알고리즘",
    "message-header": "메시지"
  },
  "ru": {
    "input-header": "Конфигурация",
    "secret-key": "Секретный ключ",
    "secret-key-placeholder": "Введите ваш секретный ключ",
    "algorithm": "Алгоритм",
    "message-header": "Сообщение"
  },
  "pt": {
    "input-header": "Configuração",
    "secret-key": "Chave Secreta",
    "secret-key-placeholder": "Digite sua chave secreta",
    "algorithm": "Algoritmo",
    "message-header": "Mensagem"
  },
  "ar": {
    "input-header": "التكوين",
    "secret-key": "المفتاح السري",
    "secret-key-placeholder": "أدخل مفتاحك السري",
    "algorithm": "الخوارزمية",
    "message-header": "الرسالة"
  },
  "hi": {
    "input-header": "कॉन्फ़िगरेशन",
    "secret-key": "गुप्त कुंजी",
    "secret-key-placeholder": "अपनी गुप्त कुंजी दर्ज करें",
    "algorithm": "एल्गोरिदम",
    "message-header": "संदेश"
  },
  "tr": {
    "input-header": "Yapılandırma",
    "secret-key": "Gizli Anahtar",
    "secret-key-placeholder": "Gizli anahtarınızı girin",
    "algorithm": "Algoritma",
    "message-header": "Mesaj"
  },
  "nl": {
    "input-header": "Configuratie",
    "secret-key": "Geheime Sleutel",
    "secret-key-placeholder": "Voer uw geheime sleutel in",
    "algorithm": "Algoritme",
    "message-header": "Bericht"
  },
  "sv": {
    "input-header": "Konfiguration",
    "secret-key": "Hemlig Nyckel",
    "secret-key-placeholder": "Ange din hemliga nyckel",
    "algorithm": "Algoritm",
    "message-header": "Meddelande"
  },
  "pl": {
    "input-header": "Konfiguracja",
    "secret-key": "Klucz Tajny",
    "secret-key-placeholder": "Wprowadź swój klucz tajny",
    "algorithm": "Algorytm",
    "message-header": "Wiadomość"
  },
  "vi": {
    "input-header": "Cấu hình",
    "secret-key": "Khóa Bí mật",
    "secret-key-placeholder": "Nhập khóa bí mật của bạn",
    "algorithm": "Thuật toán",
    "message-header": "Tin nhắn"
  },
  "th": {
    "input-header": "การกำหนดค่า",
    "secret-key": "คีย์ลับ",
    "secret-key-placeholder": "ป้อนคีย์ลับของคุณ",
    "algorithm": "อัลกอริทึม",
    "message-header": "ข้อความ"
  },
  "id": {
    "input-header": "Konfigurasi",
    "secret-key": "Kunci Rahasia",
    "secret-key-placeholder": "Masukkan kunci rahasia Anda",
    "algorithm": "Algoritma",
    "message-header": "Pesan"
  },
  "he": {
    "input-header": "תצורה",
    "secret-key": "מפתח סודי",
    "secret-key-placeholder": "הזן את המפתח הסודי שלך",
    "algorithm": "אלגוריתם",
    "message-header": "הודעה"
  },
  "ms": {
    "input-header": "Konfigurasi",
    "secret-key": "Kunci Rahsia",
    "secret-key-placeholder": "Masukkan kunci rahsia anda",
    "algorithm": "Algoritma",
    "message-header": "Mesej"
  },
  "no": {
    "input-header": "Konfigurasjon",
    "secret-key": "Hemmelig Nøkkel",
    "secret-key-placeholder": "Skriv inn din hemmelige nøkkel",
    "algorithm": "Algoritme",
    "message-header": "Melding"
  }
}
</i18n>
