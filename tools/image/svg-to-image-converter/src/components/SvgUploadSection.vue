<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('uploadTitle') }}</ToolSectionHeader>
    <template v-if="!originalFile">
      <n-upload
        accept=".svg,image/svg+xml"
        :max="1"
        :default-upload="false"
        @before-upload="onBeforeUpload"
      >
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <CloudArrowUp24Regular />
            </n-icon>
          </div>
          <n-text style="font-size: 16px">{{ t('dragDropOrClick') }}</n-text>
          <n-p depth="3" style="margin: 8px 0 0 0">{{ t('svgFilesOnly') }}</n-p>
        </n-upload-dragger>
      </n-upload>
    </template>
    <template v-else>
      <n-flex vertical :size="16">
        <n-flex align="center" :size="16">
          <div class="preview-box preview-box--small">
            <img
              v-if="originalPreviewUrl"
              :src="originalPreviewUrl"
              alt="SVG preview"
              class="preview-image"
            />
          </div>
          <n-flex vertical :size="4">
            <n-text strong>{{ originalFile.name }}</n-text>
            <n-text depth="3">{{ originalSizeLabel }}</n-text>
            <n-text v-show="originalDimensionsLabel" depth="3">
              {{ t('dimensions') }}: {{ originalDimensionsLabel }}
            </n-text>
            <n-button size="small" @click="onClearFile">
              <template #icon>
                <n-icon><Delete20Regular /></n-icon>
              </template>
              {{ t('removeFile') }}
            </n-button>
          </n-flex>
        </n-flex>
      </n-flex>
    </template>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  NButton,
  NFlex,
  NIcon,
  NP,
  NText,
  NUpload,
  NUploadDragger,
  type UploadFileInfo,
} from 'naive-ui'
import CloudArrowUp24Regular from '@vicons/fluent/CloudArrowUp24Regular'
import Delete20Regular from '@vicons/fluent/Delete20Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  originalFile: File | null
  originalPreviewUrl?: string
  originalSizeLabel: string
  originalDimensionsLabel: string
  onBeforeUpload: (data: {
    file: UploadFileInfo
    fileList: UploadFileInfo[]
  }) => boolean | Promise<boolean>
  onClearFile: () => void
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<style scoped>
.preview-box {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
  background: #f5f5f5;
}

.preview-box--small {
  width: 120px;
  height: 120px;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
}
</style>

