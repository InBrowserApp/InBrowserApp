<template>
  <PDFMergeUploader @add-file="handleAddFile" />

  <PDFMergeQueue
    :items="queueItems"
    @reorder="handleReorder"
    @move-up="handleMoveUp"
    @move-down="handleMoveDown"
    @preview="handlePreview"
    @remove="handleRemove"
  />

  <PDFMergeActions
    v-if="items.length > 0"
    v-model:output-name="outputName"
    :items-count="items.length"
    :total-pages="totalPages"
    :can-merge="canMerge"
    :is-merging="isMerging"
    :error-message="mergeErrorMessage"
    :download-url="downloadUrl ?? null"
    :download-filename="downloadFilename"
    @clear="handleClearAll"
    @merge="handleMerge"
  />

  <n-modal :show="Boolean(currentPreviewItem)" @update:show="handlePreviewVisible">
    <n-card
      style="width: min(1024px, 92vw)"
      :title="t('previewTitle', { filename: currentPreviewItem?.name })"
      closable
      @close="handlePreviewVisible(false)"
    >
      <iframe
        v-if="currentPreviewItem"
        :src="currentPreviewItem.previewUrl"
        class="preview-frame"
        :title="currentPreviewItem.name"
      />
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage, NCard, NModal } from 'naive-ui'
import { PDF_ERROR } from '../pdf-errors'
import PDFMergeUploader from './PDFMergeUploader.vue'
import PDFMergeQueue from './PDFMergeQueue.vue'
import PDFMergeActions from './PDFMergeActions.vue'
import { usePdfMerger } from './usePdfMerger'

const { t } = useI18n()
const message = useMessage()

const {
  items,
  queueItems,
  outputName,
  totalPages,
  canMerge,
  isMerging,
  mergeErrorCode,
  downloadUrl,
  downloadFilename,
  currentPreviewItem,
  handleAddFile,
  handleReorder,
  handleMoveUp,
  handleMoveDown,
  handlePreview,
  handleRemove,
  handleClearAll,
  handleMerge: handleMergeFiles,
  handlePreviewVisible,
} = usePdfMerger()

const resolveErrorMessage = (errorCode: string): string => {
  if (errorCode === PDF_ERROR.Encrypted) {
    return t('errorEncrypted')
  }

  if (errorCode === PDF_ERROR.Invalid) {
    return t('errorInvalid')
  }

  if (errorCode === PDF_ERROR.WorkerUnsupported) {
    return t('errorWorkerUnsupported')
  }

  return t('errorMergeFailed')
}

const mergeErrorMessage = computed(() => {
  if (!mergeErrorCode.value) {
    return ''
  }

  return resolveErrorMessage(mergeErrorCode.value)
})

const handleMerge = async (): Promise<void> => {
  const result = await handleMergeFiles()

  if (result.success) {
    message.success(t('mergeSuccess'))
    return
  }

  if (result.errorCode) {
    message.error(resolveErrorMessage(result.errorCode))
  }
}
</script>

<style scoped>
.preview-frame {
  width: 100%;
  height: min(72vh, 900px);
  border: 0;
  border-radius: 8px;
}
</style>

