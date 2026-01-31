<template>
  <n-form-item-gi :label="t('name')" :show-feedback="false">
    <n-input v-model:value="name" :placeholder="t('namePlaceholder')" />
  </n-form-item-gi>

  <n-form-item-gi :label="t('email')" :show-feedback="false">
    <n-input v-model:value="email" :placeholder="t('emailPlaceholder')" />
  </n-form-item-gi>

  <n-form-item-gi :label="t('comment')" :show-feedback="false" :span="2">
    <n-input v-model:value="comment" :placeholder="t('commentPlaceholder')" />
  </n-form-item-gi>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFormItemGi, NInput } from 'naive-ui'

const name = defineModel<string>('name', { required: true })
const email = defineModel<string>('email', { required: true })
const comment = defineModel<string>('comment', { required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "name": "Name",
    "namePlaceholder": "Jane Doe",
    "email": "Email",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Comment",
    "commentPlaceholder": "work laptop (optional)"
  },
  "zh": {
    "name": "姓名",
    "namePlaceholder": "张三",
    "email": "邮箱",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "注释",
    "commentPlaceholder": "工作电脑（可选）"
  },
  "zh-CN": {
    "name": "姓名",
    "namePlaceholder": "张三",
    "email": "邮箱",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "注释",
    "commentPlaceholder": "工作电脑（可选）"
  },
  "zh-TW": {
    "name": "姓名",
    "namePlaceholder": "王小明",
    "email": "電子郵件",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "註解",
    "commentPlaceholder": "工作電腦（可選）"
  },
  "zh-HK": {
    "name": "姓名",
    "namePlaceholder": "王小明",
    "email": "電郵",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "註解",
    "commentPlaceholder": "工作電腦（可選）"
  },
  "es": {
    "name": "Nombre",
    "namePlaceholder": "Juan Pérez",
    "email": "Correo",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Comentario",
    "commentPlaceholder": "portátil de trabajo (opcional)"
  },
  "fr": {
    "name": "Nom",
    "namePlaceholder": "Jean Dupont",
    "email": "E-mail",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Commentaire",
    "commentPlaceholder": "ordinateur de travail (optionnel)"
  },
  "de": {
    "name": "Name",
    "namePlaceholder": "Max Mustermann",
    "email": "E-Mail",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Kommentar",
    "commentPlaceholder": "Arbeitslaptop (optional)"
  },
  "it": {
    "name": "Nome",
    "namePlaceholder": "Mario Rossi",
    "email": "Email",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Commento",
    "commentPlaceholder": "laptop di lavoro (opzionale)"
  },
  "ja": {
    "name": "名前",
    "namePlaceholder": "山田太郎",
    "email": "メール",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "コメント",
    "commentPlaceholder": "仕事用PC（任意）"
  },
  "ko": {
    "name": "이름",
    "namePlaceholder": "홍길동",
    "email": "이메일",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "코멘트",
    "commentPlaceholder": "업무용 노트북(선택사항)"
  },
  "ru": {
    "name": "Имя",
    "namePlaceholder": "Иван Иванов",
    "email": "Email",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Комментарий",
    "commentPlaceholder": "рабочий ноутбук (необязательно)"
  },
  "pt": {
    "name": "Nome",
    "namePlaceholder": "João Silva",
    "email": "E-mail",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Comentário",
    "commentPlaceholder": "notebook de trabalho (opcional)"
  },
  "ar": {
    "name": "الاسم",
    "namePlaceholder": "أحمد علي",
    "email": "البريد الإلكتروني",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "تعليق",
    "commentPlaceholder": "حاسوب العمل (اختياري)"
  },
  "hi": {
    "name": "नाम",
    "namePlaceholder": "राहुल शर्मा",
    "email": "ईमेल",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "टिप्पणी",
    "commentPlaceholder": "कार्य लैपटॉप (वैकल्पिक)"
  },
  "tr": {
    "name": "Ad",
    "namePlaceholder": "Ahmet Yılmaz",
    "email": "E-posta",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Yorum",
    "commentPlaceholder": "iş bilgisayarı (isteğe bağlı)"
  },
  "nl": {
    "name": "Naam",
    "namePlaceholder": "Jan Jansen",
    "email": "E-mail",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Opmerking",
    "commentPlaceholder": "werklaptop (optioneel)"
  },
  "sv": {
    "name": "Namn",
    "namePlaceholder": "Anna Andersson",
    "email": "E-post",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Kommentar",
    "commentPlaceholder": "jobbdator (valfritt)"
  },
  "pl": {
    "name": "Imię i nazwisko",
    "namePlaceholder": "Jan Kowalski",
    "email": "E-mail",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Komentarz",
    "commentPlaceholder": "służbowy laptop (opcjonalne)"
  },
  "vi": {
    "name": "Tên",
    "namePlaceholder": "Nguyễn Văn A",
    "email": "Email",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Ghi chú",
    "commentPlaceholder": "máy tính công việc (tùy chọn)"
  },
  "th": {
    "name": "ชื่อ",
    "namePlaceholder": "สมชาย ใจดี",
    "email": "อีเมล",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "ความคิดเห็น",
    "commentPlaceholder": "คอมพิวเตอร์ที่ทำงาน (ไม่บังคับ)"
  },
  "id": {
    "name": "Nama",
    "namePlaceholder": "Budi Santoso",
    "email": "Email",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Komentar",
    "commentPlaceholder": "laptop kerja (opsional)"
  },
  "he": {
    "name": "שם",
    "namePlaceholder": "דנה לוי",
    "email": "דוא\"ל",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "הערה",
    "commentPlaceholder": "מחשב עבודה (לא חובה)"
  },
  "ms": {
    "name": "Nama",
    "namePlaceholder": "Ahmad Ali",
    "email": "E-mel",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Komen",
    "commentPlaceholder": "komputer kerja (pilihan)"
  },
  "no": {
    "name": "Navn",
    "namePlaceholder": "Ola Nordmann",
    "email": "E-post",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Kommentar",
    "commentPlaceholder": "jobbmaskin (valgfritt)"
  }
}
</i18n>
