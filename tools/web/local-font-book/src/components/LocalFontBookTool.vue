<template>
  <n-grid cols="1 l:2" :x-gap="24" :y-gap="24" responsive="screen">
    <n-gi>
      <LocalFontBookLibraryCard
        v-model:search-query="searchQuery"
        v-model:filter-style="filterStyle"
        v-model:sort-by="sortBy"
        v-model:group-by-family="groupByFamily"
        :title="labels.libraryTitle"
        :is-supported="isSupported"
        :is-loading="isLoading"
        :status-message="statusMessage"
        :status-type="statusType"
        :style-options="styleOptions"
        :sort-options="sortOptions"
        :font-count-label="fontCountLabel"
        :display-groups="displayGroups"
        :active-font-id="activeFontId"
        :font-card-style="fontCardStyle"
        @load-fonts="loadFonts"
        @select-font="setActiveFont"
      />
    </n-gi>

    <n-gi>
      <LocalFontBookPreviewCard
        v-model:sample-text="sampleText"
        v-model:dark-background="darkBackground"
        :active-font="activeFont"
        :preview-style="previewStyle"
      />
      <LocalFontBookDetailsCard :active-font="activeFont" :css-snippet="cssSnippet" />
    </n-gi>
  </n-grid>

  <LocalFontBookWhatIs />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NGi, NGrid } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import LocalFontBookDetailsCard from './LocalFontBookDetailsCard.vue'
import LocalFontBookLibraryCard from './LocalFontBookLibraryCard.vue'
import LocalFontBookPreviewCard from './LocalFontBookPreviewCard.vue'
import LocalFontBookWhatIs from './LocalFontBookWhatIs.vue'
import { useLocalFontBook } from '../composables/useLocalFontBook'

const { t } = useI18n({ useScope: 'local' })

const labels = computed(() => ({
  libraryTitle: t('library-title'),
  filterStyleAll: t('filter-style-all'),
  filterStyleRegular: t('filter-style-regular'),
  filterStyleItalic: t('filter-style-italic'),
  sortFamily: t('sort-family'),
  sortName: t('sort-name'),
  sortStyle: t('sort-style'),
  formatFontCount: (count: number) => t('font-count', { count }),
  statusUnsupported: t('status-unsupported'),
  statusDenied: t('status-denied'),
  statusBlocked: t('status-blocked'),
  statusError: t('status-error'),
}))

const {
  isSupported,
  isLoading,
  permissionState,
  statusMessage,
  statusType,
  styleOptions,
  sortOptions,
  fontCountLabel,
  displayGroups,
  normalizedFonts,
  activeFont,
  previewStyle,
  cssSnippet,
  searchQuery,
  filterStyle,
  sortBy,
  groupByFamily,
  sampleText,
  darkBackground,
  activeFontId,
  fontCardStyle,
  loadFonts,
  setActiveFont,
} = useLocalFontBook(labels)

defineExpose({ permissionState, normalizedFonts })
</script>

