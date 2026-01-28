<template>
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
        <RegenerateButton @click="emit('regenerate')" />
      </n-space>
      <n-divider />
      <n-text depth="3">{{ t('entropy') }}</n-text>
      <n-input :value="generatedEntropy" readonly style="font-family: monospace; margin-top: 8px" />
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
          <n-text depth="3">{{ t('word-count-result', { count: validationWordCount }) }}</n-text>
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
          <n-alert v-if="entropyHasError" type="error" style="margin-top: 8px">
            {{ t('entropy-error') }}
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
          <n-alert v-if="mnemonicHasError" type="error" style="margin-top: 8px">
            {{ t('mnemonic-error') }}
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
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NAlert, NDivider, NFlex, NInput, NSpace, NTag, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton, RegenerateButton } from '@shared/ui/base'

type TabKey = 'generate' | 'validate' | 'convert'

type ValidationState = 'empty' | 'valid' | 'invalid'

defineProps<{
  activeTab: TabKey
  generatedMnemonic: string
  generatedEntropy: string
  validationState: ValidationState
  validationWordCount: number
  validationEntropy: string
  entropyMnemonic: string
  mnemonicEntropy: string
  entropyHasError: boolean
  mnemonicHasError: boolean
}>()

const emit = defineEmits<{
  (event: 'regenerate'): void
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "results": "Results",
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
    "results": "结果",
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
    "results": "结果",
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
    "results": "結果",
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
    "results": "結果",
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
    "results": "Resultados",
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
    "results": "Résultats",
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
    "results": "Ergebnisse",
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
    "results": "Risultati",
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
    "results": "結果",
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
    "results": "결과",
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
    "results": "Результаты",
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
    "results": "Resultados",
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
    "results": "النتائج",
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
    "results": "परिणाम",
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
    "results": "Sonuçlar",
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
    "results": "Resultaten",
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
    "results": "Resultat",
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
    "results": "Wyniki",
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
    "results": "Kết quả",
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
    "results": "ผลลัพธ์",
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
    "results": "Hasil",
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
    "results": "תוצאות",
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
    "results": "Hasil",
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
    "results": "Resultater",
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
