<template>
  <ToolSection>
    <ToolSectionHeader level="2">{{ t('browser-info') }}</ToolSectionHeader>

    <InfosGrid>
      <!-- Browser Information -->
      <BrowserName />
      <PrimaryLanguage />
      <BrowserLanguages />
      <Architecture />
      <PlatformInfo />
      <TimezoneInfo />
      <CookieEnabled />
      <UserAgent />
    </InfosGrid>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import InfosGrid from '../common/InfosGrid.vue'

// Browser Components
import BrowserName from '../browser/BrowserName.vue'
import PrimaryLanguage from '../browser/PrimaryLanguage.vue'
import BrowserLanguages from '../browser/BrowserLanguages.vue'
import Architecture from '../browser/ArchitectureInfo.vue'
import PlatformInfo from '../browser/PlatformInfo.vue'
import TimezoneInfo from '../browser/TimezoneInfo.vue'
import CookieEnabled from '../browser/CookieEnabled.vue'
import UserAgent from '../browser/UserAgent.vue'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "browser-info": "Browser Information"
  },
  "zh": {
    "browser-info": "浏览器信息"
  },
  "zh-CN": {
    "browser-info": "浏览器信息"
  },
  "zh-TW": {
    "browser-info": "瀏覽器資訊"
  },
  "zh-HK": {
    "browser-info": "瀏覽器資訊"
  },
  "es": {
    "browser-info": "Información del Navegador"
  },
  "fr": {
    "browser-info": "Informations sur le Navigateur"
  },
  "de": {
    "browser-info": "Browser-Informationen"
  },
  "it": {
    "browser-info": "Informazioni sul Browser"
  },
  "ja": {
    "browser-info": "ブラウザ情報"
  },
  "ko": {
    "browser-info": "브라우저 정보"
  },
  "ru": {
    "browser-info": "Информация о браузере"
  },
  "pt": {
    "browser-info": "Informações do Navegador"
  },
  "ar": {
    "browser-info": "معلومات المتصفح"
  },
  "hi": {
    "browser-info": "ब्राउज़र जानकारी"
  },
  "tr": {
    "browser-info": "Tarayıcı Bilgileri"
  },
  "nl": {
    "browser-info": "Browserinformatie"
  },
  "sv": {
    "browser-info": "Webbläsarinformation"
  },
  "pl": {
    "browser-info": "Informacje o przeglądarce"
  },
  "vi": {
    "browser-info": "Thông tin trình duyệt"
  },
  "th": {
    "browser-info": "ข้อมูลเบราว์เซอร์"
  },
  "id": {
    "browser-info": "Informasi Browser"
  },
  "he": {
    "browser-info": "מידע על הדפדפן"
  },
  "ms": {
    "browser-info": "Maklumat Pelayar"
  },
  "no": {
    "browser-info": "Nettleserinformasjon"
  }
}
</i18n>
