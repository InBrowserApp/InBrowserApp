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
</template>

<script setup lang="ts">
import { NIcon } from 'naive-ui'
import Info16Regular from '@vicons/fluent/Info16Regular'
import BookInformation20Regular from '@vicons/fluent/BookInformation20Regular'
import { useI18n } from 'vue-i18n'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'

const { t } = useI18n({ useScope: 'local' })
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
    "manifestReference": "Check out Web app manifests reference for more information."
  },
  "zh": {
    "title": "基本信息",
    "manifestReference": "查看 Web 应用清单参考以获取更多信息。"
  },
  "zh-CN": {
    "title": "基本信息",
    "manifestReference": "查看 Web 应用清单参考以获取更多信息。"
  },
  "zh-TW": {
    "title": "基本資訊",
    "manifestReference": "查看 Web 應用清單參考以獲取更多資訊。"
  },
  "zh-HK": {
    "title": "基本資訊",
    "manifestReference": "查看 Web 應用清單參考以獲取更多資訊。"
  },
  "es": {
    "title": "Información General",
    "manifestReference": "Consulta la referencia de manifiestos de aplicaciones web para más información."
  },
  "fr": {
    "title": "Informations Générales",
    "manifestReference": "Consultez la référence des manifestes d'applications web pour plus d'informations."
  },
  "de": {
    "title": "Allgemeine Informationen",
    "manifestReference": "Lesen Sie die Web-App-Manifest-Referenz für weitere Informationen."
  },
  "it": {
    "title": "Informazioni Generali",
    "manifestReference": "Consulta il riferimento dei manifesti delle app web per maggiori informazioni."
  },
  "ja": {
    "title": "一般情報",
    "manifestReference": "Web アプリマニフェストのリファレンスを確認して詳細情報を入手してください。"
  },
  "ko": {
    "title": "일반 정보",
    "manifestReference": "웹 앱 매니페스트 참조를 확인하여 자세한 정보를 얻으세요."
  },
  "ru": {
    "title": "Общая Информация",
    "manifestReference": "Ознакомьтесь со справочником манифестов веб-приложений для получения дополнительной информации."
  },
  "pt": {
    "title": "Informações Gerais",
    "manifestReference": "Consulte a referência de manifestos de aplicativos web para mais informações."
  },
  "ar": {
    "title": "معلومات عامة",
    "manifestReference": "راجع مرجع بيان تطبيقات الويب لمزيد من المعلومات."
  },
  "hi": {
    "title": "सामान्य जानकारी",
    "manifestReference": "अधिक जानकारी के लिए वेब ऐप मैनिफेस्ट संदर्भ देखें।"
  },
  "tr": {
    "title": "Genel Bilgi",
    "manifestReference": "Daha fazla bilgi için Web uygulaması manifest referansını kontrol edin."
  },
  "nl": {
    "title": "Algemene Informatie",
    "manifestReference": "Bekijk de Web-app-manifest referentie voor meer informatie."
  },
  "sv": {
    "title": "Allmän Information",
    "manifestReference": "Kolla in Web-app-manifest referensen för mer information."
  },
  "pl": {
    "title": "Informacje Ogólne",
    "manifestReference": "Sprawdź referencję manifestów aplikacji webowych, aby uzyskać więcej informacji."
  },
  "vi": {
    "title": "Thông Tin Chung",
    "manifestReference": "Xem tài liệu tham khảo về manifest ứng dụng web để biết thêm thông tin."
  },
  "th": {
    "title": "ข้อมูลทั่วไป",
    "manifestReference": "ดูข้อมูลอ้างอิง manifest ของแอปพลิเคชันเว็บสำหรับข้อมูลเพิ่มเติม"
  },
  "id": {
    "title": "Informasi Umum",
    "manifestReference": "Lihat referensi manifest aplikasi web untuk informasi lebih lanjut."
  },
  "he": {
    "title": "מידע כללי",
    "manifestReference": "עיין במסמך הייחוס של מניפסט אפליקציית האינטרנט למידע נוסף."
  },
  "ms": {
    "title": "Maklumat Umum",
    "manifestReference": "Lihat rujukan manifest aplikasi web untuk maklumat lanjut."
  },
  "no": {
    "title": "Generell Informasjon",
    "manifestReference": "Se Web-app-manifest referansen for mer informasjon."
  }
}
</i18n>
