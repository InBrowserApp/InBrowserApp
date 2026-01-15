<template>
  <CspBuilderSection
    :directives="safeBuilderDirectives"
    :generated-policy="generatedPolicy"
    :has-output="hasOutput"
    :labels="labels"
    @add="addDirective"
    @remove="removeDirective"
    @update-name="updateDirectiveName"
    @update-values="updateDirectiveValues"
  />
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import { stringifyCsp, textToValues } from '../utils/csp'
import CspBuilderSection from './CspBuilderSection.vue'
import type { BuilderDirective } from './CspBuilderSection.vue'

const { t } = useI18n()

const createDirectiveId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

const createDirective = (name = '', valuesText = ''): BuilderDirective => ({
  id: createDirectiveId(),
  name,
  valuesText,
})

const defaultDirectives = () => [createDirective('default-src', "'self'")]
const emptyDirectives = () => [createDirective()]

const normalizeBuilderDirectives = (value: unknown): BuilderDirective[] => {
  if (!Array.isArray(value)) return defaultDirectives()

  let changed = false
  const normalized: BuilderDirective[] = []

  for (const item of value) {
    if (!item || typeof item !== 'object') {
      changed = true
      continue
    }

    const directive = item as Partial<BuilderDirective>
    const name = typeof directive.name === 'string' ? directive.name : ''
    const valuesText = typeof directive.valuesText === 'string' ? directive.valuesText : ''
    const id =
      typeof directive.id === 'string' && directive.id.trim().length > 0
        ? directive.id
        : createDirectiveId()

    if (name !== directive.name || valuesText !== directive.valuesText || id !== directive.id) {
      changed = true
    }

    normalized.push({ id, name, valuesText })
  }

  if (normalized.length === 0) return defaultDirectives()

  return changed ? normalized : (value as BuilderDirective[])
}

const builderDirectives = useStorage<BuilderDirective[]>(
  'tools:csp-generator:builder',
  defaultDirectives(),
)

const safeBuilderDirectives = computed<BuilderDirective[]>(() =>
  normalizeBuilderDirectives(builderDirectives.value),
)

watchEffect(() => {
  if (safeBuilderDirectives.value !== builderDirectives.value) {
    builderDirectives.value = safeBuilderDirectives.value
  }
})

const normalizedBuilder = computed(() =>
  safeBuilderDirectives.value
    .map((directive) => ({
      name: directive.name.trim(),
      values: textToValues(directive.valuesText),
    }))
    .filter((directive) => directive.name.length > 0),
)

const generatedPolicy = computed(() => stringifyCsp(normalizedBuilder.value))
const hasOutput = computed(() => generatedPolicy.value.trim().length > 0)

const labels = computed(() => ({
  builderTitle: t('builder-title'),
  directiveName: t('directive-name'),
  directiveValues: t('directive-values'),
  namePlaceholder: t('name-placeholder'),
  valuesPlaceholder: t('values-placeholder'),
  addDirective: t('add-directive'),
  removeDirective: t('remove-directive'),
  outputTitle: t('output-title'),
  outputLabel: t('output-label'),
  outputEmpty: t('output-empty'),
}))

const addDirective = () => {
  builderDirectives.value = [...safeBuilderDirectives.value, createDirective()]
}

const removeDirective = (id: string) => {
  const next = safeBuilderDirectives.value.filter((directive) => directive.id !== id)
  builderDirectives.value = next.length === 0 ? emptyDirectives() : next
}

const updateDirectiveName = (id: string, value: string) => {
  const index = safeBuilderDirectives.value.findIndex((directive) => directive.id === id)
  if (index === -1) return

  const current = safeBuilderDirectives.value[index]!
  const next = [...safeBuilderDirectives.value]
  next[index] = { ...current, name: value }
  builderDirectives.value = next
}

const updateDirectiveValues = (id: string, value: string) => {
  const index = safeBuilderDirectives.value.findIndex((directive) => directive.id === id)
  if (index === -1) return

  const current = safeBuilderDirectives.value[index]!
  const next = [...safeBuilderDirectives.value]
  next[index] = { ...current, valuesText: value }
  builderDirectives.value = next
}
</script>

