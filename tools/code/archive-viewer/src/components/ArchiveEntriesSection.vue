<template>
  <ToolSection v-if="isParsing">
    <n-flex align="center" :size="8">
      <n-spin size="small" />
      <n-text>{{ t('parsing-archive') }}</n-text>
    </n-flex>
  </ToolSection>

  <ToolSection v-if="hasArchive && !isParsing && !hasError">
    <ToolSectionHeader>{{ t('entries-title') }}</ToolSectionHeader>
    <n-flex vertical :size="12">
      <n-flex justify="space-between" align="center" :size="10">
        <n-flex align="center" :size="10">
          <n-breadcrumb>
            <n-breadcrumb-item
              v-for="breadcrumb in displayBreadcrumbs"
              :key="breadcrumb.path || 'root'"
              @click="emit('go-to-directory', breadcrumb.path)"
            >
              {{ breadcrumb.label }}
            </n-breadcrumb-item>
          </n-breadcrumb>

          <n-button
            v-if="canGoToParentDirectory"
            size="small"
            circle
            quaternary
            :aria-label="t('go-to-parent')"
            @click="emit('go-to-parent-directory')"
          >
            <template #icon>
              <n-icon :component="ArrowUp16Regular" />
            </template>
          </n-button>
        </n-flex>

        <n-button
          text
          :loading="isExportingAll"
          :disabled="!canExportAllEntries"
          @click="emit('export-all-entries')"
        >
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ exportActionLabel }}
        </n-button>
      </n-flex>

      <n-input
        :value="search"
        clearable
        :placeholder="t('search-placeholder')"
        @update:value="handleSearchChange"
      />

      <template v-if="rows.length">
        <ArchiveEntriesTable :rows="rows" :table-row-props="tableRowProps" />
      </template>
      <template v-else>
        <n-empty :description="t('empty-folder')" />
      </template>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NBreadcrumb,
  NBreadcrumbItem,
  NButton,
  NEmpty,
  NFlex,
  NIcon,
  NInput,
  NSpin,
  NText,
} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import ArrowUp16Regular from '@vicons/fluent/ArrowUp16Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ArchiveEntriesTable from './ArchiveEntriesTable.vue'
import type { ArchiveBreadcrumb, ArchiveRow } from './use-archive-viewer'

const props = defineProps<{
  isParsing: boolean
  hasArchive: boolean
  hasError: boolean
  breadcrumbs: ArchiveBreadcrumb[]
  canGoToParentDirectory: boolean
  isExportingAll: boolean
  exportProgressPercent: number
  canExportAllEntries: boolean
  search: string
  rows: ArchiveRow[]
  tableRowProps: (row: ArchiveRow) => { style: string; onClick: () => void }
}>()

const emit = defineEmits<{
  (event: 'go-to-directory', path: string): void
  (event: 'go-to-parent-directory'): void
  (event: 'export-all-entries'): void
  (event: 'update:search', value: string): void
}>()

const { t } = useI18n()

const displayBreadcrumbs = computed(() => [
  { label: t('root-folder'), path: '' },
  ...props.breadcrumbs.map((breadcrumb) => ({
    label: breadcrumb.name,
    path: breadcrumb.path,
  })),
])

const exportActionLabel = computed(() => {
  if (!props.isExportingAll) {
    return t('export-all-entries')
  }

  return `${t('exporting-all-entries')} ${props.exportProgressPercent}%`
})

function handleSearchChange(value: string) {
  emit('update:search', value)
}
</script>

