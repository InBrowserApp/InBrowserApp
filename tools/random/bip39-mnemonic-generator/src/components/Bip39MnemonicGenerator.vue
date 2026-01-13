<template>
  <n-grid cols="1 l:2" responsive="screen" :x-gap="24" :y-gap="24">
    <n-gi>
      <ToolSectionHeader>{{ t('options') }}</ToolSectionHeader>
      <ToolSection>
        <n-tabs v-model:value="activeTab" type="segment" animated>
          <n-tab-pane name="generate">
            <template #tab>
              <n-flex align="center" size="small">
                <n-icon>
                  <Key20Regular />
                </n-icon>
                <span>{{ t('tab-generate') }}</span>
              </n-flex>
            </template>
            <n-flex vertical :size="16">
              <n-form-item :label="t('wordlist')" :show-feedback="false">
                <n-select v-model:value="wordlist" :options="wordlistOptions" />
              </n-form-item>
              <n-form-item :label="t('word-count')" :show-feedback="false">
                <n-select v-model:value="wordCount" :options="wordCountOptions" />
              </n-form-item>
              <n-text depth="3">{{ t('entropy-bits', { bits: strengthBits }) }}</n-text>
            </n-flex>
          </n-tab-pane>
          <n-tab-pane name="validate">
            <template #tab>
              <n-flex align="center" size="small">
                <n-icon>
                  <CheckmarkCircle20Regular />
                </n-icon>
                <span>{{ t('tab-validate') }}</span>
              </n-flex>
            </template>
            <n-flex vertical :size="16">
              <n-form-item :label="t('wordlist')" :show-feedback="false">
                <n-select v-model:value="wordlist" :options="wordlistOptions" />
              </n-form-item>
              <n-form-item :label="t('mnemonic')" :show-feedback="false">
                <n-input
                  v-model:value="validationMnemonic"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  :placeholder="t('mnemonic')"
                />
              </n-form-item>
            </n-flex>
          </n-tab-pane>
          <n-tab-pane name="convert">
            <template #tab>
              <n-flex align="center" size="small">
                <n-icon>
                  <ArrowSwap20Regular />
                </n-icon>
                <span>{{ t('tab-convert') }}</span>
              </n-flex>
            </template>
            <n-flex vertical :size="16">
              <n-form-item :label="t('wordlist')" :show-feedback="false">
                <n-select v-model:value="wordlist" :options="wordlistOptions" />
              </n-form-item>
              <n-form-item :label="t('entropy')" :show-feedback="false">
                <n-input
                  v-model:value="entropyInput"
                  :placeholder="t('entropy')"
                  style="font-family: monospace"
                />
              </n-form-item>
              <n-form-item :label="t('mnemonic')" :show-feedback="false">
                <n-input
                  v-model:value="convertMnemonic"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  :placeholder="t('mnemonic')"
                />
              </n-form-item>
            </n-flex>
          </n-tab-pane>
        </n-tabs>
      </ToolSection>
    </n-gi>
    <n-gi>
      <ToolSectionHeader>{{ t('results') }}</ToolSectionHeader>
      <ToolSection>
        <template v-if="activeTab === 'generate'">
          <n-input
            :value="generatedMnemonic"
            type="textarea"
            readonly
            :autosize="{ minRows: 3, maxRows: 6 }"
          />
          <n-space style="margin-top: 8px">
            <CopyToClipboardButton :content="generatedMnemonic" />
            <RegenerateButton @click="regenerate" />
          </n-space>
          <n-divider />
          <n-text depth="3">{{ t('entropy') }}</n-text>
          <n-input
            :value="generatedEntropy"
            readonly
            style="font-family: monospace; margin-top: 8px"
          />
          <n-space style="margin-top: 8px">
            <CopyToClipboardButton :content="generatedEntropy" />
          </n-space>
        </template>
        <template v-else-if="activeTab === 'validate'">
          <template v-if="validationState === 'empty'">
            <n-text depth="3">{{ t('validation-empty') }}</n-text>
          </template>
          <template v-else>
            <n-flex align="center" :size="12">
              <n-tag :type="validationState === 'valid' ? 'success' : 'error'">
                {{ validationState === 'valid' ? t('valid') : t('invalid') }}
              </n-tag>
              <n-text depth="3">{{
                t('word-count-result', { count: validationWordCount })
              }}</n-text>
            </n-flex>
            <n-alert v-if="validationState === 'invalid'" type="error" style="margin-top: 12px">
              {{ t('mnemonic-error') }}
            </n-alert>
            <template v-else>
              <n-divider />
              <n-text depth="3">{{ t('entropy') }}</n-text>
              <n-input
                :value="validationEntropy"
                readonly
                style="font-family: monospace; margin-top: 8px"
              />
              <n-space style="margin-top: 8px">
                <CopyToClipboardButton :content="validationEntropy" />
              </n-space>
            </template>
          </template>
        </template>
        <template v-else>
          <n-space vertical :size="16">
            <div>
              <n-text depth="2">{{ t('entropy-to-mnemonic') }}</n-text>
              <n-alert v-if="entropyError" type="error" style="margin-top: 8px">
                {{ entropyError }}
              </n-alert>
              <n-input
                :value="entropyMnemonic"
                type="textarea"
                readonly
                :autosize="{ minRows: 2, maxRows: 4 }"
                style="margin-top: 8px"
              />
              <n-space v-if="entropyMnemonic" style="margin-top: 8px">
                <CopyToClipboardButton :content="entropyMnemonic" />
              </n-space>
            </div>
            <div>
              <n-text depth="2">{{ t('mnemonic-to-entropy') }}</n-text>
              <n-alert v-if="mnemonicError" type="error" style="margin-top: 8px">
                {{ mnemonicError }}
              </n-alert>
              <n-input
                :value="mnemonicEntropy"
                readonly
                style="font-family: monospace; margin-top: 8px"
              />
              <n-space v-if="mnemonicEntropy" style="margin-top: 8px">
                <CopyToClipboardButton :content="mnemonicEntropy" />
              </n-space>
            </div>
          </n-space>
        </template>
      </ToolSection>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import {
  NGrid,
  NGi,
  NTabs,
  NTabPane,
  NFormItem,
  NSelect,
  NInput,
  NText,
  NFlex,
  NSpace,
  NTag,
  NAlert,
  NDivider,
  NIcon,
} from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton, RegenerateButton } from '@shared/ui/base'
import { ArrowSwap20Regular, CheckmarkCircle20Regular, Key20Regular } from '@shared/icons/fluent'
import {
  WORD_COUNTS,
  countMnemonicWords,
  entropyToMnemonic,
  generateMnemonic,
  isValidEntropyHex,
  mnemonicToEntropy,
  normalizeEntropyHex,
  normalizeMnemonic,
  validateMnemonic,
  wordCountToStrength,
  type Bip39WordCount,
  type Bip39WordlistName,
} from '@utils/bip39'

