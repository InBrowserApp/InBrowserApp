<template>
  <section>
    <n-text strong class="section-title">{{ t('extensions') }}</n-text>
    <n-descriptions label-placement="left" bordered :column="1">
      <n-descriptions-item v-if="extensions.subjectAlternativeNames" :label="t('subjectAltName')">
        <FieldValue :value="extensions.subjectAlternativeNames" :empty-value="t('notAvailable')" />
      </n-descriptions-item>
      <n-descriptions-item v-if="extensions.keyUsage" :label="t('keyUsage')">
        <FieldValue :value="extensions.keyUsage" :empty-value="t('notAvailable')" />
      </n-descriptions-item>
      <n-descriptions-item v-if="extensions.extendedKeyUsage" :label="t('extendedKeyUsage')">
        <FieldValue :value="extensions.extendedKeyUsage" :empty-value="t('notAvailable')" />
      </n-descriptions-item>
      <n-descriptions-item v-if="extensions.basicConstraints" :label="t('basicConstraints')">
        <FieldValue :value="extensions.basicConstraints" :empty-value="t('notAvailable')" />
      </n-descriptions-item>
      <n-descriptions-item
        v-if="extensions.subjectKeyIdentifier"
        :label="t('subjectKeyIdentifier')"
      >
        <FieldValue :value="extensions.subjectKeyIdentifier" :empty-value="t('notAvailable')" />
      </n-descriptions-item>
      <n-descriptions-item
        v-if="extensions.authorityKeyIdentifier"
        :label="t('authorityKeyIdentifier')"
      >
        <FieldValue :value="extensions.authorityKeyIdentifier" :empty-value="t('notAvailable')" />
      </n-descriptions-item>
    </n-descriptions>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NDescriptions, NDescriptionsItem, NText } from 'naive-ui'
import FieldValue from './FieldValue.vue'
import type { CertificateExtensions } from '../utils/types'

