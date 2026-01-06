<script setup lang="ts">
import { NTag } from 'naive-ui'
import { computed } from 'vue'
import CategoryIcon from './CategoryIcon.vue'
import CategoryI18n from './CategoryI18n.vue'

const props = defineProps<{
  category: string
}>()

const tagType = computed<'success' | 'warning' | 'error' | 'info' | 'default'>(() => {
  switch (props.category) {
    case 'application':
      return 'info'
    case 'audio':
      return 'default'
    case 'font':
      return 'warning'
    case 'image':
      return 'success'
    case 'message':
      return 'info'
    case 'model':
      return 'default'
    case 'multipart':
      return 'info'
    case 'text':
      return 'info'
    case 'video':
      return 'warning'
    default:
      return 'info'
  }
})
</script>

<template>
  <NTag size="small" :type="tagType" :bordered="false">
    <template #icon>
      <CategoryIcon :category="props.category" />
    </template>
    <CategoryI18n :category="props.category" />
  </NTag>
</template>
