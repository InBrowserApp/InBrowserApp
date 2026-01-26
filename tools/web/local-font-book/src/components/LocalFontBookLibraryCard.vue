<template>
  <n-card :title="title" class="library-card">
    <template #header-extra>
      <n-button
        text
        size="small"
        :disabled="!isSupported || isLoading"
        :loading="isLoading"
        @click="emit('load-fonts')"
        data-testid="load-fonts"
      >
        <template #icon>
          <n-icon :component="FolderOpen16Regular" />
        </template>
        {{ t('load-button') }}
      </n-button>
    </template>

    <n-text depth="3" class="card-hint">{{ t('library-hint') }}</n-text>

    <n-alert
      v-show="statusMessage"
      :type="statusType"
      :show-icon="false"
      class="status-alert"
      data-testid="status-message"
    >
      {{ statusMessage }}
    </n-alert>

    <n-input
      :value="searchQuery"
      :placeholder="t('search-placeholder')"
      clearable
      class="search-input"
      data-testid="search-input"
      @update:value="emit('update:searchQuery', $event)"
    />

    <n-flex align="center" :size="12" :wrap="true" class="filter-row">
      <n-select
        :value="filterStyle"
        :options="styleOptions"
        size="small"
        class="filter-control"
        data-testid="style-filter"
        @update:value="emit('update:filterStyle', $event)"
      />
      <n-select
        :value="sortBy"
        :options="sortOptions"
        size="small"
        class="filter-control"
        data-testid="sort-by"
        @update:value="emit('update:sortBy', $event)"
      />
      <n-flex align="center" :size="8">
        <n-text depth="3">{{ t('group-label') }}</n-text>
        <n-switch
          :value="groupByFamily"
          size="small"
          data-testid="group-toggle"
          @update:value="emit('update:groupByFamily', $event)"
        />
      </n-flex>
    </n-flex>

    <n-text v-show="fontCountLabel" depth="3" class="count-label">
      {{ fontCountLabel }}
    </n-text>

    <n-scrollbar class="font-scroll" data-testid="font-list">
      <div class="font-list">
        <template v-if="displayGroups.length">
          <div v-for="group in displayGroups" :key="group.id" class="font-group">
            <div v-if="groupByFamily" class="font-group__title">{{ group.label }}</div>
            <div class="font-group__list">
              <button
                v-for="font in group.items"
                :key="font.id"
                type="button"
                class="font-card"
                :class="{ 'font-card--active': font.id === activeFontId }"
                :style="fontCardStyle(font)"
                :data-testid="`font-${font.id}`"
                @click="emit('select-font', font.id)"
              >
                <div class="font-card__name">{{ font.displayName }}</div>
                <div class="font-card__meta">
                  <span class="font-card__family">{{ font.displayFamily }}</span>
                  <span class="font-card__style">{{ font.displayStyle }}</span>
                </div>
              </button>
            </div>
          </div>
        </template>
        <n-text v-else depth="3" class="empty-text" data-testid="no-results">
          {{ t('no-results') }}
        </n-text>
      </div>
    </n-scrollbar>
  </n-card>
</template>

<script setup lang="ts">
import type { AlertType } from 'naive-ui'
import type { CSSProperties } from 'vue'
import {
  NAlert,
  NButton,
  NCard,
  NFlex,
  NIcon,
  NInput,
  NScrollbar,
  NSelect,
  NSwitch,
  NText,
} from 'naive-ui'
import FolderOpen16Regular from '@vicons/fluent/FolderOpen16Regular'
import { useI18n } from 'vue-i18n'
import type { DisplayFont, FontGroup } from './types'

type SelectOption = {
  label: string
  value: string
}

defineProps<{
  title: string
  isSupported: boolean
  isLoading: boolean
  statusMessage: string
  statusType: AlertType
  searchQuery: string
  filterStyle: string
  sortBy: string
  groupByFamily: boolean
  styleOptions: SelectOption[]
  sortOptions: SelectOption[]
  fontCountLabel: string
  displayGroups: FontGroup[]
  activeFontId: string
  fontCardStyle: (font: DisplayFont) => CSSProperties
}>()

const emit = defineEmits<{
  (event: 'load-fonts'): void
  (event: 'select-font', fontId: string): void
  (event: 'update:searchQuery', value: string): void
  (event: 'update:filterStyle', value: string): void
  (event: 'update:sortBy', value: string): void
  (event: 'update:groupByFamily', value: boolean): void
}>()

const { t } = useI18n()
</script>

<style scoped>
.library-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-hint {
  color: rgba(100, 116, 139, 0.9);
  font-size: 13px;
  margin-top: -8px;
  margin-bottom: 8px;
}

.status-alert {
  margin-top: 4px;
}

.search-input {
  width: 100%;
  margin-bottom: 12px;
}

.filter-row :deep(.n-select) {
  min-width: 160px;
  flex: 1;
}

