<template>
  <ToolSectionHeader>{{ t('preview') }}</ToolSectionHeader>
  <ToolSection>
    <n-space vertical :size="12">
      <n-space justify="space-between" align="center">
        <n-text v-if="selectedCount > 0" depth="3">
          {{ t('selectedCount', { count: selectedCount }) }}
        </n-text>
        <n-space v-else />
        <n-space>
          <CopyToClipboardButton :content="generatedContent" />
          <n-button
            tag="a"
            text
            :href="downloadUrl ?? undefined"
            download=".gitignore"
            :disabled="!downloadUrl"
          >
            <template #icon>
              <n-icon><DownloadIcon /></n-icon>
            </template>
            {{ t('download') }}
          </n-button>
        </n-space>
      </n-space>
      <n-input
        :value="generatedContent"
        type="textarea"
        :placeholder="t('previewPlaceholder')"
        :autosize="{ minRows: 10, maxRows: 30 }"
        readonly
      />
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NInput, NSpace, NText, NButton, NIcon } from 'naive-ui'
import DownloadIcon from '@vicons/fluent/ArrowDownload24Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'

defineProps<{
  selectedCount: number
  generatedContent: string
  downloadUrl?: string
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "preview": "Preview",
    "selectedCount": "{count} template(s) selected",
    "previewPlaceholder": "Select templates to generate .gitignore content",
    "download": "Download"
  },
  "zh": {
    "preview": "预览",
    "selectedCount": "已选择 {count} 个模板",
    "previewPlaceholder": "选择模板以生成 .gitignore 内容",
    "download": "下载"
  },
  "zh-CN": {
    "preview": "预览",
    "selectedCount": "已选择 {count} 个模板",
    "previewPlaceholder": "选择模板以生成 .gitignore 内容",
    "download": "下载"
  },
  "zh-TW": {
    "preview": "預覽",
    "selectedCount": "已選擇 {count} 個模板",
    "previewPlaceholder": "選擇模板以產生 .gitignore 內容",
    "download": "下載"
  },
  "zh-HK": {
    "preview": "預覽",
    "selectedCount": "已選擇 {count} 個模板",
    "previewPlaceholder": "選擇模板以產生 .gitignore 內容",
    "download": "下載"
  },
  "es": {
    "preview": "Vista previa",
    "selectedCount": "{count} plantilla(s) seleccionada(s)",
    "previewPlaceholder": "Seleccione plantillas para generar el contenido .gitignore",
    "download": "Descargar"
  },
  "fr": {
    "preview": "Aperçu",
    "selectedCount": "{count} modèle(s) sélectionné(s)",
    "previewPlaceholder": "Sélectionnez des modèles pour générer le contenu .gitignore",
    "download": "Télécharger"
  },
  "de": {
    "preview": "Vorschau",
    "selectedCount": "{count} Vorlage(n) ausgewählt",
    "previewPlaceholder": "Wählen Sie Vorlagen aus, um .gitignore-Inhalt zu generieren",
    "download": "Herunterladen"
  },
  "it": {
    "preview": "Anteprima",
    "selectedCount": "{count} modello/i selezionato/i",
    "previewPlaceholder": "Seleziona i modelli per generare il contenuto .gitignore",
    "download": "Scarica"
  },
  "ja": {
    "preview": "プレビュー",
    "selectedCount": "{count} 個のテンプレートを選択済み",
    "previewPlaceholder": "テンプレートを選択して .gitignore の内容を生成",
    "download": "ダウンロード"
  },
  "ko": {
    "preview": "미리보기",
    "selectedCount": "{count}개 템플릿 선택됨",
    "previewPlaceholder": "템플릿을 선택하여 .gitignore 내용 생성",
    "download": "다운로드"
  },
  "ru": {
    "preview": "Предпросмотр",
    "selectedCount": "Выбрано шаблонов: {count}",
    "previewPlaceholder": "Выберите шаблоны для генерации содержимого .gitignore",
    "download": "Скачать"
  },
  "pt": {
    "preview": "Pré-visualização",
    "selectedCount": "{count} modelo(s) selecionado(s)",
    "previewPlaceholder": "Selecione modelos para gerar o conteúdo .gitignore",
    "download": "Baixar"
  },
  "ar": {
    "preview": "معاينة",
    "selectedCount": "تم اختيار {count} قالب/قوالب",
    "previewPlaceholder": "اختر القوالب لإنشاء محتوى .gitignore",
    "download": "تنزيل"
  },
  "hi": {
    "preview": "पूर्वावलोकन",
    "selectedCount": "{count} टेम्पलेट चयनित",
    "previewPlaceholder": ".gitignore सामग्री उत्पन्न करने के लिए टेम्पलेट चुनें",
    "download": "डाउनलोड"
  },
  "tr": {
    "preview": "Önizleme",
    "selectedCount": "{count} şablon seçildi",
    "previewPlaceholder": ".gitignore içeriği oluşturmak için şablon seçin",
    "download": "İndir"
  },
  "nl": {
    "preview": "Voorbeeld",
    "selectedCount": "{count} sjablo(o)n(en) geselecteerd",
    "previewPlaceholder": "Selecteer sjablonen om .gitignore-inhoud te genereren",
    "download": "Downloaden"
  },
  "sv": {
    "preview": "Förhandsvisning",
    "selectedCount": "{count} mall(ar) valda",
    "previewPlaceholder": "Välj mallar för att generera .gitignore-innehåll",
    "download": "Ladda ner"
  },
  "pl": {
    "preview": "Podgląd",
    "selectedCount": "Wybrano {count} szablon(ów)",
    "previewPlaceholder": "Wybierz szablony, aby wygenerować zawartość .gitignore",
    "download": "Pobierz"
  },
  "vi": {
    "preview": "Xem trước",
    "selectedCount": "Đã chọn {count} mẫu",
    "previewPlaceholder": "Chọn mẫu để tạo nội dung .gitignore",
    "download": "Tải xuống"
  },
  "th": {
    "preview": "ดูตัวอย่าง",
    "selectedCount": "เลือก {count} เทมเพลตแล้ว",
    "previewPlaceholder": "เลือกเทมเพลตเพื่อสร้างเนื้อหา .gitignore",
    "download": "ดาวน์โหลด"
  },
  "id": {
    "preview": "Pratinjau",
    "selectedCount": "{count} template dipilih",
    "previewPlaceholder": "Pilih template untuk menghasilkan konten .gitignore",
    "download": "Unduh"
  },
  "he": {
    "preview": "תצוגה מקדימה",
    "selectedCount": "נבחרו {count} תבניות",
    "previewPlaceholder": "בחר תבניות כדי ליצור תוכן .gitignore",
    "download": "הורד"
  },
  "ms": {
    "preview": "Pratonton",
    "selectedCount": "{count} templat dipilih",
    "previewPlaceholder": "Pilih templat untuk menjana kandungan .gitignore",
    "download": "Muat turun"
  },
  "no": {
    "preview": "Forhåndsvisning",
    "selectedCount": "{count} mal(er) valgt",
    "previewPlaceholder": "Velg maler for å generere .gitignore-innhold",
    "download": "Last ned"
  }
}
</i18n>
