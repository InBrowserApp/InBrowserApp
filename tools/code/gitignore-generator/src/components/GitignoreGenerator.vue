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

  <!-- Preview Section -->
  <ToolSectionHeader>{{ t('preview') }}</ToolSectionHeader>
  <ToolSection>
    <n-space vertical :size="12">
      <n-space justify="space-between" align="center">
        <n-text v-if="selectedTemplates.length > 0" depth="3">
          {{ t('selectedCount', { count: selectedTemplates.length }) }}
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
        v-model:value="generatedContent"
        type="textarea"
        :placeholder="t('previewPlaceholder')"
        :autosize="{ minRows: 10, maxRows: 30 }"
        readonly
      />
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useObjectUrl, useStorage } from '@vueuse/core'
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
  NButton,
  NIcon,
  NDivider,
} from 'naive-ui'
import {
  Search24Regular as SearchIcon,
  ArrowDownload24Regular as DownloadIcon,
} from '@shared/icons/fluent'
import {
  NodeDotjsIcon,
  PythonIcon,
  GoIcon,
  RustIcon,
  AppleIcon,
  LinuxIcon,
  JetBrainsIcon,
  OpenJdkIcon,
} from '@shared/icons/simple-icons'
import { LogoWindows as WindowsIcon } from '@shared/icons/ionicons5'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import { templates, getTemplatesByCategory, popularTemplates } from '../templates'
import SelectedTemplates from './SelectedTemplates.vue'
import VisualStudioCodeIcon from './icons/VisualStudioCodeIcon.vue'

// Icon mapping for quick select templates
const templateIcons: Record<string, unknown> = {
  Node: NodeDotjsIcon,
  Python: PythonIcon,
  Java: OpenJdkIcon,
  Go: GoIcon,
  Rust: RustIcon,
  macOS: AppleIcon,
  Windows: WindowsIcon,
  Linux: LinuxIcon,
  VisualStudioCode: VisualStudioCodeIcon,
  JetBrains: JetBrainsIcon,
}

const { t } = useI18n()

const searchQuery = ref('')
const selectedTemplates = useStorage<string[]>('tools:gitignore-generator:selected', [])

const groupedTemplates = computed(() => getTemplatesByCategory())

// Filter templates by search query
const filterBySearch = (templateList: typeof templates) => {
  if (!searchQuery.value) return templateList
  const query = searchQuery.value.toLowerCase()
  return templateList.filter((t) => t.name.toLowerCase().includes(query))
}

const filteredLanguageTemplates = computed(() => filterBySearch(groupedTemplates.value.language))
const filteredGlobalTemplates = computed(() => filterBySearch(groupedTemplates.value.global))
const filteredCommunityTemplates = computed(() => filterBySearch(groupedTemplates.value.community))

// Expanded collapse state
const expandedNames = ref<string[]>([])

// Auto-expand all categories when searching
watch(searchQuery, (query) => {
  if (query) {
    const names: string[] = []
    if (filteredLanguageTemplates.value.length > 0) names.push('language')
    if (filteredGlobalTemplates.value.length > 0) names.push('global')
    if (filteredCommunityTemplates.value.length > 0) names.push('community')
    expandedNames.value = names
  }
})

// Filter popular templates to only include existing ones
const popularTemplateNames = computed(() => {
  const allNames = templates.map((t) => t.name)
  return popularTemplates.filter((name) => allNames.includes(name))
})

// All template names for auto-complete
const allTemplateNames = computed(() => templates.map((t) => t.name))

// Toggle template selection
function toggleTemplate(name: string) {
  const idx = selectedTemplates.value.indexOf(name)
  if (idx === -1) {
    selectedTemplates.value.push(name)
  } else {
    selectedTemplates.value.splice(idx, 1)
  }
}

// Generate gitignore content
const generatedContent = computed(() => {
  const selected = templates.filter((t) => selectedTemplates.value.includes(t.name))
  if (selected.length === 0) return ''

  return selected.map((t) => `### ${t.name} ###\n${t.content}`).join('\n\n')
})

const downloadBlob = computed(() => {
  if (!generatedContent.value) return null
  return new Blob([generatedContent.value], { type: 'text/plain;charset=utf-8' })
})
const downloadUrl = useObjectUrl(downloadBlob)
</script>

