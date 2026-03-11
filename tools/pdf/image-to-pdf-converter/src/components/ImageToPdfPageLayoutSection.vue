<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-form label-placement="top">
      <div class="page-layout-section">
        <ImageToPdfPageSettingsSection
          :page-size="options.pageSize"
          :page-orientation="options.pageOrientation"
          :disabled="disabled"
          @update:page-size="updateOption('pageSize', $event)"
          @update:page-orientation="updateOption('pageOrientation', $event)"
        />

        <ImageToPdfLayoutSettingsSection
          :fit-mode="options.fitMode"
          :quality-preset="options.qualityPreset"
          :margin-mm="options.marginMm"
          :disabled="disabled"
          @update:fit-mode="updateOption('fitMode', $event)"
          @update:quality-preset="updateOption('qualityPreset', $event)"
          @update:margin-mm="updateOption('marginMm', $event)"
        />
      </div>
    </n-form>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NForm } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { ConverterOptions } from '../types'
import ImageToPdfLayoutSettingsSection from './ImageToPdfLayoutSettingsSection.vue'
import ImageToPdfPageSettingsSection from './ImageToPdfPageSettingsSection.vue'

const props = defineProps<{
  disabled: boolean
}>()

const options = defineModel<ConverterOptions>('options', {
  required: true,
})

const { t } = useI18n({ useScope: 'local' })

function updateOption<Key extends keyof ConverterOptions>(key: Key, value: ConverterOptions[Key]) {
  if (props.disabled) {
    return
  }

  options.value = {
    ...options.value,
    [key]: value,
  }
}
</script>

<style scoped>
.page-layout-section {
  display: grid;
  gap: 12px;
}
</style>

<i18n lang="json">
{
  "en": { "title": "Page and layout" },
  "zh": { "title": "页面与布局" },
  "zh-CN": { "title": "页面与布局" },
  "zh-TW": { "title": "頁面與版面" },
  "zh-HK": { "title": "頁面與版面" },
  "es": { "title": "Página y diseño" },
  "fr": { "title": "Page et mise en page" },
  "de": { "title": "Seite und Layout" },
  "it": { "title": "Pagina e layout" },
  "ja": { "title": "ページとレイアウト" },
  "ko": { "title": "페이지와 레이아웃" },
  "ru": { "title": "Страница и макет" },
  "pt": { "title": "Página e layout" },
  "ar": { "title": "الصفحة والتخطيط" },
  "hi": { "title": "पेज और लेआउट" },
  "tr": { "title": "Sayfa ve düzen" },
  "nl": { "title": "Pagina en lay-out" },
  "sv": { "title": "Sida och layout" },
  "pl": { "title": "Strona i układ" },
  "vi": { "title": "Trang và bố cục" },
  "th": { "title": "หน้ากระดาษและเลย์เอาต์" },
  "id": { "title": "Halaman dan tata letak" },
  "he": { "title": "עמוד ופריסה" },
  "ms": { "title": "Halaman dan susun atur" },
  "no": { "title": "Side og layout" }
}
</i18n>
