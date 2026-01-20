<template>
  <n-space vertical :size="20">
    <KeyOptions
      v-model:algorithm="algorithm"
      v-model:rsa-key-size="rsaKeySize"
      v-model:comment="comment"
    />

    <n-flex justify="start">
      <n-button type="primary" :loading="generating" @click="generate">
        <template #icon>
          <n-icon :component="Key24Regular" />
        </template>
        {{ t('generate') }}
      </n-button>
    </n-flex>

    <KeyOutput
      v-if="keyPair"
      :public-key="keyPair.publicKey"
      :private-key="keyPair.privateKey"
      :fingerprint="keyPair.fingerprint"
      :algorithm="algorithm"
      :loading="generating"
    />

    <n-alert v-if="error" type="error" :title="t('error')">
      {{ error }}
    </n-alert>
  </n-space>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import { NSpace, NFlex, NButton, NIcon, NAlert } from 'naive-ui'
import Key24Regular from '@vicons/fluent/Key24Regular'
import KeyOptions from './KeyOptions.vue'
import KeyOutput from './KeyOutput.vue'
import {
  generateSshKeyPair,
  type KeyAlgorithm,
  type RsaKeySize,
  type SshKeyPair,
} from '../ssh-keygen'

const { t } = useI18n()

const algorithm = useStorage<KeyAlgorithm>('tools:ssh-key-generator:algorithm', 'ed25519')
const rsaKeySize = useStorage<RsaKeySize>('tools:ssh-key-generator:rsaKeySize', 4096)
const comment = useStorage('tools:ssh-key-generator:comment', '')

const keyPair = ref<SshKeyPair | null>(null)
const generating = ref(false)
const error = ref('')

async function generate() {
  generating.value = true
  error.value = ''

  try {
    keyPair.value = await generateSshKeyPair(algorithm.value, comment.value, rsaKeySize.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    generating.value = false
  }
}

// Generate on parameter change
watch([algorithm, rsaKeySize, comment], () => {
  generate()
})

// Generate on mount
onMounted(() => {
  generate()
})
</script>

<i18n lang="json">
{
  "en": {
    "generate": "Generate Key Pair",
    "error": "Error"
  },
  "zh": {
    "generate": "生成密钥对",
    "error": "错误"
  },
  "zh-CN": {
    "generate": "生成密钥对",
    "error": "错误"
  },
  "zh-TW": {
    "generate": "產生金鑰對",
    "error": "錯誤"
  },
  "zh-HK": {
    "generate": "產生金鑰對",
    "error": "錯誤"
  },
  "es": {
    "generate": "Generar par de claves",
    "error": "Error"
  },
  "fr": {
    "generate": "Générer une paire de clés",
    "error": "Erreur"
  },
  "de": {
    "generate": "Schlüsselpaar generieren",
    "error": "Fehler"
  },
  "it": {
    "generate": "Genera coppia di chiavi",
    "error": "Errore"
  },
  "ja": {
    "generate": "キーペアを生成",
    "error": "エラー"
  },
  "ko": {
    "generate": "키 쌍 생성",
    "error": "오류"
  },
  "ru": {
    "generate": "Сгенерировать пару ключей",
    "error": "Ошибка"
  },
  "pt": {
    "generate": "Gerar par de chaves",
    "error": "Erro"
  },
  "ar": {
    "generate": "إنشاء زوج مفاتيح",
    "error": "خطأ"
  },
  "hi": {
    "generate": "कुंजी जोड़ी उत्पन्न करें",
    "error": "त्रुटि"
  },
  "tr": {
    "generate": "Anahtar Çifti Oluştur",
    "error": "Hata"
  },
  "nl": {
    "generate": "Sleutelpaar genereren",
    "error": "Fout"
  },
  "sv": {
    "generate": "Generera nyckelpar",
    "error": "Fel"
  },
  "pl": {
    "generate": "Wygeneruj parę kluczy",
    "error": "Błąd"
  },
  "vi": {
    "generate": "Tạo cặp khóa",
    "error": "Lỗi"
  },
  "th": {
    "generate": "สร้างคู่คีย์",
    "error": "ข้อผิดพลาด"
  },
  "id": {
    "generate": "Hasilkan Pasangan Kunci",
    "error": "Kesalahan"
  },
  "he": {
    "generate": "צור זוג מפתחות",
    "error": "שגיאה"
  },
  "ms": {
    "generate": "Jana Pasangan Kunci",
    "error": "Ralat"
  },
  "no": {
    "generate": "Generer nøkkelpar",
    "error": "Feil"
  }
}
</i18n>
