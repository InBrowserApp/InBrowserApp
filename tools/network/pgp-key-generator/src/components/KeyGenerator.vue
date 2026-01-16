<template>
  <n-space vertical :size="20">
    <KeyOptions
      v-model:algorithm="algorithm"
      v-model:rsa-key-size="rsaKeySize"
      v-model:name="name"
      v-model:email="email"
      v-model:comment="comment"
      v-model:passphrase="passphrase"
      v-model:expiration-days="expirationDays"
    />

    <n-flex justify="start" align="center" :size="12">
      <n-button
        type="primary"
        :loading="generating"
        :disabled="!hasIdentity || generating"
        @click="generate"
      >
        <template #icon>
          <n-icon :component="Key24Regular" />
        </template>
        {{ keyPair ? t('regenerate') : t('generate') }}
      </n-button>
      <n-text v-if="!hasIdentity" depth="3">
        {{ t('identityHint') }}
      </n-text>
    </n-flex>

    <KeyOutput v-if="keyPair" :key-pair="keyPair" :passphrase-protected="passphraseProtected" />

    <n-alert v-if="error" type="error" :title="t('error')">
      {{ error }}
    </n-alert>
  </n-space>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import { NSpace, NFlex, NButton, NIcon, NAlert, NText } from 'naive-ui'
import { Key24Regular } from '@shared/icons/fluent'
import KeyOptions from './KeyOptions.vue'
import KeyOutput from './KeyOutput.vue'
import {
  generatePgpKeyPair,
  type KeyAlgorithm,
  type PgpKeyPair,
  type RsaKeySize,
} from '../pgp-keygen'

const { t } = useI18n()

const algorithm = useStorage<KeyAlgorithm>('tools:pgp-key-generator:algorithm', 'ecc')
const rsaKeySize = useStorage<RsaKeySize>('tools:pgp-key-generator:rsaKeySize', 4096)
const name = useStorage('tools:pgp-key-generator:name', '')
const email = useStorage('tools:pgp-key-generator:email', '')
const comment = useStorage('tools:pgp-key-generator:comment', '')
const expirationDays = useStorage<number>('tools:pgp-key-generator:expirationDays', 0)
const passphrase = ref('')

const keyPair = ref<PgpKeyPair | null>(null)
const passphraseProtected = ref(false)
const generating = ref(false)
const error = ref('')

const hasIdentity = computed(() => name.value.trim().length > 0 || email.value.trim().length > 0)

