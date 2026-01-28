<template>
  <ToolSectionHeader>{{ t('inputTitle') }}</ToolSectionHeader>
  <ToolSection>
    <TextOrFileInput
      v-model:value="value"
      class="monospace-input"
      :placeholder="t('inputPlaceholder')"
      :status="status"
      :accept="accept"
    />
    <n-text depth="3" class="input-hint">{{ t('inputHint') }}</n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NText } from 'naive-ui'
import { TextOrFileInput } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  status?: 'success' | 'error'
  accept: string
}>()

const value = defineModel<string | File>('value', { required: true })

const { t } = useI18n({ useScope: 'local' })
</script>

<style scoped>
.monospace-input :deep(textarea) {
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
    "inputTitle": "Certificate or Public Key",
    "inputPlaceholder": "Paste PEM/DER content or drop a file...",
    "inputHint": "Supported: X.509 certificates (PEM/DER) and PUBLIC KEY (SPKI). Multiple PEM blocks are supported."
  },
  "zh": {
    "inputTitle": "证书或公钥",
    "inputPlaceholder": "粘贴 PEM/DER 内容或拖放文件...",
    "inputHint": "支持：X.509 证书（PEM/DER）和 PUBLIC KEY（SPKI）。支持多个 PEM 块。"
  },
  "zh-CN": {
    "inputTitle": "证书或公钥",
    "inputPlaceholder": "粘贴 PEM/DER 内容或拖放文件...",
    "inputHint": "支持：X.509 证书（PEM/DER）和 PUBLIC KEY（SPKI）。支持多个 PEM 块。"
  },
  "zh-TW": {
    "inputTitle": "憑證或公鑰",
    "inputPlaceholder": "貼上 PEM/DER 內容或拖放檔案...",
    "inputHint": "支援：X.509 憑證（PEM/DER）與 PUBLIC KEY（SPKI）。支援多個 PEM 區塊。"
  },
  "zh-HK": {
    "inputTitle": "證書或公鑰",
    "inputPlaceholder": "貼上 PEM/DER 內容或拖放檔案...",
    "inputHint": "支援：X.509 證書（PEM/DER）及 PUBLIC KEY（SPKI）。支援多個 PEM 區塊。"
  },
  "es": {
    "inputTitle": "Certificado o clave pública",
    "inputPlaceholder": "Pega contenido PEM/DER o suelta un archivo...",
    "inputHint": "Compatibles: certificados X.509 (PEM/DER) y PUBLIC KEY (SPKI). Se admiten varios bloques PEM."
  },
  "fr": {
    "inputTitle": "Certificat ou clé publique",
    "inputPlaceholder": "Collez du contenu PEM/DER ou déposez un fichier...",
    "inputHint": "Pris en charge : certificats X.509 (PEM/DER) et PUBLIC KEY (SPKI). Plusieurs blocs PEM sont pris en charge."
  },
  "de": {
    "inputTitle": "Zertifikat oder öffentlicher Schlüssel",
    "inputPlaceholder": "PEM/DER-Inhalt einfügen oder Datei ablegen...",
    "inputHint": "Unterstützt: X.509-Zertifikate (PEM/DER) und PUBLIC KEY (SPKI). Mehrere PEM-Blöcke werden unterstützt."
  },
  "it": {
    "inputTitle": "Certificato o chiave pubblica",
    "inputPlaceholder": "Incolla contenuto PEM/DER o trascina un file...",
    "inputHint": "Supporta: certificati X.509 (PEM/DER) e PUBLIC KEY (SPKI). Sono supportati più blocchi PEM."
  },
  "ja": {
    "inputTitle": "証明書または公開鍵",
    "inputPlaceholder": "PEM/DER 内容を貼り付けるかファイルをドロップ...",
    "inputHint": "対応：X.509 証明書（PEM/DER）と PUBLIC KEY（SPKI）。複数の PEM ブロックに対応します。"
  },
  "ko": {
    "inputTitle": "인증서 또는 공개 키",
    "inputPlaceholder": "PEM/DER 내용을 붙여넣거나 파일을 드롭하세요...",
    "inputHint": "지원: X.509 인증서(PEM/DER) 및 PUBLIC KEY(SPKI). 여러 PEM 블록을 지원합니다."
  },
  "ru": {
    "inputTitle": "Сертификат или открытый ключ",
    "inputPlaceholder": "Вставьте содержимое PEM/DER или перетащите файл...",
    "inputHint": "Поддерживаются: сертификаты X.509 (PEM/DER) и PUBLIC KEY (SPKI). Поддерживаются несколько PEM-блоков."
  },
  "pt": {
    "inputTitle": "Certificado ou chave pública",
    "inputPlaceholder": "Cole conteúdo PEM/DER ou solte um arquivo...",
    "inputHint": "Suportado: certificados X.509 (PEM/DER) e PUBLIC KEY (SPKI). Vários blocos PEM são suportados."
  },
  "ar": {
    "inputTitle": "الشهادة أو المفتاح العام",
    "inputPlaceholder": "الصق محتوى PEM/DER أو أسقط ملفًا...",
    "inputHint": "المدعوم: شهادات X.509 (PEM/DER) و PUBLIC KEY (SPKI). يتم دعم كتل PEM متعددة."
  },
  "hi": {
    "inputTitle": "प्रमाणपत्र या सार्वजनिक कुंजी",
    "inputPlaceholder": "PEM/DER सामग्री पेस्ट करें या फ़ाइल ड्रॉप करें...",
    "inputHint": "समर्थित: X.509 प्रमाणपत्र (PEM/DER) और PUBLIC KEY (SPKI)। कई PEM ब्लॉक समर्थित हैं।"
  },
  "tr": {
    "inputTitle": "Sertifika veya genel anahtar",
    "inputPlaceholder": "PEM/DER içeriğini yapıştırın veya dosya bırakın...",
    "inputHint": "Desteklenen: X.509 sertifikaları (PEM/DER) ve PUBLIC KEY (SPKI). Birden fazla PEM bloğu desteklenir."
  },
  "nl": {
    "inputTitle": "Certificaat of publieke sleutel",
    "inputPlaceholder": "Plak PEM/DER-inhoud of sleep een bestand...",
    "inputHint": "Ondersteund: X.509-certificaten (PEM/DER) en PUBLIC KEY (SPKI). Meerdere PEM-blokken worden ondersteund."
  },
  "sv": {
    "inputTitle": "Certifikat eller publik nyckel",
    "inputPlaceholder": "Klistra in PEM/DER-innehåll eller släpp en fil...",
    "inputHint": "Stöds: X.509-certifikat (PEM/DER) och PUBLIC KEY (SPKI). Flera PEM-block stöds."
  },
  "pl": {
    "inputTitle": "Certyfikat lub klucz publiczny",
    "inputPlaceholder": "Wklej zawartość PEM/DER lub upuść plik...",
    "inputHint": "Obsługiwane: certyfikaty X.509 (PEM/DER) i PUBLIC KEY (SPKI). Obsługiwane są wiele bloków PEM."
  },
  "vi": {
    "inputTitle": "Chứng chỉ hoặc khóa công khai",
    "inputPlaceholder": "Dán nội dung PEM/DER hoặc thả tệp...",
    "inputHint": "Hỗ trợ: chứng chỉ X.509 (PEM/DER) và PUBLIC KEY (SPKI). Hỗ trợ nhiều khối PEM."
  },
  "th": {
    "inputTitle": "ใบรับรองหรือกุญแจสาธารณะ",
    "inputPlaceholder": "วางเนื้อหา PEM/DER หรือวางไฟล์...",
    "inputHint": "รองรับ: ใบรับรอง X.509 (PEM/DER) และ PUBLIC KEY (SPKI) รองรับหลายบล็อก PEM"
  },
  "id": {
    "inputTitle": "Sertifikat atau kunci publik",
    "inputPlaceholder": "Tempel konten PEM/DER atau jatuhkan file...",
    "inputHint": "Didukung: sertifikat X.509 (PEM/DER) dan PUBLIC KEY (SPKI). Beberapa blok PEM didukung."
  },
  "he": {
    "inputTitle": "תעודה או מפתח ציבורי",
    "inputPlaceholder": "הדבק תוכן PEM/DER או גרור קובץ...",
    "inputHint": "נתמך: תעודות X.509 (PEM/DER) ו PUBLIC KEY (SPKI). נתמכים מספר בלוקי PEM."
  },
  "ms": {
    "inputTitle": "Sijil atau kunci awam",
    "inputPlaceholder": "Tampal kandungan PEM/DER atau lepaskan fail...",
    "inputHint": "Disokong: sijil X.509 (PEM/DER) dan PUBLIC KEY (SPKI). Berbilang blok PEM disokong."
  },
  "no": {
    "inputTitle": "Sertifikat eller offentlig nøkkel",
    "inputPlaceholder": "Lim inn PEM/DER-innhold eller slipp en fil...",
    "inputHint": "Støttet: X.509-sertifikater (PEM/DER) og PUBLIC KEY (SPKI). Flere PEM-blokker støttes."
  }
}
</i18n>
