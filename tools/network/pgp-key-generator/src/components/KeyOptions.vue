<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('options') }}</ToolSectionHeader>
    <n-grid cols="1 m:2" responsive="screen" :x-gap="20" :y-gap="16">
      <n-form-item-gi :label="t('name')" :show-feedback="false">
        <n-input
          :value="name"
          :placeholder="t('namePlaceholder')"
          @update:value="$emit('update:name', $event)"
        />
      </n-form-item-gi>

      <n-form-item-gi :label="t('email')" :show-feedback="false">
        <n-input
          :value="email"
          :placeholder="t('emailPlaceholder')"
          @update:value="$emit('update:email', $event)"
        />
      </n-form-item-gi>

      <n-form-item-gi :label="t('comment')" :show-feedback="false" :span="2">
        <n-input
          :value="comment"
          :placeholder="t('commentPlaceholder')"
          @update:value="$emit('update:comment', $event)"
        />
      </n-form-item-gi>

      <n-form-item-gi :label="t('algorithm')" :show-feedback="false">
        <n-radio-group
          :value="algorithm"
          name="algorithm"
          @update:value="$emit('update:algorithm', $event)"
        >
          <n-space>
            <n-radio value="ecc">
              ECC
              <n-tag size="tiny" type="success" :bordered="false" style="margin-left: 4px">
                {{ t('recommended') }}
              </n-tag>
            </n-radio>
            <n-radio value="rsa">RSA</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item-gi>

      <n-form-item-gi v-if="algorithm === 'rsa'" :label="t('keySize')" :show-feedback="false">
        <n-select
          :value="rsaKeySize"
          :options="keySizeOptions"
          @update:value="$emit('update:rsaKeySize', $event)"
        />
      </n-form-item-gi>

      <n-form-item-gi :label="t('expires')" :show-feedback="false">
        <n-select
          :value="expirationDays"
          :options="expirationOptions"
          @update:value="$emit('update:expirationDays', $event)"
        />
      </n-form-item-gi>

      <n-form-item-gi :label="t('passphrase')" :show-feedback="false" :span="2">
        <n-input
          :value="passphrase"
          type="password"
          show-password-on="click"
          :placeholder="t('passphrasePlaceholder')"
          @update:value="$emit('update:passphrase', $event)"
        />
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NGrid, NFormItemGi, NRadioGroup, NRadio, NSpace, NSelect, NInput, NTag } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { KeyAlgorithm, RsaKeySize } from '../pgp-keygen'

defineProps<{
  algorithm: KeyAlgorithm
  rsaKeySize: RsaKeySize
  name: string
  email: string
  comment: string
  passphrase: string
  expirationDays: number
}>()

defineEmits<{
  'update:algorithm': [value: KeyAlgorithm]
  'update:rsaKeySize': [value: RsaKeySize]
  'update:name': [value: string]
  'update:email': [value: string]
  'update:comment': [value: string]
  'update:passphrase': [value: string]
  'update:expirationDays': [value: number]
}>()

const { t } = useI18n()

const keySizeOptions = computed(() => [
  { label: '2048 bits', value: 2048 },
  { label: '3072 bits', value: 3072 },
  { label: `4096 bits (${t('recommended')})`, value: 4096 },
])

const expirationOptions = computed(() => [
  { label: t('never'), value: 0 },
  { label: `30 ${t('days')}`, value: 30 },
  { label: `90 ${t('days')}`, value: 90 },
  { label: `1 ${t('year')}`, value: 365 },
  { label: `2 ${t('years')}`, value: 730 },
  { label: `5 ${t('years')}`, value: 1825 },
])
</script>

