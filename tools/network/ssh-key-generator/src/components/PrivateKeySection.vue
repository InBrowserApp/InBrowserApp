<template>
  <ToolSection>
    <ToolSectionHeader>
      <n-flex align="center" :size="8">
        {{ t('privateKey') }}
        <n-tag size="small" type="error" :bordered="false">{{ t('keepSecret') }}</n-tag>
      </n-flex>
    </ToolSectionHeader>
    <n-input
      :value="value"
      type="textarea"
      readonly
      :loading="loading"
      :autosize="{ minRows: 6, maxRows: 12 }"
      placeholder=""
      class="private-key-input"
      :class="{ 'private-key-hidden': !visible }"
      style="font-family: monospace"
    />
    <n-flex :size="8" style="margin-top: 8px">
      <CopyToClipboardButton :text="value" />
      <n-button text tag="a" :href="blobUrl" :download="filename">
        <template #icon>
          <n-icon :component="ArrowDownload16Regular" />
        </template>
        {{ t('download') }}
      </n-button>
      <n-button text @click="visible = !visible">
        <template #icon>
          <n-icon :component="visible ? EyeOff16Regular : Eye16Regular" />
        </template>
        {{ visible ? t('hide') : t('show') }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useObjectUrl } from '@vueuse/core'
import { NInput, NFlex, NButton, NIcon, NTag } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Eye16Regular from '@vicons/fluent/Eye16Regular'
import EyeOff16Regular from '@vicons/fluent/EyeOff16Regular'
const props = defineProps<{
  value: string
  filename: string
  loading?: boolean
}>()

const { t } = useI18n()

const visible = ref(false)

const blob = computed(() => new Blob([props.value], { type: 'text/plain' }))
const blobUrl = useObjectUrl(blob)
</script>

<style scoped>
.private-key-input :deep(textarea) {
  transition: filter 0.2s ease;
}

.private-key-hidden :deep(textarea) {
  filter: blur(8px);
}
</style>

<i18n lang="json">
{
  "en": {
    "privateKey": "Private Key",
    "keepSecret": "Keep secret!",
    "download": "Download",
    "show": "Show",
    "hide": "Hide"
  },
  "zh": {
    "privateKey": "私钥",
    "keepSecret": "请保密！",
    "download": "下载",
    "show": "显示",
    "hide": "隐藏"
  },
  "zh-CN": {
    "privateKey": "私钥",
    "keepSecret": "请保密！",
    "download": "下载",
    "show": "显示",
    "hide": "隐藏"
  },
  "zh-TW": {
    "privateKey": "私鑰",
    "keepSecret": "請保密！",
    "download": "下載",
    "show": "顯示",
    "hide": "隱藏"
  },
  "zh-HK": {
    "privateKey": "私鑰",
    "keepSecret": "請保密！",
    "download": "下載",
    "show": "顯示",
    "hide": "隱藏"
  },
  "es": {
    "privateKey": "Clave Privada",
    "keepSecret": "¡Mantener en secreto!",
    "download": "Descargar",
    "show": "Mostrar",
    "hide": "Ocultar"
  },
  "fr": {
    "privateKey": "Clé Privée",
    "keepSecret": "À garder secrète !",
    "download": "Télécharger",
    "show": "Afficher",
    "hide": "Masquer"
  },
  "de": {
    "privateKey": "Privater Schlüssel",
    "keepSecret": "Geheim halten!",
    "download": "Herunterladen",
    "show": "Anzeigen",
    "hide": "Ausblenden"
  },
  "it": {
    "privateKey": "Chiave Privata",
    "keepSecret": "Mantenere segreto!",
    "download": "Scarica",
    "show": "Mostra",
    "hide": "Nascondi"
  },
  "ja": {
    "privateKey": "秘密鍵",
    "keepSecret": "秘密厳守！",
    "download": "ダウンロード",
    "show": "表示",
    "hide": "非表示"
  },
  "ko": {
    "privateKey": "개인 키",
    "keepSecret": "비밀 유지!",
    "download": "다운로드",
    "show": "표시",
    "hide": "숨기기"
  },
  "ru": {
    "privateKey": "Закрытый Ключ",
    "keepSecret": "Держать в секрете!",
    "download": "Скачать",
    "show": "Показать",
    "hide": "Скрыть"
  },
  "pt": {
    "privateKey": "Chave Privada",
    "keepSecret": "Manter em segredo!",
    "download": "Baixar",
    "show": "Mostrar",
    "hide": "Ocultar"
  },
  "ar": {
    "privateKey": "المفتاح الخاص",
    "keepSecret": "احتفظ به سرياً!",
    "download": "تحميل",
    "show": "إظهار",
    "hide": "إخفاء"
  },
  "hi": {
    "privateKey": "निजी कुंजी",
    "keepSecret": "गोपनीय रखें!",
    "download": "डाउनलोड",
    "show": "दिखाएं",
    "hide": "छुपाएं"
  },
  "tr": {
    "privateKey": "Özel Anahtar",
    "keepSecret": "Gizli tutun!",
    "download": "İndir",
    "show": "Göster",
    "hide": "Gizle"
  },
  "nl": {
    "privateKey": "Privé Sleutel",
    "keepSecret": "Geheim houden!",
    "download": "Downloaden",
    "show": "Tonen",
    "hide": "Verbergen"
  },
  "sv": {
    "privateKey": "Privat Nyckel",
    "keepSecret": "Håll hemlig!",
    "download": "Ladda ner",
    "show": "Visa",
    "hide": "Dölj"
  },
  "pl": {
    "privateKey": "Klucz Prywatny",
    "keepSecret": "Zachowaj w tajemnicy!",
    "download": "Pobierz",
    "show": "Pokaż",
    "hide": "Ukryj"
  },
  "vi": {
    "privateKey": "Khóa Riêng Tư",
    "keepSecret": "Giữ bí mật!",
    "download": "Tải xuống",
    "show": "Hiển thị",
    "hide": "Ẩn"
  },
  "th": {
    "privateKey": "คีย์ส่วนตัว",
    "keepSecret": "เก็บเป็นความลับ!",
    "download": "ดาวน์โหลด",
    "show": "แสดง",
    "hide": "ซ่อน"
  },
  "id": {
    "privateKey": "Kunci Pribadi",
    "keepSecret": "Jaga kerahasiaan!",
    "download": "Unduh",
    "show": "Tampilkan",
    "hide": "Sembunyikan"
  },
  "he": {
    "privateKey": "מפתח פרטי",
    "keepSecret": "שמור בסוד!",
    "download": "הורדה",
    "show": "הצג",
    "hide": "הסתר"
  },
  "ms": {
    "privateKey": "Kunci Peribadi",
    "keepSecret": "Simpan rahsia!",
    "download": "Muat Turun",
    "show": "Tunjuk",
    "hide": "Sembunyi"
  },
  "no": {
    "privateKey": "Privat Nøkkel",
    "keepSecret": "Hold hemmelig!",
    "download": "Last ned",
    "show": "Vis",
    "hide": "Skjul"
  }
}
</i18n>