<i18n lang="json">
{
  "en": {
    "uploadTitle": "Upload SVG",
    "dragDropOrClick": "Click or drag to upload SVG file",
    "svgFilesOnly": "SVG files only",
    "removeFile": "Remove File",
    "dimensions": "Dimensions"
  },
  "zh": {
    "uploadTitle": "上传 SVG",
    "dragDropOrClick": "点击或拖拽上传 SVG 文件",
    "svgFilesOnly": "仅支持 SVG 文件",
    "removeFile": "移除文件",
    "dimensions": "尺寸"
  },
  "zh-CN": {
    "uploadTitle": "上传 SVG",
    "dragDropOrClick": "点击或拖拽上传 SVG 文件",
    "svgFilesOnly": "仅支持 SVG 文件",
    "removeFile": "移除文件",
    "dimensions": "尺寸"
  },
  "zh-TW": {
    "uploadTitle": "上傳 SVG",
    "dragDropOrClick": "點擊或拖曳上傳 SVG 檔案",
    "svgFilesOnly": "僅支援 SVG 檔案",
    "removeFile": "移除檔案",
    "dimensions": "尺寸"
  },
  "zh-HK": {
    "uploadTitle": "上傳 SVG",
    "dragDropOrClick": "點擊或拖曳上傳 SVG 檔案",
    "svgFilesOnly": "僅支援 SVG 檔案",
    "removeFile": "移除檔案",
    "dimensions": "尺寸"
  },
  "es": {
    "uploadTitle": "Subir SVG",
    "dragDropOrClick": "Haz clic o arrastra para subir el archivo SVG",
    "svgFilesOnly": "Solo archivos SVG",
    "removeFile": "Eliminar archivo",
    "dimensions": "Dimensiones"
  },
  "fr": {
    "uploadTitle": "Téléverser SVG",
    "dragDropOrClick": "Cliquez ou glissez pour téléverser un fichier SVG",
    "svgFilesOnly": "Fichiers SVG uniquement",
    "removeFile": "Supprimer le fichier",
    "dimensions": "Dimensions"
  },
  "de": {
    "uploadTitle": "SVG hochladen",
    "dragDropOrClick": "Klicken oder ziehen Sie, um SVG-Datei hochzuladen",
    "svgFilesOnly": "Nur SVG-Dateien",
    "removeFile": "Datei entfernen",
    "dimensions": "Abmessungen"
  },
  "it": {
    "uploadTitle": "Carica SVG",
    "dragDropOrClick": "Clicca o trascina per caricare file SVG",
    "svgFilesOnly": "Solo file SVG",
    "removeFile": "Rimuovi file",
    "dimensions": "Dimensioni"
  },
  "ja": {
    "uploadTitle": "SVG をアップロード",
    "dragDropOrClick": "クリックまたはドラッグして SVG ファイルをアップロード",
    "svgFilesOnly": "SVG ファイルのみ",
    "removeFile": "ファイルを削除",
    "dimensions": "サイズ"
  },
  "ko": {
    "uploadTitle": "SVG 업로드",
    "dragDropOrClick": "클릭하거나 드래그하여 SVG 파일 업로드",
    "svgFilesOnly": "SVG 파일만",
    "removeFile": "파일 제거",
    "dimensions": "크기"
  },
  "ru": {
    "uploadTitle": "Загрузить SVG",
    "dragDropOrClick": "Нажмите или перетащите для загрузки SVG-файла",
    "svgFilesOnly": "Только SVG файлы",
    "removeFile": "Удалить файл",
    "dimensions": "Размеры"
  },
  "pt": {
    "uploadTitle": "Enviar SVG",
    "dragDropOrClick": "Clique ou arraste para enviar arquivo SVG",
    "svgFilesOnly": "Apenas arquivos SVG",
    "removeFile": "Remover arquivo",
    "dimensions": "Dimensões"
  },
  "ar": {
    "uploadTitle": "رفع SVG",
    "dragDropOrClick": "انقر أو اسحب لرفع ملف SVG",
    "svgFilesOnly": "ملفات SVG فقط",
    "removeFile": "إزالة الملف",
    "dimensions": "الأبعاد"
  },
  "hi": {
    "uploadTitle": "SVG अपलोड करें",
    "dragDropOrClick": "SVG फ़ाइल अपलोड करने के लिए क्लिक करें या खींचें",
    "svgFilesOnly": "केवल SVG फ़ाइलें",
    "removeFile": "फ़ाइल हटाएं",
    "dimensions": "आयाम"
  },
  "tr": {
    "uploadTitle": "SVG Yükle",
    "dragDropOrClick": "SVG dosyasını yüklemek için tıklayın veya sürükleyin",
    "svgFilesOnly": "Sadece SVG dosyaları",
    "removeFile": "Dosyayı kaldır",
    "dimensions": "Boyutlar"
  },
  "nl": {
    "uploadTitle": "SVG uploaden",
    "dragDropOrClick": "Klik of sleep om SVG-bestand te uploaden",
    "svgFilesOnly": "Alleen SVG-bestanden",
    "removeFile": "Bestand verwijderen",
    "dimensions": "Afmetingen"
  },
  "sv": {
    "uploadTitle": "Ladda upp SVG",
    "dragDropOrClick": "Klicka eller dra för att ladda upp SVG-fil",
    "svgFilesOnly": "Endast SVG-filer",
    "removeFile": "Ta bort fil",
    "dimensions": "Dimensioner"
  },
  "pl": {
    "uploadTitle": "Prześlij SVG",
    "dragDropOrClick": "Kliknij lub przeciągnij, aby przesłać plik SVG",
    "svgFilesOnly": "Tylko pliki SVG",
    "removeFile": "Usuń plik",
    "dimensions": "Wymiary"
  },
  "vi": {
    "uploadTitle": "Tải lên SVG",
    "dragDropOrClick": "Nhấp hoặc kéo để tải lên tệp SVG",
    "svgFilesOnly": "Chỉ tệp SVG",
    "removeFile": "Xóa tệp",
    "dimensions": "Kích thước"
  },
  "th": {
    "uploadTitle": "อัปโหลด SVG",
    "dragDropOrClick": "คลิกหรือลากเพื่ออัปโหลดไฟล์ SVG",
    "svgFilesOnly": "เฉพาะไฟล์ SVG",
    "removeFile": "ลบไฟล์",
    "dimensions": "ขนาด"
  },
  "id": {
    "uploadTitle": "Unggah SVG",
    "dragDropOrClick": "Klik atau seret untuk mengunggah file SVG",
    "svgFilesOnly": "Hanya file SVG",
    "removeFile": "Hapus file",
    "dimensions": "Dimensi"
  },
  "he": {
    "uploadTitle": "העלה SVG",
    "dragDropOrClick": "לחץ או גרור כדי להעלות קובץ SVG",
    "svgFilesOnly": "קבצי SVG בלבד",
    "removeFile": "הסר קובץ",
    "dimensions": "ממדים"
  },
  "ms": {
    "uploadTitle": "Muat naik SVG",
    "dragDropOrClick": "Klik atau seret untuk muat naik fail SVG",
    "svgFilesOnly": "Hanya fail SVG",
    "removeFile": "Buang fail",
    "dimensions": "Dimensi"
  },
  "no": {
    "uploadTitle": "Last opp SVG",
    "dragDropOrClick": "Klikk eller dra for å laste opp SVG-fil",
    "svgFilesOnly": "Kun SVG-filer",
    "removeFile": "Fjern fil",
    "dimensions": "Dimensjoner"
  }
}
</i18n>
