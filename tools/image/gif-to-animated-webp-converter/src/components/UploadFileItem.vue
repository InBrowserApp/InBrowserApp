<template>
  <n-flex align="center" justify="space-between" :size="12" class="upload-item">
    <n-flex align="center" :size="12">
      <div class="preview-box">
        <img v-if="previewUrl" :src="previewUrl" :alt="file.name" class="preview-image" />
      </div>
      <n-flex vertical :size="2">
        <n-text strong>{{ file.name }}</n-text>
        <n-text depth="3">{{ sizeLabel }}</n-text>
      </n-flex>
    </n-flex>
    <n-button size="small" @click="emit('remove')">
      <template #icon>
        <n-icon><Delete20Regular /></n-icon>
      </template>
      {{ removeLabel }}
    </n-button>
  </n-flex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { filesize } from 'filesize'
import { NButton, NFlex, NIcon, NText } from 'naive-ui'
import Delete20Regular from '@vicons/fluent/Delete20Regular'

const props = defineProps<{
  file: File
  removeLabel: string
}>()

const emit = defineEmits<{
  remove: []
}>()

const previewUrl = useObjectUrl(computed(() => props.file))
const sizeLabel = computed(() => filesize(props.file.size) as string)
</script>

<style scoped>
.upload-item {
  width: 100%;
}

.preview-box {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  border: 1px solid var(--n-border-color);
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
