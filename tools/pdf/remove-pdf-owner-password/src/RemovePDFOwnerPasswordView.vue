<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <PDFUpload @upload-file="handlePDFUpload" />
    <ToolSection v-if="downloadUrl">
      <n-flex justify="flex-end">
        <n-button
          tag="a"
          type="primary"
          :href="downloadUrl ?? undefined"
          :download="downloadFilename"
        >
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('download-file', { filename: downloadFilename }) }}
        </n-button>
      </n-flex>
    </ToolSection>
    <WhatIsPDFOwnerPassword />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { computed, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NIcon, useMessage } from 'naive-ui'
import { PDFUpload } from '@shared/ui/domain/pdf'
import { ToolDefaultPageLayout, ToolSection } from '@shared/ui/tool'
import WhatIsPDFOwnerPassword from './WhatIsPDFOwnerPassword.vue'
import { removePDFOwnerPassword } from '@utils/pdf'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
const message = useMessage()

const { t } = useI18n()

const downloadBlob = ref<Blob | null>(null)
const downloadName = ref<string>('')
const downloadUrl = useObjectUrl(downloadBlob)
const downloadFilename = computed(() => downloadName.value || 'output.pdf')

const handlePDFUpload = async (file: File) => {
  downloadBlob.value = null
  downloadName.value = ''
  try {
    const newBlob = await removePDFOwnerPassword(file)
    downloadBlob.value = newBlob
    downloadName.value = file.name
    message.success(t('success'))
  } catch (e) {
    message.error((e as Error).message)
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "success": "PDF owner password removed",
    "download-file": "Download {filename}"
  },
  "zh": {
    "success": "PDF 权限密码已移除",
    "download-file": "下载 {filename}"
  },
  "zh-CN": {
    "success": "PDF 权限密码已移除",
    "download-file": "下载 {filename}"
  },
  "zh-TW": {
    "success": "PDF 權限密碼已移除",
    "download-file": "下載 {filename}"
  },
  "zh-HK": {
    "success": "PDF 權限密碼已移除",
    "download-file": "下載 {filename}"
  },
  "es": {
    "success": "Contraseña de propietario eliminada",
    "download-file": "Descargar {filename}"
  },
  "fr": {
    "success": "Mot de passe propriétaire supprimé",
    "download-file": "Télécharger {filename}"
  },
  "de": {
    "success": "PDF-Besitzerkennwort entfernt",
    "download-file": "{filename} herunterladen"
  },
  "it": {
    "success": "Password proprietario PDF rimossa",
    "download-file": "Scarica {filename}"
  },
  "ja": {
    "success": "PDFのオーナーパスワードを削除しました",
    "download-file": "{filename} をダウンロード"
  },
  "ko": {
    "success": "PDF 소유자 비밀번호가 제거되었습니다",
    "download-file": "{filename} 다운로드"
  },
  "ru": {
    "success": "Пароль владельца PDF удалён",
    "download-file": "Скачать {filename}"
  },
  "pt": {
    "success": "Senha de proprietário removida",
    "download-file": "Baixar {filename}"
  },
  "ar": {
    "success": "تمت إزالة كلمة مرور مالك PDF",
    "download-file": "تنزيل {filename}"
  },
  "hi": {
    "success": "PDF ओनर पासवर्ड हटा दिया गया",
    "download-file": "{filename} डाउनलोड करें"
  },
  "tr": {
    "success": "PDF sahip parolası kaldırıldı",
    "download-file": "{filename}'yi indir"
  },
  "nl": {
    "success": "PDF-eigenaarwachtwoord verwijderd",
    "download-file": "{filename} downloaden"
  },
  "sv": {
    "success": "Ägarens PDF-lösenord borttaget",
    "download-file": "Ladda ner {filename}"
  },
  "pl": {
    "success": "Hasło właściciela PDF usunięte",
    "download-file": "Pobierz {filename}"
  },
  "vi": {
    "success": "Đã xóa mật khẩu chủ sở hữu PDF",
    "download-file": "Tải xuống {filename}"
  },
  "th": {
    "success": "ลบรหัสผ่านเจ้าของ PDF แล้ว",
    "download-file": "ดาวน์โหลด {filename}"
  },
  "id": {
    "success": "Kata sandi pemilik PDF telah dihapus",
    "download-file": "Unduh {filename}"
  },
  "he": {
    "success": "הסיסמה של בעל ה-PDF הוסרה",
    "download-file": "הורד {filename}"
  },
  "ms": {
    "success": "Kata laluan pemilik PDF telah dialih keluar",
    "download-file": "Muat turun {filename}"
  },
  "no": {
    "success": "PDF-eierpassord fjernet",
    "download-file": "Last ned {filename}"
  }
}
</i18n>
