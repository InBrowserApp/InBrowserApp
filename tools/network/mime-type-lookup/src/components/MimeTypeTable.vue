<template>
  <NDataTable
    :columns="columns"
    :data="filteredMimeTypes"
    :bordered="false"
    size="small"
    :pagination="pagination"
    :row-key="(row) => row.mimeType"
  />
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { NDataTable, NTag } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { CopyToClipboardTooltip } from '@shared/ui/base'
import mimeDatabase from 'mime-db'
import CategoryTag from './CategoryTag.vue'

const props = defineProps<{
  search: string
  category: string
}>()

const { t } = useI18n()

const allMimeTypes = computed(() =>
  Object.entries(mimeDatabase)
    .map(([mimeType, data]) => ({ mimeType, ...data }))
    .sort((a, b) => a.mimeType.localeCompare(b.mimeType)),
)

const filteredMimeTypes = computed(() => {
  let result = allMimeTypes.value

  // Filter by category
  if (props.category !== 'all') {
    result = result.filter((m) => m.mimeType.startsWith(props.category + '/'))
  }

  // Filter by search
  if (props.search) {
    const query = props.search.toLowerCase()
    result = result.filter(
      (m) =>
        m.mimeType.toLowerCase().includes(query) ||
        m.extensions?.some((ext) => ext.toLowerCase().includes(query)) ||
        m.source?.toLowerCase().includes(query) ||
        m.charset?.toLowerCase().includes(query),
    )
  }

  return result
})

const pagination = {
  pageSize: 20,
}

const columns = computed<DataTableColumns<(typeof allMimeTypes.value)[number]>>(() => [
  {
    title: t('mimeType'),
    key: 'mimeType',
    width: 200,
    render(row) {
      return h(
        CopyToClipboardTooltip,
        { content: row.mimeType },
        {
          default: ({ copy }: { copy: () => void }) =>
            h(
              'span',
              {
                style: { fontFamily: 'monospace', cursor: 'pointer' },
                onClick: copy,
              },
              row.mimeType,
            ),
        },
      )
    },
  },
  {
    title: t('extensions'),
    key: 'extensions',
    width: 200,
    render(row) {
      const extensionsText = row?.extensions?.join(', ') || ''
      return h(
        CopyToClipboardTooltip,
        { content: extensionsText },
        {
          default: ({ copy }: { copy: () => void }) =>
            h(
              'span',
              {
                style: { fontFamily: 'monospace', cursor: 'pointer' },
                onClick: copy,
              },
              extensionsText,
            ),
        },
      )
    },
  },
  {
    title: t('category'),
    key: 'category',
    width: 150,
    render(row) {
      return h(CategoryTag, {
        category: row.mimeType.split('/')[0]!,
      })
    },
  },
  {
    title: t('source'),
    key: 'source',
    width: 100,
    render(row) {
      return row.source
        ? h(NTag, { size: 'small', type: 'info', bordered: false }, () => row.source!.toUpperCase())
        : h('span', '-')
    },
  },
  {
    title: t('compressible'),
    key: 'compressible',
    width: 120,
    render(row) {
      if (row.compressible === undefined) return h('span', '-')
      return h(
        NTag,
        { size: 'small', type: row.compressible ? 'success' : 'default', bordered: false },
        () => (row.compressible ? t('yes') : t('no')),
      )
    },
  },
  {
    title: t('charset'),
    key: 'charset',
    width: 120,
    render(row) {
      return row.charset
        ? h(
            CopyToClipboardTooltip,
            { content: row.charset },
            {
              default: ({ copy }: { copy: () => void }) =>
                h(
                  'span',
                  {
                    style: { fontFamily: 'monospace', cursor: 'pointer' },
                    onClick: copy,
                  },
                  row.charset,
                ),
            },
          )
        : h('span', '-')
    },
  },
])
</script>

