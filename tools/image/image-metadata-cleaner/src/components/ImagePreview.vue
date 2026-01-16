<template>
  <ToolSection>
    <n-flex align="center" :wrap="false">
      <n-image
        v-if="imagePreview"
        :src="imagePreview"
        height="100"
        style="border-radius: 4px; flex-shrink: 0"
        object-fit="contain"
      />
      <n-flex vertical style="flex: 1; min-width: 0">
        <n-text strong style="word-break: break-all">{{ file.name }}</n-text>
        <n-text depth="3">{{ formattedSize }}</n-text>
      </n-flex>
      <n-button tertiary type="error" @click="emit('clear')">
        <template #icon>
          <n-icon>
            <DeleteIcon />
          </n-icon>
        </template>
        {{ t('remove') }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useObjectUrl } from '@vueuse/core'
import { filesize } from 'filesize'
import { NImage, NFlex, NText, NButton, NIcon } from 'naive-ui'
import { Delete24Regular as DeleteIcon } from '@shared/icons/fluent'
import { ToolSection } from '@shared/ui/tool'

const props = defineProps<{
  file: File
}>()

const emit = defineEmits<{
  clear: []
}>()

const { t } = useI18n()

const imagePreview = useObjectUrl(() => props.file)

const formattedSize = computed(() => filesize(props.file.size))
</script>

<i18n lang="json">
{
  "en": { "remove": "Remove" },
  "zh": { "remove": "移除" },
  "zh-CN": { "remove": "移除" },
  "zh-TW": { "remove": "移除" },
  "zh-HK": { "remove": "移除" },
  "es": { "remove": "Eliminar" },
  "fr": { "remove": "Supprimer" },
  "de": { "remove": "Entfernen" },
  "it": { "remove": "Rimuovi" },
  "ja": { "remove": "削除" },
  "ko": { "remove": "제거" },
  "ru": { "remove": "Удалить" },
  "pt": { "remove": "Remover" },
  "ar": { "remove": "إزالة" },
  "hi": { "remove": "हटाएं" },
  "tr": { "remove": "Kaldır" },
  "nl": { "remove": "Verwijderen" },
  "sv": { "remove": "Ta bort" },
  "pl": { "remove": "Usuń" },
  "vi": { "remove": "Xóa" },
  "th": { "remove": "ลบ" },
  "id": { "remove": "Hapus" },
  "he": { "remove": "הסר" },
  "ms": { "remove": "Buang" },
  "no": { "remove": "Fjern" }
}
</i18n>
