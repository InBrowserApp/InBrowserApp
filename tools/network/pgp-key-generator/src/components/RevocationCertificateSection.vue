<template>
  <ToolSection>
    <ToolSectionHeader>
      <n-flex align="center" :size="8">
        {{ t('revocationCertificate') }}
        <n-tag size="small" type="warning" :bordered="false">{{ t('storeSafely') }}</n-tag>
      </n-flex>
    </ToolSectionHeader>
    <n-input
      :value="value"
      type="textarea"
      readonly
      :loading="loading"
      :autosize="{ minRows: 2, maxRows: 8 }"
      placeholder=""
      style="font-family: monospace"
    />
    <n-flex :size="8" style="margin-top: 8px">
      <CopyToClipboardButton :text="value" />
      <n-button text tag="a" :href="blobUrl" :download="filename">
        <template #icon>
          <n-icon :component="ArrowDownload16Regular" />
        </template>
        {{ t('download') }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useObjectUrl } from '@vueuse/core'
import { NInput, NFlex, NButton, NIcon, NTag } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
const props = defineProps<{
  value: string
  filename: string
  loading?: boolean
}>()

const { t } = useI18n()

const blob = computed(() => new Blob([props.value], { type: 'text/plain' }))
const blobUrl = useObjectUrl(blob)
</script>

<i18n lang="json">
{
  "en": {
    "revocationCertificate": "Revocation Certificate",
    "storeSafely": "Store safely",
    "download": "Download"
  },
  "zh": {
    "revocationCertificate": "吊销证书",
    "storeSafely": "请安全保存",
    "download": "下载"
  },
  "zh-CN": {
    "revocationCertificate": "吊销证书",
    "storeSafely": "请安全保存",
    "download": "下载"
  },
  "zh-TW": {
    "revocationCertificate": "撤銷憑證",
    "storeSafely": "請安全保存",
    "download": "下載"
  },
  "zh-HK": {
    "revocationCertificate": "撤銷憑證",
    "storeSafely": "請安全保存",
    "download": "下載"
  },
  "es": {
    "revocationCertificate": "Certificado de revocación",
    "storeSafely": "Guárdalo de forma segura",
    "download": "Descargar"
  },
  "fr": {
    "revocationCertificate": "Certificat de révocation",
    "storeSafely": "À conserver en lieu sûr",
    "download": "Télécharger"
  },
  "de": {
    "revocationCertificate": "Widerrufszertifikat",
    "storeSafely": "Sicher aufbewahren",
    "download": "Herunterladen"
  },
  "it": {
    "revocationCertificate": "Certificato di revoca",
    "storeSafely": "Conserva in modo sicuro",
    "download": "Scarica"
  },
  "ja": {
    "revocationCertificate": "失効証明書",
    "storeSafely": "安全に保管",
    "download": "ダウンロード"
  },
  "ko": {
    "revocationCertificate": "폐기 인증서",
    "storeSafely": "안전하게 보관",
    "download": "다운로드"
  },
  "ru": {
    "revocationCertificate": "Сертификат отзыва",
    "storeSafely": "Храните в безопасности",
    "download": "Скачать"
  },
  "pt": {
    "revocationCertificate": "Certificado de revogação",
    "storeSafely": "Guarde com segurança",
    "download": "Baixar"
  },
  "ar": {
    "revocationCertificate": "شهادة الإلغاء",
    "storeSafely": "احفظها بأمان",
    "download": "تحميل"
  },
  "hi": {
    "revocationCertificate": "निरस्तीकरण प्रमाणपत्र",
    "storeSafely": "सुरक्षित रूप से रखें",
    "download": "डाउनलोड"
  },
  "tr": {
    "revocationCertificate": "İptal sertifikası",
    "storeSafely": "Güvenle saklayın",
    "download": "İndir"
  },
  "nl": {
    "revocationCertificate": "Intrekkingscertificaat",
    "storeSafely": "Bewaar veilig",
    "download": "Downloaden"
  },
  "sv": {
    "revocationCertificate": "Återkallelsescertifikat",
    "storeSafely": "Förvara säkert",
    "download": "Ladda ner"
  },
  "pl": {
    "revocationCertificate": "Certyfikat unieważnienia",
    "storeSafely": "Przechowuj bezpiecznie",
    "download": "Pobierz"
  },
  "vi": {
    "revocationCertificate": "Chứng chỉ thu hồi",
    "storeSafely": "Lưu trữ an toàn",
    "download": "Tải xuống"
  },
  "th": {
    "revocationCertificate": "ใบรับรองเพิกถอน",
    "storeSafely": "เก็บไว้อย่างปลอดภัย",
    "download": "ดาวน์โหลด"
  },
  "id": {
    "revocationCertificate": "Sertifikat pencabutan",
    "storeSafely": "Simpan dengan aman",
    "download": "Unduh"
  },
  "he": {
    "revocationCertificate": "תעודת ביטול",
    "storeSafely": "שמור במקום בטוח",
    "download": "הורדה"
  },
  "ms": {
    "revocationCertificate": "Sijil pembatalan",
    "storeSafely": "Simpan dengan selamat",
    "download": "Muat Turun"
  },
  "no": {
    "revocationCertificate": "Tilbakekallingssertifikat",
    "storeSafely": "Oppbevar sikkert",
    "download": "Last ned"
  }
}
</i18n>