<i18n lang="json">
{
  "en": {
    "options": "Options",
    "name": "Name",
    "namePlaceholder": "Jane Doe",
    "email": "Email",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Comment",
    "commentPlaceholder": "work laptop (optional)",
    "algorithm": "Algorithm",
    "keySize": "Key Size",
    "passphrase": "Passphrase",
    "passphrasePlaceholder": "Leave empty for no passphrase",
    "expires": "Expires",
    "never": "Never",
    "days": "days",
    "year": "year",
    "years": "years",
    "recommended": "Recommended"
  },
  "zh": {
    "options": "选项",
    "name": "姓名",
    "namePlaceholder": "张三",
    "email": "邮箱",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "注释",
    "commentPlaceholder": "工作电脑（可选）",
    "algorithm": "算法",
    "keySize": "密钥长度",
    "passphrase": "密码短语",
    "passphrasePlaceholder": "留空表示不设置密码短语",
    "expires": "有效期",
    "never": "永不过期",
    "days": "天",
    "year": "年",
    "years": "年",
    "recommended": "推荐"
  },
  "zh-CN": {
    "options": "选项",
    "name": "姓名",
    "namePlaceholder": "张三",
    "email": "邮箱",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "注释",
    "commentPlaceholder": "工作电脑（可选）",
    "algorithm": "算法",
    "keySize": "密钥长度",
    "passphrase": "密码短语",
    "passphrasePlaceholder": "留空表示不设置密码短语",
    "expires": "有效期",
    "never": "永不过期",
    "days": "天",
    "year": "年",
    "years": "年",
    "recommended": "推荐"
  },
  "zh-TW": {
    "options": "選項",
    "name": "姓名",
    "namePlaceholder": "王小明",
    "email": "電子郵件",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "註解",
    "commentPlaceholder": "工作電腦（可選）",
    "algorithm": "演算法",
    "keySize": "金鑰長度",
    "passphrase": "密碼短語",
    "passphrasePlaceholder": "留空表示不設定密碼短語",
    "expires": "有效期限",
    "never": "永不過期",
    "days": "天",
    "year": "年",
    "years": "年",
    "recommended": "推薦"
  },
  "zh-HK": {
    "options": "選項",
    "name": "姓名",
    "namePlaceholder": "王小明",
    "email": "電郵",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "註解",
    "commentPlaceholder": "工作電腦（可選）",
    "algorithm": "演算法",
    "keySize": "金鑰長度",
    "passphrase": "密碼短語",
    "passphrasePlaceholder": "留空表示不設定密碼短語",
    "expires": "有效期限",
    "never": "永不過期",
    "days": "天",
    "year": "年",
    "years": "年",
    "recommended": "推薦"
  },
  "es": {
    "options": "Opciones",
    "name": "Nombre",
    "namePlaceholder": "Juan Pérez",
    "email": "Correo",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Comentario",
    "commentPlaceholder": "portátil de trabajo (opcional)",
    "algorithm": "Algoritmo",
    "keySize": "Tamaño de clave",
    "passphrase": "Frase de contraseña",
    "passphrasePlaceholder": "Dejar vacío para no usar frase",
    "expires": "Caduca",
    "never": "Nunca",
    "days": "días",
    "year": "año",
    "years": "años",
    "recommended": "Recomendado"
  },
  "fr": {
    "options": "Options",
    "name": "Nom",
    "namePlaceholder": "Jean Dupont",
    "email": "E-mail",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Commentaire",
    "commentPlaceholder": "ordinateur de travail (optionnel)",
    "algorithm": "Algorithme",
    "keySize": "Taille de clé",
    "passphrase": "Phrase de passe",
    "passphrasePlaceholder": "Laisser vide pour aucune phrase",
    "expires": "Expiration",
    "never": "Jamais",
    "days": "jours",
    "year": "an",
    "years": "ans",
    "recommended": "Recommandé"
  },
  "de": {
    "options": "Optionen",
    "name": "Name",
    "namePlaceholder": "Max Mustermann",
    "email": "E-Mail",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Kommentar",
    "commentPlaceholder": "Arbeitslaptop (optional)",
    "algorithm": "Algorithmus",
    "keySize": "Schlüsselgröße",
    "passphrase": "Passphrase",
    "passphrasePlaceholder": "Leer lassen für keine Passphrase",
    "expires": "Gültig bis",
    "never": "Nie",
    "days": "Tage",
    "year": "Jahr",
    "years": "Jahre",
    "recommended": "Empfohlen"
  },
  "it": {
    "options": "Opzioni",
    "name": "Nome",
    "namePlaceholder": "Mario Rossi",
    "email": "Email",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Commento",
    "commentPlaceholder": "laptop di lavoro (opzionale)",
    "algorithm": "Algoritmo",
    "keySize": "Dimensione chiave",
    "passphrase": "Passphrase",
    "passphrasePlaceholder": "Lascia vuoto per nessuna passphrase",
    "expires": "Scadenza",
    "never": "Mai",
    "days": "giorni",
    "year": "anno",
    "years": "anni",
    "recommended": "Consigliato"
  },
  "ja": {
    "options": "オプション",
    "name": "名前",
    "namePlaceholder": "山田太郎",
    "email": "メール",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "コメント",
    "commentPlaceholder": "仕事用PC（任意）",
    "algorithm": "アルゴリズム",
    "keySize": "キーサイズ",
    "passphrase": "パスフレーズ",
    "passphrasePlaceholder": "空欄でパスフレーズなし",
    "expires": "有効期限",
    "never": "なし",
    "days": "日",
    "year": "年",
    "years": "年",
    "recommended": "推奨"
  },
  "ko": {
    "options": "옵션",
    "name": "이름",
    "namePlaceholder": "홍길동",
    "email": "이메일",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "코멘트",
    "commentPlaceholder": "업무용 노트북(선택사항)",
    "algorithm": "알고리즘",
    "keySize": "키 크기",
    "passphrase": "암호문구",
    "passphrasePlaceholder": "비워 두면 암호문구 없음",
    "expires": "만료",
    "never": "없음",
    "days": "일",
    "year": "년",
    "years": "년",
    "recommended": "권장"
  },
  "ru": {
    "options": "Параметры",
    "name": "Имя",
    "namePlaceholder": "Иван Иванов",
    "email": "Email",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Комментарий",
    "commentPlaceholder": "рабочий ноутбук (необязательно)",
    "algorithm": "Алгоритм",
    "keySize": "Размер ключа",
    "passphrase": "Парольная фраза",
    "passphrasePlaceholder": "Оставьте пустым, чтобы не использовать",
    "expires": "Срок действия",
    "never": "Никогда",
    "days": "дней",
    "year": "год",
    "years": "лет",
    "recommended": "Рекомендуется"
  },
  "pt": {
    "options": "Opções",
    "name": "Nome",
    "namePlaceholder": "João Silva",
    "email": "E-mail",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Comentário",
    "commentPlaceholder": "notebook de trabalho (opcional)",
    "algorithm": "Algoritmo",
    "keySize": "Tamanho da chave",
    "passphrase": "Frase-senha",
    "passphrasePlaceholder": "Deixe vazio para não usar",
    "expires": "Expira",
    "never": "Nunca",
    "days": "dias",
    "year": "ano",
    "years": "anos",
    "recommended": "Recomendado"
  },
  "ar": {
    "options": "الخيارات",
    "name": "الاسم",
    "namePlaceholder": "أحمد علي",
    "email": "البريد الإلكتروني",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "تعليق",
    "commentPlaceholder": "حاسوب العمل (اختياري)",
    "algorithm": "الخوارزمية",
    "keySize": "حجم المفتاح",
    "passphrase": "عبارة المرور",
    "passphrasePlaceholder": "اتركه فارغًا بدون عبارة مرور",
    "expires": "ينتهي",
    "never": "أبدًا",
    "days": "أيام",
    "year": "سنة",
    "years": "سنوات",
    "recommended": "موصى به"
  },
  "hi": {
    "options": "विकल्प",
    "name": "नाम",
    "namePlaceholder": "राहुल शर्मा",
    "email": "ईमेल",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "टिप्पणी",
    "commentPlaceholder": "कार्य लैपटॉप (वैकल्पिक)",
    "algorithm": "एल्गोरिथम",
    "keySize": "कुंजी का आकार",
    "passphrase": "पासफ़्रेज़",
    "passphrasePlaceholder": "खाली छोड़ें तो पासफ़्रेज़ नहीं",
    "expires": "समाप्ति",
    "never": "कभी नहीं",
    "days": "दिन",
    "year": "वर्ष",
    "years": "वर्ष",
    "recommended": "अनुशंसित"
  },
  "tr": {
    "options": "Seçenekler",
    "name": "Ad",
    "namePlaceholder": "Ahmet Yılmaz",
    "email": "E-posta",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Yorum",
    "commentPlaceholder": "iş bilgisayarı (isteğe bağlı)",
    "algorithm": "Algoritma",
    "keySize": "Anahtar Boyutu",
    "passphrase": "Parola ifadesi",
    "passphrasePlaceholder": "Parola istemiyorsanız boş bırakın",
    "expires": "Süre",
    "never": "Asla",
    "days": "gün",
    "year": "yıl",
    "years": "yıl",
    "recommended": "Önerilen"
  },
  "nl": {
    "options": "Opties",
    "name": "Naam",
    "namePlaceholder": "Jan Jansen",
    "email": "E-mail",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Opmerking",
    "commentPlaceholder": "werklaptop (optioneel)",
    "algorithm": "Algoritme",
    "keySize": "Sleutelgrootte",
    "passphrase": "Wachtwoordzin",
    "passphrasePlaceholder": "Leeg laten voor geen wachtwoordzin",
    "expires": "Verloopt",
    "never": "Nooit",
    "days": "dagen",
    "year": "jaar",
    "years": "jaar",
    "recommended": "Aanbevolen"
  },
  "sv": {
    "options": "Alternativ",
    "name": "Namn",
    "namePlaceholder": "Anna Andersson",
    "email": "E-post",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Kommentar",
    "commentPlaceholder": "jobbdator (valfritt)",
    "algorithm": "Algoritm",
    "keySize": "Nyckelstorlek",
    "passphrase": "Lösenfras",
    "passphrasePlaceholder": "Lämna tomt för ingen lösenfras",
    "expires": "Går ut",
    "never": "Aldrig",
    "days": "dagar",
    "year": "år",
    "years": "år",
    "recommended": "Rekommenderas"
  },
  "pl": {
    "options": "Opcje",
    "name": "Imię i nazwisko",
    "namePlaceholder": "Jan Kowalski",
    "email": "E-mail",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Komentarz",
    "commentPlaceholder": "służbowy laptop (opcjonalne)",
    "algorithm": "Algorytm",
    "keySize": "Rozmiar klucza",
    "passphrase": "Fraza hasła",
    "passphrasePlaceholder": "Pozostaw puste, aby nie używać",
    "expires": "Wygasa",
    "never": "Nigdy",
    "days": "dni",
    "year": "rok",
    "years": "lata",
    "recommended": "Zalecane"
  },
  "vi": {
    "options": "Tùy chọn",
    "name": "Tên",
    "namePlaceholder": "Nguyễn Văn A",
    "email": "Email",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Ghi chú",
    "commentPlaceholder": "máy tính công việc (tùy chọn)",
    "algorithm": "Thuật toán",
    "keySize": "Kích thước khóa",
    "passphrase": "Cụm mật khẩu",
    "passphrasePlaceholder": "Để trống nếu không dùng",
    "expires": "Hết hạn",
    "never": "Không bao giờ",
    "days": "ngày",
    "year": "năm",
    "years": "năm",
    "recommended": "Khuyến nghị"
  },
  "th": {
    "options": "ตัวเลือก",
    "name": "ชื่อ",
    "namePlaceholder": "สมชาย ใจดี",
    "email": "อีเมล",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "ความคิดเห็น",
    "commentPlaceholder": "คอมพิวเตอร์ที่ทำงาน (ไม่บังคับ)",
    "algorithm": "อัลกอริทึม",
    "keySize": "ขนาดคีย์",
    "passphrase": "วลีรหัสผ่าน",
    "passphrasePlaceholder": "เว้นว่างเพื่อไม่ใช้วลีรหัสผ่าน",
    "expires": "วันหมดอายุ",
    "never": "ไม่หมดอายุ",
    "days": "วัน",
    "year": "ปี",
    "years": "ปี",
    "recommended": "แนะนำ"
  },
  "id": {
    "options": "Opsi",
    "name": "Nama",
    "namePlaceholder": "Budi Santoso",
    "email": "Email",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Komentar",
    "commentPlaceholder": "laptop kerja (opsional)",
    "algorithm": "Algoritma",
    "keySize": "Ukuran kunci",
    "passphrase": "Frasa sandi",
    "passphrasePlaceholder": "Kosongkan untuk tanpa frasa",
    "expires": "Kedaluwarsa",
    "never": "Tidak pernah",
    "days": "hari",
    "year": "tahun",
    "years": "tahun",
    "recommended": "Direkomendasikan"
  },
  "he": {
    "options": "אפשרויות",
    "name": "שם",
    "namePlaceholder": "דנה לוי",
    "email": "דוא\"ל",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "הערה",
    "commentPlaceholder": "מחשב עבודה (לא חובה)",
    "algorithm": "אלגוריתם",
    "keySize": "גודל מפתח",
    "passphrase": "משפט סיסמה",
    "passphrasePlaceholder": "השאר ריק ללא משפט סיסמה",
    "expires": "תפוגה",
    "never": "לעולם לא",
    "days": "ימים",
    "year": "שנה",
    "years": "שנים",
    "recommended": "מומלץ"
  },
  "ms": {
    "options": "Pilihan",
    "name": "Nama",
    "namePlaceholder": "Ahmad Ali",
    "email": "E-mel",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Komen",
    "commentPlaceholder": "komputer kerja (pilihan)",
    "algorithm": "Algoritma",
    "keySize": "Saiz kunci",
    "passphrase": "Frasa laluan",
    "passphrasePlaceholder": "Biarkan kosong jika tiada frasa",
    "expires": "Tamat tempoh",
    "never": "Tidak pernah",
    "days": "hari",
    "year": "tahun",
    "years": "tahun",
    "recommended": "Disyorkan"
  },
  "no": {
    "options": "Alternativer",
    "name": "Navn",
    "namePlaceholder": "Ola Nordmann",
    "email": "E-post",
    "emailPlaceholder": "name{'@'}example.com",
    "comment": "Kommentar",
    "commentPlaceholder": "jobbmaskin (valgfritt)",
    "algorithm": "Algoritme",
    "keySize": "Nøkkelstørrelse",
    "passphrase": "Passfrase",
    "passphrasePlaceholder": "La stå tomt for ingen passfrase",
    "expires": "Utløper",
    "never": "Aldri",
    "days": "dager",
    "year": "år",
    "years": "år",
    "recommended": "Anbefalt"
  }
}
</i18n>
