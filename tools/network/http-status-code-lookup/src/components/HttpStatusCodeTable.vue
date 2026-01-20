<template>
  <NDataTable
    :columns="columns"
    :data="filteredStatusCodes"
    :bordered="false"
    size="small"
    :row-key="(row: HttpStatusCodeInfo) => row.code"
  />
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { NDataTable, NTag, NIcon } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { CopyToClipboardTooltip } from '@shared/ui/base'
import Info12Regular from '@vicons/fluent/Info12Regular'
import CheckmarkCircle16Regular from '@vicons/fluent/CheckmarkCircle16Regular'
import ArrowForward16Regular from '@vicons/fluent/ArrowForward16Regular'
import ErrorCircle16Regular from '@vicons/fluent/ErrorCircle16Regular'
import DismissCircle16Regular from '@vicons/fluent/DismissCircle16Regular'
import { statusCodes, type HttpStatusCodeInfo } from '../data/statusCodes'
import HttpStatusCodeDescription from './HttpStatusCodeDescription.vue'

const props = defineProps<{
  search: string
  category: string
}>()

const { t } = useI18n()

const filteredStatusCodes = computed(() => {
  let result = statusCodes

  // Filter by category
  if (props.category === 'common') {
    result = result.filter((s) => s.common)
  } else if (props.category !== 'all') {
    result = result.filter((s) => s.category === props.category)
  }

  // Filter by search
  if (props.search) {
    const query = props.search.toLowerCase()
    result = result.filter(
      (s) =>
        s.code.toString().includes(query) ||
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query),
    )
  }

  return result
})

const getCategoryTagType = (category: string): 'info' | 'success' | 'warning' | 'error' => {
  switch (category) {
    case 'informational':
      return 'info'
    case 'success':
      return 'success'
    case 'redirection':
      return 'warning'
    case 'client-error':
    case 'server-error':
      return 'error'
    default:
      return 'info'
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'informational':
      return Info12Regular
    case 'success':
      return CheckmarkCircle16Regular
    case 'redirection':
      return ArrowForward16Regular
    case 'client-error':
      return ErrorCircle16Regular
    case 'server-error':
      return DismissCircle16Regular
    default:
      return Info12Regular
  }
}

