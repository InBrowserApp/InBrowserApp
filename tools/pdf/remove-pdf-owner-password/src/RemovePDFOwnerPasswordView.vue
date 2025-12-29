<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <PDFUpload @upload:file="handlePDFUpload" />
    <WhatIsPDFOwnerPassword />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { useI18n } from 'vue-i18n'
import { PDFUpload } from '@shared/ui/domain/pdf'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import WhatIsPDFOwnerPassword from './WhatIsPDFOwnerPassword.vue'
import { removePDFOwnerPassword } from '@utils/pdf'
import { useMessage } from 'naive-ui'

const message = useMessage()

const { t } = useI18n()

const handlePDFUpload = async (file: File) => {
  const newBlob = await removePDFOwnerPassword(file)
  const url = URL.createObjectURL(newBlob)
  const aTag = document.createElement('a')

  aTag.href = url
  aTag.download = file.name
  aTag.click()
  URL.revokeObjectURL(url)
  aTag.remove()
  message.success(t('success'))
}
</script>

<i18n lang="json">
{
  "en": {
    "success": "PDF owner password removed"
  },
  "zh": {
    "success": "PDF 权限密码已移除"
  },
  "zh-CN": {
    "success": "PDF 权限密码已移除"
  },
  "zh-TW": {
    "success": "PDF 權限密碼已移除"
  },
  "zh-HK": {
    "success": "PDF 權限密碼已移除"
  },
  "es": {
    "success": "Contraseña de propietario eliminada"
  },
  "fr": {
    "success": "Mot de passe propriétaire supprimé"
  },
  "de": {
    "success": "PDF-Besitzerkennwort entfernt"
  },
  "it": {
    "success": "Password proprietario PDF rimossa"
  },
  "ja": {
    "success": "PDFのオーナーパスワードを削除しました"
  },
  "ko": {
    "success": "PDF 소유자 비밀번호가 제거되었습니다"
  },
  "ru": {
    "success": "Пароль владельца PDF удалён"
  },
  "pt": {
    "success": "Senha de proprietário removida"
  },
  "ar": {
    "success": "تمت إزالة كلمة مرور مالك PDF"
  },
  "hi": {
    "success": "PDF ओनर पासवर्ड हटा दिया गया"
  },
  "tr": {
    "success": "PDF sahip parolası kaldırıldı"
  },
  "nl": {
    "success": "PDF-eigenaarwachtwoord verwijderd"
  },
  "sv": {
    "success": "Ägarens PDF-lösenord borttaget"
  },
  "pl": {
    "success": "Hasło właściciela PDF usunięte"
  },
  "vi": {
    "success": "Đã xóa mật khẩu chủ sở hữu PDF"
  },
  "th": {
    "success": "ลบรหัสผ่านเจ้าของ PDF แล้ว"
  },
  "id": {
    "success": "Kata sandi pemilik PDF telah dihapus"
  },
  "he": {
    "success": "הסיסמה של בעל ה-PDF הוסרה"
  },
  "ms": {
    "success": "Kata laluan pemilik PDF telah dialih keluar"
  },
  "no": {
    "success": "PDF-eierpassord fjernet"
  }
}
</i18n>
