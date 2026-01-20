<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ToolSectionHeader>
      {{ t('input-header') }}
    </ToolSectionHeader>
    <ToolSection>
      <n-form-item :label="t('password-to-verify')">
        <n-input
          v-model:value="passwordToVerify"
          :placeholder="t('password-to-verify')"
          type="password"
          show-password-on="click"
          :input-props="{ autocomplete: 'off' }"
        />
      </n-form-item>
      <n-form-item :label="t('bcrypt-hash-to-verify')">
        <n-input
          v-model:value="bcryptHashToVerify"
          :placeholder="t('bcrypt-hash-to-verify')"
          type="password"
          show-password-on="click"
          :input-props="{ autocomplete: 'off' }"
        />
      </n-form-item>
    </ToolSection>

    <ToolSectionHeader>
      {{ t('result-header') }}
    </ToolSectionHeader>
    <ToolSection>
      <n-text
        class="bcrypt-verifier-result"
        :class="{ 'bcrypt-verifier-result-processing': processing }"
      >
        <n-flex align="center" gap="1em">
          <n-icon
            :component="verified ? CheckmarkCircle12Filled : DismissCircle12Filled"
            class="bcrypt-verifier-result-icon"
          />
          <span>
            {{ verified ? t('verified') : t('not-verified') }}
          </span>
        </n-flex>
      </n-text>
    </ToolSection>
    <WhatIsBcrypt />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import CheckmarkCircle12Filled from '@vicons/fluent/CheckmarkCircle12Filled'
