<template>
  <section>
    <n-tag size="small" type="info">{{ isCertificate ? t('certificate') : t('publicKey') }}</n-tag>

    <n-text strong class="section-title">{{ t('overview') }}</n-text>
    <n-descriptions label-placement="left" bordered :column="1">
      <n-descriptions-item v-if="isCertificate" :label="t('serialNumber')">
        <FieldValue :value="serialNumber" :empty-value="t('notAvailable')" />
      </n-descriptions-item>
      <n-descriptions-item v-if="isCertificate" :label="t('signatureAlgorithm')">
        <FieldValue :value="signatureAlgorithm" :empty-value="t('notAvailable')" />
      </n-descriptions-item>
      <n-descriptions-item :label="t('keyAlgorithm')">
        <FieldValue :value="keyAlgorithm" :empty-value="t('notAvailable')" />
      </n-descriptions-item>
      <n-descriptions-item :label="t('keySize')">
        <FieldValue :value="keySize" :empty-value="t('notAvailable')" :suffix="t('bits')" />
      </n-descriptions-item>
      <n-descriptions-item :label="t('curve')">
        <FieldValue :value="curve" :empty-value="t('notAvailable')" />
      </n-descriptions-item>
    </n-descriptions>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NDescriptions, NDescriptionsItem, NTag, NText } from 'naive-ui'
import FieldValue from './FieldValue.vue'

