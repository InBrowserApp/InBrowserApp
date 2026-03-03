<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-text depth="3">{{ t('hint') }}</n-text>

      <n-spin :show="isLoadingDocument">
        <div class="preview-grid">
          <div v-for="item in pagedItems" :key="item.page" class="preview-cell">
            <n-checkbox
              class="page-select-toggle"
              size="large"
              :checked="selectedPageSet.has(item.page)"
              :aria-label="t('selectPage', { page: item.page })"
              @click.stop="emit('toggle-page', item.page, $event)"
            />

            <button class="page-card" type="button" @click="emit('open-preview', item.page)">
              <div class="page-card__thumbnail">
                <n-spin v-if="item.isLoading" size="small" />
                <n-empty
                  v-else-if="item.hasError"
                  size="small"
                  :description="t('previewUnavailable')"
                />
                <img
                  v-else-if="item.thumbnailUrl"
                  :src="item.thumbnailUrl"
                  :alt="t('thumbnailAlt', { page: item.page })"
                />
              </div>
              <span class="page-card__badge">{{ item.page }}</span>
            </button>
          </div>
        </div>

        <n-pagination
          v-if="items.length > PREVIEW_PAGE_SIZE"
          style="margin-top: 12px"
          :page="currentPreviewPage"
          :page-size="PREVIEW_PAGE_SIZE"
          :item-count="items.length"
          @update:page="currentPreviewPage = $event"
        />
      </n-spin>

      <n-alert v-if="isRenderingThumbnails" type="info" :bordered="false">
        {{ t('rendering') }}
      </n-alert>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { NAlert, NCheckbox, NEmpty, NFlex, NPagination, NSpin, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { PreviewItem } from './usePdfSplitter'

const props = defineProps<{
  items: PreviewItem[]
  selectedPageSet: Set<number>
  isLoadingDocument: boolean
  isRenderingThumbnails: boolean
}>()

const emit = defineEmits<{
  (event: 'toggle-page', page: number, mouseEvent: MouseEvent): void
  (event: 'open-preview', page: number): void
}>()

const PREVIEW_PAGE_SIZE = 60
const { t } = useI18n({ useScope: 'local' })

const currentPreviewPage = ref(1)

const totalPreviewPages = computed(() =>
  Math.max(1, Math.ceil(props.items.length / PREVIEW_PAGE_SIZE)),
)

const pagedItems = computed(() => {
  const start = (currentPreviewPage.value - 1) * PREVIEW_PAGE_SIZE
  return props.items.slice(start, start + PREVIEW_PAGE_SIZE)
})

watch(totalPreviewPages, (total) => {
  if (currentPreviewPage.value > total) {
    currentPreviewPage.value = total
  }
})

watch(
  () => props.items.length,
  (count) => {
    if (!count) {
      currentPreviewPage.value = 1
    }
  },
)
</script>

<style scoped>
.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 10px;
}

.preview-cell {
  position: relative;
}

