<template>
  <ToolSection>
    <ToolSectionHeader level="2">{{ t('hardware-info') }}</ToolSectionHeader>

    <InfosGrid>
      <!-- CPU Information -->
      <CpuCores />
      <CpuArchitecture />
      <CpuBitness />

      <!-- Memory Information -->
      <DeviceMemory />

      <!-- Storage Information -->
      <StorageQuota />

      <!-- Network Information -->
      <ConnectionType />
      <ConnectionSpeed />

      <!-- Device Information -->
      <MaxTouchPoints />
      <DeviceModel />
      <FormFactor />

      <!-- GPU Information -->
      <GpuVendor />
      <GpuRenderer />
    </InfosGrid>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import InfosGrid from '../common/InfosGrid.vue'

// Hardware Components
import CpuCores from '../hardwares/CpuCores.vue'
import CpuArchitecture from '../hardwares/CpuArchitecture.vue'
import CpuBitness from '../hardwares/CpuBitness.vue'
import DeviceMemory from '../hardwares/DeviceMemory.vue'
import StorageQuota from '../hardwares/StorageQuota.vue'
import GpuVendor from '../hardwares/GpuVendor.vue'
import GpuRenderer from '../hardwares/GpuRenderer.vue'
import ConnectionType from '../hardwares/ConnectionType.vue'
import ConnectionSpeed from '../hardwares/ConnectionSpeed.vue'
import MaxTouchPoints from '../hardwares/MaxTouchPoints.vue'
import DeviceModel from '../hardwares/DeviceModel.vue'
import FormFactor from '../hardwares/FormFactor.vue'
const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "hardware-info": "Hardware Information"
  },
  "zh": {
    "hardware-info": "硬件信息"
  },
  "zh-CN": {
    "hardware-info": "硬件信息"
  },
  "zh-TW": {
    "hardware-info": "硬體資訊"
  },
  "zh-HK": {
    "hardware-info": "硬體資訊"
  },
  "es": {
    "hardware-info": "Información de Hardware"
  },
  "fr": {
    "hardware-info": "Informations sur le Matériel"
  },
  "de": {
    "hardware-info": "Hardware-Informationen"
  },
  "it": {
    "hardware-info": "Informazioni sull'Hardware"
  },
  "ja": {
    "hardware-info": "ハードウェア情報"
  },
  "ko": {
    "hardware-info": "하드웨어 정보"
  },
  "ru": {
    "hardware-info": "Информация об оборудовании"
  },
  "pt": {
    "hardware-info": "Informações de Hardware"
  },
  "ar": {
    "hardware-info": "معلومات الأجهزة"
  },
  "hi": {
    "hardware-info": "हार्डवेयर जानकारी"
  },
  "tr": {
    "hardware-info": "Donanım Bilgileri"
  },
  "nl": {
    "hardware-info": "Hardware-informatie"
  },
  "sv": {
    "hardware-info": "Hårdvaruinformation"
  },
  "pl": {
    "hardware-info": "Informacje o sprzęcie"
  },
  "vi": {
    "hardware-info": "Thông tin phần cứng"
  },
  "th": {
    "hardware-info": "ข้อมูลฮาร์ดแวร์"
  },
  "id": {
    "hardware-info": "Informasi Perangkat Keras"
  },
  "he": {
    "hardware-info": "מידע על החומרה"
  },
  "ms": {
    "hardware-info": "Maklumat Perkakasan"
  },
  "no": {
    "hardware-info": "Maskinvareinformasjon"
  }
}
</i18n>
