<template>
  <ConversionOptions
    v-model:scale="scale"
    v-model:speed="speed"
    v-model:loop-mode="loopMode"
    v-model:loop-count="loopCount"
    :title="t('optionsTitle')"
    :scale-label="t('scaleLabel')"
    :scale-hint="t('scaleHint')"
    :speed-label="t('speedLabel')"
    :speed-hint="t('speedHint')"
    :loop-label="t('loopLabel')"
    :loop-hint="t('loopHint')"
    :loop-count-label="t('loopCountLabel')"
    :loop-inherit-label="t('loopInherit')"
    :loop-infinite-label="t('loopInfinite')"
    :loop-custom-label="t('loopCustom')"
    :convert-label="t('convert')"
    :converting-label="t('converting')"
    :min-scale="minScale"
    :max-scale="maxScale"
    :min-speed="minSpeed"
    :max-speed="maxSpeed"
    :is-converting="isConverting"
    :can-convert="canConvert"
    @convert="emit('convert')"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ConversionOptions from './ConversionOptions.vue'
import type { GifLoopMode } from '../types'

defineProps<{
  minScale: number
  maxScale: number
  minSpeed: number
  maxSpeed: number
  isConverting: boolean
  canConvert: boolean
}>()

const emit = defineEmits<{ (event: 'convert'): void }>()

const { t } = useI18n({ useScope: 'local' })

const scale = defineModel<number>('scale', { required: true })
const speed = defineModel<number>('speed', { required: true })
const loopMode = defineModel<GifLoopMode>('loopMode', { required: true })
const loopCount = defineModel<number | null>('loopCount', { required: true })
</script>