import DismissCircle12Filled from '@vicons/fluent/DismissCircle12Filled'
import { ToolDefaultPageLayout, ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import WhatIsBcrypt from './WhatIsBcrypt.vue'
import { useI18n } from 'vue-i18n'
import { NInput, NFormItem, NText, NIcon, NFlex } from 'naive-ui'
import { compare } from 'bcrypt-ts'
import { computedAsync } from '@vueuse/core'
import { ref } from 'vue'

const { t } = useI18n()

const passwordToVerify = ref('')
const bcryptHashToVerify = ref('')

const processing = ref(false)

const verified = computedAsync<boolean>(
  async () => {
    return await compare(passwordToVerify.value, bcryptHashToVerify.value)
  },
  undefined,
  processing,
)
</script>

<style scoped>
.bcrypt-verifier-result {
  font-size: 1.5em;
  word-break: break-all;
  transition: filter 0.3s ease-in-out;
}

.bcrypt-verifier-result-processing {
  cursor: not-allowed;
  filter: blur(10px);
}
</style>

<i18n lang="json">
{
  "en": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "bcrypt-hash-to-verify": "Bcrypt Hash to Verify",
    "result-header": "Verification Result",
    "verified": "Password matches the hash",
    "not-verified": "Password does not match the hash"
  },
  "zh": {
    "input-header": "输入",
    "password-to-verify": "要验证的密码",
    "bcrypt-hash-to-verify": "要验证的 Bcrypt 哈希",
    "result-header": "验证结果",
    "verified": "密码与哈希匹配",
    "not-verified": "密码与哈希不匹配"
  },
  "zh-CN": {
    "input-header": "输入",
    "password-to-verify": "要验证的密码",
    "bcrypt-hash-to-verify": "要验证的 Bcrypt 哈希",
    "result-header": "验证结果",
    "verified": "密码与哈希匹配",
    "not-verified": "密码与哈希不匹配"
  },
  "zh-TW": {
    "input-header": "輸入",
    "password-to-verify": "要驗證的密碼",
    "bcrypt-hash-to-verify": "要驗證的 Bcrypt 雜湊",
    "result-header": "驗證結果",
    "verified": "密碼與雜湊匹配",
    "not-verified": "密碼與雜湊不匹配"
  },
  "zh-HK": {
    "input-header": "輸入",
    "password-to-verify": "要驗證的密碼",
    "bcrypt-hash-to-verify": "要驗證的 Bcrypt 雜湊",
    "result-header": "驗證結果",
    "verified": "密碼與雜湊匹配",
    "not-verified": "密碼與雜湊不匹配"
  },
  "es": {
    "input-header": "Entrada",
    "password-to-verify": "Contraseña a Verificar",
    "bcrypt-hash-to-verify": "Hash Bcrypt a Verificar",
    "result-header": "Resultado de Verificación",
    "verified": "La contraseña coincide con el hash",
    "not-verified": "La contraseña no coincide con el hash"
  },
  "fr": {
    "input-header": "Entrée",
    "password-to-verify": "Mot de Passe à Vérifier",
    "bcrypt-hash-to-verify": "Hash Bcrypt à Vérifier",
    "result-header": "Résultat de Vérification",
    "verified": "Le mot de passe correspond au hash",
    "not-verified": "Le mot de passe ne correspond pas au hash"
  },
  "de": {
    "input-header": "Eingabe",
    "password-to-verify": "Zu Verifizierendes Passwort",
    "bcrypt-hash-to-verify": "Zu Verifizierender Bcrypt-Hash",
    "result-header": "Verifizierungsergebnis",
    "verified": "Passwort stimmt mit Hash überein",
    "not-verified": "Passwort stimmt nicht mit Hash überein"
  },
  "it": {
    "input-header": "Input",
    "password-to-verify": "Password da Verificare",
    "bcrypt-hash-to-verify": "Hash Bcrypt da Verificare",
    "result-header": "Risultato Verifica",
    "verified": "La password corrisponde all'hash",
    "not-verified": "La password non corrisponde all'hash"
  },
  "ja": {
    "input-header": "入力",
    "password-to-verify": "検証するパスワード",
    "bcrypt-hash-to-verify": "検証するBcryptハッシュ",
    "result-header": "検証結果",
    "verified": "パスワードがハッシュと一致します",
    "not-verified": "パスワードがハッシュと一致しません"
  },
  "ko": {
    "input-header": "입력",
    "password-to-verify": "검증할 비밀번호",
    "bcrypt-hash-to-verify": "검증할 Bcrypt 해시",
    "result-header": "검증 결과",
    "verified": "비밀번호가 해시와 일치합니다",
    "not-verified": "비밀번호가 해시와 일치하지 않습니다"
  },
  "ru": {
    "input-header": "Ввод",
    "password-to-verify": "Пароль для Проверки",
    "bcrypt-hash-to-verify": "Хеш Bcrypt для Проверки",
    "result-header": "Результат Проверки",
    "verified": "Пароль соответствует хешу",
    "not-verified": "Пароль не соответствует хешу"
  },
  "pt": {
    "input-header": "Entrada",
    "password-to-verify": "Senha a Verificar",
    "bcrypt-hash-to-verify": "Hash Bcrypt a Verificar",
    "result-header": "Resultado da Verificação",
    "verified": "A senha corresponde ao hash",
    "not-verified": "A senha não corresponde ao hash"
  },
  "ar": {
    "input-header": "الإدخال",
    "password-to-verify": "كلمة المرور للتحقق",
    "bcrypt-hash-to-verify": "تشفير Bcrypt للتحقق",
    "result-header": "نتيجة التحقق",
    "verified": "كلمة المرور تطابق التشفير",
    "not-verified": "كلمة المرور لا تطابق التشفير"
  },
  "hi": {
    "input-header": "इनपुट",
    "password-to-verify": "सत्यापित करने के लिए पासवर्ड",
    "bcrypt-hash-to-verify": "सत्यापित करने के लिए Bcrypt हैश",
    "result-header": "सत्यापन परिणाम",
    "verified": "पासवर्ड हैश से मेल खाता है",
    "not-verified": "पासवर्ड हैश से मेल नहीं खाता"
  },
  "tr": {
    "input-header": "Giriş",
    "password-to-verify": "Doğrulanacak Şifre",
    "bcrypt-hash-to-verify": "Doğrulanacak Bcrypt Hash",
    "result-header": "Doğrulama Sonucu",
    "verified": "Şifre hash ile eşleşiyor",
    "not-verified": "Şifre hash ile eşleşmiyor"
  },
  "nl": {
    "input-header": "Invoer",
    "password-to-verify": "Te Verifiëren Wachtwoord",
    "bcrypt-hash-to-verify": "Te Verifiëren Bcrypt Hash",
    "result-header": "Verificatieresultaat",
    "verified": "Wachtwoord komt overeen met hash",
    "not-verified": "Wachtwoord komt niet overeen met hash"
  },
  "sv": {
    "input-header": "Inmatning",
    "password-to-verify": "Lösenord att Verifiera",
    "bcrypt-hash-to-verify": "Bcrypt Hash att Verifiera",
    "result-header": "Verifieringsresultat",
    "verified": "Lösenordet matchar hashen",
    "not-verified": "Lösenordet matchar inte hashen"
  },
  "pl": {
    "input-header": "Wejście",
    "password-to-verify": "Hasło do Weryfikacji",
    "bcrypt-hash-to-verify": "Hash Bcrypt do Weryfikacji",
    "result-header": "Wynik Weryfikacji",
    "verified": "Hasło pasuje do hash",
    "not-verified": "Hasło nie pasuje do hash"
  },
  "vi": {
    "input-header": "Đầu vào",
    "password-to-verify": "Mật Khẩu cần Xác Minh",
    "bcrypt-hash-to-verify": "Hash Bcrypt cần Xác Minh",
    "result-header": "Kết Quả Xác Minh",
    "verified": "Mật khẩu khớp với hash",
    "not-verified": "Mật khẩu không khớp với hash"
  },
  "th": {
    "input-header": "อินพุต",
    "password-to-verify": "รหัสผ่านที่จะตรวจสอบ",
    "bcrypt-hash-to-verify": "Bcrypt Hash ที่จะตรวจสอบ",
    "result-header": "ผลการตรวจสอบ",
    "verified": "รหัสผ่านตรงกับ hash",
    "not-verified": "รหัสผ่านไม่ตรงกับ hash"
  },
  "id": {
    "input-header": "Masukan",
    "password-to-verify": "Password untuk Diverifikasi",
    "bcrypt-hash-to-verify": "Hash Bcrypt untuk Diverifikasi",
    "result-header": "Hasil Verifikasi",
    "verified": "Password cocok dengan hash",
    "not-verified": "Password tidak cocok dengan hash"
  },
  "he": {
    "input-header": "קלט",
    "password-to-verify": "סיסמה לאימות",
    "bcrypt-hash-to-verify": "Bcrypt Hash לאימות",
    "result-header": "תוצאת אימות",
    "verified": "הסיסמה תואמת לגיבוב",
    "not-verified": "הסיסמה לא תואמת לגיבוב"
  },
  "ms": {
    "input-header": "Input",
    "password-to-verify": "Kata Laluan untuk Disahkan",
    "bcrypt-hash-to-verify": "Hash Bcrypt untuk Disahkan",
    "result-header": "Hasil Pengesahan",
    "verified": "Kata laluan sepadan dengan hash",
    "not-verified": "Kata laluan tidak sepadan dengan hash"
  },
  "no": {
    "input-header": "Inndata",
    "password-to-verify": "Passord å Verifisere",
    "bcrypt-hash-to-verify": "Bcrypt Hash å Verifisere",
    "result-header": "Verifikasjonsresultat",
    "verified": "Passordet samsvarer med hash",
    "not-verified": "Passordet samsvarer ikke med hash"
  }
}
</i18n>
