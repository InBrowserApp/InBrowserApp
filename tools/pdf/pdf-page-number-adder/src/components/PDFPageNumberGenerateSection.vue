<template>
  <section data-test="generate-section">
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <ToolSection>
      <n-flex vertical :size="12">
        <n-button
          data-test="generate-button"
          type="primary"
          :loading="isGenerating"
          :disabled="!canGenerate"
          @click="emit('generate')"
        >
          {{ isGenerating ? t('generating') : t('generate') }}
        </n-button>

        <n-alert v-if="generateErrorMessage" type="error" :title="generateErrorMessage" />

        <n-flex v-if="hasResult && resultUrl" align="center" justify="space-between" :wrap="false">
          <n-text>{{ t('resultReady') }}</n-text>
          <n-button tag="a" type="primary" :href="resultUrl" :download="resultFilename">
            {{ t('download') }}
          </n-button>
        </n-flex>
      </n-flex>
    </ToolSection>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NAlert, NButton, NFlex, NText } from 'naive-ui'
import { PDF_ERROR } from '../pdf-errors'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const props = defineProps<{
  isGenerating: boolean
  canGenerate: boolean
  generateErrorCode: string
  hasResult: boolean
  resultUrl: string | null
  resultFilename: string
}>()

const emit = defineEmits<{
  (event: 'generate'): void
}>()

const { t } = useI18n({ useScope: 'local' })

const generateErrorMessage = computed(() => {
  if (!props.generateErrorCode) {
    return ''
  }

  if (props.generateErrorCode === PDF_ERROR.WorkerUnsupported) {
    return t('workerUnsupported')
  }

  if (props.generateErrorCode === PDF_ERROR.Encrypted) {
    return t('encryptedError')
  }

  return t('addFailed')
})
</script>