<i18n lang="json">
{
  "en": {
    "preview": "Preview",
    "searchPlaceholder": "Search templates...",
    "quickSelect": "Quick Select",
    "selected": "Selected",
    "languages": "Languages & Frameworks",
    "global": "Global (OS, IDE, Editors)",
    "community": "Community",
    "selectedCount": "{count} template(s) selected",
    "previewPlaceholder": "Select templates to generate .gitignore content",
    "download": "Download"
  },
  "zh": {
    "preview": "预览",
    "searchPlaceholder": "搜索模板...",
    "quickSelect": "快速选择",
    "selected": "已选择",
    "languages": "语言和框架",
    "global": "全局（操作系统、IDE、编辑器）",
    "community": "社区",
    "selectedCount": "已选择 {count} 个模板",
    "previewPlaceholder": "选择模板以生成 .gitignore 内容",
    "download": "下载"
  },
  "zh-CN": {
    "preview": "预览",
    "searchPlaceholder": "搜索模板...",
    "quickSelect": "快速选择",
    "selected": "已选择",
    "languages": "语言和框架",
    "global": "全局（操作系统、IDE、编辑器）",
    "community": "社区",
    "selectedCount": "已选择 {count} 个模板",
    "previewPlaceholder": "选择模板以生成 .gitignore 内容",
    "download": "下载"
  },
  "zh-TW": {
    "preview": "預覽",
    "searchPlaceholder": "搜尋模板...",
    "quickSelect": "快速選擇",
    "selected": "已選擇",
    "languages": "語言和框架",
    "global": "全域（作業系統、IDE、編輯器）",
    "community": "社群",
    "selectedCount": "已選擇 {count} 個模板",
    "previewPlaceholder": "選擇模板以產生 .gitignore 內容",
    "download": "下載"
  },
  "zh-HK": {
    "preview": "預覽",
    "searchPlaceholder": "搜尋模板...",
    "quickSelect": "快速選擇",
    "selected": "已選擇",
    "languages": "語言和框架",
    "global": "全域（作業系統、IDE、編輯器）",
    "community": "社群",
    "selectedCount": "已選擇 {count} 個模板",
    "previewPlaceholder": "選擇模板以產生 .gitignore 內容",
    "download": "下載"
  },
  "es": {
    "preview": "Vista previa",
    "searchPlaceholder": "Buscar plantillas...",
    "quickSelect": "Selección rápida",
    "selected": "Seleccionados",
    "languages": "Lenguajes y frameworks",
    "global": "Global (SO, IDE, editores)",
    "community": "Comunidad",
    "selectedCount": "{count} plantilla(s) seleccionada(s)",
    "previewPlaceholder": "Seleccione plantillas para generar el contenido .gitignore",
    "download": "Descargar"
  },
  "fr": {
    "preview": "Aperçu",
    "searchPlaceholder": "Rechercher des modèles...",
    "quickSelect": "Sélection rapide",
    "selected": "Sélectionnés",
    "languages": "Langages et frameworks",
    "global": "Global (OS, IDE, éditeurs)",
    "community": "Communauté",
    "selectedCount": "{count} modèle(s) sélectionné(s)",
    "previewPlaceholder": "Sélectionnez des modèles pour générer le contenu .gitignore",
    "download": "Télécharger"
  },
  "de": {
    "preview": "Vorschau",
    "searchPlaceholder": "Vorlagen suchen...",
    "quickSelect": "Schnellauswahl",
    "selected": "Ausgewählt",
    "languages": "Sprachen & Frameworks",
    "global": "Global (OS, IDE, Editoren)",
    "community": "Community",
    "selectedCount": "{count} Vorlage(n) ausgewählt",
    "previewPlaceholder": "Wählen Sie Vorlagen aus, um .gitignore-Inhalt zu generieren",
    "download": "Herunterladen"
  },
  "it": {
    "preview": "Anteprima",
    "searchPlaceholder": "Cerca modelli...",
    "quickSelect": "Selezione rapida",
    "selected": "Selezionati",
    "languages": "Linguaggi e framework",
    "global": "Globale (OS, IDE, editor)",
    "community": "Community",
    "selectedCount": "{count} modello/i selezionato/i",
    "previewPlaceholder": "Seleziona i modelli per generare il contenuto .gitignore",
    "download": "Scarica"
  },
  "ja": {
    "preview": "プレビュー",
    "searchPlaceholder": "テンプレートを検索...",
    "quickSelect": "クイック選択",
    "selected": "選択済み",
    "languages": "言語とフレームワーク",
    "global": "グローバル（OS、IDE、エディター）",
    "community": "コミュニティ",
    "selectedCount": "{count} 個のテンプレートを選択済み",
    "previewPlaceholder": "テンプレートを選択して .gitignore の内容を生成",
    "download": "ダウンロード"
  },
  "ko": {
    "preview": "미리보기",
    "searchPlaceholder": "템플릿 검색...",
    "quickSelect": "빠른 선택",
    "selected": "선택됨",
    "languages": "언어 및 프레임워크",
    "global": "전역 (OS, IDE, 편집기)",
    "community": "커뮤니티",
    "selectedCount": "{count}개 템플릿 선택됨",
    "previewPlaceholder": "템플릿을 선택하여 .gitignore 내용 생성",
    "download": "다운로드"
  },
  "ru": {
    "preview": "Предпросмотр",
    "searchPlaceholder": "Поиск шаблонов...",
    "quickSelect": "Быстрый выбор",
    "selected": "Выбрано",
    "languages": "Языки и фреймворки",
    "global": "Глобальные (ОС, IDE, редакторы)",
    "community": "Сообщество",
    "selectedCount": "Выбрано шаблонов: {count}",
    "previewPlaceholder": "Выберите шаблоны для генерации содержимого .gitignore",
    "download": "Скачать"
  },
  "pt": {
    "preview": "Pré-visualização",
    "searchPlaceholder": "Pesquisar modelos...",
    "quickSelect": "Seleção rápida",
    "selected": "Selecionados",
    "languages": "Linguagens e frameworks",
    "global": "Global (SO, IDE, editores)",
    "community": "Comunidade",
    "selectedCount": "{count} modelo(s) selecionado(s)",
    "previewPlaceholder": "Selecione modelos para gerar o conteúdo .gitignore",
    "download": "Baixar"
  },
  "ar": {
    "preview": "معاينة",
    "searchPlaceholder": "البحث عن القوالب...",
    "quickSelect": "اختيار سريع",
    "selected": "المحدد",
    "languages": "اللغات والأُطر",
    "global": "عام (نظام التشغيل، IDE، المحررات)",
    "community": "المجتمع",
    "selectedCount": "تم اختيار {count} قالب/قوالب",
    "previewPlaceholder": "اختر القوالب لإنشاء محتوى .gitignore",
    "download": "تنزيل"
  },
  "hi": {
    "preview": "पूर्वावलोकन",
    "searchPlaceholder": "टेम्पलेट खोजें...",
    "quickSelect": "त्वरित चयन",
    "selected": "चयनित",
    "languages": "भाषाएं और फ्रेमवर्क",
    "global": "वैश्विक (OS, IDE, संपादक)",
    "community": "समुदाय",
    "selectedCount": "{count} टेम्पलेट चयनित",
    "previewPlaceholder": ".gitignore सामग्री उत्पन्न करने के लिए टेम्पलेट चुनें",
    "download": "डाउनलोड"
  },
  "tr": {
    "preview": "Önizleme",
    "searchPlaceholder": "Şablon ara...",
    "quickSelect": "Hızlı seçim",
    "selected": "Seçildi",
    "languages": "Diller ve çerçeveler",
    "global": "Genel (İS, IDE, editörler)",
    "community": "Topluluk",
    "selectedCount": "{count} şablon seçildi",
    "previewPlaceholder": ".gitignore içeriği oluşturmak için şablon seçin",
    "download": "İndir"
  },
  "nl": {
    "preview": "Voorbeeld",
    "searchPlaceholder": "Sjablonen zoeken...",
    "quickSelect": "Snelle selectie",
    "selected": "Geselecteerd",
    "languages": "Talen en frameworks",
    "global": "Globaal (OS, IDE, editors)",
    "community": "Community",
    "selectedCount": "{count} sjablo(o)n(en) geselecteerd",
    "previewPlaceholder": "Selecteer sjablonen om .gitignore-inhoud te genereren",
    "download": "Downloaden"
  },
  "sv": {
    "preview": "Förhandsvisning",
    "searchPlaceholder": "Sök mallar...",
    "quickSelect": "Snabbval",
    "selected": "Vald",
    "languages": "Språk och ramverk",
    "global": "Globalt (OS, IDE, redigerare)",
    "community": "Community",
    "selectedCount": "{count} mall(ar) valda",
    "previewPlaceholder": "Välj mallar för att generera .gitignore-innehåll",
    "download": "Ladda ner"
  },
  "pl": {
    "preview": "Podgląd",
    "searchPlaceholder": "Szukaj szablonów...",
    "quickSelect": "Szybki wybór",
    "selected": "Wybrano",
    "languages": "Języki i frameworki",
    "global": "Globalne (OS, IDE, edytory)",
    "community": "Społeczność",
    "selectedCount": "Wybrano {count} szablon(ów)",
    "previewPlaceholder": "Wybierz szablony, aby wygenerować zawartość .gitignore",
    "download": "Pobierz"
  },
  "vi": {
    "preview": "Xem trước",
    "searchPlaceholder": "Tìm kiếm mẫu...",
    "quickSelect": "Chọn nhanh",
    "selected": "Đã chọn",
    "languages": "Ngôn ngữ và framework",
    "global": "Toàn cục (OS, IDE, trình soạn thảo)",
    "community": "Cộng đồng",
    "selectedCount": "Đã chọn {count} mẫu",
    "previewPlaceholder": "Chọn mẫu để tạo nội dung .gitignore",
    "download": "Tải xuống"
  },
  "th": {
    "preview": "ดูตัวอย่าง",
    "searchPlaceholder": "ค้นหาเทมเพลต...",
    "quickSelect": "เลือกด่วน",
    "selected": "ที่เลือก",
    "languages": "ภาษาและเฟรมเวิร์ก",
    "global": "ทั่วไป (OS, IDE, เอดิเตอร์)",
    "community": "ชุมชน",
    "selectedCount": "เลือก {count} เทมเพลตแล้ว",
    "previewPlaceholder": "เลือกเทมเพลตเพื่อสร้างเนื้อหา .gitignore",
    "download": "ดาวน์โหลด"
  },
  "id": {
    "preview": "Pratinjau",
    "searchPlaceholder": "Cari template...",
    "quickSelect": "Pilihan cepat",
    "selected": "Dipilih",
    "languages": "Bahasa dan framework",
    "global": "Global (OS, IDE, editor)",
    "community": "Komunitas",
    "selectedCount": "{count} template dipilih",
    "previewPlaceholder": "Pilih template untuk menghasilkan konten .gitignore",
    "download": "Unduh"
  },
  "he": {
    "preview": "תצוגה מקדימה",
    "searchPlaceholder": "חפש תבניות...",
    "quickSelect": "בחירה מהירה",
    "selected": "נבחר",
    "languages": "שפות ומסגרות",
    "global": "גלובלי (מערכת הפעלה, IDE, עורכים)",
    "community": "קהילה",
    "selectedCount": "נבחרו {count} תבניות",
    "previewPlaceholder": "בחר תבניות כדי ליצור תוכן .gitignore",
    "download": "הורד"
  },
  "ms": {
    "preview": "Pratonton",
    "searchPlaceholder": "Cari templat...",
    "quickSelect": "Pilihan pantas",
    "selected": "Dipilih",
    "languages": "Bahasa dan rangka kerja",
    "global": "Global (OS, IDE, editor)",
    "community": "Komuniti",
    "selectedCount": "{count} templat dipilih",
    "previewPlaceholder": "Pilih templat untuk menjana kandungan .gitignore",
    "download": "Muat turun"
  },
  "no": {
    "preview": "Forhåndsvisning",
    "searchPlaceholder": "Søk maler...",
    "quickSelect": "Hurtigvalg",
    "selected": "Valgt",
    "languages": "Språk og rammeverk",
    "global": "Globalt (OS, IDE, editorer)",
    "community": "Fellesskap",
    "selectedCount": "{count} mal(er) valgt",
    "previewPlaceholder": "Velg maler for å generere .gitignore-innhold",
    "download": "Last ned"
  }
}
</i18n>

<style scoped>
:deep(.n-tag .n-tag__icon) {
  font-size: 14px;
}

:deep(.n-tag.n-tag--checkable.n-tag--checked .n-tag__icon) {
  color: var(--n-text-color-checked);
}
</style>