<i18n lang="json">
{
  "en": {
    "mimeType": "MIME Type",
    "extensions": "Extensions",
    "category": "Category",
    "source": "Source",
    "compressible": "Compressible",
    "charset": "Charset",
    "yes": "Yes",
    "no": "No"
  },
  "zh": {
    "mimeType": "MIME 类型",
    "extensions": "扩展名",
    "category": "分类",
    "source": "来源",
    "compressible": "可压缩",
    "charset": "字符集",
    "yes": "是",
    "no": "否"
  },
  "zh-CN": {
    "mimeType": "MIME 类型",
    "extensions": "扩展名",
    "category": "分类",
    "source": "来源",
    "compressible": "可压缩",
    "charset": "字符集",
    "yes": "是",
    "no": "否"
  },
  "zh-TW": {
    "mimeType": "MIME 類型",
    "extensions": "副檔名",
    "category": "分類",
    "source": "來源",
    "compressible": "可壓縮",
    "charset": "字元集",
    "yes": "是",
    "no": "否"
  },
  "zh-HK": {
    "mimeType": "MIME 類型",
    "extensions": "副檔名",
    "category": "分類",
    "source": "來源",
    "compressible": "可壓縮",
    "charset": "字元集",
    "yes": "是",
    "no": "否"
  },
  "es": {
    "mimeType": "Tipo MIME",
    "extensions": "Extensiones",
    "category": "Categoria",
    "source": "Fuente",
    "compressible": "Comprimible",
    "charset": "Juego de Caracteres",
    "yes": "Si",
    "no": "No"
  },
  "fr": {
    "mimeType": "Type MIME",
    "extensions": "Extensions",
    "category": "Categorie",
    "source": "Source",
    "compressible": "Compressible",
    "charset": "Jeu de Caracteres",
    "yes": "Oui",
    "no": "Non"
  },
  "de": {
    "mimeType": "MIME-Typ",
    "extensions": "Erweiterungen",
    "category": "Kategorie",
    "source": "Quelle",
    "compressible": "Komprimierbar",
    "charset": "Zeichensatz",
    "yes": "Ja",
    "no": "Nein"
  },
  "it": {
    "mimeType": "Tipo MIME",
    "extensions": "Estensioni",
    "category": "Categoria",
    "source": "Sorgente",
    "compressible": "Comprimibile",
    "charset": "Set di Caratteri",
    "yes": "Si",
    "no": "No"
  },
  "ja": {
    "mimeType": "MIME タイプ",
    "extensions": "拡張子",
    "category": "カテゴリ",
    "source": "ソース",
    "compressible": "圧縮可能",
    "charset": "文字セット",
    "yes": "はい",
    "no": "いいえ"
  },
  "ko": {
    "mimeType": "MIME 유형",
    "extensions": "확장자",
    "category": "카테고리",
    "source": "소스",
    "compressible": "압축 가능",
    "charset": "문자 집합",
    "yes": "예",
    "no": "아니오"
  },
  "ru": {
    "mimeType": "Тип MIME",
    "extensions": "Расширения",
    "category": "Категория",
    "source": "Источник",
    "compressible": "Сжимаемый",
    "charset": "Кодировка",
    "yes": "Да",
    "no": "Нет"
  },
  "pt": {
    "mimeType": "Tipo MIME",
    "extensions": "Extensoes",
    "category": "Categoria",
    "source": "Fonte",
    "compressible": "Comprimivel",
    "charset": "Conjunto de Caracteres",
    "yes": "Sim",
    "no": "Nao"
  },
  "ar": {
    "mimeType": "نوع MIME",
    "extensions": "الامتدادات",
    "category": "الفئة",
    "source": "المصدر",
    "compressible": "قابل للضغط",
    "charset": "مجموعة الأحرف",
    "yes": "نعم",
    "no": "لا"
  },
  "hi": {
    "mimeType": "MIME प्रकार",
    "extensions": "एक्सटेंशन",
    "category": "श्रेणी",
    "source": "स्रोत",
    "compressible": "संपीड्य",
    "charset": "वर्ण सेट",
    "yes": "हाँ",
    "no": "नहीं"
  },
  "tr": {
    "mimeType": "MIME Tipi",
    "extensions": "Uzantilar",
    "category": "Kategori",
    "source": "Kaynak",
    "compressible": "Sikistirilabilir",
    "charset": "Karakter Seti",
    "yes": "Evet",
    "no": "Hayir"
  },
  "nl": {
    "mimeType": "MIME Type",
    "extensions": "Extensies",
    "category": "Categorie",
    "source": "Bron",
    "compressible": "Comprimeerbaar",
    "charset": "Tekenset",
    "yes": "Ja",
    "no": "Nee"
  },
  "sv": {
    "mimeType": "MIME-typ",
    "extensions": "Forlangningar",
    "category": "Kategori",
    "source": "Kalla",
    "compressible": "Komprimerbar",
    "charset": "Teckenuppsattning",
    "yes": "Ja",
    "no": "Nej"
  },
  "pl": {
    "mimeType": "Typ MIME",
    "extensions": "Rozszerzenia",
    "category": "Kategoria",
    "source": "Zrodlo",
    "compressible": "Kompresowalny",
    "charset": "Zestaw Znakow",
    "yes": "Tak",
    "no": "Nie"
  },
  "vi": {
    "mimeType": "Loai MIME",
    "extensions": "Phan mo rong",
    "category": "Danh muc",
    "source": "Nguon",
    "compressible": "Co the nen",
    "charset": "Bo ky tu",
    "yes": "Co",
    "no": "Khong"
  },
  "th": {
    "mimeType": "ประเภท MIME",
    "extensions": "นามสกุล",
    "category": "หมวดหมู่",
    "source": "แหล่งที่มา",
    "compressible": "บีบอัดได้",
    "charset": "ชุดอักขระ",
    "yes": "ใช่",
    "no": "ไม่"
  },
  "id": {
    "mimeType": "Tipe MIME",
    "extensions": "Ekstensi",
    "category": "Kategori",
    "source": "Sumber",
    "compressible": "Dapat Dikompres",
    "charset": "Set Karakter",
    "yes": "Ya",
    "no": "Tidak"
  },
  "he": {
    "mimeType": "סוג MIME",
    "extensions": "הרחבות",
    "category": "קטגוריה",
    "source": "מקור",
    "compressible": "ניתן לדחיסה",
    "charset": "ערכת תווים",
    "yes": "כן",
    "no": "לא"
  },
  "ms": {
    "mimeType": "Jenis MIME",
    "extensions": "Sambungan",
    "category": "Kategori",
    "source": "Sumber",
    "compressible": "Boleh Mampat",
    "charset": "Set Aksara",
    "yes": "Ya",
    "no": "Tidak"
  },
  "no": {
    "mimeType": "MIME-type",
    "extensions": "Utvidelser",
    "category": "Kategori",
    "source": "Kilde",
    "compressible": "Komprimerbar",
    "charset": "Tegnsett",
    "yes": "Ja",
    "no": "Nei"
  }
}
</i18n>