const { t } = useI18n()

type TabKey = 'generate' | 'validate' | 'convert'

const activeTab = useStorage<TabKey>('tools:bip39-mnemonic:tab', 'generate')
const wordlist = useStorage<Bip39WordlistName>('tools:bip39-mnemonic:wordlist', 'english')
const wordCount = useStorage<Bip39WordCount>('tools:bip39-mnemonic:word-count', 12)
const nonce = useStorage<number>('tools:bip39-mnemonic:nonce', 0)

const wordlistOptions: Array<{ label: string; value: Bip39WordlistName }> = [
  { label: 'English', value: 'english' },
  { label: '中文 (简体)', value: 'chinese_simplified' },
  { label: '中文 (繁體)', value: 'chinese_traditional' },
  { label: 'Čeština', value: 'czech' },
  { label: 'Français', value: 'french' },
  { label: 'Italiano', value: 'italian' },
  { label: '日本語', value: 'japanese' },
  { label: '한국어', value: 'korean' },
  { label: 'Português', value: 'portuguese' },
  { label: 'Español', value: 'spanish' },
]

const wordCountOptions: Array<{ label: string; value: Bip39WordCount }> = WORD_COUNTS.map(
  (count) => ({
    label: String(count),
    value: count,
  }),
)

const generatedMnemonic = ref('')
const generatedEntropy = ref('')
const strengthBits = computed(() => wordCountToStrength(wordCount.value))

function regenerate() {
  nonce.value += 1
}

watch(
  [wordlist, wordCount, nonce],
  () => {
    const result = generateMnemonic({ wordCount: wordCount.value, wordlist: wordlist.value })
    generatedMnemonic.value = result.mnemonic
    generatedEntropy.value = result.entropy
  },
  { immediate: true },
)

