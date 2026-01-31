<template>
  <ToolSectionHeader>{{ t('options') }}</ToolSectionHeader>
  <ToolSection>
    <n-tabs v-model:value="activeTabModel" type="segment" animated>
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
            <n-select v-model:value="wordlistModel" :options="wordlistOptions" />
          </n-form-item>
          <n-form-item :label="t('word-count')" :show-feedback="false">
            <n-select v-model:value="wordCountModel" :options="wordCountOptions" />
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
            <n-select v-model:value="wordlistModel" :options="wordlistOptions" />
          </n-form-item>
          <n-form-item :label="t('mnemonic')" :show-feedback="false">
            <n-input
              v-model:value="validationMnemonicModel"
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
            <n-select v-model:value="wordlistModel" :options="wordlistOptions" />
          </n-form-item>
          <n-form-item :label="t('entropy')" :show-feedback="false">
            <n-input
              v-model:value="entropyInputModel"
              :placeholder="t('entropy')"
              style="font-family: monospace"
            />
          </n-form-item>
          <n-form-item :label="t('mnemonic')" :show-feedback="false">
            <n-input
              v-model:value="convertMnemonicModel"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6 }"
              :placeholder="t('mnemonic')"
            />
          </n-form-item>
        </n-flex>
      </n-tab-pane>
    </n-tabs>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFlex, NFormItem, NIcon, NInput, NSelect, NTabPane, NTabs, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ArrowSwap20Regular from '@vicons/fluent/ArrowSwap20Regular'
import CheckmarkCircle20Regular from '@vicons/fluent/CheckmarkCircle20Regular'
import Key20Regular from '@vicons/fluent/Key20Regular'
import type { Bip39WordCount, Bip39WordlistName } from '@utils/bip39'

type TabKey = 'generate' | 'validate' | 'convert'

type Option<T> = {
  label: string
  value: T
}

defineProps<{
  wordlistOptions: Array<Option<Bip39WordlistName>>
  wordCountOptions: Array<Option<Bip39WordCount>>
  strengthBits: number
}>()

