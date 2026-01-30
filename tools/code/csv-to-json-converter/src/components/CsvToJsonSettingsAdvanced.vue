<template>
  <n-grid cols="1 s:2 m:3 l:4" responsive="screen" :x-gap="20" :y-gap="16">
    <n-form-item-gi :label="t('opt-preview')">
      <n-input-number
        v-model:value="preview"
        :min="0"
        :max="1000000"
        size="small"
        style="width: 100%"
      />
    </n-form-item-gi>

    <n-form-item-gi :label="t('opt-comments')">
      <n-input v-model:value="comments" size="small" :placeholder="t('opt-comments-ph')" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('opt-fastMode')">
      <n-switch v-model:value="fastMode" size="small" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('opt-skipFirstNLines')">
      <n-input-number
        v-model:value="skipFirstNLines"
        :min="0"
        :max="1000000"
        size="small"
        style="width: 100%"
      />
    </n-form-item-gi>

    <n-form-item-gi :label="t('opt-delimitersToGuess')">
      <n-input
        v-model:value="delimitersToGuessText"
        size="small"
        :placeholder="t('opt-delimitersToGuess-ph')"
      />
    </n-form-item-gi>

    <n-form-item-gi :label="t('opt-includeColumns')">
      <n-input v-model:value="includeColumns" size="small" :placeholder="t('opt-regex-ph')" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('opt-ignoreColumns')">
      <n-input v-model:value="ignoreColumns" size="small" :placeholder="t('opt-regex-ph')" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('opt-spaces')">
      <n-input-number v-model:value="spaces" :min="0" :max="8" size="small" style="width: 100%" />
    </n-form-item-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFormItemGi, NGrid, NInput, NInputNumber, NSwitch } from 'naive-ui'

