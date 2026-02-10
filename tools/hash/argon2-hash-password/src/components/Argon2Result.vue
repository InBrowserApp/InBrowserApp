<template>
  <template v-if="showOutput">
    <ToolSectionHeader>{{ t('output-header') }}</ToolSectionHeader>
    <ToolSection>
      <n-form-item :label="t('output')">
        <CopyToClipboardTooltip :content="result" #="{ copy }">
          <n-text
            code
            class="argon2-result"
            :class="{ 'argon2-result-processing': evaluating }"
            @click="copy"
          >
            {{ result || '...' }}
          </n-text>
        </CopyToClipboardTooltip>
      </n-form-item>
      <CopyToClipboardButton :content="result" />
    </ToolSection>
  </template>

  <ToolSection v-if="runtimeError">
    <n-text type="error">{{ runtimeError }}</n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import { computedAsync } from '@vueuse/core'
import { NFormItem, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton, CopyToClipboardTooltip } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'
import type { Argon2Algorithm } from '../types'
import { generateArgon2Hash } from '../utils'

const props = defineProps<{
  password: string
  secret: string
  algorithm: Argon2Algorithm
  salt: string
  iterations: number
  memorySize: number
  parallelism: number
  hashLength: number
  configValid: boolean
}>()

const { t } = useI18n()
const runtimeError = ref('')
const evaluating = shallowRef(false)

const result = computedAsync<string>(
  async () => {
    const {
      password,
      secret,
      algorithm,
      salt,
      iterations,
      memorySize,
      parallelism,
      hashLength,
      configValid,
    } = props

    runtimeError.value = ''

    if (!password || !salt || !configValid) {
      return ''
    }

    try {
      return await generateArgon2Hash({
        algorithm,
        password,
        salt,
        secret,
        iterations,
        memorySize,
        parallelism,
        hashLength,
      })
    } catch {
      runtimeError.value = t('hash-failed')
      return ''
    }
  },
  '',
  evaluating,
)

const showOutput = computed(() => Boolean(props.password) && props.configValid)
</script>

<style scoped>
.argon2-result {
  cursor: pointer;
  font-size: 1.2em;
  word-break: break-all;
  transition: filter 0.3s ease-in-out;
}

.argon2-result-processing {
  cursor: not-allowed;
  filter: blur(10px);
}
</style>

<i18n lang="json">
{
  "en": {
    "output-header": "Argon2 Hash Output",
    "output": "Encoded Hash",
    "hash-failed": "Failed to generate Argon2 hash."
  },
  "zh": {
    "output-header": "Argon2 哈希输出",
    "output": "编码哈希",
    "hash-failed": "生成 Argon2 哈希失败。"
  },
  "zh-CN": {
    "output-header": "Argon2 哈希输出",
    "output": "编码哈希",
    "hash-failed": "生成 Argon2 哈希失败。"
  },
  "zh-TW": {
    "output-header": "Argon2 雜湊輸出",
    "output": "編碼雜湊",
    "hash-failed": "產生 Argon2 雜湊失敗。"
  },
  "zh-HK": {
    "output-header": "Argon2 雜湊輸出",
    "output": "編碼雜湊",
    "hash-failed": "產生 Argon2 雜湊失敗。"
  },
  "es": {
    "output-header": "Argon2 Salida hash",
    "output": "Hash codificado",
    "hash-failed": "No se pudo generar el hash Argon2."
  },
  "fr": {
    "output-header": "Sortie de hachage Argon2",
    "output": "Hachage codé",
    "hash-failed": "Échec de la génération du hachage Argon2."
  },
  "de": {
    "output-header": "Argon2 Hash-Ausgabe",
    "output": "Verschlüsselter Hash",
    "hash-failed": "Der Argon2-Hash konnte nicht generiert werden."
  },
  "it": {
    "output-header": "Argon2 Uscita hash",
    "output": "Hash codificato",
    "hash-failed": "Impossibile generare l'hash Argon2."
  },
  "ja": {
    "output-header": "Argon2 ハッシュ出力",
    "output": "エンコードされたハッシュ",
    "hash-failed": "Argon2 ハッシュの生成に失敗しました。"
  },
  "ko": {
    "output-header": "Argon2 해시 출력",
    "output": "인코딩된 해시",
    "hash-failed": "Argon2 해시를 생성하지 못했습니다."
  },
  "ru": {
    "output-header": "Argon2 Хэш-вывод",
    "output": "Закодированный хэш",
    "hash-failed": "Не удалось сгенерировать хеш Argon2."
  },
  "pt": {
    "output-header": "Argon2 Saída de hash",
    "output": "Hash codificado",
    "hash-failed": "Falha ao gerar hash Argon2."
  },
  "ar": {
    "output-header": "Argon2 إخراج التجزئة",
    "output": "التجزئة المشفرة",
    "hash-failed": "فشل في إنشاء تجزئة Argon2."
  },
  "hi": {
    "output-header": "Argon2 हैश आउटपुट",
    "output": "एन्कोडेड हैश",
    "hash-failed": "Argon2 हैश उत्पन्न करने में विफल।"
  },
  "tr": {
    "output-header": "Argon2 Hash Çıktısı",
    "output": "Kodlanmış Karma",
    "hash-failed": "Argon2 karması oluşturulamadı."
  },
  "nl": {
    "output-header": "Argon2 Hash-uitvoer",
    "output": "Gecodeerde hash",
    "hash-failed": "Kan Argon2-hash niet genereren."
  },
  "sv": {
    "output-header": "Argon2 Hash-utgång",
    "output": "Kodad Hash",
    "hash-failed": "Det gick inte att generera Argon2 hash."
  },
  "pl": {
    "output-header": "Argon2 Wynik skrótu",
    "output": "Zakodowany skrót",
    "hash-failed": "Nie udało się wygenerować skrótu Argon2."
  },
  "vi": {
    "output-header": "Argon2 Kết quả băm",
    "output": "Băm được mã hóa",
    "hash-failed": "Không tạo được hàm băm Argon2."
  },
  "th": {
    "output-header": "Argon2 เอาต์พุตแฮช",
    "output": "แฮชที่เข้ารหัส",
    "hash-failed": "ไม่สามารถสร้างแฮช Argon2"
  },
  "id": {
    "output-header": "Argon2 Keluaran Hash",
    "output": "Hash yang dikodekan",
    "hash-failed": "Gagal menghasilkan hash Argon2."
  },
  "he": {
    "output-header": "Argon2 פלט Hash",
    "output": "Hash מקודד",
    "hash-failed": "יצירת hash Argon2 נכשלה."
  },
  "ms": {
    "output-header": "Output Cincangan Argon2",
    "output": "Hash yang dikodkan",
    "hash-failed": "Gagal menjana cincang Argon2."
  },
  "no": {
    "output-header": "Argon2 Hash-utgang",
    "output": "Kodet Hash",
    "hash-failed": "Kunne ikke generere Argon2-hash."
  }
}
</i18n>
