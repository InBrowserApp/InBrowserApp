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
      <n-form-item :label="t('argon2-hash-to-verify')">
        <n-input
          v-model:value="argon2HashToVerify"
          :placeholder="t('argon2-hash-to-verify')"
          type="password"
          show-password-on="click"
          :input-props="{ autocomplete: 'off' }"
        />
      </n-form-item>
      <n-form-item :label="t('secret-to-verify')">
        <n-input
          v-model:value="secretToVerify"
          :placeholder="t('secret-to-verify')"
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
        class="argon2-verifier-result"
        :class="{ 'argon2-verifier-result-processing': processing }"
      >
        <n-flex align="center" gap="1em">
          <n-icon
            :component="status === 'verified' ? CheckmarkCircle12Filled : DismissCircle12Filled"
            class="argon2-verifier-result-icon"
          />
          <span>
            {{ statusText }}
          </span>
        </n-flex>
      </n-text>
    </ToolSection>

    <WhatIsArgon2 />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import CheckmarkCircle12Filled from '@vicons/fluent/CheckmarkCircle12Filled'
import DismissCircle12Filled from '@vicons/fluent/DismissCircle12Filled'
import { computed, shallowRef, ref } from 'vue'
import { computedAsync } from '@vueuse/core'
import { NFlex, NFormItem, NIcon, NInput, NText } from 'naive-ui'
import { ToolDefaultPageLayout, ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import { argon2Verify } from 'hash-wasm'
import WhatIsArgon2 from './WhatIsArgon2.vue'

const { t } = useI18n()

const passwordToVerify = ref('')
const argon2HashToVerify = ref('')
const secretToVerify = ref('')

const processing = shallowRef(false)

const status = computedAsync<'idle' | 'verified' | 'not-verified' | 'invalid-hash'>(
  async () => {
    const password = passwordToVerify.value
    const hash = argon2HashToVerify.value
    const secret = secretToVerify.value

    if (!password || !hash) {
      return 'idle'
    }

    try {
      const verified = await argon2Verify({
        password,
        hash,
        secret: secret || undefined,
      })

      return verified ? 'verified' : 'not-verified'
    } catch {
      return 'invalid-hash'
    }
  },
  'idle',
  processing,
)

const statusText = computed(() => {
  switch (status.value) {
    case 'verified':
      return t('status-verified')
    case 'not-verified':
      return t('status-not-verified')
    case 'invalid-hash':
      return t('status-invalid-hash')
    default:
      return t('status-idle')
  }
})
</script>

<style scoped>
.argon2-verifier-result {
  font-size: 1.2em;
  word-break: break-all;
  transition: filter 0.3s ease-in-out;
}

.argon2-verifier-result-processing {
  cursor: not-allowed;
  filter: blur(10px);
}

.argon2-verifier-result-icon {
  font-size: 1.2em;
}
</style>

<i18n lang="json">
{
  "en": {
    "input-header": "Input",
    "password-to-verify": "Password to Verify",
    "argon2-hash-to-verify": "Argon2 Hash to Verify",
    "secret-to-verify": "Secret (Optional)",
    "result-header": "Verification Result",
    "status-idle": "Enter password and Argon2 hash to verify.",
    "status-verified": "Password matches the Argon2 hash.",
    "status-not-verified": "Password does not match the Argon2 hash.",
    "status-invalid-hash": "The provided Argon2 hash is invalid."
  },
  "zh": {
    "input-header": "输入",
    "password-to-verify": "要验证的密码",
    "argon2-hash-to-verify": "要验证的 Argon2 哈希",
    "secret-to-verify": "密钥（可选）",
    "result-header": "验证结果",
    "status-idle": "请输入密码和 Argon2 哈希进行验证。",
    "status-verified": "密码与 Argon2 哈希匹配。",
    "status-not-verified": "密码与 Argon2 哈希不匹配。",
    "status-invalid-hash": "提供的 Argon2 哈希无效。"
  },
  "zh-CN": {
    "input-header": "输入",
    "password-to-verify": "要验证的密码",
    "argon2-hash-to-verify": "要验证的 Argon2 哈希",
    "secret-to-verify": "密钥（可选）",
    "result-header": "验证结果",
    "status-idle": "请输入密码和 Argon2 哈希进行验证。",
    "status-verified": "密码与 Argon2 哈希匹配。",
    "status-not-verified": "密码与 Argon2 哈希不匹配。",
    "status-invalid-hash": "提供的 Argon2 哈希无效。"
  },
  "zh-TW": {
    "input-header": "輸入",
    "password-to-verify": "要驗證的密碼",
    "argon2-hash-to-verify": "要驗證的 Argon2 雜湊",
    "secret-to-verify": "密鑰（可選）",
    "result-header": "驗證結果",
    "status-idle": "請輸入密碼和 Argon2 雜湊進行驗證。",
    "status-verified": "密碼與 Argon2 雜湊匹配。",
    "status-not-verified": "密碼與 Argon2 雜湊不匹配。",
    "status-invalid-hash": "提供的 Argon2 雜湊無效。"
  },
  "zh-HK": {
    "input-header": "輸入",
    "password-to-verify": "要驗證的密碼",
    "argon2-hash-to-verify": "要驗證的 Argon2 雜湊",
    "secret-to-verify": "密鑰（可選）",
    "result-header": "驗證結果",
    "status-idle": "請輸入密碼和 Argon2 雜湊進行驗證。",
    "status-verified": "密碼與 Argon2 雜湊匹配。",
    "status-not-verified": "密碼與 Argon2 雜湊不匹配。",
    "status-invalid-hash": "提供的 Argon2 雜湊無效。"
  },
  "es": {
    "input-header": "Aporte",
    "password-to-verify": "Contraseña para verificar",
    "argon2-hash-to-verify": "Argon2 Hash para verificar",
    "secret-to-verify": "Secreto (opcional)",
    "result-header": "Resultado de la verificación",
    "status-idle": "Ingrese la contraseña y el hash Argon2 para verificar.",
    "status-verified": "La contraseña coincide con el hash Argon2.",
    "status-not-verified": "La contraseña no coincide con el hash Argon2.",
    "status-invalid-hash": "El hash Argon2 proporcionado no es válido."
  },
  "fr": {
    "input-header": "Saisir",
    "password-to-verify": "Mot de passe à vérifier",
    "argon2-hash-to-verify": "Hachage Argon2 à vérifier",
    "secret-to-verify": "Secret (facultatif)",
    "result-header": "Résultat de la vérification",
    "status-idle": "Entrez le mot de passe et le hachage Argon2 pour vérifier.",
    "status-verified": "Le mot de passe correspond au hachage Argon2.",
    "status-not-verified": "Le mot de passe ne correspond pas au hachage Argon2.",
    "status-invalid-hash": "Le hachage Argon2 fourni n'est pas valide."
  },
  "de": {
    "input-header": "Eingang",
    "password-to-verify": "Passwort zur Überprüfung",
    "argon2-hash-to-verify": "Argon2 Hash zur Überprüfung",
    "secret-to-verify": "Geheimnis (optional)",
    "result-header": "Verifizierungsergebnis",
    "status-idle": "Geben Sie zur Bestätigung das Passwort und den Argon2-Hash ein.",
    "status-verified": "Das Passwort entspricht dem Argon2-Hash.",
    "status-not-verified": "Das Passwort stimmt nicht mit dem Argon2-Hash überein.",
    "status-invalid-hash": "Der bereitgestellte Argon2-Hash ist ungültig."
  },
  "it": {
    "input-header": "Ingresso",
    "password-to-verify": "Password da verificare",
    "argon2-hash-to-verify": "Argon2 Hash da verificare",
    "secret-to-verify": "Segreto (facoltativo)",
    "result-header": "Risultato della verifica",
    "status-idle": "Inserisci la password e l'hash Argon2 per verificare.",
    "status-verified": "La password corrisponde all'hash Argon2.",
    "status-not-verified": "La password non corrisponde all'hash Argon2.",
    "status-invalid-hash": "L'hash Argon2 fornito non è valido."
  },
  "ja": {
    "input-header": "入力",
    "password-to-verify": "確認用のパスワード",
    "argon2-hash-to-verify": "Argon2 検証するハッシュ",
    "secret-to-verify": "シークレット (オプション)",
    "result-header": "検証結果",
    "status-idle": "パスワードと Argon2 ハッシュを入力して確認します。",
    "status-verified": "パスワードは Argon2 ハッシュと一致します。",
    "status-not-verified": "パスワードが Argon2 ハッシュと一致しません。",
    "status-invalid-hash": "提供された Argon2 ハッシュは無効です。"
  },
  "ko": {
    "input-header": "입력",
    "password-to-verify": "확인할 비밀번호",
    "argon2-hash-to-verify": "Argon2 검증할 해시",
    "secret-to-verify": "비밀(선택사항)",
    "result-header": "검증 결과",
    "status-idle": "비밀번호와 Argon2 해시를 입력하여 확인하세요.",
    "status-verified": "비밀번호는 Argon2 해시와 일치합니다.",
    "status-not-verified": "비밀번호가 Argon2 해시와 일치하지 않습니다.",
    "status-invalid-hash": "제공된 Argon2 해시가 잘못되었습니다."
  },
  "ru": {
    "input-header": "Вход",
    "password-to-verify": "Пароль для проверки",
    "argon2-hash-to-verify": "Argon2 Хэш для проверки",
    "secret-to-verify": "Секрет (необязательно)",
    "result-header": "Результат проверки",
    "status-idle": "Введите пароль и хэш Argon2 для проверки.",
    "status-verified": "Пароль соответствует хешу Argon2.",
    "status-not-verified": "Пароль не соответствует хешу Argon2.",
    "status-invalid-hash": "Предоставленный хеш Argon2 недействителен."
  },
  "pt": {
    "input-header": "Entrada",
    "password-to-verify": "Senha para verificar",
    "argon2-hash-to-verify": "Argon2 Hash para verificar",
    "secret-to-verify": "Segredo (opcional)",
    "result-header": "Resultado da verificação",
    "status-idle": "Digite a senha e o hash Argon2 para verificar.",
    "status-verified": "A senha corresponde ao hash Argon2.",
    "status-not-verified": "A senha não corresponde ao hash Argon2.",
    "status-invalid-hash": "O hash Argon2 fornecido é inválido."
  },
  "ar": {
    "input-header": "مدخل",
    "password-to-verify": "كلمة المرور للتحقق",
    "argon2-hash-to-verify": "Argon2 التجزئة للتحقق",
    "secret-to-verify": "سري (اختياري)",
    "result-header": "نتيجة التحقق",
    "status-idle": "أدخل كلمة المرور وتجزئة Argon2 للتحقق.",
    "status-verified": "كلمة المرور تتطابق مع تجزئة Argon2.",
    "status-not-verified": "كلمة المرور لا تتطابق مع تجزئة Argon2.",
    "status-invalid-hash": "تجزئة Argon2 المقدمة غير صالحة."
  },
  "hi": {
    "input-header": "इनपुट",
    "password-to-verify": "सत्यापित करने के लिए पासवर्ड",
    "argon2-hash-to-verify": "Argon2 सत्यापित करने के लिए हैश",
    "secret-to-verify": "गुप्त (वैकल्पिक)",
    "result-header": "सत्यापन परिणाम",
    "status-idle": "सत्यापित करने के लिए पासवर्ड और Argon2 हैश दर्ज करें।",
    "status-verified": "पासवर्ड Argon2 हैश से मेल खाता है।",
    "status-not-verified": "पासवर्ड Argon2 हैश से मेल नहीं खाता.",
    "status-invalid-hash": "प्रदत्त Argon2 हैश अमान्य है."
  },
  "tr": {
    "input-header": "Giriş",
    "password-to-verify": "Doğrulanacak Şifre",
    "argon2-hash-to-verify": "Argon2 Doğrulanacak Hash",
    "secret-to-verify": "Gizli (İsteğe bağlı)",
    "result-header": "Doğrulama Sonucu",
    "status-idle": "Doğrulamak için şifreyi ve Argon2 karma değerini girin.",
    "status-verified": "Şifre Argon2 karma değeriyle eşleşiyor.",
    "status-not-verified": "Şifre Argon2 karma değeriyle eşleşmiyor.",
    "status-invalid-hash": "Sağlanan Argon2 karma değeri geçersiz."
  },
  "nl": {
    "input-header": "Invoer",
    "password-to-verify": "Wachtwoord om te verifiëren",
    "argon2-hash-to-verify": "Argon2 Hash om te verifiëren",
    "secret-to-verify": "Geheim (optioneel)",
    "result-header": "Verificatieresultaat",
    "status-idle": "Voer het wachtwoord en de Argon2-hash in om te verifiëren.",
    "status-verified": "Wachtwoord komt overeen met de Argon2-hash.",
    "status-not-verified": "Wachtwoord komt niet overeen met de Argon2-hash.",
    "status-invalid-hash": "De opgegeven Argon2-hash is ongeldig."
  },
  "sv": {
    "input-header": "Inmatning",
    "password-to-verify": "Lösenord att verifiera",
    "argon2-hash-to-verify": "Argon2 Hash att verifiera",
    "secret-to-verify": "Hemlig (valfritt)",
    "result-header": "Verifieringsresultat",
    "status-idle": "Ange lösenord och Argon2 hash för att verifiera.",
    "status-verified": "Lösenordet matchar hashen Argon2.",
    "status-not-verified": "Lösenordet matchar inte hashen Argon2.",
    "status-invalid-hash": "Den angivna Argon2 hashen är ogiltig."
  },
  "pl": {
    "input-header": "Wejście",
    "password-to-verify": "Hasło do zweryfikowania",
    "argon2-hash-to-verify": "Argon2 Hash do sprawdzenia",
    "secret-to-verify": "Sekret (opcjonalnie)",
    "result-header": "Wynik weryfikacji",
    "status-idle": "Wprowadź hasło i skrót Argon2, aby zweryfikować.",
    "status-verified": "Hasło odpowiada skrótowi Argon2.",
    "status-not-verified": "Hasło nie pasuje do skrótu Argon2.",
    "status-invalid-hash": "Podany skrót Argon2 jest nieprawidłowy."
  },
  "vi": {
    "input-header": "đầu vào",
    "password-to-verify": "Mật khẩu để xác minh",
    "argon2-hash-to-verify": "Argon2 Băm để xác minh",
    "secret-to-verify": "Bí mật (Tùy chọn)",
    "result-header": "Kết quả xác minh",
    "status-idle": "Nhập mật khẩu và hàm băm Argon2 để xác minh.",
    "status-verified": "Mật khẩu khớp với hàm băm Argon2.",
    "status-not-verified": "Mật khẩu không khớp với hàm băm Argon2.",
    "status-invalid-hash": "Hàm băm Argon2 được cung cấp không hợp lệ."
  },
  "th": {
    "input-header": "ป้อนข้อมูล",
    "password-to-verify": "รหัสผ่านเพื่อยืนยัน",
    "argon2-hash-to-verify": "Argon2 แฮชเพื่อยืนยัน",
    "secret-to-verify": "ความลับ (ไม่บังคับ)",
    "result-header": "ผลการตรวจสอบ",
    "status-idle": "ป้อนรหัสผ่านและแฮช Argon2 เพื่อยืนยัน",
    "status-verified": "รหัสผ่านตรงกับแฮช Argon2",
    "status-not-verified": "รหัสผ่านไม่ตรงกับแฮช Argon2",
    "status-invalid-hash": "แฮช Argon2 ที่ระบุไม่ถูกต้อง"
  },
  "id": {
    "input-header": "Masukan",
    "password-to-verify": "Kata Sandi untuk Diverifikasi",
    "argon2-hash-to-verify": "Argon2 Hash untuk Diverifikasi",
    "secret-to-verify": "Rahasia (Opsional)",
    "result-header": "Hasil Verifikasi",
    "status-idle": "Masukkan kata sandi dan hash Argon2 untuk memverifikasi.",
    "status-verified": "Kata sandi cocok dengan hash Argon2.",
    "status-not-verified": "Kata sandi tidak cocok dengan hash Argon2.",
    "status-invalid-hash": "Hash Argon2 yang diberikan tidak valid."
  },
  "he": {
    "input-header": "קֶלֶט",
    "password-to-verify": "סיסמה לאימות",
    "argon2-hash-to-verify": "Argon2 Hash לאימות",
    "secret-to-verify": "סודי (אופציונלי)",
    "result-header": "תוצאת אימות",
    "status-idle": "הזן סיסמה ו-Argon2 hash כדי לאמת.",
    "status-verified": "הסיסמה תואמת ל-hash Argon2.",
    "status-not-verified": "הסיסמה אינה תואמת ל-hash Argon2.",
    "status-invalid-hash": "ה-hash Argon2 שסופק אינו חוקי."
  },
  "ms": {
    "input-header": "Masukan",
    "password-to-verify": "Kata laluan untuk Mengesahkan",
    "argon2-hash-to-verify": "Argon2 Cincang untuk Mengesahkan",
    "secret-to-verify": "Rahsia (Pilihan)",
    "result-header": "Keputusan Pengesahan",
    "status-idle": "Masukkan kata laluan dan cincang Argon2 untuk mengesahkan.",
    "status-verified": "Kata laluan sepadan dengan cincangan Argon2.",
    "status-not-verified": "Kata laluan tidak sepadan dengan cincangan Argon2.",
    "status-invalid-hash": "Cincang Argon2 yang disediakan adalah tidak sah."
  },
  "no": {
    "input-header": "Inndata",
    "password-to-verify": "Passord for å bekrefte",
    "argon2-hash-to-verify": "Argon2 Hash for å bekrefte",
    "secret-to-verify": "Hemmelig (valgfritt)",
    "result-header": "Verifikasjonsresultat",
    "status-idle": "Skriv inn passord og Argon2 hash for å bekrefte.",
    "status-verified": "Passordet samsvarer med Argon2-hashen.",
    "status-not-verified": "Passordet samsvarer ikke med Argon2-hashen.",
    "status-invalid-hash": "Den oppgitte Argon2-hashen er ugyldig."
  }
}
</i18n>
