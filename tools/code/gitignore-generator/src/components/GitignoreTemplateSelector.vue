<template>
  <ToolSection>
    <n-space vertical :size="16">
      <!-- Search -->
      <n-input v-model:value="searchQuery" :placeholder="t('searchPlaceholder')" clearable>
        <template #prefix>
          <n-icon><SearchIcon /></n-icon>
        </template>
      </n-input>

      <!-- Quick Select -->
      <n-space vertical :size="8">
        <n-text depth="3">{{ t('quickSelect') }}</n-text>
        <n-space>
          <n-tag
            v-for="name in popularTemplateNames"
            :key="name"
            :checked="selectedTemplates.includes(name)"
            checkable
            @update:checked="toggleTemplate(name)"
          >
            <template #icon>
              <n-icon v-if="templateIcons[name]" :component="templateIcons[name]" />
            </template>
            {{ name }}
          </n-tag>
        </n-space>
      </n-space>

      <!-- Selected Templates -->
      <n-space vertical :size="8">
        <n-text depth="3">{{ t('selected') }}</n-text>
        <SelectedTemplates v-model="selectedTemplates" :all-templates="allTemplateNames" />
      </n-space>

      <n-divider />

      <!-- Categories -->
      <n-collapse v-model:expanded-names="expandedNames">
        <n-collapse-item
          v-if="filteredLanguageTemplates.length > 0"
          :title="t('languages')"
          name="language"
        >
          <n-checkbox-group v-model:value="selectedTemplates">
            <n-grid :cols="4" :x-gap="8" :y-gap="8">
              <n-gi v-for="template in filteredLanguageTemplates" :key="template.path">
                <n-checkbox :value="template.name" :label="template.name" />
              </n-gi>
            </n-grid>
          </n-checkbox-group>
        </n-collapse-item>
        <n-collapse-item
          v-if="filteredGlobalTemplates.length > 0"
          :title="t('global')"
          name="global"
        >
          <n-checkbox-group v-model:value="selectedTemplates">
            <n-grid :cols="4" :x-gap="8" :y-gap="8">
              <n-gi v-for="template in filteredGlobalTemplates" :key="template.path">
                <n-checkbox :value="template.name" :label="template.name" />
              </n-gi>
            </n-grid>
          </n-checkbox-group>
        </n-collapse-item>
        <n-collapse-item
          v-if="filteredCommunityTemplates.length > 0"
          :title="t('community')"
          name="community"
        >
          <n-checkbox-group v-model:value="selectedTemplates">
            <n-grid :cols="4" :x-gap="8" :y-gap="8">
              <n-gi v-for="template in filteredCommunityTemplates" :key="template.path">
                <n-checkbox :value="template.name" :label="template.name" />
              </n-gi>
            </n-grid>
          </n-checkbox-group>
        </n-collapse-item>
      </n-collapse>
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  NInput,
  NSpace,
  NText,
  NTag,
  NCollapse,
  NCollapseItem,
  NCheckboxGroup,
  NCheckbox,
  NGrid,
  NGi,
  NIcon,
  NDivider,
} from 'naive-ui'
import SearchIcon from '@vicons/fluent/Search24Regular'
import { ToolSection } from '@shared/ui/tool'
import SelectedTemplates from './SelectedTemplates.vue'

type TemplateItem = {
  name: string
  path: string
}

defineProps<{
  popularTemplateNames: string[]
  allTemplateNames: string[]
  filteredLanguageTemplates: TemplateItem[]
  filteredGlobalTemplates: TemplateItem[]
  filteredCommunityTemplates: TemplateItem[]
  templateIcons: Record<string, unknown>
}>()
const searchQuery = defineModel<string>('searchQuery', { required: true })
const selectedTemplates = defineModel<string[]>('selectedTemplates', { required: true })
const expandedNames = defineModel<string[]>('expandedNames', { required: true })

const { t } = useI18n({ useScope: 'local' })

