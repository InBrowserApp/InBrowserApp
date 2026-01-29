<template>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-flex align="center" justify="space-between" :wrap="true" class="section-row">
        <n-flex align="center" :size="12">
          <div class="color-swatch" :style="{ backgroundColor: cssColor }" />
          <div>
            <div class="section-title">{{ t('pickedTitle') }}</div>
            <div class="section-subtitle">{{ t('sourceLabel') }}: {{ sourceLabel }}</div>
          </div>
        </n-flex>
        <n-flex align="center" :size="8">
          <span class="section-subtitle">{{ t('showAlpha') }}</span>
          <n-switch :value="showAlpha" size="small" @update:value="onShowAlphaChange" />
        </n-flex>
      </n-flex>
      <ColorPickerOutputFields
        :show-alpha="showAlpha"
        :hex-value="hexValue"
        :rgb-value="rgbValue"
        :hsl-value="hslValue"
        :hsv-value="hsvValue"
        :cmyk-value="cmykValue"
        :alpha-value="alphaValue"
      />
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFlex, NSwitch } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import ColorPickerOutputFields from './ColorPickerOutputFields.vue'

const props = defineProps<{
  cssColor: string
  pickedSource: 'screen' | 'image' | null
  showAlpha: boolean
  hexValue: string
  rgbValue: string
  hslValue: string
  hsvValue: string
  cmykValue: string
  alphaValue: string
}>()

const emit = defineEmits<{
  (event: 'update:showAlpha', value: boolean): void
}>()

const { t } = useI18n()

const sourceLabel = computed(() => {
  if (props.pickedSource === 'screen') return t('sourceScreen')
  if (props.pickedSource === 'image') return t('sourceImage')
  return t('sourceUnknown')
})

function onShowAlphaChange(value: boolean) {
  emit('update:showAlpha', value)
}
</script>

<style scoped>
.section-row {
  gap: 16px;
}

.section-copy {
  max-width: 520px;
}

.section-title {
  font-weight: 600;
  font-size: 16px;
}

.section-subtitle {
  font-size: 13px;
  color: var(--n-text-color-3);
}

.color-swatch {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid var(--n-border-color);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}
</style>

