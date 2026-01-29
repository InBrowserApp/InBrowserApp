<template>
  <n-text depth="3">{{ t('userAgents') }}</n-text>
  <n-dynamic-input v-model:value="userAgents" :on-create="createUserAgent">
    <template #create-button-default>{{ t('addUserAgent') }}</template>
    <template #default="{ index: agentIndex }">
      <n-input v-model:value="userAgents[agentIndex]" :placeholder="t('userAgentPlaceholder')" />
    </template>
  </n-dynamic-input>
  <n-text depth="3">{{ t('userAgentPresets') }}</n-text>
  <n-flex :wrap="true" :size="8">
    <n-button
      size="small"
      @click="addUserAgents(searchEngineUserAgents)"
      data-testid="preset-useragent-search"
    >
      {{ t('presetSearchEngines') }}
    </n-button>
    <n-button size="small" @click="addUserAgents(aiUserAgents)" data-testid="preset-useragent-ai">
      {{ t('presetAiCrawlers') }}
    </n-button>
  </n-flex>
  <n-text depth="3">{{ t('userAgentHint') }}</n-text>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NButton, NDynamicInput, NFlex, NInput, NText } from 'naive-ui'

const userAgents = defineModel<string[]>('userAgents', { required: true })

const { t } = useI18n()
const createUserAgent = () => ''

const searchEngineUserAgents = [
  'Googlebot',
  'Bingbot',
  'DuckDuckBot',
  'Baiduspider',
  'YandexBot',
  'Applebot',
  'Naverbot',
  'SeznamBot',
  'Sogou web spider',
  'Qwantify',
  'Yahoo! Slurp',
  'Exabot',
]

const aiUserAgents = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-Web',
  'PerplexityBot',
  'CCBot',
  'Google-Extended',
  'Applebot-Extended',
]

const addUserAgents = (agents: string[]) => {
  const cleaned = agents.map((agent) => agent.trim()).filter(Boolean)
  if (cleaned.length === 0) return

  const existing = userAgents.value.map((agent) => agent.trim()).filter(Boolean)
  const hasOnlyWildcard =
    existing.length <= 1 && existing.every((agent) => agent === '*' || agent.length === 0)

  if (hasOnlyWildcard) {
    userAgents.value = [...cleaned]
    return
  }

  const normalized = new Set(existing.map((agent) => agent.toLowerCase()))
  cleaned.forEach((agent) => {
    const key = agent.toLowerCase()
    if (normalized.has(key)) return
    userAgents.value.push(agent)
    normalized.add(key)
  })
}
</script>

