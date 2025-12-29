<template>
  <InfoStatistic :label="t('user-agent')" :value="userAgent" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InfoStatistic from '../common/InfoStatistic.vue'

const { t } = useI18n()

const userAgent = computed(() => navigator.userAgent)
</script>

<i18n lang="json">
{
  "en": {
    "user-agent": "User Agent"
  },
  "zh": {
    "user-agent": "用户代理"
  },
  "zh-CN": {
    "user-agent": "用户代理"
  },
  "zh-TW": {
    "user-agent": "使用者代理"
  },
  "zh-HK": {
    "user-agent": "使用者代理"
  },
  "es": {
    "user-agent": "Agente de Usuario"
  },
  "fr": {
    "user-agent": "Agent Utilisateur"
  },
  "de": {
    "user-agent": "Benutzeragent"
  },
  "it": {
    "user-agent": "User Agent"
  },
  "ja": {
    "user-agent": "ユーザーエージェント"
  },
  "ko": {
    "user-agent": "사용자 에이전트"
  },
  "ru": {
    "user-agent": "Агент Пользователя"
  },
  "pt": {
    "user-agent": "Agente do Usuario"
  },
  "ar": {
    "user-agent": "وكيل المستخدم"
  },
  "hi": {
    "user-agent": "उपयोगकर्ता एजेंट"
  },
  "tr": {
    "user-agent": "Kullanici Aracisi"
  },
  "nl": {
    "user-agent": "Gebruikersagent"
  },
  "sv": {
    "user-agent": "Anvandaragent"
  },
  "pl": {
    "user-agent": "Agent Uzytkownika"
  },
  "vi": {
    "user-agent": "Tac Nhan Nguoi Dung"
  },
  "th": {
    "user-agent": "ตัวแทนผู้ใช้"
  },
  "id": {
    "user-agent": "Agen Pengguna"
  },
  "he": {
    "user-agent": "סוכן משתמש"
  },
  "ms": {
    "user-agent": "Ejen Pengguna"
  },
  "no": {
    "user-agent": "Brukeragent"
  }
}
</i18n>
