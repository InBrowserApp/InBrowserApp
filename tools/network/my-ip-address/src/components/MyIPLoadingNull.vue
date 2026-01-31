<template>
  <span>
    <template v-if="ip === undefined">
      <n-skeleton text style="width: 8.5em" />
    </template>
    <template v-if="ip === null">
      <span>{{ t('unable-to-get-ip') }}</span>
    </template>
  </span>
</template>

<script setup lang="ts">
import { NSkeleton } from 'naive-ui'
import { useI18n } from 'vue-i18n'

defineProps<{
  ip: undefined | null
}>()

const { t } = useI18n()
</script>

<style scoped>
.link {
  color: inherit;
  text-decoration: inherit;
}

.link:hover {
  text-decoration: underline;
}
</style>

<i18n lang="json">
{
  "en": {
    "unable-to-get-ip": "Unable to get IP"
  },
  "zh": {
    "unable-to-get-ip": "无法获取 IP"
  },
  "zh-CN": {
    "unable-to-get-ip": "无法获取 IP"
  },
  "zh-TW": {
    "unable-to-get-ip": "無法取得 IP"
  },
  "zh-HK": {
    "unable-to-get-ip": "無法取得 IP"
  },
  "es": {
    "unable-to-get-ip": "No se puede obtener la IP"
  },
  "fr": {
    "unable-to-get-ip": "Impossible d'obtenir l'IP"
  },
  "de": {
    "unable-to-get-ip": "IP kann nicht abgerufen werden"
  },
  "it": {
    "unable-to-get-ip": "Impossibile ottenere l'IP"
  },
  "ja": {
    "unable-to-get-ip": "IP を取得できません"
  },
  "ko": {
    "unable-to-get-ip": "IP 를 가져올 수 없습니다"
  },
  "ru": {
    "unable-to-get-ip": "Невозможно получить IP"
  },
  "pt": {
    "unable-to-get-ip": "Não é possível obter o IP"
  },
  "ar": {
    "unable-to-get-ip": "غير قادر على الحصول على IP"
  },
  "hi": {
    "unable-to-get-ip": "IP प्राप्त करने में असमर्थ"
  },
  "tr": {
    "unable-to-get-ip": "IP alınamıyor"
  },
  "nl": {
    "unable-to-get-ip": "Kan IP niet ophalen"
  },
  "sv": {
    "unable-to-get-ip": "Kan inte hämta IP"
  },
  "pl": {
    "unable-to-get-ip": "Nie można uzyskać IP"
  },
  "vi": {
    "unable-to-get-ip": "Không thể lấy IP"
  },
  "th": {
    "unable-to-get-ip": "ไม่สามารถรับ IP ได้"
  },
  "id": {
    "unable-to-get-ip": "Tidak dapat memperoleh IP"
  },
  "he": {
    "unable-to-get-ip": "לא ניתן לקבל IP"
  },
  "ms": {
    "unable-to-get-ip": "Tidak dapat mendapatkan IP"
  },
  "no": {
    "unable-to-get-ip": "Kan ikke hente IP"
  }
}
</i18n>
