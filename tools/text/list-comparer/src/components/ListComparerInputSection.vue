<template>
  <ToolSectionHeader>{{ t('compareTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-flex justify="space-between" align="center" :wrap="true">
        <n-flex :size="8">
          <n-button text @click="emit('swap')">{{ t('swap') }}</n-button>
          <n-button text @click="emit('use-sample')">{{ t('sample') }}</n-button>
          <n-button text @click="emit('clear')">{{ t('clear') }}</n-button>
        </n-flex>
      </n-flex>

      <n-grid cols="1 m:2" responsive="screen" :x-gap="12" :y-gap="12">
        <n-gi>
          <n-card size="small">
            <template #header>{{ t('leftList') }}</template>
            <template #header-extra>
              <n-text depth="3">
                {{
                  t('listStats', { total: leftSummary.totalCount, unique: leftSummary.uniqueCount })
                }}
              </n-text>
            </template>
            <n-input
              v-model:value="leftText"
              type="textarea"
              :rows="12"
              :placeholder="t('pastePlaceholder', { label: t('leftList') })"
            />
          </n-card>
        </n-gi>

        <n-gi>
          <n-card size="small">
            <template #header>{{ t('rightList') }}</template>
            <template #header-extra>
              <n-text depth="3">
                {{
                  t('listStats', {
                    total: rightSummary.totalCount,
                    unique: rightSummary.uniqueCount,
                  })
                }}
              </n-text>
            </template>
            <n-input
              v-model:value="rightText"
              type="textarea"
              :rows="12"
              :placeholder="t('pastePlaceholder', { label: t('rightList') })"
            />
          </n-card>
        </n-gi>
      </n-grid>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NButton, NCard, NFlex, NGi, NGrid, NInput, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { ParsedListSummary } from '../utils/listComparer'

defineProps<{
  leftSummary: ParsedListSummary
  rightSummary: ParsedListSummary
}>()

const emit = defineEmits<{
  swap: []
  'use-sample': []
  clear: []
}>()

const leftText = defineModel<string>('leftText', { required: true })
const rightText = defineModel<string>('rightText', { required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "compareTitle": "Compare Lists",
    "swap": "Swap lists",
    "sample": "Load sample",
    "clear": "Clear",
    "leftList": "List A",
    "rightList": "List B",
    "listStats": "{total} items, {unique} unique",
    "pastePlaceholder": "Paste {label} here..."
  },
  "zh": {
    "compareTitle": "比较列表",
    "swap": "交换列表",
    "sample": "载入示例",
    "clear": "清空",
    "leftList": "列表 A",
    "rightList": "列表 B",
    "listStats": "{total} 项，{unique} 个唯一值",
    "pastePlaceholder": "在此粘贴{label}..."
  },
  "zh-CN": {
    "compareTitle": "比较列表",
    "swap": "交换列表",
    "sample": "载入示例",
    "clear": "清空",
    "leftList": "列表 A",
    "rightList": "列表 B",
    "listStats": "{total} 项，{unique} 个唯一值",
    "pastePlaceholder": "在此粘贴{label}..."
  },
  "zh-TW": {
    "compareTitle": "比較列表",
    "swap": "交換列表",
    "sample": "載入範例",
    "clear": "清空",
    "leftList": "列表 A",
    "rightList": "列表 B",
    "listStats": "{total} 項，{unique} 個唯一值",
    "pastePlaceholder": "在此貼上{label}..."
  },
  "zh-HK": {
    "compareTitle": "比較列表",
    "swap": "交換列表",
    "sample": "載入範例",
    "clear": "清空",
    "leftList": "列表 A",
    "rightList": "列表 B",
    "listStats": "{total} 項，{unique} 個唯一值",
    "pastePlaceholder": "在此貼上{label}..."
  },
  "es": {
    "compareTitle": "Comparar listas",
    "swap": "Intercambiar listas",
    "sample": "Cargar ejemplo",
    "clear": "Limpiar",
    "leftList": "Lista A",
    "rightList": "Lista B",
    "listStats": "{total} elementos, {unique} unicos",
    "pastePlaceholder": "Pega {label} aqui..."
  },
  "fr": {
    "compareTitle": "Comparer des listes",
    "swap": "Inverser les listes",
    "sample": "Charger un exemple",
    "clear": "Effacer",
    "leftList": "Liste A",
    "rightList": "Liste B",
    "listStats": "{total} elements, {unique} uniques",
    "pastePlaceholder": "Collez {label} ici..."
  },
  "de": {
    "compareTitle": "Listen vergleichen",
    "swap": "Listen tauschen",
    "sample": "Beispiel laden",
    "clear": "Leeren",
    "leftList": "Liste A",
    "rightList": "Liste B",
    "listStats": "{total} Eintrage, {unique} eindeutig",
    "pastePlaceholder": "{label} hier einfugen..."
  },
  "it": {
    "compareTitle": "Confronta liste",
    "swap": "Scambia liste",
    "sample": "Carica esempio",
    "clear": "Cancella",
    "leftList": "Lista A",
    "rightList": "Lista B",
    "listStats": "{total} elementi, {unique} unici",
    "pastePlaceholder": "Incolla {label} qui..."
  },
  "ja": {
    "compareTitle": "リストを比較",
    "swap": "リストを入れ替え",
    "sample": "サンプルを読み込む",
    "clear": "クリア",
    "leftList": "リスト A",
    "rightList": "リスト B",
    "listStats": "{total} 件, 一意 {unique} 件",
    "pastePlaceholder": "{label} をここに貼り付け..."
  },
  "ko": {
    "compareTitle": "목록 비교",
    "swap": "목록 교체",
    "sample": "예제 불러오기",
    "clear": "지우기",
    "leftList": "목록 A",
    "rightList": "목록 B",
    "listStats": "{total}개 항목, 고유 {unique}개",
    "pastePlaceholder": "{label}을 여기에 붙여넣기..."
  },
  "ru": {
    "compareTitle": "Сравнить списки",
    "swap": "Поменять списки",
    "sample": "Загрузить пример",
    "clear": "Очистить",
    "leftList": "Список A",
    "rightList": "Список B",
    "listStats": "{total} элементов, {unique} уникальных",
    "pastePlaceholder": "Вставьте {label} сюда..."
  },
  "pt": {
    "compareTitle": "Comparar listas",
    "swap": "Trocar listas",
    "sample": "Carregar exemplo",
    "clear": "Limpar",
    "leftList": "Lista A",
    "rightList": "Lista B",
    "listStats": "{total} itens, {unique} unicos",
    "pastePlaceholder": "Cole {label} aqui..."
  },
  "ar": {
    "compareTitle": "مقارنة القوائم",
    "swap": "تبديل القوائم",
    "sample": "تحميل مثال",
    "clear": "مسح",
    "leftList": "القائمة A",
    "rightList": "القائمة B",
    "listStats": "{total} عنصر، {unique} فريد",
    "pastePlaceholder": "الصق {label} هنا..."
  },
  "hi": {
    "compareTitle": "सूचियों की तुलना करें",
    "swap": "सूचियां बदलें",
    "sample": "उदाहरण लोड करें",
    "clear": "साफ करें",
    "leftList": "सूची A",
    "rightList": "सूची B",
    "listStats": "{total} आइटम, {unique} अद्वितीय",
    "pastePlaceholder": "{label} यहां पेस्ट करें..."
  },
  "tr": {
    "compareTitle": "Listeleri karsilastir",
    "swap": "Listeleri degistir",
    "sample": "Ornek yukle",
    "clear": "Temizle",
    "leftList": "Liste A",
    "rightList": "Liste B",
    "listStats": "{total} oge, {unique} benzersiz",
    "pastePlaceholder": "{label} buraya yapistirin..."
  },
  "nl": {
    "compareTitle": "Lijsten vergelijken",
    "swap": "Lijsten omwisselen",
    "sample": "Voorbeeld laden",
    "clear": "Wissen",
    "leftList": "Lijst A",
    "rightList": "Lijst B",
    "listStats": "{total} items, {unique} uniek",
    "pastePlaceholder": "Plak {label} hier..."
  },
  "sv": {
    "compareTitle": "Jamfor listor",
    "swap": "Byt listor",
    "sample": "Ladda exempel",
    "clear": "Rensa",
    "leftList": "Lista A",
    "rightList": "Lista B",
    "listStats": "{total} poster, {unique} unika",
    "pastePlaceholder": "Klistra in {label} har..."
  },
  "pl": {
    "compareTitle": "Porownaj listy",
    "swap": "Zamien listy",
    "sample": "Wczytaj przyklad",
    "clear": "Wyczysc",
    "leftList": "Lista A",
    "rightList": "Lista B",
    "listStats": "{total} elementow, {unique} unikalnych",
    "pastePlaceholder": "Wklej {label} tutaj..."
  },
  "vi": {
    "compareTitle": "So sanh danh sach",
    "swap": "Hoan doi danh sach",
    "sample": "Tai vi du",
    "clear": "Xoa",
    "leftList": "Danh sach A",
    "rightList": "Danh sach B",
    "listStats": "{total} muc, {unique} duy nhat",
    "pastePlaceholder": "Dan {label} vao day..."
  },
  "th": {
    "compareTitle": "เปรียบเทียบรายการ",
    "swap": "สลับรายการ",
    "sample": "โหลดตัวอย่าง",
    "clear": "ล้าง",
    "leftList": "รายการ A",
    "rightList": "รายการ B",
    "listStats": "{total} รายการ, {unique} ไม่ซ้ำ",
    "pastePlaceholder": "วาง{label}ที่นี่..."
  },
  "id": {
    "compareTitle": "Bandingkan daftar",
    "swap": "Tukar daftar",
    "sample": "Muat contoh",
    "clear": "Bersihkan",
    "leftList": "Daftar A",
    "rightList": "Daftar B",
    "listStats": "{total} item, {unique} unik",
    "pastePlaceholder": "Tempel {label} di sini..."
  },
  "he": {
    "compareTitle": "השוואת רשימות",
    "swap": "החלף רשימות",
    "sample": "טען דוגמה",
    "clear": "נקה",
    "leftList": "רשימה A",
    "rightList": "רשימה B",
    "listStats": "{total} פריטים, {unique} ייחודיים",
    "pastePlaceholder": "הדבק כאן את {label}..."
  },
  "ms": {
    "compareTitle": "Bandingkan senarai",
    "swap": "Tukar senarai",
    "sample": "Muat contoh",
    "clear": "Kosongkan",
    "leftList": "Senarai A",
    "rightList": "Senarai B",
    "listStats": "{total} item, {unique} unik",
    "pastePlaceholder": "Tampal {label} di sini..."
  },
  "no": {
    "compareTitle": "Sammenlign lister",
    "swap": "Bytt lister",
    "sample": "Last inn eksempel",
    "clear": "Tomm",
    "leftList": "Liste A",
    "rightList": "Liste B",
    "listStats": "{total} elementer, {unique} unike",
    "pastePlaceholder": "Lim inn {label} her..."
  }
}
</i18n>
