<template>
  <ToolSectionHeader>
    <n-icon :component="Info16Regular" style="vertical-align: -0.15em" />
    {{ t('title') }}
  </ToolSectionHeader>
  <ToolSection>
    <a href="https://developer.mozilla.org/en-US/docs/Web/Manifest" target="_blank" class="link">
      <n-icon :component="BookInformation20Regular" style="vertical-align: -0.15em" size="1.2em" />
      {{ t('manifestReference') }}
    </a>
  </ToolSection>
  <n-grid x-gap="30" :cols="4">
    <n-grid-item :span="2">
      <n-form-item :label="t('appName')">
        <n-input v-model:value="options.name" />
      </n-form-item>
    </n-grid-item>
    <n-grid-item :span="2">
      <n-form-item :label="t('shortName')">
        <n-input v-model:value="options.short_name" />
      </n-form-item>
    </n-grid-item>
    <n-grid-item :span="4">
      <n-form-item :label="t('description')">
        <n-input v-model:value="options.description" />
      </n-form-item>
    </n-grid-item>
    <n-grid-item :span="2">
      <n-form-item :label="t('themeColor')">
        <n-color-picker
          :show-alpha="false"
          :show-preview="true"
          v-model:value="options.theme_color"
        />
      </n-form-item>
    </n-grid-item>
    <n-grid-item :span="2">
      <n-form-item>
        <template #label>
          {{ t('themeColorDark') }}
          <n-button
            tag="a"
            href="https://css-tricks.com/meta-theme-color-and-trickery/"
            target="_blank"
            text
            style="vertical-align: -0.2em"
          >
            <template #icon>
              <n-icon :component="Info16Regular" />
            </template>
          </n-button>
        </template>

        <n-checkbox
          v-model:checked="options.theme_color_dark_enabled"
          style="margin-right: 0.7em"
        />
        <span v-show="!options.theme_color_dark_enabled">{{ t('disabled') }}</span>
        <n-color-picker
          :show-alpha="false"
          :show-preview="true"
          v-model:value="options.theme_color_dark"
          :disabled="!options.theme_color_dark_enabled"
          v-show="options.theme_color_dark_enabled"
        />
      </n-form-item>
    </n-grid-item>
    <n-grid-item :span="2">
      <n-form-item :label="t('backgroundColor')">
        <n-color-picker
          :show-alpha="false"
          :show-preview="true"
          v-model:value="options.background_color"
        />
      </n-form-item>
    </n-grid-item>

    <n-grid-item :span="2">
      <n-form-item :label="t('startUrl')">
        <n-input v-model:value="options.start_url" />
      </n-form-item>
    </n-grid-item>
    <n-grid-item :span="2">
      <n-form-item :label="t('pathOfIcons')">
        <n-input v-model:value="options.path" />
      </n-form-item>
    </n-grid-item>

    <n-grid-item :span="2">
      <n-form-item :label="t('display')">
        <n-select v-model:value="options.display" :options="displayOptions" />
      </n-form-item>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import {
  NInput,
  NFormItem,
  NGrid,
  NGridItem,
  NColorPicker,
  NSelect,
  NIcon,
  NButton,
  NCheckbox,
} from 'naive-ui'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'
import { useVModel } from '@vueuse/core'
import Info16Regular from '@vicons/fluent/Info16Regular'
import BookInformation20Regular from '@vicons/fluent/BookInformation20Regular'
import { useI18n } from 'vue-i18n'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'

const { t } = useI18n()

const props = defineProps<{
  options: GeneralInfoOptions
}>()

const emit = defineEmits(['update:options'])

const options = useVModel(props, 'options', emit)

const displayOptions = [
  { label: t('displayFullscreen'), value: 'fullscreen' },
  { label: t('displayStandalone'), value: 'standalone' },
  { label: t('displayMinimalUI'), value: 'minimal-ui' },
  { label: t('displayBrowser'), value: 'browser' },
]
</script>