<i18n lang="json">
{
  "en": {
    "userAgents": "User agents",
    "userAgentPlaceholder": "* or Googlebot",
    "userAgentPresets": "User-agent presets",
    "presetSearchEngines": "Add search engine bots",
    "presetAiCrawlers": "Add AI crawlers",
    "userAgentHint": "Empty user-agent defaults to *.",
    "addUserAgent": "Add user-agent"
  },
  "zh": {
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* 或 Googlebot",
    "userAgentPresets": "User-agent 预设",
    "presetSearchEngines": "添加搜索引擎爬虫",
    "presetAiCrawlers": "添加 AI 爬虫",
    "userAgentHint": "留空将默认使用 *。",
    "addUserAgent": "添加 User-agent"
  },
  "zh-CN": {
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* 或 Googlebot",
    "userAgentPresets": "User-agent 预设",
    "presetSearchEngines": "添加搜索引擎爬虫",
    "presetAiCrawlers": "添加 AI 爬虫",
    "userAgentHint": "留空将默认使用 *。",
    "addUserAgent": "添加 User-agent"
  },
  "zh-TW": {
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* 或 Googlebot",
    "userAgentPresets": "User-agent 預設",
    "presetSearchEngines": "新增搜尋引擎爬蟲",
    "presetAiCrawlers": "新增 AI 爬蟲",
    "userAgentHint": "留空將預設為 *。",
    "addUserAgent": "新增 User-agent"
  },
  "zh-HK": {
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* 或 Googlebot",
    "userAgentPresets": "User-agent 預設",
    "presetSearchEngines": "新增搜尋引擎爬蟲",
    "presetAiCrawlers": "新增 AI 爬蟲",
    "userAgentHint": "留空將預設為 *。",
    "addUserAgent": "新增 User-agent"
  },
  "es": {
    "userAgents": "User-agents",
    "userAgentPlaceholder": "* o Googlebot",
    "userAgentPresets": "Preajustes de user-agent",
    "presetSearchEngines": "Agregar bots de búsqueda",
    "presetAiCrawlers": "Agregar rastreadores de IA",
    "userAgentHint": "Si está vacío, se usa *.",
    "addUserAgent": "Agregar user-agent"
  },
  "fr": {
    "userAgents": "User-agents",
    "userAgentPlaceholder": "* ou Googlebot",
    "userAgentPresets": "Préréglages de user-agent",
    "presetSearchEngines": "Ajouter les bots de recherche",
    "presetAiCrawlers": "Ajouter les crawlers IA",
    "userAgentHint": "Vide = * par défaut.",
    "addUserAgent": "Ajouter un user-agent"
  },
  "de": {
    "userAgents": "User-Agents",
    "userAgentPlaceholder": "* oder Googlebot",
    "userAgentPresets": "User-Agent-Voreinstellungen",
    "presetSearchEngines": "Suchmaschinen-Bots hinzufügen",
    "presetAiCrawlers": "KI-Crawler hinzufügen",
    "userAgentHint": "Leer bedeutet standardmäßig *.",
    "addUserAgent": "User-Agent hinzufügen"
  },
  "it": {
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* o Googlebot",
    "userAgentPresets": "Preset user-agent",
    "presetSearchEngines": "Aggiungi bot dei motori di ricerca",
    "presetAiCrawlers": "Aggiungi crawler IA",
    "userAgentHint": "Vuoto = * di default.",
    "addUserAgent": "Aggiungi user-agent"
  },
  "ja": {
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* または Googlebot",
    "userAgentPresets": "User-agent プリセット",
    "presetSearchEngines": "検索エンジンボットを追加",
    "presetAiCrawlers": "AI クローラーを追加",
    "userAgentHint": "空の場合は * が使われます。",
    "addUserAgent": "User-agent を追加"
  },
  "ko": {
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* 또는 Googlebot",
    "userAgentPresets": "User-agent 프리셋",
    "presetSearchEngines": "검색 엔진 봇 추가",
    "presetAiCrawlers": "AI 크롤러 추가",
    "userAgentHint": "비어 있으면 기본값은 * 입니다.",
    "addUserAgent": "User-agent 추가"
  },
  "ru": {
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* или Googlebot",
    "userAgentPresets": "Пресеты User-agent",
    "presetSearchEngines": "Добавить поисковых ботов",
    "presetAiCrawlers": "Добавить AI-краулеров",
    "userAgentHint": "Пусто = по умолчанию *.",
    "addUserAgent": "Добавить user-agent"
  },
  "pt": {
    "userAgents": "User-agents",
    "userAgentPlaceholder": "* ou Googlebot",
    "userAgentPresets": "Predefinições de user-agent",
    "presetSearchEngines": "Adicionar bots de busca",
    "presetAiCrawlers": "Adicionar crawlers de IA",
    "userAgentHint": "Vazio significa * por padrão.",
    "addUserAgent": "Adicionar user-agent"
  },
  "ar": {
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* أو Googlebot",
    "userAgentPresets": "إعدادات مسبقة لوكيل المستخدم",
    "presetSearchEngines": "إضافة روبوتات محركات البحث",
    "presetAiCrawlers": "إضافة زواحف الذكاء الاصطناعي",
    "userAgentHint": "عند تركه فارغًا يكون الافتراضي *.",
    "addUserAgent": "إضافة User-agent"
  },
  "hi": {
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* या Googlebot",
    "userAgentPresets": "User-agent प्रीसेट",
    "presetSearchEngines": "सर्च इंजन बॉट जोड़ें",
    "presetAiCrawlers": "AI क्रॉलर जोड़ें",
    "userAgentHint": "खाली होने पर डिफ़ॉल्ट * होगा।",
    "addUserAgent": "User-agent जोड़ें"
  },
  "tr": {
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* veya Googlebot",
    "userAgentPresets": "User-agent ön ayarları",
    "presetSearchEngines": "Arama motoru botlarını ekle",
    "presetAiCrawlers": "AI tarayıcılarını ekle",
    "userAgentHint": "Boşsa varsayılan * olur.",
    "addUserAgent": "User-agent ekle"
  },
  "nl": {
    "userAgents": "User-agents",
    "userAgentPlaceholder": "* of Googlebot",
    "userAgentPresets": "User-agent-voorinstellingen",
    "presetSearchEngines": "Zoekmachinebots toevoegen",
    "presetAiCrawlers": "AI-crawlers toevoegen",
    "userAgentHint": "Leeg betekent standaard *.",
    "addUserAgent": "User-agent toevoegen"
  },
  "sv": {
    "userAgents": "User-agents",
    "userAgentPlaceholder": "* eller Googlebot",
    "userAgentPresets": "Förinställningar för user-agent",
    "presetSearchEngines": "Lägg till sökmotorbotar",
    "presetAiCrawlers": "Lägg till AI-crawlare",
    "userAgentHint": "Tomt betyder * som standard.",
    "addUserAgent": "Lägg till user-agent"
  },
  "pl": {
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* lub Googlebot",
    "userAgentPresets": "Presety user-agent",
    "presetSearchEngines": "Dodaj boty wyszukiwarek",
    "presetAiCrawlers": "Dodaj crawlery AI",
    "userAgentHint": "Puste oznacza domyślnie *.",
    "addUserAgent": "Dodaj user-agent"
  },
  "vi": {
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* hoặc Googlebot",
    "userAgentPresets": "Mẫu user-agent",
    "presetSearchEngines": "Thêm bot công cụ tìm kiếm",
    "presetAiCrawlers": "Thêm trình thu thập AI",
    "userAgentHint": "Để trống sẽ mặc định là *.",
    "addUserAgent": "Thêm user-agent"
  },
  "th": {
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* หรือ Googlebot",
    "userAgentPresets": "พรีเซ็ต User-agent",
    "presetSearchEngines": "เพิ่มบอตเครื่องมือค้นหา",
    "presetAiCrawlers": "เพิ่มบอต AI",
    "userAgentHint": "เว้นว่างจะใช้ค่าเริ่มต้นเป็น *",
    "addUserAgent": "เพิ่ม User-agent"
  },
  "id": {
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* atau Googlebot",
    "userAgentPresets": "Preset user-agent",
    "presetSearchEngines": "Tambahkan bot mesin pencari",
    "presetAiCrawlers": "Tambahkan perayap AI",
    "userAgentHint": "Kosong berarti * secara default.",
    "addUserAgent": "Tambahkan user-agent"
  },
  "he": {
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* או Googlebot",
    "userAgentPresets": "הגדרות מראש ל-User-agent",
    "presetSearchEngines": "הוסף בוטים של מנועי חיפוש",
    "presetAiCrawlers": "הוסף זחלני AI",
    "userAgentHint": "ריק הוא ברירת המחדל *.",
    "addUserAgent": "הוסף User-agent"
  },
  "ms": {
    "userAgents": "User-agent",
    "userAgentPlaceholder": "* atau Googlebot",
    "userAgentPresets": "Praset user-agent",
    "presetSearchEngines": "Tambah bot enjin carian",
    "presetAiCrawlers": "Tambah perayap AI",
    "userAgentHint": "Kosong akan guna * secara lalai.",
    "addUserAgent": "Tambah user-agent"
  },
  "no": {
    "userAgents": "User-agents",
    "userAgentPlaceholder": "* eller Googlebot",
    "userAgentPresets": "User-agent-forhåndsinnstillinger",
    "presetSearchEngines": "Legg til søkemotorroboter",
    "presetAiCrawlers": "Legg til AI-crawlere",
    "userAgentHint": "Tomt betyr * som standard.",
    "addUserAgent": "Legg til user-agent"
  }
}
</i18n>