.filter-control {
  min-width: 140px;
}

.count-label {
  margin-top: 4px;
}

.font-scroll {
  max-height: 90vh;
}

.font-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-right: 4px;
}

.font-group__title {
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(100, 116, 139, 0.85);
  margin-bottom: 8px;
}

.font-group__list {
  display: grid;
  gap: 8px;
}

.font-card {
  text-align: left;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: rgba(248, 250, 252, 0.8);
  padding: 10px 12px;
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
  cursor: pointer;
}

.font-card__name {
  font-weight: 600;
  font-size: 14px;
}

.font-card__meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 12px;
  color: rgba(100, 116, 139, 0.9);
}

.font-card__style {
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.font-card--active {
  border-color: rgba(59, 130, 246, 0.7);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  background: #ffffff;
}

.empty-text {
  padding: 12px 0;
}
</style>

<i18n lang="json">
{
  "en": {
    "library-hint": "Load and browse the fonts installed on your device.",
    "load-button": "Load local fonts",
    "search-placeholder": "Search by family, name, or PostScript…",
    "group-label": "Group by family",
    "no-results": "No fonts match your filters."
  },
  "zh": {
    "library-hint": "加载并浏览设备上安装的字体。",
    "load-button": "加载本地字体",
    "search-placeholder": "按家族、名称或 PostScript 搜索…",
    "group-label": "按家族分组",
    "no-results": "没有匹配的字体。"
  },
  "zh-CN": {
    "library-hint": "加载并浏览设备上安装的字体。",
    "load-button": "加载本地字体",
    "search-placeholder": "按家族、名称或 PostScript 搜索…",
    "group-label": "按家族分组",
    "no-results": "没有匹配的字体。"
  },
  "zh-TW": {
    "library-hint": "載入並瀏覽裝置上安裝的字型。",
    "load-button": "載入本機字型",
    "search-placeholder": "以家族、名稱或 PostScript 搜尋…",
    "group-label": "依家族分組",
    "no-results": "找不到符合的字型。"
  },
  "zh-HK": {
    "library-hint": "載入並瀏覽裝置上安裝的字體。",
    "load-button": "載入本機字體",
    "search-placeholder": "按家族、名稱或 PostScript 搜尋…",
    "group-label": "按家族分組",
    "no-results": "沒有符合的字體。"
  },
  "es": {
    "library-hint": "Carga y explora las fuentes instaladas en tu dispositivo.",
    "load-button": "Cargar fuentes locales",
    "search-placeholder": "Buscar por familia, nombre o PostScript…",
    "group-label": "Agrupar por familia",
    "no-results": "No hay fuentes que coincidan con tus filtros."
  },
  "fr": {
    "library-hint": "Chargez et parcourez les polices installées sur votre appareil.",
    "load-button": "Charger les polices locales",
    "search-placeholder": "Rechercher par famille, nom ou PostScript…",
    "group-label": "Regrouper par famille",
    "no-results": "Aucune police ne correspond à vos filtres."
  },
  "de": {
    "library-hint": "Laden und durchsuchen Sie die auf Ihrem Gerät installierten Schriften.",
    "load-button": "Lokale Schriften laden",
    "search-placeholder": "Nach Familie, Name oder PostScript suchen…",
    "group-label": "Nach Familie gruppieren",
    "no-results": "Keine Schriften passen zu den Filtern."
  },
  "it": {
    "library-hint": "Carica e sfoglia i font installati sul tuo dispositivo.",
    "load-button": "Carica font locali",
    "search-placeholder": "Cerca per famiglia, nome o PostScript…",
    "group-label": "Raggruppa per famiglia",
    "no-results": "Nessun font corrisponde ai filtri."
  },
  "ja": {
    "library-hint": "端末にインストールされたフォントを読み込んで閲覧します。",
    "load-button": "ローカルフォントを読み込む",
    "search-placeholder": "ファミリー名、名称、PostScript で検索…",
    "group-label": "ファミリーでグループ化",
    "no-results": "条件に一致するフォントがありません。"
  },
  "ko": {
    "library-hint": "기기에 설치된 폰트를 불러와 탐색합니다.",
    "load-button": "로컬 폰트 불러오기",
    "search-placeholder": "패밀리, 이름 또는 PostScript로 검색…",
    "group-label": "패밀리별 그룹",
    "no-results": "필터에 맞는 폰트가 없습니다."
  },
  "ru": {
    "library-hint": "Загрузите и просматривайте шрифты, установленные на устройстве.",
    "load-button": "Загрузить локальные шрифты",
    "search-placeholder": "Поиск по семейству, имени или PostScript…",
    "group-label": "Группировать по семейству",
    "no-results": "Нет шрифтов, соответствующих фильтрам."
  },
  "pt": {
    "library-hint": "Carregue e navegue pelas fontes instaladas no seu dispositivo.",
    "load-button": "Carregar fontes locais",
    "search-placeholder": "Pesquisar por família, nome ou PostScript…",
    "group-label": "Agrupar por família",
    "no-results": "Nenhuma fonte corresponde aos filtros."
  },
  "ar": {
    "library-hint": "حمّل وتصفح الخطوط المثبتة على جهازك.",
    "load-button": "تحميل الخطوط المحلية",
    "search-placeholder": "ابحث حسب العائلة أو الاسم أو PostScript…",
    "group-label": "تجميع حسب العائلة",
    "no-results": "لا توجد خطوط مطابقة لمرشحاتك."
  },
  "hi": {
    "library-hint": "डिवाइस पर इंस्टॉल फ़ॉन्ट्स लोड करें और ब्राउज़ करें।",
    "load-button": "लोकल फ़ॉन्ट्स लोड करें",
    "search-placeholder": "फ़ैमिली, नाम या PostScript से खोजें…",
    "group-label": "फ़ैमिली के अनुसार समूह",
    "no-results": "आपके फ़िल्टर से कोई फ़ॉन्ट मेल नहीं खाता।"
  },
  "tr": {
    "library-hint": "Cihazınıza yüklü yazı tiplerini yükleyip gezin.",
    "load-button": "Yerel yazı tiplerini yükle",
    "search-placeholder": "Aile, ad veya PostScript ile ara…",
    "group-label": "Aileye göre grupla",
    "no-results": "Filtrelere uyan yazı tipi yok."
  },
  "nl": {
    "library-hint": "Laad en bekijk de lettertypen die op je apparaat zijn geïnstalleerd.",
    "load-button": "Lokale lettertypen laden",
    "search-placeholder": "Zoek op familie, naam of PostScript…",
    "group-label": "Groeperen op familie",
    "no-results": "Geen lettertypen die aan je filters voldoen."
  },
  "sv": {
    "library-hint": "Ladda och bläddra bland typsnitt som är installerade på din enhet.",
    "load-button": "Ladda lokala typsnitt",
    "search-placeholder": "Sök efter familj, namn eller PostScript…",
    "group-label": "Gruppera efter familj",
    "no-results": "Inga typsnitt matchar dina filter."
  },
  "pl": {
    "library-hint": "Wczytaj i przeglądaj fonty zainstalowane na urządzeniu.",
    "load-button": "Wczytaj lokalne fonty",
    "search-placeholder": "Szukaj po rodzinie, nazwie lub PostScript…",
    "group-label": "Grupuj wg rodziny",
    "no-results": "Brak fontów pasujących do filtrów."
  },
  "vi": {
    "library-hint": "Tải và duyệt các phông chữ đã cài trên thiết bị.",
    "load-button": "Tải phông chữ cục bộ",
    "search-placeholder": "Tìm theo họ, tên hoặc PostScript…",
    "group-label": "Nhóm theo họ",
    "no-results": "Không có phông chữ phù hợp bộ lọc."
  },
  "th": {
    "library-hint": "โหลดและเรียกดูฟอนต์ที่ติดตั้งในอุปกรณ์ของคุณ",
    "load-button": "โหลดฟอนต์ในเครื่อง",
    "search-placeholder": "ค้นหาตามตระกูล ชื่อ หรือ PostScript…",
    "group-label": "จัดกลุ่มตามตระกูล",
    "no-results": "ไม่มีฟอนต์ที่ตรงกับตัวกรอง"
  },
  "id": {
    "library-hint": "Muat dan telusuri font yang terpasang di perangkat Anda.",
    "load-button": "Muat font lokal",
    "search-placeholder": "Cari berdasarkan keluarga, nama, atau PostScript…",
    "group-label": "Kelompokkan berdasarkan keluarga",
    "no-results": "Tidak ada font yang cocok dengan filter."
  },
  "he": {
    "library-hint": "טען ועיין בגופנים שמותקנים במכשיר שלך.",
    "load-button": "טען גופנים מקומיים",
    "search-placeholder": "חפש לפי משפחה, שם או PostScript…",
    "group-label": "קבץ לפי משפחה",
    "no-results": "אין גופנים שתואמים למסננים."
  },
  "ms": {
    "library-hint": "Muat dan semak fon yang dipasang pada peranti anda.",
    "load-button": "Muat fon tempatan",
    "search-placeholder": "Cari mengikut keluarga, nama atau PostScript…",
    "group-label": "Kumpulkan mengikut keluarga",
    "no-results": "Tiada fon yang sepadan dengan penapis."
  },
  "no": {
    "library-hint": "Last inn og bla gjennom fonter som er installert på enheten.",
    "load-button": "Last inn lokale fonter",
    "search-placeholder": "Søk etter familie, navn eller PostScript…",
    "group-label": "Grupper etter familie",
    "no-results": "Ingen fonter samsvarer med filtrene."
  }
}
</i18n>
