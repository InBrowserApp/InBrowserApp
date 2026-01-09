<template>
  <div class="file-preview">
    <img v-if="previewUrl" :src="previewUrl" class="preview-image" alt="SVG Preview" />
    <div class="file-info">
      <n-text strong>{{ fileName }}</n-text>
      <n-text depth="3" style="margin-left: 8px">{{ formattedSize }}</n-text>
    </div>
    <n-button text type="error" @click="$emit('delete')">
      <template #icon>
        <n-icon><Delete24Regular /></n-icon>
      </template>
      {{ t('delete') }}
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NText, NButton, NIcon } from 'naive-ui'
import { Delete24Regular } from '@shared/icons/fluent'
import { filesize } from 'filesize'

const { t } = useI18n()

const props = defineProps<{
  previewUrl: string | undefined
  fileName: string
  size: number
}>()

defineEmits<{
  delete: []
}>()

const formattedSize = computed(() => filesize(props.size) as string)
</script>

<style scoped>
.file-preview {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
  background: var(--n-color);
}

.preview-image {
  width: 64px;
  height: 64px;
  object-fit: contain;
  border-radius: 4px;
  background: #f5f5f5;
}

.file-info {
  flex: 1;
}
</style>

<i18n lang="json">
{
  "en": { "delete": "Delete" },
  "zh": { "delete": "删除" },
  "zh-CN": { "delete": "删除" },
  "zh-TW": { "delete": "刪除" },
  "zh-HK": { "delete": "刪除" },
  "es": { "delete": "Eliminar" },
  "fr": { "delete": "Supprimer" },
  "de": { "delete": "Löschen" },
  "it": { "delete": "Elimina" },
  "ja": { "delete": "削除" },
  "ko": { "delete": "삭제" },
  "ru": { "delete": "Удалить" },
  "pt": { "delete": "Excluir" },
  "ar": { "delete": "حذف" },
  "hi": { "delete": "हटाएं" },
  "tr": { "delete": "Sil" },
  "nl": { "delete": "Verwijderen" },
  "sv": { "delete": "Ta bort" },
  "pl": { "delete": "Usuń" },
  "vi": { "delete": "Xóa" },
  "th": { "delete": "ลบ" },
  "id": { "delete": "Hapus" },
  "he": { "delete": "מחק" },
  "ms": { "delete": "Padam" },
  "no": { "delete": "Slett" }
}
</i18n>