function toggleTemplate(name: string) {
  const idx = selectedTemplates.value.indexOf(name)
  if (idx === -1) {
    selectedTemplates.value.push(name)
  } else {
    selectedTemplates.value.splice(idx, 1)
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "searchPlaceholder": "Search templates...",
    "quickSelect": "Quick Select",
    "selected": "Selected",
    "languages": "Languages & Frameworks",
    "global": "Global (OS, IDE, Editors)",
    "community": "Community"
  },
  "zh": {
    "searchPlaceholder": "搜索模板...",
    "quickSelect": "快速选择",
    "selected": "已选择",
    "languages": "语言和框架",
    "global": "全局（操作系统、IDE、编辑器）",
    "community": "社区"
  },
  "zh-CN": {
    "searchPlaceholder": "搜索模板...",
    "quickSelect": "快速选择",
    "selected": "已选择",
    "languages": "语言和框架",
    "global": "全局（操作系统、IDE、编辑器）",
    "community": "社区"
  },
  "zh-TW": {
    "searchPlaceholder": "搜尋模板...",
    "quickSelect": "快速選擇",
    "selected": "已選擇",
    "languages": "語言和框架",
    "global": "全域（作業系統、IDE、編輯器）",
    "community": "社群"
  },
  "zh-HK": {
    "searchPlaceholder": "搜尋模板...",
    "quickSelect": "快速選擇",
    "selected": "已選擇",
    "languages": "語言和框架",
    "global": "全域（作業系統、IDE、編輯器）",
    "community": "社群"
  },
  "es": {
    "searchPlaceholder": "Buscar plantillas...",
    "quickSelect": "Selección rápida",
    "selected": "Seleccionados",
    "languages": "Lenguajes y frameworks",
    "global": "Global (SO, IDE, editores)",
    "community": "Comunidad"
  },
  "fr": {
    "searchPlaceholder": "Rechercher des modèles...",
    "quickSelect": "Sélection rapide",
    "selected": "Sélectionnés",
    "languages": "Langages et frameworks",
    "global": "Global (OS, IDE, éditeurs)",
    "community": "Communauté"
  },
  "de": {
    "searchPlaceholder": "Vorlagen suchen...",
    "quickSelect": "Schnellauswahl",
    "selected": "Ausgewählt",
    "languages": "Sprachen & Frameworks",
    "global": "Global (OS, IDE, Editoren)",
    "community": "Community"
  },
  "it": {
    "searchPlaceholder": "Cerca modelli...",
    "quickSelect": "Selezione rapida",
    "selected": "Selezionati",
    "languages": "Linguaggi e framework",
    "global": "Globale (OS, IDE, editor)",
    "community": "Community"
  },
  "ja": {
    "searchPlaceholder": "テンプレートを検索...",
    "quickSelect": "クイック選択",
    "selected": "選択済み",
    "languages": "言語とフレームワーク",
    "global": "グローバル（OS、IDE、エディター）",
    "community": "コミュニティ"
  },
  "ko": {
    "searchPlaceholder": "템플릿 검색...",
    "quickSelect": "빠른 선택",
    "selected": "선택됨",
    "languages": "언어 및 프레임워크",
    "global": "전역 (OS, IDE, 편집기)",
    "community": "커뮤니티"
  },
  "ru": {
    "searchPlaceholder": "Поиск шаблонов...",
    "quickSelect": "Быстрый выбор",
    "selected": "Выбрано",
    "languages": "Языки и фреймворки",
    "global": "Глобальные (ОС, IDE, редакторы)",
    "community": "Сообщество"
  },
  "pt": {
    "searchPlaceholder": "Pesquisar modelos...",
    "quickSelect": "Seleção rápida",
    "selected": "Selecionados",
    "languages": "Linguagens e frameworks",
    "global": "Global (SO, IDE, editores)",
    "community": "Comunidade"
  },
  "ar": {
    "searchPlaceholder": "البحث عن القوالب...",
    "quickSelect": "اختيار سريع",
    "selected": "المحدد",
    "languages": "اللغات والأُطر",
    "global": "عام (نظام التشغيل، IDE، المحررات)",
    "community": "المجتمع"
  },
  "hi": {
    "searchPlaceholder": "टेम्पलेट खोजें...",
    "quickSelect": "त्वरित चयन",
    "selected": "चयनित",
    "languages": "भाषाएं और फ्रेमवर्क",
    "global": "वैश्विक (OS, IDE, संपादक)",
    "community": "समुदाय"
  },
  "tr": {
    "searchPlaceholder": "Şablon ara...",
    "quickSelect": "Hızlı seçim",
    "selected": "Seçildi",
    "languages": "Diller ve çerçeveler",
    "global": "Genel (İS, IDE, editörler)",
    "community": "Topluluk"
  },
  "nl": {
    "searchPlaceholder": "Sjablonen zoeken...",
    "quickSelect": "Snelle selectie",
    "selected": "Geselecteerd",
    "languages": "Talen en frameworks",
    "global": "Globaal (OS, IDE, editors)",
    "community": "Community"
  },
  "sv": {
    "searchPlaceholder": "Sök mallar...",
    "quickSelect": "Snabbval",
    "selected": "Vald",
    "languages": "Språk och ramverk",
    "global": "Globalt (OS, IDE, redigerare)",
    "community": "Community"
  },
  "pl": {
    "searchPlaceholder": "Szukaj szablonów...",
    "quickSelect": "Szybki wybór",
    "selected": "Wybrano",
    "languages": "Języki i frameworki",
    "global": "Globalne (OS, IDE, edytory)",
    "community": "Społeczność"
  },
  "vi": {
    "searchPlaceholder": "Tìm kiếm mẫu...",
    "quickSelect": "Chọn nhanh",
    "selected": "Đã chọn",
    "languages": "Ngôn ngữ và framework",
    "global": "Toàn cục (OS, IDE, trình soạn thảo)",
    "community": "Cộng đồng"
  },
  "th": {
    "searchPlaceholder": "ค้นหาเทมเพลต...",
    "quickSelect": "เลือกด่วน",
    "selected": "ที่เลือก",
    "languages": "ภาษาและเฟรมเวิร์ก",
    "global": "ทั่วไป (OS, IDE, เอดิเตอร์)",
    "community": "ชุมชน"
  },
  "id": {
    "searchPlaceholder": "Cari template...",
    "quickSelect": "Pilihan cepat",
    "selected": "Dipilih",
    "languages": "Bahasa dan framework",
    "global": "Global (OS, IDE, editor)",
    "community": "Komunitas"
  },
  "he": {
    "searchPlaceholder": "חפש תבניות...",
    "quickSelect": "בחירה מהירה",
    "selected": "נבחר",
    "languages": "שפות ומסגרות",
    "global": "גלובלי (מערכת הפעלה, IDE, עורכים)",
    "community": "קהילה"
  },
  "ms": {
    "searchPlaceholder": "Cari templat...",
    "quickSelect": "Pilihan pantas",
    "selected": "Dipilih",
    "languages": "Bahasa dan rangka kerja",
    "global": "Global (OS, IDE, editor)",
    "community": "Komuniti"
  },
  "no": {
    "searchPlaceholder": "Søk maler...",
    "quickSelect": "Hurtigvalg",
    "selected": "Valgt",
    "languages": "Språk og rammeverk",
    "global": "Globalt (OS, IDE, editorer)",
    "community": "Fellesskap"
  }
}
</i18n>