defineProps<{
  extensions: CertificateExtensions
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<style scoped>
.section-title {
  display: block;
  margin-bottom: 8px;
}
</style>

<i18n lang="json">
{
  "en": {
    "extensions": "Extensions",
    "subjectAltName": "Subject Alternative Name",
    "keyUsage": "Key Usage",
    "extendedKeyUsage": "Extended Key Usage",
    "basicConstraints": "Basic Constraints",
    "subjectKeyIdentifier": "Subject Key Identifier",
    "authorityKeyIdentifier": "Authority Key Identifier",
    "notAvailable": "Not available"
  },
  "zh": {
    "extensions": "扩展",
    "subjectAltName": "主题备用名称",
    "keyUsage": "密钥用法",
    "extendedKeyUsage": "扩展密钥用法",
    "basicConstraints": "基本约束",
    "subjectKeyIdentifier": "主题密钥标识符",
    "authorityKeyIdentifier": "颁发者密钥标识符",
    "notAvailable": "不可用"
  },
  "zh-CN": {
    "extensions": "扩展",
    "subjectAltName": "主题备用名称",
    "keyUsage": "密钥用法",
    "extendedKeyUsage": "扩展密钥用法",
    "basicConstraints": "基本约束",
    "subjectKeyIdentifier": "主题密钥标识符",
    "authorityKeyIdentifier": "颁发者密钥标识符",
    "notAvailable": "不可用"
  },
  "zh-TW": {
    "extensions": "擴充",
    "subjectAltName": "主體替代名稱",
    "keyUsage": "金鑰用途",
    "extendedKeyUsage": "擴充金鑰用途",
    "basicConstraints": "基本約束",
    "subjectKeyIdentifier": "主體金鑰識別碼",
    "authorityKeyIdentifier": "簽發者金鑰識別碼",
    "notAvailable": "不可用"
  },
  "zh-HK": {
    "extensions": "擴展",
    "subjectAltName": "主體替代名稱",
    "keyUsage": "金鑰用途",
    "extendedKeyUsage": "擴展金鑰用途",
    "basicConstraints": "基本約束",
    "subjectKeyIdentifier": "主體金鑰識別碼",
    "authorityKeyIdentifier": "簽發者金鑰識別碼",
    "notAvailable": "不可用"
  },
  "es": {
    "extensions": "Extensiones",
    "subjectAltName": "Nombre alternativo del sujeto",
    "keyUsage": "Uso de la clave",
    "extendedKeyUsage": "Uso extendido de la clave",
    "basicConstraints": "Restricciones básicas",
    "subjectKeyIdentifier": "Identificador de clave del sujeto",
    "authorityKeyIdentifier": "Identificador de clave de la autoridad",
    "notAvailable": "No disponible"
  },
  "fr": {
    "extensions": "Extensions",
    "subjectAltName": "Nom alternatif du sujet",
    "keyUsage": "Utilisation de la clé",
    "extendedKeyUsage": "Utilisation étendue de la clé",
    "basicConstraints": "Contraintes de base",
    "subjectKeyIdentifier": "Identifiant de clé du sujet",
    "authorityKeyIdentifier": "Identifiant de clé d'autorité",
    "notAvailable": "Indisponible"
  },
  "de": {
    "extensions": "Erweiterungen",
    "subjectAltName": "Subjekt-Alternativname",
    "keyUsage": "Schlüsselverwendung",
    "extendedKeyUsage": "Erweiterte Schlüsselverwendung",
    "basicConstraints": "Grundlegende Einschränkungen",
    "subjectKeyIdentifier": "Subjektschlüsselkennung",
    "authorityKeyIdentifier": "Ausstellerschlüsselkennung",
    "notAvailable": "Nicht verfügbar"
  },
  "it": {
    "extensions": "Estensioni",
    "subjectAltName": "Nome alternativo del soggetto",
    "keyUsage": "Uso della chiave",
    "extendedKeyUsage": "Uso esteso della chiave",
    "basicConstraints": "Vincoli di base",
    "subjectKeyIdentifier": "Identificatore chiave del soggetto",
    "authorityKeyIdentifier": "Identificatore chiave dell'autorità",
    "notAvailable": "Non disponibile"
  },
  "ja": {
    "extensions": "拡張",
    "subjectAltName": "サブジェクト代替名",
    "keyUsage": "鍵用途",
    "extendedKeyUsage": "拡張鍵用途",
    "basicConstraints": "基本制約",
    "subjectKeyIdentifier": "サブジェクト鍵識別子",
    "authorityKeyIdentifier": "認証局鍵識別子",
    "notAvailable": "利用不可"
  },
  "ko": {
    "extensions": "확장",
    "subjectAltName": "주체 대체 이름",
    "keyUsage": "키 사용",
    "extendedKeyUsage": "확장 키 사용",
    "basicConstraints": "기본 제약",
    "subjectKeyIdentifier": "주체 키 식별자",
    "authorityKeyIdentifier": "발급자 키 식별자",
    "notAvailable": "사용할 수 없음"
  },
  "ru": {
    "extensions": "Расширения",
    "subjectAltName": "Альтернативное имя субъекта",
    "keyUsage": "Назначение ключа",
    "extendedKeyUsage": "Расширенное назначение ключа",
    "basicConstraints": "Основные ограничения",
    "subjectKeyIdentifier": "Идентификатор ключа субъекта",
    "authorityKeyIdentifier": "Идентификатор ключа издателя",
    "notAvailable": "Недоступно"
  },
  "pt": {
    "extensions": "Extensões",
    "subjectAltName": "Nome alternativo do sujeito",
    "keyUsage": "Uso da chave",
    "extendedKeyUsage": "Uso estendido da chave",
    "basicConstraints": "Restrições básicas",
    "subjectKeyIdentifier": "Identificador da chave do sujeito",
    "authorityKeyIdentifier": "Identificador da chave da autoridade",
    "notAvailable": "Indisponível"
  },
  "ar": {
    "extensions": "الامتدادات",
    "subjectAltName": "الاسم البديل للموضوع",
    "keyUsage": "استخدام المفتاح",
    "extendedKeyUsage": "استخدام المفتاح الموسّع",
    "basicConstraints": "القيود الأساسية",
    "subjectKeyIdentifier": "معرّف مفتاح الموضوع",
    "authorityKeyIdentifier": "معرّف مفتاح الجهة المُصدِرة",
    "notAvailable": "غير متاح"
  },
  "hi": {
    "extensions": "विस्तार",
    "subjectAltName": "विषय वैकल्पिक नाम",
    "keyUsage": "कुंजी उपयोग",
    "extendedKeyUsage": "विस्तारित कुंजी उपयोग",
    "basicConstraints": "मूल प्रतिबंध",
    "subjectKeyIdentifier": "विषय कुंजी पहचानकर्ता",
    "authorityKeyIdentifier": "जारीकर्ता कुंजी पहचानकर्ता",
    "notAvailable": "उपलब्ध नहीं"
  },
  "tr": {
    "extensions": "Uzantılar",
    "subjectAltName": "Konu Alternatif Adı",
    "keyUsage": "Anahtar Kullanımı",
    "extendedKeyUsage": "Genişletilmiş Anahtar Kullanımı",
    "basicConstraints": "Temel Kısıtlamalar",
    "subjectKeyIdentifier": "Konu Anahtar Tanımlayıcı",
    "authorityKeyIdentifier": "Düzenleyici Anahtar Tanımlayıcı",
    "notAvailable": "Kullanılamaz"
  },
  "nl": {
    "extensions": "Extensies",
    "subjectAltName": "Alternatieve naam van subject",
    "keyUsage": "Sleutelgebruik",
    "extendedKeyUsage": "Uitgebreid sleutelgebruik",
    "basicConstraints": "Basisbeperkingen",
    "subjectKeyIdentifier": "Subject-sleutelidentificatie",
    "authorityKeyIdentifier": "Uitgever-sleutelidentificatie",
    "notAvailable": "Niet beschikbaar"
  },
  "sv": {
    "extensions": "Tillägg",
    "subjectAltName": "Alternativt namn för subjekt",
    "keyUsage": "Nyckelanvändning",
    "extendedKeyUsage": "Utökad nyckelanvändning",
    "basicConstraints": "Grundläggande begränsningar",
    "subjectKeyIdentifier": "Subjektets nyckelidentifierare",
    "authorityKeyIdentifier": "Utfärdarens nyckelidentifierare",
    "notAvailable": "Ej tillgänglig"
  },
  "pl": {
    "extensions": "Rozszerzenia",
    "subjectAltName": "Alternatywna nazwa podmiotu",
    "keyUsage": "Użycie klucza",
    "extendedKeyUsage": "Rozszerzone użycie klucza",
    "basicConstraints": "Podstawowe ograniczenia",
    "subjectKeyIdentifier": "Identyfikator klucza podmiotu",
    "authorityKeyIdentifier": "Identyfikator klucza wystawcy",
    "notAvailable": "Niedostępne"
  },
  "vi": {
    "extensions": "Phần mở rộng",
    "subjectAltName": "Tên thay thế của chủ thể",
    "keyUsage": "Mục đích sử dụng khóa",
    "extendedKeyUsage": "Mục đích sử dụng khóa mở rộng",
    "basicConstraints": "Ràng buộc cơ bản",
    "subjectKeyIdentifier": "Định danh khóa của chủ thể",
    "authorityKeyIdentifier": "Định danh khóa của cơ quan phát hành",
    "notAvailable": "Không khả dụng"
  },
  "th": {
    "extensions": "ส่วนขยาย",
    "subjectAltName": "ชื่อทางเลือกของผู้ถือ",
    "keyUsage": "การใช้คีย์",
    "extendedKeyUsage": "การใช้คีย์แบบขยาย",
    "basicConstraints": "ข้อจำกัดพื้นฐาน",
    "subjectKeyIdentifier": "ตัวระบุคีย์ของผู้ถือ",
    "authorityKeyIdentifier": "ตัวระบุคีย์ของผู้ออก",
    "notAvailable": "ไม่พร้อมใช้งาน"
  },
  "id": {
    "extensions": "Ekstensi",
    "subjectAltName": "Nama alternatif subjek",
    "keyUsage": "Penggunaan kunci",
    "extendedKeyUsage": "Penggunaan kunci diperluas",
    "basicConstraints": "Batasan dasar",
    "subjectKeyIdentifier": "Pengenal kunci subjek",
    "authorityKeyIdentifier": "Pengenal kunci otoritas",
    "notAvailable": "Tidak tersedia"
  },
  "he": {
    "extensions": "הרחבות",
    "subjectAltName": "שם חלופי של הנושא",
    "keyUsage": "שימוש במפתח",
    "extendedKeyUsage": "שימוש מורחב במפתח",
    "basicConstraints": "הגבלות בסיסיות",
    "subjectKeyIdentifier": "מזהה מפתח הנושא",
    "authorityKeyIdentifier": "מזהה מפתח הרשות",
    "notAvailable": "לא זמין"
  },
  "ms": {
    "extensions": "Sambungan",
    "subjectAltName": "Nama alternatif subjek",
    "keyUsage": "Penggunaan kunci",
    "extendedKeyUsage": "Penggunaan kunci lanjutan",
    "basicConstraints": "Kekangan asas",
    "subjectKeyIdentifier": "Pengenal kunci subjek",
    "authorityKeyIdentifier": "Pengenal kunci pengeluar",
    "notAvailable": "Tidak tersedia"
  },
  "no": {
    "extensions": "Utvidelser",
    "subjectAltName": "Alternativt navn for subjekt",
    "keyUsage": "Nøkkelbruk",
    "extendedKeyUsage": "Utvidet nøkkelbruk",
    "basicConstraints": "Grunnleggende begrensninger",
    "subjectKeyIdentifier": "Subjektets nøkkelidentifikator",
    "authorityKeyIdentifier": "Utsteders nøkkelidentifikator",
    "notAvailable": "Ikke tilgjengelig"
  }
}
</i18n>
