<template>
  <PDFInfoFileDetails :info="info" :loading="loading" />
  <PDFInfoMetadataDetails :info="info" :loading="loading" />
  <PDFInfoEncryptedNotice v-if="info.document.encrypted" />
</template>

<script setup lang="ts">
import type { PdfInfo } from '../utils/extractPdfInfo'
import PDFInfoEncryptedNotice from './PDFInfoEncryptedNotice.vue'
import PDFInfoFileDetails from './PDFInfoFileDetails.vue'
import PDFInfoMetadataDetails from './PDFInfoMetadataDetails.vue'

defineProps<{
  info: PdfInfo
  loading: boolean
}>()
</script>