<style scoped>
.link {
  color: inherit;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>

<i18n lang="json">
{
  "en": {
    "title": "General Info",
    "manifestReference": "Check out Web app manifests reference for more information.",
    "appName": "App Name",
    "shortName": "Short Name",
    "description": "Description",
    "themeColor": "Theme Color",
    "themeColorDark": "Theme Color in Dark Mode",
    "disabled": "Disabled",
    "backgroundColor": "Background Color",
    "startUrl": "Start URL",
    "pathOfIcons": "Path of icons",
    "display": "Display",
    "displayFullscreen": "Fullscreen",
    "displayStandalone": "Standalone",
    "displayMinimalUI": "Minimal UI",
    "displayBrowser": "Browser"
  },
  "zh": {
    "title": "基本信息",
    "manifestReference": "查看 Web 应用清单参考以获取更多信息。",
    "appName": "应用名称",
    "shortName": "短名称",
    "description": "描述",
    "themeColor": "主题颜色",
    "themeColorDark": "深色模式主题颜色",
    "disabled": "已禁用",
    "backgroundColor": "背景颜色",
    "startUrl": "起始 URL",
    "pathOfIcons": "图标路径",
    "display": "显示方式",
    "displayFullscreen": "全屏",
    "displayStandalone": "独立窗口",
    "displayMinimalUI": "最小化界面",
    "displayBrowser": "浏览器"
  },
  "zh-CN": {
    "title": "基本信息",
    "manifestReference": "查看 Web 应用清单参考以获取更多信息。",
    "appName": "应用名称",
    "shortName": "短名称",
    "description": "描述",
    "themeColor": "主题颜色",
    "themeColorDark": "深色模式主题颜色",
    "disabled": "已禁用",
    "backgroundColor": "背景颜色",
    "startUrl": "起始 URL",
    "pathOfIcons": "图标路径",
    "display": "显示方式",
    "displayFullscreen": "全屏",
    "displayStandalone": "独立窗口",
    "displayMinimalUI": "最小化界面",
    "displayBrowser": "浏览器"
  },
  "zh-TW": {
    "title": "基本資訊",
    "manifestReference": "查看 Web 應用清單參考以獲取更多資訊。",
    "appName": "應用名稱",
    "shortName": "短名稱",
    "description": "描述",
    "themeColor": "主題顏色",
    "themeColorDark": "深色模式主題顏色",
    "disabled": "已禁用",
    "backgroundColor": "背景顏色",
    "startUrl": "起始 URL",
    "pathOfIcons": "圖標路徑",
    "display": "顯示方式",
    "displayFullscreen": "全螢幕",
    "displayStandalone": "獨立視窗",
    "displayMinimalUI": "最小化介面",
    "displayBrowser": "瀏覽器"
  },
  "zh-HK": {
    "title": "基本資訊",
    "manifestReference": "查看 Web 應用清單參考以獲取更多資訊。",
    "appName": "應用名稱",
    "shortName": "短名稱",
    "description": "描述",
    "themeColor": "主題顏色",
    "themeColorDark": "深色模式主題顏色",
    "disabled": "已禁用",
    "backgroundColor": "背景顏色",
    "startUrl": "起始 URL",
    "pathOfIcons": "圖標路徑",
    "display": "顯示方式",
    "displayFullscreen": "全螢幕",
    "displayStandalone": "獨立視窗",
    "displayMinimalUI": "最小化介面",
    "displayBrowser": "瀏覽器"
  },
  "es": {
    "title": "Información General",
    "manifestReference": "Consulta la referencia de manifiestos de aplicaciones web para más información.",
    "appName": "Nombre de la Aplicación",
    "shortName": "Nombre Corto",
    "description": "Descripción",
    "themeColor": "Color del Tema",
    "themeColorDark": "Color del Tema en Modo Oscuro",
    "disabled": "Deshabilitado",
    "backgroundColor": "Color de Fondo",
    "startUrl": "URL de Inicio",
    "pathOfIcons": "Ruta de los Iconos",
    "display": "Visualización",
    "displayFullscreen": "Pantalla Completa",
    "displayStandalone": "Independiente",
    "displayMinimalUI": "Interfaz Mínima",
    "displayBrowser": "Navegador"
  },
  "fr": {
    "title": "Informations Générales",
    "manifestReference": "Consultez la référence des manifestes d'applications web pour plus d'informations.",
    "appName": "Nom de l'Application",
    "shortName": "Nom Court",
    "description": "Description",
    "themeColor": "Couleur du Thème",
    "themeColorDark": "Couleur du Thème en Mode Sombre",
    "disabled": "Désactivé",
    "backgroundColor": "Couleur de Fond",
    "startUrl": "URL de Démarrage",
    "pathOfIcons": "Chemin des Icônes",
    "display": "Affichage",
    "displayFullscreen": "Plein Écran",
    "displayStandalone": "Autonome",
    "displayMinimalUI": "Interface Minimale",
    "displayBrowser": "Navigateur"
  },
  "de": {
    "title": "Allgemeine Informationen",
    "manifestReference": "Lesen Sie die Web-App-Manifest-Referenz für weitere Informationen.",
    "appName": "App-Name",
    "shortName": "Kurzname",
    "description": "Beschreibung",
    "themeColor": "Themenfarbe",
    "themeColorDark": "Themenfarbe im Dunkelmodus",
    "disabled": "Deaktiviert",
    "backgroundColor": "Hintergrundfarbe",
    "startUrl": "Start-URL",
    "pathOfIcons": "Pfad der Icons",
    "display": "Anzeige",
    "displayFullscreen": "Vollbild",
    "displayStandalone": "Eigenständig",
    "displayMinimalUI": "Minimale Benutzeroberfläche",
    "displayBrowser": "Browser"
  },
  "it": {
    "title": "Informazioni Generali",
    "manifestReference": "Consulta il riferimento dei manifesti delle app web per maggiori informazioni.",
    "appName": "Nome dell'App",
    "shortName": "Nome Breve",
    "description": "Descrizione",
    "themeColor": "Colore del Tema",
    "themeColorDark": "Colore del Tema in Modalità Scura",
    "disabled": "Disabilitato",
    "backgroundColor": "Colore di Sfondo",
    "startUrl": "URL di Avvio",
    "pathOfIcons": "Percorso delle Icone",
    "display": "Visualizzazione",
    "displayFullscreen": "Schermo Intero",
    "displayStandalone": "Autonomo",
    "displayMinimalUI": "Interfaccia Minima",
    "displayBrowser": "Browser"
  },
  "ja": {
    "title": "一般情報",
    "manifestReference": "Web アプリマニフェストのリファレンスを確認して詳細情報を入手してください。",
    "appName": "アプリ名",
    "shortName": "短い名前",
    "description": "説明",
    "themeColor": "テーマカラー",
    "themeColorDark": "ダークモードのテーマカラー",
    "disabled": "無効",
    "backgroundColor": "背景色",
    "startUrl": "開始 URL",
    "pathOfIcons": "アイコンのパス",
    "display": "表示",
    "displayFullscreen": "全画面",
    "displayStandalone": "スタンドアロン",
    "displayMinimalUI": "最小 UI",
    "displayBrowser": "ブラウザ"
  },
  "ko": {
    "title": "일반 정보",
    "manifestReference": "웹 앱 매니페스트 참조를 확인하여 자세한 정보를 얻으세요.",
    "appName": "앱 이름",
    "shortName": "짧은 이름",
    "description": "설명",
    "themeColor": "테마 색상",
    "themeColorDark": "다크 모드 테마 색상",
    "disabled": "비활성화됨",
    "backgroundColor": "배경색",
    "startUrl": "시작 URL",
    "pathOfIcons": "아이콘 경로",
    "display": "표시",
    "displayFullscreen": "전체 화면",
    "displayStandalone": "독립 실행",
    "displayMinimalUI": "최소 UI",
    "displayBrowser": "브라우저"
  },
  "ru": {
    "title": "Общая Информация",
    "manifestReference": "Ознакомьтесь со справочником манифестов веб-приложений для получения дополнительной информации.",
    "appName": "Название Приложения",
    "shortName": "Короткое Название",
    "description": "Описание",
    "themeColor": "Цвет Темой",
    "themeColorDark": "Цвет Темой в Темном Режиме",
    "disabled": "Отключено",
    "backgroundColor": "Цвет Фона",
    "startUrl": "Начальный URL",
    "pathOfIcons": "Путь к Иконкам",
    "display": "Отображение",
    "displayFullscreen": "Полноэкранный",
    "displayStandalone": "Автономный",
    "displayMinimalUI": "Минимальный Интерфейс",
    "displayBrowser": "Браузер"
  },
  "pt": {
    "title": "Informações Gerais",
    "manifestReference": "Consulte a referência de manifestos de aplicativos web para mais informações.",
    "appName": "Nome do Aplicativo",
    "shortName": "Nome Curto",
    "description": "Descrição",
    "themeColor": "Cor do Tema",
    "themeColorDark": "Cor do Tema no Modo Escuro",
    "disabled": "Desativado",
    "backgroundColor": "Cor de Fundo",
    "startUrl": "URL de Início",
    "pathOfIcons": "Caminho dos Ícones",
    "display": "Exibição",
    "displayFullscreen": "Tela Cheia",
    "displayStandalone": "Independente",
    "displayMinimalUI": "Interface Mínima",
    "displayBrowser": "Navegador"
  },
  "ar": {
    "title": "معلومات عامة",
    "manifestReference": "راجع مرجع بيان تطبيقات الويب لمزيد من المعلومات.",
    "appName": "اسم التطبيق",
    "shortName": "الاسم المختصر",
    "description": "الوصف",
    "themeColor": "لون السمة",
    "themeColorDark": "لون السمة في الوضع الداكن",
    "disabled": "معطل",
    "backgroundColor": "لون الخلفية",
    "startUrl": "رابط البداية",
    "pathOfIcons": "مسار الأيقونات",
    "display": "العرض",
    "displayFullscreen": "ملء الشاشة",
    "displayStandalone": "مستقل",
    "displayMinimalUI": "واجهة مستخدم بسيطة",
    "displayBrowser": "المتصفح"
  },
  "hi": {
    "title": "सामान्य जानकारी",
    "manifestReference": "अधिक जानकारी के लिए वेब ऐप मैनिफेस्ट संदर्भ देखें।",
    "appName": "ऐप का नाम",
    "shortName": "संक्षिप्त नाम",
    "description": "विवरण",
    "themeColor": "थीम का रंग",
    "themeColorDark": "डार्क मोड में थीम का रंग",
    "disabled": "अक्षम",
    "backgroundColor": "पृष्ठभूमि का रंग",
    "startUrl": "प्रारंभ URL",
    "pathOfIcons": "आइकन का पथ",
    "display": "प्रदर्शन",
    "displayFullscreen": "पूर्ण स्क्रीन",
    "displayStandalone": "स्टैंडअलोन",
    "displayMinimalUI": "न्यूनतम UI",
    "displayBrowser": "ब्राउज़र"
  },
  "tr": {
    "title": "Genel Bilgi",
    "manifestReference": "Daha fazla bilgi için Web uygulaması manifest referansını kontrol edin.",
    "appName": "Uygulama Adı",
    "shortName": "Kısa Ad",
    "description": "Açıklama",
    "themeColor": "Tema Rengi",
    "themeColorDark": "Karanlık Modda Tema Rengi",
    "disabled": "Devre Dışı",
    "backgroundColor": "Arka Plan Rengi",
    "startUrl": "Başlangıç URL'si",
    "pathOfIcons": "Simgelerin Yolu",
    "display": "Görüntüleme",
    "displayFullscreen": "Tam Ekran",
    "displayStandalone": "Bağımsız",
    "displayMinimalUI": "Minimal Arayüz",
    "displayBrowser": "Tarayıcı"
  },
  "nl": {
    "title": "Algemene Informatie",
    "manifestReference": "Bekijk de Web-app-manifest referentie voor meer informatie.",
    "appName": "App-naam",
    "shortName": "Korte Naam",
    "description": "Beschrijving",
    "themeColor": "Themakleur",
    "themeColorDark": "Themakleur in Donkere Modus",
    "disabled": "Uitgeschakeld",
    "backgroundColor": "Achtergrondkleur",
    "startUrl": "Start-URL",
    "pathOfIcons": "Pad van Iconen",
    "display": "Weergave",
    "displayFullscreen": "Volledig Scherm",
    "displayStandalone": "Zelfstandig",
    "displayMinimalUI": "Minimale Interface",
    "displayBrowser": "Browser"
  },
  "sv": {
    "title": "Allmän Information",
    "manifestReference": "Kolla in Web-app-manifest referensen för mer information.",
    "appName": "App-namn",
    "shortName": "Kortnamn",
    "description": "Beskrivning",
    "themeColor": "Temafärg",
    "themeColorDark": "Temafärg i Mörkt Läge",
    "disabled": "Inaktiverad",
    "backgroundColor": "Bakgrundsfärg",
    "startUrl": "Start-URL",
    "pathOfIcons": "Sökväg för Ikoner",
    "display": "Visning",
    "displayFullscreen": "Fullskärm",
    "displayStandalone": "Fristående",
    "displayMinimalUI": "Minimal Gränssnitt",
    "displayBrowser": "Webbläsare"
  },
  "pl": {
    "title": "Informacje Ogólne",
    "manifestReference": "Sprawdź referencję manifestów aplikacji webowych, aby uzyskać więcej informacji.",
    "appName": "Nazwa Aplikacji",
    "shortName": "Krótka Nazwa",
    "description": "Opis",
    "themeColor": "Kolor Motywu",
    "themeColorDark": "Kolor Motywu w Trybie Ciemnym",
    "disabled": "Wyłączone",
    "backgroundColor": "Kolor Tła",
    "startUrl": "URL Startowy",
    "pathOfIcons": "Ścieżka do Ikon",
    "display": "Wyświetlanie",
    "displayFullscreen": "Pełny Ekran",
    "displayStandalone": "Samodzielny",
    "displayMinimalUI": "Minimalny Interfejs",
    "displayBrowser": "Przeglądarka"
  },
  "vi": {
    "title": "Thông Tin Chung",
    "manifestReference": "Xem tài liệu tham khảo về manifest ứng dụng web để biết thêm thông tin.",
    "appName": "Tên Ứng dụng",
    "shortName": "Tên Ngắn",
    "description": "Mô tả",
    "themeColor": "Màu Chủ đề",
    "themeColorDark": "Màu Chủ đề trong Chế độ Tối",
    "disabled": "Đã Tắt",
    "backgroundColor": "Màu Nền",
    "startUrl": "URL Khởi động",
    "pathOfIcons": "Đường dẫn Biểu tượng",
    "display": "Hiển thị",
    "displayFullscreen": "Toàn màn hình",
    "displayStandalone": "Độc lập",
    "displayMinimalUI": "Giao diện Tối thiểu",
    "displayBrowser": "Trình duyệt"
  },
  "th": {
    "title": "ข้อมูลทั่วไป",
    "manifestReference": "ดูข้อมูลอ้างอิง manifest ของแอปพลิเคชันเว็บสำหรับข้อมูลเพิ่มเติม",
    "appName": "ชื่อแอป",
    "shortName": "ชื่อย่อ",
    "description": "คำอธิบาย",
    "themeColor": "สีธีม",
    "themeColorDark": "สีธีมในโหมดมืด",
    "disabled": "ปิดใช้งาน",
    "backgroundColor": "สีพื้นหลัง",
    "startUrl": "URL เริ่มต้น",
    "pathOfIcons": "เส้นทางไอคอน",
    "display": "การแสดงผล",
    "displayFullscreen": "เต็มหน้าจอ",
    "displayStandalone": "แยกอิสระ",
    "displayMinimalUI": "UI ขั้นต่ำ",
    "displayBrowser": "เบราว์เซอร์"
  },
  "id": {
    "title": "Informasi Umum",
    "manifestReference": "Lihat referensi manifest aplikasi web untuk informasi lebih lanjut.",
    "appName": "Nama Aplikasi",
    "shortName": "Nama Pendek",
    "description": "Deskripsi",
    "themeColor": "Warna Tema",
    "themeColorDark": "Warna Tema dalam Mode Gelap",
    "disabled": "Dinonaktifkan",
    "backgroundColor": "Warna Latar Belakang",
    "startUrl": "URL Mulai",
    "pathOfIcons": "Jalur Ikon",
    "display": "Tampilan",
    "displayFullscreen": "Layar Penuh",
    "displayStandalone": "Mandiri",
    "displayMinimalUI": "UI Minimal",
    "displayBrowser": "Browser"
  },
  "he": {
    "title": "מידע כללי",
    "manifestReference": "עיין במסמך הייחוס של מניפסט אפליקציית האינטרנט למידע נוסף.",
    "appName": "שם האפליקציה",
    "shortName": "שם קצר",
    "description": "תיאור",
    "themeColor": "צבע ערכת נושא",
    "themeColorDark": "צבע ערכת נושא במצב כהה",
    "disabled": "מושבת",
    "backgroundColor": "צבע רקע",
    "startUrl": "כתובת URL התחלתית",
    "pathOfIcons": "נתיב הסמלים",
    "display": "תצוגה",
    "displayFullscreen": "מסך מלא",
    "displayStandalone": "עצמאי",
    "displayMinimalUI": "ממשק מינימלי",
    "displayBrowser": "דפדפן"
  },
  "ms": {
    "title": "Maklumat Umum",
    "manifestReference": "Lihat rujukan manifest aplikasi web untuk maklumat lanjut.",
    "appName": "Nama Aplikasi",
    "shortName": "Nama Pendek",
    "description": "Penerangan",
    "themeColor": "Warna Tema",
    "themeColorDark": "Warna Tema dalam Mod Gelap",
    "disabled": "Dinyahaktifkan",
    "backgroundColor": "Warna Latar Belakang",
    "startUrl": "URL Mula",
    "pathOfIcons": "Laluan Ikon",
    "display": "Paparan",
    "displayFullscreen": "Skrin Penuh",
    "displayStandalone": "Berdiri Sendiri",
    "displayMinimalUI": "UI Minimum",
    "displayBrowser": "Pelayar"
  },
  "no": {
    "title": "Generell Informasjon",
    "manifestReference": "Se Web-app-manifest referansen for mer informasjon.",
    "appName": "App-navn",
    "shortName": "Kortnavn",
    "description": "Beskrivelse",
    "themeColor": "Temafarge",
    "themeColorDark": "Temafarge i Mørk Modus",
    "disabled": "Deaktivert",
    "backgroundColor": "Bakgrunnsfarge",
    "startUrl": "Start-URL",
    "pathOfIcons": "Sti til Ikoner",
    "display": "Visning",
    "displayFullscreen": "Fullskjerm",
    "displayStandalone": "Frittstående",
    "displayMinimalUI": "Minimal Grensesnitt",
    "displayBrowser": "Nettleser"
  }
}
</i18n>
