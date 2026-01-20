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

  <ToolSectionHeader>{{ t('metadataDetails') }}</ToolSectionHeader>
  <ToolSection>
    <n-spin :show="loading">
      <n-descriptions label-placement="left" bordered :column="1" content-style="width: 100%">
        <n-descriptions-item :label="t('title')">
          <n-text>{{ formatText(info.metadata.title) }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('author')">
          <n-text>{{ formatText(info.metadata.author) }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('subject')">
          <n-text>{{ formatText(info.metadata.subject) }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('keywords')">
          <n-text>{{ formatKeywords(info.metadata.keywords) }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('creator')">
          <n-text>{{ formatText(info.metadata.creator) }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('producer')">
          <n-text>{{ formatText(info.metadata.producer) }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('creationDate')">
          <n-text>{{ formatDate(info.metadata.creationDate) }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('modificationDate')">
          <n-text>{{ formatDate(info.metadata.modificationDate) }}</n-text>
        </n-descriptions-item>
      </n-descriptions>
    </n-spin>
  </ToolSection>

  <ToolSection v-if="info.document.encrypted">
    <n-alert type="warning" :title="t('encryptedNoticeTitle')">
      {{ t('encryptedNotice') }}
    </n-alert>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { filesize } from 'filesize'
import { NAlert, NDescriptions, NDescriptionsItem, NSpin, NTag, NText } from 'naive-ui'
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

const formatKeywords = (value?: string[]) =>
  value && value.length ? value.join(', ') : t('notAvailable')

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
    "metadataDetails": "Metadata",
    "fileName": "File name",
    "fileSize": "File size",
    "fileType": "File type",
    "lastModified": "Last modified",
    "pdfVersion": "PDF version",
    "pageCount": "Page count",
    "encrypted": "Encryption",
    "encryptedYes": "Encrypted",
    "encryptedNo": "Not encrypted",
    "title": "Title",
    "author": "Author",
    "subject": "Subject",
    "keywords": "Keywords",
    "creator": "Creator",
    "producer": "Producer",
    "creationDate": "Creation date",
    "modificationDate": "Modification date",
    "notAvailable": "Not available",
    "encryptedNoticeTitle": "Password protected",
    "encryptedNotice": "This PDF is encrypted. Metadata may be unavailable without the password."
  },
  "zh": {
    "fileDetails": "文件信息",
    "metadataDetails": "元数据",
    "fileName": "文件名",
    "fileSize": "文件大小",
    "fileType": "文件类型",
    "lastModified": "最后修改",
    "pdfVersion": "PDF 版本",
    "pageCount": "页数",
    "encrypted": "加密",
    "encryptedYes": "已加密",
    "encryptedNo": "未加密",
    "title": "标题",
    "author": "作者",
    "subject": "主题",
    "keywords": "关键词",
    "creator": "创建者",
    "producer": "生成器",
    "creationDate": "创建日期",
    "modificationDate": "修改日期",
    "notAvailable": "不可用",
    "encryptedNoticeTitle": "需要密码",
    "encryptedNotice": "此 PDF 已加密。没有密码可能无法读取元数据。"
  },
  "zh-CN": {
    "fileDetails": "文件信息",
    "metadataDetails": "元数据",
    "fileName": "文件名",
    "fileSize": "文件大小",
    "fileType": "文件类型",
    "lastModified": "最后修改",
    "pdfVersion": "PDF 版本",
    "pageCount": "页数",
    "encrypted": "加密",
    "encryptedYes": "已加密",
    "encryptedNo": "未加密",
    "title": "标题",
    "author": "作者",
    "subject": "主题",
    "keywords": "关键词",
    "creator": "创建者",
    "producer": "生成器",
    "creationDate": "创建日期",
    "modificationDate": "修改日期",
    "notAvailable": "不可用",
    "encryptedNoticeTitle": "需要密码",
    "encryptedNotice": "此 PDF 已加密。没有密码可能无法读取元数据。"
  },
  "zh-TW": {
    "fileDetails": "檔案資訊",
    "metadataDetails": "中繼資料",
    "fileName": "檔案名稱",
    "fileSize": "檔案大小",
    "fileType": "檔案類型",
    "lastModified": "最後修改",
    "pdfVersion": "PDF 版本",
    "pageCount": "頁數",
    "encrypted": "加密",
    "encryptedYes": "已加密",
    "encryptedNo": "未加密",
    "title": "標題",
    "author": "作者",
    "subject": "主題",
    "keywords": "關鍵字",
    "creator": "建立者",
    "producer": "產生器",
    "creationDate": "建立日期",
    "modificationDate": "修改日期",
    "notAvailable": "不可用",
    "encryptedNoticeTitle": "需要密碼",
    "encryptedNotice": "此 PDF 已加密。沒有密碼可能無法讀取中繼資料。"
  },
  "zh-HK": {
    "fileDetails": "檔案資訊",
    "metadataDetails": "中繼資料",
    "fileName": "檔案名稱",
    "fileSize": "檔案大小",
    "fileType": "檔案類型",
    "lastModified": "最後修改",
    "pdfVersion": "PDF 版本",
    "pageCount": "頁數",
    "encrypted": "加密",
    "encryptedYes": "已加密",
    "encryptedNo": "未加密",
    "title": "標題",
    "author": "作者",
    "subject": "主題",
    "keywords": "關鍵字",
    "creator": "建立者",
    "producer": "產生器",
    "creationDate": "建立日期",
    "modificationDate": "修改日期",
    "notAvailable": "不可用",
    "encryptedNoticeTitle": "需要密碼",
    "encryptedNotice": "此 PDF 已加密。沒有密碼可能無法讀取中繼資料。"
  },
  "es": {
    "fileDetails": "Detalles del archivo",
    "metadataDetails": "Metadatos",
    "fileName": "Nombre del archivo",
    "fileSize": "Tamaño del archivo",
    "fileType": "Tipo de archivo",
    "lastModified": "Última modificación",
    "pdfVersion": "Versión de PDF",
    "pageCount": "Número de páginas",
    "encrypted": "Cifrado",
    "encryptedYes": "Cifrado",
    "encryptedNo": "Sin cifrar",
    "title": "Título",
    "author": "Autor",
    "subject": "Asunto",
    "keywords": "Palabras clave",
    "creator": "Creador",
    "producer": "Productor",
    "creationDate": "Fecha de creación",
    "modificationDate": "Fecha de modificación",
    "notAvailable": "No disponible",
    "encryptedNoticeTitle": "Protegido con contraseña",
    "encryptedNotice": "Este PDF está cifrado. Los metadatos pueden no estar disponibles sin la contraseña."
  },
  "fr": {
    "fileDetails": "Détails du fichier",
    "metadataDetails": "Métadonnées",
    "fileName": "Nom du fichier",
    "fileSize": "Taille du fichier",
    "fileType": "Type de fichier",
    "lastModified": "Dernière modification",
    "pdfVersion": "Version PDF",
    "pageCount": "Nombre de pages",
    "encrypted": "Chiffrement",
    "encryptedYes": "Chiffré",
    "encryptedNo": "Non chiffré",
    "title": "Titre",
    "author": "Auteur",
    "subject": "Sujet",
    "keywords": "Mots-clés",
    "creator": "Créateur",
    "producer": "Producteur",
    "creationDate": "Date de création",
    "modificationDate": "Date de modification",
    "notAvailable": "Indisponible",
    "encryptedNoticeTitle": "Protégé par mot de passe",
    "encryptedNotice": "Ce PDF est chiffré. Les métadonnées peuvent être indisponibles sans le mot de passe."
  },
  "de": {
    "fileDetails": "Dateidetails",
    "metadataDetails": "Metadaten",
    "fileName": "Dateiname",
    "fileSize": "Dateigröße",
    "fileType": "Dateityp",
    "lastModified": "Zuletzt geändert",
    "pdfVersion": "PDF-Version",
    "pageCount": "Seitenzahl",
    "encrypted": "Verschlüsselung",
    "encryptedYes": "Verschlüsselt",
    "encryptedNo": "Nicht verschlüsselt",
    "title": "Titel",
    "author": "Autor",
    "subject": "Betreff",
    "keywords": "Schlüsselwörter",
    "creator": "Ersteller",
    "producer": "Hersteller",
    "creationDate": "Erstellungsdatum",
    "modificationDate": "Änderungsdatum",
    "notAvailable": "Nicht verfügbar",
    "encryptedNoticeTitle": "Passwortgeschützt",
    "encryptedNotice": "Dieses PDF ist verschlüsselt. Ohne Passwort sind Metadaten möglicherweise nicht verfügbar."
  },
  "it": {
    "fileDetails": "Dettagli file",
    "metadataDetails": "Metadati",
    "fileName": "Nome file",
    "fileSize": "Dimensione file",
    "fileType": "Tipo di file",
    "lastModified": "Ultima modifica",
    "pdfVersion": "Versione PDF",
    "pageCount": "Numero di pagine",
    "encrypted": "Crittografia",
    "encryptedYes": "Crittografato",
    "encryptedNo": "Non crittografato",
    "title": "Titolo",
    "author": "Autore",
    "subject": "Oggetto",
    "keywords": "Parole chiave",
    "creator": "Creatore",
    "producer": "Produttore",
    "creationDate": "Data di creazione",
    "modificationDate": "Data di modifica",
    "notAvailable": "Non disponibile",
    "encryptedNoticeTitle": "Protetto da password",
    "encryptedNotice": "Questo PDF è crittografato. I metadati potrebbero non essere disponibili senza la password."
  },
  "ja": {
    "fileDetails": "ファイル情報",
    "metadataDetails": "メタデータ",
    "fileName": "ファイル名",
    "fileSize": "ファイルサイズ",
    "fileType": "ファイル種別",
    "lastModified": "最終更新",
    "pdfVersion": "PDF バージョン",
    "pageCount": "ページ数",
    "encrypted": "暗号化",
    "encryptedYes": "暗号化あり",
    "encryptedNo": "暗号化なし",
    "title": "タイトル",
    "author": "作者",
    "subject": "件名",
    "keywords": "キーワード",
    "creator": "作成者",
    "producer": "生成者",
    "creationDate": "作成日",
    "modificationDate": "更新日",
    "notAvailable": "利用不可",
    "encryptedNoticeTitle": "パスワード保護",
    "encryptedNotice": "この PDF は暗号化されています。パスワードがないとメタデータを取得できない場合があります。"
  },
  "ko": {
    "fileDetails": "파일 정보",
    "metadataDetails": "메타데이터",
    "fileName": "파일 이름",
    "fileSize": "파일 크기",
    "fileType": "파일 유형",
    "lastModified": "마지막 수정",
    "pdfVersion": "PDF 버전",
    "pageCount": "페이지 수",
    "encrypted": "암호화",
    "encryptedYes": "암호화됨",
    "encryptedNo": "암호화되지 않음",
    "title": "제목",
    "author": "작성자",
    "subject": "주제",
    "keywords": "키워드",
    "creator": "생성자",
    "producer": "제작자",
    "creationDate": "생성 날짜",
    "modificationDate": "수정 날짜",
    "notAvailable": "사용할 수 없음",
    "encryptedNoticeTitle": "비밀번호 보호",
    "encryptedNotice": "이 PDF는 암호화되어 있습니다. 비밀번호가 없으면 메타데이터를 읽을 수 없을 수 있습니다."
  },
  "ru": {
    "fileDetails": "Сведения о файле",
    "metadataDetails": "Метаданные",
    "fileName": "Имя файла",
    "fileSize": "Размер файла",
    "fileType": "Тип файла",
    "lastModified": "Последнее изменение",
    "pdfVersion": "Версия PDF",
    "pageCount": "Количество страниц",
    "encrypted": "Шифрование",
    "encryptedYes": "Зашифрован",
    "encryptedNo": "Не зашифрован",
    "title": "Название",
    "author": "Автор",
    "subject": "Тема",
    "keywords": "Ключевые слова",
    "creator": "Создатель",
    "producer": "Производитель",
    "creationDate": "Дата создания",
    "modificationDate": "Дата изменения",
    "notAvailable": "Недоступно",
    "encryptedNoticeTitle": "Защищено паролем",
    "encryptedNotice": "Этот PDF зашифрован. Без пароля метаданные могут быть недоступны."
  },
  "pt": {
    "fileDetails": "Detalhes do arquivo",
    "metadataDetails": "Metadados",
    "fileName": "Nome do arquivo",
    "fileSize": "Tamanho do arquivo",
    "fileType": "Tipo de arquivo",
    "lastModified": "Última modificação",
    "pdfVersion": "Versão do PDF",
    "pageCount": "Número de páginas",
    "encrypted": "Criptografia",
    "encryptedYes": "Criptografado",
    "encryptedNo": "Não criptografado",
    "title": "Título",
    "author": "Autor",
    "subject": "Assunto",
    "keywords": "Palavras-chave",
    "creator": "Criador",
    "producer": "Produtor",
    "creationDate": "Data de criação",
    "modificationDate": "Data de modificação",
    "notAvailable": "Indisponível",
    "encryptedNoticeTitle": "Protegido por senha",
    "encryptedNotice": "Este PDF está criptografado. Os metadados podem não estar disponíveis sem a senha."
  },
  "ar": {
    "fileDetails": "تفاصيل الملف",
    "metadataDetails": "البيانات الوصفية",
    "fileName": "اسم الملف",
    "fileSize": "حجم الملف",
    "fileType": "نوع الملف",
    "lastModified": "آخر تعديل",
    "pdfVersion": "إصدار PDF",
    "pageCount": "عدد الصفحات",
    "encrypted": "التشفير",
    "encryptedYes": "مشفر",
    "encryptedNo": "غير مشفر",
    "title": "العنوان",
    "author": "المؤلف",
    "subject": "الموضوع",
    "keywords": "الكلمات المفتاحية",
    "creator": "المنشئ",
    "producer": "المنتج",
    "creationDate": "تاريخ الإنشاء",
    "modificationDate": "تاريخ التعديل",
    "notAvailable": "غير متاح",
    "encryptedNoticeTitle": "محمي بكلمة مرور",
    "encryptedNotice": "هذا الملف مشفر. قد لا تكون البيانات الوصفية متاحة بدون كلمة المرور."
  },
  "hi": {
    "fileDetails": "फ़ाइल विवरण",
    "metadataDetails": "मेटाडेटा",
    "fileName": "फ़ाइल नाम",
    "fileSize": "फ़ाइल आकार",
    "fileType": "फ़ाइल प्रकार",
    "lastModified": "अंतिम संशोधन",
    "pdfVersion": "PDF संस्करण",
    "pageCount": "पृष्ठ संख्या",
    "encrypted": "एन्क्रिप्शन",
    "encryptedYes": "एन्क्रिप्टेड",
    "encryptedNo": "एन्क्रिप्टेड नहीं",
    "title": "शीर्षक",
    "author": "लेखक",
    "subject": "विषय",
    "keywords": "कीवर्ड",
    "creator": "निर्माता",
    "producer": "निर्माता (प्रोड्यूसर)",
    "creationDate": "निर्माण तिथि",
    "modificationDate": "संशोधन तिथि",
    "notAvailable": "उपलब्ध नहीं",
    "encryptedNoticeTitle": "पासवर्ड सुरक्षित",
    "encryptedNotice": "यह PDF एन्क्रिप्टेड है। पासवर्ड के बिना मेटाडेटा उपलब्ध नहीं हो सकता है।"
  },
  "tr": {
    "fileDetails": "Dosya ayrıntıları",
    "metadataDetails": "Meta veriler",
    "fileName": "Dosya adı",
    "fileSize": "Dosya boyutu",
    "fileType": "Dosya türü",
    "lastModified": "Son değiştirme",
    "pdfVersion": "PDF sürümü",
    "pageCount": "Sayfa sayısı",
    "encrypted": "Şifreleme",
    "encryptedYes": "Şifreli",
    "encryptedNo": "Şifreli değil",
    "title": "Başlık",
    "author": "Yazar",
    "subject": "Konu",
    "keywords": "Anahtar kelimeler",
    "creator": "Oluşturan",
    "producer": "Üretici",
    "creationDate": "Oluşturma tarihi",
    "modificationDate": "Değiştirme tarihi",
    "notAvailable": "Kullanılamıyor",
    "encryptedNoticeTitle": "Parola korumalı",
    "encryptedNotice": "Bu PDF şifreli. Parola olmadan meta verilere erişilemeyebilir."
  },
  "nl": {
    "fileDetails": "Bestandsdetails",
    "metadataDetails": "Metadata",
    "fileName": "Bestandsnaam",
    "fileSize": "Bestandsgrootte",
    "fileType": "Bestandstype",
    "lastModified": "Laatst gewijzigd",
    "pdfVersion": "PDF-versie",
    "pageCount": "Aantal pagina's",
    "encrypted": "Versleuteling",
    "encryptedYes": "Versleuteld",
    "encryptedNo": "Niet versleuteld",
    "title": "Titel",
    "author": "Auteur",
    "subject": "Onderwerp",
    "keywords": "Trefwoorden",
    "creator": "Maker",
    "producer": "Producent",
    "creationDate": "Aanmaakdatum",
    "modificationDate": "Wijzigingsdatum",
    "notAvailable": "Niet beschikbaar",
    "encryptedNoticeTitle": "Wachtwoordbeveiligd",
    "encryptedNotice": "Deze PDF is versleuteld. Metadata is mogelijk niet beschikbaar zonder het wachtwoord."
  },
  "sv": {
    "fileDetails": "Filinformation",
    "metadataDetails": "Metadata",
    "fileName": "Filnamn",
    "fileSize": "Filstorlek",
    "fileType": "Filtyp",
    "lastModified": "Senast ändrad",
    "pdfVersion": "PDF-version",
    "pageCount": "Antal sidor",
    "encrypted": "Kryptering",
    "encryptedYes": "Krypterad",
    "encryptedNo": "Inte krypterad",
    "title": "Titel",
    "author": "Författare",
    "subject": "Ämne",
    "keywords": "Nyckelord",
    "creator": "Skapare",
    "producer": "Producent",
    "creationDate": "Skapad datum",
    "modificationDate": "Ändringsdatum",
    "notAvailable": "Inte tillgängligt",
    "encryptedNoticeTitle": "Lösenordsskyddad",
    "encryptedNotice": "Den här PDF-filen är krypterad. Metadata kan vara otillgänglig utan lösenord."
  },
  "pl": {
    "fileDetails": "Szczegóły pliku",
    "metadataDetails": "Metadane",
    "fileName": "Nazwa pliku",
    "fileSize": "Rozmiar pliku",
    "fileType": "Typ pliku",
    "lastModified": "Ostatnia modyfikacja",
    "pdfVersion": "Wersja PDF",
    "pageCount": "Liczba stron",
    "encrypted": "Szyfrowanie",
    "encryptedYes": "Zaszyfrowany",
    "encryptedNo": "Niezaszyfrowany",
    "title": "Tytuł",
    "author": "Autor",
    "subject": "Temat",
    "keywords": "Słowa kluczowe",
    "creator": "Twórca",
    "producer": "Producent",
    "creationDate": "Data utworzenia",
    "modificationDate": "Data modyfikacji",
    "notAvailable": "Niedostępne",
    "encryptedNoticeTitle": "Chronione hasłem",
    "encryptedNotice": "Ten PDF jest zaszyfrowany. Metadane mogą być niedostępne bez hasła."
  },
  "vi": {
    "fileDetails": "Chi tiết tệp",
    "metadataDetails": "Siêu dữ liệu",
    "fileName": "Tên tệp",
    "fileSize": "Kích thước tệp",
    "fileType": "Loại tệp",
    "lastModified": "Lần sửa cuối",
    "pdfVersion": "Phiên bản PDF",
    "pageCount": "Số trang",
    "encrypted": "Mã hóa",
    "encryptedYes": "Đã mã hóa",
    "encryptedNo": "Chưa mã hóa",
    "title": "Tiêu đề",
    "author": "Tác giả",
    "subject": "Chủ đề",
    "keywords": "Từ khóa",
    "creator": "Người tạo",
    "producer": "Nhà sản xuất",
    "creationDate": "Ngày tạo",
    "modificationDate": "Ngày sửa",
    "notAvailable": "Không có",
    "encryptedNoticeTitle": "Được bảo vệ bằng mật khẩu",
    "encryptedNotice": "PDF này được mã hóa. Có thể không đọc được siêu dữ liệu nếu không có mật khẩu."
  },
  "th": {
    "fileDetails": "รายละเอียดไฟล์",
    "metadataDetails": "เมตาดาตา",
    "fileName": "ชื่อไฟล์",
    "fileSize": "ขนาดไฟล์",
    "fileType": "ชนิดไฟล์",
    "lastModified": "แก้ไขล่าสุด",
    "pdfVersion": "เวอร์ชัน PDF",
    "pageCount": "จำนวนหน้า",
    "encrypted": "การเข้ารหัส",
    "encryptedYes": "เข้ารหัสแล้ว",
    "encryptedNo": "ไม่เข้ารหัส",
    "title": "ชื่อเรื่อง",
    "author": "ผู้เขียน",
    "subject": "หัวข้อ",
    "keywords": "คีย์เวิร์ด",
    "creator": "ผู้สร้าง",
    "producer": "ผู้ผลิต",
    "creationDate": "วันที่สร้าง",
    "modificationDate": "วันที่แก้ไข",
    "notAvailable": "ไม่มีข้อมูล",
    "encryptedNoticeTitle": "ป้องกันด้วยรหัสผ่าน",
    "encryptedNotice": "PDF นี้ถูกเข้ารหัส อาจไม่สามารถอ่านเมตาดาตาได้หากไม่มีรหัสผ่าน"
  },
  "id": {
    "fileDetails": "Detail file",
    "metadataDetails": "Metadata",
    "fileName": "Nama file",
    "fileSize": "Ukuran file",
    "fileType": "Jenis file",
    "lastModified": "Terakhir diubah",
    "pdfVersion": "Versi PDF",
    "pageCount": "Jumlah halaman",
    "encrypted": "Enkripsi",
    "encryptedYes": "Terenkripsi",
    "encryptedNo": "Tidak terenkripsi",
    "title": "Judul",
    "author": "Penulis",
    "subject": "Subjek",
    "keywords": "Kata kunci",
    "creator": "Pembuat",
    "producer": "Produsen",
    "creationDate": "Tanggal pembuatan",
    "modificationDate": "Tanggal modifikasi",
    "notAvailable": "Tidak tersedia",
    "encryptedNoticeTitle": "Dilindungi kata sandi",
    "encryptedNotice": "PDF ini terenkripsi. Metadata mungkin tidak tersedia tanpa kata sandi."
  },
  "he": {
    "fileDetails": "פרטי קובץ",
    "metadataDetails": "מטא-דטה",
    "fileName": "שם הקובץ",
    "fileSize": "גודל הקובץ",
    "fileType": "סוג הקובץ",
    "lastModified": "שונה לאחרונה",
    "pdfVersion": "גרסת PDF",
    "pageCount": "מספר עמודים",
    "encrypted": "הצפנה",
    "encryptedYes": "מוצפן",
    "encryptedNo": "לא מוצפן",
    "title": "כותרת",
    "author": "מחבר",
    "subject": "נושא",
    "keywords": "מילות מפתח",
    "creator": "יוצר",
    "producer": "מפיק",
    "creationDate": "תאריך יצירה",
    "modificationDate": "תאריך שינוי",
    "notAvailable": "לא זמין",
    "encryptedNoticeTitle": "מוגן בסיסמה",
    "encryptedNotice": "קובץ ה-PDF הזה מוצפן. ייתכן שהמטא-דטה לא תהיה זמינה ללא הסיסמה."
  },
  "ms": {
    "fileDetails": "Butiran fail",
    "metadataDetails": "Metadata",
    "fileName": "Nama fail",
    "fileSize": "Saiz fail",
    "fileType": "Jenis fail",
    "lastModified": "Terakhir diubah",
    "pdfVersion": "Versi PDF",
    "pageCount": "Bilangan halaman",
    "encrypted": "Penyulitan",
    "encryptedYes": "Disulitkan",
    "encryptedNo": "Tidak disulitkan",
    "title": "Tajuk",
    "author": "Pengarang",
    "subject": "Subjek",
    "keywords": "Kata kunci",
    "creator": "Pencipta",
    "producer": "Pengeluar",
    "creationDate": "Tarikh penciptaan",
    "modificationDate": "Tarikh pengubahsuaian",
    "notAvailable": "Tidak tersedia",
    "encryptedNoticeTitle": "Dilindungi kata laluan",
    "encryptedNotice": "PDF ini disulitkan. Metadata mungkin tidak tersedia tanpa kata laluan."
  },
  "no": {
    "fileDetails": "Fildetaljer",
    "metadataDetails": "Metadata",
    "fileName": "Filnavn",
    "fileSize": "Filstørrelse",
    "fileType": "Filtype",
    "lastModified": "Sist endret",
    "pdfVersion": "PDF-versjon",
    "pageCount": "Antall sider",
    "encrypted": "Kryptering",
    "encryptedYes": "Kryptert",
    "encryptedNo": "Ikke kryptert",
    "title": "Tittel",
    "author": "Forfatter",
    "subject": "Emne",
    "keywords": "Nøkkelord",
    "creator": "Oppretter",
    "producer": "Produsent",
    "creationDate": "Opprettelsesdato",
    "modificationDate": "Endringsdato",
    "notAvailable": "Ikke tilgjengelig",
    "encryptedNoticeTitle": "Passordbeskyttet",
    "encryptedNotice": "Denne PDF-en er kryptert. Metadata kan være utilgjengelig uten passordet."
  }
}
</i18n>
