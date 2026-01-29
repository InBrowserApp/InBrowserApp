<template>
  <n-text depth="3">{{ t('rules') }}</n-text>
  <n-dynamic-input v-model:value="rules" :on-create="createRule">
    <template #create-button-default>{{ t('addRule') }}</template>
    <template #default="{ index: ruleIndex }">
      <n-flex align="center" :size="8" :wrap="true">
        <n-select
          v-model:value="rules[ruleIndex]!.type"
          :options="ruleOptions"
          style="width: 140px"
        />
        <n-input
          v-model:value="rules[ruleIndex]!.path"
          :placeholder="t('pathPlaceholder')"
          style="flex: 1; min-width: 200px"
          :data-testid="'rule-path-' + groupIndex + '-' + ruleIndex"
        />
      </n-flex>
    </template>
  </n-dynamic-input>
  <n-text depth="3">{{ t('ruleHint') }}</n-text>

  <template v-if="advanced">
    <n-text depth="3">{{ t('crawlDelay') }}</n-text>
    <n-input-number
      v-model:value="crawlDelay"
      :min="0"
      :precision="1"
      :step="0.1"
      :placeholder="t('crawlDelayPlaceholder')"
    />
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NDynamicInput, NFlex, NInput, NInputNumber, NSelect, NText } from 'naive-ui'
import type { RobotsRule } from '../robotsState'

const rules = defineModel<RobotsRule[]>('rules', { required: true })
const crawlDelay = defineModel<number | null>('crawlDelay', { required: true })

defineProps<{
  advanced: boolean
  groupIndex: number
}>()

const { t } = useI18n()

const ruleOptions = computed(() => [
  { label: t('ruleAllow'), value: 'allow' },
  { label: t('ruleDisallow'), value: 'disallow' },
])

const createRule = (): RobotsRule => ({ type: 'disallow', path: '' })
</script>