const columns = computed<DataTableColumns<HttpStatusCodeInfo>>(() => [
  {
    title: t('code'),
    key: 'code',
    width: 100,
    render(row) {
      return h(
        CopyToClipboardTooltip,
        { content: String(row.code) },
        {
          default: ({ copy }: { copy: () => void }) =>
            h(
              'span',
              {
                style: { fontFamily: 'monospace', fontWeight: 'bold', cursor: 'pointer' },
                onClick: copy,
              },
              row.code,
            ),
        },
      )
    },
  },
  {
    title: t('name'),
    key: 'name',
    width: 200,
    render(row) {
      return h(
        CopyToClipboardTooltip,
        { content: row.name },
        {
          default: ({ copy }: { copy: () => void }) =>
            h(
              'span',
              {
                style: { fontFamily: 'monospace', cursor: 'pointer' },
                onClick: copy,
              },
              row.name,
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
      const type = getCategoryTagType(row.category)
      const icon = getCategoryIcon(row.category)
      const categoryMap: Record<string, string> = {
        informational: t('informational'),
        success: t('success'),
        redirection: t('redirection'),
        'client-error': t('clientError'),
        'server-error': t('serverError'),
      }
      return h(
        NTag,
        { size: 'small', type, bordered: false },
        {
          default: () => categoryMap[row.category] || row.category,
          icon: () => h(NIcon, { component: icon }),
        },
      )
    },
  },
  {
    title: t('description'),
    key: 'description',
    render(row) {
      return h(HttpStatusCodeDescription, { code: row.code })
    },
  },
])
</script>

<i18n lang="json">
{
  "en": {
    "code": "Code",
    "name": "Name",
    "category": "Category",
    "description": "Description",
    "informational": "Informational",
    "success": "Success",
    "redirection": "Redirection",
    "clientError": "Client Error",
    "serverError": "Server Error"
  },
  "zh": {
    "code": "代码",
    "name": "名称",
    "category": "分类",
    "description": "描述",
    "informational": "信息性",
    "success": "成功",
    "redirection": "重定向",
    "clientError": "客户端错误",
    "serverError": "服务器错误"
  },
  "zh-CN": {
    "code": "代码",
    "name": "名称",
    "category": "分类",
    "description": "描述",
    "informational": "信息性",
    "success": "成功",
    "redirection": "重定向",
    "clientError": "客户端错误",
    "serverError": "服务器错误"
  },
  "zh-TW": {
    "code": "代碼",
    "name": "名稱",
    "category": "分類",
    "description": "描述",
    "informational": "資訊性",
    "success": "成功",
    "redirection": "重新導向",
    "clientError": "用戶端錯誤",
    "serverError": "伺服器錯誤"
  },
  "zh-HK": {
    "code": "代碼",
    "name": "名稱",
    "category": "分類",
    "description": "描述",
    "informational": "資訊性",
    "success": "成功",
    "redirection": "重新導向",
    "clientError": "客戶端錯誤",
    "serverError": "伺服器錯誤"
  },
  "es": {
    "code": "Codigo",
    "name": "Nombre",
    "category": "Categoria",
    "description": "Descripcion",
    "informational": "Informativo",
    "success": "Exito",
    "redirection": "Redireccion",
    "clientError": "Error del Cliente",
    "serverError": "Error del Servidor"
  },
  "fr": {
    "code": "Code",
    "name": "Nom",
    "category": "Categorie",
    "description": "Description",
    "informational": "Informationnel",
    "success": "Succes",
    "redirection": "Redirection",
    "clientError": "Erreur Client",
    "serverError": "Erreur Serveur"
  },
  "de": {
    "code": "Code",
    "name": "Name",
    "category": "Kategorie",
    "description": "Beschreibung",
    "informational": "Informationell",
    "success": "Erfolg",
    "redirection": "Weiterleitung",
    "clientError": "Client-Fehler",
    "serverError": "Server-Fehler"
  },
  "it": {
    "code": "Codice",
    "name": "Nome",
    "category": "Categoria",
    "description": "Descrizione",
    "informational": "Informativo",
    "success": "Successo",
    "redirection": "Reindirizzamento",
    "clientError": "Errore Client",
    "serverError": "Errore Server"
  },
  "ja": {
    "code": "コード",
    "name": "名前",
    "category": "カテゴリ",
    "description": "説明",
    "informational": "情報",
    "success": "成功",
    "redirection": "リダイレクト",
    "clientError": "クライアントエラー",
    "serverError": "サーバーエラー"
  },
  "ko": {
    "code": "코드",
    "name": "이름",
    "category": "카테고리",
    "description": "설명",
    "informational": "정보성",
    "success": "성공",
    "redirection": "리디렉션",
    "clientError": "클라이언트 오류",
    "serverError": "서버 오류"
  },
  "ru": {
    "code": "Код",
    "name": "Название",
    "category": "Категория",
    "description": "Описание",
    "informational": "Информационные",
    "success": "Успех",
    "redirection": "Перенаправление",
    "clientError": "Ошибка Клиента",
    "serverError": "Ошибка Сервера"
  },
  "pt": {
    "code": "Codigo",
    "name": "Nome",
    "category": "Categoria",
    "description": "Descricao",
    "informational": "Informativo",
    "success": "Sucesso",
    "redirection": "Redirecionamento",
    "clientError": "Erro do Cliente",
    "serverError": "Erro do Servidor"
  },
  "ar": {
    "code": "الرمز",
    "name": "الاسم",
    "category": "الفئة",
    "description": "الوصف",
    "informational": "معلوماتي",
    "success": "نجاح",
    "redirection": "اعادة توجيه",
    "clientError": "خطأ العميل",
    "serverError": "خطأ الخادم"
  },
  "hi": {
    "code": "कोड",
    "name": "नाम",
    "category": "श्रेणी",
    "description": "विवरण",
    "informational": "सूचनात्मक",
    "success": "सफलता",
    "redirection": "पुनर्निर्देशन",
    "clientError": "क्लाइंट त्रुटि",
    "serverError": "सर्वर त्रुटि"
  },
  "tr": {
    "code": "Kod",
    "name": "Ad",
    "category": "Kategori",
    "description": "Aciklama",
    "informational": "Bilgilendirici",
    "success": "Basarili",
    "redirection": "Yonlendirme",
    "clientError": "Istekci Hatasi",
    "serverError": "Sunucu Hatasi"
  },
  "nl": {
    "code": "Code",
    "name": "Naam",
    "category": "Categorie",
    "description": "Beschrijving",
    "informational": "Informatief",
    "success": "Succesvol",
    "redirection": "Omleiding",
    "clientError": "Clientfout",
    "serverError": "Serverfout"
  },
  "sv": {
    "code": "Kod",
    "name": "Namn",
    "category": "Kategori",
    "description": "Beskrivning",
    "informational": "Informativ",
    "success": "Framgangsrik",
    "redirection": "Omdirigering",
    "clientError": "Klientfel",
    "serverError": "Serverfel"
  },
  "pl": {
    "code": "Kod",
    "name": "Nazwa",
    "category": "Kategoria",
    "description": "Opis",
    "informational": "Informacyjny",
    "success": "Sukces",
    "redirection": "Przekierowanie",
    "clientError": "Blad Klienta",
    "serverError": "Blad Serwera"
  },
  "vi": {
    "code": "Ma",
    "name": "Ten",
    "category": "Danh muc",
    "description": "Mo ta",
    "informational": "Thong tin",
    "success": "Thanh cong",
    "redirection": "Chuyen huong",
    "clientError": "Loi May Khach",
    "serverError": "Loi May Chu"
  },
  "th": {
    "code": "รหัส",
    "name": "ชื่อ",
    "category": "หมวดหมู่",
    "description": "คำอธิบาย",
    "informational": "ข้อมูล",
    "success": "สำเร็จ",
    "redirection": "เปลี่ยนเส้นทาง",
    "clientError": "ข้อผิดพลาดของไคลเอนต์",
    "serverError": "ข้อผิดพลาดของเซิร์ฟเวอร์"
  },
  "id": {
    "code": "Kode",
    "name": "Nama",
    "category": "Kategori",
    "description": "Deskripsi",
    "informational": "Informasional",
    "success": "Berhasil",
    "redirection": "Pengalihan",
    "clientError": "Kesalahan Klien",
    "serverError": "Kesalahan Server"
  },
  "he": {
    "code": "קוד",
    "name": "שם",
    "category": "קטגוריה",
    "description": "תיאור",
    "informational": "מידע",
    "success": "הצלחה",
    "redirection": "הפניה מחדש",
    "clientError": "שגיאת לקוח",
    "serverError": "שגיאת שרת"
  },
  "ms": {
    "code": "Kod",
    "name": "Nama",
    "category": "Kategori",
    "description": "Penerangan",
    "informational": "Maklumat",
    "success": "Berjaya",
    "redirection": "Ubah hala",
    "clientError": "Ralat Pelanggan",
    "serverError": "Ralat Pelayan"
  },
  "no": {
    "code": "Kode",
    "name": "Navn",
    "category": "Kategori",
    "description": "Beskrivelse",
    "informational": "Informativ",
    "success": "Vellykket",
    "redirection": "Omdirigering",
    "clientError": "Klientfeil",
    "serverError": "Serverfeil"
  }
}
</i18n>
