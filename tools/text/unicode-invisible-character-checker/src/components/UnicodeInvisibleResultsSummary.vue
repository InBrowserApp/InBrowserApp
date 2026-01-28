<template>
  <n-flex align="center" :size="8" wrap>
    <n-tag :type="matchCount ? 'warning' : 'success'" size="small">
      {{ t('summary-found', { count: matchCount }) }}
    </n-tag>
    <n-text depth="3">{{ t('summary-clean-length', { count: cleanedLength }) }}</n-text>
  </n-flex>
  <n-flex v-show="matchCount" align="center" :size="8" wrap class="category-tags">
    <n-tag v-for="category in tagCategories" :key="category.value" size="small">
      {{ categoryLabels[category.value] }}: {{ counts[category.value] }}
    </n-tag>
  </n-flex>

  <n-text v-show="hasInput && !matchCount" depth="3" class="empty-state">
    {{ t('empty-state') }}
  </n-text>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NFlex, NTag, NText } from 'naive-ui'
import { INVISIBLE_CATEGORIES, type InvisibleCategory, type InvisibleMatch } from '../utils'

const props = defineProps<{
  matches: InvisibleMatch[]
  counts: Record<InvisibleCategory, number>
  cleanedText: string
  hasInput: boolean
  selectedCategories: InvisibleCategory[]
}>()

const { t } = useI18n()

const matchCount = computed(() => props.matches.length)
const cleanedLength = computed(() => props.cleanedText.length)
const tagCategories = computed(() =>
  INVISIBLE_CATEGORIES.filter((category) => props.selectedCategories.includes(category.value)),
)
const categoryLabels = computed<Record<InvisibleCategory, string>>(() => ({
  'zero-width': t('category.zero-width'),
  'bidi-control': t('category.bidi-control'),
  'space-like': t('category.space-like'),
  format: t('category.format'),
}))
</script>

<style scoped>
.category-tags {
  margin-top: 8px;
}

.empty-state {
  display: block;
  margin-top: 8px;
}
</style>

