<template>
  <ToolSectionHeader>{{ t('queueTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-empty v-if="items.length === 0" size="small" :description="t('emptyState')" />

      <template v-else>
        <div class="queue-list">
          <div
            v-for="(item, index) in items"
            :key="item.id"
            class="queue-item"
            :class="{ 'queue-item--dragging': dragIndex === index }"
            draggable="true"
            @dragstart="emit('drag-start', index)"
            @dragover.prevent
            @drop.prevent="emit('drop', index)"
            @dragend="emit('drag-end')"
          >
            <div class="queue-item__left">
              <n-icon :depth="3">
                <ReOrderDotsHorizontal24Regular />
              </n-icon>
              <n-flex vertical :size="2">
                <n-text strong>{{ index + 1 }}. {{ item.name }}</n-text>
                <n-text :depth="3" :class="{ 'queue-item__error': item.errorCode }">
                  {{ item.sizeLabel }}{{ listSeparator }}{{ itemStatus(item) }}
                </n-text>
              </n-flex>
            </div>

            <n-flex :size="4">
              <n-button
                quaternary
                circle
                size="small"
                :aria-label="t('moveUp')"
                :disabled="index === 0"
                @click="emit('move-up', index)"
              >
                <template #icon>
                  <n-icon :component="ArrowUp16Regular" />
                </template>
              </n-button>
              <n-button
                quaternary
                circle
                size="small"
                :aria-label="t('moveDown')"
                :disabled="index === items.length - 1"
                @click="emit('move-down', index)"
              >
                <template #icon>
                  <n-icon :component="ArrowDown16Regular" />
                </template>
              </n-button>
              <n-button
                quaternary
                circle
                size="small"
                :aria-label="t('preview')"
                @click="emit('preview', index)"
              >
                <template #icon>
                  <n-icon :component="Eye16Regular" />
                </template>
              </n-button>
              <n-button
                quaternary
                circle
                size="small"
                :aria-label="t('remove')"
                @click="emit('remove', index)"
              >
                <template #icon>
                  <n-icon :component="Delete16Regular" />
                </template>
              </n-button>
            </n-flex>
          </div>
        </div>
      </template>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NButton, NEmpty, NFlex, NIcon, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ReOrderDotsHorizontal24Regular from '@vicons/fluent/ReOrderDotsHorizontal24Regular'
import ArrowUp16Regular from '@vicons/fluent/ArrowUp16Regular'
import ArrowDown16Regular from '@vicons/fluent/ArrowDown16Regular'
import Eye16Regular from '@vicons/fluent/Eye16Regular'
import Delete16Regular from '@vicons/fluent/Delete16Regular'
import { PDF_ERROR } from '../pdf-errors'

export type PdfQueueItem = {
  id: string
  name: string
  sizeLabel: string
  pageCount: number | null
  isLoading: boolean
  errorCode: string | null
}

defineProps<{
  items: PdfQueueItem[]
  dragIndex: number | null
}>()

const emit = defineEmits<{
  (event: 'drag-start', index: number): void
  (event: 'drag-end'): void
  (event: 'drop', index: number): void
  (event: 'move-up', index: number): void
  (event: 'move-down', index: number): void
  (event: 'preview', index: number): void
  (event: 'remove', index: number): void
}>()

const { t } = useI18n()
const listSeparator = ' · '

const itemStatus = (item: PdfQueueItem): string => {
  if (item.isLoading) {
    return t('pageLoading')
  }

  if (item.errorCode === PDF_ERROR.Encrypted) {
    return t('encryptedError')
  }

  if (item.errorCode) {
    return t('invalidError')
  }

  if (item.pageCount === null) {
    return t('invalidError')
  }

  return t('pages', { count: item.pageCount })
}
</script>

<style scoped>
.queue-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.queue-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--n-border-color);
  background: var(--n-card-color);
}

.queue-item--dragging {
  opacity: 0.5;
}

.queue-item__left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.queue-item__error {
  color: var(--n-error-color);
}
</style>

<i18n lang="json">
{
  "en": {
    "queueTitle": "Merge queue",
    "emptyState": "Add at least two PDF files to start",
    "pageLoading": "Reading pages...",
    "pages": "{count} pages",
    "encryptedError": "Encrypted PDF",
    "invalidError": "Invalid PDF",
    "moveUp": "Move up",
    "moveDown": "Move down",
    "preview": "Preview",
    "remove": "Remove"
  },
  "zh": {
    "queueTitle": "合并队列",
    "emptyState": "至少添加两个 PDF 文件后开始",
    "pageLoading": "正在读取页数...",
    "pages": "{count} 页",
    "encryptedError": "加密 PDF",
    "invalidError": "无效 PDF",
    "moveUp": "上移",
    "moveDown": "下移",
    "preview": "预览",
    "remove": "删除"
  },
  "zh-CN": {
    "queueTitle": "合并队列",
    "emptyState": "至少添加两个 PDF 文件后开始",
    "pageLoading": "正在读取页数...",
    "pages": "{count} 页",
    "encryptedError": "加密 PDF",
    "invalidError": "无效 PDF",
    "moveUp": "上移",
    "moveDown": "下移",
    "preview": "预览",
    "remove": "删除"
  },
  "zh-TW": {
    "queueTitle": "合併佇列",
    "emptyState": "至少新增兩個 PDF 檔案後開始",
    "pageLoading": "正在讀取頁數...",
    "pages": "{count} 頁",
    "encryptedError": "加密 PDF",
    "invalidError": "無效 PDF",
    "moveUp": "上移",
    "moveDown": "下移",
    "preview": "預覽",
    "remove": "刪除"
  },
  "zh-HK": {
    "queueTitle": "合併佇列",
    "emptyState": "至少新增兩個 PDF 檔案後開始",
    "pageLoading": "正在讀取頁數...",
    "pages": "{count} 頁",
    "encryptedError": "加密 PDF",
    "invalidError": "無效 PDF",
    "moveUp": "上移",
    "moveDown": "下移",
    "preview": "預覽",
    "remove": "刪除"
  },
  "es": {
    "queueTitle": "Cola de combinación",
    "emptyState": "Agrega al menos dos PDF para empezar",
    "pageLoading": "Leyendo páginas...",
    "pages": "{count} páginas",
    "encryptedError": "PDF cifrado",
    "invalidError": "PDF inválido",
    "moveUp": "Subir",
    "moveDown": "Bajar",
    "preview": "Vista previa",
    "remove": "Eliminar"
  },
  "fr": {
    "queueTitle": "File de fusion",
    "emptyState": "Ajoutez au moins deux PDF pour commencer",
    "pageLoading": "Lecture des pages...",
    "pages": "{count} pages",
    "encryptedError": "PDF chiffré",
    "invalidError": "PDF invalide",
    "moveUp": "Monter",
    "moveDown": "Descendre",
    "preview": "Aperçu",
    "remove": "Supprimer"
  },
  "de": {
    "queueTitle": "Merge-Warteschlange",
    "emptyState": "Füge mindestens zwei PDFs hinzu, um zu starten",
    "pageLoading": "Seiten werden gelesen...",
    "pages": "{count} Seiten",
    "encryptedError": "Verschlüsseltes PDF",
    "invalidError": "Ungültiges PDF",
    "moveUp": "Nach oben",
    "moveDown": "Nach unten",
    "preview": "Vorschau",
    "remove": "Entfernen"
  },
  "it": {
    "queueTitle": "Coda di unione",
    "emptyState": "Aggiungi almeno due PDF per iniziare",
    "pageLoading": "Lettura pagine...",
    "pages": "{count} pagine",
    "encryptedError": "PDF cifrato",
    "invalidError": "PDF non valido",
    "moveUp": "Sposta su",
    "moveDown": "Sposta giù",
    "preview": "Anteprima",
    "remove": "Rimuovi"
  },
  "ja": {
    "queueTitle": "結合キュー",
    "emptyState": "開始するには PDF を 2 つ以上追加してください",
    "pageLoading": "ページ数を読み取り中...",
    "pages": "{count} ページ",
    "encryptedError": "暗号化 PDF",
    "invalidError": "無効な PDF",
    "moveUp": "上へ",
    "moveDown": "下へ",
    "preview": "プレビュー",
    "remove": "削除"
  },
  "ko": {
    "queueTitle": "병합 대기열",
    "emptyState": "시작하려면 PDF를 두 개 이상 추가하세요",
    "pageLoading": "페이지 수 읽는 중...",
    "pages": "{count}페이지",
    "encryptedError": "암호화 PDF",
    "invalidError": "잘못된 PDF",
    "moveUp": "위로",
    "moveDown": "아래로",
    "preview": "미리보기",
    "remove": "제거"
  },
  "ru": {
    "queueTitle": "Очередь слияния",
    "emptyState": "Добавьте минимум два PDF для начала",
    "pageLoading": "Чтение страниц...",
    "pages": "{count} стр.",
    "encryptedError": "Зашифрованный PDF",
    "invalidError": "Некорректный PDF",
    "moveUp": "Вверх",
    "moveDown": "Вниз",
    "preview": "Предпросмотр",
    "remove": "Удалить"
  },
  "pt": {
    "queueTitle": "Fila de mesclagem",
    "emptyState": "Adicione pelo menos dois PDFs para começar",
    "pageLoading": "Lendo páginas...",
    "pages": "{count} páginas",
    "encryptedError": "PDF criptografado",
    "invalidError": "PDF inválido",
    "moveUp": "Mover para cima",
    "moveDown": "Mover para baixo",
    "preview": "Visualizar",
    "remove": "Remover"
  },
  "ar": {
    "queueTitle": "قائمة الدمج",
    "emptyState": "أضف ملفي PDF على الأقل للبدء",
    "pageLoading": "جارٍ قراءة الصفحات...",
    "pages": "{count} صفحة",
    "encryptedError": "PDF مشفر",
    "invalidError": "PDF غير صالح",
    "moveUp": "نقل لأعلى",
    "moveDown": "نقل لأسفل",
    "preview": "معاينة",
    "remove": "إزالة"
  },
  "hi": {
    "queueTitle": "मर्ज कतार",
    "emptyState": "शुरू करने के लिए कम से कम दो PDF जोड़ें",
    "pageLoading": "पेज पढ़े जा रहे हैं...",
    "pages": "{count} पेज",
    "encryptedError": "एन्क्रिप्टेड PDF",
    "invalidError": "अमान्य PDF",
    "moveUp": "ऊपर",
    "moveDown": "नीचे",
    "preview": "प्रीव्यू",
    "remove": "हटाएं"
  },
  "tr": {
    "queueTitle": "Birleştirme kuyruğu",
    "emptyState": "Başlamak için en az iki PDF ekleyin",
    "pageLoading": "Sayfalar okunuyor...",
    "pages": "{count} sayfa",
    "encryptedError": "Şifreli PDF",
    "invalidError": "Geçersiz PDF",
    "moveUp": "Yukarı taşı",
    "moveDown": "Aşağı taşı",
    "preview": "Önizleme",
    "remove": "Kaldır"
  },
  "nl": {
    "queueTitle": "Samenvoegwachtrij",
    "emptyState": "Voeg minimaal twee PDF's toe om te starten",
    "pageLoading": "Pagina's worden gelezen...",
    "pages": "{count} pagina's",
    "encryptedError": "Versleutelde PDF",
    "invalidError": "Ongeldige PDF",
    "moveUp": "Omhoog",
    "moveDown": "Omlaag",
    "preview": "Voorbeeld",
    "remove": "Verwijderen"
  },
  "sv": {
    "queueTitle": "Sammanfogningskö",
    "emptyState": "Lägg till minst två PDF-filer för att starta",
    "pageLoading": "Läser sidor...",
    "pages": "{count} sidor",
    "encryptedError": "Krypterad PDF",
    "invalidError": "Ogiltig PDF",
    "moveUp": "Flytta upp",
    "moveDown": "Flytta ner",
    "preview": "Förhandsvisa",
    "remove": "Ta bort"
  },
  "pl": {
    "queueTitle": "Kolejka scalania",
    "emptyState": "Dodaj co najmniej dwa pliki PDF, aby rozpocząć",
    "pageLoading": "Odczytywanie stron...",
    "pages": "{count} stron",
    "encryptedError": "Zaszyfrowany PDF",
    "invalidError": "Nieprawidłowy PDF",
    "moveUp": "Przenieś w górę",
    "moveDown": "Przenieś w dół",
    "preview": "Podgląd",
    "remove": "Usuń"
  },
  "vi": {
    "queueTitle": "Hàng đợi gộp",
    "emptyState": "Thêm ít nhất hai tệp PDF để bắt đầu",
    "pageLoading": "Đang đọc số trang...",
    "pages": "{count} trang",
    "encryptedError": "PDF mã hóa",
    "invalidError": "PDF không hợp lệ",
    "moveUp": "Lên",
    "moveDown": "Xuống",
    "preview": "Xem trước",
    "remove": "Xóa"
  },
  "th": {
    "queueTitle": "คิวการรวม",
    "emptyState": "เพิ่มไฟล์ PDF อย่างน้อยสองไฟล์เพื่อเริ่ม",
    "pageLoading": "กำลังอ่านจำนวนหน้า...",
    "pages": "{count} หน้า",
    "encryptedError": "PDF เข้ารหัส",
    "invalidError": "PDF ไม่ถูกต้อง",
    "moveUp": "เลื่อนขึ้น",
    "moveDown": "เลื่อนลง",
    "preview": "พรีวิว",
    "remove": "ลบ"
  },
  "id": {
    "queueTitle": "Antrean gabung",
    "emptyState": "Tambahkan minimal dua PDF untuk mulai",
    "pageLoading": "Membaca halaman...",
    "pages": "{count} halaman",
    "encryptedError": "PDF terenkripsi",
    "invalidError": "PDF tidak valid",
    "moveUp": "Naik",
    "moveDown": "Turun",
    "preview": "Pratinjau",
    "remove": "Hapus"
  },
  "he": {
    "queueTitle": "תור מיזוג",
    "emptyState": "הוסף לפחות שני קובצי PDF כדי להתחיל",
    "pageLoading": "קורא עמודים...",
    "pages": "{count} עמודים",
    "encryptedError": "PDF מוצפן",
    "invalidError": "PDF לא תקין",
    "moveUp": "העלה",
    "moveDown": "הורד",
    "preview": "תצוגה מקדימה",
    "remove": "הסר"
  },
  "ms": {
    "queueTitle": "Baris gabung",
    "emptyState": "Tambah sekurang-kurangnya dua PDF untuk mula",
    "pageLoading": "Membaca halaman...",
    "pages": "{count} halaman",
    "encryptedError": "PDF disulitkan",
    "invalidError": "PDF tidak sah",
    "moveUp": "Naik",
    "moveDown": "Turun",
    "preview": "Pratonton",
    "remove": "Buang"
  },
  "no": {
    "queueTitle": "Sammenslåingskø",
    "emptyState": "Legg til minst to PDF-filer for å starte",
    "pageLoading": "Leser sider...",
    "pages": "{count} sider",
    "encryptedError": "Kryptert PDF",
    "invalidError": "Ugyldig PDF",
    "moveUp": "Flytt opp",
    "moveDown": "Flytt ned",
    "preview": "Forhåndsvis",
    "remove": "Fjern"
  }
}
</i18n>