<i18n lang="json">
{
  "en": {
    "builder-title": "CSP Generator",
    "directive-name": "Directive",
    "directive-values": "Values",
    "name-placeholder": "e.g. default-src",
    "values-placeholder": "e.g. 'self' https://cdn.example.com",
    "add-directive": "Add directive",
    "remove-directive": "Remove",
    "output-title": "Generated Policy",
    "output-label": "CSP Output",
    "output-empty": "Add directives to generate a CSP header."
  },
  "zh": {
    "builder-title": "CSP 生成",
    "directive-name": "指令",
    "directive-values": "值",
    "name-placeholder": "例如 default-src",
    "values-placeholder": "例如 'self' https://cdn.example.com",
    "add-directive": "添加指令",
    "remove-directive": "移除",
    "output-title": "生成结果",
    "output-label": "CSP 输出",
    "output-empty": "添加指令以生成 CSP 头部。"
  },
  "zh-CN": {
    "builder-title": "CSP 生成",
    "directive-name": "指令",
    "directive-values": "值",
    "name-placeholder": "例如 default-src",
    "values-placeholder": "例如 'self' https://cdn.example.com",
    "add-directive": "添加指令",
    "remove-directive": "移除",
    "output-title": "生成结果",
    "output-label": "CSP 输出",
    "output-empty": "添加指令以生成 CSP 头部。"
  },
  "zh-TW": {
    "builder-title": "CSP 產生",
    "directive-name": "指令",
    "directive-values": "值",
    "name-placeholder": "例如 default-src",
    "values-placeholder": "例如 'self' https://cdn.example.com",
    "add-directive": "新增指令",
    "remove-directive": "移除",
    "output-title": "產生結果",
    "output-label": "CSP 輸出",
    "output-empty": "新增指令以產生 CSP 標頭。"
  },
  "zh-HK": {
    "builder-title": "CSP 產生",
    "directive-name": "指令",
    "directive-values": "值",
    "name-placeholder": "例如 default-src",
    "values-placeholder": "例如 'self' https://cdn.example.com",
    "add-directive": "新增指令",
    "remove-directive": "移除",
    "output-title": "產生結果",
    "output-label": "CSP 輸出",
    "output-empty": "新增指令以產生 CSP 標頭。"
  },
  "es": {
    "builder-title": "Generador CSP",
    "directive-name": "Directiva",
    "directive-values": "Valores",
    "name-placeholder": "p. ej. default-src",
    "values-placeholder": "p. ej. 'self' https://cdn.example.com",
    "add-directive": "Añadir directiva",
    "remove-directive": "Eliminar",
    "output-title": "Política generada",
    "output-label": "Salida CSP",
    "output-empty": "Añade directivas para generar un encabezado CSP."
  },
  "fr": {
    "builder-title": "Générateur CSP",
    "directive-name": "Directive",
    "directive-values": "Valeurs",
    "name-placeholder": "ex. default-src",
    "values-placeholder": "ex. 'self' https://cdn.example.com",
    "add-directive": "Ajouter une directive",
    "remove-directive": "Supprimer",
    "output-title": "Politique générée",
    "output-label": "Sortie CSP",
    "output-empty": "Ajoutez des directives pour générer un en-tête CSP."
  },
  "de": {
    "builder-title": "CSP-Generator",
    "directive-name": "Direktive",
    "directive-values": "Werte",
    "name-placeholder": "z. B. default-src",
    "values-placeholder": "z. B. 'self' https://cdn.example.com",
    "add-directive": "Direktive hinzufügen",
    "remove-directive": "Entfernen",
    "output-title": "Generierte Richtlinie",
    "output-label": "CSP-Ausgabe",
    "output-empty": "Füge Direktiven hinzu, um einen CSP-Header zu erzeugen."
  },
  "it": {
    "builder-title": "Generatore CSP",
    "directive-name": "Direttiva",
    "directive-values": "Valori",
    "name-placeholder": "es. default-src",
    "values-placeholder": "es. 'self' https://cdn.example.com",
    "add-directive": "Aggiungi direttiva",
    "remove-directive": "Rimuovi",
    "output-title": "Politica generata",
    "output-label": "Output CSP",
    "output-empty": "Aggiungi direttive per generare un header CSP."
  },
  "ja": {
    "builder-title": "CSP 生成",
    "directive-name": "ディレクティブ",
    "directive-values": "値",
    "name-placeholder": "例: default-src",
    "values-placeholder": "例: 'self' https://cdn.example.com",
    "add-directive": "ディレクティブを追加",
    "remove-directive": "削除",
    "output-title": "生成結果",
    "output-label": "CSP 出力",
    "output-empty": "ディレクティブを追加して CSP を生成してください。"
  },
  "ko": {
    "builder-title": "CSP 생성기",
    "directive-name": "지시문",
    "directive-values": "값",
    "name-placeholder": "예: default-src",
    "values-placeholder": "예: 'self' https://cdn.example.com",
    "add-directive": "지시문 추가",
    "remove-directive": "삭제",
    "output-title": "생성된 정책",
    "output-label": "CSP 출력",
    "output-empty": "지시문을 추가해 CSP 헤더를 생성하세요."
  },
  "ru": {
    "builder-title": "Генератор CSP",
    "directive-name": "Директива",
    "directive-values": "Значения",
    "name-placeholder": "например default-src",
    "values-placeholder": "например 'self' https://cdn.example.com",
    "add-directive": "Добавить директиву",
    "remove-directive": "Удалить",
    "output-title": "Сгенерированная политика",
    "output-label": "CSP вывод",
    "output-empty": "Добавьте директивы для создания CSP заголовка."
  },
  "pt": {
    "builder-title": "Gerador CSP",
    "directive-name": "Diretiva",
    "directive-values": "Valores",
    "name-placeholder": "ex.: default-src",
    "values-placeholder": "ex.: 'self' https://cdn.example.com",
    "add-directive": "Adicionar diretiva",
    "remove-directive": "Remover",
    "output-title": "Política gerada",
    "output-label": "Saída CSP",
    "output-empty": "Adicione diretivas para gerar um cabeçalho CSP."
  },
  "ar": {
    "builder-title": "مولّد CSP",
    "directive-name": "توجيه",
    "directive-values": "القيم",
    "name-placeholder": "مثال: default-src",
    "values-placeholder": "مثال: 'self' https://cdn.example.com",
    "add-directive": "إضافة توجيه",
    "remove-directive": "إزالة",
    "output-title": "السياسة المُولدة",
    "output-label": "مخرجات CSP",
    "output-empty": "أضف توجيهات لإنشاء ترويسة CSP."
  },
  "hi": {
    "builder-title": "CSP जनरेटर",
    "directive-name": "निर्देश",
    "directive-values": "मान",
    "name-placeholder": "जैसे default-src",
    "values-placeholder": "जैसे 'self' https://cdn.example.com",
    "add-directive": "निर्देश जोड़ें",
    "remove-directive": "हटाएँ",
    "output-title": "जनित नीति",
    "output-label": "CSP आउटपुट",
    "output-empty": "CSP हेडर बनाने के लिए निर्देश जोड़ें।"
  },
  "tr": {
    "builder-title": "CSP Oluşturucu",
    "directive-name": "Yönerge",
    "directive-values": "Değerler",
    "name-placeholder": "ör. default-src",
    "values-placeholder": "ör. 'self' https://cdn.example.com",
    "add-directive": "Yönerge ekle",
    "remove-directive": "Kaldır",
    "output-title": "Oluşturulan Politika",
    "output-label": "CSP Çıktısı",
    "output-empty": "CSP başlığı oluşturmak için yönergeler ekleyin."
  },
  "nl": {
    "builder-title": "CSP-generator",
    "directive-name": "Directive",
    "directive-values": "Waarden",
    "name-placeholder": "bijv. default-src",
    "values-placeholder": "bijv. 'self' https://cdn.example.com",
    "add-directive": "Directive toevoegen",
    "remove-directive": "Verwijderen",
    "output-title": "Gegenereerd beleid",
    "output-label": "CSP-uitvoer",
    "output-empty": "Voeg directives toe om een CSP-header te genereren."
  },
  "sv": {
    "builder-title": "CSP-generator",
    "directive-name": "Direktiv",
    "directive-values": "Värden",
    "name-placeholder": "t.ex. default-src",
    "values-placeholder": "t.ex. 'self' https://cdn.example.com",
    "add-directive": "Lägg till direktiv",
    "remove-directive": "Ta bort",
    "output-title": "Genererad policy",
    "output-label": "CSP-utdata",
    "output-empty": "Lägg till direktiv för att skapa en CSP-rubrik."
  },
  "pl": {
    "builder-title": "Generator CSP",
    "directive-name": "Dyrektywa",
    "directive-values": "Wartości",
    "name-placeholder": "np. default-src",
    "values-placeholder": "np. 'self' https://cdn.example.com",
    "add-directive": "Dodaj dyrektywę",
    "remove-directive": "Usuń",
    "output-title": "Wygenerowana polityka",
    "output-label": "Wyjście CSP",
    "output-empty": "Dodaj dyrektywy, aby wygenerować nagłówek CSP."
  },
  "vi": {
    "builder-title": "Trình tạo CSP",
    "directive-name": "Chỉ thị",
    "directive-values": "Giá trị",
    "name-placeholder": "ví dụ: default-src",
    "values-placeholder": "ví dụ: 'self' https://cdn.example.com",
    "add-directive": "Thêm chỉ thị",
    "remove-directive": "Xóa",
    "output-title": "Chính sách đã tạo",
    "output-label": "Đầu ra CSP",
    "output-empty": "Thêm chỉ thị để tạo header CSP."
  },
  "th": {
    "builder-title": "ตัวสร้าง CSP",
    "directive-name": "Directive",
    "directive-values": "ค่า",
    "name-placeholder": "เช่น default-src",
    "values-placeholder": "เช่น 'self' https://cdn.example.com",
    "add-directive": "เพิ่ม directive",
    "remove-directive": "ลบ",
    "output-title": "นโยบายที่สร้าง",
    "output-label": "เอาต์พุต CSP",
    "output-empty": "เพิ่ม directive เพื่อสร้างส่วนหัว CSP"
  },
  "id": {
    "builder-title": "Generator CSP",
    "directive-name": "Direktif",
    "directive-values": "Nilai",
    "name-placeholder": "mis. default-src",
    "values-placeholder": "mis. 'self' https://cdn.example.com",
    "add-directive": "Tambah direktif",
    "remove-directive": "Hapus",
    "output-title": "Kebijakan yang dihasilkan",
    "output-label": "Output CSP",
    "output-empty": "Tambahkan direktif untuk membuat header CSP."
  },
  "he": {
    "builder-title": "מחולל CSP",
    "directive-name": "הנחיה",
    "directive-values": "ערכים",
    "name-placeholder": "לדוגמה default-src",
    "values-placeholder": "לדוגמה 'self' https://cdn.example.com",
    "add-directive": "הוסף הנחיה",
    "remove-directive": "הסר",
    "output-title": "מדיניות שנוצרה",
    "output-label": "פלט CSP",
    "output-empty": "הוסף הנחיות כדי ליצור כותרת CSP."
  },
  "ms": {
    "builder-title": "Penjana CSP",
    "directive-name": "Arahan",
    "directive-values": "Nilai",
    "name-placeholder": "cth. default-src",
    "values-placeholder": "cth. 'self' https://cdn.example.com",
    "add-directive": "Tambah arahan",
    "remove-directive": "Buang",
    "output-title": "Polisi yang dijana",
    "output-label": "Output CSP",
    "output-empty": "Tambah arahan untuk menjana pengepala CSP."
  },
  "no": {
    "builder-title": "CSP-generator",
    "directive-name": "Direktiv",
    "directive-values": "Verdier",
    "name-placeholder": "f.eks. default-src",
    "values-placeholder": "f.eks. 'self' https://cdn.example.com",
    "add-directive": "Legg til direktiv",
    "remove-directive": "Fjern",
    "output-title": "Generert policy",
    "output-label": "CSP-utdata",
    "output-empty": "Legg til direktiver for å lage en CSP-header."
  }
}
</i18n>
