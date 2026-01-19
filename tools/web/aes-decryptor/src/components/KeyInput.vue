<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('keySettings') }}</ToolSectionHeader>
    <n-space vertical :size="12">
      <n-radio-group
        :value="keyType"
        name="key-type"
        @update:value="$emit('update:keyType', $event)"
      >
        <n-radio-button value="password">{{ t('password') }}</n-radio-button>
        <n-radio-button value="raw">{{ t('rawKey') }}</n-radio-button>
      </n-radio-group>

      <template v-if="keyType === 'password'">
        <n-input
          :value="password"
          type="password"
          show-password-on="click"
          :placeholder="t('passwordPlaceholder')"
          @update:value="$emit('update:password', $event)"
        />
      </template>

      <template v-else>
        <n-input
          :value="rawKey"
          :placeholder="t('rawKeyPlaceholder')"
          :status="rawKeyStatus"
          style="font-family: monospace"
          @update:value="$emit('update:rawKey', $event)"
        />
        <n-text v-if="rawKeyError" type="error" depth="3">{{ rawKeyError }}</n-text>
        <n-text depth="3">{{ t('keyLengthHint', { length: expectedKeyLength }) }}</n-text>
      </template>
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NSpace, NRadioGroup, NRadioButton, NInput, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { type KeyType, type KeyLength, isValidHex } from '@utils/aes'

const props = defineProps<{
  keyType: KeyType
  password: string
  rawKey: string
  keyLength: KeyLength
}>()

defineEmits<{
  'update:keyType': [value: KeyType]
  'update:password': [value: string]
  'update:rawKey': [value: string]
}>()

const { t } = useI18n()

const expectedKeyLength = computed(() => props.keyLength / 4)

const rawKeyStatus = computed(() => {
  if (!props.rawKey) return undefined
  if (!isValidHex(props.rawKey)) return 'error'
  const cleanHex = props.rawKey.replace(/\s/g, '')
  if (cleanHex.length !== expectedKeyLength.value) return 'error'
  return 'success'
})

const rawKeyError = computed(() => {
  if (!props.rawKey) return ''
  if (!isValidHex(props.rawKey)) return t('invalidHex')
  const cleanHex = props.rawKey.replace(/\s/g, '')
  if (cleanHex.length !== expectedKeyLength.value) {
    return t('wrongKeyLength', {
      expected: expectedKeyLength.value,
      actual: cleanHex.length,
    })
  }
  return ''
})
</script>

