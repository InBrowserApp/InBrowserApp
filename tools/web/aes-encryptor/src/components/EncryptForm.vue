<template>
  <n-space vertical :size="16">
    <ToolSection>
      <ToolSectionHeader>{{ t('input') }}</ToolSectionHeader>
      <TextOrFileInput v-model:value="input" :placeholder="t('inputPlaceholder')" />
    </ToolSection>

    <KeyInput
      :key-type="keyType"
      :password="password"
      :raw-key="rawKey"
      :key-length="keyLength"
      @update:key-type="keyType = $event"
      @update:password="password = $event"
      @update:raw-key="rawKey = $event"
    />

    <EncryptOptions
      :output-mode="outputMode"
      :mode="mode"
      :key-length="keyLength"
      :output-format="outputFormat"
      :key-type="keyType"
      @update:output-mode="outputMode = $event"
      @update:mode="mode = $event"
      @update:key-length="keyLength = $event"
      @update:output-format="outputFormat = $event"
    />

    <AdvancedOptions
      :key-type="keyType"
      :output-mode="outputMode"
      :iv-length="ivLength"
      :pbkdf2-iterations="pbkdf2Iterations"
      :pbkdf2-hash="pbkdf2Hash"
      :salt-mode="saltMode"
      :manual-salt="manualSalt"
      :iv-mode="ivMode"
      :manual-iv="manualIv"
      @update:pbkdf2-iterations="pbkdf2Iterations = $event"
      @update:pbkdf2-hash="pbkdf2Hash = $event"
      @update:salt-mode="saltMode = $event"
      @update:manual-salt="manualSalt = $event"
      @update:iv-mode="ivMode = $event"
      @update:manual-iv="manualIv = $event"
    />

    <n-button type="primary" :loading="encrypting" :disabled="!canEncrypt" @click="handleEncrypt">
      <template #icon>
        <n-icon :component="LockClosed16Regular" />
      </template>
      {{ t('encrypt') }}
    </n-button>

    <EncryptResult
      :result="result"
      :error="error"
      :salt="resultSalt"
      :iv="resultIv"
      :binary="resultBinary"
      :output-mode="outputMode"
      :output-format="outputFormat"
    />
  </n-space>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { NSpace, NButton, NIcon } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { TextOrFileInput } from '@shared/ui/base'
import { LockClosed16Regular } from '@shared/icons/fluent'
import {
  type AesMode,
  type KeyLength,
  type KeyType,
  type OutputFormat,
  type OutputMode,
  type Pbkdf2Hash,
  type RawEncryptResult,
  PBKDF2_ITERATIONS,
  IV_LENGTH,
  encryptWithPassword,
  encryptWithRawKey,
  encryptJweWithPassword,
  encryptJweWithRawKey,
  isValidHex,
} from '@utils/aes'
import KeyInput from './KeyInput.vue'
import EncryptOptions from './EncryptOptions.vue'
import AdvancedOptions from './AdvancedOptions.vue'
import EncryptResult from './EncryptResult.vue'

const { t } = useI18n()

// Input
const input = ref<string | File>('')

// Key settings
const password = useStorage<string>('tools:aes-encryptor:password', '')
const rawKey = useStorage<string>('tools:aes-encryptor:rawKey', '')
const keyType = useStorage<KeyType>('tools:aes-encryptor:keyType', 'password')

// Options
const outputMode = useStorage<OutputMode>('tools:aes-encryptor:outputMode', 'jwe')
const mode = useStorage<AesMode>('tools:aes-encryptor:mode', 'GCM')
const keyLength = useStorage<KeyLength>('tools:aes-encryptor:keyLength', 256)
const outputFormat = useStorage<OutputFormat>('tools:aes-encryptor:outputFormat', 'base64')

// Advanced options
const pbkdf2Iterations = useStorage<number>(
  'tools:aes-encryptor:pbkdf2Iterations',
  PBKDF2_ITERATIONS,
)
const pbkdf2Hash = useStorage<Pbkdf2Hash>('tools:aes-encryptor:pbkdf2Hash', 'SHA-256')
const saltMode = ref<'auto' | 'manual'>('auto')
const ivMode = ref<'auto' | 'manual'>('auto')
const manualSalt = ref('')
const manualIv = ref('')

// Result
const result = ref('')
const resultSalt = ref('')
const resultIv = ref('')
const resultBinary = ref<ArrayBuffer | null>(null)
const error = ref('')
const encrypting = ref(false)

// Computed
const expectedKeyLength = computed(() => keyLength.value / 4)
const ivLength = computed(() => IV_LENGTH[mode.value])