<i18n lang="json">
{
  "en": {
    "rules": "Rules",
    "ruleHint": "No rules means allow all.",
    "ruleAllow": "Allow",
    "ruleDisallow": "Disallow",
    "pathPlaceholder": "/path/",
    "addRule": "Add rule",
    "crawlDelay": "Crawl-delay (seconds)",
    "crawlDelayPlaceholder": "e.g. 10"
  },
  "zh": {
    "rules": "规则",
    "ruleHint": "没有规则表示允许全部。",
    "ruleAllow": "允许",
    "ruleDisallow": "禁止",
    "pathPlaceholder": "/path/",
    "addRule": "添加规则",
    "crawlDelay": "Crawl-delay（秒）",
    "crawlDelayPlaceholder": "例如 10"
  },
  "zh-CN": {
    "rules": "规则",
    "ruleHint": "没有规则表示允许全部。",
    "ruleAllow": "允许",
    "ruleDisallow": "禁止",
    "pathPlaceholder": "/path/",
    "addRule": "添加规则",
    "crawlDelay": "Crawl-delay（秒）",
    "crawlDelayPlaceholder": "例如 10"
  },
  "zh-TW": {
    "rules": "規則",
    "ruleHint": "沒有規則表示允許全部。",
    "ruleAllow": "允許",
    "ruleDisallow": "禁止",
    "pathPlaceholder": "/path/",
    "addRule": "新增規則",
    "crawlDelay": "Crawl-delay（秒）",
    "crawlDelayPlaceholder": "例如 10"
  },
  "zh-HK": {
    "rules": "規則",
    "ruleHint": "沒有規則表示允許全部。",
    "ruleAllow": "允許",
    "ruleDisallow": "禁止",
    "pathPlaceholder": "/path/",
    "addRule": "新增規則",
    "crawlDelay": "Crawl-delay（秒）",
    "crawlDelayPlaceholder": "例如 10"
  },
  "es": {
    "rules": "Reglas",
    "ruleHint": "Sin reglas significa permitir todo.",
    "ruleAllow": "Permitir",
    "ruleDisallow": "Bloquear",
    "pathPlaceholder": "/path/",
    "addRule": "Agregar regla",
    "crawlDelay": "Crawl-delay (segundos)",
    "crawlDelayPlaceholder": "p. ej., 10"
  },
  "fr": {
    "rules": "Règles",
    "ruleHint": "Aucune règle signifie tout autoriser.",
    "ruleAllow": "Autoriser",
    "ruleDisallow": "Interdire",
    "pathPlaceholder": "/path/",
    "addRule": "Ajouter une règle",
    "crawlDelay": "Crawl-delay (secondes)",
    "crawlDelayPlaceholder": "ex. 10"
  },
  "de": {
    "rules": "Regeln",
    "ruleHint": "Keine Regeln bedeutet alles erlauben.",
    "ruleAllow": "Erlauben",
    "ruleDisallow": "Sperren",
    "pathPlaceholder": "/path/",
    "addRule": "Regel hinzufügen",
    "crawlDelay": "Crawl-delay (Sekunden)",
    "crawlDelayPlaceholder": "z. B. 10"
  },
  "it": {
    "rules": "Regole",
    "ruleHint": "Nessuna regola significa consentire tutto.",
    "ruleAllow": "Consenti",
    "ruleDisallow": "Blocca",
    "pathPlaceholder": "/path/",
    "addRule": "Aggiungi regola",
    "crawlDelay": "Crawl-delay (secondi)",
    "crawlDelayPlaceholder": "es. 10"
  },
  "ja": {
    "rules": "ルール",
    "ruleHint": "ルールなしは全て許可です。",
    "ruleAllow": "許可",
    "ruleDisallow": "禁止",
    "pathPlaceholder": "/path/",
    "addRule": "ルールを追加",
    "crawlDelay": "Crawl-delay（秒）",
    "crawlDelayPlaceholder": "例: 10"
  },
  "ko": {
    "rules": "규칙",
    "ruleHint": "규칙이 없으면 모두 허용됩니다.",
    "ruleAllow": "허용",
    "ruleDisallow": "차단",
    "pathPlaceholder": "/path/",
    "addRule": "규칙 추가",
    "crawlDelay": "Crawl-delay(초)",
    "crawlDelayPlaceholder": "예: 10"
  },
  "ru": {
    "rules": "Правила",
    "ruleHint": "Нет правил — значит разрешить всё.",
    "ruleAllow": "Разрешить",
    "ruleDisallow": "Запретить",
    "pathPlaceholder": "/path/",
    "addRule": "Добавить правило",
    "crawlDelay": "Crawl-delay (секунды)",
    "crawlDelayPlaceholder": "например, 10"
  },
  "pt": {
    "rules": "Regras",
    "ruleHint": "Sem regras significa permitir tudo.",
    "ruleAllow": "Permitir",
    "ruleDisallow": "Bloquear",
    "pathPlaceholder": "/path/",
    "addRule": "Adicionar regra",
    "crawlDelay": "Crawl-delay (segundos)",
    "crawlDelayPlaceholder": "ex.: 10"
  },
  "ar": {
    "rules": "القواعد",
    "ruleHint": "عدم وجود قواعد يعني السماح للجميع.",
    "ruleAllow": "سماح",
    "ruleDisallow": "حظر",
    "pathPlaceholder": "/path/",
    "addRule": "إضافة قاعدة",
    "crawlDelay": "Crawl-delay (ثوانٍ)",
    "crawlDelayPlaceholder": "مثال: 10"
  },
  "hi": {
    "rules": "नियम",
    "ruleHint": "नियम न होने का मतलब सबको अनुमति है।",
    "ruleAllow": "अनुमति दें",
    "ruleDisallow": "रोकें",
    "pathPlaceholder": "/path/",
    "addRule": "नियम जोड़ें",
    "crawlDelay": "Crawl-delay (सेकंड)",
    "crawlDelayPlaceholder": "जैसे 10"
  },
  "tr": {
    "rules": "Kurallar",
    "ruleHint": "Kural yoksa hepsi izinlidir.",
    "ruleAllow": "İzin ver",
    "ruleDisallow": "Engelle",
    "pathPlaceholder": "/path/",
    "addRule": "Kural ekle",
    "crawlDelay": "Crawl-delay (saniye)",
    "crawlDelayPlaceholder": "örn. 10"
  },
  "nl": {
    "rules": "Regels",
    "ruleHint": "Geen regels betekent alles toestaan.",
    "ruleAllow": "Toestaan",
    "ruleDisallow": "Blokkeren",
    "pathPlaceholder": "/path/",
    "addRule": "Regel toevoegen",
    "crawlDelay": "Crawl-delay (seconden)",
    "crawlDelayPlaceholder": "bijv. 10"
  },
  "sv": {
    "rules": "Regler",
    "ruleHint": "Inga regler betyder tillåt allt.",
    "ruleAllow": "Tillåt",
    "ruleDisallow": "Blockera",
    "pathPlaceholder": "/path/",
    "addRule": "Lägg till regel",
    "crawlDelay": "Crawl-delay (sekunder)",
    "crawlDelayPlaceholder": "t.ex. 10"
  },
  "pl": {
    "rules": "Reguły",
    "ruleHint": "Brak reguł oznacza zezwolenie na wszystko.",
    "ruleAllow": "Zezwól",
    "ruleDisallow": "Zablokuj",
    "pathPlaceholder": "/path/",
    "addRule": "Dodaj regułę",
    "crawlDelay": "Crawl-delay (sekundy)",
    "crawlDelayPlaceholder": "np. 10"
  },
  "vi": {
    "rules": "Quy tắc",
    "ruleHint": "Không có quy tắc nghĩa là cho phép tất cả.",
    "ruleAllow": "Cho phép",
    "ruleDisallow": "Chặn",
    "pathPlaceholder": "/path/",
    "addRule": "Thêm quy tắc",
    "crawlDelay": "Crawl-delay (giây)",
    "crawlDelayPlaceholder": "ví dụ 10"
  },
  "th": {
    "rules": "กฎ",
    "ruleHint": "ไม่มีรายการหมายถึงอนุญาตทั้งหมด",
    "ruleAllow": "อนุญาต",
    "ruleDisallow": "บล็อก",
    "pathPlaceholder": "/path/",
    "addRule": "เพิ่มกฎ",
    "crawlDelay": "Crawl-delay (วินาที)",
    "crawlDelayPlaceholder": "เช่น 10"
  },
  "id": {
    "rules": "Aturan",
    "ruleHint": "Tanpa aturan berarti izinkan semua.",
    "ruleAllow": "Izinkan",
    "ruleDisallow": "Blokir",
    "pathPlaceholder": "/path/",
    "addRule": "Tambahkan aturan",
    "crawlDelay": "Crawl-delay (detik)",
    "crawlDelayPlaceholder": "mis. 10"
  },
  "he": {
    "rules": "כללים",
    "ruleHint": "אין כללים משמעותו לאפשר הכול.",
    "ruleAllow": "אפשר",
    "ruleDisallow": "חסום",
    "pathPlaceholder": "/path/",
    "addRule": "הוסף כלל",
    "crawlDelay": "Crawl-delay (שניות)",
    "crawlDelayPlaceholder": "לדוגמה 10"
  },
  "ms": {
    "rules": "Peraturan",
    "ruleHint": "Tiada peraturan bermaksud benarkan semua.",
    "ruleAllow": "Benarkan",
    "ruleDisallow": "Sekat",
    "pathPlaceholder": "/path/",
    "addRule": "Tambah peraturan",
    "crawlDelay": "Crawl-delay (saat)",
    "crawlDelayPlaceholder": "cth. 10"
  },
  "no": {
    "rules": "Regler",
    "ruleHint": "Ingen regler betyr tillat alt.",
    "ruleAllow": "Tillat",
    "ruleDisallow": "Blokker",
    "pathPlaceholder": "/path/",
    "addRule": "Legg til regel",
    "crawlDelay": "Crawl-delay (sekunder)",
    "crawlDelayPlaceholder": "f.eks. 10"
  }
}
</i18n>