<i18n lang="json">
{
  "en": {
    "library-title": "Font library",
    "filter-style-all": "All styles",
    "filter-style-regular": "Regular",
    "filter-style-italic": "Italic/Oblique",
    "sort-family": "Family",
    "sort-name": "Name",
    "sort-style": "Style",
    "font-count": "Total {count} fonts",
    "status-unsupported": "Your browser does not support Local Font Access.",
    "status-denied": "Permission denied. Allow local-fonts to list fonts.",
    "status-blocked": "Access blocked by permissions policy or insecure context.",
    "status-error": "Unable to load fonts. Try again."
  },
  "zh": {
    "library-title": "字体库",
    "filter-style-all": "全部样式",
    "filter-style-regular": "常规",
    "filter-style-italic": "斜体/倾斜",
    "sort-family": "家族",
    "sort-name": "名称",
    "sort-style": "样式",
    "font-count": "共 {count} 个字体",
    "status-unsupported": "当前浏览器不支持 Local Font Access。",
    "status-denied": "权限被拒绝，请允许 local-fonts 访问。",
    "status-blocked": "被权限策略或非安全上下文阻止。",
    "status-error": "字体加载失败，请重试。"
  },
  "zh-CN": {
    "library-title": "字体库",
    "filter-style-all": "全部样式",
    "filter-style-regular": "常规",
    "filter-style-italic": "斜体/倾斜",
    "sort-family": "家族",
    "sort-name": "名称",
    "sort-style": "样式",
    "font-count": "共 {count} 个字体",
    "status-unsupported": "当前浏览器不支持 Local Font Access。",
    "status-denied": "权限被拒绝，请允许 local-fonts 访问。",
    "status-blocked": "被权限策略或非安全上下文阻止。",
    "status-error": "字体加载失败，请重试。"
  },
  "zh-TW": {
    "library-title": "字型庫",
    "filter-style-all": "全部樣式",
    "filter-style-regular": "一般",
    "filter-style-italic": "斜體/傾斜",
    "sort-family": "家族",
    "sort-name": "名稱",
    "sort-style": "樣式",
    "font-count": "共 {count} 個字型",
    "status-unsupported": "目前瀏覽器不支援 Local Font Access。",
    "status-denied": "已拒絕權限，請允許 local-fonts 存取。",
    "status-blocked": "被權限策略或非安全環境阻擋。",
    "status-error": "字型載入失敗，請重試。"
  },
  "zh-HK": {
    "library-title": "字體庫",
    "filter-style-all": "全部樣式",
    "filter-style-regular": "一般",
    "filter-style-italic": "斜體/傾斜",
    "sort-family": "家族",
    "sort-name": "名稱",
    "sort-style": "樣式",
    "font-count": "共 {count} 款字體",
    "status-unsupported": "目前瀏覽器不支援 Local Font Access。",
    "status-denied": "已拒絕權限，請允許 local-fonts 存取。",
    "status-blocked": "被權限政策或非安全環境阻擋。",
    "status-error": "字體載入失敗，請重試。"
  },
  "es": {
    "library-title": "Biblioteca de fuentes",
    "filter-style-all": "Todos los estilos",
    "filter-style-regular": "Regular",
    "filter-style-italic": "Cursiva/Oblicua",
    "sort-family": "Familia",
    "sort-name": "Nombre",
    "sort-style": "Estilo",
    "font-count": "Total {count} fuentes",
    "status-unsupported": "Tu navegador no admite Local Font Access.",
    "status-denied": "Permiso denegado. Permite local-fonts para listar fuentes.",
    "status-blocked": "Acceso bloqueado por política de permisos o contexto inseguro.",
    "status-error": "No se pudieron cargar las fuentes. Inténtalo de nuevo."
  },
  "fr": {
    "library-title": "Bibliothèque de polices",
    "filter-style-all": "Tous les styles",
    "filter-style-regular": "Normal",
    "filter-style-italic": "Italique/Oblique",
    "sort-family": "Famille",
    "sort-name": "Nom",
    "sort-style": "Style",
    "font-count": "Total {count} polices",
    "status-unsupported": "Votre navigateur ne prend pas en charge Local Font Access.",
    "status-denied": "Autorisation refusée. Autorisez local-fonts pour lister les polices.",
    "status-blocked": "Accès bloqué par une politique de permissions ou un contexte non sécurisé.",
    "status-error": "Impossible de charger les polices. Réessayez."
  },
  "de": {
    "library-title": "Schriftbibliothek",
    "filter-style-all": "Alle Stile",
    "filter-style-regular": "Normal",
    "filter-style-italic": "Kursiv/Schräg",
    "sort-family": "Familie",
    "sort-name": "Name",
    "sort-style": "Stil",
    "font-count": "Insgesamt {count} Schriften",
    "status-unsupported": "Ihr Browser unterstützt Local Font Access nicht.",
    "status-denied": "Berechtigung verweigert. Erlauben Sie local-fonts, um Schriften zu listen.",
    "status-blocked": "Zugriff durch Berechtigungsrichtlinie oder unsicheren Kontext blockiert.",
    "status-error": "Schriften konnten nicht geladen werden. Versuchen Sie es erneut."
  },
  "it": {
    "library-title": "Libreria di font",
    "filter-style-all": "Tutti gli stili",
    "filter-style-regular": "Regolare",
    "filter-style-italic": "Corsivo/Obliquo",
    "sort-family": "Famiglia",
    "sort-name": "Nome",
    "sort-style": "Stile",
    "font-count": "Totale {count} font",
    "status-unsupported": "Il tuo browser non supporta Local Font Access.",
    "status-denied": "Permesso negato. Consenti local-fonts per elencare i font.",
    "status-blocked": "Accesso bloccato da policy o contesto non sicuro.",
    "status-error": "Impossibile caricare i font. Riprova."
  },
  "ja": {
    "library-title": "フォントライブラリ",
    "filter-style-all": "すべてのスタイル",
    "filter-style-regular": "標準",
    "filter-style-italic": "イタリック/オブリーク",
    "sort-family": "ファミリー",
    "sort-name": "名称",
    "sort-style": "スタイル",
    "font-count": "合計 {count} フォント",
    "status-unsupported": "このブラウザーは Local Font Access に対応していません。",
    "status-denied": "権限が拒否されました。local-fonts を許可してください。",
    "status-blocked": "権限ポリシーまたは非安全コンテキストによりブロックされています。",
    "status-error": "フォントを読み込めませんでした。再試行してください。"
  },
  "ko": {
    "library-title": "폰트 라이브러리",
    "filter-style-all": "모든 스타일",
    "filter-style-regular": "일반",
    "filter-style-italic": "이탤릭/오블리크",
    "sort-family": "패밀리",
    "sort-name": "이름",
    "sort-style": "스타일",
    "font-count": "총 {count}개 폰트",
    "status-unsupported": "이 브라우저는 Local Font Access를 지원하지 않습니다.",
    "status-denied": "권한이 거부되었습니다. local-fonts 권한을 허용하세요.",
    "status-blocked": "권한 정책 또는 비보안 컨텍스트로 인해 차단되었습니다.",
    "status-error": "폰트를 불러올 수 없습니다. 다시 시도하세요."
  },
  "ru": {
    "library-title": "Библиотека шрифтов",
    "filter-style-all": "Все стили",
    "filter-style-regular": "Обычный",
    "filter-style-italic": "Курсив/наклон",
    "sort-family": "Семейство",
    "sort-name": "Название",
    "sort-style": "Стиль",
    "font-count": "Всего {count} шрифтов",
    "status-unsupported": "Ваш браузер не поддерживает Local Font Access.",
    "status-denied": "Доступ запрещён. Разрешите local-fonts для списка шрифтов.",
    "status-blocked": "Доступ заблокирован политикой разрешений или небезопасным контекстом.",
    "status-error": "Не удалось загрузить шрифты. Повторите попытку."
  },
  "pt": {
    "library-title": "Biblioteca de fontes",
    "filter-style-all": "Todos os estilos",
    "filter-style-regular": "Regular",
    "filter-style-italic": "Itálico/Oblíquo",
    "sort-family": "Família",
    "sort-name": "Nome",
    "sort-style": "Estilo",
    "font-count": "Total {count} fontes",
    "status-unsupported": "Seu navegador não oferece suporte ao Local Font Access.",
    "status-denied": "Permissão negada. Permita local-fonts para listar fontes.",
    "status-blocked": "Acesso bloqueado por política de permissões ou contexto inseguro.",
    "status-error": "Não foi possível carregar as fontes. Tente novamente."
  },
  "ar": {
    "library-title": "مكتبة الخطوط",
    "filter-style-all": "كل الأنماط",
    "filter-style-regular": "عادي",
    "filter-style-italic": "مائل/مائل مائل",
    "sort-family": "العائلة",
    "sort-name": "الاسم",
    "sort-style": "النمط",
    "font-count": "الإجمالي {count} خط",
    "status-unsupported": "متصفحك لا يدعم Local Font Access.",
    "status-denied": "تم رفض الإذن. اسمح لـ local-fonts لعرض الخطوط.",
    "status-blocked": "تم حظر الوصول بسبب سياسة الأذونات أو سياق غير آمن.",
    "status-error": "تعذر تحميل الخطوط. حاول مرة أخرى."
  },
  "hi": {
    "library-title": "फ़ॉन्ट लाइब्रेरी",
    "filter-style-all": "सभी स्टाइल",
    "filter-style-regular": "रेगुलर",
    "filter-style-italic": "इटैलिक/ओब्लिक",
    "sort-family": "फ़ैमिली",
    "sort-name": "नाम",
    "sort-style": "स्टाइल",
    "font-count": "कुल {count} फ़ॉन्ट",
    "status-unsupported": "आपका ब्राउज़र Local Font Access को सपोर्ट नहीं करता।",
    "status-denied": "अनुमति अस्वीकृत। local-fonts की अनुमति दें।",
    "status-blocked": "अनुमति नीति या असुरक्षित संदर्भ से एक्सेस ब्लॉक है।",
    "status-error": "फ़ॉन्ट लोड नहीं हो पाए। फिर से प्रयास करें।"
  },
  "tr": {
    "library-title": "Yazı tipi kitaplığı",
    "filter-style-all": "Tüm stiller",
    "filter-style-regular": "Normal",
    "filter-style-italic": "İtalik/Oblik",
    "sort-family": "Aile",
    "sort-name": "Ad",
    "sort-style": "Stil",
    "font-count": "Toplam {count} yazı tipi",
    "status-unsupported": "Tarayıcınız Local Font Access'i desteklemiyor.",
    "status-denied": "İzin reddedildi. Yazı tiplerini listelemek için local-fonts izni verin.",
    "status-blocked": "Erişim, izin politikası veya güvensiz bağlam nedeniyle engellendi.",
    "status-error": "Yazı tipleri yüklenemedi. Tekrar deneyin."
  },
  "nl": {
    "library-title": "Lettertypebibliotheek",
    "filter-style-all": "Alle stijlen",
    "filter-style-regular": "Normaal",
    "filter-style-italic": "Cursief/Schuin",
    "sort-family": "Familie",
    "sort-name": "Naam",
    "sort-style": "Stijl",
    "font-count": "Totaal {count} lettertypen",
    "status-unsupported": "Je browser ondersteunt Local Font Access niet.",
    "status-denied": "Toestemming geweigerd. Sta local-fonts toe om lettertypen te tonen.",
    "status-blocked": "Toegang geblokkeerd door permissions policy of onveilige context.",
    "status-error": "Kan lettertypen niet laden. Probeer opnieuw."
  },
  "sv": {
    "library-title": "Typsnittsbibliotek",
    "filter-style-all": "Alla stilar",
    "filter-style-regular": "Normal",
    "filter-style-italic": "Kursiv/Oblik",
    "sort-family": "Familj",
    "sort-name": "Namn",
    "sort-style": "Stil",
    "font-count": "Totalt {count} typsnitt",
    "status-unsupported": "Din webbläsare stöder inte Local Font Access.",
    "status-denied": "Åtkomst nekad. Tillåt local-fonts för att lista typsnitt.",
    "status-blocked": "Åtkomst blockerad av policy eller osäker kontext.",
    "status-error": "Kunde inte ladda typsnitt. Försök igen."
  },
  "pl": {
    "library-title": "Biblioteka fontów",
    "filter-style-all": "Wszystkie style",
    "filter-style-regular": "Regular",
    "filter-style-italic": "Kursywa/pochylony",
    "sort-family": "Rodzina",
    "sort-name": "Nazwa",
    "sort-style": "Styl",
    "font-count": "Łącznie {count} fontów",
    "status-unsupported": "Twoja przeglądarka nie obsługuje Local Font Access.",
    "status-denied": "Odmowa dostępu. Zezwól local-fonts, aby wyświetlać fonty.",
    "status-blocked": "Dostęp zablokowany przez politykę uprawnień lub niezabezpieczony kontekst.",
    "status-error": "Nie udało się wczytać fontów. Spróbuj ponownie."
  },
  "vi": {
    "library-title": "Thư viện phông chữ",
    "filter-style-all": "Tất cả kiểu",
    "filter-style-regular": "Thường",
    "filter-style-italic": "Nghiêng/Oblique",
    "sort-family": "Họ",
    "sort-name": "Tên",
    "sort-style": "Kiểu",
    "font-count": "Tổng cộng {count} phông chữ",
    "status-unsupported": "Trình duyệt của bạn không hỗ trợ Local Font Access.",
    "status-denied": "Đã từ chối quyền. Hãy cho phép local-fonts để liệt kê phông chữ.",
    "status-blocked": "Bị chặn bởi chính sách quyền hoặc ngữ cảnh không an toàn.",
    "status-error": "Không thể tải phông chữ. Hãy thử lại."
  },
  "th": {
    "library-title": "คลังฟอนต์",
    "filter-style-all": "ทุกสไตล์",
    "filter-style-regular": "ปกติ",
    "filter-style-italic": "ตัวเอียง/เอียง",
    "sort-family": "ตระกูล",
    "sort-name": "ชื่อ",
    "sort-style": "สไตล์",
    "font-count": "ทั้งหมด {count} ฟอนต์",
    "status-unsupported": "เบราว์เซอร์ของคุณไม่รองรับ Local Font Access",
    "status-denied": "ปฏิเสธสิทธิ์ กรุณาอนุญาต local-fonts เพื่อแสดงฟอนต์",
    "status-blocked": "ถูกบล็อกด้วยนโยบายสิทธิ์หรือบริบทไม่ปลอดภัย",
    "status-error": "ไม่สามารถโหลดฟอนต์ได้ ลองอีกครั้ง"
  },
  "id": {
    "library-title": "Pustaka font",
    "filter-style-all": "Semua gaya",
    "filter-style-regular": "Reguler",
    "filter-style-italic": "Miring/Oblique",
    "sort-family": "Keluarga",
    "sort-name": "Nama",
    "sort-style": "Gaya",
    "font-count": "Total {count} font",
    "status-unsupported": "Browser Anda tidak mendukung Local Font Access.",
    "status-denied": "Izin ditolak. Izinkan local-fonts untuk menampilkan font.",
    "status-blocked": "Akses diblokir oleh kebijakan izin atau konteks tidak aman.",
    "status-error": "Tidak dapat memuat font. Coba lagi."
  },
  "he": {
    "library-title": "ספריית גופנים",
    "filter-style-all": "כל הסגנונות",
    "filter-style-regular": "רגיל",
    "filter-style-italic": "נטוי/אלכסוני",
    "sort-family": "משפחה",
    "sort-name": "שם",
    "sort-style": "סגנון",
    "font-count": "סה\"כ {count} גופנים",
    "status-unsupported": "הדפדפן שלך אינו תומך ב-Local Font Access.",
    "status-denied": "ההרשאה נדחתה. אפשר local-fonts להצגת גופנים.",
    "status-blocked": "הגישה נחסמה על ידי מדיניות הרשאות או הקשר לא מאובטח.",
    "status-error": "לא ניתן לטעון גופנים. נסה שוב."
  },
  "ms": {
    "library-title": "Perpustakaan fon",
    "filter-style-all": "Semua gaya",
    "filter-style-regular": "Biasa",
    "filter-style-italic": "Italik/Oblik",
    "sort-family": "Keluarga",
    "sort-name": "Nama",
    "sort-style": "Gaya",
    "font-count": "Jumlah {count} fon",
    "status-unsupported": "Pelayar anda tidak menyokong Local Font Access.",
    "status-denied": "Kebenaran ditolak. Benarkan local-fonts untuk senarai fon.",
    "status-blocked": "Akses disekat oleh polisi kebenaran atau konteks tidak selamat.",
    "status-error": "Tidak dapat memuat fon. Cuba lagi."
  },
  "no": {
    "library-title": "Fontbibliotek",
    "filter-style-all": "Alle stiler",
    "filter-style-regular": "Normal",
    "filter-style-italic": "Kursiv/Oblik",
    "sort-family": "Familie",
    "sort-name": "Navn",
    "sort-style": "Stil",
    "font-count": "Totalt {count} fonter",
    "status-unsupported": "Nettleseren din støtter ikke Local Font Access.",
    "status-denied": "Tillatelse avslått. Tillat local-fonts for å liste fonter.",
    "status-blocked": "Tilgang blokkert av tillatelsespolicy eller usikker kontekst.",
    "status-error": "Kunne ikke laste fonter. Prøv igjen."
  }
}
</i18n>
