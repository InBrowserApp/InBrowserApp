<template>
  <ToolSectionHeader>{{ t('previewTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-empty v-if="!item || !layout" size="small" :description="t('emptyState')" />

    <n-flex v-else vertical :size="8">
      <div class="preview-page" :style="pageStyle">
        <div class="preview-page__frame" :style="frameStyle">
          <img
            :src="item.previewUrl"
            :alt="item.name"
            class="preview-page__image"
            :style="imageStyle"
          />
        </div>
      </div>
      <n-text depth="3">{{ t('previewHint') }}</n-text>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NEmpty, NFlex, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { ImageQueueItem, PreviewLayout } from '../types'

const props = defineProps<{
  item: ImageQueueItem | null
  layout: PreviewLayout | null
}>()

const { t } = useI18n({ useScope: 'local' })

const pageStyle = computed(() => {
  if (!props.layout) {
    return {}
  }

  return {
    aspectRatio: `${props.layout.page.width} / ${props.layout.page.height}`,
  }
})

const frameStyle = computed(() => {
  if (!props.layout) {
    return {}
  }

  return {
    left: `${(props.layout.placement.x / props.layout.page.width) * 100}%`,
    top: `${(props.layout.placement.y / props.layout.page.height) * 100}%`,
    width: `${(props.layout.placement.width / props.layout.page.width) * 100}%`,
    height: `${(props.layout.placement.height / props.layout.page.height) * 100}%`,
  }
})

const imageStyle = computed(() => {
  if (!props.item) {
    return {}
  }

  if (props.item.rotation === 90 || props.item.rotation === 270) {
    return {
      width: `${(props.item.width / props.item.height) * 100}%`,
      height: `${(props.item.height / props.item.width) * 100}%`,
      transform: `translate(-50%, -50%) rotate(${props.item.rotation}deg)`,
    }
  }

  return {
    width: '100%',
    height: '100%',
    transform: `translate(-50%, -50%) rotate(${props.item.rotation}deg)`,
  }
})
</script>

<style scoped>
.preview-page {
  position: relative;
  width: min(100%, 360px);
  border-radius: 12px;
  border: 1px solid var(--n-border-color);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 248, 248, 0.98)),
    repeating-linear-gradient(
      45deg,
      rgba(0, 0, 0, 0.03),
      rgba(0, 0, 0, 0.03) 10px,
      transparent 10px,
      transparent 20px
    );
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.08);
}

.preview-page__frame {
  position: absolute;
  overflow: hidden;
  background: #fff;
}

.preview-page__image {
  position: absolute;
  left: 50%;
  top: 50%;
  display: block;
  object-fit: fill;
}
</style>

<i18n lang="json">
{
  "en": {
    "previewTitle": "Page preview",
    "emptyState": "Select an image to preview the page layout",
    "previewHint": "Preview uses the same layout rules as the generated PDF."
  },
  "zh": {
    "previewTitle": "页面预览",
    "emptyState": "选择一张图片即可预览 PDF 页面排版",
    "previewHint": "预览和最终生成的 PDF 使用同一套布局规则。"
  },
  "zh-CN": {
    "previewTitle": "页面预览",
    "emptyState": "选择一张图片即可预览 PDF 页面排版",
    "previewHint": "预览和最终生成的 PDF 使用同一套布局规则。"
  },
  "zh-TW": {
    "previewTitle": "頁面預覽",
    "emptyState": "選擇一張圖片即可預覽 PDF 頁面排版",
    "previewHint": "預覽和最終產生的 PDF 使用同一套版面規則。"
  },
  "zh-HK": {
    "previewTitle": "頁面預覽",
    "emptyState": "選擇一張圖片即可預覽 PDF 頁面排版",
    "previewHint": "預覽和最終產生的 PDF 使用同一套版面規則。"
  },
  "es": {
    "previewTitle": "Page preview",
    "emptyState": "Select an image to preview the page layout",
    "previewHint": "Preview uses the same layout rules as the generated PDF."
  },
  "fr": {
    "previewTitle": "Page preview",
    "emptyState": "Select an image to preview the page layout",
    "previewHint": "Preview uses the same layout rules as the generated PDF."
  },
  "de": {
    "previewTitle": "Page preview",
    "emptyState": "Select an image to preview the page layout",
    "previewHint": "Preview uses the same layout rules as the generated PDF."
  },
  "it": {
    "previewTitle": "Page preview",
    "emptyState": "Select an image to preview the page layout",
    "previewHint": "Preview uses the same layout rules as the generated PDF."
  },
  "ja": {
    "previewTitle": "Page preview",
    "emptyState": "Select an image to preview the page layout",
    "previewHint": "Preview uses the same layout rules as the generated PDF."
  },
  "ko": {
    "previewTitle": "Page preview",
    "emptyState": "Select an image to preview the page layout",
    "previewHint": "Preview uses the same layout rules as the generated PDF."
  },
  "ru": {
    "previewTitle": "Page preview",
    "emptyState": "Select an image to preview the page layout",
    "previewHint": "Preview uses the same layout rules as the generated PDF."
  },
  "pt": {
    "previewTitle": "Page preview",
    "emptyState": "Select an image to preview the page layout",
    "previewHint": "Preview uses the same layout rules as the generated PDF."
  },
  "ar": {
    "previewTitle": "Page preview",
    "emptyState": "Select an image to preview the page layout",
    "previewHint": "Preview uses the same layout rules as the generated PDF."
  },
  "hi": {
    "previewTitle": "Page preview",
    "emptyState": "Select an image to preview the page layout",
    "previewHint": "Preview uses the same layout rules as the generated PDF."
  },
  "tr": {
    "previewTitle": "Page preview",
    "emptyState": "Select an image to preview the page layout",
    "previewHint": "Preview uses the same layout rules as the generated PDF."
  },
  "nl": {
    "previewTitle": "Page preview",
    "emptyState": "Select an image to preview the page layout",
    "previewHint": "Preview uses the same layout rules as the generated PDF."
  },
  "sv": {
    "previewTitle": "Page preview",
    "emptyState": "Select an image to preview the page layout",
    "previewHint": "Preview uses the same layout rules as the generated PDF."
  },
  "pl": {
    "previewTitle": "Page preview",
    "emptyState": "Select an image to preview the page layout",
    "previewHint": "Preview uses the same layout rules as the generated PDF."
  },
  "vi": {
    "previewTitle": "Page preview",
    "emptyState": "Select an image to preview the page layout",
    "previewHint": "Preview uses the same layout rules as the generated PDF."
  },
  "th": {
    "previewTitle": "Page preview",
    "emptyState": "Select an image to preview the page layout",
    "previewHint": "Preview uses the same layout rules as the generated PDF."
  },
  "id": {
    "previewTitle": "Page preview",
    "emptyState": "Select an image to preview the page layout",
    "previewHint": "Preview uses the same layout rules as the generated PDF."
  },
  "he": {
    "previewTitle": "Page preview",
    "emptyState": "Select an image to preview the page layout",
    "previewHint": "Preview uses the same layout rules as the generated PDF."
  },
  "ms": {
    "previewTitle": "Page preview",
    "emptyState": "Select an image to preview the page layout",
    "previewHint": "Preview uses the same layout rules as the generated PDF."
  },
  "no": {
    "previewTitle": "Page preview",
    "emptyState": "Select an image to preview the page layout",
    "previewHint": "Preview uses the same layout rules as the generated PDF."
  }
}
</i18n>
