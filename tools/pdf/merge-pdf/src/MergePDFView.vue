<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ToolSectionHeader>{{ t('upload-title') }}</ToolSectionHeader>
    <ToolSection>
      <n-upload
        :disabled="isMerging"
        :show-file-list="false"
        multiple
        accept="application/pdf"
        @before-upload="handleBeforeUpload"
      >
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <DocumentPdf24Regular />
            </n-icon>
          </div>
          <div style="display: inline-flex; align-items: baseline; gap: 8px">
            <n-text style="font-size: 16px">{{ t('upload-hint') }}</n-text>
            <n-text depth="3">{{ t('upload-subhint') }}</n-text>
          </div>
        </n-upload-dragger>
      </n-upload>
    </ToolSection>

    <ToolSectionHeader>{{ t('files-title') }}</ToolSectionHeader>
    <ToolSection>
      <n-flex vertical :size="12">
        <n-alert
          v-if="files.length === 1"
          type="info"
          :bordered="false"
          :title="t('need-more-title')"
        >
          {{ t('need-more-description') }}
        </n-alert>
        <n-text v-if="files.length === 0" depth="3">{{ t('empty-list') }}</n-text>
        <template v-else>
          <n-text depth="3" data-testid="total-pages">
            {{ t('total-pages', { count: totalPagesLabel }) }}
          </n-text>
          <n-card
            v-for="(item, index) in files"
            :key="fileKey(item, index)"
            size="small"
            data-testid="pdf-file-item"
          >
            <n-flex justify="space-between" align="center" :size="12">
              <n-flex vertical :size="2">
                <n-text strong>{{ item.file.name }}</n-text>
                <n-text depth="3">{{ formatFileSize(item.file.size) }}</n-text>
                <n-text depth="3">
                  {{ t('page-count', { count: formatPageCount(item.pageCount) }) }}
                </n-text>
              </n-flex>
              <n-flex align="center" :size="8" wrap>
                <n-button
                  size="small"
                  secondary
                  :disabled="index === 0 || isMerging"
                  data-testid="move-up"
                  :aria-label="t('move-up')"
                  :title="t('move-up')"
                  @click="moveFile(index, -1)"
                >
                  <template #icon>
                    <n-icon :component="ArrowSortUp16Regular" />
                  </template>
                </n-button>
                <n-button
                  size="small"
                  secondary
                  :disabled="index === files.length - 1 || isMerging"
                  data-testid="move-down"
                  :aria-label="t('move-down')"
                  :title="t('move-down')"
                  @click="moveFile(index, 1)"
                >
                  <template #icon>
                    <n-icon :component="ArrowSortDown16Regular" />
                  </template>
                </n-button>
                <n-button
                  size="small"
                  text
                  :disabled="isMerging"
                  data-testid="remove-file"
                  @click="removeFile(index)"
                >
                  <template #icon>
                    <n-icon :component="Delete16Regular" />
                  </template>
                  {{ t('remove') }}
                </n-button>
              </n-flex>
            </n-flex>
          </n-card>
        </template>
      </n-flex>
    </ToolSection>

    <ToolSection>
      <n-flex justify="flex-end" :size="12">
        <n-button
          secondary
          :disabled="files.length === 0 || isMerging"
          data-testid="clear-files"
          @click="clearFiles"
        >
          <template #icon>
            <n-icon :component="Delete16Regular" />
          </template>
          {{ t('clear') }}
        </n-button>
        <n-button
          type="primary"
          :loading="isMerging"
          :disabled="files.length < 2 || isMerging"
          data-testid="merge-files"
          @click="mergeFiles"
        >
          <template #icon>
            <n-icon :component="Merge24Regular" />
          </template>
          {{ t('merge') }}
        </n-button>
      </n-flex>
    </ToolSection>

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
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { computed, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import {
  NAlert,
  NButton,
  NCard,
  NFlex,
  NIcon,
  NText,
  NUpload,
  NUploadDragger,
  useMessage,
} from 'naive-ui'
import { PDFDocument } from 'pdf-lib'
import { ToolDefaultPageLayout, ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { mergePDFs } from './merge-pdf'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import ArrowSortDown16Regular from '@vicons/fluent/ArrowSortDown16Regular'
import ArrowSortUp16Regular from '@vicons/fluent/ArrowSortUp16Regular'
import Delete16Regular from '@vicons/fluent/Delete16Regular'
import DocumentPdf24Regular from '@vicons/fluent/DocumentPdf24Regular'
import Merge24Regular from '@vicons/fluent/Merge24Regular'
import type { UploadFileInfo } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()

type PdfItem = {
  file: File
  pageCount: number | null
}

const files = ref<PdfItem[]>([])
const isMerging = ref(false)
const downloadBlob = ref<Blob | null>(null)
const downloadUrl = useObjectUrl(downloadBlob)
const downloadName = ref('')
const defaultDownloadName = 'merged.pdf'
const downloadFilename = computed(() => downloadName.value || defaultDownloadName)
const totalPages = computed(() => {
  if (files.value.length === 0) return null
  if (files.value.some((item) => typeof item.pageCount !== 'number')) return null
  return files.value.reduce((sum, item) => sum + (item.pageCount ?? 0), 0)
})
const totalPagesLabel = computed(() => formatPageCount(totalPages.value))

const resetOutput = () => {
  downloadBlob.value = null
  downloadName.value = ''
}

const isPdfFile = (file: File) =>
  file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')

const getPageCount = async (file: File) => {
  try {
    const buffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(buffer)
    return pdfDoc.getPageCount()
  } catch {
    return null
  }
}

const handleBeforeUpload = async (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  if (isMerging.value) return false

  const file = data.file.file
  if (!file) return false

  if (!isPdfFile(file)) {
    message.error(t('only-pdf'))
    return false
  }

  const pageCount = await getPageCount(file)
  files.value = [...files.value, { file, pageCount }]
  resetOutput()
  return false
}

const fileKey = (item: PdfItem, index: number) => `${index}-${item.file.name}-${item.file.size}`

const moveFile = (index: number, direction: number) => {
  const nextIndex = index + direction
  if (nextIndex < 0 || nextIndex >= files.value.length) return

  const updated = [...files.value]
  const [current] = updated.splice(index, 1)
  if (!current) return
  updated.splice(nextIndex, 0, current)
  files.value = updated
  resetOutput()
}

const removeFile = (index: number) => {
  files.value = files.value.filter((_, fileIndex) => fileIndex !== index)
  resetOutput()
}

const clearFiles = () => {
  files.value = []
  resetOutput()
}

const mergeFiles = async () => {
  if (files.value.length < 2) {
    message.error(t('need-more-description'))
    return
  }

  isMerging.value = true
  resetOutput()

  try {
    const merged = await mergePDFs(files.value.map((item) => item.file))
    downloadBlob.value = merged
    downloadName.value = defaultDownloadName
    message.success(t('merge-success'))
  } catch (error) {
    const fallback = t('merge-failed')
    message.error(error instanceof Error ? error.message || fallback : fallback)
  } finally {
    isMerging.value = false
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatPageCount = (count: number | null) =>
  typeof count === 'number' && Number.isFinite(count) ? count.toLocaleString() : '--'
</script>

<i18n lang="json">
{
  "en": {
    "upload-title": "Upload PDFs",
    "upload-hint": "Click or drag to upload PDFs",
    "upload-subhint": "Add at least 2 PDF files to merge",
    "files-title": "Merge order",
    "empty-list": "No PDF files added yet",
    "need-more-title": "Add another PDF",
    "need-more-description": "At least two PDF files are required to merge",
    "move-up": "Move up",
    "move-down": "Move down",
    "remove": "Remove",
    "clear": "Clear",
    "merge": "Merge PDFs",
    "merge-success": "PDFs merged successfully",
    "merge-failed": "Failed to merge PDFs",
    "only-pdf": "Only PDF files are allowed",
    "download-file": "Download {filename}",
    "page-count": "Pages: {count}",
    "total-pages": "Total pages: {count}"
  },
  "zh": {
    "upload-title": "上传 PDF",
    "upload-hint": "点击或拖拽上传 PDF",
    "upload-subhint": "至少添加 2 个 PDF 文件以合并",
    "files-title": "合并顺序",
    "empty-list": "尚未添加 PDF 文件",
    "need-more-title": "再添加一个 PDF",
    "need-more-description": "合并需要至少两个 PDF 文件",
    "move-up": "上移",
    "move-down": "下移",
    "remove": "移除",
    "clear": "清除",
    "merge": "合并 PDF",
    "merge-success": "PDF 已成功合并",
    "merge-failed": "合并 PDF 失败",
    "only-pdf": "仅允许 PDF 文件",
    "download-file": "下载 {filename}",
    "page-count": "页数：{count}",
    "total-pages": "共 {count} 页"
  },
  "zh-CN": {
    "upload-title": "上传 PDF",
    "upload-hint": "点击或拖拽上传 PDF",
    "upload-subhint": "至少添加 2 个 PDF 文件以合并",
    "files-title": "合并顺序",
    "empty-list": "尚未添加 PDF 文件",
    "need-more-title": "再添加一个 PDF",
    "need-more-description": "合并需要至少两个 PDF 文件",
    "move-up": "上移",
    "move-down": "下移",
    "remove": "移除",
    "clear": "清除",
    "merge": "合并 PDF",
    "merge-success": "PDF 已成功合并",
    "merge-failed": "合并 PDF 失败",
    "only-pdf": "仅允许 PDF 文件",
    "download-file": "下载 {filename}",
    "page-count": "页数：{count}",
    "total-pages": "共 {count} 页"
  },
  "zh-TW": {
    "upload-title": "上傳 PDF",
    "upload-hint": "點擊或拖拽上傳 PDF",
    "upload-subhint": "至少新增 2 個 PDF 檔案以合併",
    "files-title": "合併順序",
    "empty-list": "尚未新增 PDF 檔案",
    "need-more-title": "再新增一個 PDF",
    "need-more-description": "合併需要至少兩個 PDF 檔案",
    "move-up": "上移",
    "move-down": "下移",
    "remove": "移除",
    "clear": "清除",
    "merge": "合併 PDF",
    "merge-success": "PDF 已成功合併",
    "merge-failed": "合併 PDF 失敗",
    "only-pdf": "僅允許 PDF 檔案",
    "download-file": "下載 {filename}",
    "page-count": "頁數：{count}",
    "total-pages": "共 {count} 頁"
  },
  "zh-HK": {
    "upload-title": "上傳 PDF",
    "upload-hint": "點擊或拖拽上傳 PDF",
    "upload-subhint": "至少新增 2 個 PDF 檔案以合併",
    "files-title": "合併順序",
    "empty-list": "尚未新增 PDF 檔案",
    "need-more-title": "再新增一個 PDF",
    "need-more-description": "合併需要至少兩個 PDF 檔案",
    "move-up": "上移",
    "move-down": "下移",
    "remove": "移除",
    "clear": "清除",
    "merge": "合併 PDF",
    "merge-success": "PDF 已成功合併",
    "merge-failed": "合併 PDF 失敗",
    "only-pdf": "僅允許 PDF 檔案",
    "download-file": "下載 {filename}",
    "page-count": "頁數：{count}",
    "total-pages": "共 {count} 頁"
  },
  "es": {
    "upload-title": "Subir PDFs",
    "upload-hint": "Haz clic o arrastra para subir PDFs",
    "upload-subhint": "Agrega al menos 2 archivos PDF para combinar",
    "files-title": "Orden de combinación",
    "empty-list": "Aún no se han agregado archivos PDF",
    "need-more-title": "Agrega otro PDF",
    "need-more-description": "Se requieren al menos dos archivos PDF para combinar",
    "move-up": "Mover arriba",
    "move-down": "Mover abajo",
    "remove": "Eliminar",
    "clear": "Limpiar",
    "merge": "Combinar PDFs",
    "merge-success": "PDFs combinados correctamente",
    "merge-failed": "Error al combinar PDFs",
    "only-pdf": "Solo se permiten archivos PDF",
    "download-file": "Descargar {filename}",
    "page-count": "Páginas: {count}",
    "total-pages": "Total de páginas: {count}"
  },
  "fr": {
    "upload-title": "Téléverser des PDF",
    "upload-hint": "Cliquez ou glissez pour téléverser des PDF",
    "upload-subhint": "Ajoutez au moins 2 fichiers PDF à fusionner",
    "files-title": "Ordre de fusion",
    "empty-list": "Aucun fichier PDF ajouté",
    "need-more-title": "Ajoutez un autre PDF",
    "need-more-description": "Au moins deux fichiers PDF sont requis pour fusionner",
    "move-up": "Monter",
    "move-down": "Descendre",
    "remove": "Supprimer",
    "clear": "Effacer",
    "merge": "Fusionner les PDFs",
    "merge-success": "PDFs fusionnés avec succès",
    "merge-failed": "Échec de la fusion des PDFs",
    "only-pdf": "Seuls les fichiers PDF sont autorisés",
    "download-file": "Télécharger {filename}",
    "page-count": "Pages : {count}",
    "total-pages": "Total des pages : {count}"
  },
  "de": {
    "upload-title": "PDFs hochladen",
    "upload-hint": "Klicken oder ziehen Sie, um PDFs hochzuladen",
    "upload-subhint": "Fügen Sie mindestens 2 PDF-Dateien zum Zusammenführen hinzu",
    "files-title": "Zusammenführungsreihenfolge",
    "empty-list": "Noch keine PDF-Dateien hinzugefügt",
    "need-more-title": "Fügen Sie ein weiteres PDF hinzu",
    "need-more-description": "Zum Zusammenführen sind mindestens zwei PDF-Dateien erforderlich",
    "move-up": "Nach oben",
    "move-down": "Nach unten",
    "remove": "Entfernen",
    "clear": "Löschen",
    "merge": "PDFs zusammenführen",
    "merge-success": "PDFs erfolgreich zusammengeführt",
    "merge-failed": "PDFs konnten nicht zusammengeführt werden",
    "only-pdf": "Nur PDF-Dateien sind erlaubt",
    "download-file": "{filename} herunterladen",
    "page-count": "Seiten: {count}",
    "total-pages": "Seiten gesamt: {count}"
  },
  "it": {
    "upload-title": "Carica PDF",
    "upload-hint": "Clicca o trascina per caricare PDF",
    "upload-subhint": "Aggiungi almeno 2 file PDF da unire",
    "files-title": "Ordine di unione",
    "empty-list": "Nessun file PDF aggiunto",
    "need-more-title": "Aggiungi un altro PDF",
    "need-more-description": "Servono almeno due file PDF per unire",
    "move-up": "Sposta su",
    "move-down": "Sposta giù",
    "remove": "Rimuovi",
    "clear": "Pulisci",
    "merge": "Unisci PDF",
    "merge-success": "PDF uniti con successo",
    "merge-failed": "Impossibile unire i PDF",
    "only-pdf": "Sono consentiti solo file PDF",
    "download-file": "Scarica {filename}",
    "page-count": "Pagine: {count}",
    "total-pages": "Pagine totali: {count}"
  },
  "ja": {
    "upload-title": "PDF をアップロード",
    "upload-hint": "クリックまたはドラッグして PDF をアップロード",
    "upload-subhint": "結合するには 2 つ以上の PDF を追加してください",
    "files-title": "結合順序",
    "empty-list": "PDF ファイルがまだ追加されていません",
    "need-more-title": "別の PDF を追加",
    "need-more-description": "結合には少なくとも 2 つの PDF が必要です",
    "move-up": "上へ移動",
    "move-down": "下へ移動",
    "remove": "削除",
    "clear": "クリア",
    "merge": "PDF を結合",
    "merge-success": "PDF を正常に結合しました",
    "merge-failed": "PDF の結合に失敗しました",
    "only-pdf": "PDF ファイルのみ許可されています",
    "download-file": "{filename} をダウンロード",
    "page-count": "ページ数: {count}",
    "total-pages": "合計ページ数: {count}"
  },
  "ko": {
    "upload-title": "PDF 업로드",
    "upload-hint": "클릭하거나 드래그하여 PDF 업로드",
    "upload-subhint": "병합하려면 PDF 파일을 2개 이상 추가하세요",
    "files-title": "병합 순서",
    "empty-list": "아직 PDF 파일이 없습니다",
    "need-more-title": "PDF 하나 더 추가",
    "need-more-description": "병합하려면 최소 두 개의 PDF 파일이 필요합니다",
    "move-up": "위로 이동",
    "move-down": "아래로 이동",
    "remove": "제거",
    "clear": "지우기",
    "merge": "PDF 병합",
    "merge-success": "PDF가 성공적으로 병합되었습니다",
    "merge-failed": "PDF 병합에 실패했습니다",
    "only-pdf": "PDF 파일만 허용됩니다",
    "download-file": "{filename} 다운로드",
    "page-count": "페이지 수: {count}",
    "total-pages": "총 페이지 수: {count}"
  },
  "ru": {
    "upload-title": "Загрузить PDF",
    "upload-hint": "Нажмите или перетащите, чтобы загрузить PDF",
    "upload-subhint": "Добавьте как минимум 2 PDF-файла для объединения",
    "files-title": "Порядок объединения",
    "empty-list": "PDF-файлы еще не добавлены",
    "need-more-title": "Добавьте еще один PDF",
    "need-more-description": "Для объединения требуется минимум два PDF-файла",
    "move-up": "Вверх",
    "move-down": "Вниз",
    "remove": "Удалить",
    "clear": "Очистить",
    "merge": "Объединить PDF",
    "merge-success": "PDF успешно объединены",
    "merge-failed": "Не удалось объединить PDF",
    "only-pdf": "Разрешены только PDF-файлы",
    "download-file": "Скачать {filename}",
    "page-count": "Страниц: {count}",
    "total-pages": "Всего страниц: {count}"
  },
  "pt": {
    "upload-title": "Enviar PDFs",
    "upload-hint": "Clique ou arraste para enviar PDFs",
    "upload-subhint": "Adicione pelo menos 2 arquivos PDF para mesclar",
    "files-title": "Ordem de mesclagem",
    "empty-list": "Nenhum arquivo PDF adicionado",
    "need-more-title": "Adicione outro PDF",
    "need-more-description": "São necessários pelo menos dois arquivos PDF para mesclar",
    "move-up": "Mover para cima",
    "move-down": "Mover para baixo",
    "remove": "Remover",
    "clear": "Limpar",
    "merge": "Mesclar PDFs",
    "merge-success": "PDFs mesclados com sucesso",
    "merge-failed": "Falha ao mesclar PDFs",
    "only-pdf": "Somente arquivos PDF são permitidos",
    "download-file": "Baixar {filename}",
    "page-count": "Páginas: {count}",
    "total-pages": "Total de páginas: {count}"
  },
  "ar": {
    "upload-title": "تحميل ملفات PDF",
    "upload-hint": "انقر أو اسحب لتحميل ملفات PDF",
    "upload-subhint": "أضف ملفي PDF على الأقل للدمج",
    "files-title": "ترتيب الدمج",
    "empty-list": "لم تتم إضافة ملفات PDF بعد",
    "need-more-title": "أضف ملف PDF آخر",
    "need-more-description": "يلزم ملفا PDF على الأقل للدمج",
    "move-up": "نقل لأعلى",
    "move-down": "نقل لأسفل",
    "remove": "إزالة",
    "clear": "مسح",
    "merge": "دمج ملفات PDF",
    "merge-success": "تم دمج ملفات PDF بنجاح",
    "merge-failed": "فشل دمج ملفات PDF",
    "only-pdf": "يُسمح فقط بملفات PDF",
    "download-file": "تنزيل {filename}",
    "page-count": "عدد الصفحات: {count}",
    "total-pages": "إجمالي الصفحات: {count}"
  },
  "hi": {
    "upload-title": "PDF अपलोड करें",
    "upload-hint": "PDF अपलोड करने के लिए क्लिक करें या खींचें",
    "upload-subhint": "मर्ज करने के लिए कम से कम 2 PDF फाइलें जोड़ें",
    "files-title": "मर्ज क्रम",
    "empty-list": "अब तक कोई PDF फाइल नहीं जोड़ी गई",
    "need-more-title": "एक और PDF जोड़ें",
    "need-more-description": "मर्ज के लिए कम से कम दो PDF फाइलें आवश्यक हैं",
    "move-up": "ऊपर ले जाएँ",
    "move-down": "नीचे ले जाएँ",
    "remove": "हटाएं",
    "clear": "साफ़ करें",
    "merge": "PDF मर्ज करें",
    "merge-success": "PDF सफलतापूर्वक मर्ज हो गए",
    "merge-failed": "PDF मर्ज करने में विफल",
    "only-pdf": "केवल PDF फाइलें अनुमत हैं",
    "download-file": "{filename} डाउनलोड करें",
    "page-count": "पृष्ठ संख्या: {count}",
    "total-pages": "कुल पृष्ठ: {count}"
  },
  "tr": {
    "upload-title": "PDF yükle",
    "upload-hint": "PDF yüklemek için tıklayın veya sürükleyin",
    "upload-subhint": "Birleştirmek için en az 2 PDF dosyası ekleyin",
    "files-title": "Birleştirme sırası",
    "empty-list": "Henüz PDF dosyası eklenmedi",
    "need-more-title": "Başka bir PDF ekleyin",
    "need-more-description": "Birleştirmek için en az iki PDF dosyası gerekir",
    "move-up": "Yukarı taşı",
    "move-down": "Aşağı taşı",
    "remove": "Kaldır",
    "clear": "Temizle",
    "merge": "PDF'leri birleştir",
    "merge-success": "PDF'ler başarıyla birleştirildi",
    "merge-failed": "PDF'ler birleştirilemedi",
    "only-pdf": "Yalnızca PDF dosyalarına izin verilir",
    "download-file": "{filename} indir",
    "page-count": "Sayfa sayısı: {count}",
    "total-pages": "Toplam sayfa: {count}"
  },
  "nl": {
    "upload-title": "PDF's uploaden",
    "upload-hint": "Klik of sleep om PDF's te uploaden",
    "upload-subhint": "Voeg minstens 2 PDF-bestanden toe om te combineren",
    "files-title": "Samenvoegvolgorde",
    "empty-list": "Nog geen PDF-bestanden toegevoegd",
    "need-more-title": "Voeg nog een PDF toe",
    "need-more-description": "Voor het samenvoegen zijn minimaal twee PDF-bestanden nodig",
    "move-up": "Omhoog verplaatsen",
    "move-down": "Omlaag verplaatsen",
    "remove": "Verwijderen",
    "clear": "Wissen",
    "merge": "PDF's samenvoegen",
    "merge-success": "PDF's succesvol samengevoegd",
    "merge-failed": "PDF's samenvoegen mislukt",
    "only-pdf": "Alleen PDF-bestanden zijn toegestaan",
    "download-file": "{filename} downloaden",
    "page-count": "Pagina's: {count}",
    "total-pages": "Totaal pagina's: {count}"
  },
  "sv": {
    "upload-title": "Ladda upp PDF",
    "upload-hint": "Klicka eller dra för att ladda upp PDF",
    "upload-subhint": "Lägg till minst 2 PDF-filer för att slå samman",
    "files-title": "Sammanfogningsordning",
    "empty-list": "Inga PDF-filer har lagts till ännu",
    "need-more-title": "Lägg till en PDF till",
    "need-more-description": "Minst två PDF-filer krävs för att slå samman",
    "move-up": "Flytta upp",
    "move-down": "Flytta ner",
    "remove": "Ta bort",
    "clear": "Rensa",
    "merge": "Slå samman PDF",
    "merge-success": "PDF:er har slagits samman",
    "merge-failed": "Misslyckades med att slå samman PDF",
    "only-pdf": "Endast PDF-filer är tillåtna",
    "download-file": "Ladda ner {filename}",
    "page-count": "Sidor: {count}",
    "total-pages": "Totalt antal sidor: {count}"
  },
  "pl": {
    "upload-title": "Prześlij PDF",
    "upload-hint": "Kliknij lub przeciągnij, aby przesłać PDF",
    "upload-subhint": "Dodaj co najmniej 2 pliki PDF do scalenia",
    "files-title": "Kolejność scalania",
    "empty-list": "Nie dodano jeszcze plików PDF",
    "need-more-title": "Dodaj kolejny PDF",
    "need-more-description": "Do scalenia wymagane są co najmniej dwa pliki PDF",
    "move-up": "Przenieś w górę",
    "move-down": "Przenieś w dół",
    "remove": "Usuń",
    "clear": "Wyczyść",
    "merge": "Scal PDF",
    "merge-success": "PDF-y zostały scalone",
    "merge-failed": "Nie udało się scalić PDF",
    "only-pdf": "Dozwolone są tylko pliki PDF",
    "download-file": "Pobierz {filename}",
    "page-count": "Liczba stron: {count}",
    "total-pages": "Łączna liczba stron: {count}"
  },
  "vi": {
    "upload-title": "Tải lên PDF",
    "upload-hint": "Nhấp hoặc kéo để tải lên PDF",
    "upload-subhint": "Thêm ít nhất 2 tệp PDF để gộp",
    "files-title": "Thứ tự gộp",
    "empty-list": "Chưa thêm tệp PDF nào",
    "need-more-title": "Thêm một PDF nữa",
    "need-more-description": "Cần ít nhất hai tệp PDF để gộp",
    "move-up": "Di chuyển lên",
    "move-down": "Di chuyển xuống",
    "remove": "Xóa",
    "clear": "Xóa hết",
    "merge": "Gộp PDF",
    "merge-success": "Đã gộp PDF thành công",
    "merge-failed": "Gộp PDF thất bại",
    "only-pdf": "Chỉ cho phép tệp PDF",
    "download-file": "Tải xuống {filename}",
    "page-count": "Số trang: {count}",
    "total-pages": "Tổng số trang: {count}"
  },
  "th": {
    "upload-title": "อัปโหลด PDF",
    "upload-hint": "คลิกหรือลากเพื่ออัปโหลด PDF",
    "upload-subhint": "เพิ่มอย่างน้อย 2 ไฟล์ PDF เพื่อรวม",
    "files-title": "ลำดับการรวม",
    "empty-list": "ยังไม่มีไฟล์ PDF",
    "need-more-title": "เพิ่ม PDF อีกไฟล์",
    "need-more-description": "ต้องมีไฟล์ PDF อย่างน้อยสองไฟล์เพื่อรวม",
    "move-up": "ย้ายขึ้น",
    "move-down": "ย้ายลง",
    "remove": "ลบ",
    "clear": "ล้าง",
    "merge": "รวม PDF",
    "merge-success": "รวม PDF สำเร็จ",
    "merge-failed": "ไม่สามารถรวม PDF",
    "only-pdf": "อนุญาตเฉพาะไฟล์ PDF เท่านั้น",
    "download-file": "ดาวน์โหลด {filename}",
    "page-count": "จำนวนหน้า: {count}",
    "total-pages": "จำนวนหน้ารวม: {count}"
  },
  "id": {
    "upload-title": "Unggah PDF",
    "upload-hint": "Klik atau seret untuk mengunggah PDF",
    "upload-subhint": "Tambahkan setidaknya 2 file PDF untuk digabungkan",
    "files-title": "Urutan penggabungan",
    "empty-list": "Belum ada file PDF yang ditambahkan",
    "need-more-title": "Tambahkan PDF lain",
    "need-more-description": "Diperlukan minimal dua file PDF untuk digabungkan",
    "move-up": "Pindahkan ke atas",
    "move-down": "Pindahkan ke bawah",
    "remove": "Hapus",
    "clear": "Bersihkan",
    "merge": "Gabungkan PDF",
    "merge-success": "PDF berhasil digabungkan",
    "merge-failed": "Gagal menggabungkan PDF",
    "only-pdf": "Hanya file PDF yang diizinkan",
    "download-file": "Unduh {filename}",
    "page-count": "Jumlah halaman: {count}",
    "total-pages": "Total halaman: {count}"
  },
  "he": {
    "upload-title": "העלאת PDF",
    "upload-hint": "לחץ או גרור כדי להעלות PDF",
    "upload-subhint": "הוסף לפחות שני קובצי PDF למיזוג",
    "files-title": "סדר מיזוג",
    "empty-list": "לא נוספו קובצי PDF עדיין",
    "need-more-title": "הוסף PDF נוסף",
    "need-more-description": "נדרשים לפחות שני קובצי PDF למיזוג",
    "move-up": "העבר למעלה",
    "move-down": "העבר למטה",
    "remove": "הסר",
    "clear": "נקה",
    "merge": "מזג PDF",
    "merge-success": "קובצי PDF מוזגו בהצלחה",
    "merge-failed": "נכשל מיזוג PDF",
    "only-pdf": "מותר רק קובצי PDF",
    "download-file": "הורד {filename}",
    "page-count": "מספר עמודים: {count}",
    "total-pages": "סך הכל עמודים: {count}"
  },
  "ms": {
    "upload-title": "Muat naik PDF",
    "upload-hint": "Klik atau seret untuk memuat naik PDF",
    "upload-subhint": "Tambah sekurang-kurangnya 2 fail PDF untuk digabungkan",
    "files-title": "Susunan gabungan",
    "empty-list": "Belum ada fail PDF ditambah",
    "need-more-title": "Tambah satu lagi PDF",
    "need-more-description": "Sekurang-kurangnya dua fail PDF diperlukan untuk digabungkan",
    "move-up": "Alih ke atas",
    "move-down": "Alih ke bawah",
    "remove": "Buang",
    "clear": "Kosongkan",
    "merge": "Gabung PDF",
    "merge-success": "PDF berjaya digabungkan",
    "merge-failed": "Gagal menggabungkan PDF",
    "only-pdf": "Hanya fail PDF dibenarkan",
    "download-file": "Muat turun {filename}",
    "page-count": "Bilangan halaman: {count}",
    "total-pages": "Jumlah keseluruhan halaman: {count}"
  },
  "no": {
    "upload-title": "Last opp PDF",
    "upload-hint": "Klikk eller dra for å laste opp PDF",
    "upload-subhint": "Legg til minst 2 PDF-filer for å slå sammen",
    "files-title": "Sammenslåingsrekkefølge",
    "empty-list": "Ingen PDF-filer lagt til ennå",
    "need-more-title": "Legg til en PDF til",
    "need-more-description": "Minst to PDF-filer kreves for å slå sammen",
    "move-up": "Flytt opp",
    "move-down": "Flytt ned",
    "remove": "Fjern",
    "clear": "Tøm",
    "merge": "Slå sammen PDF",
    "merge-success": "PDF-er slått sammen",
    "merge-failed": "Kunne ikke slå sammen PDF",
    "only-pdf": "Kun PDF-filer er tillatt",
    "download-file": "Last ned {filename}",
    "page-count": "Antall sider: {count}",
    "total-pages": "Totalt antall sider: {count}"
  }
}
</i18n>
