<template>
  <ToolSectionHeader>{{ t('config-header') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 s:2" :x-gap="12" :y-gap="12">
      <n-gi>
        <n-form-item :label="t('password')">
          <n-input
            v-model:value="password"
            type="password"
            show-password-on="click"
            :placeholder="t('password')"
            :input-props="{ autocomplete: 'off' }"
          />
        </n-form-item>
      </n-gi>
      <n-gi>
        <n-form-item :label="t('algorithm')" :show-feedback="false">
          <n-select v-model:value="algorithm" :options="ALGORITHM_OPTIONS" />
        </n-form-item>
      </n-gi>
      <n-gi :span="2">
        <TextOrFileInput
          v-model:value="salt"
          :label="t('salt')"
          :placeholder="t('salt')"
          :validation-status="saltStatus"
          :feedback="saltFeedback"
          :show-feedback="!!saltFeedback"
        />
      </n-gi>
      <n-gi>
        <n-form-item :label="t('salt-format')" :show-feedback="false">
          <n-select v-model:value="saltFormat" :options="SALT_FORMAT_OPTIONS" />
        </n-form-item>
      </n-gi>
      <n-gi>
        <n-form-item
          :label="t('iterations')"
          :validation-status="iterationsStatus"
          :feedback="iterationsFeedback"
          :show-feedback="!!iterationsFeedback"
        >
          <n-input-number
            v-model:value="iterations"
            :min="iterationsMin"
            :max="iterationsMax"
            :step="1000"
            :precision="0"
            style="width: 100%"
          />
        </n-form-item>
      </n-gi>
      <n-gi :span="2">
        <n-form-item
          :label="t('length')"
          :validation-status="lengthStatus"
          :feedback="lengthFeedback"
          :show-feedback="!!lengthFeedback"
        >
          <n-input-number
            v-model:value="length"
            :min="lengthMin"
            :max="lengthMax"
            :step="1"
            :precision="0"
            style="width: 100%"
          />
        </n-form-item>
      </n-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NFormItem, NInput, NInputNumber, NSelect, NGi, NGrid } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { TextOrFileInput } from '@shared/ui/base'
import { ALGORITHM_OPTIONS, SALT_FORMAT_OPTIONS } from '../types'
import type { Pbkdf2Algorithm, SaltFormat } from '../types'

const { t } = useI18n()

const props = defineProps<{
  iterationsMin: number
  iterationsMax: number
  lengthMin: number
  lengthMax: number
  iterationsValid: boolean
  lengthValid: boolean
  saltErrorType: '' | 'hex' | 'base64'
}>()

const password = defineModel<string>('password', { required: true })
const salt = defineModel<string | File>('salt', { required: true })
const saltFormat = defineModel<SaltFormat>('saltFormat', { required: true })
const algorithm = defineModel<Pbkdf2Algorithm>('algorithm', { required: true })
const iterations = defineModel<number | null>('iterations', { required: true })
const length = defineModel<number | null>('length', { required: true })

const iterationsStatus = computed(() => (props.iterationsValid ? undefined : 'error'))
const lengthStatus = computed(() => (props.lengthValid ? undefined : 'error'))

const iterationsFeedback = computed(() => {
  if (props.iterationsValid) return ''
  return t('iterations-invalid', { min: props.iterationsMin, max: props.iterationsMax })
})

const lengthFeedback = computed(() => {
  if (props.lengthValid) return ''
  return t('length-invalid', { min: props.lengthMin, max: props.lengthMax })
})

const saltFeedback = computed(() => {
  if (props.saltErrorType === 'hex') return t('salt-invalid-hex')
  if (props.saltErrorType === 'base64') return t('salt-invalid-base64')
  return ''
})

const saltStatus = computed(() => (props.saltErrorType ? 'error' : undefined))
</script>

<i18n lang="json">
{
  "en": {
    "config-header": "Configuration",
    "password": "Password",
    "salt": "Salt",
    "salt-format": "Salt Format",
    "algorithm": "Algorithm",
    "iterations": "Iterations",
    "length": "Derived Length (bytes)",
    "iterations-invalid": "Enter a whole number between {min} and {max}.",
    "length-invalid": "Enter a number between {min} and {max} bytes.",
    "salt-invalid-hex": "Salt must be valid hex.",
    "salt-invalid-base64": "Salt must be valid Base64."
  },
  "zh": {
    "config-header": "配置",
    "password": "密码",
    "salt": "盐",
    "salt-format": "盐格式",
    "algorithm": "算法",
    "iterations": "迭代次数",
    "length": "派生长度（字节）",
    "iterations-invalid": "请输入介于 {min} 和 {max} 之间的整数。",
    "length-invalid": "请输入介于 {min} 和 {max} 字节之间的数值。",
    "salt-invalid-hex": "盐必须是有效的十六进制。",
    "salt-invalid-base64": "盐必须是有效的 Base64。"
  },
  "zh-CN": {
    "config-header": "配置",
    "password": "密码",
    "salt": "盐",
    "salt-format": "盐格式",
    "algorithm": "算法",
    "iterations": "迭代次数",
    "length": "派生长度（字节）",
    "iterations-invalid": "请输入介于 {min} 和 {max} 之间的整数。",
    "length-invalid": "请输入介于 {min} 和 {max} 字节之间的数值。",
    "salt-invalid-hex": "盐必须是有效的十六进制。",
    "salt-invalid-base64": "盐必须是有效的 Base64。"
  },
  "zh-TW": {
    "config-header": "設定",
    "password": "密碼",
    "salt": "鹽",
    "salt-format": "鹽格式",
    "algorithm": "演算法",
    "iterations": "迭代次數",
    "length": "派生長度（位元組）",
    "iterations-invalid": "請輸入介於 {min} 和 {max} 之間的整數。",
    "length-invalid": "請輸入介於 {min} 和 {max} 位元組之間的數值。",
    "salt-invalid-hex": "鹽必須是有效的十六進位。",
    "salt-invalid-base64": "鹽必須是有效的 Base64。"
  },
  "zh-HK": {
    "config-header": "設定",
    "password": "密碼",
    "salt": "鹽",
    "salt-format": "鹽格式",
    "algorithm": "演算法",
    "iterations": "迭代次數",
    "length": "派生長度（位元組）",
    "iterations-invalid": "請輸入介於 {min} 和 {max} 之間的整數。",
    "length-invalid": "請輸入介於 {min} 和 {max} 位元組之間的數值。",
    "salt-invalid-hex": "鹽必須是有效的十六進位。",
    "salt-invalid-base64": "鹽必須是有效的 Base64。"
  },
  "es": {
    "config-header": "Configuración",
    "password": "Contraseña",
    "salt": "Sal",
    "salt-format": "Formato de Sal",
    "algorithm": "Algoritmo",
    "iterations": "Iteraciones",
    "length": "Longitud Derivada (bytes)",
    "iterations-invalid": "Introduce un número entero entre {min} y {max}.",
    "length-invalid": "Introduce un número entre {min} y {max} bytes.",
    "salt-invalid-hex": "La sal debe ser un hex válido.",
    "salt-invalid-base64": "La sal debe ser Base64 válida."
  },
  "fr": {
    "config-header": "Configuration",
    "password": "Mot de passe",
    "salt": "Sel",
    "salt-format": "Format du Sel",
    "algorithm": "Algorithme",
    "iterations": "Itérations",
    "length": "Longueur dérivée (octets)",
    "iterations-invalid": "Entrez un entier entre {min} et {max}.",
    "length-invalid": "Entrez un nombre entre {min} et {max} octets.",
    "salt-invalid-hex": "Le sel doit être un hex valide.",
    "salt-invalid-base64": "Le sel doit être un Base64 valide."
  },
  "de": {
    "config-header": "Konfiguration",
    "password": "Passwort",
    "salt": "Salt",
    "salt-format": "Salt-Format",
    "algorithm": "Algorithmus",
    "iterations": "Iterationen",
    "length": "Abgeleitete Länge (Bytes)",
    "iterations-invalid": "Geben Sie eine ganze Zahl zwischen {min} und {max} ein.",
    "length-invalid": "Geben Sie eine Zahl zwischen {min} und {max} Bytes ein.",
    "salt-invalid-hex": "Salt muss gültiges Hex sein.",
    "salt-invalid-base64": "Salt muss gültiges Base64 sein."
  },
  "it": {
    "config-header": "Configurazione",
    "password": "Password",
    "salt": "Salt",
    "salt-format": "Formato Salt",
    "algorithm": "Algoritmo",
    "iterations": "Iterazioni",
    "length": "Lunghezza derivata (byte)",
    "iterations-invalid": "Inserisci un numero intero tra {min} e {max}.",
    "length-invalid": "Inserisci un numero tra {min} e {max} byte.",
    "salt-invalid-hex": "Il salt deve essere un hex valido.",
    "salt-invalid-base64": "Il salt deve essere Base64 valido."
  },
  "ja": {
    "config-header": "設定",
    "password": "パスワード",
    "salt": "ソルト",
    "salt-format": "ソルト形式",
    "algorithm": "アルゴリズム",
    "iterations": "反復回数",
    "length": "派生長（バイト）",
    "iterations-invalid": "{min}〜{max}の整数を入力してください。",
    "length-invalid": "{min}〜{max}バイトの数値を入力してください。",
    "salt-invalid-hex": "ソルトは有効な16進数である必要があります。",
    "salt-invalid-base64": "ソルトは有効なBase64である必要があります。"
  },
  "ko": {
    "config-header": "구성",
    "password": "비밀번호",
    "salt": "솔트",
    "salt-format": "솔트 형식",
    "algorithm": "알고리즘",
    "iterations": "반복 횟수",
    "length": "파생 길이(바이트)",
    "iterations-invalid": "{min}~{max} 사이의 정수를 입력하세요.",
    "length-invalid": "{min}~{max}바이트 사이의 값을 입력하세요.",
    "salt-invalid-hex": "솔트는 유효한 16진수여야 합니다.",
    "salt-invalid-base64": "솔트는 유효한 Base64여야 합니다."
  },
  "ru": {
    "config-header": "Конфигурация",
    "password": "Пароль",
    "salt": "Соль",
    "salt-format": "Формат соли",
    "algorithm": "Алгоритм",
    "iterations": "Итерации",
    "length": "Длина вывода (байты)",
    "iterations-invalid": "Введите целое число между {min} и {max}.",
    "length-invalid": "Введите число между {min} и {max} байт.",
    "salt-invalid-hex": "Соль должна быть корректным hex.",
    "salt-invalid-base64": "Соль должна быть корректным Base64."
  },
  "pt": {
    "config-header": "Configuração",
    "password": "Senha",
    "salt": "Salt",
    "salt-format": "Formato do Salt",
    "algorithm": "Algoritmo",
    "iterations": "Iterações",
    "length": "Comprimento derivado (bytes)",
    "iterations-invalid": "Digite um número inteiro entre {min} e {max}.",
    "length-invalid": "Digite um número entre {min} e {max} bytes.",
    "salt-invalid-hex": "O salt deve ser hex válido.",
    "salt-invalid-base64": "O salt deve ser Base64 válido."
  },
  "ar": {
    "config-header": "الإعدادات",
    "password": "كلمة المرور",
    "salt": "الملح",
    "salt-format": "تنسيق الملح",
    "algorithm": "الخوارزمية",
    "iterations": "عدد التكرارات",
    "length": "طول الاشتقاق (بايت)",
    "iterations-invalid": "أدخل عددًا صحيحًا بين {min} و {max}.",
    "length-invalid": "أدخل رقمًا بين {min} و {max} بايت.",
    "salt-invalid-hex": "يجب أن يكون الملح سداسيًا صالحًا.",
    "salt-invalid-base64": "يجب أن يكون الملح Base64 صالحًا."
  },
  "hi": {
    "config-header": "कॉन्फ़िगरेशन",
    "password": "पासवर्ड",
    "salt": "सॉल्ट",
    "salt-format": "सॉल्ट फ़ॉर्मेट",
    "algorithm": "एल्गोरिदम",
    "iterations": "इटरेशन",
    "length": "व्युत्पन्न लंबाई (बाइट)",
    "iterations-invalid": "{min} और {max} के बीच पूर्णांक दर्ज करें।",
    "length-invalid": "{min} और {max} बाइट के बीच संख्या दर्ज करें।",
    "salt-invalid-hex": "सॉल्ट मान्य हेक्स होना चाहिए।",
    "salt-invalid-base64": "सॉल्ट मान्य Base64 होना चाहिए।"
  },
  "tr": {
    "config-header": "Yapılandırma",
    "password": "Parola",
    "salt": "Tuz",
    "salt-format": "Tuz Biçimi",
    "algorithm": "Algoritma",
    "iterations": "Yineleme Sayısı",
    "length": "Türetilen Uzunluk (bayt)",
    "iterations-invalid": "{min} ile {max} arasında tam sayı girin.",
    "length-invalid": "{min} ile {max} bayt arasında bir sayı girin.",
    "salt-invalid-hex": "Tuz geçerli bir hex olmalıdır.",
    "salt-invalid-base64": "Tuz geçerli bir Base64 olmalıdır."
  },
  "nl": {
    "config-header": "Configuratie",
    "password": "Wachtwoord",
    "salt": "Salt",
    "salt-format": "Salt-formaat",
    "algorithm": "Algoritme",
    "iterations": "Iteraties",
    "length": "Afgeleide lengte (bytes)",
    "iterations-invalid": "Voer een geheel getal in tussen {min} en {max}.",
    "length-invalid": "Voer een getal in tussen {min} en {max} bytes.",
    "salt-invalid-hex": "Salt moet geldige hex zijn.",
    "salt-invalid-base64": "Salt moet geldige Base64 zijn."
  },
  "sv": {
    "config-header": "Konfiguration",
    "password": "Lösenord",
    "salt": "Salt",
    "salt-format": "Salt-format",
    "algorithm": "Algoritm",
    "iterations": "Iterationer",
    "length": "Härledd längd (byte)",
    "iterations-invalid": "Ange ett heltal mellan {min} och {max}.",
    "length-invalid": "Ange ett tal mellan {min} och {max} byte.",
    "salt-invalid-hex": "Salt måste vara giltig hex.",
    "salt-invalid-base64": "Salt måste vara giltig Base64."
  },
  "pl": {
    "config-header": "Konfiguracja",
    "password": "Hasło",
    "salt": "Sól",
    "salt-format": "Format soli",
    "algorithm": "Algorytm",
    "iterations": "Iteracje",
    "length": "Długość pochodna (bajty)",
    "iterations-invalid": "Wprowadź liczbę całkowitą między {min} a {max}.",
    "length-invalid": "Wprowadź liczbę między {min} a {max} bajtów.",
    "salt-invalid-hex": "Sól musi być poprawnym hex.",
    "salt-invalid-base64": "Sól musi być poprawnym Base64."
  },
  "vi": {
    "config-header": "Cấu hình",
    "password": "Mật khẩu",
    "salt": "Muối",
    "salt-format": "Định dạng muối",
    "algorithm": "Thuật toán",
    "iterations": "Số vòng lặp",
    "length": "Độ dài suy xuất (byte)",
    "iterations-invalid": "Nhập số nguyên từ {min} đến {max}.",
    "length-invalid": "Nhập số từ {min} đến {max} byte.",
    "salt-invalid-hex": "Muối phải là hex hợp lệ.",
    "salt-invalid-base64": "Muối phải là Base64 hợp lệ."
  },
  "th": {
    "config-header": "การกำหนดค่า",
    "password": "รหัสผ่าน",
    "salt": "ซอลต์",
    "salt-format": "รูปแบบซอลต์",
    "algorithm": "อัลกอริทึม",
    "iterations": "จำนวนรอบ",
    "length": "ความยาวที่ได้ (ไบต์)",
    "iterations-invalid": "กรอกจำนวนเต็มระหว่าง {min} และ {max}.",
    "length-invalid": "กรอกตัวเลขระหว่าง {min} และ {max} ไบต์.",
    "salt-invalid-hex": "ซอลต์ต้องเป็น hex ที่ถูกต้อง.",
    "salt-invalid-base64": "ซอลต์ต้องเป็น Base64 ที่ถูกต้อง."
  },
  "id": {
    "config-header": "Konfigurasi",
    "password": "Kata sandi",
    "salt": "Salt",
    "salt-format": "Format Salt",
    "algorithm": "Algoritma",
    "iterations": "Iterasi",
    "length": "Panjang turunan (byte)",
    "iterations-invalid": "Masukkan bilangan bulat antara {min} dan {max}.",
    "length-invalid": "Masukkan angka antara {min} dan {max} byte.",
    "salt-invalid-hex": "Salt harus hex yang valid.",
    "salt-invalid-base64": "Salt harus Base64 yang valid."
  },
  "he": {
    "config-header": "הגדרות",
    "password": "סיסמה",
    "salt": "מלח",
    "salt-format": "פורמט מלח",
    "algorithm": "אלגוריתם",
    "iterations": "איטרציות",
    "length": "אורך נגזר (בייט)",
    "iterations-invalid": "הזן מספר שלם בין {min} ל-{max}.",
    "length-invalid": "הזן מספר בין {min} ל-{max} בייט.",
    "salt-invalid-hex": "המלח חייב להיות hex תקין.",
    "salt-invalid-base64": "המלח חייב להיות Base64 תקין."
  },
  "ms": {
    "config-header": "Konfigurasi",
    "password": "Kata laluan",
    "salt": "Salt",
    "salt-format": "Format Salt",
    "algorithm": "Algoritma",
    "iterations": "Iterasi",
    "length": "Panjang terbitan (bait)",
    "iterations-invalid": "Masukkan nombor bulat antara {min} dan {max}.",
    "length-invalid": "Masukkan nombor antara {min} dan {max} bait.",
    "salt-invalid-hex": "Salt mesti hex yang sah.",
    "salt-invalid-base64": "Salt mesti Base64 yang sah."
  },
  "no": {
    "config-header": "Konfigurasjon",
    "password": "Passord",
    "salt": "Salt",
    "salt-format": "Salt-format",
    "algorithm": "Algoritme",
    "iterations": "Iterasjoner",
    "length": "Avledet lengde (byte)",
    "iterations-invalid": "Skriv inn et heltall mellom {min} og {max}.",
    "length-invalid": "Skriv inn et tall mellom {min} og {max} byte.",
    "salt-invalid-hex": "Salt må være gyldig hex.",
    "salt-invalid-base64": "Salt må være gyldig Base64."
  }
}
</i18n>
