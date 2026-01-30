<template>
  <ToolSectionHeader>{{ t('input-title') }}</ToolSectionHeader>
  <ToolSection>
    <PasswordStrengthInputSection v-model:password="password" />
  </ToolSection>

  <ToolSectionHeader>{{ t('results-title') }}</ToolSectionHeader>
  <ToolSection>
    <PasswordStrengthResults :analysis="analysis" />
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { analyzePassword } from '../utils'
import PasswordStrengthInputSection from './PasswordStrengthInputSection.vue'
import PasswordStrengthResults from './PasswordStrengthResults.vue'

const { t } = useI18n()

const password = useStorage('tools:password-strength-checker:password', '')
const analysis = computed(() => analyzePassword(password.value))
</script>

<i18n lang="json">
{
  "en": {
    "input-title": "Password",
    "results-title": "Strength Summary"
  },
  "zh": {
    "input-title": "密码",
    "results-title": "强度摘要"
  },
  "zh-CN": {
    "input-title": "密码",
    "results-title": "强度摘要"
  },
  "zh-TW": {
    "input-title": "密碼",
    "results-title": "強度摘要"
  },
  "zh-HK": {
    "input-title": "密碼",
    "results-title": "強度摘要"
  },
  "es": {
    "input-title": "Contraseña",
    "results-title": "Resumen de fuerza"
  },
  "fr": {
    "input-title": "Mot de passe",
    "results-title": "Résumé de robustesse"
  },
  "de": {
    "input-title": "Passwort",
    "results-title": "Stärkeübersicht"
  },
  "it": {
    "input-title": "Password",
    "results-title": "Riepilogo forza"
  },
  "ja": {
    "input-title": "パスワード",
    "results-title": "強度サマリー"
  },
  "ko": {
    "input-title": "비밀번호",
    "results-title": "강도 요약"
  },
  "ru": {
    "input-title": "Пароль",
    "results-title": "Сводка прочности"
  },
  "pt": {
    "input-title": "Senha",
    "results-title": "Resumo de força"
  },
  "ar": {
    "input-title": "كلمة المرور",
    "results-title": "ملخص القوة"
  },
  "hi": {
    "input-title": "पासवर्ड",
    "results-title": "मजबूती सारांश"
  },
  "tr": {
    "input-title": "Parola",
    "results-title": "Güç özeti"
  },
  "nl": {
    "input-title": "Wachtwoord",
    "results-title": "Sterkteoverzicht"
  },
  "sv": {
    "input-title": "Lösenord",
    "results-title": "Styrkesammanfattning"
  },
  "pl": {
    "input-title": "Hasło",
    "results-title": "Podsumowanie siły"
  },
  "vi": {
    "input-title": "Mật khẩu",
    "results-title": "Tóm tắt độ mạnh"
  },
  "th": {
    "input-title": "รหัสผ่าน",
    "results-title": "สรุปความแข็งแรง"
  },
  "id": {
    "input-title": "Kata sandi",
    "results-title": "Ringkasan kekuatan"
  },
  "he": {
    "input-title": "סיסמה",
    "results-title": "סיכום חוזק"
  },
  "ms": {
    "input-title": "Kata laluan",
    "results-title": "Ringkasan kekuatan"
  },
  "no": {
    "input-title": "Passord",
    "results-title": "Styrkesammendrag"
  }
}
</i18n>
