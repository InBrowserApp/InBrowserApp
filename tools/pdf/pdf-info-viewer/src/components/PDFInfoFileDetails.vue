<template>
  <ToolSectionHeader>{{ t('fileDetails') }}</ToolSectionHeader>
  <ToolSection>
    <n-spin :show="loading">
      <n-descriptions label-placement="left" bordered :column="1" content-style="width: 100%">
        <n-descriptions-item :label="t('fileName')">
          <n-text>{{ info.file.name }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('fileSize')">
          <n-text>{{ formattedFileSize }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('fileType')">
          <n-text>{{ formatText(info.file.type) }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('lastModified')">
          <n-text>{{ formatDate(info.file.lastModified) }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('pdfVersion')">
          <n-text>{{ formatText(info.document.version) }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('pageCount')">
          <n-text>{{ formatNumber(info.document.pageCount) }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('encrypted')">
          <n-tag :type="info.document.encrypted ? 'warning' : 'success'">
            {{ info.document.encrypted ? t('encryptedYes') : t('encryptedNo') }}
          </n-tag>
        </n-descriptions-item>
      </n-descriptions>
    </n-spin>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { filesize } from 'filesize'
import { NDescriptions, NDescriptionsItem, NSpin, NTag, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { PdfInfo } from '../utils/extractPdfInfo'

const props = defineProps<{
  info: PdfInfo
  loading: boolean
}>()

const { t } = useI18n()

const formattedFileSize = computed(() => filesize(props.info.file.size) as string)

const formatText = (value?: string) => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : t('notAvailable')
}

const formatNumber = (value?: number) =>
  typeof value === 'number' && Number.isFinite(value) ? value.toLocaleString() : t('notAvailable')

const formatDate = (value?: Date) => {
  if (!value) return t('notAvailable')
  if (Number.isNaN(value.getTime())) return t('notAvailable')
  return value.toLocaleString()
}
</script>

<i18n lang="json">
{
  "en": {
    "fileDetails": "File details",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "lastModified": "Last modified",
    "pdfVersion": "PDF version",
    "pageCount": "Page count",
    "encrypted": "Encryption",
    "encryptedYes": "Encrypted",
    "encryptedNo": "Not encrypted",
    "notAvailable": "Not available"
  },
  "zh": {
    "fileDetails": "文件信息",
    "fileName": "文件名",
    "fileSize": "文件大小",
    "fileType": "文件类型",
    "lastModified": "最后修改",
    "pdfVersion": "PDF 版本",
    "pageCount": "页数",
    "encrypted": "加密",
    "encryptedYes": "已加密",
    "encryptedNo": "未加密",
    "notAvailable": "不可用"
  },
  "zh-CN": {
    "fileDetails": "文件信息",
    "fileName": "文件名",
    "fileSize": "文件大小",
    "fileType": "文件类型",
    "lastModified": "最后修改",
    "pdfVersion": "PDF 版本",
    "pageCount": "页数",
    "encrypted": "加密",
    "encryptedYes": "已加密",
    "encryptedNo": "未加密",
    "notAvailable": "不可用"
  },
  "zh-TW": {
    "fileDetails": "檔案資訊",
    "fileName": "檔案名稱",
    "fileSize": "檔案大小",
    "fileType": "檔案類型",
    "lastModified": "最後修改",
    "pdfVersion": "PDF 版本",
    "pageCount": "頁數",
    "encrypted": "加密",
    "encryptedYes": "已加密",
    "encryptedNo": "未加密",
    "notAvailable": "不可用"
  },
  "zh-HK": {
    "fileDetails": "檔案資訊",
    "fileName": "檔案名稱",
    "fileSize": "檔案大小",
    "fileType": "檔案類型",
    "lastModified": "最後修改",
    "pdfVersion": "PDF 版本",
    "pageCount": "頁數",
    "encrypted": "加密",
    "encryptedYes": "已加密",
    "encryptedNo": "未加密",
    "notAvailable": "不可用"
  },
  "es": {
    "fileDetails": "Detalles del archivo",
    "fileName": "Nombre del archivo",
    "fileSize": "Tamaño del archivo",
    "fileType": "Tipo de archivo",
    "lastModified": "Última modificación",
    "pdfVersion": "Versión de PDF",
    "pageCount": "Número de páginas",
    "encrypted": "Cifrado",
    "encryptedYes": "Cifrado",
    "encryptedNo": "Sin cifrar",
    "notAvailable": "No disponible"
  },
  "fr": {
    "fileDetails": "Détails du fichier",
    "fileName": "Nom du fichier",
    "fileSize": "Taille du fichier",
    "fileType": "Type de fichier",
    "lastModified": "Dernière modification",
    "pdfVersion": "Version PDF",
    "pageCount": "Nombre de pages",
    "encrypted": "Chiffrement",
    "encryptedYes": "Chiffré",
    "encryptedNo": "Non chiffré",
    "notAvailable": "Indisponible"
  },
  "de": {
    "fileDetails": "Dateidetails",
    "fileName": "Dateiname",
    "fileSize": "Dateigröße",
    "fileType": "Dateityp",
    "lastModified": "Zuletzt geändert",
    "pdfVersion": "PDF-Version",
    "pageCount": "Seitenzahl",
    "encrypted": "Verschlüsselung",
    "encryptedYes": "Verschlüsselt",
    "encryptedNo": "Nicht verschlüsselt",
    "notAvailable": "Nicht verfügbar"
  },
  "it": {
    "fileDetails": "Dettagli file",
    "fileName": "Nome file",
    "fileSize": "Dimensione file",
    "fileType": "Tipo di file",
    "lastModified": "Ultima modifica",
    "pdfVersion": "Versione PDF",
    "pageCount": "Numero di pagine",
    "encrypted": "Crittografia",
    "encryptedYes": "Crittografato",
    "encryptedNo": "Non crittografato",
    "notAvailable": "Non disponibile"
  },
  "ja": {
    "fileDetails": "ファイル情報",
    "fileName": "ファイル名",
    "fileSize": "ファイルサイズ",
    "fileType": "ファイル種別",
    "lastModified": "最終更新",
    "pdfVersion": "PDF バージョン",
    "pageCount": "ページ数",
    "encrypted": "暗号化",
    "encryptedYes": "暗号化あり",
    "encryptedNo": "暗号化なし",
    "notAvailable": "利用不可"
  },
  "ko": {
    "fileDetails": "파일 정보",
    "fileName": "파일 이름",
    "fileSize": "파일 크기",
    "fileType": "파일 유형",
    "lastModified": "마지막 수정",
    "pdfVersion": "PDF 버전",
    "pageCount": "페이지 수",
    "encrypted": "암호화",
    "encryptedYes": "암호화됨",
    "encryptedNo": "암호화되지 않음",
    "notAvailable": "사용할 수 없음"
  },
  "ru": {
    "fileDetails": "Сведения о файле",
    "fileName": "Имя файла",
    "fileSize": "Размер файла",
    "fileType": "Тип файла",
    "lastModified": "Последнее изменение",
    "pdfVersion": "Версия PDF",
    "pageCount": "Количество страниц",
    "encrypted": "Шифрование",
    "encryptedYes": "Зашифрован",
    "encryptedNo": "Не зашифрован",
    "notAvailable": "Недоступно"
  },
  "pt": {
    "fileDetails": "Detalhes do arquivo",
    "fileName": "Nome do arquivo",
    "fileSize": "Tamanho do arquivo",
    "fileType": "Tipo de arquivo",
    "lastModified": "Última modificação",
    "pdfVersion": "Versão do PDF",
    "pageCount": "Número de páginas",
    "encrypted": "Criptografia",
    "encryptedYes": "Criptografado",
    "encryptedNo": "Não criptografado",
    "notAvailable": "Indisponível"
  },
  "ar": {
    "fileDetails": "تفاصيل الملف",
    "fileName": "اسم الملف",
    "fileSize": "حجم الملف",
    "fileType": "نوع الملف",
    "lastModified": "آخر تعديل",
    "pdfVersion": "إصدار PDF",
    "pageCount": "عدد الصفحات",
    "encrypted": "التشفير",
    "encryptedYes": "مشفر",
    "encryptedNo": "غير مشفر",
    "notAvailable": "غير متاح"
  },
  "hi": {
    "fileDetails": "फ़ाइल विवरण",
    "fileName": "फ़ाइल नाम",
    "fileSize": "फ़ाइल आकार",
    "fileType": "फ़ाइल प्रकार",
    "lastModified": "अंतिम संशोधन",
    "pdfVersion": "PDF संस्करण",
    "pageCount": "पृष्ठ संख्या",
    "encrypted": "एन्क्रिप्शन",
    "encryptedYes": "एन्क्रिप्टेड",
    "encryptedNo": "एन्क्रिप्टेड नहीं",
    "notAvailable": "उपलब्ध नहीं"
  },
  "tr": {
    "fileDetails": "Dosya ayrıntıları",
    "fileName": "Dosya adı",
    "fileSize": "Dosya boyutu",
    "fileType": "Dosya türü",
    "lastModified": "Son değiştirme",
    "pdfVersion": "PDF sürümü",
    "pageCount": "Sayfa sayısı",
    "encrypted": "Şifreleme",
    "encryptedYes": "Şifreli",
    "encryptedNo": "Şifreli değil",
    "notAvailable": "Kullanılamıyor"
  },
  "nl": {
    "fileDetails": "Bestandsdetails",
    "fileName": "Bestandsnaam",
    "fileSize": "Bestandsgrootte",
    "fileType": "Bestandstype",
    "lastModified": "Laatst gewijzigd",
    "pdfVersion": "PDF-versie",
    "pageCount": "Aantal pagina's",
    "encrypted": "Versleuteling",
    "encryptedYes": "Versleuteld",
    "encryptedNo": "Niet versleuteld",
    "notAvailable": "Niet beschikbaar"
  },
  "sv": {
    "fileDetails": "Filinformation",
    "fileName": "Filnamn",
    "fileSize": "Filstorlek",
    "fileType": "Filtyp",
    "lastModified": "Senast ändrad",
    "pdfVersion": "PDF-version",
    "pageCount": "Antal sidor",
    "encrypted": "Kryptering",
    "encryptedYes": "Krypterad",
    "encryptedNo": "Inte krypterad",
    "notAvailable": "Inte tillgängligt"
  },
  "pl": {
    "fileDetails": "Szczegóły pliku",
    "fileName": "Nazwa pliku",
    "fileSize": "Rozmiar pliku",
    "fileType": "Typ pliku",
    "lastModified": "Ostatnia modyfikacja",
    "pdfVersion": "Wersja PDF",
    "pageCount": "Liczba stron",
    "encrypted": "Szyfrowanie",
    "encryptedYes": "Zaszyfrowany",
    "encryptedNo": "Niezaszyfrowany",
    "notAvailable": "Niedostępne"
  },
  "vi": {
    "fileDetails": "Chi tiết tệp",
    "fileName": "Tên tệp",
    "fileSize": "Kích thước tệp",
    "fileType": "Loại tệp",
    "lastModified": "Lần sửa cuối",
    "pdfVersion": "Phiên bản PDF",
    "pageCount": "Số trang",
    "encrypted": "Mã hóa",
    "encryptedYes": "Đã mã hóa",
    "encryptedNo": "Chưa mã hóa",
    "notAvailable": "Không có"
  },
  "th": {
    "fileDetails": "รายละเอียดไฟล์",
    "fileName": "ชื่อไฟล์",
    "fileSize": "ขนาดไฟล์",
    "fileType": "ชนิดไฟล์",
    "lastModified": "แก้ไขล่าสุด",
    "pdfVersion": "เวอร์ชัน PDF",
    "pageCount": "จำนวนหน้า",
    "encrypted": "การเข้ารหัส",
    "encryptedYes": "เข้ารหัสแล้ว",
    "encryptedNo": "ไม่เข้ารหัส",
    "notAvailable": "ไม่มีข้อมูล"
  },
  "id": {
    "fileDetails": "Detail file",
    "fileName": "Nama file",
    "fileSize": "Ukuran file",
    "fileType": "Jenis file",
    "lastModified": "Terakhir diubah",
    "pdfVersion": "Versi PDF",
    "pageCount": "Jumlah halaman",
    "encrypted": "Enkripsi",
    "encryptedYes": "Terenkripsi",
    "encryptedNo": "Tidak terenkripsi",
    "notAvailable": "Tidak tersedia"
  },
  "he": {
    "fileDetails": "פרטי קובץ",
    "fileName": "שם הקובץ",
    "fileSize": "גודל הקובץ",
    "fileType": "סוג הקובץ",
    "lastModified": "שונה לאחרונה",
    "pdfVersion": "גרסת PDF",
    "pageCount": "מספר עמודים",
    "encrypted": "הצפנה",
    "encryptedYes": "מוצפן",
    "encryptedNo": "לא מוצפן",
    "notAvailable": "לא זמין"
  },
  "ms": {
    "fileDetails": "Butiran fail",
    "fileName": "Nama fail",
    "fileSize": "Saiz fail",
    "fileType": "Jenis fail",
    "lastModified": "Terakhir diubah",
    "pdfVersion": "Versi PDF",
    "pageCount": "Bilangan halaman",
    "encrypted": "Penyulitan",
    "encryptedYes": "Disulitkan",
    "encryptedNo": "Tidak disulitkan",
    "notAvailable": "Tidak tersedia"
  },
  "no": {
    "fileDetails": "Fildetaljer",
    "fileName": "Filnavn",
    "fileSize": "Filstørrelse",
    "fileType": "Filtype",
    "lastModified": "Sist endret",
    "pdfVersion": "PDF-versjon",
    "pageCount": "Antall sider",
    "encrypted": "Kryptering",
    "encryptedYes": "Kryptert",
    "encryptedNo": "Ikke kryptert",
    "notAvailable": "Ikke tilgjengelig"
  }
}
</i18n>
