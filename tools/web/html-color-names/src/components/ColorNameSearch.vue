<template>
  <NFlex vertical :size="16">
    <NInput
      :value="search"
      :placeholder="t('searchPlaceholder')"
      clearable
      @update:value="$emit('update:search', $event)"
    >
      <template #prefix>
        <NIcon :component="SearchIcon" />
      </template>
    </NInput>
    <NScrollbar x-scrollable>
      <NRadioGroup :value="category" @update:value="$emit('update:category', $event)">
        <NRadioButton value="all">{{ t('all') }}</NRadioButton>
        <NRadioButton v-for="cat in colorCategories" :key="cat" :value="cat">
          <span
            :style="{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              borderRadius: '2px',
              backgroundColor: categoryColors[cat],
              marginRight: '4px',
              verticalAlign: 'middle',
              border: cat === 'white' ? '1px solid #ccc' : 'none',
            }"
          />
          {{ t(cat) }}
        </NRadioButton>
      </NRadioGroup>
    </NScrollbar>
  </NFlex>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFlex, NInput, NIcon, NRadioGroup, NRadioButton, NScrollbar } from 'naive-ui'
import { Search20Regular as SearchIcon } from '@shared/icons/fluent'
import { colorCategories, categoryColors } from '../data/colorData'

defineProps<{
  search: string
  category: string
}>()

defineEmits<{
  'update:search': [value: string]
  'update:category': [value: string]
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "searchPlaceholder": "Search by color name or HEX value...",
    "all": "All",
    "red": "Red",
    "orange": "Orange",
    "yellow": "Yellow",
    "green": "Green",
    "cyan": "Cyan",
    "blue": "Blue",
    "purple": "Purple",
    "pink": "Pink",
    "brown": "Brown",
    "gray": "Gray",
    "white": "White"
  },
  "zh": {
    "searchPlaceholder": "按颜色名称或十六进制值搜索...",
    "all": "全部",
    "red": "红色",
    "orange": "橙色",
    "yellow": "黄色",
    "green": "绿色",
    "cyan": "青色",
    "blue": "蓝色",
    "purple": "紫色",
    "pink": "粉色",
    "brown": "棕色",
    "gray": "灰色",
    "white": "白色"
  }
}
</i18n>
