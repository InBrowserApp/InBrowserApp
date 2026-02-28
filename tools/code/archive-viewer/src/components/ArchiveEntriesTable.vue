<template>
  <n-data-table
    :columns="columns"
    :data="rows"
    :row-props="tableRowProps"
    :bordered="false"
    size="small"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NDataTable } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { formatBytes, formatDate } from './archive-format'
import { renderArchiveRowNameCell } from './archive-row-icon'
import type { ArchiveRow } from './use-archive-viewer'

defineProps<{
  rows: ArchiveRow[]
  tableRowProps: (row: ArchiveRow) => { style: string; onClick: () => void }
}>()

const { t } = useI18n()

const columns = computed<DataTableColumns<ArchiveRow>>(() => [
  {
    title: t('column-name'),
    key: 'name',
    ellipsis: { tooltip: true },
    minWidth: 260,
    sorter: (left, right) => left.sortName.localeCompare(right.sortName),
    render: (row) => renderArchiveRowNameCell(row),
  },
  {
    title: t('column-kind'),
    key: 'kind',
    width: 120,
    sorter: (left, right) => left.sortKind.localeCompare(right.sortKind),
    render: (row) => resolveKindLabel(row.kind),
  },
  {
    title: t('column-size'),
    key: 'size',
    width: 140,
    sorter: (left, right) => left.sortSize - right.sortSize,
    render: (row) => (row.kind === 'file' ? formatBytes(row.size) : '-'),
  },
  {
    title: t('column-modified'),
    key: 'modifiedAt',
    width: 180,
    sorter: (left, right) => left.sortModifiedAt - right.sortModifiedAt,
    render: (row) => formatDate(row.modifiedAt),
  },
])

