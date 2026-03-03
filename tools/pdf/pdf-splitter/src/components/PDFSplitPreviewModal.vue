<template>
  <n-modal :show="visible" @update:show="handleVisibleChange">
    <n-card style="width: min(980px, 94vw)" :title="modalTitle" closable @close="emit('close')">
      <n-spin :show="isLoading">
        <div class="preview-modal-content">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            :alt="modalTitle"
            :class="{ 'preview-modal-image--loading': isLoading && isFallbackImage }"
          />
        </div>
      </n-spin>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NCard, NModal, NSpin } from 'naive-ui'

const props = defineProps<{
  visible: boolean
  page: number | null
  imageUrl: string | null
  isLoading: boolean
  isFallbackImage: boolean
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { t } = useI18n({ useScope: 'local' })

const modalTitle = computed(() => {
  if (props.page === null) {
    return ''
  }

  return t('previewModalTitle', { page: props.page })
})

const handleVisibleChange = (visible: boolean): void => {
  if (!visible) {
    emit('close')
  }
}
</script>

<style scoped>
.preview-modal-content {
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-modal-content img {
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
  border-radius: 8px;
  transition: filter 0.15s ease;
}

.preview-modal-image--loading {
  filter: blur(1px);
}
</style>

<!-- prettier-ignore -->
<i18n lang="json">
{"en":{"previewModalTitle":"Page {page} Preview"},"zh":{"previewModalTitle":"第 {page} 页预览"},"zh-CN":{"previewModalTitle":"第 {page} 页预览"},"zh-TW":{"previewModalTitle":"第 {page} 頁預覽"},"zh-HK":{"previewModalTitle":"第 {page} 頁預覽"},"es":{"previewModalTitle":"Vista previa de la página {page}"},"fr":{"previewModalTitle":"Aperçu de la page {page}"},"de":{"previewModalTitle":"Vorschau Seite {page}"},"it":{"previewModalTitle":"Anteprima pagina {page}"},"ja":{"previewModalTitle":"ページ {page} のプレビュー"},"ko":{"previewModalTitle":"페이지 {page} 미리보기"},"ru":{"previewModalTitle":"Предпросмотр страницы {page}"},"pt":{"previewModalTitle":"Pré-visualização da página {page}"},"ar":{"previewModalTitle":"معاينة الصفحة {page}"},"hi":{"previewModalTitle":"पेज {page} प्रीव्यू"},"tr":{"previewModalTitle":"Sayfa {page} Önizleme"},"nl":{"previewModalTitle":"Voorbeeld pagina {page}"},"sv":{"previewModalTitle":"Förhandsvisning sida {page}"},"pl":{"previewModalTitle":"Podgląd strony {page}"},"vi":{"previewModalTitle":"Xem trước trang {page}"},"th":{"previewModalTitle":"พรีวิวหน้า {page}"},"id":{"previewModalTitle":"Pratinjau halaman {page}"},"he":{"previewModalTitle":"תצוגה מקדימה של עמוד {page}"},"ms":{"previewModalTitle":"Pratonton halaman {page}"},"no":{"previewModalTitle":"Forhåndsvisning side {page}"}}
</i18n>