const rawKeyStatus = computed(() => {
  if (!rawKey.value) return undefined
  if (!isValidHex(rawKey.value)) return 'error'
  const cleanHex = rawKey.value.replace(/\s/g, '')
  if (cleanHex.length !== expectedKeyLength.value) return 'error'
  return 'success'
})

const canEncrypt = computed(() => {
  if (!input.value) return false
  if (keyType.value === 'password') {
    return password.value.length > 0
  } else {
    return rawKeyStatus.value === 'success'
  }
})

// Watch CTR mode - force raw output
watch(mode, (newMode) => {
  if (newMode === 'CTR' && outputMode.value === 'jwe') {
    outputMode.value = 'raw'
  }
})

// Functions
async function handleEncrypt() {
  error.value = ''
  result.value = ''
  resultSalt.value = ''
  resultIv.value = ''
  resultBinary.value = null
  encrypting.value = true

  try {
    let data: string | ArrayBuffer
    if (typeof input.value === 'string') {
      data = input.value
    } else {
      data = await input.value.arrayBuffer()
    }

    if (outputMode.value === 'jwe') {
      // JWE mode
      if (keyType.value === 'password') {
        result.value = await encryptJweWithPassword(
          data,
          password.value,
          mode.value,
          keyLength.value,
          {
            iterations: pbkdf2Iterations.value,
          },
        )
      } else {
        result.value = await encryptJweWithRawKey(data, rawKey.value, mode.value, keyLength.value)
      }
      resultSalt.value = t('embeddedInJwe')
      resultIv.value = t('embeddedInJwe')
    } else {
      // Raw mode
      const options = {
        iterations: pbkdf2Iterations.value,
        hash: pbkdf2Hash.value,
        salt:
          saltMode.value === 'manual' && manualSalt.value
            ? hexToUint8Array(manualSalt.value)
            : undefined,
        iv:
          ivMode.value === 'manual' && manualIv.value ? hexToUint8Array(manualIv.value) : undefined,
      }

      let encryptResult: RawEncryptResult
      if (keyType.value === 'password') {
        encryptResult = await encryptWithPassword(
          data,
          password.value,
          mode.value,
          keyLength.value,
          outputFormat.value,
          options,
        )
      } else {
        encryptResult = await encryptWithRawKey(
          data,
          rawKey.value,
          mode.value,
          keyLength.value,
          outputFormat.value,
          { iv: options.iv },
        )
      }

      result.value = encryptResult.output
      resultSalt.value = encryptResult.salt
      resultIv.value = encryptResult.iv
      resultBinary.value = encryptResult.binary
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    encrypting.value = false
  }
}

function hexToUint8Array(hex: string): Uint8Array {
  const cleanHex = hex.replace(/\s/g, '')
  const bytes = new Uint8Array(cleanHex.length / 2)
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16)
  }
  return bytes
}
</script>

