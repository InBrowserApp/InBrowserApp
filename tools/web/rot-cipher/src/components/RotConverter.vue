<template>
  <div>
    <ToolSectionHeader>{{ t('rot-type') }}</ToolSectionHeader>
    <ToolSection>
      <n-select v-model:value="rotType" :options="rotTypeOptions" />
    </ToolSection>

    <ToolSectionHeader>{{ t('input') }}</ToolSectionHeader>
    <ToolSection>
      <n-input
        v-model:value="inputText"
        type="textarea"
        :placeholder="t('input-placeholder')"
        :autosize="{ minRows: 4, maxRows: 12 }"
      />
    </ToolSection>
    <ToolSection>
      <CopyToClipboardButton :content="inputText" />
    </ToolSection>

    <ToolSectionHeader>{{ t('output') }}</ToolSectionHeader>
    <ToolSection>
      <n-input
        v-model:value="outputText"
        type="textarea"
        :placeholder="t('output-placeholder')"
        :autosize="{ minRows: 4, maxRows: 12 }"
      />
    </ToolSection>
    <ToolSection>
      <CopyToClipboardButton :content="outputText" />
    </ToolSection>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { NInput, NSelect } from 'naive-ui'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import { CopyToClipboardButton } from '@shared/ui/base'
import { useStorage } from '@vueuse/core'
import { rot, type RotType } from '../utils'

const { t } = useI18n()

const rotTypeOptions = computed(() => [
  { label: `ROT13 - ${t('rot-desc-rot13')}`, value: 'rot13' as RotType },
  { label: `ROT5 - ${t('rot-desc-rot5')}`, value: 'rot5' as RotType },
  { label: `ROT18 - ${t('rot-desc-rot18')}`, value: 'rot18' as RotType },
  { label: `ROT47 - ${t('rot-desc-rot47')}`, value: 'rot47' as RotType },
])

const rotType = useStorage<RotType>('tools:rot-cipher:type', 'rot13')
const inputText = useStorage<string>('tools:rot-cipher:input', 'Hello World! 12345')
const outputText = useStorage<string>('tools:rot-cipher:output', '')

let isUpdatingFromInput = false
let isUpdatingFromOutput = false

// Update output when input or type changes
watch(
  [inputText, rotType],
  ([newInput, newType]) => {
    if (isUpdatingFromOutput) return
    isUpdatingFromInput = true
    outputText.value = rot(newInput, newType)
    isUpdatingFromInput = false
  },
  { immediate: true },
)

// Update input when output changes (self-reversing)
watch(outputText, (newOutput) => {
  if (isUpdatingFromInput) return
  isUpdatingFromOutput = true
  inputText.value = rot(newOutput, rotType.value)
  isUpdatingFromOutput = false
})
</script>

