<template>
  <ToolSection>
    <ToolSectionHeader level="2">{{ t('screen-info') }}</ToolSectionHeader>

    <InfosGrid>
      <!-- Screen Information -->
      <ScreenResolution />
      <AvailableResolution />
      <WindowSize />
      <ViewportSize />
      <ColorDepth />
      <DevicePixelRatio />
      <ScreenOrientation />
      <FpsInfo />
      <MultipleScreens />
    </InfosGrid>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import InfosGrid from '../common/InfosGrid.vue'

// Screen Components
import ScreenResolution from '../screen/ScreenResolution.vue'
import AvailableResolution from '../screen/AvailableResolution.vue'
import WindowSize from '../screen/WindowSize.vue'
import ViewportSize from '../screen/ViewportSize.vue'
import ColorDepth from '../screen/ColorDepth.vue'
import DevicePixelRatio from '../screen/DevicePixelRatio.vue'
import ScreenOrientation from '../screen/ScreenOrientation.vue'
import FpsInfo from '../screen/FpsInfo.vue'
import MultipleScreens from '../screen/MultipleScreens.vue'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "screen-info": "Screen Information"
  },
  "zh": {
    "screen-info": "屏幕信息"
  },
  "zh-CN": {
    "screen-info": "屏幕信息"
  },
  "zh-TW": {
    "screen-info": "螢幕資訊"
  },
  "zh-HK": {
    "screen-info": "螢幕資訊"
  },
  "es": {
    "screen-info": "Información de Pantalla"
  },
  "fr": {
    "screen-info": "Informations sur l'Écran"
  },
  "de": {
    "screen-info": "Bildschirminformationen"
  },
  "it": {
    "screen-info": "Informazioni sullo Schermo"
  },
  "ja": {
    "screen-info": "画面情報"
  },
  "ko": {
    "screen-info": "화면 정보"
  },
  "ru": {
    "screen-info": "Информация об экране"
  },
  "pt": {
    "screen-info": "Informações da Tela"
  },
  "ar": {
    "screen-info": "معلومات الشاشة"
  },
  "hi": {
    "screen-info": "स्क्रीन जानकारी"
  },
  "tr": {
    "screen-info": "Ekran Bilgileri"
  },
  "nl": {
    "screen-info": "Scherminformatie"
  },
  "sv": {
    "screen-info": "Skärminformation"
  },
  "pl": {
    "screen-info": "Informacje o ekranie"
  },
  "vi": {
    "screen-info": "Thông tin màn hình"
  },
  "th": {
    "screen-info": "ข้อมูลหน้าจอ"
  },
  "id": {
    "screen-info": "Informasi Layar"
  },
  "he": {
    "screen-info": "מידע על המסך"
  },
  "ms": {
    "screen-info": "Maklumat Skrin"
  },
  "no": {
    "screen-info": "Skjerminformasjon"
  }
}
</i18n>
