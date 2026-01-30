<template>
  <ToolSectionHeader>{{ t('output') }}</ToolSectionHeader>
  <ToolSection>
    <n-space vertical :size="12">
      <n-flex align="center" justify="space-between">
        <n-text depth="3">{{ t('output') }}</n-text>
        <n-flex align="center" :size="8">
          <CopyToClipboardButton v-if="hasOutput" :content="xmlContent" />
          <n-button
            text
            tag="a"
            :href="downloadHref"
            :download="downloadName"
            :disabled="!downloadHref"
            data-testid="download-sitemap"
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
        :value="xmlContent"
        type="textarea"
        readonly
        :autosize="{ minRows: 10, maxRows: 24 }"
        data-testid="sitemap-output"
      />
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { NButton, NFlex, NIcon, NInput, NSpace, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import type { Mode } from '../sitemapState'

const props = defineProps<{
  mode: Mode
  xmlContent: string
}>()

const { t } = useI18n()

const hasOutput = computed(() => props.xmlContent.trim().length > 0)
const downloadName = computed(() =>
  props.mode === 'sitemapindex' ? 'sitemap-index.xml' : 'sitemap.xml',
)
const downloadBlob = computed(() =>
  hasOutput.value ? new Blob([props.xmlContent], { type: 'application/xml' }) : null,
)
const downloadUrl = useObjectUrl(downloadBlob)
const downloadHref = computed(() =>
  hasOutput.value ? (downloadUrl.value ?? undefined) : undefined,
)
</script>

<i18n lang="json">
{
  "en": {
    "output": "Output",
    "download": "Download sitemap.xml",
    "emptyOutput": "No content to export yet."
  },
  "zh": {
    "output": "输出",
    "download": "下载 sitemap.xml",
    "emptyOutput": "暂无可导出的内容。"
  },
  "zh-CN": {
    "output": "输出",
    "download": "下载 sitemap.xml",
    "emptyOutput": "暂无可导出的内容。"
  },
  "zh-TW": {
    "output": "輸出",
    "download": "下載 sitemap.xml",
    "emptyOutput": "目前沒有可匯出的內容。"
  },
  "zh-HK": {
    "output": "輸出",
    "download": "下載 sitemap.xml",
    "emptyOutput": "目前沒有可匯出的內容。"
  },
  "es": {
    "output": "Salida",
    "download": "Descargar sitemap.xml",
    "emptyOutput": "Aún no hay contenido para exportar."
  },
  "fr": {
    "output": "Sortie",
    "download": "Télécharger sitemap.xml",
    "emptyOutput": "Aucun contenu à exporter pour l'instant."
  },
  "de": {
    "output": "Ausgabe",
    "download": "sitemap.xml herunterladen",
    "emptyOutput": "Noch kein Inhalt zum Exportieren."
  },
  "it": {
    "output": "Output",
    "download": "Scarica sitemap.xml",
    "emptyOutput": "Nessun contenuto da esportare."
  },
  "ja": {
    "output": "出力",
    "download": "sitemap.xml をダウンロード",
    "emptyOutput": "まだ出力内容がありません。"
  },
  "ko": {
    "output": "출력",
    "download": "sitemap.xml 다운로드",
    "emptyOutput": "내보낼 내용이 없습니다."
  },
  "ru": {
    "output": "Вывод",
    "download": "Скачать sitemap.xml",
    "emptyOutput": "Нет содержимого для экспорта."
  },
  "pt": {
    "output": "Saída",
    "download": "Baixar sitemap.xml",
    "emptyOutput": "Ainda não há conteúdo para exportar."
  },
  "ar": {
    "output": "المخرجات",
    "download": "تنزيل sitemap.xml",
    "emptyOutput": "لا يوجد محتوى للتصدير بعد."
  },
  "hi": {
    "output": "आउटपुट",
    "download": "sitemap.xml डाउनलोड करें",
    "emptyOutput": "अभी निर्यात करने के लिए कोई सामग्री नहीं है।"
  },
  "tr": {
    "output": "Çıktı",
    "download": "sitemap.xml indir",
    "emptyOutput": "Dışa aktarılacak içerik yok."
  },
  "nl": {
    "output": "Uitvoer",
    "download": "sitemap.xml downloaden",
    "emptyOutput": "Nog geen inhoud om te exporteren."
  },
  "sv": {
    "output": "Utdata",
    "download": "Ladda ner sitemap.xml",
    "emptyOutput": "Inget innehåll att exportera än."
  },
  "pl": {
    "output": "Wynik",
    "download": "Pobierz sitemap.xml",
    "emptyOutput": "Brak treści do eksportu."
  },
  "vi": {
    "output": "Kết quả",
    "download": "Tải sitemap.xml",
    "emptyOutput": "Chưa có nội dung để xuất."
  },
  "th": {
    "output": "ผลลัพธ์",
    "download": "ดาวน์โหลด sitemap.xml",
    "emptyOutput": "ยังไม่มีเนื้อหาสำหรับส่งออก"
  },
  "id": {
    "output": "Output",
    "download": "Unduh sitemap.xml",
    "emptyOutput": "Belum ada konten untuk diekspor."
  },
  "he": {
    "output": "פלט",
    "download": "הורד sitemap.xml",
    "emptyOutput": "אין תוכן לייצוא עדיין."
  },
  "ms": {
    "output": "Output",
    "download": "Muat turun sitemap.xml",
    "emptyOutput": "Belum ada kandungan untuk dieksport."
  },
  "no": {
    "output": "Utdata",
    "download": "Last ned sitemap.xml",
    "emptyOutput": "Ingen innhold å eksportere ennå."
  }
}
</i18n>
