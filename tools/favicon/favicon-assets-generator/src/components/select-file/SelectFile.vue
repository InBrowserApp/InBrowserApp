<template>
  <n-p>
    <template v-if="image">
      <div class="selected-layout">
        <img :src="imageURL" class="selected-image" />
        <div>
          <div>{{ t('dimensions') }}: {{ imageSize }}</div>
          <div>{{ t('type') }}: {{ image.type }}</div>
          <div>{{ t('size') }}: {{ image.size }}</div>

          <RemoveButton @click="image = undefined" />
        </div>
      </div>
    </template>
    <template v-else>
      <ImageUpload @update:file="image = $event" />
      <n-button size="small" text @click="useDemoIcon">
        <template #icon>
          <n-icon :component="Icons20Regular" />
        </template>
        {{ t('useDemoIcon') }}
      </n-button>
    </template>
  </n-p>
</template>

<script setup lang="ts">
import { computedAsync, useObjectUrl } from '@vueuse/core'
import ImageUpload from '../ImageUpload.vue'
import { NButton, NP, NIcon } from 'naive-ui'
import Icons20Regular from '@vicons/fluent/Icons20Regular'
import { getImageSize } from '@utils/image'
import FaviconURL from './favicon.svg'
import { useI18n } from 'vue-i18n'
import RemoveButton from '../common/RemoveButton.vue'

const image = defineModel<Blob | undefined>('image')

const { t } = useI18n()

const imageURL = useObjectUrl(image)

const imageSize = computedAsync(async () => {
  if (image.value === undefined) {
    return undefined
  }
  const { height, width } = await getImageSize(image.value)
  return `${width}x${height}`
})

const useDemoIcon = async () => {
  const response = await fetch(FaviconURL)
  const blob = await response.blob()
  image.value = blob
}
</script>

<style scoped>
.selected-image {
  aspect-ratio: 1;
  object-fit: contain;
  max-height: 7em;
  margin-top: 1em;
  margin-bottom: 1em;
}

.selected-layout {
  display: flex;
  flex-direction: row;
  gap: 1em;
}
</style>

<i18n lang="json">
{
  "en": {
    "dimensions": "Dimensions",
    "type": "Type",
    "size": "Size",
    "useDemoIcon": "Use Demo Icon"
  },
  "zh": {
    "dimensions": "尺寸",
    "type": "类型",
    "size": "大小",
    "useDemoIcon": "使用演示图标"
  },
  "zh-CN": {
    "dimensions": "尺寸",
    "type": "类型",
    "size": "大小",
    "useDemoIcon": "使用演示图标"
  },
  "zh-TW": {
    "dimensions": "尺寸",
    "type": "類型",
    "size": "大小",
    "useDemoIcon": "使用示範圖示"
  },
  "zh-HK": {
    "dimensions": "尺寸",
    "type": "類型",
    "size": "大小",
    "useDemoIcon": "使用示範圖示"
  },
  "es": {
    "dimensions": "Dimensiones",
    "type": "Tipo",
    "size": "Tamaño",
    "useDemoIcon": "Usar icono de demostración"
  },
  "fr": {
    "dimensions": "Dimensions",
    "type": "Type",
    "size": "Taille",
    "useDemoIcon": "Utiliser l'icône de démonstration"
  },
  "de": {
    "dimensions": "Abmessungen",
    "type": "Typ",
    "size": "Größe",
    "useDemoIcon": "Demo-Symbol verwenden"
  },
  "it": {
    "dimensions": "Dimensioni",
    "type": "Tipo",
    "size": "Dimensione",
    "useDemoIcon": "Usa icona demo"
  },
  "ja": {
    "dimensions": "寸法",
    "type": "タイプ",
    "size": "サイズ",
    "useDemoIcon": "デモアイコンを使用"
  },
  "ko": {
    "dimensions": "크기",
    "type": "유형",
    "size": "파일 크기",
    "useDemoIcon": "데모 아이콘 사용"
  },
  "ru": {
    "dimensions": "Размеры",
    "type": "Тип",
    "size": "Размер",
    "useDemoIcon": "Использовать демо-иконку"
  },
  "pt": {
    "dimensions": "Dimensões",
    "type": "Tipo",
    "size": "Tamanho",
    "useDemoIcon": "Usar ícone de demonstração"
  },
  "ar": {
    "dimensions": "الأبعاد",
    "type": "النوع",
    "size": "الحجم",
    "useDemoIcon": "استخدام أيقونة تجريبية"
  },
  "hi": {
    "dimensions": "आयाम",
    "type": "प्रकार",
    "size": "आकार",
    "useDemoIcon": "डेमो आइकन का उपयोग करें"
  },
  "tr": {
    "dimensions": "Boyutlar",
    "type": "Tür",
    "size": "Boyut",
    "useDemoIcon": "Demo simgesini kullan"
  },
  "nl": {
    "dimensions": "Afmetingen",
    "type": "Type",
    "size": "Grootte",
    "useDemoIcon": "Demo-pictogram gebruiken"
  },
  "sv": {
    "dimensions": "Dimensioner",
    "type": "Typ",
    "size": "Storlek",
    "useDemoIcon": "Använd demoikon"
  },
  "pl": {
    "dimensions": "Wymiary",
    "type": "Typ",
    "size": "Rozmiar",
    "useDemoIcon": "Użyj ikony demo"
  },
  "vi": {
    "dimensions": "Kích thước",
    "type": "Loại",
    "size": "Kích cỡ",
    "useDemoIcon": "Sử dụng biểu tượng demo"
  },
  "th": {
    "dimensions": "ขนาด",
    "type": "ประเภท",
    "size": "ขนาด",
    "useDemoIcon": "ใช้ไอคอนตัวอย่าง"
  },
  "id": {
    "dimensions": "Dimensi",
    "type": "Tipe",
    "size": "Ukuran",
    "useDemoIcon": "Gunakan Ikon Demo"
  },
  "he": {
    "dimensions": "מידות",
    "type": "סוג",
    "size": "גודל",
    "useDemoIcon": "השתמש בסמל הדגמה"
  },
  "ms": {
    "dimensions": "Dimensi",
    "type": "Jenis",
    "size": "Saiz",
    "useDemoIcon": "Gunakan Ikon Demo"
  },
  "no": {
    "dimensions": "Dimensjoner",
    "type": "Type",
    "size": "Størrelse",
    "useDemoIcon": "Bruk demoikon"
  }
}
</i18n>
