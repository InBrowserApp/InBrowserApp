<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('exifData') }}</ToolSectionHeader>

    <n-spin :show="isLoading">
      <n-collapse v-model:expanded-names="expandedCategories" display-directive="show">
        <ExifCategorySection
          v-if="basicInfo && Object.keys(basicInfo).length > 0"
          name="basic"
          :title="t('category.basic')"
          :data="basicInfo"
        />
        <ExifCategorySection
          v-if="cameraInfo && Object.keys(cameraInfo).length > 0"
          name="camera"
          :title="t('category.camera')"
          :data="cameraInfo"
        />
        <ExifCategorySection
          v-if="gpsInfo && Object.keys(gpsInfo).length > 0"
          name="gps"
          :title="t('category.gps')"
          :data="gpsInfo"
        >
          <template #extra>
            <n-flex v-if="gpsCoords" :wrap="false" style="margin-top: 12px">
              <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
              <n-button tag="a" :href="googleMapsUrl" target="_blank" size="small" secondary>
                Google Maps
              </n-button>
              <!-- eslint-enable @intlify/vue-i18n/no-raw-text -->
              <n-button tag="a" :href="amapUrl" target="_blank" size="small" secondary>
                {{ t('amap') }}
              </n-button>
            </n-flex>
          </template>
        </ExifCategorySection>
        <ExifCategorySection
          v-if="advancedInfo && Object.keys(advancedInfo).length > 0"
          name="advanced"
          :title="t('category.advanced')"
          :data="advancedInfo"
        />
      </n-collapse>
    </n-spin>
  </ToolSection>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NCollapse, NSpin, NFlex, NButton } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ExifCategorySection from './ExifCategorySection.vue'
import type { ExifData } from '../ExifViewerView.vue'

const props = defineProps<{
  data: ExifData
  isLoading: boolean
}>()

const { t } = useI18n()

const expandedCategories = ref(['basic', 'camera', 'gps'])

const basicFields = [
  'ImageWidth',
  'ImageHeight',
  'ExifImageWidth',
  'ExifImageHeight',
  'Orientation',
  'XResolution',
  'YResolution',
  'ResolutionUnit',
  'Software',
  'ModifyDate',
  'Artist',
  'Copyright',
  'ColorSpace',
  'BitsPerSample',
  'Compression',
]

const cameraFields = [
  'Make',
  'Model',
  'LensModel',
  'LensMake',
  'LensInfo',
  'ExposureTime',
  'FNumber',
  'ISO',
  'ISOSpeedRatings',
  'FocalLength',
  'FocalLengthIn35mmFormat',
  'Flash',
  'WhiteBalance',
  'MeteringMode',
  'ExposureProgram',
  'ExposureCompensation',
  'ExposureBiasValue',
  'DateTimeOriginal',
  'CreateDate',
  'DateTimeDigitized',
  'ShutterSpeedValue',
  'ApertureValue',
  'MaxApertureValue',
  'SceneCaptureType',
  'DigitalZoomRatio',
  'Contrast',
  'Saturation',
  'Sharpness',
]

const gpsFields = [
  'latitude',
  'longitude',
  'GPSLatitude',
  'GPSLongitude',
  'GPSLatitudeRef',
  'GPSLongitudeRef',
  'GPSAltitude',
  'GPSAltitudeRef',
  'GPSImgDirection',
  'GPSImgDirectionRef',
  'GPSSpeed',
  'GPSSpeedRef',
  'GPSDateStamp',
  'GPSTimeStamp',
]

const basicInfo = computed(() => {
  const result: Record<string, unknown> = {}
  for (const field of basicFields) {
    if (props.data[field] !== undefined) {
      result[field] = props.data[field]
    }
  }
  return result
})

const cameraInfo = computed(() => {
  const result: Record<string, unknown> = {}
  for (const field of cameraFields) {
    if (props.data[field] !== undefined) {
      result[field] = props.data[field]
    }
  }
  return result
})