const preview = defineModel<number>('preview', { required: true })
const comments = defineModel<string>('comments', { required: true })
const fastMode = defineModel<boolean>('fastMode', { required: true })
const skipFirstNLines = defineModel<number>('skipFirstNLines', { required: true })
const delimitersToGuessText = defineModel<string>('delimitersToGuessText', { required: true })
const includeColumns = defineModel<string>('includeColumns', { required: true })
const ignoreColumns = defineModel<string>('ignoreColumns', { required: true })
const spaces = defineModel<number>('spaces', { required: true })

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "opt-preview": "Preview rows",
    "opt-comments": "Comments",
    "opt-comments-ph": "# or // or true",
    "opt-fastMode": "Fast mode",
    "opt-skipFirstNLines": "Skip first N lines",
    "opt-delimitersToGuess": "Delimiters to guess",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Include columns (regex)",
    "opt-ignoreColumns": "Ignore columns (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Spaces"
  },
  "zh": {
    "opt-preview": "预览行数",
    "opt-comments": "注释",
    "opt-comments-ph": "# 或 // 或 true",
    "opt-fastMode": "快速模式",
    "opt-skipFirstNLines": "跳过前 N 行",
    "opt-delimitersToGuess": "猜测分隔符",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "包含列(正则)",
    "opt-ignoreColumns": "忽略列(正则)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "缩进空格"
  },
  "zh-CN": {
    "opt-preview": "预览行数",
    "opt-comments": "注释",
    "opt-comments-ph": "# 或 // 或 true",
    "opt-fastMode": "快速模式",
    "opt-skipFirstNLines": "跳过前 N 行",
    "opt-delimitersToGuess": "猜测分隔符",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "包含列(正则)",
    "opt-ignoreColumns": "忽略列(正则)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "缩进空格"
  },
  "zh-TW": {
    "opt-preview": "預覽行數",
    "opt-comments": "註解",
    "opt-comments-ph": "# 或 // 或 true",
    "opt-fastMode": "快速模式",
    "opt-skipFirstNLines": "跳過前 N 行",
    "opt-delimitersToGuess": "猜測分隔符號",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "包含欄(正則)",
    "opt-ignoreColumns": "忽略欄(正則)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "縮排空格"
  },
  "zh-HK": {
    "opt-preview": "預覽行數",
    "opt-comments": "註解",
    "opt-comments-ph": "# 或 // 或 true",
    "opt-fastMode": "快速模式",
    "opt-skipFirstNLines": "跳過前 N 行",
    "opt-delimitersToGuess": "猜測分隔符號",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "包含欄(正則)",
    "opt-ignoreColumns": "忽略欄(正則)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "縮排空格"
  },
  "es": {
    "opt-preview": "Filas de vista previa",
    "opt-comments": "Comentarios",
    "opt-comments-ph": "# o // o true",
    "opt-fastMode": "Modo rápido",
    "opt-skipFirstNLines": "Omitir primeras N líneas",
    "opt-delimitersToGuess": "Delimitadores a adivinar",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Incluir columnas (regex)",
    "opt-ignoreColumns": "Ignorar columnas (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Espacios"
  },
  "fr": {
    "opt-preview": "Lignes d'aperçu",
    "opt-comments": "Commentaires",
    "opt-comments-ph": "# ou // ou true",
    "opt-fastMode": "Mode rapide",
    "opt-skipFirstNLines": "Ignorer les N premières lignes",
    "opt-delimitersToGuess": "Délimiteurs à deviner",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Inclure colonnes (regex)",
    "opt-ignoreColumns": "Ignorer colonnes (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Espaces"
  },
  "de": {
    "opt-preview": "Vorschauzeilen",
    "opt-comments": "Kommentare",
    "opt-comments-ph": "# oder // oder true",
    "opt-fastMode": "Schnellmodus",
    "opt-skipFirstNLines": "Erste N Zeilen überspringen",
    "opt-delimitersToGuess": "Trennzeichen erraten",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Spalten einschl. (Regex)",
    "opt-ignoreColumns": "Spalten ausschl. (Regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Leerzeichen"
  },
  "it": {
    "opt-preview": "Righe di anteprima",
    "opt-comments": "Commenti",
    "opt-comments-ph": "# o // o true",
    "opt-fastMode": "Modalità veloce",
    "opt-skipFirstNLines": "Salta prime N righe",
    "opt-delimitersToGuess": "Delimitatori da indovinare",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Includi colonne (regex)",
    "opt-ignoreColumns": "Ignora colonne (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Spazi"
  },
  "ja": {
    "opt-preview": "プレビュー行数",
    "opt-comments": "コメント",
    "opt-comments-ph": "# または // または true",
    "opt-fastMode": "高速モード",
    "opt-skipFirstNLines": "最初のN行をスキップ",
    "opt-delimitersToGuess": "推測する区切り文字",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "含める列 (正規表現)",
    "opt-ignoreColumns": "無視する列 (正規表現)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "スペース"
  },
  "ko": {
    "opt-preview": "미리보기 행수",
    "opt-comments": "주석",
    "opt-comments-ph": "# 또는 // 또는 true",
    "opt-fastMode": "고속 모드",
    "opt-skipFirstNLines": "처음 N줄 건너뛰기",
    "opt-delimitersToGuess": "추측할 구분자",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "포함 열 (정규식)",
    "opt-ignoreColumns": "무시 열 (정규식)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "공백"
  },
  "ru": {
    "opt-preview": "Строки предпросмотра",
    "opt-comments": "Комментарии",
    "opt-comments-ph": "# или // или true",
    "opt-fastMode": "Быстрый режим",
    "opt-skipFirstNLines": "Пропустить первые N строк",
    "opt-delimitersToGuess": "Разделители для угадывания",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Включать столбцы (regex)",
    "opt-ignoreColumns": "Игнорировать столбцы (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Пробелы"
  },
  "pt": {
    "opt-preview": "Linhas de visualização",
    "opt-comments": "Comentários",
    "opt-comments-ph": "# ou // ou true",
    "opt-fastMode": "Modo rápido",
    "opt-skipFirstNLines": "Pular primeiras N linhas",
    "opt-delimitersToGuess": "Delimitadores para adivinhar",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Incluir colunas (regex)",
    "opt-ignoreColumns": "Ignorar colunas (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Espaços"
  },
  "ar": {
    "opt-preview": "أسطر المعاينة",
    "opt-comments": "التعليقات",
    "opt-comments-ph": "# أو // أو true",
    "opt-fastMode": "الوضع السريع",
    "opt-skipFirstNLines": "تخطي أول N أسطر",
    "opt-delimitersToGuess": "الفواصل للتخمين",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "تضمين الأعمدة (regex)",
    "opt-ignoreColumns": "تجاهل الأعمدة (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "مسافات"
  },
  "hi": {
    "opt-preview": "पूर्वावलोकन पंक्तियाँ",
    "opt-comments": "टिप्पणियाँ",
    "opt-comments-ph": "# या // या true",
    "opt-fastMode": "तेज़ मोड",
    "opt-skipFirstNLines": "पहली N पंक्तियाँ छोड़ें",
    "opt-delimitersToGuess": "अनुमान लगाने के लिए विभाजक",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "कॉलम शामिल (regex)",
    "opt-ignoreColumns": "कॉलम अनदेखा (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "स्पेसेज़"
  },
  "tr": {
    "opt-preview": "Önizleme satırları",
    "opt-comments": "Yorumlar",
    "opt-comments-ph": "# veya // veya true",
    "opt-fastMode": "Hızlı mod",
    "opt-skipFirstNLines": "İlk N satırı atla",
    "opt-delimitersToGuess": "Tahmin edilecek ayırıcılar",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Dahil sütunlar (regex)",
    "opt-ignoreColumns": "Yoksay sütunlar (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Boşluk"
  },
  "nl": {
    "opt-preview": "Voorbeeldregels",
    "opt-comments": "Opmerkingen",
    "opt-comments-ph": "# of // of true",
    "opt-fastMode": "Snelle modus",
    "opt-skipFirstNLines": "Eerste N regels overslaan",
    "opt-delimitersToGuess": "Te raden scheidingstekens",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Kolommen opnemen (regex)",
    "opt-ignoreColumns": "Kolommen negeren (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Spaties"
  },
  "sv": {
    "opt-preview": "Förhandsvisningsrader",
    "opt-comments": "Kommentarer",
    "opt-comments-ph": "# eller // eller true",
    "opt-fastMode": "Snabbläge",
    "opt-skipFirstNLines": "Hoppa över första N rader",
    "opt-delimitersToGuess": "Avgränsare att gissa",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Inkludera kolumner (regex)",
    "opt-ignoreColumns": "Ignorera kolumner (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Blanksteg"
  },
  "pl": {
    "opt-preview": "Wiersze podglądu",
    "opt-comments": "Komentarze",
    "opt-comments-ph": "# lub // lub true",
    "opt-fastMode": "Tryb szybki",
    "opt-skipFirstNLines": "Pomiń pierwsze N wierszy",
    "opt-delimitersToGuess": "Separatory do odgadnięcia",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Uwzględnij kolumny (regex)",
    "opt-ignoreColumns": "Ignoruj kolumny (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Spacje"
  },
  "vi": {
    "opt-preview": "Dòng xem trước",
    "opt-comments": "Bình luận",
    "opt-comments-ph": "# hoặc // hoặc true",
    "opt-fastMode": "Chế độ nhanh",
    "opt-skipFirstNLines": "Bỏ qua N dòng đầu",
    "opt-delimitersToGuess": "Dấu phân cách để đoán",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Bao gồm cột (regex)",
    "opt-ignoreColumns": "Bỏ qua cột (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Khoảng trắng"
  },
  "th": {
    "opt-preview": "บรรทัดแสดงตัวอย่าง",
    "opt-comments": "ความเห็น",
    "opt-comments-ph": "# หรือ // หรือ true",
    "opt-fastMode": "โหมดเร็ว",
    "opt-skipFirstNLines": "ข้าม N บรรทัดแรก",
    "opt-delimitersToGuess": "ตัวคั่นที่จะเดา",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "รวมคอลัมน์ (regex)",
    "opt-ignoreColumns": "ละเว้นคอลัมน์ (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "ช่องว่าง"
  },
  "id": {
    "opt-preview": "Baris pratinjau",
    "opt-comments": "Komentar",
    "opt-comments-ph": "# atau // atau true",
    "opt-fastMode": "Mode cepat",
    "opt-skipFirstNLines": "Lewati N baris pertama",
    "opt-delimitersToGuess": "Pemisah untuk ditebak",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Sertakan kolom (regex)",
    "opt-ignoreColumns": "Abaikan kolom (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Spasi"
  },
  "he": {
    "opt-preview": "שורות תצוגה מקדימה",
    "opt-comments": "הערות",
    "opt-comments-ph": "# או // או true",
    "opt-fastMode": "מצב מהיר",
    "opt-skipFirstNLines": "דלג על N שורות ראשונות",
    "opt-delimitersToGuess": "מפרידים לניחוש",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "כלול עמודות (regex)",
    "opt-ignoreColumns": "התעלם מעמודות (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "רווחים"
  },
  "ms": {
    "opt-preview": "Baris pratonton",
    "opt-comments": "Komen",
    "opt-comments-ph": "# atau // atau true",
    "opt-fastMode": "Mod pantas",
    "opt-skipFirstNLines": "Langkau N baris pertama",
    "opt-delimitersToGuess": "Pemisah untuk diteka",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Sertakan lajur (regex)",
    "opt-ignoreColumns": "Abaikan lajur (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Ruang"
  },
  "no": {
    "opt-preview": "Forhåndsvisningslinjer",
    "opt-comments": "Kommentarer",
    "opt-comments-ph": "# eller // eller true",
    "opt-fastMode": "Rask modus",
    "opt-skipFirstNLines": "Hopp over første N linjer",
    "opt-delimitersToGuess": "Skilletegn å gjette",
    "opt-delimitersToGuess-ph": ",,\t,|;",
    "opt-includeColumns": "Inkluder kolonner (regex)",
    "opt-ignoreColumns": "Ignorer kolonner (regex)",
    "opt-regex-ph": ".*name|age",
    "opt-spaces": "Mellomrom"
  }
}
</i18n>