const validationMnemonic = useStorage('tools:bip39-mnemonic:validate:mnemonic', '')
const normalizedValidationMnemonic = computed(() => normalizeMnemonic(validationMnemonic.value))
const validationWordCount = computed(() => countMnemonicWords(normalizedValidationMnemonic.value))

const validationState = computed(() => {
  if (!normalizedValidationMnemonic.value) return 'empty'
  return validateMnemonic(normalizedValidationMnemonic.value, wordlist.value) ? 'valid' : 'invalid'
})

const validationEntropy = computed(() => {
  if (validationState.value !== 'valid') return ''
  try {
    return mnemonicToEntropy(normalizedValidationMnemonic.value, wordlist.value)
  } catch {
    return ''
  }
})

const entropyInput = useStorage('tools:bip39-mnemonic:convert:entropy', '')
const normalizedEntropyInput = computed(() => normalizeEntropyHex(entropyInput.value))

const entropyError = computed(() => {
  if (!normalizedEntropyInput.value) return ''
  return isValidEntropyHex(normalizedEntropyInput.value) ? '' : t('entropy-error')
})

const entropyMnemonic = computed(() => {
  if (!normalizedEntropyInput.value || !isValidEntropyHex(normalizedEntropyInput.value)) return ''
  try {
    return entropyToMnemonic(normalizedEntropyInput.value, wordlist.value)
  } catch {
    return ''
  }
})

const convertMnemonic = useStorage('tools:bip39-mnemonic:convert:mnemonic', '')
const normalizedConvertMnemonic = computed(() => normalizeMnemonic(convertMnemonic.value))

const isConvertMnemonicValid = computed(() => {
  if (!normalizedConvertMnemonic.value) return false
  return validateMnemonic(normalizedConvertMnemonic.value, wordlist.value)
})

const mnemonicError = computed(() => {
  if (!normalizedConvertMnemonic.value) return ''
  return isConvertMnemonicValid.value ? '' : t('mnemonic-error')
})

const mnemonicEntropy = computed(() => {
  if (!isConvertMnemonicValid.value) return ''
  try {
    return mnemonicToEntropy(normalizedConvertMnemonic.value, wordlist.value)
  } catch {
    return ''
  }
})
</script>

