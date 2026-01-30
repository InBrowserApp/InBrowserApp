<template>
  <n-grid-item>
    <n-form-item :label="t('protocol')">
      <n-input v-model:value="protocol" :placeholder="t('protocol-placeholder')" />
    </n-form-item>
  </n-grid-item>

  <n-grid-item>
    <n-form-item :label="t('username')">
      <n-input v-model:value="username" :placeholder="t('username-placeholder')" />
    </n-form-item>
  </n-grid-item>

  <n-grid-item>
    <n-form-item :label="t('password')">
      <n-input v-model:value="password" :placeholder="t('password-placeholder')" />
    </n-form-item>
  </n-grid-item>

  <n-grid-item>
    <n-form-item :label="t('hostname')">
      <n-input v-model:value="hostname" :placeholder="t('hostname-placeholder')" />
    </n-form-item>
  </n-grid-item>

  <n-grid-item>
    <n-form-item :label="t('port')">
      <n-input-number
        v-model:value="portNumber"
        :placeholder="t('port-placeholder')"
        :min="1"
        :max="65535"
        style="width: 100%"
      />
    </n-form-item>
  </n-grid-item>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { NFormItem, NGridItem, NInput, NInputNumber } from 'naive-ui'

const protocol = defineModel<string>('protocol', { required: true })
const username = defineModel<string>('username', { required: true })
const password = defineModel<string>('password', { required: true })
const hostname = defineModel<string>('hostname', { required: true })
const portNumber = defineModel<number | null>('portNumber', { required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "protocol": "Protocol",
    "protocol-placeholder": "https, http, ftp, etc.",
    "username": "Username",
    "username-placeholder": "Optional username",
    "password": "Password",
    "password-placeholder": "Optional password",
    "hostname": "Hostname",
    "hostname-placeholder": "example.com, 192.168.1.1, etc.",
    "port": "Port",
    "port-placeholder": "80, 443, 8080, etc."
  },
  "zh": {
    "protocol": "协议",
    "protocol-placeholder": "https, http, ftp 等",
    "username": "用户名",
    "username-placeholder": "可选用户名",
    "password": "密码",
    "password-placeholder": "可选密码",
    "hostname": "主机名",
    "hostname-placeholder": "example.com, 192.168.1.1 等",
    "port": "端口",
    "port-placeholder": "80, 443, 8080 等"
  },
  "zh-CN": {
    "protocol": "协议",
    "protocol-placeholder": "https, http, ftp 等",
    "username": "用户名",
    "username-placeholder": "可选用户名",
    "password": "密码",
    "password-placeholder": "可选密码",
    "hostname": "主机名",
    "hostname-placeholder": "example.com, 192.168.1.1 等",
    "port": "端口",
    "port-placeholder": "80, 443, 8080 等"
  },
  "zh-TW": {
    "protocol": "協定",
    "protocol-placeholder": "https, http, ftp 等",
    "username": "使用者名稱",
    "username-placeholder": "可選使用者名稱",
    "password": "密碼",
    "password-placeholder": "可選密碼",
    "hostname": "主機名稱",
    "hostname-placeholder": "example.com, 192.168.1.1 等",
    "port": "連接埠",
    "port-placeholder": "80, 443, 8080 等"
  },
  "zh-HK": {
    "protocol": "協定",
    "protocol-placeholder": "https, http, ftp 等",
    "username": "使用者名稱",
    "username-placeholder": "可選使用者名稱",
    "password": "密碼",
    "password-placeholder": "可選密碼",
    "hostname": "主機名稱",
    "hostname-placeholder": "example.com, 192.168.1.1 等",
    "port": "連接埠",
    "port-placeholder": "80, 443, 8080 等"
  },
  "es": {
    "protocol": "Protocolo",
    "protocol-placeholder": "https, http, ftp, etc.",
    "username": "Nombre de usuario",
    "username-placeholder": "Nombre de usuario opcional",
    "password": "Contraseña",
    "password-placeholder": "Contraseña opcional",
    "hostname": "Nombre del host",
    "hostname-placeholder": "example.com, 192.168.1.1, etc.",
    "port": "Puerto",
    "port-placeholder": "80, 443, 8080, etc."
  },
  "fr": {
    "protocol": "Protocole",
    "protocol-placeholder": "https, http, ftp, etc.",
    "username": "Nom d'utilisateur",
    "username-placeholder": "Nom d'utilisateur optionnel",
    "password": "Mot de passe",
    "password-placeholder": "Mot de passe optionnel",
    "hostname": "Nom d'hôte",
    "hostname-placeholder": "example.com, 192.168.1.1, etc.",
    "port": "Port",
    "port-placeholder": "80, 443, 8080, etc."
  },
  "de": {
    "protocol": "Protokoll",
    "protocol-placeholder": "https, http, ftp, etc.",
    "username": "Benutzername",
    "username-placeholder": "Optionaler Benutzername",
    "password": "Passwort",
    "password-placeholder": "Optionales Passwort",
    "hostname": "Hostname",
    "hostname-placeholder": "example.com, 192.168.1.1, etc.",
    "port": "Port",
    "port-placeholder": "80, 443, 8080, etc."
  },
  "it": {
    "protocol": "Protocollo",
    "protocol-placeholder": "https, http, ftp, etc.",
    "username": "Nome utente",
    "username-placeholder": "Nome utente opzionale",
    "password": "Password",
    "password-placeholder": "Password opzionale",
    "hostname": "Nome host",
    "hostname-placeholder": "example.com, 192.168.1.1, etc.",
    "port": "Porta",
    "port-placeholder": "80, 443, 8080, etc."
  },
  "ja": {
    "protocol": "プロトコル",
    "protocol-placeholder": "https, http, ftp など",
    "username": "ユーザー名",
    "username-placeholder": "オプションのユーザー名",
    "password": "パスワード",
    "password-placeholder": "オプションのパスワード",
    "hostname": "ホスト名",
    "hostname-placeholder": "example.com, 192.168.1.1 など",
    "port": "ポート",
    "port-placeholder": "80, 443, 8080 など"
  },
  "ko": {
    "protocol": "프로토콜",
    "protocol-placeholder": "https, http, ftp 등",
    "username": "사용자명",
    "username-placeholder": "선택적 사용자명",
    "password": "비밀번호",
    "password-placeholder": "선택적 비밀번호",
    "hostname": "호스트명",
    "hostname-placeholder": "example.com, 192.168.1.1 등",
    "port": "포트",
    "port-placeholder": "80, 443, 8080 등"
  },
  "ru": {
    "protocol": "Протокол",
    "protocol-placeholder": "https, http, ftp и т.д.",
    "username": "Имя пользователя",
    "username-placeholder": "Необязательное имя пользователя",
    "password": "Пароль",
    "password-placeholder": "Необязательный пароль",
    "hostname": "Имя хоста",
    "hostname-placeholder": "example.com, 192.168.1.1 и т.д.",
    "port": "Порт",
    "port-placeholder": "80, 443, 8080 и т.д."
  },
  "pt": {
    "protocol": "Protocolo",
    "protocol-placeholder": "https, http, ftp, etc.",
    "username": "Nome de usuário",
    "username-placeholder": "Nome de usuário opcional",
    "password": "Senha",
    "password-placeholder": "Senha opcional",
    "hostname": "Nome do host",
    "hostname-placeholder": "example.com, 192.168.1.1, etc.",
    "port": "Porta",
    "port-placeholder": "80, 443, 8080, etc."
  },
  "ar": {
    "protocol": "البروتوكول",
    "protocol-placeholder": "https, http, ftp إلخ",
    "username": "اسم المستخدم",
    "username-placeholder": "اسم مستخدم اختياري",
    "password": "كلمة المرور",
    "password-placeholder": "كلمة مرور اختيارية",
    "hostname": "اسم المضيف",
    "hostname-placeholder": "example.com, 192.168.1.1 إلخ",
    "port": "المنفذ",
    "port-placeholder": "80, 443, 8080 إلخ"
  },
  "hi": {
    "protocol": "प्रोटोकॉल",
    "protocol-placeholder": "https, http, ftp आदि",
    "username": "उपयोगकर्ता नाम",
    "username-placeholder": "वैकल्पिक उपयोगकर्ता नाम",
    "password": "पासवर्ड",
    "password-placeholder": "वैकल्पिक पासवर्ड",
    "hostname": "होस्टनाम",
    "hostname-placeholder": "example.com, 192.168.1.1 आदि",
    "port": "पोर्ट",
    "port-placeholder": "80, 443, 8080 आदि"
  },
  "tr": {
    "protocol": "Protokol",
    "protocol-placeholder": "https, http, ftp vb.",
    "username": "Kullanıcı adı",
    "username-placeholder": "İsteğe bağlı kullanıcı adı",
    "password": "Şifre",
    "password-placeholder": "İsteğe bağlı şifre",
    "hostname": "Ana bilgisayar adı",
    "hostname-placeholder": "example.com, 192.168.1.1 vb.",
    "port": "Port",
    "port-placeholder": "80, 443, 8080 vb."
  },
  "nl": {
    "protocol": "Protocol",
    "protocol-placeholder": "https, http, ftp, enz.",
    "username": "Gebruikersnaam",
    "username-placeholder": "Optionele gebruikersnaam",
    "password": "Wachtwoord",
    "password-placeholder": "Optioneel wachtwoord",
    "hostname": "Hostnaam",
    "hostname-placeholder": "example.com, 192.168.1.1, enz.",
    "port": "Poort",
    "port-placeholder": "80, 443, 8080, enz."
  },
  "sv": {
    "protocol": "Protokoll",
    "protocol-placeholder": "https, http, ftp, etc.",
    "username": "Användarnamn",
    "username-placeholder": "Valfritt användarnamn",
    "password": "Lösenord",
    "password-placeholder": "Valfritt lösenord",
    "hostname": "Värdnamn",
    "hostname-placeholder": "example.com, 192.168.1.1, etc.",
    "port": "Port",
    "port-placeholder": "80, 443, 8080, etc."
  },
  "pl": {
    "protocol": "Protokół",
    "protocol-placeholder": "https, http, ftp itp.",
    "username": "Nazwa użytkownika",
    "username-placeholder": "Opcjonalna nazwa użytkownika",
    "password": "Hasło",
    "password-placeholder": "Opcjonalne hasło",
    "hostname": "Nazwa hosta",
    "hostname-placeholder": "example.com, 192.168.1.1 itp.",
    "port": "Port",
    "port-placeholder": "80, 443, 8080 itp."
  },
  "vi": {
    "protocol": "Giao thức",
    "protocol-placeholder": "https, http, ftp, v.v.",
    "username": "Tên người dùng",
    "username-placeholder": "Tên người dùng tùy chọn",
    "password": "Mật khẩu",
    "password-placeholder": "Mật khẩu tùy chọn",
    "hostname": "Tên máy chủ",
    "hostname-placeholder": "example.com, 192.168.1.1, v.v.",
    "port": "Cổng",
    "port-placeholder": "80, 443, 8080, v.v."
  },
  "th": {
    "protocol": "โปรโตคอล",
    "protocol-placeholder": "https, http, ftp ฯลฯ",
    "username": "ชื่อผู้ใช้",
    "username-placeholder": "ชื่อผู้ใช้เสริม",
    "password": "รหัสผ่าน",
    "password-placeholder": "รหัสผ่านเสริม",
    "hostname": "ชื่อโฮสต์",
    "hostname-placeholder": "example.com, 192.168.1.1 ฯลฯ",
    "port": "พอร์ต",
    "port-placeholder": "80, 443, 8080 ฯลฯ"
  },
  "id": {
    "protocol": "Protokol",
    "protocol-placeholder": "https, http, ftp, dll.",
    "username": "Nama pengguna",
    "username-placeholder": "Nama pengguna opsional",
    "password": "Kata sandi",
    "password-placeholder": "Kata sandi opsional",
    "hostname": "Nama host",
    "hostname-placeholder": "example.com, 192.168.1.1, dll.",
    "port": "Port",
    "port-placeholder": "80, 443, 8080, dll."
  },
  "he": {
    "protocol": "פרוטוקול",
    "protocol-placeholder": "https, http, ftp וכו'",
    "username": "שם משתמש",
    "username-placeholder": "שם משתמש אופציונלי",
    "password": "סיסמה",
    "password-placeholder": "סיסמה אופציונלית",
    "hostname": "שם מארח",
    "hostname-placeholder": "example.com, 192.168.1.1 וכו'",
    "port": "יציאה",
    "port-placeholder": "80, 443, 8080 וכו'"
  },
  "ms": {
    "protocol": "Protokol",
    "protocol-placeholder": "https, http, ftp, dll.",
    "username": "Nama pengguna",
    "username-placeholder": "Nama pengguna pilihan",
    "password": "Kata laluan",
    "password-placeholder": "Kata laluan pilihan",
    "hostname": "Nama hos",
    "hostname-placeholder": "example.com, 192.168.1.1, dll.",
    "port": "Port",
    "port-placeholder": "80, 443, 8080, dll."
  },
  "no": {
    "protocol": "Protokoll",
    "protocol-placeholder": "https, http, ftp, etc.",
    "username": "Brukernavn",
    "username-placeholder": "Valgfritt brukernavn",
    "password": "Passord",
    "password-placeholder": "Valgfritt passord",
    "hostname": "Vertsnavn",
    "hostname-placeholder": "example.com, 192.168.1.1, etc.",
    "port": "Port",
    "port-placeholder": "80, 443, 8080, etc."
  }
}
</i18n>
