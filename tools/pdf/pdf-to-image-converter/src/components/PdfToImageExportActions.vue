<template>
  <n-flex :size="8" wrap>
    <n-button
      tag="a"
      type="primary"
      :disabled="!hasCurrentImage || !currentDownloadUrl || isRendering"
      :href="currentDownloadUrl ?? undefined"
      :download="currentDownloadName"
    >
      <template #icon>
        <n-icon><ArrowDownload24Regular /></n-icon>
      </template>
      {{ t('downloadCurrent') }}
    </n-button>

    <n-button
      type="primary"
      secondary
      :disabled="!numPages || isExporting"
      :loading="isExporting"
      @click="emit('export-all')"
    >
      <template #icon>
        <n-icon><Archive24Regular /></n-icon>
      </template>
      {{ t('exportAll') }}
    </n-button>

    <n-button
      v-if="zipDownloadUrl"
      tag="a"
      secondary
      :href="zipDownloadUrl"
      :download="zipDownloadName"
    >
      <template #icon>
        <n-icon><ArrowDownload24Regular /></n-icon>
      </template>
      {{ t('downloadZip') }}
    </n-button>
  </n-flex>

  <n-text depth="3">
    {{ exportStatusText }}
  </n-text>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NFlex, NIcon, NText } from 'naive-ui'
import ArrowDownload24Regular from '@vicons/fluent/ArrowDownload24Regular'
import Archive24Regular from '@vicons/fluent/Archive24Regular'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  numPages: number
  hasCurrentImage: boolean
  isRendering: boolean
  isExporting: boolean
  exportProgress: number
  currentDownloadUrl: string | null
  currentDownloadName: string
  zipDownloadUrl: string | null
  zipDownloadName: string
}>()

const emit = defineEmits<{
  (event: 'export-all'): void
}>()

const { t } = useI18n({ useScope: 'local' })

const exportStatusText = computed(() => {
  if (props.isExporting) {
    return t('exporting', {
      current: props.exportProgress,
      total: props.numPages,
    })
  }

  return t('exportHint')
})
</script>