.page-card {
  position: relative;
  width: 100%;
  border: 1px solid color-mix(in srgb, var(--n-border-color) 74%, #d7dbe1 26%);
  border-radius: 10px;
  background: #fff;
  padding: 6px;
  cursor: pointer;
  text-align: left;
  box-shadow:
    0 1px 0 color-mix(in srgb, #fff 75%, transparent) inset,
    0 4px 10px color-mix(in srgb, #111827 12%, transparent);
}

.page-select-toggle {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
}

.page-select-toggle :deep(.n-checkbox__label) {
  display: none;
}

.page-select-toggle :deep(.n-checkbox-box-wrapper) {
  margin-right: 0;
}

.page-card__badge {
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 12px;
  color: var(--n-text-color-2);
  border: 1px solid color-mix(in srgb, var(--n-border-color) 74%, #a7adb6 26%);
  background: color-mix(in srgb, var(--n-color-target) 72%, #a7adb6 28%);
  backdrop-filter: blur(8px);
}

.page-card__thumbnail {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--n-border-color) 75%, #e5e7eb 25%);
  background: linear-gradient(180deg, #fff 0%, #fafbfc 100%);
}

.page-card__thumbnail img {
  width: 100%;
  height: auto;
  display: block;
}
</style>

<i18n lang="json">
{
  "en": {
    "title": "Page Preview",
    "hint": "Click a page to preview. Use the checkbox at top-right to select pages. Hold Shift for range.",
    "previewUnavailable": "Preview unavailable",
    "selectPage": "Select page {page}",
    "rendering": "Rendering page previews in the background...",
    "thumbnailAlt": "Page {page}"
  },
  "zh": {
    "title": "页面预览",
    "hint": "点击页面即可预览。使用右上角复选框选择页面。按住 Shift 可连续选择范围。",
    "previewUnavailable": "无法预览",
    "selectPage": "选择第 {page} 页",
    "rendering": "正在后台渲染页面预览...",
    "thumbnailAlt": "第 {page} 页"
  },
  "zh-CN": {
    "title": "页面预览",
    "hint": "点击页面即可预览。使用右上角复选框选择页面。按住 Shift 可连续选择范围。",
    "previewUnavailable": "无法预览",
    "selectPage": "选择第 {page} 页",
    "rendering": "正在后台渲染页面预览...",
    "thumbnailAlt": "第 {page} 页"
  },
  "zh-TW": {
    "title": "頁面預覽",
    "hint": "點擊頁面即可預覽。使用右上角核取方塊選擇頁面。按住 Shift 可連續選取範圍。",
    "previewUnavailable": "無法預覽",
    "selectPage": "選擇第 {page} 頁",
    "rendering": "正在背景產生頁面預覽...",
    "thumbnailAlt": "第 {page} 頁"
  },
  "zh-HK": {
    "title": "頁面預覽",
    "hint": "點擊頁面即可預覽。使用右上角核取方塊選擇頁面。按住 Shift 可連續選取範圍。",
    "previewUnavailable": "無法預覽",
    "selectPage": "選擇第 {page} 頁",
    "rendering": "正在背景產生頁面預覽...",
    "thumbnailAlt": "第 {page} 頁"
  },
  "es": {
    "title": "Vista previa de páginas",
    "hint": "Haz clic en una página para verla. Usa la casilla de la esquina superior derecha para seleccionar páginas. Mantén Shift para seleccionar rangos.",
    "previewUnavailable": "Vista previa no disponible",
    "selectPage": "Seleccionar página {page}",
    "rendering": "Renderizando vistas previas de páginas en segundo plano...",
    "thumbnailAlt": "Página {page}"
  },
  "fr": {
    "title": "Aperçu des pages",
    "hint": "Cliquez sur une page pour l'aperçu. Utilisez la case en haut à droite pour sélectionner des pages. Maintenez Shift pour une plage.",
    "previewUnavailable": "Aperçu indisponible",
    "selectPage": "Sélectionner la page {page}",
    "rendering": "Rendu des aperçus de pages en arrière-plan...",
    "thumbnailAlt": "Page {page}"
  },
  "de": {
    "title": "Seitenvorschau",
    "hint": "Klicken Sie auf eine Seite zur Vorschau. Nutzen Sie das Kontrollkästchen oben rechts zum Auswählen. Mit Shift wählen Sie Bereiche.",
    "previewUnavailable": "Vorschau nicht verfügbar",
    "selectPage": "Seite {page} auswählen",
    "rendering": "Seitenvorschauen werden im Hintergrund gerendert...",
    "thumbnailAlt": "Seite {page}"
  },
  "it": {
    "title": "Anteprima pagine",
    "hint": "Fai clic su una pagina per l'anteprima. Usa la casella in alto a destra per selezionare le pagine. Tieni premuto Shift per gli intervalli.",
    "previewUnavailable": "Anteprima non disponibile",
    "selectPage": "Seleziona pagina {page}",
    "rendering": "Rendering delle anteprime in background...",
    "thumbnailAlt": "Pagina {page}"
  },
  "ja": {
    "title": "ページプレビュー",
    "hint": "ページをクリックしてプレビューします。右上のチェックボックスで選択します。範囲選択は Shift を押しながら。",
    "previewUnavailable": "プレビューを表示できません",
    "selectPage": "{page} ページを選択",
    "rendering": "ページプレビューをバックグラウンドで生成中...",
    "thumbnailAlt": "ページ {page}"
  },
  "ko": {
    "title": "페이지 미리보기",
    "hint": "페이지를 클릭해 미리보기를 확인하세요. 오른쪽 위 체크박스로 페이지를 선택하세요. 범위 선택은 Shift를 누른 채로.",
    "previewUnavailable": "미리보기를 사용할 수 없음",
    "selectPage": "{page}페이지 선택",
    "rendering": "백그라운드에서 페이지 미리보기를 렌더링하는 중...",
    "thumbnailAlt": "페이지 {page}"
  },
  "ru": {
    "title": "Предпросмотр страниц",
    "hint": "Нажмите страницу для предпросмотра. Используйте флажок в правом верхнем углу для выбора. Удерживайте Shift для диапазона.",
    "previewUnavailable": "Предпросмотр недоступен",
    "selectPage": "Выбрать страницу {page}",
    "rendering": "Предпросмотры страниц рендерятся в фоне...",
    "thumbnailAlt": "Страница {page}"
  },
  "pt": {
    "title": "Pré-visualização de páginas",
    "hint": "Clique em uma página para visualizar. Use a caixa no canto superior direito para selecionar páginas. Segure Shift para intervalos.",
    "previewUnavailable": "Pré-visualização indisponível",
    "selectPage": "Selecionar página {page}",
    "rendering": "Renderizando pré-visualizações de páginas em segundo plano...",
    "thumbnailAlt": "Página {page}"
  },
  "ar": {
    "title": "معاينة الصفحات",
    "hint": "انقر الصفحة للمعاينة. استخدم مربع الاختيار أعلى اليمين لتحديد الصفحات. اضغط Shift لتحديد نطاق.",
    "previewUnavailable": "المعاينة غير متاحة",
    "selectPage": "تحديد الصفحة {page}",
    "rendering": "يتم إنشاء معاينات الصفحات في الخلفية...",
    "thumbnailAlt": "الصفحة {page}"
  },
  "hi": {
    "title": "पेज प्रीव्यू",
    "hint": "प्रीव्यू देखने के लिए पेज पर क्लिक करें। चुनने के लिए ऊपर-दाईं ओर चेकबॉक्स इस्तेमाल करें। रेंज के लिए Shift दबाकर रखें।",
    "previewUnavailable": "प्रीव्यू उपलब्ध नहीं है",
    "selectPage": "पेज {page} चुनें",
    "rendering": "बैकग्राउंड में पेज प्रीव्यू रेंडर हो रहे हैं...",
    "thumbnailAlt": "पेज {page}"
  },
  "tr": {
    "title": "Sayfa Önizleme",
    "hint": "Önizleme için bir sayfaya tıklayın. Sayfa seçmek için sağ üstteki onay kutusunu kullanın. Aralık seçimi için Shift'e basılı tutun.",
    "previewUnavailable": "Önizleme kullanılamıyor",
    "selectPage": "Sayfa {page} seç",
    "rendering": "Sayfa önizlemeleri arka planda oluşturuluyor...",
    "thumbnailAlt": "Sayfa {page}"
  },
  "nl": {
    "title": "Paginavoorbeeld",
    "hint": "Klik op een pagina voor voorbeeld. Gebruik het selectievak rechtsboven om pagina's te kiezen. Houd Shift ingedrukt voor bereiken.",
    "previewUnavailable": "Voorbeeld niet beschikbaar",
    "selectPage": "Pagina {page} selecteren",
    "rendering": "Paginavoorbeelden worden op de achtergrond gerenderd...",
    "thumbnailAlt": "Pagina {page}"
  },
  "sv": {
    "title": "Sidförhandsvisning",
    "hint": "Klicka på en sida för förhandsvisning. Använd kryssrutan uppe till höger för att välja sidor. Håll Shift för intervall.",
    "previewUnavailable": "Förhandsvisning ej tillgänglig",
    "selectPage": "Välj sida {page}",
    "rendering": "Sidförhandsvisningar renderas i bakgrunden...",
    "thumbnailAlt": "Sida {page}"
  },
  "pl": {
    "title": "Podgląd stron",
    "hint": "Kliknij stronę, aby podejrzeć. Użyj pola wyboru w prawym górnym rogu, aby zaznaczać strony. Przytrzymaj Shift dla zakresu.",
    "previewUnavailable": "Podgląd niedostępny",
    "selectPage": "Wybierz stronę {page}",
    "rendering": "Trwa renderowanie podglądów stron w tle...",
    "thumbnailAlt": "Strona {page}"
  },
  "vi": {
    "title": "Xem trước trang",
    "hint": "Nhấp vào trang để xem trước. Dùng ô chọn ở góc trên bên phải để chọn trang. Giữ Shift để chọn theo dải.",
    "previewUnavailable": "Không có bản xem trước",
    "selectPage": "Chọn trang {page}",
    "rendering": "Đang dựng xem trước trang ở nền...",
    "thumbnailAlt": "Trang {page}"
  },
  "th": {
    "title": "พรีวิวหน้า",
    "hint": "คลิกหน้าที่ต้องการเพื่อดูพรีวิว ใช้ช่องทำเครื่องหมายมุมขวาบนเพื่อเลือกหน้า กด Shift ค้างเพื่อเลือกช่วง",
    "previewUnavailable": "ไม่สามารถแสดงพรีวิวได้",
    "selectPage": "เลือกหน้า {page}",
    "rendering": "กำลังเรนเดอร์พรีวิวหน้าอยู่เบื้องหลัง...",
    "thumbnailAlt": "หน้า {page}"
  },
  "id": {
    "title": "Pratinjau Halaman",
    "hint": "Klik halaman untuk melihat pratinjau. Gunakan kotak centang di kanan atas untuk memilih halaman. Tahan Shift untuk rentang.",
    "previewUnavailable": "Pratinjau tidak tersedia",
    "selectPage": "Pilih halaman {page}",
    "rendering": "Sedang merender pratinjau halaman di latar belakang...",
    "thumbnailAlt": "Halaman {page}"
  },
  "he": {
    "title": "תצוגת דפים מקדימה",
    "hint": "לחץ על עמוד לתצוגה מקדימה. השתמש בתיבת הסימון בפינה הימנית העליונה כדי לבחור עמודים. החזק Shift לטווח.",
    "previewUnavailable": "תצוגה מקדימה לא זמינה",
    "selectPage": "בחר עמוד {page}",
    "rendering": "תצוגות מקדימות של עמודים נטענות ברקע...",
    "thumbnailAlt": "עמוד {page}"
  },
  "ms": {
    "title": "Pratonton Halaman",
    "hint": "Klik halaman untuk pratonton. Gunakan kotak tanda di penjuru kanan atas untuk memilih halaman. Tahan Shift untuk julat.",
    "previewUnavailable": "Pratonton tidak tersedia",
    "selectPage": "Pilih halaman {page}",
    "rendering": "Sedang merender pratonton halaman di latar belakang...",
    "thumbnailAlt": "Halaman {page}"
  },
  "no": {
    "title": "Forhåndsvisning av sider",
    "hint": "Klikk en side for forhåndsvisning. Bruk avkrysningsboksen øverst til høyre for å velge sider. Hold Shift for områdevalg.",
    "previewUnavailable": "Forhåndsvisning utilgjengelig",
    "selectPage": "Velg side {page}",
    "rendering": "Gjengir sideforhåndsvisninger i bakgrunnen...",
    "thumbnailAlt": "Side {page}"
  }
}
</i18n>