const gpsInfo = computed(() => {
  const result: Record<string, unknown> = {}
  for (const field of gpsFields) {
    if (props.data[field] !== undefined) {
      result[field] = props.data[field]
    }
  }
  return result
})

const advancedInfo = computed(() => {
  const usedFields = new Set([...basicFields, ...cameraFields, ...gpsFields])
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(props.data)) {
    if (!usedFields.has(key) && value !== undefined) {
      result[key] = value
    }
  }
  return result
})

const gpsCoords = computed(() => {
  const lat = props.data.latitude as number | undefined
  const lng = props.data.longitude as number | undefined
  if (lat !== undefined && lng !== undefined) {
    return { lat, lng }
  }
  return null
})

const googleMapsUrl = computed(() => {
  if (!gpsCoords.value) return ''
  const { lat, lng } = gpsCoords.value
  return `https://www.google.com/maps?q=${lat},${lng}`
})

const amapUrl = computed(() => {
  if (!gpsCoords.value) return ''
  const { lat, lng } = gpsCoords.value
  return `https://uri.amap.com/marker?position=${lng},${lat}`
})
</script>

<i18n lang="json">
{
  "en": {
    "exifData": "EXIF Data",
    "category.basic": "Basic Information",
    "category.camera": "Camera Information",
    "category.gps": "GPS Location",
    "category.advanced": "Advanced Information",
    "amap": "Amap"
  },
  "zh": {
    "exifData": "EXIF 数据",
    "category.basic": "基本信息",
    "category.camera": "相机信息",
    "category.gps": "GPS 位置",
    "category.advanced": "高级信息",
    "amap": "高德地图"
  },
  "zh-CN": {
    "exifData": "EXIF 数据",
    "category.basic": "基本信息",
    "category.camera": "相机信息",
    "category.gps": "GPS 位置",
    "category.advanced": "高级信息",
    "amap": "高德地图"
  },
  "zh-TW": {
    "exifData": "EXIF 資料",
    "category.basic": "基本資訊",
    "category.camera": "相機資訊",
    "category.gps": "GPS 位置",
    "category.advanced": "進階資訊",
    "amap": "高德地圖"
  },
  "zh-HK": {
    "exifData": "EXIF 資料",
    "category.basic": "基本資訊",
    "category.camera": "相機資訊",
    "category.gps": "GPS 位置",
    "category.advanced": "進階資訊",
    "amap": "高德地圖"
  },
  "es": {
    "exifData": "Datos EXIF",
    "category.basic": "Información básica",
    "category.camera": "Información de la cámara",
    "category.gps": "Ubicación GPS",
    "category.advanced": "Información avanzada",
    "amap": "Amap"
  },
  "fr": {
    "exifData": "Données EXIF",
    "category.basic": "Informations de base",
    "category.camera": "Informations de l'appareil photo",
    "category.gps": "Position GPS",
    "category.advanced": "Informations avancées",
    "amap": "Amap"
  },
  "de": {
    "exifData": "EXIF-Daten",
    "category.basic": "Grundinformationen",
    "category.camera": "Kamerainformationen",
    "category.gps": "GPS-Standort",
    "category.advanced": "Erweiterte Informationen",
    "amap": "Amap"
  },
  "it": {
    "exifData": "Dati EXIF",
    "category.basic": "Informazioni di base",
    "category.camera": "Informazioni fotocamera",
    "category.gps": "Posizione GPS",
    "category.advanced": "Informazioni avanzate",
    "amap": "Amap"
  },
  "ja": {
    "exifData": "EXIF データ",
    "category.basic": "基本情報",
    "category.camera": "カメラ情報",
    "category.gps": "GPS 位置",
    "category.advanced": "詳細情報",
    "amap": "高德地図"
  },
  "ko": {
    "exifData": "EXIF 데이터",
    "category.basic": "기본 정보",
    "category.camera": "카메라 정보",
    "category.gps": "GPS 위치",
    "category.advanced": "고급 정보",
    "amap": "Amap"
  },
  "ru": {
    "exifData": "Данные EXIF",
    "category.basic": "Основная информация",
    "category.camera": "Информация о камере",
    "category.gps": "GPS местоположение",
    "category.advanced": "Дополнительная информация",
    "amap": "Amap"
  },
  "pt": {
    "exifData": "Dados EXIF",
    "category.basic": "Informações básicas",
    "category.camera": "Informações da câmera",
    "category.gps": "Localização GPS",
    "category.advanced": "Informações avançadas",
    "amap": "Amap"
  },
  "ar": {
    "exifData": "بيانات EXIF",
    "category.basic": "المعلومات الأساسية",
    "category.camera": "معلومات الكاميرا",
    "category.gps": "موقع GPS",
    "category.advanced": "معلومات متقدمة",
    "amap": "Amap"
  },
  "hi": {
    "exifData": "EXIF डेटा",
    "category.basic": "बुनियादी जानकारी",
    "category.camera": "कैमरा जानकारी",
    "category.gps": "GPS स्थान",
    "category.advanced": "उन्नत जानकारी",
    "amap": "Amap"
  },
  "tr": {
    "exifData": "EXIF Verileri",
    "category.basic": "Temel Bilgiler",
    "category.camera": "Kamera Bilgileri",
    "category.gps": "GPS Konumu",
    "category.advanced": "Gelişmiş Bilgiler",
    "amap": "Amap"
  },
  "nl": {
    "exifData": "EXIF-gegevens",
    "category.basic": "Basisinformatie",
    "category.camera": "Camera-informatie",
    "category.gps": "GPS-locatie",
    "category.advanced": "Geavanceerde informatie",
    "amap": "Amap"
  },
  "sv": {
    "exifData": "EXIF-data",
    "category.basic": "Grundläggande information",
    "category.camera": "Kamerainformation",
    "category.gps": "GPS-plats",
    "category.advanced": "Avancerad information",
    "amap": "Amap"
  },
  "pl": {
    "exifData": "Dane EXIF",
    "category.basic": "Podstawowe informacje",
    "category.camera": "Informacje o aparacie",
    "category.gps": "Lokalizacja GPS",
    "category.advanced": "Zaawansowane informacje",
    "amap": "Amap"
  },
  "vi": {
    "exifData": "Dữ liệu EXIF",
    "category.basic": "Thông tin cơ bản",
    "category.camera": "Thông tin máy ảnh",
    "category.gps": "Vị trí GPS",
    "category.advanced": "Thông tin nâng cao",
    "amap": "Amap"
  },
  "th": {
    "exifData": "ข้อมูล EXIF",
    "category.basic": "ข้อมูลพื้นฐาน",
    "category.camera": "ข้อมูลกล้อง",
    "category.gps": "ตำแหน่ง GPS",
    "category.advanced": "ข้อมูลขั้นสูง",
    "amap": "Amap"
  },
  "id": {
    "exifData": "Data EXIF",
    "category.basic": "Informasi Dasar",
    "category.camera": "Informasi Kamera",
    "category.gps": "Lokasi GPS",
    "category.advanced": "Informasi Lanjutan",
    "amap": "Amap"
  },
  "he": {
    "exifData": "נתוני EXIF",
    "category.basic": "מידע בסיסי",
    "category.camera": "מידע על המצלמה",
    "category.gps": "מיקום GPS",
    "category.advanced": "מידע מתקדם",
    "amap": "Amap"
  },
  "ms": {
    "exifData": "Data EXIF",
    "category.basic": "Maklumat Asas",
    "category.camera": "Maklumat Kamera",
    "category.gps": "Lokasi GPS",
    "category.advanced": "Maklumat Lanjutan",
    "amap": "Amap"
  },
  "no": {
    "exifData": "EXIF-data",
    "category.basic": "Grunnleggende informasjon",
    "category.camera": "Kamerainformasjon",
    "category.gps": "GPS-plassering",
    "category.advanced": "Avansert informasjon",
    "amap": "Amap"
  }
}
</i18n>