<i18n lang="json">
{
  "en": {
    "input": "Input",
    "inputPlaceholder": "Enter text to encrypt or drop a file...",
    "encrypt": "Encrypt",
    "embeddedInJwe": "(embedded in JWE)"
  },
  "zh": {
    "input": "输入",
    "inputPlaceholder": "输入要加密的文本或拖放文件...",
    "encrypt": "加密",
    "embeddedInJwe": "（嵌入在 JWE 中）"
  },
  "zh-CN": {
    "input": "输入",
    "inputPlaceholder": "输入要加密的文本或拖放文件...",
    "encrypt": "加密",
    "embeddedInJwe": "（嵌入在 JWE 中）"
  },
  "zh-TW": {
    "input": "輸入",
    "inputPlaceholder": "輸入要加密的文字或拖放檔案...",
    "encrypt": "加密",
    "embeddedInJwe": "（嵌入在 JWE 中）"
  },
  "zh-HK": {
    "input": "輸入",
    "inputPlaceholder": "輸入要加密的文字或拖放檔案...",
    "encrypt": "加密",
    "embeddedInJwe": "（嵌入在 JWE 中）"
  },
  "es": {
    "input": "Entrada",
    "inputPlaceholder": "Ingrese texto para cifrar o arrastre un archivo...",
    "encrypt": "Cifrar",
    "embeddedInJwe": "(incrustado en JWE)"
  },
  "fr": {
    "input": "Entrée",
    "inputPlaceholder": "Entrez le texte à chiffrer ou déposez un fichier...",
    "encrypt": "Chiffrer",
    "embeddedInJwe": "(intégré dans JWE)"
  },
  "de": {
    "input": "Eingabe",
    "inputPlaceholder": "Text zum Verschlüsseln eingeben oder Datei ablegen...",
    "encrypt": "Verschlüsseln",
    "embeddedInJwe": "(eingebettet in JWE)"
  },
  "it": {
    "input": "Input",
    "inputPlaceholder": "Inserisci il testo da cifrare o trascina un file...",
    "encrypt": "Cifra",
    "embeddedInJwe": "(incorporato in JWE)"
  },
  "ja": {
    "input": "入力",
    "inputPlaceholder": "暗号化するテキストを入力またはファイルをドロップ...",
    "encrypt": "暗号化",
    "embeddedInJwe": "（JWE に埋め込み）"
  },
  "ko": {
    "input": "입력",
    "inputPlaceholder": "암호화할 텍스트를 입력하거나 파일을 드롭하세요...",
    "encrypt": "암호화",
    "embeddedInJwe": "(JWE에 포함됨)"
  },
  "ru": {
    "input": "Ввод",
    "inputPlaceholder": "Введите текст для шифрования или перетащите файл...",
    "encrypt": "Зашифровать",
    "embeddedInJwe": "(встроено в JWE)"
  },
  "pt": {
    "input": "Entrada",
    "inputPlaceholder": "Digite o texto para criptografar ou solte um arquivo...",
    "encrypt": "Criptografar",
    "embeddedInJwe": "(incorporado no JWE)"
  },
  "ar": {
    "input": "الإدخال",
    "inputPlaceholder": "أدخل النص للتشفير أو أسقط ملفًا...",
    "encrypt": "تشفير",
    "embeddedInJwe": "(مضمن في JWE)"
  },
  "hi": {
    "input": "इनपुट",
    "inputPlaceholder": "एन्क्रिप्ट करने के लिए टेक्स्ट दर्ज करें या फ़ाइल ड्रॉप करें...",
    "encrypt": "एन्क्रिप्ट करें",
    "embeddedInJwe": "(JWE में एम्बेडेड)"
  },
  "tr": {
    "input": "Giriş",
    "inputPlaceholder": "Şifrelenecek metni girin veya dosya bırakın...",
    "encrypt": "Şifrele",
    "embeddedInJwe": "(JWE'ye gömülü)"
  },
  "nl": {
    "input": "Invoer",
    "inputPlaceholder": "Voer tekst in om te versleutelen of sleep een bestand...",
    "encrypt": "Versleutelen",
    "embeddedInJwe": "(ingebed in JWE)"
  },
  "sv": {
    "input": "Inmatning",
    "inputPlaceholder": "Ange text att kryptera eller släpp en fil...",
    "encrypt": "Kryptera",
    "embeddedInJwe": "(inbäddad i JWE)"
  },
  "pl": {
    "input": "Dane wejściowe",
    "inputPlaceholder": "Wprowadź tekst do zaszyfrowania lub upuść plik...",
    "encrypt": "Zaszyfruj",
    "embeddedInJwe": "(osadzony w JWE)"
  },
  "vi": {
    "input": "Đầu vào",
    "inputPlaceholder": "Nhập văn bản để mã hóa hoặc kéo thả tệp...",
    "encrypt": "Mã hóa",
    "embeddedInJwe": "(nhúng trong JWE)"
  },
  "th": {
    "input": "อินพุต",
    "inputPlaceholder": "ป้อนข้อความที่จะเข้ารหัสหรือวางไฟล์...",
    "encrypt": "เข้ารหัส",
    "embeddedInJwe": "(ฝังใน JWE)"
  },
  "id": {
    "input": "Input",
    "inputPlaceholder": "Masukkan teks untuk dienkripsi atau letakkan file...",
    "encrypt": "Enkripsi",
    "embeddedInJwe": "(tertanam dalam JWE)"
  },
  "he": {
    "input": "קלט",
    "inputPlaceholder": "הזן טקסט להצפנה או גרור קובץ...",
    "encrypt": "הצפן",
    "embeddedInJwe": "(מוטמע ב-JWE)"
  },
  "ms": {
    "input": "Input",
    "inputPlaceholder": "Masukkan teks untuk disulitkan atau lepaskan fail...",
    "encrypt": "Sulitkan",
    "embeddedInJwe": "(tertanam dalam JWE)"
  },
  "no": {
    "input": "Inndata",
    "inputPlaceholder": "Skriv inn tekst som skal krypteres eller slipp en fil...",
    "encrypt": "Krypter",
    "embeddedInJwe": "(innebygd i JWE)"
  }
}
</i18n>
