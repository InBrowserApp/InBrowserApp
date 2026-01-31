<template>
  <ToolSection v-if="result || error">
    <ToolSectionHeader>{{ t('result') }}</ToolSectionHeader>

    <NAlert v-if="error && !result" type="warning" :title="t('noResult')">
      {{ error }}
    </NAlert>
    <template v-else />

    <template v-if="result">
      <NFlex vertical :size="12">
        <NCard>
          <NFlex justify="space-between" align="start">
            <NText class="result-text" style="word-break: break-all">
              {{ result.text }}
            </NText>
            <CopyToClipboardButton :content="result.text" />
          </NFlex>
        </NCard>

        <NFlex :size="8" align="center">
          <NTag v-if="formatLabel" type="info">{{ formatLabel }}</NTag>
          <template v-else />
          <NTag :type="contentType.type">{{ contentType.label }}</NTag>
          <NButton
            v-if="contentType.isUrl"
            text
            tag="a"
            :href="result.text"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ t('openLink') }}
          </NButton>
          <template v-else />
        </NFlex>
      </NFlex>
    </template>
    <template v-else />
  </ToolSection>
  <template v-else />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NAlert, NButton, NCard, NFlex, NTag, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import type { BarcodeScanResult } from '../barcode-reader'

const props = defineProps<{
  result: BarcodeScanResult | null
  error: string | null
}>()

const { t } = useI18n()

const formatLabel = computed(() =>
  props.result?.format ? props.result.format.replace(/_/g, ' ') : '',
)

const contentType = computed(() => {
  if (!props.result) return { label: '', type: 'default' as const, isUrl: false }

  const text = props.result.text

  if (/^https?:\/\//i.test(text)) {
    return { label: 'URL', type: 'info' as const, isUrl: true }
  }

  if (/^mailto:/i.test(text)) {
    return { label: 'Email', type: 'success' as const, isUrl: true }
  }

  if (/^tel:/i.test(text)) {
    return { label: t('phone'), type: 'success' as const, isUrl: true }
  }

  if (/^sms:/i.test(text)) {
    return { label: 'SMS', type: 'success' as const, isUrl: true }
  }

  if (/^WIFI:/i.test(text)) {
    return { label: 'WiFi', type: 'warning' as const, isUrl: false }
  }

  if (/^BEGIN:VCARD/i.test(text)) {
    return { label: 'vCard', type: 'success' as const, isUrl: false }
  }

  if (/^BEGIN:VCALENDAR/i.test(text)) {
    return { label: t('calendar'), type: 'success' as const, isUrl: false }
  }

  if (/^geo:/i.test(text)) {
    return { label: t('location'), type: 'info' as const, isUrl: true }
  }

  return { label: t('text'), type: 'default' as const, isUrl: false }
})
</script>

<style scoped>
.result-text {
  font-family: monospace;
  white-space: pre-wrap;
}
</style>

