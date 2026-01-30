<template>
  <n-grid cols="1 l:2" responsive="screen" :x-gap="24" :y-gap="24">
    <n-gi>
      <Bip39MnemonicOptions
        v-model:activeTab="activeTab"
        v-model:wordlist="wordlist"
        v-model:wordCount="wordCount"
        v-model:validationMnemonic="validationMnemonic"
        v-model:entropyInput="entropyInput"
        v-model:convertMnemonic="convertMnemonic"
        :wordlist-options="wordlistOptions"
        :word-count-options="wordCountOptions"
        :strength-bits="strengthBits"
      />
    </n-gi>
    <n-gi>
      <Bip39MnemonicResults
        :active-tab="activeTab"
        :generated-mnemonic="generatedMnemonic"
        :generated-entropy="generatedEntropy"
        :validation-state="validationState"
        :validation-word-count="validationWordCount"
        :validation-entropy="validationEntropy"
        :entropy-mnemonic="entropyMnemonic"
        :mnemonic-entropy="mnemonicEntropy"
        :entropy-has-error="entropyHasError"
        :mnemonic-has-error="mnemonicHasError"
        @regenerate="regenerate"
      />
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import { NGi, NGrid } from 'naive-ui'
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
import Bip39MnemonicOptions from './Bip39MnemonicOptions.vue'
import Bip39MnemonicResults from './Bip39MnemonicResults.vue'

type TabKey = 'generate' | 'validate' | 'convert'

type Option<T> = {
  label: string
  value: T
}

const activeTab = useStorage<TabKey>('tools:bip39-mnemonic:tab', 'generate')
const wordlist = useStorage<Bip39WordlistName>('tools:bip39-mnemonic:wordlist', 'english')
const wordCount = useStorage<Bip39WordCount>('tools:bip39-mnemonic:word-count', 12)
const nonce = useStorage<number>('tools:bip39-mnemonic:nonce', 0)

const wordlistOptions: Array<Option<Bip39WordlistName>> = [
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

const wordCountOptions: Array<Option<Bip39WordCount>> = WORD_COUNTS.map((count) => ({
  label: String(count),
  value: count,
}))

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

const entropyHasError = computed(() => {
  if (!normalizedEntropyInput.value) return false
  return !isValidEntropyHex(normalizedEntropyInput.value)
})

const entropyMnemonic = computed(() => {
  if (!normalizedEntropyInput.value || entropyHasError.value) return ''
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

const mnemonicHasError = computed(
  () => !!normalizedConvertMnemonic.value && !isConvertMnemonicValid.value,
)

const mnemonicEntropy = computed(() => {
  if (!isConvertMnemonicValid.value) return ''
  try {
    return mnemonicToEntropy(normalizedConvertMnemonic.value, wordlist.value)
  } catch {
    return ''
  }
})
</script>