<i18n lang="json">
{
  "en": {
    "summary-found": "Detected {count} characters",
    "summary-clean-length": "Cleaned length: {count}",
    "empty-state": "No invisible or bidi characters detected",
    "category.zero-width": "Zero-width",
    "category.bidi-control": "Bidi control",
    "category.space-like": "Special spaces",
    "category.format": "Format controls"
  },
  "zh": {
    "summary-found": "检测到 {count} 个字符",
    "summary-clean-length": "清理后长度：{count}",
    "empty-state": "未检测到不可见或双向控制字符",
    "category.zero-width": "零宽",
    "category.bidi-control": "双向控制",
    "category.space-like": "特殊空格",
    "category.format": "格式控制"
  },
  "zh-CN": {
    "summary-found": "检测到 {count} 个字符",
    "summary-clean-length": "清理后长度：{count}",
    "empty-state": "未检测到不可见或双向控制字符",
    "category.zero-width": "零宽",
    "category.bidi-control": "双向控制",
    "category.space-like": "特殊空格",
    "category.format": "格式控制"
  },
  "zh-TW": {
    "summary-found": "偵測到 {count} 個字元",
    "summary-clean-length": "清理後長度：{count}",
    "empty-state": "未偵測到不可見或雙向控制字元",
    "category.zero-width": "零寬",
    "category.bidi-control": "雙向控制",
    "category.space-like": "特殊空白",
    "category.format": "格式控制"
  },
  "zh-HK": {
    "summary-found": "偵測到 {count} 個字元",
    "summary-clean-length": "清理後長度：{count}",
    "empty-state": "未偵測到不可見或雙向控制字元",
    "category.zero-width": "零寬",
    "category.bidi-control": "雙向控制",
    "category.space-like": "特殊空白",
    "category.format": "格式控制"
  },
  "es": {
    "summary-found": "Detectados {count} caracteres",
    "summary-clean-length": "Longitud limpia: {count}",
    "empty-state": "No se detectaron caracteres invisibles o bidi",
    "category.zero-width": "Cero ancho",
    "category.bidi-control": "Control bidi",
    "category.space-like": "Espacios especiales",
    "category.format": "Controles de formato"
  },
  "fr": {
    "summary-found": "{count} caractères détectés",
    "summary-clean-length": "Longueur nettoyée : {count}",
    "empty-state": "Aucun caractère invisible ou bidi détecté",
    "category.zero-width": "Zéro largeur",
    "category.bidi-control": "Contrôle bidi",
    "category.space-like": "Espaces spéciaux",
    "category.format": "Contrôles de format"
  },
  "de": {
    "summary-found": "{count} Zeichen erkannt",
    "summary-clean-length": "Bereinigte Länge: {count}",
    "empty-state": "Keine unsichtbaren oder bidi-Zeichen erkannt",
    "category.zero-width": "Nullbreite",
    "category.bidi-control": "Bidi-Steuerung",
    "category.space-like": "Sonderabstände",
    "category.format": "Formatsteuerzeichen"
  },
  "it": {
    "summary-found": "Rilevati {count} caratteri",
    "summary-clean-length": "Lunghezza pulita: {count}",
    "empty-state": "Nessun carattere invisibile o bidi rilevato",
    "category.zero-width": "Zero-width",
    "category.bidi-control": "Controllo bidi",
    "category.space-like": "Spazi speciali",
    "category.format": "Controlli di formato"
  },
  "ja": {
    "summary-found": "{count} 文字を検出",
    "summary-clean-length": "クリーン長さ: {count}",
    "empty-state": "不可視または双方向制御文字は検出されませんでした",
    "category.zero-width": "ゼロ幅",
    "category.bidi-control": "双方向制御",
    "category.space-like": "特殊スペース",
    "category.format": "書式制御"
  },
  "ko": {
    "summary-found": "{count}개 문자를 감지",
    "summary-clean-length": "정리된 길이: {count}",
    "empty-state": "보이지 않거나 양방향 제어 문자가 없습니다",
    "category.zero-width": "제로 폭",
    "category.bidi-control": "양방향 제어",
    "category.space-like": "특수 공백",
    "category.format": "서식 제어"
  },
  "ru": {
    "summary-found": "Обнаружено {count} символов",
    "summary-clean-length": "Очищенная длина: {count}",
    "empty-state": "Невидимые или bidi-символы не обнаружены",
    "category.zero-width": "Нулевой ширины",
    "category.bidi-control": "Bidi-контроль",
    "category.space-like": "Специальные пробелы",
    "category.format": "Форматирующие"
  },
  "pt": {
    "summary-found": "Detectados {count} caracteres",
    "summary-clean-length": "Comprimento limpo: {count}",
    "empty-state": "Nenhum caractere invisível ou bidi detectado",
    "category.zero-width": "Largura zero",
    "category.bidi-control": "Controle bidi",
    "category.space-like": "Espaços especiais",
    "category.format": "Controles de formato"
  },
  "ar": {
    "summary-found": "تم اكتشاف {count} حرفًا",
    "summary-clean-length": "الطول بعد التنظيف: {count}",
    "empty-state": "لم يتم اكتشاف أحرف غير مرئية أو ثنائية الاتجاه",
    "category.zero-width": "عديم العرض",
    "category.bidi-control": "تحكم ثنائي الاتجاه",
    "category.space-like": "مسافات خاصة",
    "category.format": "عناصر تحكم التنسيق"
  },
  "hi": {
    "summary-found": "{count} वर्ण पाए गए",
    "summary-clean-length": "साफ़ लंबाई: {count}",
    "empty-state": "कोई अदृश्य या बिडी वर्ण नहीं मिले",
    "category.zero-width": "शून्य-चौड़ाई",
    "category.bidi-control": "बिडी नियंत्रण",
    "category.space-like": "विशेष स्पेस",
    "category.format": "फ़ॉर्मैट नियंत्रण"
  },
  "tr": {
    "summary-found": "{count} karakter tespit edildi",
    "summary-clean-length": "Temiz uzunluk: {count}",
    "empty-state": "Görünmez veya bidi karakter bulunamadı",
    "category.zero-width": "Sıfır genişlik",
    "category.bidi-control": "Bidi kontrol",
    "category.space-like": "Özel boşluklar",
    "category.format": "Biçim denetimleri"
  },
  "nl": {
    "summary-found": "{count} tekens gedetecteerd",
    "summary-clean-length": "Schone lengte: {count}",
    "empty-state": "Geen onzichtbare of bidi-tekens gedetecteerd",
    "category.zero-width": "Nulbreedte",
    "category.bidi-control": "Bidi-besturing",
    "category.space-like": "Speciale spaties",
    "category.format": "Opmaakbesturing"
  },
  "sv": {
    "summary-found": "{count} tecken upptäckta",
    "summary-clean-length": "Rensad längd: {count}",
    "empty-state": "Inga osynliga eller bidi-tecken hittades",
    "category.zero-width": "Nollbredd",
    "category.bidi-control": "Bidi-kontroll",
    "category.space-like": "Speciella blanksteg",
    "category.format": "Formatkontroller"
  },
  "pl": {
    "summary-found": "Wykryto {count} znaków",
    "summary-clean-length": "Oczyszczona długość: {count}",
    "empty-state": "Nie wykryto niewidocznych ani bidi znaków",
    "category.zero-width": "Zerowa szerokość",
    "category.bidi-control": "Kontrola bidi",
    "category.space-like": "Specjalne spacje",
    "category.format": "Kontrole formatu"
  },
  "vi": {
    "summary-found": "Phát hiện {count} ký tự",
    "summary-clean-length": "Độ dài đã làm sạch: {count}",
    "empty-state": "Không phát hiện ký tự ẩn hoặc bidi",
    "category.zero-width": "Không độ rộng",
    "category.bidi-control": "Điều khiển bidi",
    "category.space-like": "Khoảng trắng đặc biệt",
    "category.format": "Điều khiển định dạng"
  },
  "th": {
    "summary-found": "ตรวจพบ {count} อักขระ",
    "summary-clean-length": "ความยาวที่ทำความสะอาดแล้ว: {count}",
    "empty-state": "ไม่พบอักขระที่มองไม่เห็นหรือไบดิ",
    "category.zero-width": "กว้างศูนย์",
    "category.bidi-control": "การควบคุมไบดิ",
    "category.space-like": "ช่องว่างพิเศษ",
    "category.format": "การควบคุมรูปแบบ"
  },
  "id": {
    "summary-found": "Terdeteksi {count} karakter",
    "summary-clean-length": "Panjang bersih: {count}",
    "empty-state": "Tidak ada karakter tak terlihat atau bidi terdeteksi",
    "category.zero-width": "Lebar nol",
    "category.bidi-control": "Kontrol bidi",
    "category.space-like": "Spasi khusus",
    "category.format": "Kontrol format"
  },
  "he": {
    "summary-found": "זוהו {count} תווים",
    "summary-clean-length": "אורך נקי: {count}",
    "empty-state": "לא זוהו תווים בלתי נראים או bidi",
    "category.zero-width": "רוחב אפס",
    "category.bidi-control": "בקרת bidi",
    "category.space-like": "רווחים מיוחדים",
    "category.format": "בקרות עיצוב"
  },
  "ms": {
    "summary-found": "{count} aksara dikesan",
    "summary-clean-length": "Panjang bersih: {count}",
    "empty-state": "Tiada aksara tidak kelihatan atau bidi dikesan",
    "category.zero-width": "Lebar sifar",
    "category.bidi-control": "Kawalan bidi",
    "category.space-like": "Ruang khas",
    "category.format": "Kawalan format"
  },
  "no": {
    "summary-found": "Oppdaget {count} tegn",
    "summary-clean-length": "Renset lengde: {count}",
    "empty-state": "Ingen usynlige eller bidi-tegn oppdaget",
    "category.zero-width": "Nullbredde",
    "category.bidi-control": "Bidi-kontroll",
    "category.space-like": "Spesielle mellomrom",
    "category.format": "Formateringskontroller"
  }
}
</i18n>
