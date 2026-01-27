<template>
  <ToolSection>
    <div class="library-section">
      <ToolSectionHeader>
        <span class="library-header">
          <span>{{ title }}</span>
          <span class="library-header__action">
            <span v-if="fontCountLabel" data-testid="font-count">{{ fontCountLabel }}</span>
            <n-button
              v-else
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
          </span>
        </span>
      </ToolSectionHeader>

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

      <n-scrollbar class="font-scroll" data-testid="font-list" style="max-height: 90vh">
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
    </div>
  </ToolSection>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import {
  NAlert,
  NButton,
  NFlex,
  NIcon,
  NInput,
  NScrollbar,
  NSelect,
  NSwitch,
  NText,
} from 'naive-ui'
import FolderOpen16Regular from '@vicons/fluent/FolderOpen16Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import type { AlertStatusType, DisplayFont, FontGroup } from './types'

type SelectOption = {
  label: string
  value: string
}

defineProps<{
  title: string
  isSupported: boolean
  isLoading: boolean
  statusMessage: string
  statusType: AlertStatusType
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
.library-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.library-header {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}

.library-header__action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.status-alert {
  margin: 0;
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
    "load-button": "Load local fonts",
    "search-placeholder": "Search by family, name, or PostScript…",
    "group-label": "Group by family",
    "no-results": "No fonts match your filters."
  },
  "zh": {
    "load-button": "加载本地字体",
    "search-placeholder": "按家族、名称或 PostScript 搜索…",
    "group-label": "按家族分组",
    "no-results": "没有匹配的字体。"
  },
  "zh-CN": {
    "load-button": "加载本地字体",
    "search-placeholder": "按家族、名称或 PostScript 搜索…",
    "group-label": "按家族分组",
    "no-results": "没有匹配的字体。"
  },
  "zh-TW": {
    "load-button": "載入本機字型",
    "search-placeholder": "以家族、名稱或 PostScript 搜尋…",
    "group-label": "依家族分組",
    "no-results": "找不到符合的字型。"
  },
  "zh-HK": {
    "load-button": "載入本機字體",
    "search-placeholder": "按家族、名稱或 PostScript 搜尋…",
    "group-label": "按家族分組",
    "no-results": "沒有符合的字體。"
  },
  "es": {
    "load-button": "Cargar fuentes locales",
    "search-placeholder": "Buscar por familia, nombre o PostScript…",
    "group-label": "Agrupar por familia",
    "no-results": "No hay fuentes que coincidan con tus filtros."
  },
  "fr": {
    "load-button": "Charger les polices locales",
    "search-placeholder": "Rechercher par famille, nom ou PostScript…",
    "group-label": "Regrouper par famille",
    "no-results": "Aucune police ne correspond à vos filtres."
  },
  "de": {
    "load-button": "Lokale Schriften laden",
    "search-placeholder": "Nach Familie, Name oder PostScript suchen…",
    "group-label": "Nach Familie gruppieren",
    "no-results": "Keine Schriften passen zu den Filtern."
  },
  "it": {
    "load-button": "Carica font locali",
    "search-placeholder": "Cerca per famiglia, nome o PostScript…",
    "group-label": "Raggruppa per famiglia",
    "no-results": "Nessun font corrisponde ai filtri."
  },
  "ja": {
    "load-button": "ローカルフォントを読み込む",
    "search-placeholder": "ファミリー名、名称、PostScript で検索…",
    "group-label": "ファミリーでグループ化",
    "no-results": "条件に一致するフォントがありません。"
  },
  "ko": {
    "load-button": "로컬 폰트 불러오기",
    "search-placeholder": "패밀리, 이름 또는 PostScript로 검색…",
    "group-label": "패밀리별 그룹",
    "no-results": "필터에 맞는 폰트가 없습니다."
  },
  "ru": {
    "load-button": "Загрузить локальные шрифты",
    "search-placeholder": "Поиск по семейству, имени или PostScript…",
    "group-label": "Группировать по семейству",
    "no-results": "Нет шрифтов, соответствующих фильтрам."
  },
  "pt": {
    "load-button": "Carregar fontes locais",
    "search-placeholder": "Pesquisar por família, nome ou PostScript…",
    "group-label": "Agrupar por família",
    "no-results": "Nenhuma fonte corresponde aos filtros."
  },
  "ar": {
    "load-button": "تحميل الخطوط المحلية",
    "search-placeholder": "ابحث حسب العائلة أو الاسم أو PostScript…",
    "group-label": "تجميع حسب العائلة",
    "no-results": "لا توجد خطوط مطابقة لمرشحاتك."
  },
  "hi": {
    "load-button": "लोकल फ़ॉन्ट्स लोड करें",
    "search-placeholder": "फ़ैमिली, नाम या PostScript से खोजें…",
    "group-label": "फ़ैमिली के अनुसार समूह",
    "no-results": "आपके फ़िल्टर से कोई फ़ॉन्ट मेल नहीं खाता।"
  },
  "tr": {
    "load-button": "Yerel yazı tiplerini yükle",
    "search-placeholder": "Aile, ad veya PostScript ile ara…",
    "group-label": "Aileye göre grupla",
    "no-results": "Filtrelere uyan yazı tipi yok."
  },
  "nl": {
    "load-button": "Lokale lettertypen laden",
    "search-placeholder": "Zoek op familie, naam of PostScript…",
    "group-label": "Groeperen op familie",
    "no-results": "Geen lettertypen die aan je filters voldoen."
  },
  "sv": {
    "load-button": "Ladda lokala typsnitt",
    "search-placeholder": "Sök efter familj, namn eller PostScript…",
    "group-label": "Gruppera efter familj",
    "no-results": "Inga typsnitt matchar dina filter."
  },
  "pl": {
    "load-button": "Wczytaj lokalne fonty",
    "search-placeholder": "Szukaj po rodzinie, nazwie lub PostScript…",
    "group-label": "Grupuj wg rodziny",
    "no-results": "Brak fontów pasujących do filtrów."
  },
  "vi": {
    "load-button": "Tải phông chữ cục bộ",
    "search-placeholder": "Tìm theo họ, tên hoặc PostScript…",
    "group-label": "Nhóm theo họ",
    "no-results": "Không có phông chữ phù hợp bộ lọc."
  },
  "th": {
    "load-button": "โหลดฟอนต์ในเครื่อง",
    "search-placeholder": "ค้นหาตามตระกูล ชื่อ หรือ PostScript…",
    "group-label": "จัดกลุ่มตามตระกูล",
    "no-results": "ไม่มีฟอนต์ที่ตรงกับตัวกรอง"
  },
  "id": {
    "load-button": "Muat font lokal",
    "search-placeholder": "Cari berdasarkan keluarga, nama, atau PostScript…",
    "group-label": "Kelompokkan berdasarkan keluarga",
    "no-results": "Tidak ada font yang cocok dengan filter."
  },
  "he": {
    "load-button": "טען גופנים מקומיים",
    "search-placeholder": "חפש לפי משפחה, שם או PostScript…",
    "group-label": "קבץ לפי משפחה",
    "no-results": "אין גופנים שתואמים למסננים."
  },
  "ms": {
    "load-button": "Muat fon tempatan",
    "search-placeholder": "Cari mengikut keluarga, nama atau PostScript…",
    "group-label": "Kumpulkan mengikut keluarga",
    "no-results": "Tiada fon yang sepadan dengan penapis."
  },
  "no": {
    "load-button": "Last inn lokale fonter",
    "search-placeholder": "Søk etter familie, navn eller PostScript…",
    "group-label": "Grupper etter familie",
    "no-results": "Ingen fonter samsvarer med filtrene."
  }
}
</i18n>