<i18n lang="json">
{
  "en": {
    "rot-type": "ROT Type",
    "input": "Input Text",
    "input-placeholder": "Enter text to encrypt/decrypt...",
    "output": "Output Text",
    "output-placeholder": "Encrypted/decrypted text will appear here...",
    "rot-desc-rot13": "Letters only (A-Z, a-z)",
    "rot-desc-rot5": "Digits only (0-9)",
    "rot-desc-rot18": "Letters + Digits (ROT13 + ROT5)",
    "rot-desc-rot47": "All printable ASCII (33-126)"
  },
  "zh": {
    "rot-type": "ROT 类型",
    "input": "输入文本",
    "input-placeholder": "输入要加密/解密的文本...",
    "output": "输出文本",
    "output-placeholder": "加密/解密后的文本将显示在这里...",
    "rot-desc-rot13": "仅字母 (A-Z, a-z)",
    "rot-desc-rot5": "仅数字 (0-9)",
    "rot-desc-rot18": "字母 + 数字 (ROT13 + ROT5)",
    "rot-desc-rot47": "所有可打印 ASCII 字符 (33-126)"
  },
  "zh-CN": {
    "rot-type": "ROT 类型",
    "input": "输入文本",
    "input-placeholder": "输入要加密/解密的文本...",
    "output": "输出文本",
    "output-placeholder": "加密/解密后的文本将显示在这里...",
    "rot-desc-rot13": "仅字母 (A-Z, a-z)",
    "rot-desc-rot5": "仅数字 (0-9)",
    "rot-desc-rot18": "字母 + 数字 (ROT13 + ROT5)",
    "rot-desc-rot47": "所有可打印 ASCII 字符 (33-126)"
  },
  "zh-TW": {
    "rot-type": "ROT 類型",
    "input": "輸入文字",
    "input-placeholder": "輸入要加密/解密的文字...",
    "output": "輸出文字",
    "output-placeholder": "加密/解密後的文字將顯示在這裡...",
    "rot-desc-rot13": "僅字母 (A-Z, a-z)",
    "rot-desc-rot5": "僅數字 (0-9)",
    "rot-desc-rot18": "字母 + 數字 (ROT13 + ROT5)",
    "rot-desc-rot47": "所有可列印 ASCII 字元 (33-126)"
  },
  "zh-HK": {
    "rot-type": "ROT 類型",
    "input": "輸入文字",
    "input-placeholder": "輸入要加密/解密嘅文字...",
    "output": "輸出文字",
    "output-placeholder": "加密/解密後嘅文字會顯示喺呢度...",
    "rot-desc-rot13": "只限字母 (A-Z, a-z)",
    "rot-desc-rot5": "只限數字 (0-9)",
    "rot-desc-rot18": "字母 + 數字 (ROT13 + ROT5)",
    "rot-desc-rot47": "所有可列印 ASCII 字元 (33-126)"
  },
  "es": {
    "rot-type": "Tipo de ROT",
    "input": "Texto de entrada",
    "input-placeholder": "Introduce el texto a cifrar/descifrar...",
    "output": "Texto de salida",
    "output-placeholder": "El texto cifrado/descifrado aparecera aqui...",
    "rot-desc-rot13": "Solo letras (A-Z, a-z)",
    "rot-desc-rot5": "Solo digitos (0-9)",
    "rot-desc-rot18": "Letras + Digitos (ROT13 + ROT5)",
    "rot-desc-rot47": "Todos los ASCII imprimibles (33-126)"
  },
  "fr": {
    "rot-type": "Type de ROT",
    "input": "Texte d'entree",
    "input-placeholder": "Entrez le texte a chiffrer/dechiffrer...",
    "output": "Texte de sortie",
    "output-placeholder": "Le texte chiffre/dechiffre apparaitra ici...",
    "rot-desc-rot13": "Lettres uniquement (A-Z, a-z)",
    "rot-desc-rot5": "Chiffres uniquement (0-9)",
    "rot-desc-rot18": "Lettres + Chiffres (ROT13 + ROT5)",
    "rot-desc-rot47": "Tous les ASCII imprimables (33-126)"
  },
  "de": {
    "rot-type": "ROT-Typ",
    "input": "Eingabetext",
    "input-placeholder": "Text zum Verschlusseln/Entschlusseln eingeben...",
    "output": "Ausgabetext",
    "output-placeholder": "Verschlusselter/entschlusselter Text erscheint hier...",
    "rot-desc-rot13": "Nur Buchstaben (A-Z, a-z)",
    "rot-desc-rot5": "Nur Ziffern (0-9)",
    "rot-desc-rot18": "Buchstaben + Ziffern (ROT13 + ROT5)",
    "rot-desc-rot47": "Alle druckbaren ASCII-Zeichen (33-126)"
  },
  "it": {
    "rot-type": "Tipo di ROT",
    "input": "Testo di input",
    "input-placeholder": "Inserisci il testo da cifrare/decifrare...",
    "output": "Testo di output",
    "output-placeholder": "Il testo cifrato/decifrato apparira qui...",
    "rot-desc-rot13": "Solo lettere (A-Z, a-z)",
    "rot-desc-rot5": "Solo cifre (0-9)",
    "rot-desc-rot18": "Lettere + Cifre (ROT13 + ROT5)",
    "rot-desc-rot47": "Tutti i caratteri ASCII stampabili (33-126)"
  },
  "ja": {
    "rot-type": "ROT タイプ",
    "input": "入力テキスト",
    "input-placeholder": "暗号化/復号化するテキストを入力...",
    "output": "出力テキスト",
    "output-placeholder": "暗号化/復号化されたテキストがここに表示されます...",
    "rot-desc-rot13": "英字のみ (A-Z, a-z)",
    "rot-desc-rot5": "数字のみ (0-9)",
    "rot-desc-rot18": "英字 + 数字 (ROT13 + ROT5)",
    "rot-desc-rot47": "すべての印刷可能 ASCII 文字 (33-126)"
  },
  "ko": {
    "rot-type": "ROT 유형",
    "input": "입력 텍스트",
    "input-placeholder": "암호화/복호화할 텍스트를 입력하세요...",
    "output": "출력 텍스트",
    "output-placeholder": "암호화/복호화된 텍스트가 여기에 표시됩니다...",
    "rot-desc-rot13": "문자만 (A-Z, a-z)",
    "rot-desc-rot5": "숫자만 (0-9)",
    "rot-desc-rot18": "문자 + 숫자 (ROT13 + ROT5)",
    "rot-desc-rot47": "모든 인쇄 가능한 ASCII (33-126)"
  },
  "ru": {
    "rot-type": "Tип ROT",
    "input": "Входной текст",
    "input-placeholder": "Введите текст для шифрования/дешифрования...",
    "output": "Выходной текст",
    "output-placeholder": "Зашифрованный/расшифрованный текст появится здесь...",
    "rot-desc-rot13": "Только буквы (A-Z, a-z)",
    "rot-desc-rot5": "Только цифры (0-9)",
    "rot-desc-rot18": "Буквы + Цифры (ROT13 + ROT5)",
    "rot-desc-rot47": "Все печатные символы ASCII (33-126)"
  },
  "pt": {
    "rot-type": "Tipo de ROT",
    "input": "Texto de entrada",
    "input-placeholder": "Digite o texto para criptografar/descriptografar...",
    "output": "Texto de saida",
    "output-placeholder": "O texto criptografado/descriptografado aparecera aqui...",
    "rot-desc-rot13": "Apenas letras (A-Z, a-z)",
    "rot-desc-rot5": "Apenas digitos (0-9)",
    "rot-desc-rot18": "Letras + Digitos (ROT13 + ROT5)",
    "rot-desc-rot47": "Todos os ASCII imprimiveis (33-126)"
  },
  "ar": {
    "rot-type": "نوع ROT",
    "input": "نص الإدخال",
    "input-placeholder": "أدخل النص للتشفير/فك التشفير...",
    "output": "نص الإخراج",
    "output-placeholder": "سيظهر النص المشفر/المفكك هنا...",
    "rot-desc-rot13": "الحروف فقط (A-Z, a-z)",
    "rot-desc-rot5": "الأرقام فقط (0-9)",
    "rot-desc-rot18": "الحروف + الأرقام (ROT13 + ROT5)",
    "rot-desc-rot47": "جميع أحرف ASCII القابلة للطباعة (33-126)"
  },
  "hi": {
    "rot-type": "ROT प्रकार",
    "input": "इनपुट टेक्स्ट",
    "input-placeholder": "एन्क्रिप्ट/डिक्रिप्ट करने के लिए टेक्स्ट दर्ज करें...",
    "output": "आउटपुट टेक्स्ट",
    "output-placeholder": "एन्क्रिप्टेड/डिक्रिप्टेड टेक्स्ट यहाँ दिखाई देगा...",
    "rot-desc-rot13": "केवल अक्षर (A-Z, a-z)",
    "rot-desc-rot5": "केवल अंक (0-9)",
    "rot-desc-rot18": "अक्षर + अंक (ROT13 + ROT5)",
    "rot-desc-rot47": "सभी मुद्रण योग्य ASCII (33-126)"
  },
  "tr": {
    "rot-type": "ROT Tipi",
    "input": "Giris Metni",
    "input-placeholder": "Sifrelenecek/cozulecek metni girin...",
    "output": "Cikis Metni",
    "output-placeholder": "Sifrelenmis/cozulmus metin burada gorunecek...",
    "rot-desc-rot13": "Yalnizca harfler (A-Z, a-z)",
    "rot-desc-rot5": "Yalnizca rakamlar (0-9)",
    "rot-desc-rot18": "Harfler + Rakamlar (ROT13 + ROT5)",
    "rot-desc-rot47": "Tum yazdirilabilir ASCII (33-126)"
  },
  "nl": {
    "rot-type": "ROT-type",
    "input": "Invoertekst",
    "input-placeholder": "Voer tekst in om te versleutelen/ontsleutelen...",
    "output": "Uitvoertekst",
    "output-placeholder": "Versleutelde/ontsleutelde tekst verschijnt hier...",
    "rot-desc-rot13": "Alleen letters (A-Z, a-z)",
    "rot-desc-rot5": "Alleen cijfers (0-9)",
    "rot-desc-rot18": "Letters + Cijfers (ROT13 + ROT5)",
    "rot-desc-rot47": "Alle afdrukbare ASCII (33-126)"
  },
  "sv": {
    "rot-type": "ROT-typ",
    "input": "Inmatningstext",
    "input-placeholder": "Ange text att kryptera/dekryptera...",
    "output": "Utmatningstext",
    "output-placeholder": "Krypterad/dekrypterad text visas har...",
    "rot-desc-rot13": "Endast bokstaver (A-Z, a-z)",
    "rot-desc-rot5": "Endast siffror (0-9)",
    "rot-desc-rot18": "Bokstaver + Siffror (ROT13 + ROT5)",
    "rot-desc-rot47": "Alla utskrivbara ASCII (33-126)"
  },
  "pl": {
    "rot-type": "Typ ROT",
    "input": "Tekst wejsciowy",
    "input-placeholder": "Wprowadz tekst do zaszyfrowania/odszyfrowania...",
    "output": "Tekst wyjsciowy",
    "output-placeholder": "Zaszyfrowany/odszyfrowany tekst pojawi sie tutaj...",
    "rot-desc-rot13": "Tylko litery (A-Z, a-z)",
    "rot-desc-rot5": "Tylko cyfry (0-9)",
    "rot-desc-rot18": "Litery + Cyfry (ROT13 + ROT5)",
    "rot-desc-rot47": "Wszystkie drukowalne ASCII (33-126)"
  },
  "vi": {
    "rot-type": "Loai ROT",
    "input": "Van ban dau vao",
    "input-placeholder": "Nhap van ban de ma hoa/giai ma...",
    "output": "Van ban dau ra",
    "output-placeholder": "Van ban da ma hoa/giai ma se hien thi o day...",
    "rot-desc-rot13": "Chi chu cai (A-Z, a-z)",
    "rot-desc-rot5": "Chi chu so (0-9)",
    "rot-desc-rot18": "Chu cai + Chu so (ROT13 + ROT5)",
    "rot-desc-rot47": "Tat ca ky tu ASCII in duoc (33-126)"
  },
  "th": {
    "rot-type": "ประเภท ROT",
    "input": "ข้อความนำเข้า",
    "input-placeholder": "ป้อนข้อความเพื่อเข้ารหัส/ถอดรหัส...",
    "output": "ข้อความส่งออก",
    "output-placeholder": "ข้อความที่เข้ารหัส/ถอดรหัสแล้วจะแสดงที่นี่...",
    "rot-desc-rot13": "ตัวอักษรเท่านั้น (A-Z, a-z)",
    "rot-desc-rot5": "ตัวเลขเท่านั้น (0-9)",
    "rot-desc-rot18": "ตัวอักษร + ตัวเลข (ROT13 + ROT5)",
    "rot-desc-rot47": "อักขระ ASCII ที่พิมพ์ได้ทั้งหมด (33-126)"
  },
  "id": {
    "rot-type": "Tipe ROT",
    "input": "Teks Masukan",
    "input-placeholder": "Masukkan teks untuk dienkripsi/didekripsi...",
    "output": "Teks Keluaran",
    "output-placeholder": "Teks terenkripsi/terdekripsi akan muncul di sini...",
    "rot-desc-rot13": "Hanya huruf (A-Z, a-z)",
    "rot-desc-rot5": "Hanya angka (0-9)",
    "rot-desc-rot18": "Huruf + Angka (ROT13 + ROT5)",
    "rot-desc-rot47": "Semua ASCII yang dapat dicetak (33-126)"
  },
  "he": {
    "rot-type": "סוג ROT",
    "input": "טקסט קלט",
    "input-placeholder": "הזן טקסט להצפנה/פענוח...",
    "output": "טקסט פלט",
    "output-placeholder": "הטקסט המוצפן/המפוענח יופיע כאן...",
    "rot-desc-rot13": "אותיות בלבד (A-Z, a-z)",
    "rot-desc-rot5": "ספרות בלבד (0-9)",
    "rot-desc-rot18": "אותיות + ספרות (ROT13 + ROT5)",
    "rot-desc-rot47": "כל תווי ASCII הניתנים להדפסה (33-126)"
  },
  "ms": {
    "rot-type": "Jenis ROT",
    "input": "Teks Input",
    "input-placeholder": "Masukkan teks untuk disulitkan/dinyahsulit...",
    "output": "Teks Output",
    "output-placeholder": "Teks yang disulitkan/dinyahsulit akan dipaparkan di sini...",
    "rot-desc-rot13": "Huruf sahaja (A-Z, a-z)",
    "rot-desc-rot5": "Digit sahaja (0-9)",
    "rot-desc-rot18": "Huruf + Digit (ROT13 + ROT5)",
    "rot-desc-rot47": "Semua ASCII boleh cetak (33-126)"
  },
  "no": {
    "rot-type": "ROT-type",
    "input": "Inndatatekst",
    "input-placeholder": "Skriv inn tekst for a kryptere/dekryptere...",
    "output": "Utdatatekst",
    "output-placeholder": "Kryptert/dekryptert tekst vises her...",
    "rot-desc-rot13": "Kun bokstaver (A-Z, a-z)",
    "rot-desc-rot5": "Kun sifre (0-9)",
    "rot-desc-rot18": "Bokstaver + Sifre (ROT13 + ROT5)",
    "rot-desc-rot47": "Alle utskrivbare ASCII (33-126)"
  }
}
</i18n>