defineProps<{
  isCertificate: boolean
  serialNumber?: string
  signatureAlgorithm?: string
  keyAlgorithm?: string
  keySize?: number
  curve?: string
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<style scoped>
.section-title {
  display: block;
  margin: 12px 0 8px;
}
</style>

<i18n lang="json">
{
  "en": {
    "certificate": "Certificate",
    "publicKey": "Public Key",
    "overview": "Overview",
    "serialNumber": "Serial Number",
    "signatureAlgorithm": "Signature Algorithm",
    "keyAlgorithm": "Key Algorithm",
    "keySize": "Key Size",
    "curve": "Curve",
    "notAvailable": "Not available",
    "bits": "bits"
  },
  "zh": {
    "certificate": "证书",
    "publicKey": "公钥",
    "overview": "概览",
    "serialNumber": "序列号",
    "signatureAlgorithm": "签名算法",
    "keyAlgorithm": "密钥算法",
    "keySize": "密钥长度",
    "curve": "曲线",
    "notAvailable": "不可用",
    "bits": "位"
  },
  "zh-CN": {
    "certificate": "证书",
    "publicKey": "公钥",
    "overview": "概览",
    "serialNumber": "序列号",
    "signatureAlgorithm": "签名算法",
    "keyAlgorithm": "密钥算法",
    "keySize": "密钥长度",
    "curve": "曲线",
    "notAvailable": "不可用",
    "bits": "位"
  },
  "zh-TW": {
    "certificate": "憑證",
    "publicKey": "公鑰",
    "overview": "概覽",
    "serialNumber": "序號",
    "signatureAlgorithm": "簽章演算法",
    "keyAlgorithm": "金鑰演算法",
    "keySize": "金鑰長度",
    "curve": "曲線",
    "notAvailable": "不可用",
    "bits": "位元"
  },
  "zh-HK": {
    "certificate": "證書",
    "publicKey": "公鑰",
    "overview": "概覽",
    "serialNumber": "序號",
    "signatureAlgorithm": "簽署演算法",
    "keyAlgorithm": "金鑰演算法",
    "keySize": "金鑰長度",
    "curve": "曲線",
    "notAvailable": "不可用",
    "bits": "位元"
  },
  "es": {
    "certificate": "Certificado",
    "publicKey": "Clave Pública",
    "overview": "Resumen",
    "serialNumber": "Número de serie",
    "signatureAlgorithm": "Algoritmo de firma",
    "keyAlgorithm": "Algoritmo de clave",
    "keySize": "Tamaño de clave",
    "curve": "Curva",
    "notAvailable": "No disponible",
    "bits": "bits"
  },
  "fr": {
    "certificate": "Certificat",
    "publicKey": "Clé Publique",
    "overview": "Aperçu",
    "serialNumber": "Numéro de série",
    "signatureAlgorithm": "Algorithme de signature",
    "keyAlgorithm": "Algorithme de clé",
    "keySize": "Taille de clé",
    "curve": "Courbe",
    "notAvailable": "Indisponible",
    "bits": "bits"
  },
  "de": {
    "certificate": "Zertifikat",
    "publicKey": "Öffentlicher Schlüssel",
    "overview": "Übersicht",
    "serialNumber": "Seriennummer",
    "signatureAlgorithm": "Signaturalgorithmus",
    "keyAlgorithm": "Schlüsselalgorithmus",
    "keySize": "Schlüsselgröße",
    "curve": "Kurve",
    "notAvailable": "Nicht verfügbar",
    "bits": "Bit"
  },
  "it": {
    "certificate": "Certificato",
    "publicKey": "Chiave Pubblica",
    "overview": "Panoramica",
    "serialNumber": "Numero di serie",
    "signatureAlgorithm": "Algoritmo di firma",
    "keyAlgorithm": "Algoritmo della chiave",
    "keySize": "Dimensione chiave",
    "curve": "Curva",
    "notAvailable": "Non disponibile",
    "bits": "bit"
  },
  "ja": {
    "certificate": "証明書",
    "publicKey": "公開鍵",
    "overview": "概要",
    "serialNumber": "シリアル番号",
    "signatureAlgorithm": "署名アルゴリズム",
    "keyAlgorithm": "鍵アルゴリズム",
    "keySize": "キーサイズ",
    "curve": "曲線",
    "notAvailable": "利用不可",
    "bits": "ビット"
  },
  "ko": {
    "certificate": "인증서",
    "publicKey": "공개 키",
    "overview": "개요",
    "serialNumber": "일련 번호",
    "signatureAlgorithm": "서명 알고리즘",
    "keyAlgorithm": "키 알고리즘",
    "keySize": "키 크기",
    "curve": "곡선",
    "notAvailable": "사용할 수 없음",
    "bits": "비트"
  },
  "ru": {
    "certificate": "Сертификат",
    "publicKey": "Открытый Ключ",
    "overview": "Обзор",
    "serialNumber": "Серийный номер",
    "signatureAlgorithm": "Алгоритм подписи",
    "keyAlgorithm": "Алгоритм ключа",
    "keySize": "Размер ключа",
    "curve": "Кривая",
    "notAvailable": "Недоступно",
    "bits": "бит"
  },
  "pt": {
    "certificate": "Certificado",
    "publicKey": "Chave Pública",
    "overview": "Visão geral",
    "serialNumber": "Número de série",
    "signatureAlgorithm": "Algoritmo de assinatura",
    "keyAlgorithm": "Algoritmo da chave",
    "keySize": "Tamanho da chave",
    "curve": "Curva",
    "notAvailable": "Indisponível",
    "bits": "bits"
  },
  "ar": {
    "certificate": "شهادة",
    "publicKey": "المفتاح العام",
    "overview": "نظرة عامة",
    "serialNumber": "الرقم التسلسلي",
    "signatureAlgorithm": "خوارزمية التوقيع",
    "keyAlgorithm": "خوارزمية المفتاح",
    "keySize": "حجم المفتاح",
    "curve": "المنحنى",
    "notAvailable": "غير متاح",
    "bits": "بت"
  },
  "hi": {
    "certificate": "प्रमाणपत्र",
    "publicKey": "सार्वजनिक कुंजी",
    "overview": "सारांश",
    "serialNumber": "क्रमांक",
    "signatureAlgorithm": "हस्ताक्षर एल्गोरिथम",
    "keyAlgorithm": "कुंजी एल्गोरिथम",
    "keySize": "कुंजी का आकार",
    "curve": "वक्र",
    "notAvailable": "उपलब्ध नहीं",
    "bits": "बिट्स"
  },
  "tr": {
    "certificate": "Sertifika",
    "publicKey": "Genel Anahtar",
    "overview": "Genel Bakış",
    "serialNumber": "Seri Numarası",
    "signatureAlgorithm": "İmza Algoritması",
    "keyAlgorithm": "Anahtar Algoritması",
    "keySize": "Anahtar Boyutu",
    "curve": "Eğri",
    "notAvailable": "Kullanılamaz",
    "bits": "bit"
  },
  "nl": {
    "certificate": "Certificaat",
    "publicKey": "Publieke Sleutel",
    "overview": "Overzicht",
    "serialNumber": "Serienummer",
    "signatureAlgorithm": "Handtekeningalgoritme",
    "keyAlgorithm": "Sleutelalgoritme",
    "keySize": "Sleutelgrootte",
    "curve": "Kromme",
    "notAvailable": "Niet beschikbaar",
    "bits": "bits"
  },
  "sv": {
    "certificate": "Certifikat",
    "publicKey": "Publik Nyckel",
    "overview": "Översikt",
    "serialNumber": "Serienummer",
    "signatureAlgorithm": "Signaturalgoritm",
    "keyAlgorithm": "Nyckelalgoritm",
    "keySize": "Nyckelstorlek",
    "curve": "Kurva",
    "notAvailable": "Ej tillgänglig",
    "bits": "bitar"
  },
  "pl": {
    "certificate": "Certyfikat",
    "publicKey": "Klucz Publiczny",
    "overview": "Przegląd",
    "serialNumber": "Numer seryjny",
    "signatureAlgorithm": "Algorytm podpisu",
    "keyAlgorithm": "Algorytm klucza",
    "keySize": "Rozmiar klucza",
    "curve": "Krzywa",
    "notAvailable": "Niedostępne",
    "bits": "bitów"
  },
  "vi": {
    "certificate": "Chứng chỉ",
    "publicKey": "Khóa Công Khai",
    "overview": "Tổng quan",
    "serialNumber": "Số sê-ri",
    "signatureAlgorithm": "Thuật toán chữ ký",
    "keyAlgorithm": "Thuật toán khóa",
    "keySize": "Kích thước khóa",
    "curve": "Đường cong",
    "notAvailable": "Không khả dụng",
    "bits": "bit"
  },
  "th": {
    "certificate": "ใบรับรอง",
    "publicKey": "คีย์สาธารณะ",
    "overview": "ภาพรวม",
    "serialNumber": "หมายเลขซีเรียล",
    "signatureAlgorithm": "อัลกอริทึมลายเซ็น",
    "keyAlgorithm": "อัลกอริทึมของคีย์",
    "keySize": "ขนาดคีย์",
    "curve": "เส้นโค้ง",
    "notAvailable": "ไม่พร้อมใช้งาน",
    "bits": "บิต"
  },
  "id": {
    "certificate": "Sertifikat",
    "publicKey": "Kunci Publik",
    "overview": "Ringkasan",
    "serialNumber": "Nomor seri",
    "signatureAlgorithm": "Algoritma tanda tangan",
    "keyAlgorithm": "Algoritma kunci",
    "keySize": "Ukuran Kunci",
    "curve": "Kurva",
    "notAvailable": "Tidak tersedia",
    "bits": "bit"
  },
  "he": {
    "certificate": "תעודה",
    "publicKey": "מפתח ציבורי",
    "overview": "סקירה",
    "serialNumber": "מספר סידורי",
    "signatureAlgorithm": "אלגוריתם חתימה",
    "keyAlgorithm": "אלגוריתם מפתח",
    "keySize": "גודל מפתח",
    "curve": "עקומה",
    "notAvailable": "לא זמין",
    "bits": "ביט"
  },
  "ms": {
    "certificate": "Sijil",
    "publicKey": "Kunci Awam",
    "overview": "Gambaran keseluruhan",
    "serialNumber": "Nombor siri",
    "signatureAlgorithm": "Algoritma tandatangan",
    "keyAlgorithm": "Algoritma kunci",
    "keySize": "Saiz Kunci",
    "curve": "Lengkung",
    "notAvailable": "Tidak tersedia",
    "bits": "bit"
  },
  "no": {
    "certificate": "Sertifikat",
    "publicKey": "Offentlig Nøkkel",
    "overview": "Oversikt",
    "serialNumber": "Serienummer",
    "signatureAlgorithm": "Signaturalgoritme",
    "keyAlgorithm": "Nøkkelalgoritme",
    "keySize": "Nøkkelstørrelse",
    "curve": "Kurve",
    "notAvailable": "Ikke tilgjengelig",
    "bits": "biter"
  }
}
</i18n>
