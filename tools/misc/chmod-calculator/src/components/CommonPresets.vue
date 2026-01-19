<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex>
      <n-button
        v-for="preset in presets"
        :key="preset.value"
        secondary
        @click="$emit('select', preset.value)"
      >
        {{ preset.value }} - {{ preset.label }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NFlex, NButton } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import { computed } from 'vue'

defineEmits<{
  select: [value: string]
}>()

const { t } = useI18n()

const presets = computed(() => [
  { value: '755', label: t('executable') },
  { value: '644', label: t('readOnly') },
  { value: '777', label: t('fullAccess') },
  { value: '700', label: t('ownerOnly') },
  { value: '600', label: t('privateFile') },
  { value: '775', label: t('sharedDir') },
])
</script>

<i18n lang="json">
{
  "en": {
    "title": "Common Presets",
    "executable": "Executable",
    "readOnly": "Read Only",
    "fullAccess": "Full Access",
    "ownerOnly": "Owner Only",
    "privateFile": "Private File",
    "sharedDir": "Shared Directory"
  },
  "zh": {
    "title": "常用预设",
    "executable": "可执行文件",
    "readOnly": "只读文件",
    "fullAccess": "完全访问",
    "ownerOnly": "仅所有者",
    "privateFile": "私有文件",
    "sharedDir": "共享目录"
  },
  "zh-CN": {
    "title": "常用预设",
    "executable": "可执行文件",
    "readOnly": "只读文件",
    "fullAccess": "完全访问",
    "ownerOnly": "仅所有者",
    "privateFile": "私有文件",
    "sharedDir": "共享目录"
  },
  "zh-TW": {
    "title": "常用預設",
    "executable": "可執行檔",
    "readOnly": "唯讀檔案",
    "fullAccess": "完全存取",
    "ownerOnly": "僅擁有者",
    "privateFile": "私有檔案",
    "sharedDir": "共享目錄"
  },
  "zh-HK": {
    "title": "常用預設",
    "executable": "可執行檔",
    "readOnly": "唯讀檔案",
    "fullAccess": "完全存取",
    "ownerOnly": "僅擁有者",
    "privateFile": "私有檔案",
    "sharedDir": "共享目錄"
  },
  "es": {
    "title": "Preajustes comunes",
    "executable": "Ejecutable",
    "readOnly": "Solo lectura",
    "fullAccess": "Acceso completo",
    "ownerOnly": "Solo propietario",
    "privateFile": "Archivo privado",
    "sharedDir": "Directorio compartido"
  },
  "fr": {
    "title": "Préréglages courants",
    "executable": "Exécutable",
    "readOnly": "Lecture seule",
    "fullAccess": "Accès complet",
    "ownerOnly": "Propriétaire seul",
    "privateFile": "Fichier privé",
    "sharedDir": "Répertoire partagé"
  },
  "de": {
    "title": "Häufige Voreinstellungen",
    "executable": "Ausführbar",
    "readOnly": "Nur lesen",
    "fullAccess": "Vollzugriff",
    "ownerOnly": "Nur Eigentümer",
    "privateFile": "Private Datei",
    "sharedDir": "Freigegebenes Verzeichnis"
  },
  "it": {
    "title": "Preset comuni",
    "executable": "Eseguibile",
    "readOnly": "Sola lettura",
    "fullAccess": "Accesso completo",
    "ownerOnly": "Solo proprietario",
    "privateFile": "File privato",
    "sharedDir": "Directory condivisa"
  },
  "ja": {
    "title": "一般的なプリセット",
    "executable": "実行可能",
    "readOnly": "読み取り専用",
    "fullAccess": "フルアクセス",
    "ownerOnly": "所有者のみ",
    "privateFile": "プライベートファイル",
    "sharedDir": "共有ディレクトリ"
  },
  "ko": {
    "title": "일반 프리셋",
    "executable": "실행 가능",
    "readOnly": "읽기 전용",
    "fullAccess": "전체 액세스",
    "ownerOnly": "소유자만",
    "privateFile": "비공개 파일",
    "sharedDir": "공유 디렉토리"
  },
  "ru": {
    "title": "Общие пресеты",
    "executable": "Исполняемый",
    "readOnly": "Только чтение",
    "fullAccess": "Полный доступ",
    "ownerOnly": "Только владелец",
    "privateFile": "Приватный файл",
    "sharedDir": "Общий каталог"
  },
  "pt": {
    "title": "Predefinições comuns",
    "executable": "Executável",
    "readOnly": "Somente leitura",
    "fullAccess": "Acesso total",
    "ownerOnly": "Apenas proprietário",
    "privateFile": "Arquivo privado",
    "sharedDir": "Diretório compartilhado"
  },
  "ar": {
    "title": "إعدادات مسبقة شائعة",
    "executable": "قابل للتنفيذ",
    "readOnly": "للقراءة فقط",
    "fullAccess": "وصول كامل",
    "ownerOnly": "المالك فقط",
    "privateFile": "ملف خاص",
    "sharedDir": "مجلد مشترك"
  },
  "hi": {
    "title": "सामान्य प्रीसेट",
    "executable": "निष्पादन योग्य",
    "readOnly": "केवल पढ़ने के लिए",
    "fullAccess": "पूर्ण पहुँच",
    "ownerOnly": "केवल स्वामी",
    "privateFile": "निजी फ़ाइल",
    "sharedDir": "साझा निर्देशिका"
  },
  "tr": {
    "title": "Yaygın Ön Ayarlar",
    "executable": "Çalıştırılabilir",
    "readOnly": "Salt Okunur",
    "fullAccess": "Tam Erişim",
    "ownerOnly": "Yalnızca Sahip",
    "privateFile": "Özel Dosya",
    "sharedDir": "Paylaşılan Dizin"
  },
  "nl": {
    "title": "Veelgebruikte presets",
    "executable": "Uitvoerbaar",
    "readOnly": "Alleen-lezen",
    "fullAccess": "Volledige toegang",
    "ownerOnly": "Alleen eigenaar",
    "privateFile": "Privébestand",
    "sharedDir": "Gedeelde map"
  },
  "sv": {
    "title": "Vanliga förinställningar",
    "executable": "Körbar",
    "readOnly": "Skrivskyddad",
    "fullAccess": "Full åtkomst",
    "ownerOnly": "Endast ägare",
    "privateFile": "Privat fil",
    "sharedDir": "Delad katalog"
  },
  "pl": {
    "title": "Typowe ustawienia",
    "executable": "Wykonywalny",
    "readOnly": "Tylko odczyt",
    "fullAccess": "Pełny dostęp",
    "ownerOnly": "Tylko właściciel",
    "privateFile": "Plik prywatny",
    "sharedDir": "Katalog współdzielony"
  },
  "vi": {
    "title": "Cài đặt phổ biến",
    "executable": "Thực thi được",
    "readOnly": "Chỉ đọc",
    "fullAccess": "Toàn quyền",
    "ownerOnly": "Chỉ chủ sở hữu",
    "privateFile": "Tệp riêng tư",
    "sharedDir": "Thư mục chia sẻ"
  },
  "th": {
    "title": "ค่าที่ตั้งไว้ทั่วไป",
    "executable": "ไฟล์รันได้",
    "readOnly": "อ่านอย่างเดียว",
    "fullAccess": "เข้าถึงเต็มที่",
    "ownerOnly": "เจ้าของเท่านั้น",
    "privateFile": "ไฟล์ส่วนตัว",
    "sharedDir": "ไดเรกทอรีแชร์"
  },
  "id": {
    "title": "Preset Umum",
    "executable": "Dapat dieksekusi",
    "readOnly": "Hanya baca",
    "fullAccess": "Akses penuh",
    "ownerOnly": "Hanya pemilik",
    "privateFile": "File pribadi",
    "sharedDir": "Direktori bersama"
  },
  "he": {
    "title": "הגדרות נפוצות",
    "executable": "ניתן להרצה",
    "readOnly": "קריאה בלבד",
    "fullAccess": "גישה מלאה",
    "ownerOnly": "בעלים בלבד",
    "privateFile": "קובץ פרטי",
    "sharedDir": "ספרייה משותפת"
  },
  "ms": {
    "title": "Pratetap Biasa",
    "executable": "Boleh dilaksanakan",
    "readOnly": "Baca sahaja",
    "fullAccess": "Akses penuh",
    "ownerOnly": "Pemilik sahaja",
    "privateFile": "Fail peribadi",
    "sharedDir": "Direktori kongsi"
  },
  "no": {
    "title": "Vanlige forhåndsinnstillinger",
    "executable": "Kjørbar",
    "readOnly": "Skrivebeskyttet",
    "fullAccess": "Full tilgang",
    "ownerOnly": "Kun eier",
    "privateFile": "Privat fil",
    "sharedDir": "Delt katalog"
  }
}
</i18n>