const activeTabModel = defineModel<TabKey>('activeTab', { required: true })
const wordlistModel = defineModel<Bip39WordlistName>('wordlist', { required: true })
const wordCountModel = defineModel<Bip39WordCount>('wordCount', { required: true })
const validationMnemonicModel = defineModel<string>('validationMnemonic', { required: true })
const entropyInputModel = defineModel<string>('entropyInput', { required: true })
const convertMnemonicModel = defineModel<string>('convertMnemonic', { required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "options": "Options",
    "tab-generate": "Generate",
    "tab-validate": "Validate",
    "tab-convert": "Convert",
    "wordlist": "Wordlist",
    "word-count": "Word count",
    "entropy-bits": "Entropy: {bits} bits",
    "mnemonic": "Mnemonic phrase",
    "entropy": "Entropy (hex)"
  },
  "zh": {
    "options": "选项",
    "tab-generate": "生成",
    "tab-validate": "验证",
    "tab-convert": "转换",
    "wordlist": "词表",
    "word-count": "单词数量",
    "entropy-bits": "熵：{bits} 位",
    "mnemonic": "助记词",
    "entropy": "熵（十六进制）"
  },
  "zh-CN": {
    "options": "选项",
    "tab-generate": "生成",
    "tab-validate": "验证",
    "tab-convert": "转换",
    "wordlist": "词表",
    "word-count": "单词数量",
    "entropy-bits": "熵：{bits} 位",
    "mnemonic": "助记词",
    "entropy": "熵（十六进制）"
  },
  "zh-TW": {
    "options": "選項",
    "tab-generate": "產生",
    "tab-validate": "驗證",
    "tab-convert": "轉換",
    "wordlist": "詞表",
    "word-count": "單詞數量",
    "entropy-bits": "熵：{bits} 位",
    "mnemonic": "助記詞",
    "entropy": "熵（十六進位）"
  },
  "zh-HK": {
    "options": "選項",
    "tab-generate": "產生",
    "tab-validate": "驗證",
    "tab-convert": "轉換",
    "wordlist": "詞表",
    "word-count": "單詞數量",
    "entropy-bits": "熵：{bits} 位",
    "mnemonic": "助記詞",
    "entropy": "熵（十六進位）"
  },
  "es": {
    "options": "Opciones",
    "tab-generate": "Generar",
    "tab-validate": "Validar",
    "tab-convert": "Convertir",
    "wordlist": "Lista de palabras",
    "word-count": "Número de palabras",
    "entropy-bits": "Entropía: {bits} bits",
    "mnemonic": "Frase mnemónica",
    "entropy": "Entropía (hex)"
  },
  "fr": {
    "options": "Options",
    "tab-generate": "Générer",
    "tab-validate": "Valider",
    "tab-convert": "Convertir",
    "wordlist": "Liste de mots",
    "word-count": "Nombre de mots",
    "entropy-bits": "Entropie: {bits} bits",
    "mnemonic": "Phrase mnémonique",
    "entropy": "Entropie (hex)"
  },
  "de": {
    "options": "Optionen",
    "tab-generate": "Erzeugen",
    "tab-validate": "Validieren",
    "tab-convert": "Konvertieren",
    "wordlist": "Wortliste",
    "word-count": "Wortanzahl",
    "entropy-bits": "Entropie: {bits} Bit",
    "mnemonic": "Mnemonic-Phrase",
    "entropy": "Entropie (Hex)"
  },
  "it": {
    "options": "Opzioni",
    "tab-generate": "Genera",
    "tab-validate": "Valida",
    "tab-convert": "Converti",
    "wordlist": "Lista di parole",
    "word-count": "Numero di parole",
    "entropy-bits": "Entropia: {bits} bit",
    "mnemonic": "Frase mnemonica",
    "entropy": "Entropia (hex)"
  },
  "ja": {
    "options": "オプション",
    "tab-generate": "生成",
    "tab-validate": "検証",
    "tab-convert": "変換",
    "wordlist": "単語リスト",
    "word-count": "単語数",
    "entropy-bits": "エントロピー: {bits} ビット",
    "mnemonic": "ニーモニック",
    "entropy": "エントロピー（16進）"
  },
  "ko": {
    "options": "옵션",
    "tab-generate": "생성",
    "tab-validate": "검증",
    "tab-convert": "변환",
    "wordlist": "단어 목록",
    "word-count": "단어 수",
    "entropy-bits": "엔트로피: {bits}비트",
    "mnemonic": "니모닉",
    "entropy": "엔트로피(16진수)"
  },
  "ru": {
    "options": "Параметры",
    "tab-generate": "Сгенерировать",
    "tab-validate": "Проверить",
    "tab-convert": "Преобразовать",
    "wordlist": "Список слов",
    "word-count": "Количество слов",
    "entropy-bits": "Энтропия: {bits} бит",
    "mnemonic": "Мнемоническая фраза",
    "entropy": "Энтропия (hex)"
  },
  "pt": {
    "options": "Opções",
    "tab-generate": "Gerar",
    "tab-validate": "Validar",
    "tab-convert": "Converter",
    "wordlist": "Lista de palavras",
    "word-count": "Número de palavras",
    "entropy-bits": "Entropia: {bits} bits",
    "mnemonic": "Frase mnemônica",
    "entropy": "Entropia (hex)"
  },
  "ar": {
    "options": "الخيارات",
    "tab-generate": "توليد",
    "tab-validate": "تحقق",
    "tab-convert": "تحويل",
    "wordlist": "قائمة الكلمات",
    "word-count": "عدد الكلمات",
    "entropy-bits": "الإنتروبيا: {bits} بت",
    "mnemonic": "عبارة تذكّرية",
    "entropy": "الإنتروبيا (hex)"
  },
  "hi": {
    "options": "विकल्प",
    "tab-generate": "उत्पन्न करें",
    "tab-validate": "सत्यापित करें",
    "tab-convert": "परिवर्तित करें",
    "wordlist": "शब्द सूची",
    "word-count": "शब्दों की संख्या",
    "entropy-bits": "एंट्रॉपी: {bits} बिट",
    "mnemonic": "निमोनिक वाक्यांश",
    "entropy": "एंट्रॉपी (hex)"
  },
  "tr": {
    "options": "Seçenekler",
    "tab-generate": "Üret",
    "tab-validate": "Doğrula",
    "tab-convert": "Dönüştür",
    "wordlist": "Kelime listesi",
    "word-count": "Kelime sayısı",
    "entropy-bits": "Entropi: {bits} bit",
    "mnemonic": "Anımsatıcı ifade",
    "entropy": "Entropi (hex)"
  },
  "nl": {
    "options": "Opties",
    "tab-generate": "Genereren",
    "tab-validate": "Valideren",
    "tab-convert": "Converteren",
    "wordlist": "Woordenlijst",
    "word-count": "Aantal woorden",
    "entropy-bits": "Entropie: {bits} bits",
    "mnemonic": "Mnemonic-zin",
    "entropy": "Entropie (hex)"
  },
  "sv": {
    "options": "Alternativ",
    "tab-generate": "Generera",
    "tab-validate": "Validera",
    "tab-convert": "Konvertera",
    "wordlist": "Ordlista",
    "word-count": "Antal ord",
    "entropy-bits": "Entropi: {bits} bit",
    "mnemonic": "Mnemonic-fras",
    "entropy": "Entropi (hex)"
  },
  "pl": {
    "options": "Opcje",
    "tab-generate": "Generuj",
    "tab-validate": "Weryfikuj",
    "tab-convert": "Konwertuj",
    "wordlist": "Lista słów",
    "word-count": "Liczba słów",
    "entropy-bits": "Entropia: {bits} bitów",
    "mnemonic": "Fraza mnemoniczna",
    "entropy": "Entropia (hex)"
  },
  "vi": {
    "options": "Tùy chọn",
    "tab-generate": "Tạo",
    "tab-validate": "Xác thực",
    "tab-convert": "Chuyển đổi",
    "wordlist": "Danh sách từ",
    "word-count": "Số lượng từ",
    "entropy-bits": "Entropy: {bits} bit",
    "mnemonic": "Cụm từ ghi nhớ",
    "entropy": "Entropy (hex)"
  },
  "th": {
    "options": "ตัวเลือก",
    "tab-generate": "สร้าง",
    "tab-validate": "ตรวจสอบ",
    "tab-convert": "แปลง",
    "wordlist": "รายการคำ",
    "word-count": "จำนวนคำ",
    "entropy-bits": "เอนโทรปี: {bits} บิต",
    "mnemonic": "วลีช่วยจำ",
    "entropy": "เอนโทรปี (hex)"
  },
  "id": {
    "options": "Opsi",
    "tab-generate": "Buat",
    "tab-validate": "Validasi",
    "tab-convert": "Konversi",
    "wordlist": "Daftar kata",
    "word-count": "Jumlah kata",
    "entropy-bits": "Entropi: {bits} bit",
    "mnemonic": "Frasa mnemonik",
    "entropy": "Entropi (hex)"
  },
  "he": {
    "options": "אפשרויות",
    "tab-generate": "צור",
    "tab-validate": "אמת",
    "tab-convert": "המר",
    "wordlist": "רשימת מילים",
    "word-count": "מספר מילים",
    "entropy-bits": "אנטרופיה: {bits} ביט",
    "mnemonic": "ביטוי מנמוני",
    "entropy": "אנטרופיה (hex)"
  },
  "ms": {
    "options": "Pilihan",
    "tab-generate": "Jana",
    "tab-validate": "Sahkan",
    "tab-convert": "Tukar",
    "wordlist": "Senarai perkataan",
    "word-count": "Bilangan perkataan",
    "entropy-bits": "Entropi: {bits} bit",
    "mnemonic": "Frasa mnemonik",
    "entropy": "Entropi (hex)"
  },
  "no": {
    "options": "Alternativer",
    "tab-generate": "Generer",
    "tab-validate": "Valider",
    "tab-convert": "Konverter",
    "wordlist": "Ordliste",
    "word-count": "Antall ord",
    "entropy-bits": "Entropi: {bits} bit",
    "mnemonic": "Mnemonic-frase",
    "entropy": "Entropi (hex)"
  }
}
</i18n>
