<template>
  <ToolSectionHeader>{{ t('event-details') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 900:2" x-gap="12" y-gap="12">
      <n-form-item-gi :label="t('title')" :show-feedback="false">
        <n-input v-model:value="titleModel" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('location')" :show-feedback="false">
        <n-input v-model:value="locationModel" />
      </n-form-item-gi>
    </n-grid>

    <n-grid cols="1" y-gap="12" style="margin-top: 12px">
      <n-form-item-gi :label="t('description')" :show-feedback="false">
        <n-input v-model:value="descriptionModel" type="textarea" :autosize="{ minRows: 3 }" />
      </n-form-item-gi>
    </n-grid>

    <n-grid cols="1 900:2" x-gap="12" y-gap="12" style="margin-top: 12px">
      <n-form-item-gi :label="t('url')" :show-feedback="false">
        <n-input v-model:value="urlModel" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('uid')" :show-feedback="false" content-style="width: 100%">
        <n-flex align="center" :size="8" :wrap="false" style="width: 100%">
          <n-input v-model:value="uidModel" readonly style="flex: 1; min-width: 0; width: 100%" />
          <n-button tertiary size="small" @click="emit('regenerate-uid')">
            <template #icon>
              <n-icon :component="ArrowCounterclockwise16Regular" />
            </template>
            {{ t('new-uid') }}
          </n-button>
        </n-flex>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NFormItemGi, NGrid, NIcon, NInput } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ArrowCounterclockwise16Regular from '@vicons/fluent/ArrowCounterclockwise16Regular'

const emit = defineEmits<{
  (event: 'regenerate-uid'): void
}>()

const { t } = useI18n()

const titleModel = defineModel<string>('title', { required: true })
const locationModel = defineModel<string>('location', { required: true })
const descriptionModel = defineModel<string>('description', { required: true })
const urlModel = defineModel<string>('url', { required: true })
const uidModel = defineModel<string>('uid', { required: true })
</script>

<i18n lang="json">
{
  "en": {
    "event-details": "Event details",
    "title": "Title",
    "location": "Location",
    "description": "Description",
    "url": "URL",
    "uid": "UID",
    "new-uid": "New UID"
  },
  "zh": {
    "event-details": "事件信息",
    "title": "标题",
    "location": "地点",
    "description": "描述",
    "url": "链接",
    "uid": "UID",
    "new-uid": "生成新 UID"
  },
  "zh-CN": {
    "event-details": "事件信息",
    "title": "标题",
    "location": "地点",
    "description": "描述",
    "url": "链接",
    "uid": "UID",
    "new-uid": "生成新 UID"
  },
  "zh-TW": {
    "event-details": "事件資訊",
    "title": "標題",
    "location": "地點",
    "description": "描述",
    "url": "連結",
    "uid": "UID",
    "new-uid": "產生新 UID"
  },
  "zh-HK": {
    "event-details": "事件資訊",
    "title": "標題",
    "location": "地點",
    "description": "描述",
    "url": "連結",
    "uid": "UID",
    "new-uid": "產生新 UID"
  },
  "es": {
    "event-details": "Detalles del evento",
    "title": "Título",
    "location": "Ubicación",
    "description": "Descripción",
    "url": "URL",
    "uid": "UID",
    "new-uid": "Nuevo UID"
  },
  "fr": {
    "event-details": "Détails de l'événement",
    "title": "Titre",
    "location": "Lieu",
    "description": "Description",
    "url": "URL",
    "uid": "UID",
    "new-uid": "Nouvel UID"
  },
  "de": {
    "event-details": "Ereignisdetails",
    "title": "Titel",
    "location": "Ort",
    "description": "Beschreibung",
    "url": "URL",
    "uid": "UID",
    "new-uid": "Neue UID"
  },
  "it": {
    "event-details": "Dettagli evento",
    "title": "Titolo",
    "location": "Posizione",
    "description": "Descrizione",
    "url": "URL",
    "uid": "UID",
    "new-uid": "Nuovo UID"
  },
  "ja": {
    "event-details": "イベント詳細",
    "title": "タイトル",
    "location": "場所",
    "description": "説明",
    "url": "URL",
    "uid": "UID",
    "new-uid": "新しい UID"
  },
  "ko": {
    "event-details": "이벤트 상세",
    "title": "제목",
    "location": "위치",
    "description": "설명",
    "url": "URL",
    "uid": "UID",
    "new-uid": "새 UID"
  },
  "ru": {
    "event-details": "Детали события",
    "title": "Название",
    "location": "Место",
    "description": "Описание",
    "url": "URL",
    "uid": "UID",
    "new-uid": "Новый UID"
  },
  "pt": {
    "event-details": "Detalhes do evento",
    "title": "Título",
    "location": "Local",
    "description": "Descrição",
    "url": "URL",
    "uid": "UID",
    "new-uid": "Novo UID"
  },
  "ar": {
    "event-details": "تفاصيل الحدث",
    "title": "العنوان",
    "location": "الموقع",
    "description": "الوصف",
    "url": "الرابط",
    "uid": "UID",
    "new-uid": "معرّف UID جديد"
  },
  "hi": {
    "event-details": "इवेंट विवरण",
    "title": "शीर्षक",
    "location": "स्थान",
    "description": "विवरण",
    "url": "URL",
    "uid": "UID",
    "new-uid": "नया UID"
  },
  "tr": {
    "event-details": "Etkinlik ayrıntıları",
    "title": "Başlık",
    "location": "Konum",
    "description": "Açıklama",
    "url": "URL",
    "uid": "UID",
    "new-uid": "Yeni UID"
  },
  "nl": {
    "event-details": "Evenementdetails",
    "title": "Titel",
    "location": "Locatie",
    "description": "Beschrijving",
    "url": "URL",
    "uid": "UID",
    "new-uid": "Nieuwe UID"
  },
  "sv": {
    "event-details": "Händelsedetaljer",
    "title": "Titel",
    "location": "Plats",
    "description": "Beskrivning",
    "url": "URL",
    "uid": "UID",
    "new-uid": "Ny UID"
  },
  "pl": {
    "event-details": "Szczegóły wydarzenia",
    "title": "Tytuł",
    "location": "Lokalizacja",
    "description": "Opis",
    "url": "URL",
    "uid": "UID",
    "new-uid": "Nowy UID"
  },
  "vi": {
    "event-details": "Chi tiết sự kiện",
    "title": "Tiêu đề",
    "location": "Địa điểm",
    "description": "Mô tả",
    "url": "URL",
    "uid": "UID",
    "new-uid": "UID mới"
  },
  "th": {
    "event-details": "รายละเอียดกิจกรรม",
    "title": "ชื่อเรื่อง",
    "location": "สถานที่",
    "description": "คำอธิบาย",
    "url": "URL",
    "uid": "UID",
    "new-uid": "UID ใหม่"
  },
  "id": {
    "event-details": "Detail acara",
    "title": "Judul",
    "location": "Lokasi",
    "description": "Deskripsi",
    "url": "URL",
    "uid": "UID",
    "new-uid": "UID baru"
  },
  "he": {
    "event-details": "פרטי האירוע",
    "title": "כותרת",
    "location": "מיקום",
    "description": "תיאור",
    "url": "URL",
    "uid": "UID",
    "new-uid": "UID חדש"
  },
  "ms": {
    "event-details": "Butiran acara",
    "title": "Tajuk",
    "location": "Lokasi",
    "description": "Penerangan",
    "url": "URL",
    "uid": "UID",
    "new-uid": "UID baharu"
  },
  "no": {
    "event-details": "Hendelsesdetaljer",
    "title": "Tittel",
    "location": "Sted",
    "description": "Beskrivelse",
    "url": "URL",
    "uid": "UID",
    "new-uid": "Ny UID"
  }
}
</i18n>
