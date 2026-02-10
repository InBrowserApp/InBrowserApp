<template>
  <ToolSectionHeader>{{ t('config-header') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 s:2" :x-gap="12" :y-gap="12">
      <n-gi>
        <n-form-item :label="t('password')" :show-feedback="false">
          <n-input
            v-model:value="password"
            type="password"
            show-password-on="click"
            :input-props="{ autocomplete: 'off' }"
          />
        </n-form-item>
      </n-gi>
      <n-gi>
        <n-form-item :label="t('algorithm')" :show-feedback="false">
          <n-select v-model:value="algorithm" :options="ALGORITHM_OPTIONS" />
        </n-form-item>
      </n-gi>
      <n-gi>
        <n-form-item
          :label="t('iterations')"
          :validation-status="iterationsStatus"
          :show-feedback="false"
        >
          <n-input-number
            v-model:value="iterations"
            :min="iterationsMin"
            :max="iterationsMax"
            :step="1"
            :precision="0"
            style="width: 100%"
          />
        </n-form-item>
      </n-gi>
      <n-gi>
        <n-form-item
          :label="t('memory-size')"
          :validation-status="memoryStatus"
          :show-feedback="false"
        >
          <n-input-number
            v-model:value="memorySize"
            :min="memoryMin"
            :max="memoryMax"
            :step="8"
            :precision="0"
            style="width: 100%"
          />
        </n-form-item>
      </n-gi>
      <n-gi>
        <n-form-item
          :label="t('parallelism')"
          :validation-status="parallelismStatus"
          :show-feedback="false"
        >
          <n-input-number
            v-model:value="parallelism"
            :min="parallelismMin"
            :max="parallelismMax"
            :step="1"
            :precision="0"
            style="width: 100%"
          />
        </n-form-item>
      </n-gi>
      <n-gi>
        <n-form-item
          :label="t('hash-length')"
          :validation-status="hashLengthStatus"
          :show-feedback="false"
        >
          <n-input-number
            v-model:value="hashLength"
            :min="hashLengthMin"
            :max="hashLengthMax"
            :step="1"
            :precision="0"
            style="width: 100%"
          />
        </n-form-item>
      </n-gi>
      <n-gi :span="2">
        <n-form-item :label="t('salt')" :validation-status="saltStatus" :show-feedback="false">
          <n-input v-model:value="salt" />
        </n-form-item>
      </n-gi>
      <n-gi :span="2">
        <n-button secondary @click="emit('generate-salt')">{{ t('generate-salt') }}</n-button>
      </n-gi>
      <n-gi :span="2">
        <n-form-item :label="t('secret')" :show-feedback="false">
          <n-input
            v-model:value="secret"
            type="password"
            show-password-on="click"
            :input-props="{ autocomplete: 'off' }"
          />
        </n-form-item>
      </n-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NButton, NFormItem, NGi, NGrid, NInput, NInputNumber, NSelect } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { ALGORITHM_OPTIONS } from '../types'
import type { Argon2Algorithm } from '../types'

const props = defineProps<{
  iterationsMin: number
  iterationsMax: number
  memoryMin: number
  memoryMax: number
  parallelismMin: number
  parallelismMax: number
  hashLengthMin: number
  hashLengthMax: number
  iterationsValid: boolean
  memoryValid: boolean
  parallelismValid: boolean
  hashLengthValid: boolean
  memoryDependencyValid: boolean
  saltErrorType: '' | 'required' | 'base64'
}>()

const emit = defineEmits<{
  'generate-salt': []
}>()

const password = defineModel<string>('password', { required: true })
const secret = defineModel<string>('secret', { required: true })
const algorithm = defineModel<Argon2Algorithm>('algorithm', { required: true })
const iterations = defineModel<number | null>('iterations', { required: true })
const memorySize = defineModel<number | null>('memorySize', { required: true })
const parallelism = defineModel<number | null>('parallelism', { required: true })
const hashLength = defineModel<number | null>('hashLength', { required: true })
const salt = defineModel<string>('salt', { required: true })

const { t } = useI18n()

const iterationsStatus = computed(() => (props.iterationsValid ? undefined : 'error'))
const parallelismStatus = computed(() => (props.parallelismValid ? undefined : 'error'))
const hashLengthStatus = computed(() => (props.hashLengthValid ? undefined : 'error'))
const memoryStatus = computed(() =>
  props.memoryValid && props.memoryDependencyValid ? undefined : 'error',
)
const saltStatus = computed(() => (props.saltErrorType ? 'error' : undefined))
</script>

<i18n lang="json">
{
  "en": {
    "config-header": "Configuration",
    "password": "Password",
    "algorithm": "Algorithm",
    "iterations": "Iterations",
    "memory-size": "Memory Size (KiB)",
    "parallelism": "Parallelism",
    "hash-length": "Hash Length (bytes)",
    "salt": "Salt (Base64)",
    "secret": "Secret (Optional)",
    "generate-salt": "Generate Random Salt"
  },
  "zh": {
    "config-header": "配置",
    "password": "密码",
    "algorithm": "算法",
    "iterations": "迭代次数",
    "memory-size": "内存大小 (KiB)",
    "parallelism": "并行度",
    "hash-length": "哈希长度（字节）",
    "salt": "盐值",
    "secret": "密钥（可选）",
    "generate-salt": "生成随机盐值"
  },
  "zh-CN": {
    "config-header": "配置",
    "password": "密码",
    "algorithm": "算法",
    "iterations": "迭代次数",
    "memory-size": "内存大小 (KiB)",
    "parallelism": "并行度",
    "hash-length": "哈希长度（字节）",
    "salt": "盐值",
    "secret": "密钥（可选）",
    "generate-salt": "生成随机盐值"
  },
  "zh-TW": {
    "config-header": "設定",
    "password": "密碼",
    "algorithm": "演算法",
    "iterations": "迭代次數",
    "memory-size": "記憶體大小 (KiB)",
    "parallelism": "平行度",
    "hash-length": "雜湊長度（位元組）",
    "salt": "鹽值",
    "secret": "密鑰（可選）",
    "generate-salt": "產生隨機鹽值"
  },
  "zh-HK": {
    "config-header": "設定",
    "password": "密碼",
    "algorithm": "演算法",
    "iterations": "迭代次數",
    "memory-size": "記憶體大小 (KiB)",
    "parallelism": "平行度",
    "hash-length": "雜湊長度（位元組）",
    "salt": "鹽值",
    "secret": "密鑰（可選）",
    "generate-salt": "產生隨機鹽值"
  },
  "es": {
    "config-header": "Configuración",
    "password": "Contraseña",
    "algorithm": "Algoritmo",
    "iterations": "Iteraciones",
    "memory-size": "Tamaño de la memoria (KiB)",
    "parallelism": "Paralelismo",
    "hash-length": "Longitud del hash (bytes)",
    "salt": "Sal (Base64)",
    "secret": "Secreto (opcional)",
    "generate-salt": "Generar sal aleatoria"
  },
  "fr": {
    "config-header": "Paramètres",
    "password": "Mot de passe",
    "algorithm": "Algorithme",
    "iterations": "Itérations",
    "memory-size": "Taille de la mémoire (KiB)",
    "parallelism": "Parallélisme",
    "hash-length": "Longueur de hachage (octets)",
    "salt": "Sel (Base64)",
    "secret": "Secret (facultatif)",
    "generate-salt": "Générer du sel aléatoire"
  },
  "de": {
    "config-header": "Konfiguration",
    "password": "Passwort",
    "algorithm": "Algorithmus",
    "iterations": "Iterationen",
    "memory-size": "Speichergröße (KiB)",
    "parallelism": "Parallelität",
    "hash-length": "Hash-Länge (Byte)",
    "salt": "Salz (Base64)",
    "secret": "Geheimnis (optional)",
    "generate-salt": "Generieren Sie zufälliges Salz"
  },
  "it": {
    "config-header": "Configurazione",
    "password": "Parola",
    "algorithm": "Algoritmo",
    "iterations": "Iterazioni",
    "memory-size": "Dimensioni memoria (KiB)",
    "parallelism": "Parallelismo",
    "hash-length": "Lunghezza hash (byte)",
    "salt": "Sale (Base64)",
    "secret": "Segreto (facoltativo)",
    "generate-salt": "Genera sale casuale"
  },
  "ja": {
    "config-header": "構成",
    "password": "パスワード",
    "algorithm": "アルゴリズム",
    "iterations": "反復",
    "memory-size": "メモリサイズ (KiB)",
    "parallelism": "平行度",
    "hash-length": "ハッシュ長 (バイト)",
    "salt": "塩 (Base64)",
    "secret": "シークレット (オプション)",
    "generate-salt": "ランダムなソルトを生成する"
  },
  "ko": {
    "config-header": "구성",
    "password": "비밀번호",
    "algorithm": "연산",
    "iterations": "반복",
    "memory-size": "메모리 크기(KiB)",
    "parallelism": "병행",
    "hash-length": "해시 길이(바이트)",
    "salt": "소금 (Base64)",
    "secret": "비밀(선택사항)",
    "generate-salt": "무작위 소금 생성"
  },
  "ru": {
    "config-header": "Конфигурация",
    "password": "Пароль",
    "algorithm": "Алгоритм",
    "iterations": "Итерации",
    "memory-size": "Объем памяти (KiB)",
    "parallelism": "Параллелизм",
    "hash-length": "Длина хеша (байты)",
    "salt": "Соль (Base64)",
    "secret": "Секрет (необязательно)",
    "generate-salt": "Генерация случайной соли"
  },
  "pt": {
    "config-header": "Configuração",
    "password": "Senha",
    "algorithm": "Algoritmo",
    "iterations": "Iterações",
    "memory-size": "Tamanho da memória (KiB)",
    "parallelism": "Paralelismo",
    "hash-length": "Comprimento do hash (bytes)",
    "salt": "Sal (Base64)",
    "secret": "Segredo (opcional)",
    "generate-salt": "Gerar sal aleatório"
  },
  "ar": {
    "config-header": "إعدادات",
    "password": "كلمة المرور",
    "algorithm": "خوارزمية",
    "iterations": "التكرارات",
    "memory-size": "حجم الذاكرة (KiB)",
    "parallelism": "التوازي",
    "hash-length": "طول التجزئة (بايت)",
    "salt": "ملح (Base64)",
    "secret": "سري (اختياري)",
    "generate-salt": "توليد الملح العشوائي"
  },
  "hi": {
    "config-header": "विन्यास",
    "password": "पासवर्ड",
    "algorithm": "एल्गोरिदम",
    "iterations": "पुनरावृत्तियों",
    "memory-size": "मेमोरी साइज (KiB)",
    "parallelism": "समानता",
    "hash-length": "हैश लंबाई (बाइट्स)",
    "salt": "नमक (Base64)",
    "secret": "गुप्त (वैकल्पिक)",
    "generate-salt": "यादृच्छिक नमक उत्पन्न करें"
  },
  "tr": {
    "config-header": "Yapılandırma",
    "password": "Şifre",
    "algorithm": "Algoritma",
    "iterations": "Yinelemeler",
    "memory-size": "Bellek Boyutu (KiB)",
    "parallelism": "Paralellik",
    "hash-length": "Karma Uzunluğu (bayt)",
    "salt": "Tuz (Base64)",
    "secret": "Gizli (İsteğe bağlı)",
    "generate-salt": "Rastgele Tuz Oluştur"
  },
  "nl": {
    "config-header": "Configuratie",
    "password": "Wachtwoord",
    "algorithm": "Algoritme",
    "iterations": "Iteraties",
    "memory-size": "Geheugengrootte (KiB)",
    "parallelism": "Parallellisme",
    "hash-length": "Hashlengte (bytes)",
    "salt": "Zout (Base64)",
    "secret": "Geheim (optioneel)",
    "generate-salt": "Genereer willekeurig zout"
  },
  "sv": {
    "config-header": "Konfiguration",
    "password": "Lösenord",
    "algorithm": "Algoritm",
    "iterations": "Iterationer",
    "memory-size": "Minnesstorlek (KiB)",
    "parallelism": "Parallellism",
    "hash-length": "Hashlängd (byte)",
    "salt": "Saltvärde (Base64)",
    "secret": "Hemlig (valfritt)",
    "generate-salt": "Generera slumpmässigt salt"
  },
  "pl": {
    "config-header": "Konfiguracja",
    "password": "Hasło",
    "algorithm": "Algorytm",
    "iterations": "Iteracje",
    "memory-size": "Rozmiar pamięci (KiB)",
    "parallelism": "Równoległość",
    "hash-length": "Długość skrótu (w bajtach)",
    "salt": "Sól (Base64)",
    "secret": "Sekret (opcjonalnie)",
    "generate-salt": "Wygeneruj losową sól"
  },
  "vi": {
    "config-header": "Cấu hình",
    "password": "Mật khẩu",
    "algorithm": "Thuật toán",
    "iterations": "Lặp lại",
    "memory-size": "Kích thước bộ nhớ (KiB)",
    "parallelism": "Sự song song",
    "hash-length": "Độ dài băm (byte)",
    "salt": "Muối (Base64)",
    "secret": "Bí mật (Tùy chọn)",
    "generate-salt": "Tạo muối ngẫu nhiên"
  },
  "th": {
    "config-header": "การกำหนดค่า",
    "password": "รหัสผ่าน",
    "algorithm": "อัลกอริทึม",
    "iterations": "การวนซ้ำ",
    "memory-size": "ขนาดหน่วยความจำ (KiB)",
    "parallelism": "ความเท่าเทียม",
    "hash-length": "ความยาวแฮช (ไบต์)",
    "salt": "ซอลท์ (Base64)",
    "secret": "ความลับ (ไม่บังคับ)",
    "generate-salt": "สร้างเกลือแบบสุ่ม"
  },
  "id": {
    "config-header": "Konfigurasi",
    "password": "Kata sandi",
    "algorithm": "Algoritma",
    "iterations": "Iterasi",
    "memory-size": "Ukuran Memori (KiB)",
    "parallelism": "Paralelisme",
    "hash-length": "Panjang Hash (byte)",
    "salt": "Garam (Base64)",
    "secret": "Rahasia (Opsional)",
    "generate-salt": "Hasilkan Garam Acak"
  },
  "he": {
    "config-header": "תְצוּרָה",
    "password": "סִיסמָה",
    "algorithm": "אַלגוֹרִיתְם",
    "iterations": "איטרציות",
    "memory-size": "גודל זיכרון (KiB)",
    "parallelism": "מַקבִּילוּת",
    "hash-length": "אורך גיבוב (בתים)",
    "salt": "מלח (Base64)",
    "secret": "סודי (אופציונלי)",
    "generate-salt": "צור מלח אקראי"
  },
  "ms": {
    "config-header": "Konfigurasi",
    "password": "Kata laluan",
    "algorithm": "Algoritma",
    "iterations": "Lelaran",
    "memory-size": "Saiz Memori (KiB)",
    "parallelism": "Paralelisme",
    "hash-length": "Panjang Hash (bait)",
    "salt": "Garam (Base64)",
    "secret": "Rahsia (Pilihan)",
    "generate-salt": "Hasilkan Garam Rawak"
  },
  "no": {
    "config-header": "Konfigurasjon",
    "password": "Passord",
    "algorithm": "Algoritme",
    "iterations": "Iterasjoner",
    "memory-size": "Minnestørrelse (KiB)",
    "parallelism": "Parallellisme",
    "hash-length": "Hash-lengde (byte)",
    "salt": "Saltverdi (Base64)",
    "secret": "Hemmelig (valgfritt)",
    "generate-salt": "Generer tilfeldig salt"
  }
}
</i18n>
