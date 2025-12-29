<template>
  <n-flex align="center" :size="12" class="alpha-switch">
    <span class="section-title">{{ t('enable-alpha') }}</span>
    <n-switch v-model:value="showAlpha" size="small" />
  </n-flex>

  <n-grid cols="1 s:2 l:3" :x-gap="24" :y-gap="24" responsive="screen">
    <n-gi>
      <HexColorPicker
        :rgba="storedColor"
        :show-alpha="showAlpha"
        @update:rgba="storedColor = $event"
      />
    </n-gi>
    <n-gi>
      <RgbColorPicker
        :rgba="storedColor"
        :show-alpha="showAlpha"
        @update:rgba="storedColor = $event"
      />
    </n-gi>
    <n-gi>
      <HslColorPicker
        :rgba="storedColor"
        :show-alpha="showAlpha"
        @update:rgba="storedColor = $event"
      />
    </n-gi>
    <n-gi>
      <HsvColorPicker
        :rgba="storedColor"
        :show-alpha="showAlpha"
        @update:rgba="storedColor = $event"
      />
    </n-gi>
    <n-gi>
      <HwbColorInput :rgba="storedColor" @update:rgba="storedColor = $event" />
    </n-gi>
    <n-gi>
      <LabColorInput :rgba="storedColor" @update:rgba="storedColor = $event" />
    </n-gi>
    <n-gi>
      <LchColorInput :rgba="storedColor" @update:rgba="storedColor = $event" />
    </n-gi>
    <n-gi>
      <CmykColorInput :rgba="storedColor" @update:rgba="storedColor = $event" />
    </n-gi>
    <n-gi>
      <KeywordSelect :rgba="storedColor" @update:rgba="storedColor = $event" />
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { NFlex, NSwitch, NGrid, NGi } from 'naive-ui'
import type { RGBA } from '../types'
import HexColorPicker from './HexColorPicker.vue'
import RgbColorPicker from './RgbColorPicker.vue'
import HslColorPicker from './HslColorPicker.vue'
import HsvColorPicker from './HsvColorPicker.vue'
import HwbColorInput from './HwbColorInput.vue'
import LabColorInput from './LabColorInput.vue'
import LchColorInput from './LchColorInput.vue'
import CmykColorInput from './CmykColorInput.vue'
import KeywordSelect from './KeywordSelect.vue'

const { t } = useI18n()

const showAlpha = useStorage('tools:color-converter:show-alpha', true)

const storedColor = useStorage<RGBA>('tools:color-converter:rgba', {
  r: 52,
  g: 152,
  b: 219,
  a: 1,
})
</script>

<style scoped>
.alpha-switch {
  margin-bottom: 16px;
}

.section-title {
  font-weight: 500;
  font-size: 14px;
}
</style>

<i18n lang="json">
{
  "en": { "enable-alpha": "Enable Alpha" },
  "zh": { "enable-alpha": "启用透明度" },
  "zh-CN": { "enable-alpha": "启用透明度" },
  "zh-TW": { "enable-alpha": "啟用透明度" },
  "zh-HK": { "enable-alpha": "啟用透明度" },
  "es": { "enable-alpha": "Habilitar Alfa" },
  "fr": { "enable-alpha": "Activer Alpha" },
  "de": { "enable-alpha": "Alpha aktivieren" },
  "it": { "enable-alpha": "Abilita Alpha" },
  "ja": { "enable-alpha": "アルファを有効化" },
  "ko": { "enable-alpha": "알파 활성화" },
  "ru": { "enable-alpha": "Включить альфа" },
  "pt": { "enable-alpha": "Ativar Alpha" },
  "ar": { "enable-alpha": "تفعيل ألفا" },
  "hi": { "enable-alpha": "अल्फा सक्षम करें" },
  "tr": { "enable-alpha": "Alfa Etkinleştir" },
  "nl": { "enable-alpha": "Alpha inschakelen" },
  "sv": { "enable-alpha": "Aktivera Alpha" },
  "pl": { "enable-alpha": "Włącz kanał alfa" },
  "vi": { "enable-alpha": "Bật Alpha" },
  "th": { "enable-alpha": "เปิดใช้งานอัลฟา" },
  "id": { "enable-alpha": "Aktifkan Alpha" },
  "he": { "enable-alpha": "הפעל אלפא" },
  "ms": { "enable-alpha": "Dayakan Alpha" },
  "no": { "enable-alpha": "Aktiver Alpha" }
}
</i18n>
