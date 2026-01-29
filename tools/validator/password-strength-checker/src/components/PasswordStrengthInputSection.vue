<template>
  <n-form-item :label="t('password-label')">
    <n-input
      v-model:value="password"
      :type="showPassword ? 'text' : 'password'"
      :placeholder="t('password-placeholder')"
    >
      <template #suffix>
        <n-button text size="small" @click="toggleVisibility">
          {{ showPassword ? t('hide') : t('show') }}
        </n-button>
      </template>
    </n-input>
  </n-form-item>
  <n-text depth="3" class="hint">{{ t('privacy-hint') }}</n-text>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NFormItem, NInput, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const password = defineModel<string>('password', { default: '' })
const showPassword = ref(false)

function toggleVisibility() {
  showPassword.value = !showPassword.value
}
</script>

<style scoped>
.hint {
  display: block;
  margin-top: 8px;
}
</style>

<i18n lang="json">
{
  "en": {
    "password-label": "Password",
    "password-placeholder": "Type a password to evaluate",
    "show": "Show",
    "hide": "Hide",
    "privacy-hint": "Strength checks run locally in your browser."
  },
  "zh": {
    "password-label": "密码",
    "password-placeholder": "输入要评估的密码",
    "show": "显示",
    "hide": "隐藏",
    "privacy-hint": "强度检测在本地浏览器中完成。"
  },
  "zh-CN": {
    "password-label": "密码",
    "password-placeholder": "输入要评估的密码",
    "show": "显示",
    "hide": "隐藏",
    "privacy-hint": "强度检测在本地浏览器中完成。"
  },
  "zh-TW": {
    "password-label": "密碼",
    "password-placeholder": "輸入要評估的密碼",
    "show": "顯示",
    "hide": "隱藏",
    "privacy-hint": "強度檢測在本地瀏覽器中完成。"
  },
  "zh-HK": {
    "password-label": "密碼",
    "password-placeholder": "輸入要評估嘅密碼",
    "show": "顯示",
    "hide": "隱藏",
    "privacy-hint": "強度檢測喺本地瀏覽器完成。"
  },
  "es": {
    "password-label": "Contraseña",
    "password-placeholder": "Escribe una contraseña para evaluar",
    "show": "Mostrar",
    "hide": "Ocultar",
    "privacy-hint": "Las comprobaciones se realizan localmente en tu navegador."
  },
  "fr": {
    "password-label": "Mot de passe",
    "password-placeholder": "Saisissez un mot de passe à évaluer",
    "show": "Afficher",
    "hide": "Masquer",
    "privacy-hint": "Les vérifications sont effectuées localement dans votre navigateur."
  },
  "de": {
    "password-label": "Passwort",
    "password-placeholder": "Geben Sie ein Passwort zur Bewertung ein",
    "show": "Anzeigen",
    "hide": "Verbergen",
    "privacy-hint": "Die Prüfung erfolgt lokal in Ihrem Browser."
  },
  "it": {
    "password-label": "Password",
    "password-placeholder": "Inserisci una password da valutare",
    "show": "Mostra",
    "hide": "Nascondi",
    "privacy-hint": "Le verifiche vengono eseguite localmente nel browser."
  },
  "ja": {
    "password-label": "パスワード",
    "password-placeholder": "評価するパスワードを入力",
    "show": "表示",
    "hide": "非表示",
    "privacy-hint": "強度チェックはブラウザ内でローカルに実行されます。"
  },
  "ko": {
    "password-label": "비밀번호",
    "password-placeholder": "평가할 비밀번호를 입력하세요",
    "show": "표시",
    "hide": "숨기기",
    "privacy-hint": "강도 검사는 브라우저에서 로컬로 실행됩니다."
  },
  "ru": {
    "password-label": "Пароль",
    "password-placeholder": "Введите пароль для оценки",
    "show": "Показать",
    "hide": "Скрыть",
    "privacy-hint": "Проверка выполняется локально в браузере."
  },
  "pt": {
    "password-label": "Senha",
    "password-placeholder": "Digite uma senha para avaliar",
    "show": "Mostrar",
    "hide": "Ocultar",
    "privacy-hint": "As verificações são feitas localmente no navegador."
  },
  "ar": {
    "password-label": "كلمة المرور",
    "password-placeholder": "أدخل كلمة مرور لتقييمها",
    "show": "إظهار",
    "hide": "إخفاء",
    "privacy-hint": "الفحص يتم محليًا في المتصفح."
  },
  "hi": {
    "password-label": "पासवर्ड",
    "password-placeholder": "मूल्यांकन के लिए पासवर्ड दर्ज करें",
    "show": "दिखाएँ",
    "hide": "छिपाएँ",
    "privacy-hint": "जांच आपके ब्राउज़र में स्थानीय रूप से होती है।"
  },
  "tr": {
    "password-label": "Parola",
    "password-placeholder": "Değerlendirmek için parola girin",
    "show": "Göster",
    "hide": "Gizle",
    "privacy-hint": "Kontroller tarayıcınızda yerel olarak yapılır."
  },
  "nl": {
    "password-label": "Wachtwoord",
    "password-placeholder": "Typ een wachtwoord om te beoordelen",
    "show": "Tonen",
    "hide": "Verbergen",
    "privacy-hint": "De controle gebeurt lokaal in je browser."
  },
  "sv": {
    "password-label": "Lösenord",
    "password-placeholder": "Skriv ett lösenord att bedöma",
    "show": "Visa",
    "hide": "Dölj",
    "privacy-hint": "Kontrollen sker lokalt i webbläsaren."
  },
  "pl": {
    "password-label": "Hasło",
    "password-placeholder": "Wpisz hasło do oceny",
    "show": "Pokaż",
    "hide": "Ukryj",
    "privacy-hint": "Sprawdzanie odbywa się lokalnie w przeglądarce."
  },
  "vi": {
    "password-label": "Mật khẩu",
    "password-placeholder": "Nhập mật khẩu để đánh giá",
    "show": "Hiện",
    "hide": "Ẩn",
    "privacy-hint": "Việc kiểm tra được thực hiện cục bộ trong trình duyệt."
  },
  "th": {
    "password-label": "รหัสผ่าน",
    "password-placeholder": "พิมพ์รหัสผ่านเพื่อประเมิน",
    "show": "แสดง",
    "hide": "ซ่อน",
    "privacy-hint": "การตรวจสอบทำงานในเบราว์เซอร์ของคุณแบบออฟไลน์"
  },
  "id": {
    "password-label": "Kata sandi",
    "password-placeholder": "Masukkan kata sandi untuk menilai",
    "show": "Tampilkan",
    "hide": "Sembunyikan",
    "privacy-hint": "Pemeriksaan berjalan lokal di browser Anda."
  },
  "he": {
    "password-label": "סיסמה",
    "password-placeholder": "הקלד סיסמה להערכה",
    "show": "הצג",
    "hide": "הסתר",
    "privacy-hint": "הבדיקה מתבצעת מקומית בדפדפן שלך."
  },
  "ms": {
    "password-label": "Kata laluan",
    "password-placeholder": "Masukkan kata laluan untuk dinilai",
    "show": "Tunjuk",
    "hide": "Sembunyi",
    "privacy-hint": "Pemeriksaan dijalankan secara tempatan dalam pelayar."
  },
  "no": {
    "password-label": "Passord",
    "password-placeholder": "Skriv inn et passord for vurdering",
    "show": "Vis",
    "hide": "Skjul",
    "privacy-hint": "Sjekken kjøres lokalt i nettleseren."
  }
}
</i18n>
