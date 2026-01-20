<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <n-button text>
        <template #icon>
          <n-icon>
            <Warning16Regular />
          </n-icon>
        </template>
        {{ t('title') }}
      </n-button>
    </template>
    {{ t('description') }}
  </n-tooltip>
</template>

<script setup lang="ts">
import { NButton, NTooltip, NIcon } from 'naive-ui'
import Warning16Regular from '@vicons/fluent/Warning16Regular'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "Dark Theme SVG Icon Limitation",
    "description": "Due to the limitation of the browser, the SVG icon of the browser tab in dark theme may not be displayed correctly."
  },
  "zh": {
    "title": "深色主题 SVG 图标限制",
    "description": "由于浏览器的限制，深色主题下的浏览器标签页 SVG 图标可能无法正确显示。"
  },
  "zh-CN": {
    "title": "深色主题 SVG 图标限制",
    "description": "由于浏览器的限制，深色主题下的浏览器标签页 SVG 图标可能无法正确显示。"
  },
  "zh-TW": {
    "title": "深色主題 SVG 圖標限制",
    "description": "由於瀏覽器的限制，深色主題下的瀏覽器標籤頁 SVG 圖標可能無法正確顯示。"
  },
  "zh-HK": {
    "title": "深色主題 SVG 圖標限制",
    "description": "由於瀏覽器的限制，深色主題下的瀏覽器標籤頁 SVG 圖標可能無法正確顯示。"
  },
  "es": {
    "title": "Limitación de Iconos SVG en Tema Oscuro",
    "description": "Debido a la limitación del navegador, el icono SVG de la pestaña del navegador en el tema oscuro puede no mostrarse correctamente."
  },
  "fr": {
    "title": "Limitation des Icônes SVG en Thème Sombre",
    "description": "En raison de la limitation du navigateur, l'icône SVG de l'onglet du navigateur en thème sombre peut ne pas s'afficher correctement."
  },
  "de": {
    "title": "SVG-Icon-Einschränkung im Dunklen Design",
    "description": "Aufgrund der Einschränkung des Browsers wird das SVG-Icon des Browser-Tabs im dunklen Design möglicherweise nicht korrekt angezeigt."
  },
  "it": {
    "title": "Limitazione Icona SVG in Tema Scuro",
    "description": "A causa della limitazione del browser, l'icona SVG della scheda del browser in tema scuro potrebbe non essere visualizzata correttamente."
  },
  "ja": {
    "title": "ダークテーマ SVG アイコンの制限",
    "description": "ブラウザの制限により、ダークテーマでのブラウザタブの SVG アイコンが正しく表示されない場合があります。"
  },
  "ko": {
    "title": "다크 테마 SVG 아이콘 제한",
    "description": "브라우저의 제한으로 인해 다크 테마에서 브라우저 탭의 SVG 아이콘이 올바르게 표시되지 않을 수 있습니다."
  },
  "ru": {
    "title": "Ограничение SVG-иконок в Темной Теме",
    "description": "Из-за ограничений браузера SVG-иконка вкладки браузера в темной теме может отображаться некорректно."
  },
  "pt": {
    "title": "Limitação de Ícone SVG no Tema Escuro",
    "description": "Devido à limitação do navegador, o ícone SVG da aba do navegador no tema escuro pode não ser exibido corretamente."
  },
  "ar": {
    "title": "قيود أيقونة SVG في المظهر الداكن",
    "description": "بسبب قيود المتصفح، قد لا تظهر أيقونة SVG لعلامة التبويب في المظهر الداكن بشكل صحيح."
  },
  "hi": {
    "title": "डार्क थीम SVG आइकन सीमा",
    "description": "ब्राउ़र की सीमा के कारण, डार्क थीम में ब्राउ़र टैब का SVG आइकन सही ढंग से प्रदर्शित नहीं हो सकता है।"
  },
  "tr": {
    "title": "Koyu Tema SVG Simgesi Sınırlaması",
    "description": "Tarayıcının sınırlaması nedeniyle, koyu temada tarayıcı sekmesinin SVG simgesi doğru şekilde görüntülenmeyebilir."
  },
  "nl": {
    "title": "SVG-pictogram Beperking in Donker Thema",
    "description": "Vanwege de beperking van de browser kan het SVG-pictogram van het browsertabblad in het donkere thema mogelijk niet correct worden weergegeven."
  },
  "sv": {
    "title": "SVG-ikonbegränsning i Mörkt Tema",
    "description": "På grund av webbläsarens begränsning kan SVG-ikonen för webbläsarfliken i mörkt tema inte visas korrekt."
  },
  "pl": {
    "title": "Ograniczenie Ikony SVG w Ciemnym Motywie",
    "description": "Ze względu na ograniczenie przeglądarki, ikona SVG karty przeglądarki w ciemnym motywie może nie być wyświetlana poprawnie."
  },
  "vi": {
    "title": "Giới Hạn Biểu Tượng SVG trong Chủ Đề Tối",
    "description": "Do giới hạn của trình duyệt, biểu tượng SVG của tab trình duyệt trong chủ đề tối có thể không hiển thị chính xác."
  },
  "th": {
    "title": "ข้อจำกัดไอคอน SVG ในธีมมืด",
    "description": "เนื่องจากข้อจำกัดของเบราว์เซอร์ ไอคอน SVG ของแท็บเบราว์เซอร์ในธีมมืดอาจแสดงผลไม่ถูกต้อง"
  },
  "id": {
    "title": "Batasan Ikon SVG dalam Tema Gelap",
    "description": "Karena keterbatasan browser, ikon SVG tab browser dalam tema gelap mungkin tidak ditampilkan dengan benar."
  },
  "he": {
    "title": "הגבלת סמל SVG בערכת נושא כהה",
    "description": "בגלל מגבלת הדפדפן, סמל ה-SVG של לשונית הדפדפן בערכת נושא כהה עשוי לא להיות מוצג כראוי."
  },
  "ms": {
    "title": "Had Ikon SVG dalam Tema Gelap",
    "description": "Disebabkan oleh had pelayar, ikon SVG tab pelayar dalam tema gelap mungkin tidak dipaparkan dengan betul."
  },
  "no": {
    "title": "SVG-ikonbegrensning i Mørkt Tema",
    "description": "På grunn av nettleserens begrensning kan SVG-ikonet til nettleserfanen i mørkt tema ikke vises riktig."
  }
}
</i18n>