async function generate() {
  error.value = ''
  if (!hasIdentity.value) {
    error.value = t('identityHint')
    return
  }

  generating.value = true
  keyPair.value = null

  try {
    keyPair.value = await generatePgpKeyPair({
      name: name.value,
      email: email.value,
      comment: comment.value,
      passphrase: passphrase.value,
      algorithm: algorithm.value,
      rsaKeySize: rsaKeySize.value,
      expirationDays: expirationDays.value,
    })
    passphraseProtected.value = passphrase.value.length > 0
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    generating.value = false
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "generate": "Generate Key Pair",
    "regenerate": "Regenerate",
    "error": "Error",
    "identityHint": "Add a name or email to generate a key pair."
  },
  "zh": {
    "generate": "生成密钥对",
    "regenerate": "重新生成",
    "error": "错误",
    "identityHint": "请填写姓名或邮箱以生成密钥对。"
  },
  "zh-CN": {
    "generate": "生成密钥对",
    "regenerate": "重新生成",
    "error": "错误",
    "identityHint": "请填写姓名或邮箱以生成密钥对。"
  },
  "zh-TW": {
    "generate": "產生金鑰對",
    "regenerate": "重新產生",
    "error": "錯誤",
    "identityHint": "請填寫姓名或電子郵件以產生金鑰對。"
  },
  "zh-HK": {
    "generate": "產生金鑰對",
    "regenerate": "重新產生",
    "error": "錯誤",
    "identityHint": "請填寫姓名或電郵以產生金鑰對。"
  },
  "es": {
    "generate": "Generar par de claves",
    "regenerate": "Regenerar",
    "error": "Error",
    "identityHint": "Agrega un nombre o correo para generar un par de claves."
  },
  "fr": {
    "generate": "Générer une paire de clés",
    "regenerate": "Régénérer",
    "error": "Erreur",
    "identityHint": "Ajoutez un nom ou un e-mail pour générer une paire de clés."
  },
  "de": {
    "generate": "Schlüsselpaar generieren",
    "regenerate": "Neu generieren",
    "error": "Fehler",
    "identityHint": "Fügen Sie einen Namen oder eine E-Mail hinzu, um ein Schlüsselpaar zu erzeugen."
  },
  "it": {
    "generate": "Genera coppia di chiavi",
    "regenerate": "Rigenera",
    "error": "Errore",
    "identityHint": "Aggiungi un nome o un'email per generare una coppia di chiavi."
  },
  "ja": {
    "generate": "キーペアを生成",
    "regenerate": "再生成",
    "error": "エラー",
    "identityHint": "キーを生成するには名前またはメールを入力してください。"
  },
  "ko": {
    "generate": "키 쌍 생성",
    "regenerate": "다시 생성",
    "error": "오류",
    "identityHint": "키 쌍을 생성하려면 이름 또는 이메일을 입력하세요."
  },
  "ru": {
    "generate": "Сгенерировать пару ключей",
    "regenerate": "Сгенерировать заново",
    "error": "Ошибка",
    "identityHint": "Добавьте имя или e-mail, чтобы сгенерировать пару ключей."
  },
  "pt": {
    "generate": "Gerar par de chaves",
    "regenerate": "Gerar novamente",
    "error": "Erro",
    "identityHint": "Adicione um nome ou e-mail para gerar um par de chaves."
  },
  "ar": {
    "generate": "إنشاء زوج مفاتيح",
    "regenerate": "إعادة الإنشاء",
    "error": "خطأ",
    "identityHint": "أضف اسماً أو بريداً إلكترونياً لإنشاء زوج مفاتيح."
  },
  "hi": {
    "generate": "कुंजी जोड़ी उत्पन्न करें",
    "regenerate": "पुनः उत्पन्न करें",
    "error": "त्रुटि",
    "identityHint": "कुंजी जोड़ी उत्पन्न करने के लिए नाम या ईमेल जोड़ें।"
  },
  "tr": {
    "generate": "Anahtar Çifti Oluştur",
    "regenerate": "Yeniden oluştur",
    "error": "Hata",
    "identityHint": "Anahtar çifti oluşturmak için bir ad veya e-posta ekleyin."
  },
  "nl": {
    "generate": "Sleutelpaar genereren",
    "regenerate": "Opnieuw genereren",
    "error": "Fout",
    "identityHint": "Voeg een naam of e-mail toe om een sleutelpaar te genereren."
  },
  "sv": {
    "generate": "Generera nyckelpar",
    "regenerate": "Generera igen",
    "error": "Fel",
    "identityHint": "Lägg till ett namn eller en e-postadress för att generera ett nyckelpar."
  },
  "pl": {
    "generate": "Wygeneruj parę kluczy",
    "regenerate": "Wygeneruj ponownie",
    "error": "Błąd",
    "identityHint": "Dodaj imię lub e-mail, aby wygenerować parę kluczy."
  },
  "vi": {
    "generate": "Tạo cặp khóa",
    "regenerate": "Tạo lại",
    "error": "Lỗi",
    "identityHint": "Thêm tên hoặc email để tạo cặp khóa."
  },
  "th": {
    "generate": "สร้างคู่คีย์",
    "regenerate": "สร้างใหม่",
    "error": "ข้อผิดพลาด",
    "identityHint": "เพิ่มชื่อหรืออีเมลเพื่อสร้างคู่คีย์"
  },
  "id": {
    "generate": "Hasilkan Pasangan Kunci",
    "regenerate": "Hasilkan ulang",
    "error": "Kesalahan",
    "identityHint": "Tambahkan nama atau email untuk menghasilkan pasangan kunci."
  },
  "he": {
    "generate": "צור זוג מפתחות",
    "regenerate": "צור מחדש",
    "error": "שגיאה",
    "identityHint": "הוסף שם או אימייל כדי ליצור זוג מפתחות."
  },
  "ms": {
    "generate": "Jana Pasangan Kunci",
    "regenerate": "Jana semula",
    "error": "Ralat",
    "identityHint": "Tambah nama atau e-mel untuk menjana pasangan kunci."
  },
  "no": {
    "generate": "Generer nøkkelpar",
    "regenerate": "Generer på nytt",
    "error": "Feil",
    "identityHint": "Legg til navn eller e-post for å generere et nøkkelpar."
  }
}
</i18n>
