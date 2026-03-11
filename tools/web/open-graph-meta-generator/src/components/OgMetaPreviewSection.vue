<template>
  <ToolSectionHeader>{{ t('previewTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-text depth="3">{{ t('previewNote') }}</n-text>

      <n-card size="small" embedded>
        <n-flex vertical :size="8">
          <n-text strong>{{ t('previewFacebookLabel') }}</n-text>
          <div class="preview-card" data-testid="facebook-preview">
            <div v-if="preview.imageUrl" class="preview-image-wrapper">
              <img :src="preview.imageUrl" :alt="preview.imageAlt" class="preview-image" />
            </div>
            <div v-else class="preview-placeholder">{{ t('previewImagePlaceholder') }}</div>
            <div class="preview-content">
              <n-text depth="3" class="domain">{{ preview.domain }}</n-text>
              <div class="title">{{ preview.title }}</div>
              <n-text class="description">{{ preview.description }}</n-text>
            </div>
          </div>
        </n-flex>
      </n-card>

      <n-card size="small" embedded>
        <n-flex vertical :size="8">
          <n-text strong>{{ t('previewTwitterLabel') }}</n-text>
          <div class="preview-card twitter-card" data-testid="twitter-preview">
            <div class="preview-image-wrapper" :class="twitterImageClass">
              <img
                v-if="preview.imageUrl"
                :src="preview.imageUrl"
                :alt="preview.imageAlt"
                class="preview-image"
              />
              <div v-else class="preview-placeholder">{{ t('previewImagePlaceholder') }}</div>
            </div>
            <div class="preview-content">
              <div class="title">{{ preview.title }}</div>
              <n-text class="description">{{ preview.description }}</n-text>
              <n-text depth="3" class="domain">
                {{ [preview.siteName, preview.domain].join(t('previewSeparator')) }}
              </n-text>
            </div>
          </div>
        </n-flex>
      </n-card>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NFlex, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import type { PreviewModel } from '../meta'
import { messages } from '../locale/messages'

const { preview } = defineProps<{
  preview: PreviewModel
}>()

const { t } = useI18n({ useScope: 'local', messages })

const twitterImageClass = computed(() =>
  preview.twitterCard === 'summary' ? 'preview-image-thumb' : 'preview-image-large',
)
</script>

<style scoped>
.preview-card {
  border: 1px solid var(--n-border-color);
  border-radius: 12px;
  overflow: hidden;
  background: var(--n-color);
}

.twitter-card {
  border-radius: 16px;
}

.preview-image-wrapper {
  background: linear-gradient(135deg, rgba(90, 147, 255, 0.18), rgba(87, 196, 173, 0.18));
}

.preview-image-large {
  aspect-ratio: 1200 / 630;
}

.preview-image-thumb {
  aspect-ratio: 1;
  max-width: 120px;
}

.preview-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  padding: 24px 16px;
  text-align: center;
  color: var(--n-text-color-disabled);
  background: rgba(127, 127, 127, 0.08);
}

.preview-content {
  padding: 14px 16px 16px;
}

.domain {
  text-transform: uppercase;
  font-size: 12px;
}

.title {
  font-weight: 600;
  line-height: 1.3;
  margin: 6px 0;
  word-break: break-word;
}

.description {
  display: block;
  word-break: break-word;
}
</style>
