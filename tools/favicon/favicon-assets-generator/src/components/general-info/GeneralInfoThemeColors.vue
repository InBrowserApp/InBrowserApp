<template>
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

      <n-checkbox v-model:checked="options.theme_color_dark_enabled" style="margin-right: 0.7em" />
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
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { NGridItem, NFormItem, NColorPicker, NButton, NIcon, NCheckbox } from 'naive-ui'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'
import Info16Regular from '@vicons/fluent/Info16Regular'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ options: GeneralInfoOptions }>()
const { options } = toRefs(props)

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "themeColor": "Theme Color",
    "themeColorDark": "Theme Color in Dark Mode",
    "disabled": "Disabled",
    "backgroundColor": "Background Color"
  },
  "zh": {
    "themeColor": "主题颜色",
    "themeColorDark": "深色模式主题颜色",
    "disabled": "已禁用",
    "backgroundColor": "背景颜色"
  },
  "zh-CN": {
    "themeColor": "主题颜色",
    "themeColorDark": "深色模式主题颜色",
    "disabled": "已禁用",
    "backgroundColor": "背景颜色"
  },
  "zh-TW": {
    "themeColor": "主題顏色",
    "themeColorDark": "深色模式主題顏色",
    "disabled": "已禁用",
    "backgroundColor": "背景顏色"
  },
  "zh-HK": {
    "themeColor": "主題顏色",
    "themeColorDark": "深色模式主題顏色",
    "disabled": "已禁用",
    "backgroundColor": "背景顏色"
  },
  "es": {
    "themeColor": "Color del Tema",
    "themeColorDark": "Color del Tema en Modo Oscuro",
    "disabled": "Deshabilitado",
    "backgroundColor": "Color de Fondo"
  },
  "fr": {
    "themeColor": "Couleur du Thème",
    "themeColorDark": "Couleur du Thème en Mode Sombre",
    "disabled": "Désactivé",
    "backgroundColor": "Couleur de Fond"
  },
  "de": {
    "themeColor": "Themenfarbe",
    "themeColorDark": "Themenfarbe im Dunkelmodus",
    "disabled": "Deaktiviert",
    "backgroundColor": "Hintergrundfarbe"
  },
  "it": {
    "themeColor": "Colore del Tema",
    "themeColorDark": "Colore del Tema in Modalità Scura",
    "disabled": "Disabilitato",
    "backgroundColor": "Colore di Sfondo"
  },
  "ja": {
    "themeColor": "テーマカラー",
    "themeColorDark": "ダークモードのテーマカラー",
    "disabled": "無効",
    "backgroundColor": "背景色"
  },
  "ko": {
    "themeColor": "테마 색상",
    "themeColorDark": "다크 모드 테마 색상",
    "disabled": "비활성화됨",
    "backgroundColor": "배경색"
  },
  "ru": {
    "themeColor": "Цвет Темой",
    "themeColorDark": "Цвет Темой в Темном Режиме",
    "disabled": "Отключено",
    "backgroundColor": "Цвет Фона"
  },
  "pt": {
    "themeColor": "Cor do Tema",
    "themeColorDark": "Cor do Tema no Modo Escuro",
    "disabled": "Desativado",
    "backgroundColor": "Cor de Fundo"
  },
  "ar": {
    "themeColor": "لون السمة",
    "themeColorDark": "لون السمة في الوضع الداكن",
    "disabled": "معطل",
    "backgroundColor": "لون الخلفية"
  },
  "hi": {
    "themeColor": "थीम का रंग",
    "themeColorDark": "डार्क मोड में थीम का रंग",
    "disabled": "अक्षम",
    "backgroundColor": "पृष्ठभूमि का रंग"
  },
  "tr": {
    "themeColor": "Tema Rengi",
    "themeColorDark": "Karanlık Modda Tema Rengi",
    "disabled": "Devre Dışı",
    "backgroundColor": "Arka Plan Rengi"
  },
  "nl": {
    "themeColor": "Themakleur",
    "themeColorDark": "Themakleur in Donkere Modus",
    "disabled": "Uitgeschakeld",
    "backgroundColor": "Achtergrondkleur"
  },
  "sv": {
    "themeColor": "Temafärg",
    "themeColorDark": "Temafärg i Mörkt Läge",
    "disabled": "Inaktiverad",
    "backgroundColor": "Bakgrundsfärg"
  },
  "pl": {
    "themeColor": "Kolor Motywu",
    "themeColorDark": "Kolor Motywu w Trybie Ciemnym",
    "disabled": "Wyłączone",
    "backgroundColor": "Kolor Tła"
  },
  "vi": {
    "themeColor": "Màu Chủ đề",
    "themeColorDark": "Màu Chủ đề trong Chế độ Tối",
    "disabled": "Đã Tắt",
    "backgroundColor": "Màu Nền"
  },
  "th": {
    "themeColor": "สีธีม",
    "themeColorDark": "สีธีมในโหมดมืด",
    "disabled": "ปิดใช้งาน",
    "backgroundColor": "สีพื้นหลัง"
  },
  "id": {
    "themeColor": "Warna Tema",
    "themeColorDark": "Warna Tema dalam Mode Gelap",
    "disabled": "Dinonaktifkan",
    "backgroundColor": "Warna Latar Belakang"
  },
  "he": {
    "themeColor": "צבע ערכת נושא",
    "themeColorDark": "צבע ערכת נושא במצב כהה",
    "disabled": "מושבת",
    "backgroundColor": "צבע רקע"
  },
  "ms": {
    "themeColor": "Warna Tema",
    "themeColorDark": "Warna Tema dalam Mod Gelap",
    "disabled": "Dinyahaktifkan",
    "backgroundColor": "Warna Latar Belakang"
  },
  "no": {
    "themeColor": "Temafarge",
    "themeColorDark": "Temafarge i Mørk Modus",
    "disabled": "Deaktivert",
    "backgroundColor": "Bakgrunnsfarge"
  }
}
</i18n>