<i18n lang="json">
{
  "en": {
    "parsing-archive": "Parsing archive entries...",
    "entries-title": "Archive explorer",
    "export-all-entries": "Export all to folder",
    "exporting-all-entries": "Exporting",
    "search-placeholder": "Search in current folder",
    "root-folder": "Root",
    "go-to-parent": "Up",
    "empty-folder": "This folder is empty."
  },
  "zh": {
    "parsing-archive": "正在解析压缩包条目...",
    "entries-title": "压缩包浏览器",
    "export-all-entries": "导出全部到文件夹",
    "exporting-all-entries": "导出中",
    "search-placeholder": "在当前目录中搜索",
    "root-folder": "根目录",
    "go-to-parent": "上一级",
    "empty-folder": "此文件夹为空。"
  },
  "zh-CN": {
    "parsing-archive": "正在解析压缩包条目...",
    "entries-title": "压缩包浏览器",
    "export-all-entries": "导出全部到文件夹",
    "exporting-all-entries": "导出中",
    "search-placeholder": "在当前目录中搜索",
    "root-folder": "根目录",
    "go-to-parent": "上一级",
    "empty-folder": "此文件夹为空。"
  },
  "zh-TW": {
    "parsing-archive": "正在解析壓縮檔內容...",
    "entries-title": "壓縮檔瀏覽器",
    "export-all-entries": "匯出全部到資料夾",
    "exporting-all-entries": "匯出中",
    "search-placeholder": "在目前資料夾中搜尋",
    "root-folder": "根目錄",
    "go-to-parent": "上一層",
    "empty-folder": "此資料夾為空。"
  },
  "zh-HK": {
    "parsing-archive": "正在解析壓縮檔內容...",
    "entries-title": "壓縮檔瀏覽器",
    "export-all-entries": "匯出全部到資料夾",
    "exporting-all-entries": "匯出中",
    "search-placeholder": "在目前資料夾中搜尋",
    "root-folder": "根目錄",
    "go-to-parent": "上一層",
    "empty-folder": "此資料夾為空。"
  },
  "es": {
    "parsing-archive": "Analizando entradas del archivo...",
    "entries-title": "Explorador de archivos comprimidos",
    "export-all-entries": "Exportar todo a carpeta",
    "exporting-all-entries": "Exportando",
    "search-placeholder": "Buscar en la carpeta actual",
    "root-folder": "Raíz",
    "go-to-parent": "Subir",
    "empty-folder": "Esta carpeta está vacía."
  },
  "fr": {
    "parsing-archive": "Analyse des entrées de l’archive...",
    "entries-title": "Explorateur d’archives",
    "export-all-entries": "Tout exporter vers un dossier",
    "exporting-all-entries": "Exportation",
    "search-placeholder": "Rechercher dans le dossier actuel",
    "root-folder": "Racine",
    "go-to-parent": "Monter",
    "empty-folder": "Ce dossier est vide."
  },
  "de": {
    "parsing-archive": "Archiveinträge werden analysiert...",
    "entries-title": "Archiv-Explorer",
    "export-all-entries": "Alles in Ordner exportieren",
    "exporting-all-entries": "Export läuft",
    "search-placeholder": "Im aktuellen Ordner suchen",
    "root-folder": "Wurzel",
    "go-to-parent": "Nach oben",
    "empty-folder": "Dieser Ordner ist leer."
  },
  "it": {
    "parsing-archive": "Analisi delle voci dell’archivio...",
    "entries-title": "Esplora archivio",
    "export-all-entries": "Esporta tutto nella cartella",
    "exporting-all-entries": "Esportazione",
    "search-placeholder": "Cerca nella cartella corrente",
    "root-folder": "Radice",
    "go-to-parent": "Su",
    "empty-folder": "Questa cartella è vuota."
  },
  "pt": {
    "parsing-archive": "Analisando entradas do arquivo...",
    "entries-title": "Explorador de arquivo compactado",
    "export-all-entries": "Exportar tudo para pasta",
    "exporting-all-entries": "Exportando",
    "search-placeholder": "Buscar na pasta atual",
    "root-folder": "Raiz",
    "go-to-parent": "Acima",
    "empty-folder": "Esta pasta está vazia."
  },
  "ru": {
    "parsing-archive": "Разбор содержимого архива...",
    "entries-title": "Обозреватель архива",
    "export-all-entries": "Экспортировать всё в папку",
    "exporting-all-entries": "Экспорт",
    "search-placeholder": "Поиск в текущей папке",
    "root-folder": "Корень",
    "go-to-parent": "Вверх",
    "empty-folder": "Эта папка пуста."
  },
  "tr": {
    "parsing-archive": "Arşiv girdileri ayrıştırılıyor...",
    "entries-title": "Arşiv gezgini",
    "export-all-entries": "Tümünü klasöre aktar",
    "exporting-all-entries": "Aktarılıyor",
    "search-placeholder": "Geçerli klasörde ara",
    "root-folder": "Kök",
    "go-to-parent": "Yukarı",
    "empty-folder": "Bu klasör boş."
  },
  "nl": {
    "parsing-archive": "Archiefitems worden geparseerd...",
    "entries-title": "Archiefverkenner",
    "export-all-entries": "Alles exporteren naar map",
    "exporting-all-entries": "Exporteren",
    "search-placeholder": "Zoeken in huidige map",
    "root-folder": "Root",
    "go-to-parent": "Omhoog",
    "empty-folder": "Deze map is leeg."
  },
  "sv": {
    "parsing-archive": "Tolkar arkivposter...",
    "entries-title": "Arkivutforskare",
    "export-all-entries": "Exportera allt till mapp",
    "exporting-all-entries": "Exporterar",
    "search-placeholder": "Sök i aktuell mapp",
    "root-folder": "Rot",
    "go-to-parent": "Upp",
    "empty-folder": "Den här mappen är tom."
  },
  "pl": {
    "parsing-archive": "Analizowanie wpisów archiwum...",
    "entries-title": "Eksplorator archiwum",
    "export-all-entries": "Eksportuj wszystko do folderu",
    "exporting-all-entries": "Eksportowanie",
    "search-placeholder": "Szukaj w bieżącym folderze",
    "root-folder": "Główny",
    "go-to-parent": "W górę",
    "empty-folder": "Ten folder jest pusty."
  },
  "no": {
    "parsing-archive": "Tolker arkivoppføringer...",
    "entries-title": "Arkivutforsker",
    "export-all-entries": "Eksporter alt til mappe",
    "exporting-all-entries": "Eksporterer",
    "search-placeholder": "Søk i gjeldende mappe",
    "root-folder": "Rot",
    "go-to-parent": "Opp",
    "empty-folder": "Denne mappen er tom."
  },
  "ja": {
    "parsing-archive": "アーカイブ内エントリを解析中...",
    "entries-title": "アーカイブエクスプローラー",
    "export-all-entries": "すべてをフォルダーへエクスポート",
    "exporting-all-entries": "エクスポート中",
    "search-placeholder": "現在のフォルダー内を検索",
    "root-folder": "ルート",
    "go-to-parent": "上へ",
    "empty-folder": "このフォルダーは空です。"
  },
  "ko": {
    "parsing-archive": "압축 항목을 분석하는 중...",
    "entries-title": "압축 파일 탐색기",
    "export-all-entries": "모두 폴더로 내보내기",
    "exporting-all-entries": "내보내는 중",
    "search-placeholder": "현재 폴더에서 검색",
    "root-folder": "루트",
    "go-to-parent": "상위로",
    "empty-folder": "이 폴더는 비어 있습니다."
  },
  "ar": {
    "parsing-archive": "جارٍ تحليل محتويات الأرشيف...",
    "entries-title": "مستعرض الأرشيف",
    "export-all-entries": "تصدير الكل إلى مجلد",
    "exporting-all-entries": "جارٍ التصدير",
    "search-placeholder": "ابحث في المجلد الحالي",
    "root-folder": "الجذر",
    "go-to-parent": "أعلى",
    "empty-folder": "هذا المجلد فارغ."
  },
  "hi": {
    "parsing-archive": "आर्काइव एंट्रीज़ पार्स की जा रही हैं...",
    "entries-title": "आर्काइव एक्सप्लोरर",
    "export-all-entries": "सब कुछ फ़ोल्डर में एक्सपोर्ट करें",
    "exporting-all-entries": "एक्सपोर्ट हो रहा है",
    "search-placeholder": "वर्तमान फ़ोल्डर में खोजें",
    "root-folder": "रूट",
    "go-to-parent": "ऊपर",
    "empty-folder": "यह फ़ोल्डर खाली है।"
  },
  "vi": {
    "parsing-archive": "Đang phân tích các mục trong tệp nén...",
    "entries-title": "Trình duyệt tệp nén",
    "export-all-entries": "Xuất tất cả vào thư mục",
    "exporting-all-entries": "Đang xuất",
    "search-placeholder": "Tìm trong thư mục hiện tại",
    "root-folder": "Gốc",
    "go-to-parent": "Lên trên",
    "empty-folder": "Thư mục này trống."
  },
  "th": {
    "parsing-archive": "กำลังวิเคราะห์รายการในไฟล์บีบอัด...",
    "entries-title": "ตัวสำรวจไฟล์บีบอัด",
    "export-all-entries": "ส่งออกทั้งหมดไปยังโฟลเดอร์",
    "exporting-all-entries": "กำลังส่งออก",
    "search-placeholder": "ค้นหาในโฟลเดอร์ปัจจุบัน",
    "root-folder": "ราก",
    "go-to-parent": "ขึ้น",
    "empty-folder": "โฟลเดอร์นี้ว่าง"
  },
  "id": {
    "parsing-archive": "Memproses entri arsip...",
    "entries-title": "Penjelajah arsip",
    "export-all-entries": "Ekspor semua ke folder",
    "exporting-all-entries": "Mengekspor",
    "search-placeholder": "Cari di folder saat ini",
    "root-folder": "Root",
    "go-to-parent": "Naik",
    "empty-folder": "Folder ini kosong."
  },
  "he": {
    "parsing-archive": "מפענח את תוכן הארכיון...",
    "entries-title": "סייר ארכיונים",
    "export-all-entries": "ייצוא הכל לתיקייה",
    "exporting-all-entries": "מייצא",
    "search-placeholder": "חיפוש בתיקייה הנוכחית",
    "root-folder": "שורש",
    "go-to-parent": "למעלה",
    "empty-folder": "התיקייה הזו ריקה."
  },
  "ms": {
    "parsing-archive": "Sedang menghuraikan entri arkib...",
    "entries-title": "Peneroka arkib",
    "export-all-entries": "Eksport semua ke folder",
    "exporting-all-entries": "Mengeksport",
    "search-placeholder": "Cari dalam folder semasa",
    "root-folder": "Akar",
    "go-to-parent": "Naik",
    "empty-folder": "Folder ini kosong."
  }
}
</i18n>
