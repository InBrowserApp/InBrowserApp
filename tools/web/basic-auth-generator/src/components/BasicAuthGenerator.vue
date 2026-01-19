<template>
  <div>
    <ToolSectionHeader>{{ t('credentials') }}</ToolSectionHeader>
    <ToolSection>
      <n-grid :cols="1" :x-gap="12" :y-gap="12">
        <n-gi>
          <n-input v-model:value="username" :placeholder="t('username')" />
        </n-gi>
        <n-gi>
          <n-input
            v-model:value="password"
            type="password"
            show-password-on="click"
            :placeholder="t('password')"
          />
        </n-gi>
      </n-grid>
    </ToolSection>

    <ToolSectionHeader>{{ t('header') }}</ToolSectionHeader>
    <ToolSection>
      <CopyToClipboardTooltip :content="authHeader" #="{ copy }">
        <n-text code style="font-size: 1.5em; cursor: pointer" @click="copy">{{
          authHeader
        }}</n-text>
      </CopyToClipboardTooltip>
    </ToolSection>

    <ToolSectionHeader>{{ t('curl') }}</ToolSectionHeader>
    <ToolSection>
      <CopyToClipboardTooltip :content="curlCommand" #="{ copy }">
        <n-text code style="font-size: 1.5em; cursor: pointer" @click="copy">{{
          curlCommand
        }}</n-text>
      </CopyToClipboardTooltip>
    </ToolSection>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NInput, NGrid, NGi, NText } from 'naive-ui'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import { CopyToClipboardTooltip } from '@shared/ui/base'
import { useStorage } from '@vueuse/core'

const { t } = useI18n()

const username = useStorage<string>('tools:basic-auth-generator:username', '')
const password = useStorage<string>('tools:basic-auth-generator:password', '')

const base64 = computed(() => {
  const token = `${username.value}:${password.value}`
  const bytes = new TextEncoder().encode(token)
  const base64str = btoa(String.fromCharCode(...bytes))
  return base64str
})

const authHeader = computed(() => (base64.value ? `Basic ${base64.value}` : ''))
const curlCommand = computed(() =>
  authHeader.value ? `curl -H "Authorization: ${authHeader.value}" https://api.example.com` : '',
)
</script>

<i18n lang="json">
{
  "en": {
    "credentials": "Credentials",
    "username": "Username",
    "password": "Password",
    "header": "Authorization Header",
    "curl": "cURL Example"
  },
  "zh": {
    "credentials": "凭证",
    "username": "用户名",
    "password": "密码",
    "header": "Authorization 头",
    "curl": "cURL 示例"
  },
  "zh-CN": {
    "credentials": "凭证",
    "username": "用户名",
    "password": "密码",
    "header": "Authorization 头",
    "curl": "cURL 示例"
  },
  "zh-TW": {
    "credentials": "憑證",
    "username": "使用者名稱",
    "password": "密碼",
    "header": "Authorization 標頭",
    "curl": "cURL 範例"
  },
  "zh-HK": {
    "credentials": "憑證",
    "username": "使用者名稱",
    "password": "密碼",
    "header": "Authorization 標頭",
    "curl": "cURL 範例"
  },
  "es": {
    "credentials": "Credenciales",
    "username": "Usuario",
    "password": "Contraseña",
    "header": "Encabezado Authorization",
    "curl": "Ejemplo cURL"
  },
  "fr": {
    "credentials": "Identifiants",
    "username": "Nom d'utilisateur",
    "password": "Mot de passe",
    "header": "En-tête Authorization",
    "curl": "Exemple cURL"
  },
  "de": {
    "credentials": "Anmeldedaten",
    "username": "Benutzername",
    "password": "Passwort",
    "header": "Authorization-Header",
    "curl": "cURL Beispiel"
  },
  "it": {
    "credentials": "Credenziali",
    "username": "Nome utente",
    "password": "Password",
    "header": "Header Authorization",
    "curl": "Esempio cURL"
  },
  "ja": {
    "credentials": "認証情報",
    "username": "ユーザー名",
    "password": "パスワード",
    "header": "Authorization ヘッダー",
    "curl": "cURL 例"
  },
  "ko": {
    "credentials": "자격 증명",
    "username": "사용자 이름",
    "password": "비밀번호",
    "header": "Authorization 헤더",
    "curl": "cURL 예"
  },
  "ru": {
    "credentials": "Учетные данные",
    "username": "Имя пользователя",
    "password": "Пароль",
    "header": "Заголовок Authorization",
    "curl": "Пример cURL"
  },
  "pt": {
    "credentials": "Credenciais",
    "username": "Nome de usuário",
    "password": "Senha",
    "header": "Cabeçalho Authorization",
    "curl": "Exemplo cURL"
  },
  "ar": {
    "credentials": "بيانات الاعتماد",
    "username": "اسم المستخدم",
    "password": "كلمة المرور",
    "header": "ترويسة Authorization",
    "curl": "مثال cURL"
  },
  "hi": {
    "credentials": "प्रमाण-पत्र",
    "username": "उपयोगकर्ता नाम",
    "password": "पासवर्ड",
    "header": "Authorization हेडर",
    "curl": "cURL उदाहरण"
  },
  "tr": {
    "credentials": "Kimlik Bilgileri",
    "username": "Kullanıcı Adı",
    "password": "Parola",
    "header": "Authorization Başlığı",
    "curl": "cURL Örneği"
  },
  "nl": {
    "credentials": "Referenties",
    "username": "Gebruikersnaam",
    "password": "Wachtwoord",
    "header": "Authorization-header",
    "curl": "cURL-voorbeeld"
  },
  "sv": {
    "credentials": "Inloggningsuppgifter",
    "username": "Användarnamn",
    "password": "Lösenord",
    "header": "Authorization-rubrik",
    "curl": "cURL-exempel"
  },
  "pl": {
    "credentials": "Dane logowania",
    "username": "Nazwa użytkownika",
    "password": "Hasło",
    "header": "Nagłówek Authorization",
    "curl": "Przykład cURL"
  },
  "vi": {
    "credentials": "Thông tin xác thực",
    "username": "Tên người dùng",
    "password": "Mật khẩu",
    "header": "Tiêu đề Authorization",
    "curl": "Ví dụ cURL"
  },
  "th": {
    "credentials": "ข้อมูลรับรอง",
    "username": "ชื่อผู้ใช้",
    "password": "รหัสผ่าน",
    "header": "ส่วนหัว Authorization",
    "curl": "ตัวอย่าง cURL"
  },
  "id": {
    "credentials": "Kredensial",
    "username": "Nama pengguna",
    "password": "Kata sandi",
    "header": "Header Authorization",
    "curl": "Contoh cURL"
  },
  "he": {
    "credentials": "אישורים",
    "username": "שם משתמש",
    "password": "סיסמה",
    "header": "כותרת Authorization",
    "curl": "דוגמת cURL"
  },
  "ms": {
    "credentials": "Kelayakan",
    "username": "Nama pengguna",
    "password": "Kata laluan",
    "header": "Pengepala Authorization",
    "curl": "Contoh cURL"
  },
  "no": {
    "credentials": "Legitimasjon",
    "username": "Brukernavn",
    "password": "Passord",
    "header": "Authorization-header",
    "curl": "cURL-eksempel"
  }
}
</i18n>
