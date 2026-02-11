<template>
  <n-popover trigger="hover" placement="top-start" :width="360">
    <template #trigger>
      <n-icon size="16" depth="3" style="cursor: help">
        <Info16Regular />
      </n-icon>
    </template>

    <n-flex vertical :size="6">
      <n-text strong>{{ t('title') }}</n-text>
      <n-text depth="3">{{ t('browser') }}</n-text>
      <n-text depth="3">{{ t('bicubic') }}</n-text>
      <n-text depth="3">{{ t('bilinear') }}</n-text>
      <n-text depth="3">{{ t('lanczos3') }}</n-text>
      <n-text depth="3">{{ t('nearest') }}</n-text>
    </n-flex>
  </n-popover>
</template>

<script setup lang="ts">
import { NFlex, NIcon, NPopover, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import Info16Regular from '@vicons/fluent/Info16Regular'

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "title": "Algorithm guide",
    "browser": "Browser high quality: best default for photos and general use. Fast and smooth in most browsers.",
    "bicubic": "Bicubic interpolation: smoother edges than bilinear, suitable for portrait and product photos.",
    "bilinear": "Bilinear interpolation: balanced sharpness and speed, useful for common resize workflows.",
    "lanczos3": "Lanczos filter (radius 3): highest detail retention when downscaling, but usually slower.",
    "nearest": "Nearest neighbor: preserves hard edges for pixel-art style images and UI sprites."
  },
  "zh": {
    "title": "算法说明",
    "browser": "浏览器高质量：适合照片和通用场景的默认选项，在大多数浏览器中都比较平滑且速度快。",
    "bicubic": "双三次插值：边缘比双线性更平滑，适合人像和商品图。",
    "bilinear": "双线性插值：在清晰度和速度之间较为平衡，适合常规缩放。",
    "lanczos3": "Lanczos 滤波（半径 3）：缩小时细节保留最好，但通常更慢。",
    "nearest": "最近邻：可保留硬边缘，适合像素风图片和 UI 精灵图。"
  },
  "zh-CN": {
    "title": "算法说明",
    "browser": "浏览器高质量：适合照片和通用场景的默认选项，在大多数浏览器中都比较平滑且速度快。",
    "bicubic": "双三次插值：边缘比双线性更平滑，适合人像和商品图。",
    "bilinear": "双线性插值：在清晰度和速度之间较为平衡，适合常规缩放。",
    "lanczos3": "Lanczos 滤波（半径 3）：缩小时细节保留最好，但通常更慢。",
    "nearest": "最近邻：可保留硬边缘，适合像素风图片和 UI 精灵图。"
  },
  "zh-TW": {
    "title": "演算法說明",
    "browser": "瀏覽器高品質：適合照片與一般用途的預設選項，在多數瀏覽器中速度快且平滑。",
    "bicubic": "雙三次插值：邊緣比雙線性更平滑，適合人像與商品圖片。",
    "bilinear": "雙線性插值：在清晰度與速度之間較為平衡，適合一般縮放流程。",
    "lanczos3": "Lanczos 濾波（半徑 3）：縮小時細節保留最佳，但通常較慢。",
    "nearest": "最近鄰：可保留硬邊緣，適合像素風圖片與 UI 精靈圖。"
  },
  "zh-HK": {
    "title": "演算法說明",
    "browser": "瀏覽器高品質：適合照片與一般用途的預設選項，在多數瀏覽器中速度快且平滑。",
    "bicubic": "雙三次插值：邊緣比雙線性更平滑，適合人像與商品圖片。",
    "bilinear": "雙線性插值：在清晰度與速度之間較為平衡，適合一般縮放流程。",
    "lanczos3": "Lanczos 濾波（半徑 3）：縮小時細節保留最佳，但通常較慢。",
    "nearest": "最近鄰：可保留硬邊緣，適合像素風圖片與 UI 精靈圖。"
  },
  "es": {
    "title": "Algorithm guide",
    "browser": "Browser high quality: best default for photos and general use. Fast and smooth in most browsers.",
    "bicubic": "Bicubic interpolation: smoother edges than bilinear, suitable for portrait and product photos.",
    "bilinear": "Bilinear interpolation: balanced sharpness and speed, useful for common resize workflows.",
    "lanczos3": "Lanczos filter (radius 3): highest detail retention when downscaling, but usually slower.",
    "nearest": "Nearest neighbor: preserves hard edges for pixel-art style images and UI sprites."
  },
  "fr": {
    "title": "Algorithm guide",
    "browser": "Browser high quality: best default for photos and general use. Fast and smooth in most browsers.",
    "bicubic": "Bicubic interpolation: smoother edges than bilinear, suitable for portrait and product photos.",
    "bilinear": "Bilinear interpolation: balanced sharpness and speed, useful for common resize workflows.",
    "lanczos3": "Lanczos filter (radius 3): highest detail retention when downscaling, but usually slower.",
    "nearest": "Nearest neighbor: preserves hard edges for pixel-art style images and UI sprites."
  },
  "de": {
    "title": "Algorithm guide",
    "browser": "Browser high quality: best default for photos and general use. Fast and smooth in most browsers.",
    "bicubic": "Bicubic interpolation: smoother edges than bilinear, suitable for portrait and product photos.",
    "bilinear": "Bilinear interpolation: balanced sharpness and speed, useful for common resize workflows.",
    "lanczos3": "Lanczos filter (radius 3): highest detail retention when downscaling, but usually slower.",
    "nearest": "Nearest neighbor: preserves hard edges for pixel-art style images and UI sprites."
  },
  "it": {
    "title": "Algorithm guide",
    "browser": "Browser high quality: best default for photos and general use. Fast and smooth in most browsers.",
    "bicubic": "Bicubic interpolation: smoother edges than bilinear, suitable for portrait and product photos.",
    "bilinear": "Bilinear interpolation: balanced sharpness and speed, useful for common resize workflows.",
    "lanczos3": "Lanczos filter (radius 3): highest detail retention when downscaling, but usually slower.",
    "nearest": "Nearest neighbor: preserves hard edges for pixel-art style images and UI sprites."
  },
  "ja": {
    "title": "Algorithm guide",
    "browser": "Browser high quality: best default for photos and general use. Fast and smooth in most browsers.",
    "bicubic": "Bicubic interpolation: smoother edges than bilinear, suitable for portrait and product photos.",
    "bilinear": "Bilinear interpolation: balanced sharpness and speed, useful for common resize workflows.",
    "lanczos3": "Lanczos filter (radius 3): highest detail retention when downscaling, but usually slower.",
    "nearest": "Nearest neighbor: preserves hard edges for pixel-art style images and UI sprites."
  },
  "ko": {
    "title": "Algorithm guide",
    "browser": "Browser high quality: best default for photos and general use. Fast and smooth in most browsers.",
    "bicubic": "Bicubic interpolation: smoother edges than bilinear, suitable for portrait and product photos.",
    "bilinear": "Bilinear interpolation: balanced sharpness and speed, useful for common resize workflows.",
    "lanczos3": "Lanczos filter (radius 3): highest detail retention when downscaling, but usually slower.",
    "nearest": "Nearest neighbor: preserves hard edges for pixel-art style images and UI sprites."
  },
  "ru": {
    "title": "Algorithm guide",
    "browser": "Browser high quality: best default for photos and general use. Fast and smooth in most browsers.",
    "bicubic": "Bicubic interpolation: smoother edges than bilinear, suitable for portrait and product photos.",
    "bilinear": "Bilinear interpolation: balanced sharpness and speed, useful for common resize workflows.",
    "lanczos3": "Lanczos filter (radius 3): highest detail retention when downscaling, but usually slower.",
    "nearest": "Nearest neighbor: preserves hard edges for pixel-art style images and UI sprites."
  },
  "pt": {
    "title": "Algorithm guide",
    "browser": "Browser high quality: best default for photos and general use. Fast and smooth in most browsers.",
    "bicubic": "Bicubic interpolation: smoother edges than bilinear, suitable for portrait and product photos.",
    "bilinear": "Bilinear interpolation: balanced sharpness and speed, useful for common resize workflows.",
    "lanczos3": "Lanczos filter (radius 3): highest detail retention when downscaling, but usually slower.",
    "nearest": "Nearest neighbor: preserves hard edges for pixel-art style images and UI sprites."
  },
  "ar": {
    "title": "Algorithm guide",
    "browser": "Browser high quality: best default for photos and general use. Fast and smooth in most browsers.",
    "bicubic": "Bicubic interpolation: smoother edges than bilinear, suitable for portrait and product photos.",
    "bilinear": "Bilinear interpolation: balanced sharpness and speed, useful for common resize workflows.",
    "lanczos3": "Lanczos filter (radius 3): highest detail retention when downscaling, but usually slower.",
    "nearest": "Nearest neighbor: preserves hard edges for pixel-art style images and UI sprites."
  },
  "hi": {
    "title": "Algorithm guide",
    "browser": "Browser high quality: best default for photos and general use. Fast and smooth in most browsers.",
    "bicubic": "Bicubic interpolation: smoother edges than bilinear, suitable for portrait and product photos.",
    "bilinear": "Bilinear interpolation: balanced sharpness and speed, useful for common resize workflows.",
    "lanczos3": "Lanczos filter (radius 3): highest detail retention when downscaling, but usually slower.",
    "nearest": "Nearest neighbor: preserves hard edges for pixel-art style images and UI sprites."
  },
  "tr": {
    "title": "Algorithm guide",
    "browser": "Browser high quality: best default for photos and general use. Fast and smooth in most browsers.",
    "bicubic": "Bicubic interpolation: smoother edges than bilinear, suitable for portrait and product photos.",
    "bilinear": "Bilinear interpolation: balanced sharpness and speed, useful for common resize workflows.",
    "lanczos3": "Lanczos filter (radius 3): highest detail retention when downscaling, but usually slower.",
    "nearest": "Nearest neighbor: preserves hard edges for pixel-art style images and UI sprites."
  },
  "nl": {
    "title": "Algorithm guide",
    "browser": "Browser high quality: best default for photos and general use. Fast and smooth in most browsers.",
    "bicubic": "Bicubic interpolation: smoother edges than bilinear, suitable for portrait and product photos.",
    "bilinear": "Bilinear interpolation: balanced sharpness and speed, useful for common resize workflows.",
    "lanczos3": "Lanczos filter (radius 3): highest detail retention when downscaling, but usually slower.",
    "nearest": "Nearest neighbor: preserves hard edges for pixel-art style images and UI sprites."
  },
  "sv": {
    "title": "Algorithm guide",
    "browser": "Browser high quality: best default for photos and general use. Fast and smooth in most browsers.",
    "bicubic": "Bicubic interpolation: smoother edges than bilinear, suitable for portrait and product photos.",
    "bilinear": "Bilinear interpolation: balanced sharpness and speed, useful for common resize workflows.",
    "lanczos3": "Lanczos filter (radius 3): highest detail retention when downscaling, but usually slower.",
    "nearest": "Nearest neighbor: preserves hard edges for pixel-art style images and UI sprites."
  },
  "pl": {
    "title": "Algorithm guide",
    "browser": "Browser high quality: best default for photos and general use. Fast and smooth in most browsers.",
    "bicubic": "Bicubic interpolation: smoother edges than bilinear, suitable for portrait and product photos.",
    "bilinear": "Bilinear interpolation: balanced sharpness and speed, useful for common resize workflows.",
    "lanczos3": "Lanczos filter (radius 3): highest detail retention when downscaling, but usually slower.",
    "nearest": "Nearest neighbor: preserves hard edges for pixel-art style images and UI sprites."
  },
  "vi": {
    "title": "Algorithm guide",
    "browser": "Browser high quality: best default for photos and general use. Fast and smooth in most browsers.",
    "bicubic": "Bicubic interpolation: smoother edges than bilinear, suitable for portrait and product photos.",
    "bilinear": "Bilinear interpolation: balanced sharpness and speed, useful for common resize workflows.",
    "lanczos3": "Lanczos filter (radius 3): highest detail retention when downscaling, but usually slower.",
    "nearest": "Nearest neighbor: preserves hard edges for pixel-art style images and UI sprites."
  },
  "th": {
    "title": "Algorithm guide",
    "browser": "Browser high quality: best default for photos and general use. Fast and smooth in most browsers.",
    "bicubic": "Bicubic interpolation: smoother edges than bilinear, suitable for portrait and product photos.",
    "bilinear": "Bilinear interpolation: balanced sharpness and speed, useful for common resize workflows.",
    "lanczos3": "Lanczos filter (radius 3): highest detail retention when downscaling, but usually slower.",
    "nearest": "Nearest neighbor: preserves hard edges for pixel-art style images and UI sprites."
  },
  "id": {
    "title": "Algorithm guide",
    "browser": "Browser high quality: best default for photos and general use. Fast and smooth in most browsers.",
    "bicubic": "Bicubic interpolation: smoother edges than bilinear, suitable for portrait and product photos.",
    "bilinear": "Bilinear interpolation: balanced sharpness and speed, useful for common resize workflows.",
    "lanczos3": "Lanczos filter (radius 3): highest detail retention when downscaling, but usually slower.",
    "nearest": "Nearest neighbor: preserves hard edges for pixel-art style images and UI sprites."
  },
  "he": {
    "title": "Algorithm guide",
    "browser": "Browser high quality: best default for photos and general use. Fast and smooth in most browsers.",
    "bicubic": "Bicubic interpolation: smoother edges than bilinear, suitable for portrait and product photos.",
    "bilinear": "Bilinear interpolation: balanced sharpness and speed, useful for common resize workflows.",
    "lanczos3": "Lanczos filter (radius 3): highest detail retention when downscaling, but usually slower.",
    "nearest": "Nearest neighbor: preserves hard edges for pixel-art style images and UI sprites."
  },
  "ms": {
    "title": "Algorithm guide",
    "browser": "Browser high quality: best default for photos and general use. Fast and smooth in most browsers.",
    "bicubic": "Bicubic interpolation: smoother edges than bilinear, suitable for portrait and product photos.",
    "bilinear": "Bilinear interpolation: balanced sharpness and speed, useful for common resize workflows.",
    "lanczos3": "Lanczos filter (radius 3): highest detail retention when downscaling, but usually slower.",
    "nearest": "Nearest neighbor: preserves hard edges for pixel-art style images and UI sprites."
  },
  "no": {
    "title": "Algorithm guide",
    "browser": "Browser high quality: best default for photos and general use. Fast and smooth in most browsers.",
    "bicubic": "Bicubic interpolation: smoother edges than bilinear, suitable for portrait and product photos.",
    "bilinear": "Bilinear interpolation: balanced sharpness and speed, useful for common resize workflows.",
    "lanczos3": "Lanczos filter (radius 3): highest detail retention when downscaling, but usually slower.",
    "nearest": "Nearest neighbor: preserves hard edges for pixel-art style images and UI sprites."
  }
}
</i18n>