<i18n lang="json">
{
  "en": {
    "keySettings": "Key Settings",
    "password": "Password",
    "rawKey": "Raw Key",
    "passwordPlaceholder": "Enter password...",
    "rawKeyPlaceholder": "Enter hex key...",
    "keyLengthHint": "Expected {length} hex characters",
    "invalidHex": "Invalid hex format",
    "wrongKeyLength": "Expected {expected} hex chars, got {actual}"
  },
  "zh": {
    "keySettings": "密钥设置",
    "password": "密码",
    "rawKey": "原始密钥",
    "passwordPlaceholder": "输入密码...",
    "rawKeyPlaceholder": "输入十六进制密钥...",
    "keyLengthHint": "需要 {length} 个十六进制字符",
    "invalidHex": "无效的十六进制格式",
    "wrongKeyLength": "应为 {expected} 个十六进制字符，实际 {actual}"
  },
  "zh-CN": {
    "keySettings": "密钥设置",
    "password": "密码",
    "rawKey": "原始密钥",
    "passwordPlaceholder": "输入密码...",
    "rawKeyPlaceholder": "输入十六进制密钥...",
    "keyLengthHint": "需要 {length} 个十六进制字符",
    "invalidHex": "无效的十六进制格式",
    "wrongKeyLength": "应为 {expected} 个十六进制字符，实际 {actual}"
  },
  "zh-TW": {
    "keySettings": "密鑰設定",
    "password": "密碼",
    "rawKey": "原始密鑰",
    "passwordPlaceholder": "輸入密碼...",
    "rawKeyPlaceholder": "輸入十六進位密鑰...",
    "keyLengthHint": "需要 {length} 個十六進位字元",
    "invalidHex": "無效的十六進位格式",
    "wrongKeyLength": "應為 {expected} 個十六進位字元，實際 {actual}"
  },
  "zh-HK": {
    "keySettings": "密鑰設定",
    "password": "密碼",
    "rawKey": "原始密鑰",
    "passwordPlaceholder": "輸入密碼...",
    "rawKeyPlaceholder": "輸入十六進位密鑰...",
    "keyLengthHint": "需要 {length} 個十六進位字元",
    "invalidHex": "無效的十六進位格式",
    "wrongKeyLength": "應為 {expected} 個十六進位字元，實際 {actual}"
  },
  "es": {
    "keySettings": "Configuración de clave",
    "password": "Contraseña",
    "rawKey": "Clave bruta",
    "passwordPlaceholder": "Introduce la contraseña...",
    "rawKeyPlaceholder": "Introduce la clave hexadecimal...",
    "keyLengthHint": "Se esperan {length} caracteres hexadecimales",
    "invalidHex": "Formato hexadecimal no válido",
    "wrongKeyLength": "Se esperaban {expected} caracteres hexadecimales, se obtuvo {actual}"
  },
  "fr": {
    "keySettings": "Paramètres de la clé",
    "password": "Mot de passe",
    "rawKey": "Clé brute",
    "passwordPlaceholder": "Entrez le mot de passe...",
    "rawKeyPlaceholder": "Entrez la clé hexadécimale...",
    "keyLengthHint": "{length} caractères hexadécimaux attendus",
    "invalidHex": "Format hexadécimal invalide",
    "wrongKeyLength": "Attendait {expected} caractères hexadécimaux, obtenu {actual}"
  },
  "de": {
    "keySettings": "Schlüsseleinstellungen",
    "password": "Passwort",
    "rawKey": "Rohschlüssel",
    "passwordPlaceholder": "Passwort eingeben...",
    "rawKeyPlaceholder": "Hex-Schlüssel eingeben...",
    "keyLengthHint": "Erwartet {length} Hexadezimalzeichen",
    "invalidHex": "Ungültiges Hex-Format",
    "wrongKeyLength": "Erwartet {expected} Hexadezimalzeichen, erhalten {actual}"
  },
  "it": {
    "keySettings": "Impostazioni chiave",
    "password": "Password",
    "rawKey": "Chiave grezza",
    "passwordPlaceholder": "Inserisci la password...",
    "rawKeyPlaceholder": "Inserisci la chiave esadecimale...",
    "keyLengthHint": "Sono previsti {length} caratteri esadecimali",
    "invalidHex": "Formato esadecimale non valido",
    "wrongKeyLength": "Previsti {expected} caratteri esadecimali, ottenuti {actual}"
  },
  "ja": {
    "keySettings": "キー設定",
    "password": "パスワード",
    "rawKey": "生のキー",
    "passwordPlaceholder": "パスワードを入力...",
    "rawKeyPlaceholder": "16進キーを入力...",
    "keyLengthHint": "16進数 {length} 文字が必要です",
    "invalidHex": "無効な16進形式です",
    "wrongKeyLength": "16進数 {expected} 文字が必要です（現在 {actual}）"
  },
  "ko": {
    "keySettings": "키 설정",
    "password": "비밀번호",
    "rawKey": "원시 키",
    "passwordPlaceholder": "비밀번호를 입력하세요...",
    "rawKeyPlaceholder": "16진수 키를 입력하세요...",
    "keyLengthHint": "16진수 {length}자가 필요합니다",
    "invalidHex": "잘못된 16진수 형식",
    "wrongKeyLength": "16진수 {expected}자가 필요합니다. 현재 {actual}자입니다"
  },
  "ru": {
    "keySettings": "Настройки ключа",
    "password": "Пароль",
    "rawKey": "Необработанный ключ",
    "passwordPlaceholder": "Введите пароль...",
    "rawKeyPlaceholder": "Введите шестнадцатеричный ключ...",
    "keyLengthHint": "Ожидается {length} шестнадцатеричных символов",
    "invalidHex": "Неверный шестнадцатеричный формат",
    "wrongKeyLength": "Ожидалось {expected} шестнадцатеричных символов, получено {actual}"
  },
  "pt": {
    "keySettings": "Configurações da chave",
    "password": "Senha",
    "rawKey": "Chave bruta",
    "passwordPlaceholder": "Digite a senha...",
    "rawKeyPlaceholder": "Digite a chave hexadecimal...",
    "keyLengthHint": "Esperados {length} caracteres hexadecimais",
    "invalidHex": "Formato hexadecimal inválido",
    "wrongKeyLength": "Esperados {expected} caracteres hexadecimais, obtidos {actual}"
  },
  "ar": {
    "keySettings": "إعدادات المفتاح",
    "password": "كلمة المرور",
    "rawKey": "مفتاح خام",
    "passwordPlaceholder": "أدخل كلمة المرور...",
    "rawKeyPlaceholder": "أدخل مفتاحًا سداسيًا عشريًا...",
    "keyLengthHint": "المتوقع {length} حرفًا سداسيًا عشريًا",
    "invalidHex": "تنسيق سداسي عشري غير صالح",
    "wrongKeyLength": "المتوقع {expected} حرفًا سداسيًا عشريًا، تم إدخال {actual}"
  },
  "hi": {
    "keySettings": "कुंजी सेटिंग्स",
    "password": "पासवर्ड",
    "rawKey": "कच्ची कुंजी",
    "passwordPlaceholder": "पासवर्ड डालें...",
    "rawKeyPlaceholder": "हेक्स कुंजी दर्ज करें...",
    "keyLengthHint": "अपेक्षित {length} हेक्स वर्ण",
    "invalidHex": "अमान्य हेक्स प्रारूप",
    "wrongKeyLength": "{expected} हेक्स वर्ण अपेक्षित थे, {actual} मिले"
  },
  "tr": {
    "keySettings": "Anahtar ayarları",
    "password": "Şifre",
    "rawKey": "Ham anahtar",
    "passwordPlaceholder": "Şifreyi girin...",
    "rawKeyPlaceholder": "Onaltılık anahtarı girin...",
    "keyLengthHint": "{length} onaltılık karakter bekleniyor",
    "invalidHex": "Geçersiz onaltılık biçim",
    "wrongKeyLength": "{expected} onaltılı karakter bekleniyordu, {actual} alındı"
  },
  "nl": {
    "keySettings": "Sleutelinstellingen",
    "password": "Wachtwoord",
    "rawKey": "Ruwe sleutel",
    "passwordPlaceholder": "Voer wachtwoord in...",
    "rawKeyPlaceholder": "Voer hex-sleutel in...",
    "keyLengthHint": "{length} hexadecimale tekens verwacht",
    "invalidHex": "Ongeldig hex-formaat",
    "wrongKeyLength": "{expected} hexadecimale tekens verwacht, {actual} gekregen"
  },
  "sv": {
    "keySettings": "Nyckelinställningar",
    "password": "Lösenord",
    "rawKey": "Rå nyckel",
    "passwordPlaceholder": "Ange lösenord...",
    "rawKeyPlaceholder": "Ange hex-nyckel...",
    "keyLengthHint": "{length} hexadecimala tecken förväntas",
    "invalidHex": "Ogiltigt hex-format",
    "wrongKeyLength": "{expected} hexadecimala tecken förväntades, fick {actual}"
  },
  "pl": {
    "keySettings": "Ustawienia klucza",
    "password": "Hasło",
    "rawKey": "Surowy klucz",
    "passwordPlaceholder": "Wpisz hasło...",
    "rawKeyPlaceholder": "Wprowadź klucz szesnastkowy...",
    "keyLengthHint": "Oczekiwano {length} znaków szesnastkowych",
    "invalidHex": "Nieprawidłowy format szesnastkowy",
    "wrongKeyLength": "Oczekiwano {expected} znaków szesnastkowych, otrzymano {actual}"
  },
  "vi": {
    "keySettings": "Cài đặt khóa",
    "password": "Mật khẩu",
    "rawKey": "Khóa thô",
    "passwordPlaceholder": "Nhập mật khẩu...",
    "rawKeyPlaceholder": "Nhập khóa thập lục phân...",
    "keyLengthHint": "Cần {length} ký tự thập lục phân",
    "invalidHex": "Định dạng thập lục phân không hợp lệ",
    "wrongKeyLength": "Cần {expected} ký tự thập lục phân, hiện có {actual}"
  },
  "th": {
    "keySettings": "การตั้งค่าคีย์",
    "password": "รหัสผ่าน",
    "rawKey": "คีย์ดิบ",
    "passwordPlaceholder": "ใส่รหัสผ่าน...",
    "rawKeyPlaceholder": "ป้อนคีย์ฐานสิบหก...",
    "keyLengthHint": "ต้องมีอักขระฐานสิบหก {length} ตัว",
    "invalidHex": "รูปแบบฐานสิบหกไม่ถูกต้อง",
    "wrongKeyLength": "คาดหวัง {expected} อักขระฐานสิบหก ได้รับ {actual}"
  },
  "id": {
    "keySettings": "Pengaturan kunci",
    "password": "Kata sandi",
    "rawKey": "Kunci mentah",
    "passwordPlaceholder": "Masukkan kata sandi...",
    "rawKeyPlaceholder": "Masukkan kunci heksadesimal...",
    "keyLengthHint": "Diharapkan {length} karakter heksadesimal",
    "invalidHex": "Format heksadesimal tidak valid",
    "wrongKeyLength": "Diharapkan {expected} karakter heksadesimal, didapat {actual}"
  },
  "he": {
    "keySettings": "הגדרות מפתח",
    "password": "סיסמה",
    "rawKey": "מפתח גולמי",
    "passwordPlaceholder": "הזן סיסמה...",
    "rawKeyPlaceholder": "הזן מפתח הקסדצימלי...",
    "keyLengthHint": "נדרשים {length} תווים הקסדצימליים",
    "invalidHex": "פורמט הקסדצימלי לא תקין",
    "wrongKeyLength": "נדרשו {expected} תווים הקסדצימליים, התקבלו {actual}"
  },
  "ms": {
    "keySettings": "Tetapan kunci",
    "password": "Kata laluan",
    "rawKey": "Kunci mentah",
    "passwordPlaceholder": "Masukkan kata laluan...",
    "rawKeyPlaceholder": "Masukkan kunci heksadesimal...",
    "keyLengthHint": "Dijangka {length} aksara heksadesimal",
    "invalidHex": "Format heksadesimal tidak sah",
    "wrongKeyLength": "Dijangka {expected} aksara heksadesimal, diperoleh {actual}"
  },
  "no": {
    "keySettings": "Nøkkelinnstillinger",
    "password": "Passord",
    "rawKey": "Rå nøkkel",
    "passwordPlaceholder": "Skriv inn passord...",
    "rawKeyPlaceholder": "Skriv inn heksadesimal nøkkel...",
    "keyLengthHint": "Forventet {length} heksadesimale tegn",
    "invalidHex": "Ugyldig heksadesimalt format",
    "wrongKeyLength": "Forventet {expected} heksadesimale tegn, fikk {actual}"
  }
}
</i18n>