<i18n lang="json">
{
  "en": {
    "options": "Options",
    "results": "Results",
    "tab-generate": "Generate",
    "tab-validate": "Validate",
    "tab-convert": "Convert",
    "wordlist": "Wordlist",
    "word-count": "Word count",
    "entropy-bits": "Entropy: {bits} bits",
    "mnemonic": "Mnemonic phrase",
    "entropy": "Entropy (hex)",
    "valid": "Valid",
    "invalid": "Invalid",
    "word-count-result": "Words: {count}",
    "validation-empty": "Enter a mnemonic phrase to validate.",
    "entropy-error": "Entropy must be hex with 128, 160, 192, 224, or 256 bits.",
    "mnemonic-error": "Mnemonic does not match the selected wordlist.",
    "entropy-to-mnemonic": "Entropy to Mnemonic",
    "mnemonic-to-entropy": "Mnemonic to Entropy"
  },
  "zh": {
    "options": "选项",
    "results": "结果",
    "tab-generate": "生成",
    "tab-validate": "验证",
    "tab-convert": "转换",
    "wordlist": "词表",
    "word-count": "单词数量",
    "entropy-bits": "熵：{bits} 位",
    "mnemonic": "助记词",
    "entropy": "熵（十六进制）",
    "valid": "有效",
    "invalid": "无效",
    "word-count-result": "单词数：{count}",
    "validation-empty": "请输入助记词进行验证。",
    "entropy-error": "熵必须是 128、160、192、224 或 256 位的十六进制。",
    "mnemonic-error": "助记词与所选词表不匹配。",
    "entropy-to-mnemonic": "熵 → 助记词",
    "mnemonic-to-entropy": "助记词 → 熵"
  },
  "zh-CN": {
    "options": "选项",
    "results": "结果",
    "tab-generate": "生成",
    "tab-validate": "验证",
    "tab-convert": "转换",
    "wordlist": "词表",
    "word-count": "单词数量",
    "entropy-bits": "熵：{bits} 位",
    "mnemonic": "助记词",
    "entropy": "熵（十六进制）",
    "valid": "有效",
    "invalid": "无效",
    "word-count-result": "单词数：{count}",
    "validation-empty": "请输入助记词进行验证。",
    "entropy-error": "熵必须是 128、160、192、224 或 256 位的十六进制。",
    "mnemonic-error": "助记词与所选词表不匹配。",
    "entropy-to-mnemonic": "熵 → 助记词",
    "mnemonic-to-entropy": "助记词 → 熵"
  },
  "zh-TW": {
    "options": "選項",
    "results": "結果",
    "tab-generate": "產生",
    "tab-validate": "驗證",
    "tab-convert": "轉換",
    "wordlist": "詞表",
    "word-count": "單詞數量",
    "entropy-bits": "熵：{bits} 位",
    "mnemonic": "助記詞",
    "entropy": "熵（十六進位）",
    "valid": "有效",
    "invalid": "無效",
    "word-count-result": "單詞數：{count}",
    "validation-empty": "請輸入助記詞以驗證。",
    "entropy-error": "熵必須是 128、160、192、224 或 256 位的十六進位。",
    "mnemonic-error": "助記詞與所選詞表不匹配。",
    "entropy-to-mnemonic": "熵 → 助記詞",
    "mnemonic-to-entropy": "助記詞 → 熵"
  },
  "zh-HK": {
    "options": "選項",
    "results": "結果",
    "tab-generate": "產生",
    "tab-validate": "驗證",
    "tab-convert": "轉換",
    "wordlist": "詞表",
    "word-count": "單詞數量",
    "entropy-bits": "熵：{bits} 位",
    "mnemonic": "助記詞",
    "entropy": "熵（十六進位）",
    "valid": "有效",
    "invalid": "無效",
    "word-count-result": "單詞數：{count}",
    "validation-empty": "請輸入助記詞以驗證。",
    "entropy-error": "熵必須是 128、160、192、224 或 256 位的十六進位。",
    "mnemonic-error": "助記詞與所選詞表不匹配。",
    "entropy-to-mnemonic": "熵 → 助記詞",
    "mnemonic-to-entropy": "助記詞 → 熵"
  },
  "es": {
    "options": "Opciones",
    "results": "Resultados",
    "tab-generate": "Generar",
    "tab-validate": "Validar",
    "tab-convert": "Convertir",
    "wordlist": "Lista de palabras",
    "word-count": "Número de palabras",
    "entropy-bits": "Entropía: {bits} bits",
    "mnemonic": "Frase mnemónica",
    "entropy": "Entropía (hex)",
    "valid": "Válido",
    "invalid": "Inválido",
    "word-count-result": "Palabras: {count}",
    "validation-empty": "Introduce una frase mnemónica para validar.",
    "entropy-error": "La entropía debe ser hex con 128, 160, 192, 224 o 256 bits.",
    "mnemonic-error": "La frase no coincide con la lista de palabras seleccionada.",
    "entropy-to-mnemonic": "Entropía a mnemónico",
    "mnemonic-to-entropy": "Mnemónico a entropía"
  },
  "fr": {
    "options": "Options",
    "results": "Résultats",
    "tab-generate": "Générer",
    "tab-validate": "Valider",
    "tab-convert": "Convertir",
    "wordlist": "Liste de mots",
    "word-count": "Nombre de mots",
    "entropy-bits": "Entropie: {bits} bits",
    "mnemonic": "Phrase mnémonique",
    "entropy": "Entropie (hex)",
    "valid": "Valide",
    "invalid": "Invalide",
    "word-count-result": "Mots: {count}",
    "validation-empty": "Saisissez une phrase mnémonique pour valider.",
    "entropy-error": "L'entropie doit être en hex avec 128, 160, 192, 224 ou 256 bits.",
    "mnemonic-error": "La phrase ne correspond pas à la liste de mots sélectionnée.",
    "entropy-to-mnemonic": "Entropie vers mnémonique",
    "mnemonic-to-entropy": "Mnémonique vers entropie"
  },
  "de": {
    "options": "Optionen",
    "results": "Ergebnisse",
    "tab-generate": "Erzeugen",
    "tab-validate": "Validieren",
    "tab-convert": "Konvertieren",
    "wordlist": "Wortliste",
    "word-count": "Wortanzahl",
    "entropy-bits": "Entropie: {bits} Bit",
    "mnemonic": "Mnemonic-Phrase",
    "entropy": "Entropie (Hex)",
    "valid": "Gültig",
    "invalid": "Ungültig",
    "word-count-result": "Wörter: {count}",
    "validation-empty": "Geben Sie eine Mnemonic-Phrase zur Validierung ein.",
    "entropy-error": "Die Entropie muss hex sein und 128, 160, 192, 224 oder 256 Bit haben.",
    "mnemonic-error": "Die Phrase passt nicht zur ausgewählten Wortliste.",
    "entropy-to-mnemonic": "Entropie zu Mnemonic",
    "mnemonic-to-entropy": "Mnemonic zu Entropie"
  },
  "it": {
    "options": "Opzioni",
    "results": "Risultati",
    "tab-generate": "Genera",
    "tab-validate": "Valida",
    "tab-convert": "Converti",
    "wordlist": "Lista di parole",
    "word-count": "Numero di parole",
    "entropy-bits": "Entropia: {bits} bit",
    "mnemonic": "Frase mnemonica",
    "entropy": "Entropia (hex)",
    "valid": "Valida",
    "invalid": "Non valida",
    "word-count-result": "Parole: {count}",
    "validation-empty": "Inserisci una frase mnemonica da validare.",
    "entropy-error": "L'entropia deve essere hex con 128, 160, 192, 224 o 256 bit.",
    "mnemonic-error": "La frase non corrisponde alla lista di parole selezionata.",
    "entropy-to-mnemonic": "Entropia a mnemonica",
    "mnemonic-to-entropy": "Mnemonica a entropia"
  },
  "ja": {
    "options": "オプション",
    "results": "結果",
    "tab-generate": "生成",
    "tab-validate": "検証",
    "tab-convert": "変換",
    "wordlist": "単語リスト",
    "word-count": "単語数",
    "entropy-bits": "エントロピー: {bits} ビット",
    "mnemonic": "ニーモニック",
    "entropy": "エントロピー（16進）",
    "valid": "有効",
    "invalid": "無効",
    "word-count-result": "単語数: {count}",
    "validation-empty": "検証するニーモニックを入力してください。",
    "entropy-error": "エントロピーは 128/160/192/224/256 ビットの16進である必要があります。",
    "mnemonic-error": "ニーモニックが選択した単語リストと一致しません。",
    "entropy-to-mnemonic": "エントロピーからニーモニック",
    "mnemonic-to-entropy": "ニーモニックからエントロピー"
  },
  "ko": {
    "options": "옵션",
    "results": "결과",
    "tab-generate": "생성",
    "tab-validate": "검증",
    "tab-convert": "변환",
    "wordlist": "단어 목록",
    "word-count": "단어 수",
    "entropy-bits": "엔트로피: {bits}비트",
    "mnemonic": "니모닉",
    "entropy": "엔트로피(16진수)",
    "valid": "유효함",
    "invalid": "유효하지 않음",
    "word-count-result": "단어 수: {count}",
    "validation-empty": "검증할 니모닉을 입력하세요.",
    "entropy-error": "엔트로피는 128, 160, 192, 224 또는 256비트의 16진수여야 합니다.",
    "mnemonic-error": "니모닉이 선택한 단어 목록과 일치하지 않습니다.",
    "entropy-to-mnemonic": "엔트로피 → 니모닉",
    "mnemonic-to-entropy": "니모닉 → 엔트로피"
  },
  "ru": {
    "options": "Параметры",
    "results": "Результаты",
    "tab-generate": "Сгенерировать",
    "tab-validate": "Проверить",
    "tab-convert": "Преобразовать",
    "wordlist": "Список слов",
    "word-count": "Количество слов",
    "entropy-bits": "Энтропия: {bits} бит",
    "mnemonic": "Мнемоническая фраза",
    "entropy": "Энтропия (hex)",
    "valid": "Действительно",
    "invalid": "Недействительно",
    "word-count-result": "Слова: {count}",
    "validation-empty": "Введите мнемоническую фразу для проверки.",
    "entropy-error": "Энтропия должна быть hex и иметь 128, 160, 192, 224 или 256 бит.",
    "mnemonic-error": "Фраза не соответствует выбранному списку слов.",
    "entropy-to-mnemonic": "Энтропия → мнемоника",
    "mnemonic-to-entropy": "Мнемоника → энтропия"
  },
  "pt": {
    "options": "Opções",
    "results": "Resultados",
    "tab-generate": "Gerar",
    "tab-validate": "Validar",
    "tab-convert": "Converter",
    "wordlist": "Lista de palavras",
    "word-count": "Número de palavras",
    "entropy-bits": "Entropia: {bits} bits",
    "mnemonic": "Frase mnemônica",
    "entropy": "Entropia (hex)",
    "valid": "Válido",
    "invalid": "Inválido",
    "word-count-result": "Palavras: {count}",
    "validation-empty": "Digite uma frase mnemônica para validar.",
    "entropy-error": "A entropia deve ser hex com 128, 160, 192, 224 ou 256 bits.",
    "mnemonic-error": "A frase não corresponde à lista de palavras selecionada.",
    "entropy-to-mnemonic": "Entropia para mnemônico",
    "mnemonic-to-entropy": "Mnemônico para entropia"
  },
  "ar": {
    "options": "الخيارات",
    "results": "النتائج",
    "tab-generate": "توليد",
    "tab-validate": "تحقق",
    "tab-convert": "تحويل",
    "wordlist": "قائمة الكلمات",
    "word-count": "عدد الكلمات",
    "entropy-bits": "الإنتروبيا: {bits} بت",
    "mnemonic": "عبارة تذكّرية",
    "entropy": "الإنتروبيا (hex)",
    "valid": "صالح",
    "invalid": "غير صالح",
    "word-count-result": "الكلمات: {count}",
    "validation-empty": "أدخل عبارة تذكّرية للتحقق.",
    "entropy-error": "يجب أن تكون الإنتروبيا بصيغة hex وبطول 128 أو 160 أو 192 أو 224 أو 256 بت.",
    "mnemonic-error": "العبارة لا تطابق قائمة الكلمات المحددة.",
    "entropy-to-mnemonic": "الإنتروبيا إلى تذكّرية",
    "mnemonic-to-entropy": "تذكّرية إلى الإنتروبيا"
  },
  "hi": {
    "options": "विकल्प",
    "results": "परिणाम",
    "tab-generate": "उत्पन्न करें",
    "tab-validate": "सत्यापित करें",
    "tab-convert": "परिवर्तित करें",
    "wordlist": "शब्द सूची",
    "word-count": "शब्दों की संख्या",
    "entropy-bits": "एंट्रॉपी: {bits} बिट",
    "mnemonic": "निमोनिक वाक्यांश",
    "entropy": "एंट्रॉपी (hex)",
    "valid": "मान्य",
    "invalid": "अमान्य",
    "word-count-result": "शब्द: {count}",
    "validation-empty": "सत्यापन के लिए निमोनिक वाक्यांश दर्ज करें।",
    "entropy-error": "एंट्रॉपी 128, 160, 192, 224 या 256 बिट की hex होनी चाहिए।",
    "mnemonic-error": "निमोनिक चयनित शब्द सूची से मेल नहीं खाता।",
    "entropy-to-mnemonic": "एंट्रॉपी से निमोनिक",
    "mnemonic-to-entropy": "निमोनिक से एंट्रॉपी"
  },
  "tr": {
    "options": "Seçenekler",
    "results": "Sonuçlar",
    "tab-generate": "Üret",
    "tab-validate": "Doğrula",
    "tab-convert": "Dönüştür",
    "wordlist": "Kelime listesi",
    "word-count": "Kelime sayısı",
    "entropy-bits": "Entropi: {bits} bit",
    "mnemonic": "Anımsatıcı ifade",
    "entropy": "Entropi (hex)",
    "valid": "Geçerli",
    "invalid": "Geçersiz",
    "word-count-result": "Kelimeler: {count}",
    "validation-empty": "Doğrulamak için anımsatıcı ifade girin.",
    "entropy-error": "Entropi 128, 160, 192, 224 veya 256 bitlik hex olmalıdır.",
    "mnemonic-error": "Anımsatıcı ifade seçilen kelime listesiyle eşleşmiyor.",
    "entropy-to-mnemonic": "Entropiden anımsatıcıya",
    "mnemonic-to-entropy": "Anımsatıcıdan entropiye"
  },
  "nl": {
    "options": "Opties",
    "results": "Resultaten",
    "tab-generate": "Genereren",
    "tab-validate": "Valideren",
    "tab-convert": "Converteren",
    "wordlist": "Woordenlijst",
    "word-count": "Aantal woorden",
    "entropy-bits": "Entropie: {bits} bits",
    "mnemonic": "Mnemonic-zin",
    "entropy": "Entropie (hex)",
    "valid": "Geldig",
    "invalid": "Ongeldig",
    "word-count-result": "Woorden: {count}",
    "validation-empty": "Voer een mnemonic-zin in om te valideren.",
    "entropy-error": "Entropie moet hex zijn met 128, 160, 192, 224 of 256 bits.",
    "mnemonic-error": "De zin komt niet overeen met de geselecteerde woordenlijst.",
    "entropy-to-mnemonic": "Entropie naar mnemonic",
    "mnemonic-to-entropy": "Mnemonic naar entropie"
  },
  "sv": {
    "options": "Alternativ",
    "results": "Resultat",
    "tab-generate": "Generera",
    "tab-validate": "Validera",
    "tab-convert": "Konvertera",
    "wordlist": "Ordlista",
    "word-count": "Antal ord",
    "entropy-bits": "Entropi: {bits} bit",
    "mnemonic": "Mnemonic-fras",
    "entropy": "Entropi (hex)",
    "valid": "Giltig",
    "invalid": "Ogiltig",
    "word-count-result": "Ord: {count}",
    "validation-empty": "Ange en mnemonic-fras för att validera.",
    "entropy-error": "Entropin måste vara hex med 128, 160, 192, 224 eller 256 bit.",
    "mnemonic-error": "Frasen matchar inte den valda ordlistan.",
    "entropy-to-mnemonic": "Entropi till mnemonic",
    "mnemonic-to-entropy": "Mnemonic till entropi"
  },
  "pl": {
    "options": "Opcje",
    "results": "Wyniki",
    "tab-generate": "Generuj",
    "tab-validate": "Weryfikuj",
    "tab-convert": "Konwertuj",
    "wordlist": "Lista słów",
    "word-count": "Liczba słów",
    "entropy-bits": "Entropia: {bits} bitów",
    "mnemonic": "Fraza mnemoniczna",
    "entropy": "Entropia (hex)",
    "valid": "Prawidłowa",
    "invalid": "Nieprawidłowa",
    "word-count-result": "Słowa: {count}",
    "validation-empty": "Wpisz frazę mnemoniczną do weryfikacji.",
    "entropy-error": "Entropia musi być w hex i mieć 128, 160, 192, 224 lub 256 bitów.",
    "mnemonic-error": "Fraza nie pasuje do wybranej listy słów.",
    "entropy-to-mnemonic": "Entropia do mnemoniki",
    "mnemonic-to-entropy": "Mnemonika do entropii"
  },
  "vi": {
    "options": "Tùy chọn",
    "results": "Kết quả",
    "tab-generate": "Tạo",
    "tab-validate": "Xác thực",
    "tab-convert": "Chuyển đổi",
    "wordlist": "Danh sách từ",
    "word-count": "Số lượng từ",
    "entropy-bits": "Entropy: {bits} bit",
    "mnemonic": "Cụm từ ghi nhớ",
    "entropy": "Entropy (hex)",
    "valid": "Hợp lệ",
    "invalid": "Không hợp lệ",
    "word-count-result": "Từ: {count}",
    "validation-empty": "Nhập cụm từ ghi nhớ để xác thực.",
    "entropy-error": "Entropy phải là hex với 128, 160, 192, 224 hoặc 256 bit.",
    "mnemonic-error": "Cụm từ không khớp với danh sách từ đã chọn.",
    "entropy-to-mnemonic": "Entropy sang mnemonic",
    "mnemonic-to-entropy": "Mnemonic sang entropy"
  },
  "th": {
    "options": "ตัวเลือก",
    "results": "ผลลัพธ์",
    "tab-generate": "สร้าง",
    "tab-validate": "ตรวจสอบ",
    "tab-convert": "แปลง",
    "wordlist": "รายการคำ",
    "word-count": "จำนวนคำ",
    "entropy-bits": "เอนโทรปี: {bits} บิต",
    "mnemonic": "วลีช่วยจำ",
    "entropy": "เอนโทรปี (hex)",
    "valid": "ถูกต้อง",
    "invalid": "ไม่ถูกต้อง",
    "word-count-result": "คำ: {count}",
    "validation-empty": "กรอกวลีช่วยจำเพื่อทำการตรวจสอบ",
    "entropy-error": "เอนโทรปีต้องเป็น hex ขนาด 128, 160, 192, 224 หรือ 256 บิต",
    "mnemonic-error": "วลีไม่ตรงกับรายการคำที่เลือก",
    "entropy-to-mnemonic": "เอนโทรปี → วลีช่วยจำ",
    "mnemonic-to-entropy": "วลีช่วยจำ → เอนโทรปี"
  },
  "id": {
    "options": "Opsi",
    "results": "Hasil",
    "tab-generate": "Buat",
    "tab-validate": "Validasi",
    "tab-convert": "Konversi",
    "wordlist": "Daftar kata",
    "word-count": "Jumlah kata",
    "entropy-bits": "Entropi: {bits} bit",
    "mnemonic": "Frasa mnemonik",
    "entropy": "Entropi (hex)",
    "valid": "Valid",
    "invalid": "Tidak valid",
    "word-count-result": "Kata: {count}",
    "validation-empty": "Masukkan frasa mnemonik untuk memvalidasi.",
    "entropy-error": "Entropi harus berupa hex dengan 128, 160, 192, 224, atau 256 bit.",
    "mnemonic-error": "Frasa tidak cocok dengan daftar kata yang dipilih.",
    "entropy-to-mnemonic": "Entropi ke mnemonik",
    "mnemonic-to-entropy": "Mnemonik ke entropi"
  },
  "he": {
    "options": "אפשרויות",
    "results": "תוצאות",
    "tab-generate": "צור",
    "tab-validate": "אמת",
    "tab-convert": "המר",
    "wordlist": "רשימת מילים",
    "word-count": "מספר מילים",
    "entropy-bits": "אנטרופיה: {bits} ביט",
    "mnemonic": "ביטוי מנמוני",
    "entropy": "אנטרופיה (hex)",
    "valid": "תקין",
    "invalid": "לא תקין",
    "word-count-result": "מילים: {count}",
    "validation-empty": "הזן ביטוי מנמוני כדי לאמת.",
    "entropy-error": "האנטרופיה חייבת להיות hex באורך 128, 160, 192, 224 או 256 ביט.",
    "mnemonic-error": "הביטוי לא תואם לרשימת המילים שנבחרה.",
    "entropy-to-mnemonic": "אנטרופיה למנמוני",
    "mnemonic-to-entropy": "מנמוני לאנטרופיה"
  },
  "ms": {
    "options": "Pilihan",
    "results": "Hasil",
    "tab-generate": "Jana",
    "tab-validate": "Sahkan",
    "tab-convert": "Tukar",
    "wordlist": "Senarai perkataan",
    "word-count": "Bilangan perkataan",
    "entropy-bits": "Entropi: {bits} bit",
    "mnemonic": "Frasa mnemonik",
    "entropy": "Entropi (hex)",
    "valid": "Sah",
    "invalid": "Tidak sah",
    "word-count-result": "Perkataan: {count}",
    "validation-empty": "Masukkan frasa mnemonik untuk disahkan.",
    "entropy-error": "Entropi mesti berbentuk hex dengan 128, 160, 192, 224 atau 256 bit.",
    "mnemonic-error": "Frasa tidak sepadan dengan senarai perkataan yang dipilih.",
    "entropy-to-mnemonic": "Entropi ke mnemonik",
    "mnemonic-to-entropy": "Mnemonik ke entropi"
  },
  "no": {
    "options": "Alternativer",
    "results": "Resultater",
    "tab-generate": "Generer",
    "tab-validate": "Valider",
    "tab-convert": "Konverter",
    "wordlist": "Ordliste",
    "word-count": "Antall ord",
    "entropy-bits": "Entropi: {bits} bit",
    "mnemonic": "Mnemonic-frase",
    "entropy": "Entropi (hex)",
    "valid": "Gyldig",
    "invalid": "Ugyldig",
    "word-count-result": "Ord: {count}",
    "validation-empty": "Skriv inn en mnemonic-frase for å validere.",
    "entropy-error": "Entropien må være hex med 128, 160, 192, 224 eller 256 bit.",
    "mnemonic-error": "Frasen samsvarer ikke med valgt ordliste.",
    "entropy-to-mnemonic": "Entropi til mnemonic",
    "mnemonic-to-entropy": "Mnemonic til entropi"
  }
}
</i18n>