<i18n lang="json">
{
  "en": {
    "pickedTitle": "Picked Color",
    "sourceLabel": "Source",
    "sourceScreen": "Screen",
    "sourceImage": "Image",
    "sourceUnknown": "Not picked yet",
    "showAlpha": "Enable Alpha"
  },
  "zh": {
    "pickedTitle": "已取颜色",
    "sourceLabel": "来源",
    "sourceScreen": "屏幕",
    "sourceImage": "图片",
    "sourceUnknown": "尚未取色",
    "showAlpha": "启用透明度"
  },
  "zh-CN": {
    "pickedTitle": "已取颜色",
    "sourceLabel": "来源",
    "sourceScreen": "屏幕",
    "sourceImage": "图片",
    "sourceUnknown": "尚未取色",
    "showAlpha": "启用透明度"
  },
  "zh-TW": {
    "pickedTitle": "已取顏色",
    "sourceLabel": "來源",
    "sourceScreen": "螢幕",
    "sourceImage": "圖片",
    "sourceUnknown": "尚未取色",
    "showAlpha": "啟用透明度"
  },
  "zh-HK": {
    "pickedTitle": "已取顏色",
    "sourceLabel": "來源",
    "sourceScreen": "螢幕",
    "sourceImage": "圖片",
    "sourceUnknown": "尚未取色",
    "showAlpha": "啟用透明度"
  },
  "es": {
    "pickedTitle": "Color seleccionado",
    "sourceLabel": "Origen",
    "sourceScreen": "Pantalla",
    "sourceImage": "Imagen",
    "sourceUnknown": "Aún no seleccionado",
    "showAlpha": "Habilitar Alfa"
  },
  "fr": {
    "pickedTitle": "Couleur sélectionnée",
    "sourceLabel": "Source",
    "sourceScreen": "Écran",
    "sourceImage": "Image",
    "sourceUnknown": "Pas encore sélectionnée",
    "showAlpha": "Activer Alpha"
  },
  "de": {
    "pickedTitle": "Ausgewählte Farbe",
    "sourceLabel": "Quelle",
    "sourceScreen": "Bildschirm",
    "sourceImage": "Bild",
    "sourceUnknown": "Noch nicht ausgewählt",
    "showAlpha": "Alpha aktivieren"
  },
  "it": {
    "pickedTitle": "Colore selezionato",
    "sourceLabel": "Fonte",
    "sourceScreen": "Schermo",
    "sourceImage": "Immagine",
    "sourceUnknown": "Non ancora selezionato",
    "showAlpha": "Abilita Alpha"
  },
  "ja": {
    "pickedTitle": "取得した色",
    "sourceLabel": "ソース",
    "sourceScreen": "画面",
    "sourceImage": "画像",
    "sourceUnknown": "まだ取得していません",
    "showAlpha": "アルファを有効化"
  },
  "ko": {
    "pickedTitle": "선택된 색상",
    "sourceLabel": "출처",
    "sourceScreen": "화면",
    "sourceImage": "이미지",
    "sourceUnknown": "아직 선택되지 않음",
    "showAlpha": "알파 활성화"
  },
  "ru": {
    "pickedTitle": "Выбранный цвет",
    "sourceLabel": "Источник",
    "sourceScreen": "Экран",
    "sourceImage": "Изображение",
    "sourceUnknown": "Пока не выбрано",
    "showAlpha": "Включить альфа"
  },
  "pt": {
    "pickedTitle": "Cor selecionada",
    "sourceLabel": "Origem",
    "sourceScreen": "Tela",
    "sourceImage": "Imagem",
    "sourceUnknown": "Ainda não selecionada",
    "showAlpha": "Ativar Alpha"
  },
  "ar": {
    "pickedTitle": "اللون المختار",
    "sourceLabel": "المصدر",
    "sourceScreen": "الشاشة",
    "sourceImage": "الصورة",
    "sourceUnknown": "لم يتم الاختيار بعد",
    "showAlpha": "تفعيل ألفا"
  },
  "hi": {
    "pickedTitle": "चुना गया रंग",
    "sourceLabel": "स्रोत",
    "sourceScreen": "स्क्रीन",
    "sourceImage": "छवि",
    "sourceUnknown": "अभी चुना नहीं गया",
    "showAlpha": "अल्फा सक्षम करें"
  },
  "tr": {
    "pickedTitle": "Seçilen Renk",
    "sourceLabel": "Kaynak",
    "sourceScreen": "Ekran",
    "sourceImage": "Görsel",
    "sourceUnknown": "Henüz seçilmedi",
    "showAlpha": "Alfa Etkinleştir"
  },
  "nl": {
    "pickedTitle": "Geselecteerde kleur",
    "sourceLabel": "Bron",
    "sourceScreen": "Scherm",
    "sourceImage": "Afbeelding",
    "sourceUnknown": "Nog niet gekozen",
    "showAlpha": "Alpha inschakelen"
  },
  "sv": {
    "pickedTitle": "Vald färg",
    "sourceLabel": "Källa",
    "sourceScreen": "Skärm",
    "sourceImage": "Bild",
    "sourceUnknown": "Inte vald än",
    "showAlpha": "Aktivera Alpha"
  },
  "pl": {
    "pickedTitle": "Wybrany kolor",
    "sourceLabel": "Źródło",
    "sourceScreen": "Ekran",
    "sourceImage": "Obraz",
    "sourceUnknown": "Jeszcze nie wybrano",
    "showAlpha": "Włącz kanał alfa"
  },
  "vi": {
    "pickedTitle": "Màu đã chọn",
    "sourceLabel": "Nguồn",
    "sourceScreen": "Màn hình",
    "sourceImage": "Ảnh",
    "sourceUnknown": "Chưa chọn",
    "showAlpha": "Bật Alpha"
  },
  "th": {
    "pickedTitle": "สีที่เลือก",
    "sourceLabel": "แหล่งที่มา",
    "sourceScreen": "หน้าจอ",
    "sourceImage": "ภาพ",
    "sourceUnknown": "ยังไม่ได้เลือก",
    "showAlpha": "เปิดใช้งานอัลฟา"
  },
  "id": {
    "pickedTitle": "Warna terpilih",
    "sourceLabel": "Sumber",
    "sourceScreen": "Layar",
    "sourceImage": "Gambar",
    "sourceUnknown": "Belum dipilih",
    "showAlpha": "Aktifkan Alpha"
  },
  "he": {
    "pickedTitle": "צבע שנבחר",
    "sourceLabel": "מקור",
    "sourceScreen": "מסך",
    "sourceImage": "תמונה",
    "sourceUnknown": "לא נבחר עדיין",
    "showAlpha": "הפעל אלפא"
  },
  "ms": {
    "pickedTitle": "Warna dipilih",
    "sourceLabel": "Sumber",
    "sourceScreen": "Skrin",
    "sourceImage": "Imej",
    "sourceUnknown": "Belum dipilih",
    "showAlpha": "Dayakan Alpha"
  },
  "no": {
    "pickedTitle": "Valgt farge",
    "sourceLabel": "Kilde",
    "sourceScreen": "Skjerm",
    "sourceImage": "Bilde",
    "sourceUnknown": "Ikke valgt ennå",
    "showAlpha": "Aktiver Alpha"
  }
}
</i18n>