<i18n lang="json">
{
  "en": {
    "optionsTitle": "Conversion Options",
    "scaleLabel": "Scale (%)",
    "scaleHint": "Resize frames by percentage.",
    "speedLabel": "Speed multiplier",
    "speedHint": "1 = original speed, 2 = twice as fast.",
    "loopLabel": "Loop",
    "loopHint": "Follow GIF defaults to 1 if missing.",
    "loopCountLabel": "Loop count",
    "loopInherit": "Follow GIF",
    "loopInfinite": "Infinite",
    "loopCustom": "Custom",
    "convert": "Convert to Animated WebP",
    "converting": "Converting..."
  },
  "zh": {
    "optionsTitle": "转换选项",
    "scaleLabel": "缩放 (%)",
    "scaleHint": "按百分比缩放帧。",
    "speedLabel": "速度倍数",
    "speedHint": "1 为原速，2 为两倍速。",
    "loopLabel": "循环",
    "loopHint": "沿用 GIF，缺省则为 1 次。",
    "loopCountLabel": "循环次数",
    "loopInherit": "沿用 GIF",
    "loopInfinite": "无限循环",
    "loopCustom": "自定义",
    "convert": "转换为 WebP",
    "converting": "转换中..."
  },
  "zh-CN": {
    "optionsTitle": "转换选项",
    "scaleLabel": "缩放 (%)",
    "scaleHint": "按百分比缩放帧。",
    "speedLabel": "速度倍数",
    "speedHint": "1 为原速，2 为两倍速。",
    "loopLabel": "循环",
    "loopHint": "沿用 GIF，缺省则为 1 次。",
    "loopCountLabel": "循环次数",
    "loopInherit": "沿用 GIF",
    "loopInfinite": "无限循环",
    "loopCustom": "自定义",
    "convert": "转换为 WebP",
    "converting": "转换中..."
  },
  "zh-TW": {
    "optionsTitle": "轉換選項",
    "scaleLabel": "縮放 (%)",
    "scaleHint": "依百分比縮放影格。",
    "speedLabel": "速度倍數",
    "speedHint": "1 為原速，2 為兩倍速。",
    "loopLabel": "循環",
    "loopHint": "沿用 GIF，缺省為 1 次。",
    "loopCountLabel": "循環次數",
    "loopInherit": "沿用 GIF",
    "loopInfinite": "無限循環",
    "loopCustom": "自訂",
    "convert": "轉換為 WebP",
    "converting": "轉換中..."
  },
  "zh-HK": {
    "optionsTitle": "轉換選項",
    "scaleLabel": "縮放 (%)",
    "scaleHint": "依百分比縮放影格。",
    "speedLabel": "速度倍數",
    "speedHint": "1 為原速，2 為兩倍速。",
    "loopLabel": "循環",
    "loopHint": "沿用 GIF，缺省為 1 次。",
    "loopCountLabel": "循環次數",
    "loopInherit": "沿用 GIF",
    "loopInfinite": "無限循環",
    "loopCustom": "自訂",
    "convert": "轉換為 WebP",
    "converting": "轉換中..."
  },
  "es": {
    "optionsTitle": "Opciones de conversión",
    "scaleLabel": "Escala (%)",
    "scaleHint": "Redimensiona los fotogramas por porcentaje.",
    "speedLabel": "Multiplicador de velocidad",
    "speedHint": "1 = velocidad original, 2 = el doble de rápido.",
    "loopLabel": "Bucle",
    "loopHint": "Seguir GIF, por defecto 1 si falta.",
    "loopCountLabel": "Repeticiones",
    "loopInherit": "Seguir GIF",
    "loopInfinite": "Infinito",
    "loopCustom": "Personalizado",
    "convert": "Convertir a WebP",
    "converting": "Convirtiendo..."
  },
  "fr": {
    "optionsTitle": "Options de conversion",
    "scaleLabel": "Échelle (%)",
    "scaleHint": "Redimensionne les images par pourcentage.",
    "speedLabel": "Multiplicateur de vitesse",
    "speedHint": "1 = vitesse d'origine, 2 = deux fois plus rapide.",
    "loopLabel": "Boucle",
    "loopHint": "Suivre le GIF, 1 par défaut si manquant.",
    "loopCountLabel": "Nombre de boucles",
    "loopInherit": "Suivre le GIF",
    "loopInfinite": "Infini",
    "loopCustom": "Personnalisé",
    "convert": "Convertir en WebP",
    "converting": "Conversion..."
  },
  "de": {
    "optionsTitle": "Konvertierungsoptionen",
    "scaleLabel": "Skalierung (%)",
    "scaleHint": "Rahmen prozentual skalieren.",
    "speedLabel": "Geschwindigkeitsfaktor",
    "speedHint": "1 = Originalgeschwindigkeit, 2 = doppelt so schnell.",
    "loopLabel": "Schleife",
    "loopHint": "GIF folgen, fehlt → Standard 1.",
    "loopCountLabel": "Schleifendurchläufe",
    "loopInherit": "GIF folgen",
    "loopInfinite": "Unendlich",
    "loopCustom": "Benutzerdefiniert",
    "convert": "In WebP konvertieren",
    "converting": "Wird konvertiert..."
  },
  "it": {
    "optionsTitle": "Opzioni di conversione",
    "scaleLabel": "Scala (%)",
    "scaleHint": "Ridimensiona i fotogrammi in percentuale.",
    "speedLabel": "Moltiplicatore velocità",
    "speedHint": "1 = velocità originale, 2 = due volte più veloce.",
    "loopLabel": "Loop",
    "loopHint": "Segui il GIF, predefinito 1 se assente.",
    "loopCountLabel": "Numero di loop",
    "loopInherit": "Segui il GIF",
    "loopInfinite": "Infinito",
    "loopCustom": "Personalizzato",
    "convert": "Converti in WebP",
    "converting": "Conversione..."
  },
  "ja": {
    "optionsTitle": "変換オプション",
    "scaleLabel": "倍率 (%)",
    "scaleHint": "フレームを割合で拡大縮小します。",
    "speedLabel": "速度倍率",
    "speedHint": "1 = 元の速度、2 = 2倍速。",
    "loopLabel": "ループ",
    "loopHint": "GIFに従う（未指定なら1回）。",
    "loopCountLabel": "ループ回数",
    "loopInherit": "GIFに従う",
    "loopInfinite": "無限",
    "loopCustom": "カスタム",
    "convert": "WebPに変換",
    "converting": "変換中..."
  },
  "ko": {
    "optionsTitle": "변환 옵션",
    "scaleLabel": "크기 (%)",
    "scaleHint": "프레임을 퍼센트로 조절합니다.",
    "speedLabel": "속도 배수",
    "speedHint": "1 = 원본 속도, 2 = 2배 빠름.",
    "loopLabel": "루프",
    "loopHint": "GIF를 따름(없으면 1회).",
    "loopCountLabel": "루프 횟수",
    "loopInherit": "GIF 따르기",
    "loopInfinite": "무한",
    "loopCustom": "사용자 지정",
    "convert": "WebP로 변환",
    "converting": "변환 중..."
  },
  "ru": {
    "optionsTitle": "Параметры конвертации",
    "scaleLabel": "Масштаб (%)",
    "scaleHint": "Масштабировать кадры в процентах.",
    "speedLabel": "Множитель скорости",
    "speedHint": "1 = исходная скорость, 2 = вдвое быстрее.",
    "loopLabel": "Цикл",
    "loopHint": "Следовать GIF, по умолчанию 1 при отсутствии.",
    "loopCountLabel": "Количество повторов",
    "loopInherit": "Следовать GIF",
    "loopInfinite": "Бесконечно",
    "loopCustom": "Пользовательский",
    "convert": "Конвертировать в WebP",
    "converting": "Конвертация..."
  },
  "pt": {
    "optionsTitle": "Opções de conversão",
    "scaleLabel": "Escala (%)",
    "scaleHint": "Redimensiona os quadros por porcentagem.",
    "speedLabel": "Multiplicador de velocidade",
    "speedHint": "1 = velocidade original, 2 = duas vezes mais rápido.",
    "loopLabel": "Loop",
    "loopHint": "Seguir GIF, padrão 1 se ausente.",
    "loopCountLabel": "Quantidade de loops",
    "loopInherit": "Seguir GIF",
    "loopInfinite": "Infinito",
    "loopCustom": "Personalizado",
    "convert": "Converter para WebP",
    "converting": "Convertendo..."
  },
  "ar": {
    "optionsTitle": "خيارات التحويل",
    "scaleLabel": "المقياس (%)",
    "scaleHint": "تغيير حجم الإطارات كنسبة مئوية.",
    "speedLabel": "مضاعف السرعة",
    "speedHint": "1 = السرعة الأصلية، 2 = أسرع بمرتين.",
    "loopLabel": "التكرار",
    "loopHint": "اتباع GIF، الافتراضي 1 إذا لم يوجد.",
    "loopCountLabel": "عدد التكرارات",
    "loopInherit": "اتباع GIF",
    "loopInfinite": "لا نهائي",
    "loopCustom": "مخصص",
    "convert": "تحويل إلى WebP",
    "converting": "جارٍ التحويل..."
  },
  "hi": {
    "optionsTitle": "कन्वर्ज़न विकल्प",
    "scaleLabel": "स्केल (%)",
    "scaleHint": "फ्रेम्स को प्रतिशत से बदलें।",
    "speedLabel": "स्पीड मल्टीप्लायर",
    "speedHint": "1 = मूल गति, 2 = दोगुनी तेज।",
    "loopLabel": "लूप",
    "loopHint": "GIF का पालन करें, नहीं होने पर 1 डिफॉल्ट।",
    "loopCountLabel": "लूप काउंट",
    "loopInherit": "GIF का पालन करें",
    "loopInfinite": "अनंत",
    "loopCustom": "कस्टम",
    "convert": "WebP में बदलें",
    "converting": "कन्वर्ट हो रहा है..."
  },
  "tr": {
    "optionsTitle": "Dönüştürme seçenekleri",
    "scaleLabel": "Ölçek (%)",
    "scaleHint": "Kareleri yüzdeyle yeniden boyutlandırır.",
    "speedLabel": "Hız çarpanı",
    "speedHint": "1 = orijinal hız, 2 = iki kat hızlı.",
    "loopLabel": "Döngü",
    "loopHint": "GIF'i izle, yoksa varsayılan 1.",
    "loopCountLabel": "Döngü sayısı",
    "loopInherit": "GIF'i izle",
    "loopInfinite": "Sonsuz",
    "loopCustom": "Özel",
    "convert": "WebP'ye dönüştür",
    "converting": "Dönüştürülüyor..."
  },
  "nl": {
    "optionsTitle": "Conversieopties",
    "scaleLabel": "Schaal (%)",
    "scaleHint": "Schaal frames op percentage.",
    "speedLabel": "Snelheidsfactor",
    "speedHint": "1 = originele snelheid, 2 = twee keer zo snel.",
    "loopLabel": "Lus",
    "loopHint": "Volg GIF, standaard 1 als ontbreekt.",
    "loopCountLabel": "Aantal lussen",
    "loopInherit": "Volg GIF",
    "loopInfinite": "Oneindig",
    "loopCustom": "Aangepast",
    "convert": "Converteren naar WebP",
    "converting": "Converteren..."
  },
  "sv": {
    "optionsTitle": "Konverteringsalternativ",
    "scaleLabel": "Skala (%)",
    "scaleHint": "Skalar ramar i procent.",
    "speedLabel": "Hastighetsmultiplikator",
    "speedHint": "1 = originalhastighet, 2 = dubbelt så snabbt.",
    "loopLabel": "Loop",
    "loopHint": "Följ GIF, standard 1 om saknas.",
    "loopCountLabel": "Antal loopar",
    "loopInherit": "Följ GIF",
    "loopInfinite": "Oändlig",
    "loopCustom": "Anpassad",
    "convert": "Konvertera till WebP",
    "converting": "Konverterar..."
  },
  "pl": {
    "optionsTitle": "Opcje konwersji",
    "scaleLabel": "Skala (%)",
    "scaleHint": "Skaluje klatki procentowo.",
    "speedLabel": "Mnożnik prędkości",
    "speedHint": "1 = prędkość oryginalna, 2 = dwa razy szybciej.",
    "loopLabel": "Pętla",
    "loopHint": "Zgodnie z GIF, domyślnie 1 jeśli brak.",
    "loopCountLabel": "Liczba pętli",
    "loopInherit": "Zgodnie z GIF",
    "loopInfinite": "Nieskończona",
    "loopCustom": "Niestandardowa",
    "convert": "Konwertuj do WebP",
    "converting": "Konwertowanie..."
  },
  "vi": {
    "optionsTitle": "Tùy chọn chuyển đổi",
    "scaleLabel": "Tỷ lệ (%)",
    "scaleHint": "Thay đổi kích thước khung hình theo phần trăm.",
    "speedLabel": "Hệ số tốc độ",
    "speedHint": "1 = tốc độ gốc, 2 = nhanh gấp đôi.",
    "loopLabel": "Vòng lặp",
    "loopHint": "Theo GIF, mặc định 1 nếu thiếu.",
    "loopCountLabel": "Số lần lặp",
    "loopInherit": "Theo GIF",
    "loopInfinite": "Vô hạn",
    "loopCustom": "Tùy chỉnh",
    "convert": "Chuyển sang WebP",
    "converting": "Đang chuyển..."
  },
  "th": {
    "optionsTitle": "ตัวเลือกการแปลง",
    "scaleLabel": "สเกล (%)",
    "scaleHint": "ปรับขนาดเฟรมเป็นเปอร์เซ็นต์",
    "speedLabel": "ตัวคูณความเร็ว",
    "speedHint": "1 = ความเร็วเดิม, 2 = เร็วขึ้นสองเท่า",
    "loopLabel": "ลูป",
    "loopHint": "ตาม GIF, ถ้าไม่มีใช้ค่าเริ่มต้น 1",
    "loopCountLabel": "จำนวนครั้งของลูป",
    "loopInherit": "ตาม GIF",
    "loopInfinite": "ไม่สิ้นสุด",
    "loopCustom": "กำหนดเอง",
    "convert": "แปลงเป็น WebP",
    "converting": "กำลังแปลง..."
  },
  "id": {
    "optionsTitle": "Opsi konversi",
    "scaleLabel": "Skala (%)",
    "scaleHint": "Ubah ukuran frame berdasarkan persentase.",
    "speedLabel": "Pengali kecepatan",
    "speedHint": "1 = kecepatan asli, 2 = dua kali lebih cepat.",
    "loopLabel": "Loop",
    "loopHint": "Ikuti GIF, default 1 jika tidak ada.",
    "loopCountLabel": "Jumlah loop",
    "loopInherit": "Ikuti GIF",
    "loopInfinite": "Tak terbatas",
    "loopCustom": "Kustom",
    "convert": "Konversi ke WebP",
    "converting": "Mengonversi..."
  },
  "he": {
    "optionsTitle": "אפשרויות המרה",
    "scaleLabel": "קנה מידה (%)",
    "scaleHint": "שינוי גודל מסגרות באחוזים.",
    "speedLabel": "כפולת מהירות",
    "speedHint": "1 = מהירות מקורית, 2 = מהיר פי שניים.",
    "loopLabel": "לולאה",
    "loopHint": "עקוב אחר GIF, ברירת מחדל 1 אם חסר.",
    "loopCountLabel": "מספר לולאות",
    "loopInherit": "עקוב אחר GIF",
    "loopInfinite": "אינסופי",
    "loopCustom": "מותאם אישית",
    "convert": "המר ל-WebP",
    "converting": "ממיר..."
  },
  "ms": {
    "optionsTitle": "Pilihan penukaran",
    "scaleLabel": "Skala (%)",
    "scaleHint": "Ubah saiz bingkai mengikut peratus.",
    "speedLabel": "Pengganda kelajuan",
    "speedHint": "1 = kelajuan asal, 2 = dua kali lebih laju.",
    "loopLabel": "Gelung",
    "loopHint": "Ikut GIF, lalai 1 jika tiada.",
    "loopCountLabel": "Bilangan gelung",
    "loopInherit": "Ikut GIF",
    "loopInfinite": "Tanpa had",
    "loopCustom": "Tersuai",
    "convert": "Tukar ke WebP",
    "converting": "Menukar..."
  },
  "no": {
    "optionsTitle": "Konverteringsvalg",
    "scaleLabel": "Skalering (%)",
    "scaleHint": "Skaler rammer i prosent.",
    "speedLabel": "Hastighetsmultiplikator",
    "speedHint": "1 = original hastighet, 2 = dobbelt så rask.",
    "loopLabel": "Løkke",
    "loopHint": "Følg GIF, standard 1 hvis mangler.",
    "loopCountLabel": "Antall løkker",
    "loopInherit": "Følg GIF",
    "loopInfinite": "Uendelig",
    "loopCustom": "Tilpasset",
    "convert": "Konverter til WebP",
    "converting": "Konverterer..."
  }
}
</i18n>
