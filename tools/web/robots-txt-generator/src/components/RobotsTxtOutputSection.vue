<template>
  <ToolSectionHeader>{{ t('output') }}</ToolSectionHeader>
  <ToolSection>
    <n-space vertical :size="12">
      <n-flex align="center" justify="space-between">
        <n-text depth="3">{{ t('output') }}</n-text>
        <n-flex align="center" :size="8">
          <CopyToClipboardButton v-if="hasOutput" :content="robotsContent" />
          <n-button
            text
            tag="a"
            :href="downloadHref"
            download="robots.txt"
            :disabled="!downloadHref"
            data-testid="download-robots"
          >
            <template #icon>
              <n-icon :component="ArrowDownload16Regular" />
            </template>
            {{ t('download') }}
          </n-button>
        </n-flex>
      </n-flex>

      <n-text v-if="!hasOutput" depth="3">{{ t('emptyOutput') }}</n-text>

      <n-input
        :value="robotsContent"
        type="textarea"
        readonly
        :autosize="{ minRows: 10, maxRows: 24 }"
        data-testid="robots-output"
      />
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NIcon, NInput, NSpace, NText } from 'naive-ui'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'

defineProps<{
  robotsContent: string
  hasOutput: boolean
  downloadHref?: string
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "output": "Output",
    "download": "Download robots.txt",
    "emptyOutput": "No content to export yet."
  },
  "zh": {
    "output": "输出",
    "download": "下载 robots.txt",
    "emptyOutput": "暂无可导出的内容。"
  },
  "zh-CN": {
    "output": "输出",
    "download": "下载 robots.txt",
    "emptyOutput": "暂无可导出的内容。"
  },
  "zh-TW": {
    "output": "輸出",
    "download": "下載 robots.txt",
    "emptyOutput": "目前沒有可匯出的內容。"
  },
  "zh-HK": {
    "output": "輸出",
    "download": "下載 robots.txt",
    "emptyOutput": "目前沒有可匯出的內容。"
  },
  "es": {
    "output": "Salida",
    "download": "Descargar robots.txt",
    "emptyOutput": "Aún no hay contenido para exportar."
  },
  "fr": {
    "output": "Sortie",
    "download": "Télécharger robots.txt",
    "emptyOutput": "Aucun contenu à exporter pour l'instant."
  },
  "de": {
    "output": "Ausgabe",
    "download": "robots.txt herunterladen",
    "emptyOutput": "Noch kein Inhalt zum Exportieren."
  },
  "it": {
    "output": "Output",
    "download": "Scarica robots.txt",
    "emptyOutput": "Nessun contenuto da esportare."
  },
  "ja": {
    "output": "出力",
    "download": "robots.txt をダウンロード",
    "emptyOutput": "エクスポートする内容がありません。"
  },
  "ko": {
    "output": "출력",
    "download": "robots.txt 다운로드",
    "emptyOutput": "내보낼 내용이 없습니다."
  },
  "ru": {
    "output": "Вывод",
    "download": "Скачать robots.txt",
    "emptyOutput": "Нет содержимого для экспорта."
  },
  "pt": {
    "output": "Saída",
    "download": "Baixar robots.txt",
    "emptyOutput": "Ainda não há conteúdo para exportar."
  },
  "ar": {
    "output": "الإخراج",
    "download": "تنزيل robots.txt",
    "emptyOutput": "لا يوجد محتوى للتصدير بعد."
  },
  "hi": {
    "output": "आउटपुट",
    "download": "robots.txt डाउनलोड करें",
    "emptyOutput": "अभी निर्यात करने के लिए कोई सामग्री नहीं है।"
  },
  "tr": {
    "output": "Çıktı",
    "download": "robots.txt indir",
    "emptyOutput": "Henüz dışa aktarılacak içerik yok."
  },
  "nl": {
    "output": "Uitvoer",
    "download": "robots.txt downloaden",
    "emptyOutput": "Nog geen inhoud om te exporteren."
  },
  "sv": {
    "output": "Utdata",
    "download": "Ladda ner robots.txt",
    "emptyOutput": "Inget att exportera ännu."
  },
  "pl": {
    "output": "Wyjście",
    "download": "Pobierz robots.txt",
    "emptyOutput": "Brak treści do eksportu."
  },
  "vi": {
    "output": "Kết quả",
    "download": "Tải robots.txt",
    "emptyOutput": "Chưa có nội dung để xuất."
  },
  "th": {
    "output": "ผลลัพธ์",
    "download": "ดาวน์โหลด robots.txt",
    "emptyOutput": "ยังไม่มีเนื้อหาสำหรับส่งออก"
  },
  "id": {
    "output": "Keluaran",
    "download": "Unduh robots.txt",
    "emptyOutput": "Belum ada konten untuk diekspor."
  },
  "he": {
    "output": "פלט",
    "download": "הורד robots.txt",
    "emptyOutput": "אין תוכן לייצוא עדיין."
  },
  "ms": {
    "output": "Output",
    "download": "Muat turun robots.txt",
    "emptyOutput": "Belum ada kandungan untuk dieksport."
  },
  "no": {
    "output": "Utdata",
    "download": "Last ned robots.txt",
    "emptyOutput": "Ingen innhold å eksportere ennå."
  }
}
</i18n>
