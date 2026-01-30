<template>
  <n-text v-if="!analysis" depth="3">{{ t('empty') }}</n-text>
  <div v-else class="results">
    <PasswordStrengthSummary :analysis="analysis" />
    <PasswordStrengthDetails :analysis="analysis" />
    <PasswordStrengthAlerts :analysis="analysis" />
  </div>
</template>

<script setup lang="ts">
import { NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { StrengthReport } from '../utils'
import PasswordStrengthAlerts from './PasswordStrengthAlerts.vue'
import PasswordStrengthDetails from './PasswordStrengthDetails.vue'
import PasswordStrengthSummary from './PasswordStrengthSummary.vue'

const { t } = useI18n()

defineProps<{
  analysis: StrengthReport | null
}>()
</script>

<style scoped>
.results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>

<i18n lang="json">
{
  "en": {
    "empty": "Enter a password to check its strength."
  },
  "zh": {
    "empty": "请输入密码以检查强度。"
  },
  "zh-CN": {
    "empty": "请输入密码以检查强度。"
  },
  "zh-TW": {
    "empty": "請輸入密碼以檢查強度。"
  },
  "zh-HK": {
    "empty": "請輸入密碼以檢查強度。"
  },
  "es": {
    "empty": "Introduce una contraseña para comprobar su fuerza."
  },
  "fr": {
    "empty": "Saisissez un mot de passe pour vérifier sa robustesse."
  },
  "de": {
    "empty": "Geben Sie ein Passwort ein, um die Stärke zu prüfen."
  },
  "it": {
    "empty": "Inserisci una password per verificarne la forza."
  },
  "ja": {
    "empty": "パスワードを入力して強度を確認してください。"
  },
  "ko": {
    "empty": "비밀번호를 입력해 강도를 확인하세요."
  },
  "ru": {
    "empty": "Введите пароль, чтобы проверить его прочность."
  },
  "pt": {
    "empty": "Digite uma senha para verificar a força."
  },
  "ar": {
    "empty": "أدخل كلمة مرور لفحص القوة."
  },
  "hi": {
    "empty": "मजबूती जाँचने के लिए पासवर्ड दर्ज करें।"
  },
  "tr": {
    "empty": "Gücü kontrol etmek için bir parola girin."
  },
  "nl": {
    "empty": "Voer een wachtwoord in om de sterkte te controleren."
  },
  "sv": {
    "empty": "Ange ett lösenord för att kontrollera styrkan."
  },
  "pl": {
    "empty": "Wpisz hasło, aby sprawdzić siłę."
  },
  "vi": {
    "empty": "Nhập mật khẩu để kiểm tra độ mạnh."
  },
  "th": {
    "empty": "กรอกรหัสผ่านเพื่อประเมินความแข็งแรง"
  },
  "id": {
    "empty": "Masukkan kata sandi untuk mengecek kekuatannya."
  },
  "he": {
    "empty": "הזן סיסמה כדי לבדוק את החוזק."
  },
  "ms": {
    "empty": "Masukkan kata laluan untuk semak kekuatan."
  },
  "no": {
    "empty": "Skriv inn et passord for å sjekke styrken."
  }
}
</i18n>
