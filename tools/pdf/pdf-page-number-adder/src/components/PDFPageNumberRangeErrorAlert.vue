<template>
  <n-alert v-if="rangeErrorMessage" type="error" :title="rangeErrorMessage" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NAlert } from 'naive-ui'
import { PAGE_RANGE_ERROR } from '../utils/page-range'

const props = defineProps<{
  rangeErrorCode: string
}>()

const { t } = useI18n({ useScope: 'local' })

const rangeErrorMessage = computed(() => {
  if (!props.rangeErrorCode) {
    return ''
  }

  if (props.rangeErrorCode === PAGE_RANGE_ERROR.OutOfBounds) {
    return t('rangeOutOfBounds')
  }

  if (props.rangeErrorCode === PAGE_RANGE_ERROR.DescendingRange) {
    return t('rangeDescending')
  }

  if (props.rangeErrorCode === PAGE_RANGE_ERROR.DuplicatePage) {
    return t('rangeDuplicate')
  }

  return t('rangeInvalid')
})
</script>

<i18n lang="json">
{
  "en": {
    "rangeOutOfBounds": "Range contains pages outside the current PDF page count.",
    "rangeDescending": "Range start cannot be greater than range end.",
    "rangeDuplicate": "Each page can only appear once in the range expression.",
    "rangeInvalid": "Page range expression is invalid."
  },
  "zh": {
    "rangeOutOfBounds": "范围包含超出当前 PDF 页数的页面。",
    "rangeDescending": "范围起始页不能大于结束页。",
    "rangeDuplicate": "范围表达式中的页面不能重复。",
    "rangeInvalid": "页面范围表达式无效。"
  },
  "zh-CN": {
    "rangeOutOfBounds": "范围包含超出当前 PDF 页数的页面。",
    "rangeDescending": "范围起始页不能大于结束页。",
    "rangeDuplicate": "范围表达式中的页面不能重复。",
    "rangeInvalid": "页面范围表达式无效。"
  },
  "zh-TW": {
    "rangeOutOfBounds": "範圍包含超出目前 PDF 頁數的頁面。",
    "rangeDescending": "範圍起始頁不能大於結束頁。",
    "rangeDuplicate": "範圍表達式中的頁面不能重複。",
    "rangeInvalid": "頁面範圍表達式無效。"
  },
  "zh-HK": {
    "rangeOutOfBounds": "範圍包含超出目前 PDF 頁數的頁面。",
    "rangeDescending": "範圍起始頁不能大於結束頁。",
    "rangeDuplicate": "範圍表達式中的頁面不能重複。",
    "rangeInvalid": "頁面範圍表達式無效。"
  },
  "es": {
    "rangeOutOfBounds": "El rango contiene páginas fuera del total del PDF actual.",
    "rangeDescending": "El inicio del rango no puede ser mayor que el final.",
    "rangeDuplicate": "Cada página solo puede aparecer una vez en la expresión de rango.",
    "rangeInvalid": "La expresión de rango de páginas no es válida."
  },
  "fr": {
    "rangeOutOfBounds": "La plage contient des pages hors du nombre de pages du PDF actuel.",
    "rangeDescending": "Le début de la plage ne peut pas être supérieur à la fin.",
    "rangeDuplicate": "Chaque page ne peut apparaître qu'une seule fois dans l'expression.",
    "rangeInvalid": "L'expression de plage de pages est invalide."
  },
  "de": {
    "rangeOutOfBounds": "Der Bereich enthält Seiten außerhalb der aktuellen PDF-Seitenzahl.",
    "rangeDescending": "Der Start eines Bereichs darf nicht größer als das Ende sein.",
    "rangeDuplicate": "Jede Seite darf in der Bereichsangabe nur einmal vorkommen.",
    "rangeInvalid": "Die Seitenbereichsangabe ist ungültig."
  },
  "it": {
    "rangeOutOfBounds": "L'intervallo contiene pagine oltre il numero di pagine del PDF corrente.",
    "rangeDescending": "L'inizio dell'intervallo non può essere maggiore della fine.",
    "rangeDuplicate": "Ogni pagina può comparire una sola volta nell'espressione.",
    "rangeInvalid": "L'espressione dell'intervallo pagine non è valida."
  },
  "ja": {
    "rangeOutOfBounds": "範囲に現在の PDF ページ数を超えるページが含まれています。",
    "rangeDescending": "範囲の開始ページは終了ページより大きくできません。",
    "rangeDuplicate": "範囲指定では同じページを重複して指定できません。",
    "rangeInvalid": "ページ範囲の指定が無効です。"
  },
  "ko": {
    "rangeOutOfBounds": "범위에 현재 PDF 페이지 수를 벗어나는 페이지가 포함되어 있습니다.",
    "rangeDescending": "범위 시작 페이지는 종료 페이지보다 클 수 없습니다.",
    "rangeDuplicate": "범위 식에는 같은 페이지를 한 번만 포함할 수 있습니다.",
    "rangeInvalid": "페이지 범위 식이 올바르지 않습니다."
  },
  "ru": {
    "rangeOutOfBounds": "Диапазон содержит страницы вне количества страниц текущего PDF.",
    "rangeDescending": "Начало диапазона не может быть больше конца.",
    "rangeDuplicate": "Каждая страница может встречаться в выражении диапазона только один раз.",
    "rangeInvalid": "Некорректное выражение диапазона страниц."
  },
  "pt": {
    "rangeOutOfBounds": "O intervalo contém páginas fora da contagem de páginas do PDF atual.",
    "rangeDescending": "O início do intervalo não pode ser maior que o fim.",
    "rangeDuplicate": "Cada página só pode aparecer uma vez na expressão de intervalo.",
    "rangeInvalid": "A expressão de intervalo de páginas é inválida."
  },
  "ar": {
    "rangeOutOfBounds": "النطاق يحتوي صفحات خارج عدد صفحات ملف PDF الحالي.",
    "rangeDescending": "لا يمكن أن تكون بداية النطاق أكبر من نهايته.",
    "rangeDuplicate": "يمكن لكل صفحة أن تظهر مرة واحدة فقط في تعبير النطاق.",
    "rangeInvalid": "تعبير نطاق الصفحات غير صالح."
  },
  "hi": {
    "rangeOutOfBounds": "रेंज में वर्तमान PDF पेज संख्या से बाहर के पेज शामिल हैं।",
    "rangeDescending": "रेंज का प्रारंभ अंत से बड़ा नहीं हो सकता।",
    "rangeDuplicate": "रेंज अभिव्यक्ति में प्रत्येक पेज केवल एक बार आ सकता है।",
    "rangeInvalid": "पेज रेंज अभिव्यक्ति अमान्य है।"
  },
  "tr": {
    "rangeOutOfBounds": "Aralık, mevcut PDF sayfa sayısının dışındaki sayfaları içeriyor.",
    "rangeDescending": "Aralık başlangıcı bitişten büyük olamaz.",
    "rangeDuplicate": "Her sayfa aralık ifadesinde yalnızca bir kez yer alabilir.",
    "rangeInvalid": "Sayfa aralığı ifadesi geçersiz."
  },
  "nl": {
    "rangeOutOfBounds": "Het bereik bevat pagina's buiten het huidige aantal PDF-pagina's.",
    "rangeDescending": "Het begin van het bereik mag niet groter zijn dan het einde.",
    "rangeDuplicate": "Elke pagina mag maar één keer voorkomen in de bereikexpressie.",
    "rangeInvalid": "De paginabereikexpressie is ongeldig."
  },
  "sv": {
    "rangeOutOfBounds": "Intervallet innehåller sidor utanför aktuellt antal PDF-sidor.",
    "rangeDescending": "Intervallstart kan inte vara större än intervallslut.",
    "rangeDuplicate": "Varje sida får bara förekomma en gång i intervalluttrycket.",
    "rangeInvalid": "Sidintervalluttrycket är ogiltigt."
  },
  "pl": {
    "rangeOutOfBounds": "Zakres zawiera strony poza liczbą stron bieżącego PDF.",
    "rangeDescending": "Początek zakresu nie może być większy niż koniec.",
    "rangeDuplicate": "Każda strona może wystąpić w wyrażeniu tylko raz.",
    "rangeInvalid": "Wyrażenie zakresu stron jest nieprawidłowe."
  },
  "vi": {
    "rangeOutOfBounds": "Dải chứa các trang vượt ngoài số trang của PDF hiện tại.",
    "rangeDescending": "Trang bắt đầu của dải không thể lớn hơn trang kết thúc.",
    "rangeDuplicate": "Mỗi trang chỉ được xuất hiện một lần trong biểu thức dải.",
    "rangeInvalid": "Biểu thức dải trang không hợp lệ."
  },
  "th": {
    "rangeOutOfBounds": "ช่วงมีหน้าที่เกินจำนวนหน้าของ PDF ปัจจุบัน",
    "rangeDescending": "หน้าเริ่มต้นของช่วงต้องไม่มากกว่าหน้าที่สิ้นสุด",
    "rangeDuplicate": "แต่ละหน้าสามารถอยู่ในนิพจน์ช่วงได้เพียงครั้งเดียว",
    "rangeInvalid": "นิพจน์ช่วงหน้าไม่ถูกต้อง"
  },
  "id": {
    "rangeOutOfBounds": "Rentang berisi halaman di luar jumlah halaman PDF saat ini.",
    "rangeDescending": "Awal rentang tidak boleh lebih besar dari akhir rentang.",
    "rangeDuplicate": "Setiap halaman hanya boleh muncul satu kali dalam ekspresi rentang.",
    "rangeInvalid": "Ekspresi rentang halaman tidak valid."
  },
  "he": {
    "rangeOutOfBounds": "הטווח מכיל עמודים מעבר למספר העמודים בקובץ ה-PDF הנוכחי.",
    "rangeDescending": "תחילת הטווח לא יכולה להיות גדולה מסוף הטווח.",
    "rangeDuplicate": "כל עמוד יכול להופיע פעם אחת בלבד בביטוי הטווח.",
    "rangeInvalid": "ביטוי טווח העמודים אינו תקין."
  },
  "ms": {
    "rangeOutOfBounds": "Julat mengandungi halaman di luar jumlah halaman PDF semasa.",
    "rangeDescending": "Permulaan julat tidak boleh lebih besar daripada penghujung julat.",
    "rangeDuplicate": "Setiap halaman hanya boleh muncul sekali dalam ungkapan julat.",
    "rangeInvalid": "Ungkapan julat halaman tidak sah."
  },
  "no": {
    "rangeOutOfBounds": "Intervallet inneholder sider utenfor sidetallet i gjeldende PDF.",
    "rangeDescending": "Intervallstart kan ikke være større enn intervallslutt.",
    "rangeDuplicate": "Hver side kan bare forekomme én gang i intervalluttrykket.",
    "rangeInvalid": "Ugyldig sideintervalluttrykk."
  }
}
</i18n>