<i18n lang="json">
{
  "en": {
    "title": "Generate Result",
    "generate": "Generate Result",
    "generating": "Generating...",
    "resultReady": "Result ready:",
    "download": "Download",
    "workerUnsupported": "Your browser does not support Web Worker.",
    "encryptedError": "Encrypted PDF detected. Please remove the owner password first.",
    "addFailed": "Failed to generate result file(s)."
  },
  "zh": {
    "title": "生成结果",
    "generate": "生成结果",
    "generating": "生成中...",
    "resultReady": "结果已生成：",
    "download": "下载",
    "workerUnsupported": "当前浏览器不支持 Web Worker。",
    "encryptedError": "检测到加密 PDF，请先移除权限密码。",
    "addFailed": "生成结果文件失败。"
  },
  "zh-CN": {
    "title": "生成结果",
    "generate": "生成结果",
    "generating": "生成中...",
    "resultReady": "结果已生成：",
    "download": "下载",
    "workerUnsupported": "当前浏览器不支持 Web Worker。",
    "encryptedError": "检测到加密 PDF，请先移除权限密码。",
    "addFailed": "生成结果文件失败。"
  },
  "zh-TW": {
    "title": "產生結果",
    "generate": "產生結果",
    "generating": "產生中...",
    "resultReady": "結果已產生：",
    "download": "下載",
    "workerUnsupported": "目前瀏覽器不支援 Web Worker。",
    "encryptedError": "偵測到加密 PDF，請先移除權限密碼。",
    "addFailed": "產生結果檔案失敗。"
  },
  "zh-HK": {
    "title": "產生結果",
    "generate": "產生結果",
    "generating": "產生中...",
    "resultReady": "結果已產生：",
    "download": "下載",
    "workerUnsupported": "目前瀏覽器不支援 Web Worker。",
    "encryptedError": "偵測到加密 PDF，請先移除權限密碼。",
    "addFailed": "產生結果檔案失敗。"
  },
  "es": {
    "title": "Generar resultado",
    "generate": "Generar resultado",
    "generating": "Generando...",
    "resultReady": "Resultado listo:",
    "download": "Descargar",
    "workerUnsupported": "Tu navegador no admite Web Worker.",
    "encryptedError": "Se detectó un PDF cifrado. Quita primero la contraseña de propietario.",
    "addFailed": "No se pudo generar el/los archivo(s) de resultado."
  },
  "fr": {
    "title": "Générer le résultat",
    "generate": "Générer le résultat",
    "generating": "Génération...",
    "resultReady": "Résultat prêt :",
    "download": "Télécharger",
    "workerUnsupported": "Votre navigateur ne prend pas en charge Web Worker.",
    "encryptedError": "PDF chiffré détecté. Supprimez d'abord le mot de passe propriétaire.",
    "addFailed": "Échec de la génération du ou des fichiers de résultat."
  },
  "de": {
    "title": "Ergebnis erzeugen",
    "generate": "Ergebnis erzeugen",
    "generating": "Wird erzeugt...",
    "resultReady": "Ergebnis bereit:",
    "download": "Herunterladen",
    "workerUnsupported": "Ihr Browser unterstützt keinen Web Worker.",
    "encryptedError": "Verschlüsseltes PDF erkannt. Entfernen Sie zuerst das Besitzerpasswort.",
    "addFailed": "Ergebnisdatei(en) konnten nicht erzeugt werden."
  },
  "it": {
    "title": "Genera risultato",
    "generate": "Genera risultato",
    "generating": "Generazione...",
    "resultReady": "Risultato pronto:",
    "download": "Scarica",
    "workerUnsupported": "Il browser non supporta Web Worker.",
    "encryptedError": "Rilevato PDF crittografato. Rimuovi prima la password proprietario.",
    "addFailed": "Impossibile generare i file di risultato."
  },
  "ja": {
    "title": "結果を生成",
    "generate": "結果を生成",
    "generating": "生成中...",
    "resultReady": "結果の準備完了:",
    "download": "ダウンロード",
    "workerUnsupported": "お使いのブラウザは Web Worker をサポートしていません。",
    "encryptedError": "暗号化された PDF が検出されました。先に権限パスワードを解除してください。",
    "addFailed": "結果ファイルの生成に失敗しました。"
  },
  "ko": {
    "title": "결과 생성",
    "generate": "결과 생성",
    "generating": "생성 중...",
    "resultReady": "결과 준비 완료:",
    "download": "다운로드",
    "workerUnsupported": "현재 브라우저는 Web Worker를 지원하지 않습니다.",
    "encryptedError": "암호화된 PDF가 감지되었습니다. 먼저 권한 비밀번호를 제거하세요.",
    "addFailed": "결과 파일 생성에 실패했습니다."
  },
  "ru": {
    "title": "Сгенерировать результат",
    "generate": "Сгенерировать результат",
    "generating": "Генерация...",
    "resultReady": "Результат готов:",
    "download": "Скачать",
    "workerUnsupported": "Ваш браузер не поддерживает Web Worker.",
    "encryptedError": "Обнаружен зашифрованный PDF. Сначала удалите пароль владельца.",
    "addFailed": "Не удалось создать файл(ы) результата."
  },
  "pt": {
    "title": "Gerar resultado",
    "generate": "Gerar resultado",
    "generating": "Gerando...",
    "resultReady": "Resultado pronto:",
    "download": "Baixar",
    "workerUnsupported": "Seu navegador não suporta Web Worker.",
    "encryptedError": "PDF criptografado detectado. Remova primeiro a senha do proprietário.",
    "addFailed": "Falha ao gerar arquivo(s) de resultado."
  },
  "ar": {
    "title": "إنشاء النتيجة",
    "generate": "إنشاء النتيجة",
    "generating": "جارٍ الإنشاء...",
    "resultReady": "النتيجة جاهزة:",
    "download": "تنزيل",
    "workerUnsupported": "متصفحك لا يدعم Web Worker.",
    "encryptedError": "تم اكتشاف PDF مشفر. الرجاء إزالة كلمة مرور المالك أولاً.",
    "addFailed": "تعذر إنشاء ملف/ملفات النتيجة."
  },
  "hi": {
    "title": "परिणाम जनरेट करें",
    "generate": "परिणाम जनरेट करें",
    "generating": "जनरेट हो रहा है...",
    "resultReady": "परिणाम तैयार:",
    "download": "डाउनलोड",
    "workerUnsupported": "आपका ब्राउज़र Web Worker सपोर्ट नहीं करता।",
    "encryptedError": "एन्क्रिप्टेड PDF मिला। पहले ओनर पासवर्ड हटाएं।",
    "addFailed": "परिणाम फ़ाइल(ें) बनाने में विफल।"
  },
  "tr": {
    "title": "Sonucu oluştur",
    "generate": "Sonucu oluştur",
    "generating": "Oluşturuluyor...",
    "resultReady": "Sonuç hazır:",
    "download": "İndir",
    "workerUnsupported": "Tarayıcınız Web Worker desteklemiyor.",
    "encryptedError": "Şifreli PDF algılandı. Lütfen önce sahip parolasını kaldırın.",
    "addFailed": "Sonuç dosyası/dosyaları oluşturulamadı."
  },
  "nl": {
    "title": "Resultaat genereren",
    "generate": "Resultaat genereren",
    "generating": "Genereren...",
    "resultReady": "Resultaat gereed:",
    "download": "Downloaden",
    "workerUnsupported": "Je browser ondersteunt geen Web Worker.",
    "encryptedError": "Versleutelde PDF gedetecteerd. Verwijder eerst het eigenaarswachtwoord.",
    "addFailed": "Kon resultaatbestand(en) niet genereren."
  },
  "sv": {
    "title": "Generera resultat",
    "generate": "Generera resultat",
    "generating": "Genererar...",
    "resultReady": "Resultat klart:",
    "download": "Ladda ner",
    "workerUnsupported": "Din webbläsare stöder inte Web Worker.",
    "encryptedError": "Krypterad PDF upptäckt. Ta bort ägarlösenordet först.",
    "addFailed": "Kunde inte generera resultatfil(er)."
  },
  "pl": {
    "title": "Generuj wynik",
    "generate": "Generuj wynik",
    "generating": "Generowanie...",
    "resultReady": "Wynik gotowy:",
    "download": "Pobierz",
    "workerUnsupported": "Twoja przeglądarka nie obsługuje Web Worker.",
    "encryptedError": "Wykryto zaszyfrowany PDF. Najpierw usuń hasło właściciela.",
    "addFailed": "Nie udało się wygenerować pliku(ów) wynikowych."
  },
  "vi": {
    "title": "Tạo kết quả",
    "generate": "Tạo kết quả",
    "generating": "Đang tạo...",
    "resultReady": "Kết quả sẵn sàng:",
    "download": "Tải xuống",
    "workerUnsupported": "Trình duyệt của bạn không hỗ trợ Web Worker.",
    "encryptedError": "Phát hiện PDF được mã hóa. Vui lòng gỡ mật khẩu chủ sở hữu trước.",
    "addFailed": "Không thể tạo tệp kết quả."
  },
  "th": {
    "title": "สร้างผลลัพธ์",
    "generate": "สร้างผลลัพธ์",
    "generating": "กำลังสร้าง...",
    "resultReady": "ผลลัพธ์พร้อมแล้ว:",
    "download": "ดาวน์โหลด",
    "workerUnsupported": "เบราว์เซอร์ของคุณไม่รองรับ Web Worker",
    "encryptedError": "ตรวจพบ PDF ที่เข้ารหัส โปรดลบรหัสผ่านเจ้าของก่อน",
    "addFailed": "ไม่สามารถสร้างไฟล์ผลลัพธ์ได้"
  },
  "id": {
    "title": "Buat hasil",
    "generate": "Buat hasil",
    "generating": "Sedang membuat...",
    "resultReady": "Hasil siap:",
    "download": "Unduh",
    "workerUnsupported": "Browser Anda tidak mendukung Web Worker.",
    "encryptedError": "PDF terenkripsi terdeteksi. Hapus dulu kata sandi pemilik.",
    "addFailed": "Gagal membuat file hasil."
  },
  "he": {
    "title": "צור תוצאה",
    "generate": "צור תוצאה",
    "generating": "יוצר...",
    "resultReady": "התוצאה מוכנה:",
    "download": "הורדה",
    "workerUnsupported": "הדפדפן שלך לא תומך ב-Web Worker.",
    "encryptedError": "זוהה PDF מוצפן. יש להסיר תחילה את סיסמת הבעלים.",
    "addFailed": "יצירת קובץ/קבצי התוצאה נכשלה."
  },
  "ms": {
    "title": "Jana hasil",
    "generate": "Jana hasil",
    "generating": "Sedang menjana...",
    "resultReady": "Hasil sedia:",
    "download": "Muat turun",
    "workerUnsupported": "Pelayar anda tidak menyokong Web Worker.",
    "encryptedError": "PDF disulitkan dikesan. Sila buang kata laluan pemilik dahulu.",
    "addFailed": "Gagal menjana fail hasil."
  },
  "no": {
    "title": "Generer resultat",
    "generate": "Generer resultat",
    "generating": "Genererer...",
    "resultReady": "Resultat klart:",
    "download": "Last ned",
    "workerUnsupported": "Nettleseren din støtter ikke Web Worker.",
    "encryptedError": "Kryptert PDF oppdaget. Fjern eierpassordet først.",
    "addFailed": "Klarte ikke å generere resultatfil(er)."
  }
}
</i18n>