function resolveKindLabel(kind: ArchiveRow['kind']) {
  switch (kind) {
    case 'directory':
      return t('kind-directory')
    case 'symlink':
      return t('kind-symlink')
    case 'file':
    default:
      return t('kind-file')
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "column-name": "Name",
    "column-kind": "Kind",
    "column-size": "Size",
    "column-modified": "Modified",
    "kind-file": "file",
    "kind-directory": "directory",
    "kind-symlink": "symlink"
  },
  "zh": {
    "column-name": "名称",
    "column-kind": "类型",
    "column-size": "大小",
    "column-modified": "修改时间",
    "kind-file": "文件",
    "kind-directory": "目录",
    "kind-symlink": "链接"
  },
  "zh-CN": {
    "column-name": "名称",
    "column-kind": "类型",
    "column-size": "大小",
    "column-modified": "修改时间",
    "kind-file": "文件",
    "kind-directory": "目录",
    "kind-symlink": "链接"
  },
  "zh-TW": {
    "column-name": "名稱",
    "column-kind": "類型",
    "column-size": "大小",
    "column-modified": "修改時間",
    "kind-file": "檔案",
    "kind-directory": "資料夾",
    "kind-symlink": "連結"
  },
  "zh-HK": {
    "column-name": "名稱",
    "column-kind": "類型",
    "column-size": "大小",
    "column-modified": "修改時間",
    "kind-file": "檔案",
    "kind-directory": "資料夾",
    "kind-symlink": "連結"
  },
  "es": {
    "column-name": "Nombre",
    "column-kind": "Tipo",
    "column-size": "Tamaño",
    "column-modified": "Modificado",
    "kind-file": "archivo",
    "kind-directory": "carpeta",
    "kind-symlink": "enlace simbólico"
  },
  "fr": {
    "column-name": "Nom",
    "column-kind": "Type",
    "column-size": "Taille",
    "column-modified": "Modifié",
    "kind-file": "fichier",
    "kind-directory": "dossier",
    "kind-symlink": "lien symbolique"
  },
  "de": {
    "column-name": "Name",
    "column-kind": "Typ",
    "column-size": "Größe",
    "column-modified": "Geändert",
    "kind-file": "Datei",
    "kind-directory": "Ordner",
    "kind-symlink": "Symbolischer Link"
  },
  "it": {
    "column-name": "Nome",
    "column-kind": "Tipo",
    "column-size": "Dimensione",
    "column-modified": "Modificato",
    "kind-file": "file",
    "kind-directory": "cartella",
    "kind-symlink": "link simbolico"
  },
  "pt": {
    "column-name": "Nome",
    "column-kind": "Tipo",
    "column-size": "Tamanho",
    "column-modified": "Modificado",
    "kind-file": "arquivo",
    "kind-directory": "pasta",
    "kind-symlink": "link simbólico"
  },
  "ru": {
    "column-name": "Имя",
    "column-kind": "Тип",
    "column-size": "Размер",
    "column-modified": "Изменён",
    "kind-file": "файл",
    "kind-directory": "папка",
    "kind-symlink": "символическая ссылка"
  },
  "tr": {
    "column-name": "Ad",
    "column-kind": "Tür",
    "column-size": "Boyut",
    "column-modified": "Değiştirildi",
    "kind-file": "dosya",
    "kind-directory": "klasör",
    "kind-symlink": "sembolik bağlantı"
  },
  "nl": {
    "column-name": "Naam",
    "column-kind": "Type",
    "column-size": "Grootte",
    "column-modified": "Gewijzigd",
    "kind-file": "bestand",
    "kind-directory": "map",
    "kind-symlink": "symbolische link"
  },
  "sv": {
    "column-name": "Namn",
    "column-kind": "Typ",
    "column-size": "Storlek",
    "column-modified": "Ändrad",
    "kind-file": "fil",
    "kind-directory": "mapp",
    "kind-symlink": "symbolisk länk"
  },
  "pl": {
    "column-name": "Nazwa",
    "column-kind": "Typ",
    "column-size": "Rozmiar",
    "column-modified": "Zmodyfikowano",
    "kind-file": "plik",
    "kind-directory": "folder",
    "kind-symlink": "link symboliczny"
  },
  "no": {
    "column-name": "Navn",
    "column-kind": "Type",
    "column-size": "Størrelse",
    "column-modified": "Endret",
    "kind-file": "fil",
    "kind-directory": "mappe",
    "kind-symlink": "symbolsk lenke"
  },
  "ja": {
    "column-name": "名前",
    "column-kind": "種類",
    "column-size": "サイズ",
    "column-modified": "更新日時",
    "kind-file": "ファイル",
    "kind-directory": "フォルダー",
    "kind-symlink": "シンボリックリンク"
  },
  "ko": {
    "column-name": "이름",
    "column-kind": "종류",
    "column-size": "크기",
    "column-modified": "수정 시간",
    "kind-file": "파일",
    "kind-directory": "폴더",
    "kind-symlink": "심볼릭 링크"
  },
  "ar": {
    "column-name": "الاسم",
    "column-kind": "النوع",
    "column-size": "الحجم",
    "column-modified": "آخر تعديل",
    "kind-file": "ملف",
    "kind-directory": "مجلد",
    "kind-symlink": "رابط رمزي"
  },
  "hi": {
    "column-name": "नाम",
    "column-kind": "प्रकार",
    "column-size": "आकार",
    "column-modified": "संशोधित",
    "kind-file": "फ़ाइल",
    "kind-directory": "फ़ोल्डर",
    "kind-symlink": "सिम्बॉलिक लिंक"
  },
  "vi": {
    "column-name": "Tên",
    "column-kind": "Loại",
    "column-size": "Kích thước",
    "column-modified": "Đã sửa",
    "kind-file": "tệp",
    "kind-directory": "thư mục",
    "kind-symlink": "liên kết tượng trưng"
  },
  "th": {
    "column-name": "ชื่อ",
    "column-kind": "ชนิด",
    "column-size": "ขนาด",
    "column-modified": "แก้ไขล่าสุด",
    "kind-file": "ไฟล์",
    "kind-directory": "โฟลเดอร์",
    "kind-symlink": "ลิงก์สัญลักษณ์"
  },
  "id": {
    "column-name": "Nama",
    "column-kind": "Jenis",
    "column-size": "Ukuran",
    "column-modified": "Diubah",
    "kind-file": "file",
    "kind-directory": "folder",
    "kind-symlink": "tautan simbolik"
  },
  "he": {
    "column-name": "שם",
    "column-kind": "סוג",
    "column-size": "גודל",
    "column-modified": "שונה",
    "kind-file": "קובץ",
    "kind-directory": "תיקייה",
    "kind-symlink": "קישור סמלי"
  },
  "ms": {
    "column-name": "Nama",
    "column-kind": "Jenis",
    "column-size": "Saiz",
    "column-modified": "Diubah",
    "kind-file": "fail",
    "kind-directory": "folder",
    "kind-symlink": "pautan simbolik"
  }
}
</i18n>