<i18n lang="json">
{
  "en": {
    "downloadCurrent": "Download Current Page",
    "exportAll": "Export All Pages (ZIP)",
    "downloadZip": "Download ZIP",
    "exportHint": "Select your settings, preview the page, then export one page or all pages.",
    "exporting": "Exporting pages {current}/{total}..."
  },
  "zh": {
    "downloadCurrent": "下载当前页面",
    "exportAll": "导出全部页面（ZIP）",
    "downloadZip": "下载 ZIP",
    "exportHint": "先选择导出设置并预览页面，再导出当前页或全部页面。",
    "exporting": "正在导出页面 {current}/{total}..."
  },
  "zh-CN": {
    "downloadCurrent": "下载当前页面",
    "exportAll": "导出全部页面（ZIP）",
    "downloadZip": "下载 ZIP",
    "exportHint": "先选择导出设置并预览页面，再导出当前页或全部页面。",
    "exporting": "正在导出页面 {current}/{total}..."
  },
  "zh-TW": {
    "downloadCurrent": "下載目前頁面",
    "exportAll": "匯出全部頁面（ZIP）",
    "downloadZip": "下載 ZIP",
    "exportHint": "先選擇匯出設定並預覽頁面，再匯出目前頁或全部頁面。",
    "exporting": "正在匯出頁面 {current}/{total}..."
  },
  "zh-HK": {
    "downloadCurrent": "下載目前頁面",
    "exportAll": "匯出全部頁面（ZIP）",
    "downloadZip": "下載 ZIP",
    "exportHint": "先選擇匯出設定並預覽頁面，再匯出目前頁或全部頁面。",
    "exporting": "正在匯出頁面 {current}/{total}..."
  },
  "es": {
    "downloadCurrent": "Descargar página actual",
    "exportAll": "Exportar todas las páginas (ZIP)",
    "downloadZip": "Descargar ZIP",
    "exportHint": "Selecciona la configuración, revisa la vista previa y exporta la página actual o todas.",
    "exporting": "Exportando páginas {current}/{total}..."
  },
  "fr": {
    "downloadCurrent": "Télécharger la page actuelle",
    "exportAll": "Exporter toutes les pages (ZIP)",
    "downloadZip": "Télécharger ZIP",
    "exportHint": "Sélectionnez les options, vérifiez l'aperçu puis exportez la page actuelle ou toutes les pages.",
    "exporting": "Export des pages {current}/{total}..."
  },
  "de": {
    "downloadCurrent": "Aktuelle Seite herunterladen",
    "exportAll": "Alle Seiten exportieren (ZIP)",
    "downloadZip": "ZIP herunterladen",
    "exportHint": "Wählen Sie die Einstellungen, prüfen Sie die Vorschau und exportieren Sie die aktuelle oder alle Seiten.",
    "exporting": "Seiten werden exportiert {current}/{total}..."
  },
  "it": {
    "downloadCurrent": "Scarica pagina corrente",
    "exportAll": "Esporta tutte le pagine (ZIP)",
    "downloadZip": "Scarica ZIP",
    "exportHint": "Seleziona le impostazioni, controlla l'anteprima ed esporta la pagina corrente o tutte le pagine.",
    "exporting": "Esportazione pagine {current}/{total}..."
  },
  "ja": {
    "downloadCurrent": "現在のページをダウンロード",
    "exportAll": "すべてのページをエクスポート（ZIP）",
    "downloadZip": "ZIP をダウンロード",
    "exportHint": "設定を選び、プレビューを確認してから、現在のページまたは全ページをエクスポートします。",
    "exporting": "ページをエクスポート中 {current}/{total}..."
  },
  "ko": {
    "downloadCurrent": "현재 페이지 다운로드",
    "exportAll": "모든 페이지 내보내기 (ZIP)",
    "downloadZip": "ZIP 다운로드",
    "exportHint": "설정을 선택하고 미리보기를 확인한 뒤 현재 페이지 또는 전체 페이지를 내보내세요.",
    "exporting": "페이지 내보내는 중 {current}/{total}..."
  },
  "ru": {
    "downloadCurrent": "Скачать текущую страницу",
    "exportAll": "Экспортировать все страницы (ZIP)",
    "downloadZip": "Скачать ZIP",
    "exportHint": "Выберите настройки, просмотрите превью, затем экспортируйте текущую страницу или все страницы.",
    "exporting": "Экспорт страниц {current}/{total}..."
  },
  "pt": {
    "downloadCurrent": "Baixar página atual",
    "exportAll": "Exportar todas as páginas (ZIP)",
    "downloadZip": "Baixar ZIP",
    "exportHint": "Selecione as configurações, visualize a página e exporte a página atual ou todas as páginas.",
    "exporting": "Exportando páginas {current}/{total}..."
  },
  "ar": {
    "downloadCurrent": "تنزيل الصفحة الحالية",
    "exportAll": "تصدير كل الصفحات (ZIP)",
    "downloadZip": "تنزيل ZIP",
    "exportHint": "اختر الإعدادات، راجع المعاينة، ثم صدّر الصفحة الحالية أو جميع الصفحات.",
    "exporting": "جارٍ تصدير الصفحات {current}/{total}..."
  },
  "hi": {
    "downloadCurrent": "वर्तमान पेज डाउनलोड करें",
    "exportAll": "सभी पेज एक्सपोर्ट करें (ZIP)",
    "downloadZip": "ZIP डाउनलोड करें",
    "exportHint": "सेटिंग चुनें, प्रीव्यू देखें, फिर वर्तमान पेज या सभी पेज एक्सपोर्ट करें।",
    "exporting": "पेज एक्सपोर्ट हो रहे हैं {current}/{total}..."
  },
  "tr": {
    "downloadCurrent": "Geçerli sayfayı indir",
    "exportAll": "Tüm sayfaları dışa aktar (ZIP)",
    "downloadZip": "ZIP indir",
    "exportHint": "Ayarları seçin, önizlemeyi kontrol edin, ardından geçerli sayfayı veya tüm sayfaları dışa aktarın.",
    "exporting": "Sayfalar dışa aktarılıyor {current}/{total}..."
  },
  "nl": {
    "downloadCurrent": "Huidige pagina downloaden",
    "exportAll": "Alle pagina's exporteren (ZIP)",
    "downloadZip": "ZIP downloaden",
    "exportHint": "Kies instellingen, bekijk de preview en exporteer daarna de huidige pagina of alle pagina's.",
    "exporting": "Pagina's worden geëxporteerd {current}/{total}..."
  },
  "sv": {
    "downloadCurrent": "Ladda ner aktuell sida",
    "exportAll": "Exportera alla sidor (ZIP)",
    "downloadZip": "Ladda ner ZIP",
    "exportHint": "Välj inställningar, granska förhandsvisningen och exportera sedan aktuell sida eller alla sidor.",
    "exporting": "Exporterar sidor {current}/{total}..."
  },
  "pl": {
    "downloadCurrent": "Pobierz bieżącą stronę",
    "exportAll": "Eksportuj wszystkie strony (ZIP)",
    "downloadZip": "Pobierz ZIP",
    "exportHint": "Wybierz ustawienia, sprawdź podgląd, a następnie wyeksportuj bieżącą stronę lub wszystkie strony.",
    "exporting": "Eksportowanie stron {current}/{total}..."
  },
  "vi": {
    "downloadCurrent": "Tải trang hiện tại",
    "exportAll": "Xuất tất cả trang (ZIP)",
    "downloadZip": "Tải ZIP",
    "exportHint": "Chọn thiết lập, xem trước trang rồi xuất trang hiện tại hoặc tất cả trang.",
    "exporting": "Đang xuất trang {current}/{total}..."
  },
  "th": {
    "downloadCurrent": "ดาวน์โหลดหน้าปัจจุบัน",
    "exportAll": "ส่งออกทุกหน้า (ZIP)",
    "downloadZip": "ดาวน์โหลด ZIP",
    "exportHint": "เลือกการตั้งค่า ดูตัวอย่างหน้า แล้วส่งออกหน้าปัจจุบันหรือทุกหน้า",
    "exporting": "กำลังส่งออกหน้า {current}/{total}..."
  },
  "id": {
    "downloadCurrent": "Unduh halaman saat ini",
    "exportAll": "Ekspor semua halaman (ZIP)",
    "downloadZip": "Unduh ZIP",
    "exportHint": "Pilih pengaturan, lihat pratinjau, lalu ekspor halaman saat ini atau semua halaman.",
    "exporting": "Mengekspor halaman {current}/{total}..."
  },
  "he": {
    "downloadCurrent": "הורד את הדף הנוכחי",
    "exportAll": "ייצוא כל העמודים (ZIP)",
    "downloadZip": "הורד ZIP",
    "exportHint": "בחר את ההגדרות, בדוק תצוגה מקדימה ולאחר מכן ייצא את הדף הנוכחי או את כל הדפים.",
    "exporting": "מייצא עמודים {current}/{total}..."
  },
  "ms": {
    "downloadCurrent": "Muat turun halaman semasa",
    "exportAll": "Eksport semua halaman (ZIP)",
    "downloadZip": "Muat turun ZIP",
    "exportHint": "Pilih tetapan, semak pratonton, kemudian eksport halaman semasa atau semua halaman.",
    "exporting": "Mengeksport halaman {current}/{total}..."
  },
  "no": {
    "downloadCurrent": "Last ned gjeldende side",
    "exportAll": "Eksporter alle sider (ZIP)",
    "downloadZip": "Last ned ZIP",
    "exportHint": "Velg innstillinger, se forhåndsvisningen, og eksporter deretter gjeldende side eller alle sider.",
    "exporting": "Eksporterer sider {current}/{total}..."
  }
}
</i18n>
