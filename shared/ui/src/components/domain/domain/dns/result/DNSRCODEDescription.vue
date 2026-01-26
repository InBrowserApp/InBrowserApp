<template>
  {{ description }}
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { messages } from './locale/messages'

const { t } = useI18n({ messages })

const props = defineProps<{
  rcode: number
}>()

const description = computed(() => {
  // eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys
  const i18nText = t(`dns.rcode.${props.rcode}.description`)
  if (i18nText === `dns.rcode.${props.rcode}.description`) {
    return t('common.unknown')
  }
  return i18nText
})
</script>