<i18n lang="json">
{
  "en": {
    "result": "Result",
    "noResult": "No Code Found",
    "openLink": "Open Link",
    "text": "Text",
    "phone": "Phone",
    "calendar": "Calendar",
    "location": "Location"
  },
  "zh": {
    "result": "结果",
    "noResult": "未找到条码",
    "openLink": "打开链接",
    "text": "文本",
    "phone": "电话",
    "calendar": "日历",
    "location": "位置"
  },
  "zh-CN": {
    "result": "结果",
    "noResult": "未找到条码",
    "openLink": "打开链接",
    "text": "文本",
    "phone": "电话",
    "calendar": "日历",
    "location": "位置"
  },
  "zh-TW": {
    "result": "結果",
    "noResult": "未找到條碼",
    "openLink": "開啟連結",
    "text": "文字",
    "phone": "電話",
    "calendar": "日曆",
    "location": "位置"
  },
  "zh-HK": {
    "result": "結果",
    "noResult": "未找到條碼",
    "openLink": "開啟連結",
    "text": "文字",
    "phone": "電話",
    "calendar": "日曆",
    "location": "位置"
  },
  "es": {
    "result": "Resultado",
    "noResult": "No se encontro ningun codigo",
    "openLink": "Abrir enlace",
    "text": "Texto",
    "phone": "Telefono",
    "calendar": "Calendario",
    "location": "Ubicacion"
  },
  "fr": {
    "result": "Resultat",
    "noResult": "Aucun code trouve",
    "openLink": "Ouvrir le lien",
    "text": "Texte",
    "phone": "Telephone",
    "calendar": "Calendrier",
    "location": "Emplacement"
  },
  "de": {
    "result": "Ergebnis",
    "noResult": "Kein Code gefunden",
    "openLink": "Link offnen",
    "text": "Text",
    "phone": "Telefon",
    "calendar": "Kalender",
    "location": "Standort"
  },
  "it": {
    "result": "Risultato",
    "noResult": "Nessun codice trovato",
    "openLink": "Apri link",
    "text": "Testo",
    "phone": "Telefono",
    "calendar": "Calendario",
    "location": "Posizione"
  },
  "ja": {
    "result": "結果",
    "noResult": "コードが見つかりません",
    "openLink": "リンクを開く",
    "text": "テキスト",
    "phone": "電話",
    "calendar": "カレンダー",
    "location": "位置"
  },
  "ko": {
    "result": "결과",
    "noResult": "코드를 찾을 수 없습니다",
    "openLink": "링크 열기",
    "text": "텍스트",
    "phone": "전화",
    "calendar": "캘린더",
    "location": "위치"
  },
  "ru": {
    "result": "Результат",
    "noResult": "Код не найден",
    "openLink": "Открыть ссылку",
    "text": "Текст",
    "phone": "Телефон",
    "calendar": "Календарь",
    "location": "Местоположение"
  },
  "pt": {
    "result": "Resultado",
    "noResult": "Nenhum codigo encontrado",
    "openLink": "Abrir link",
    "text": "Texto",
    "phone": "Telefone",
    "calendar": "Calendario",
    "location": "Localizacao"
  },
  "ar": {
    "result": "النتيجة",
    "noResult": "لم يتم العثور على رمز",
    "openLink": "فتح الرابط",
    "text": "نص",
    "phone": "هاتف",
    "calendar": "تقويم",
    "location": "الموقع"
  },
  "hi": {
    "result": "परिणाम",
    "noResult": "कोई कोड नहीं मिला",
    "openLink": "लिंक खोलें",
    "text": "पाठ",
    "phone": "फ़ोन",
    "calendar": "कैलेंडर",
    "location": "स्थान"
  },
  "tr": {
    "result": "Sonuc",
    "noResult": "Kod bulunamadi",
    "openLink": "Baglantiyi ac",
    "text": "Metin",
    "phone": "Telefon",
    "calendar": "Takvim",
    "location": "Konum"
  },
  "nl": {
    "result": "Resultaat",
    "noResult": "Geen code gevonden",
    "openLink": "Link openen",
    "text": "Tekst",
    "phone": "Telefoon",
    "calendar": "Kalender",
    "location": "Locatie"
  },
  "sv": {
    "result": "Resultat",
    "noResult": "Ingen kod hittades",
    "openLink": "Oppna lanken",
    "text": "Text",
    "phone": "Telefon",
    "calendar": "Kalender",
    "location": "Plats"
  },
  "pl": {
    "result": "Wynik",
    "noResult": "Nie znaleziono kodu",
    "openLink": "Otworz link",
    "text": "Tekst",
    "phone": "Telefon",
    "calendar": "Kalendarz",
    "location": "Lokalizacja"
  },
  "vi": {
    "result": "Ket qua",
    "noResult": "Khong tim thay ma",
    "openLink": "Mo lien ket",
    "text": "Van ban",
    "phone": "Dien thoai",
    "calendar": "Lich",
    "location": "Vi tri"
  },
  "th": {
    "result": "ผลลัพธ์",
    "noResult": "ไม่พบโค้ด",
    "openLink": "เปิดลิงก์",
    "text": "ข้อความ",
    "phone": "โทรศัพท์",
    "calendar": "ปฏิทิน",
    "location": "ตำแหน่ง"
  },
  "id": {
    "result": "Hasil",
    "noResult": "Tidak ada kode ditemukan",
    "openLink": "Buka tautan",
    "text": "Teks",
    "phone": "Telepon",
    "calendar": "Kalender",
    "location": "Lokasi"
  },
  "he": {
    "result": "תוצאה",
    "noResult": "לא נמצא קוד",
    "openLink": "פתח קישור",
    "text": "טקסט",
    "phone": "טלפון",
    "calendar": "לוח שנה",
    "location": "מיקום"
  },
  "ms": {
    "result": "Keputusan",
    "noResult": "Tiada kod ditemui",
    "openLink": "Buka pautan",
    "text": "Teks",
    "phone": "Telefon",
    "calendar": "Kalendar",
    "location": "Lokasi"
  },
  "no": {
    "result": "Resultat",
    "noResult": "Ingen kode funnet",
    "openLink": "Apne lenke",
    "text": "Tekst",
    "phone": "Telefon",
    "calendar": "Kalender",
    "location": "Plassering"
  }
}
</i18n>