<i18n lang="json">
{
  "en": {
    "previewTitle": "Preview: {filename}",
    "mergeSuccess": "PDF files merged successfully",
    "errorEncrypted": "Encrypted PDF detected. Remove owner password first.",
    "errorInvalid": "One or more files are not valid PDF files.",
    "errorWorkerUnsupported": "Your browser does not support Web Worker.",
    "errorMergeFailed": "Failed to merge PDF files."
  },
  "zh": {
    "previewTitle": "预览：{filename}",
    "mergeSuccess": "PDF 文件合并成功",
    "errorEncrypted": "检测到加密 PDF，请先移除权限密码。",
    "errorInvalid": "存在无效的 PDF 文件。",
    "errorWorkerUnsupported": "当前浏览器不支持 Web Worker。",
    "errorMergeFailed": "PDF 合并失败。"
  },
  "zh-CN": {
    "previewTitle": "预览：{filename}",
    "mergeSuccess": "PDF 文件合并成功",
    "errorEncrypted": "检测到加密 PDF，请先移除权限密码。",
    "errorInvalid": "存在无效的 PDF 文件。",
    "errorWorkerUnsupported": "当前浏览器不支持 Web Worker。",
    "errorMergeFailed": "PDF 合并失败。"
  },
  "zh-TW": {
    "previewTitle": "預覽：{filename}",
    "mergeSuccess": "PDF 檔案合併成功",
    "errorEncrypted": "偵測到加密 PDF，請先移除權限密碼。",
    "errorInvalid": "存在無效的 PDF 檔案。",
    "errorWorkerUnsupported": "目前瀏覽器不支援 Web Worker。",
    "errorMergeFailed": "PDF 合併失敗。"
  },
  "zh-HK": {
    "previewTitle": "預覽：{filename}",
    "mergeSuccess": "PDF 檔案合併成功",
    "errorEncrypted": "偵測到加密 PDF，請先移除權限密碼。",
    "errorInvalid": "存在無效的 PDF 檔案。",
    "errorWorkerUnsupported": "目前瀏覽器不支援 Web Worker。",
    "errorMergeFailed": "PDF 合併失敗。"
  },
  "es": {
    "previewTitle": "Vista previa: {filename}",
    "mergeSuccess": "Los PDF se combinaron correctamente",
    "errorEncrypted": "Se detectó PDF cifrado. Quita la contraseña primero.",
    "errorInvalid": "Uno o más archivos no son PDF válidos.",
    "errorWorkerUnsupported": "Tu navegador no admite Web Worker.",
    "errorMergeFailed": "No se pudieron combinar los PDF."
  },
  "fr": {
    "previewTitle": "Aperçu : {filename}",
    "mergeSuccess": "Les fichiers PDF ont été fusionnés",
    "errorEncrypted": "PDF chiffré détecté. Supprimez d'abord le mot de passe.",
    "errorInvalid": "Un ou plusieurs fichiers ne sont pas des PDF valides.",
    "errorWorkerUnsupported": "Votre navigateur ne prend pas en charge Web Worker.",
    "errorMergeFailed": "Échec de la fusion des PDF."
  },
  "de": {
    "previewTitle": "Vorschau: {filename}",
    "mergeSuccess": "PDF-Dateien wurden erfolgreich zusammengeführt",
    "errorEncrypted": "Verschlüsseltes PDF erkannt. Entferne zuerst das Passwort.",
    "errorInvalid": "Eine oder mehrere Dateien sind keine gültigen PDFs.",
    "errorWorkerUnsupported": "Ihr Browser unterstützt keinen Web Worker.",
    "errorMergeFailed": "PDF-Zusammenführung fehlgeschlagen."
  },
  "it": {
    "previewTitle": "Anteprima: {filename}",
    "mergeSuccess": "File PDF uniti con successo",
    "errorEncrypted": "Rilevato PDF crittografato. Rimuovi prima la password.",
    "errorInvalid": "Uno o più file non sono PDF validi.",
    "errorWorkerUnsupported": "Il browser non supporta Web Worker.",
    "errorMergeFailed": "Unione PDF non riuscita."
  },
  "ja": {
    "previewTitle": "プレビュー: {filename}",
    "mergeSuccess": "PDF の結合が完了しました",
    "errorEncrypted": "暗号化された PDF が含まれています。先に解除してください。",
    "errorInvalid": "有効でない PDF ファイルが含まれています。",
    "errorWorkerUnsupported": "お使いのブラウザは Web Worker をサポートしていません。",
    "errorMergeFailed": "PDF の結合に失敗しました。"
  },
  "ko": {
    "previewTitle": "미리보기: {filename}",
    "mergeSuccess": "PDF 파일 병합이 완료되었습니다",
    "errorEncrypted": "암호화된 PDF가 감지되었습니다. 먼저 암호를 제거하세요.",
    "errorInvalid": "유효하지 않은 PDF 파일이 있습니다.",
    "errorWorkerUnsupported": "현재 브라우저는 Web Worker를 지원하지 않습니다.",
    "errorMergeFailed": "PDF 병합에 실패했습니다."
  },
  "ru": {
    "previewTitle": "Предпросмотр: {filename}",
    "mergeSuccess": "PDF-файлы успешно объединены",
    "errorEncrypted": "Обнаружен зашифрованный PDF. Сначала удалите пароль.",
    "errorInvalid": "Один или несколько файлов не являются корректными PDF.",
    "errorWorkerUnsupported": "Ваш браузер не поддерживает Web Worker.",
    "errorMergeFailed": "Не удалось объединить PDF-файлы."
  },
  "pt": {
    "previewTitle": "Visualização: {filename}",
    "mergeSuccess": "Arquivos PDF mesclados com sucesso",
    "errorEncrypted": "PDF criptografado detectado. Remova a senha primeiro.",
    "errorInvalid": "Um ou mais arquivos não são PDFs válidos.",
    "errorWorkerUnsupported": "Seu navegador não suporta Web Worker.",
    "errorMergeFailed": "Falha ao mesclar arquivos PDF."
  },
  "ar": {
    "previewTitle": "معاينة: {filename}",
    "mergeSuccess": "تم دمج ملفات PDF بنجاح",
    "errorEncrypted": "تم اكتشاف PDF مشفر. أزل كلمة المرور أولاً.",
    "errorInvalid": "يوجد ملف PDF غير صالح واحد أو أكثر.",
    "errorWorkerUnsupported": "متصفحك لا يدعم Web Worker.",
    "errorMergeFailed": "فشل دمج ملفات PDF."
  },
  "hi": {
    "previewTitle": "प्रीव्यू: {filename}",
    "mergeSuccess": "PDF फाइलें सफलतापूर्वक मर्ज हो गईं",
    "errorEncrypted": "एन्क्रिप्टेड PDF मिला। पहले पासवर्ड हटाएं।",
    "errorInvalid": "एक या अधिक फाइलें वैध PDF नहीं हैं।",
    "errorWorkerUnsupported": "आपका ब्राउज़र Web Worker सपोर्ट नहीं करता।",
    "errorMergeFailed": "PDF मर्ज नहीं हो पाया।"
  },
  "tr": {
    "previewTitle": "Önizleme: {filename}",
    "mergeSuccess": "PDF dosyaları başarıyla birleştirildi",
    "errorEncrypted": "Şifreli PDF algılandı. Önce şifreyi kaldırın.",
    "errorInvalid": "Bir veya daha fazla dosya geçerli PDF değil.",
    "errorWorkerUnsupported": "Tarayıcınız Web Worker desteklemiyor.",
    "errorMergeFailed": "PDF dosyaları birleştirilemedi."
  },
  "nl": {
    "previewTitle": "Voorbeeld: {filename}",
    "mergeSuccess": "PDF-bestanden zijn samengevoegd",
    "errorEncrypted": "Versleutelde PDF gevonden. Verwijder eerst het wachtwoord.",
    "errorInvalid": "Een of meer bestanden zijn geen geldige PDF's.",
    "errorWorkerUnsupported": "Je browser ondersteunt geen Web Worker.",
    "errorMergeFailed": "PDF-bestanden samenvoegen is mislukt."
  },
  "sv": {
    "previewTitle": "Förhandsvisning: {filename}",
    "mergeSuccess": "PDF-filer har slagits ihop",
    "errorEncrypted": "Krypterad PDF upptäcktes. Ta bort lösenord först.",
    "errorInvalid": "En eller flera filer är inte giltiga PDF-filer.",
    "errorWorkerUnsupported": "Din webbläsare stöder inte Web Worker.",
    "errorMergeFailed": "Det gick inte att slå ihop PDF-filer."
  },
  "pl": {
    "previewTitle": "Podgląd: {filename}",
    "mergeSuccess": "Pliki PDF zostały scalone",
    "errorEncrypted": "Wykryto zaszyfrowany PDF. Najpierw usuń hasło.",
    "errorInvalid": "Co najmniej jeden plik nie jest poprawnym PDF.",
    "errorWorkerUnsupported": "Twoja przeglądarka nie obsługuje Web Worker.",
    "errorMergeFailed": "Nie udało się scalić plików PDF."
  },
  "vi": {
    "previewTitle": "Xem trước: {filename}",
    "mergeSuccess": "Đã gộp tệp PDF thành công",
    "errorEncrypted": "Phát hiện PDF được mã hóa. Hãy gỡ mật khẩu trước.",
    "errorInvalid": "Một hoặc nhiều tệp không phải PDF hợp lệ.",
    "errorWorkerUnsupported": "Trình duyệt của bạn không hỗ trợ Web Worker.",
    "errorMergeFailed": "Gộp PDF thất bại."
  },
  "th": {
    "previewTitle": "พรีวิว: {filename}",
    "mergeSuccess": "รวมไฟล์ PDF สำเร็จ",
    "errorEncrypted": "พบไฟล์ PDF เข้ารหัส โปรดลบรหัสผ่านก่อน",
    "errorInvalid": "มีไฟล์ PDF ที่ไม่ถูกต้องอย่างน้อยหนึ่งไฟล์",
    "errorWorkerUnsupported": "เบราว์เซอร์ของคุณไม่รองรับ Web Worker",
    "errorMergeFailed": "รวมไฟล์ PDF ไม่สำเร็จ"
  },
  "id": {
    "previewTitle": "Pratinjau: {filename}",
    "mergeSuccess": "File PDF berhasil digabung",
    "errorEncrypted": "PDF terenkripsi terdeteksi. Hapus kata sandi dulu.",
    "errorInvalid": "Satu atau lebih file bukan PDF valid.",
    "errorWorkerUnsupported": "Browser Anda tidak mendukung Web Worker.",
    "errorMergeFailed": "Gagal menggabungkan file PDF."
  },
  "he": {
    "previewTitle": "תצוגה מקדימה: {filename}",
    "mergeSuccess": "קובצי PDF מוזגו בהצלחה",
    "errorEncrypted": "זוהה PDF מוצפן. הסר קודם את הסיסמה.",
    "errorInvalid": "קובץ אחד או יותר אינם PDF תקין.",
    "errorWorkerUnsupported": "הדפדפן שלך לא תומך ב-Web Worker.",
    "errorMergeFailed": "מיזוג קובצי PDF נכשל."
  },
  "ms": {
    "previewTitle": "Pratonton: {filename}",
    "mergeSuccess": "Fail PDF berjaya digabungkan",
    "errorEncrypted": "PDF disulitkan dikesan. Buang kata laluan dahulu.",
    "errorInvalid": "Satu atau lebih fail bukan PDF yang sah.",
    "errorWorkerUnsupported": "Pelayar anda tidak menyokong Web Worker.",
    "errorMergeFailed": "Gagal menggabungkan fail PDF."
  },
  "no": {
    "previewTitle": "Forhåndsvisning: {filename}",
    "mergeSuccess": "PDF-filer ble slått sammen",
    "errorEncrypted": "Kryptert PDF oppdaget. Fjern passord først.",
    "errorInvalid": "En eller flere filer er ikke gyldige PDF-filer.",
    "errorWorkerUnsupported": "Nettleseren din støtter ikke Web Worker.",
    "errorMergeFailed": "Klarte ikke å slå sammen PDF-filer."
  }
}
</i18n>
