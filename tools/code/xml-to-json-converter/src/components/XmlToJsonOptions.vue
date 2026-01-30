<template>
  <n-flex align="center" :size="12">
    <n-flex align="center">
      <n-switch v-model:value="options.compact" size="small" />
      <span>{{ t('opt-compact') }}</span>
    </n-flex>
    <n-flex align="center">
      <n-switch v-model:value="options.ignoreDeclaration" size="small" />
      <span>{{ t('opt-ignore-declaration') }}</span>
    </n-flex>
    <n-flex align="center">
      <n-switch v-model:value="options.ignoreInstruction" size="small" />
      <span>{{ t('opt-ignore-instruction') }}</span>
    </n-flex>
    <n-flex align="center">
      <n-switch v-model:value="options.ignoreAttributes" size="small" />
      <span>{{ t('opt-ignore-attributes') }}</span>
    </n-flex>
    <n-flex align="center">
      <n-switch v-model:value="options.ignoreText" size="small" />
      <span>{{ t('opt-ignore-text') }}</span>
    </n-flex>
    <n-flex align="center">
      <n-switch v-model:value="options.ignoreCdata" size="small" />
      <span>{{ t('opt-ignore-cdata') }}</span>
    </n-flex>
    <n-flex align="center">
      <n-switch v-model:value="options.ignoreDoctype" size="small" />
      <span>{{ t('opt-ignore-doctype') }}</span>
    </n-flex>
    <n-flex align="center">
      <n-switch v-model:value="options.ignoreComment" size="small" />
      <span>{{ t('opt-ignore-comment') }}</span>
    </n-flex>
    <n-flex align="center">
      <n-switch v-model:value="options.trim" size="small" />
      <span>{{ t('opt-trim') }}</span>
    </n-flex>
    <n-flex align="center">
      <n-switch v-model:value="options.nativeType" size="small" />
      <span>{{ t('opt-native-type') }}</span>
    </n-flex>
    <n-flex align="center">
      <n-switch v-model:value="options.alwaysArray" size="small" :disabled="!options.compact" />
      <span :class="{ [$style.disabled]: !options.compact }">{{ t('opt-always-array') }}</span>
    </n-flex>
    <n-flex align="center">
      <n-switch v-model:value="options.alwaysChildren" size="small" :disabled="options.compact" />
      <span :class="{ [$style.disabled]: options.compact }">{{ t('opt-always-children') }}</span>
    </n-flex>
    <n-flex align="center">
      <n-input-number v-model:value="spaces" :min="0" :max="8" size="small" style="width: 120px" />
      <span>{{ t('opt-spaces') }}</span>
    </n-flex>
  </n-flex>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFlex, NInputNumber, NSwitch } from 'naive-ui'
import type { XmlToJsonOptionsConfig } from '../types'

const options = defineModel<XmlToJsonOptionsConfig>('options', { required: true })
const spaces = defineModel<number>('spaces', { required: true })

const { t } = useI18n({ useScope: 'local' })
</script>

<style module>
.disabled {
  color: rgba(0, 0, 0, 0.38);
}
</style>

<i18n lang="json">
{
  "en": {
    "opt-compact": "Compact",
    "opt-ignore-declaration": "Ignore declaration",
    "opt-ignore-instruction": "Ignore instruction",
    "opt-ignore-attributes": "Ignore attributes",
    "opt-ignore-text": "Ignore text",
    "opt-ignore-cdata": "Ignore CDATA",
    "opt-ignore-doctype": "Ignore DOCTYPE",
    "opt-ignore-comment": "Ignore comment",
    "opt-trim": "Trim text",
    "opt-native-type": "Native types",
    "opt-always-array": "Always array (compact)",
    "opt-always-children": "Always children (non-compact)",
    "opt-spaces": "Spaces"
  },
  "zh": {
    "opt-compact": "紧凑模式",
    "opt-ignore-declaration": "忽略声明",
    "opt-ignore-instruction": "忽略处理指令",
    "opt-ignore-attributes": "忽略属性",
    "opt-ignore-text": "忽略文本",
    "opt-ignore-cdata": "忽略 CDATA",
    "opt-ignore-doctype": "忽略 DOCTYPE",
    "opt-ignore-comment": "忽略注释",
    "opt-trim": "裁剪文本",
    "opt-native-type": "原生类型",
    "opt-always-array": "总为数组（紧凑）",
    "opt-always-children": "总含子元素（非紧凑）",
    "opt-spaces": "缩进空格"
  },
  "zh-CN": {
    "opt-compact": "紧凑模式",
    "opt-ignore-declaration": "忽略声明",
    "opt-ignore-instruction": "忽略处理指令",
    "opt-ignore-attributes": "忽略属性",
    "opt-ignore-text": "忽略文本",
    "opt-ignore-cdata": "忽略 CDATA",
    "opt-ignore-doctype": "忽略 DOCTYPE",
    "opt-ignore-comment": "忽略注释",
    "opt-trim": "裁剪文本",
    "opt-native-type": "原生类型",
    "opt-always-array": "总为数组（紧凑）",
    "opt-always-children": "总含子元素（非紧凑）",
    "opt-spaces": "缩进空格"
  },
  "zh-TW": {
    "opt-compact": "精簡模式",
    "opt-ignore-declaration": "忽略宣告",
    "opt-ignore-instruction": "忽略處理指令",
    "opt-ignore-attributes": "忽略屬性",
    "opt-ignore-text": "忽略文字",
    "opt-ignore-cdata": "忽略 CDATA",
    "opt-ignore-doctype": "忽略 DOCTYPE",
    "opt-ignore-comment": "忽略註解",
    "opt-trim": "裁剪文字",
    "opt-native-type": "原生型別",
    "opt-always-array": "一律陣列（精簡）",
    "opt-always-children": "一律含子元素（非精簡）",
    "opt-spaces": "縮排空格"
  },
  "zh-HK": {
    "opt-compact": "精簡模式",
    "opt-ignore-declaration": "忽略宣告",
    "opt-ignore-instruction": "忽略處理指令",
    "opt-ignore-attributes": "忽略屬性",
    "opt-ignore-text": "忽略文字",
    "opt-ignore-cdata": "忽略 CDATA",
    "opt-ignore-doctype": "忽略 DOCTYPE",
    "opt-ignore-comment": "忽略註解",
    "opt-trim": "裁剪文字",
    "opt-native-type": "原生型別",
    "opt-always-array": "一律陣列（精簡）",
    "opt-always-children": "一律含子元素（非精簡）",
    "opt-spaces": "縮排空格"
  },
  "es": {
    "opt-compact": "Compacto",
    "opt-ignore-declaration": "Ignorar declaración",
    "opt-ignore-instruction": "Ignorar instrucción",
    "opt-ignore-attributes": "Ignorar atributos",
    "opt-ignore-text": "Ignorar texto",
    "opt-ignore-cdata": "Ignorar CDATA",
    "opt-ignore-doctype": "Ignorar DOCTYPE",
    "opt-ignore-comment": "Ignorar comentarios",
    "opt-trim": "Recortar texto",
    "opt-native-type": "Tipos nativos",
    "opt-always-array": "Siempre arreglo (compacto)",
    "opt-always-children": "Siempre hijos (no compacto)",
    "opt-spaces": "Espacios"
  },
  "fr": {
    "opt-compact": "Compact",
    "opt-ignore-declaration": "Ignorer la déclaration",
    "opt-ignore-instruction": "Ignorer l'instruction",
    "opt-ignore-attributes": "Ignorer les attributs",
    "opt-ignore-text": "Ignorer le texte",
    "opt-ignore-cdata": "Ignorer CDATA",
    "opt-ignore-doctype": "Ignorer DOCTYPE",
    "opt-ignore-comment": "Ignorer les commentaires",
    "opt-trim": "Rogner le texte",
    "opt-native-type": "Types natifs",
    "opt-always-array": "Toujours tableau (compact)",
    "opt-always-children": "Toujours enfants (non compact)",
    "opt-spaces": "Espaces"
  },
  "de": {
    "opt-compact": "Kompakt",
    "opt-ignore-declaration": "Deklaration ignorieren",
    "opt-ignore-instruction": "Anweisung ignorieren",
    "opt-ignore-attributes": "Attribute ignorieren",
    "opt-ignore-text": "Text ignorieren",
    "opt-ignore-cdata": "CDATA ignorieren",
    "opt-ignore-doctype": "DOCTYPE ignorieren",
    "opt-ignore-comment": "Kommentare ignorieren",
    "opt-trim": "Text kürzen",
    "opt-native-type": "Native Typen",
    "opt-always-array": "Immer Array (kompakt)",
    "opt-always-children": "Immer Kinder (nicht kompakt)",
    "opt-spaces": "Leerzeichen"
  },
  "it": {
    "opt-compact": "Compatto",
    "opt-ignore-declaration": "Ignora dichiarazione",
    "opt-ignore-instruction": "Ignora istruzione",
    "opt-ignore-attributes": "Ignora attributi",
    "opt-ignore-text": "Ignora testo",
    "opt-ignore-cdata": "Ignora CDATA",
    "opt-ignore-doctype": "Ignora DOCTYPE",
    "opt-ignore-comment": "Ignora commenti",
    "opt-trim": "Taglia testo",
    "opt-native-type": "Tipi nativi",
    "opt-always-array": "Sempre array (compatto)",
    "opt-always-children": "Sempre figli (non compatto)",
    "opt-spaces": "Spazi"
  },
  "ja": {
    "opt-compact": "コンパクト",
    "opt-ignore-declaration": "宣言を無視",
    "opt-ignore-instruction": "命令を無視",
    "opt-ignore-attributes": "属性を無視",
    "opt-ignore-text": "テキストを無視",
    "opt-ignore-cdata": "CDATAを無視",
    "opt-ignore-doctype": "DOCTYPEを無視",
    "opt-ignore-comment": "コメントを無視",
    "opt-trim": "テキストのトリム",
    "opt-native-type": "ネイティブ型",
    "opt-always-array": "常に配列（コンパクト）",
    "opt-always-children": "常に子要素（非コンパクト）",
    "opt-spaces": "スペース"
  },
  "ko": {
    "opt-compact": "컴팩트",
    "opt-ignore-declaration": "선언 무시",
    "opt-ignore-instruction": "지시문 무시",
    "opt-ignore-attributes": "속성 무시",
    "opt-ignore-text": "텍스트 무시",
    "opt-ignore-cdata": "CDATA 무시",
    "opt-ignore-doctype": "DOCTYPE 무시",
    "opt-ignore-comment": "주석 무시",
    "opt-trim": "텍스트 다듬기",
    "opt-native-type": "네이티브 타입",
    "opt-always-array": "항상 배열(컴팩트)",
    "opt-always-children": "항상 자식(비컴팩트)",
    "opt-spaces": "공백"
  },
  "ru": {
    "opt-compact": "Компактный",
    "opt-ignore-declaration": "Игнорировать декларацию",
    "opt-ignore-instruction": "Игнорировать инструкцию",
    "opt-ignore-attributes": "Игнорировать атрибуты",
    "opt-ignore-text": "Игнорировать текст",
    "opt-ignore-cdata": "Игнорировать CDATA",
    "opt-ignore-doctype": "Игнорировать DOCTYPE",
    "opt-ignore-comment": "Игнорировать комментарии",
    "opt-trim": "Обрезать текст",
    "opt-native-type": "Нативные типы",
    "opt-always-array": "Всегда массив (компакт)",
    "opt-always-children": "Всегда дети (некомпакт)",
    "opt-spaces": "Пробелы"
  },
  "pt": {
    "opt-compact": "Compacto",
    "opt-ignore-declaration": "Ignorar declaração",
    "opt-ignore-instruction": "Ignorar instrução",
    "opt-ignore-attributes": "Ignorar atributos",
    "opt-ignore-text": "Ignorar texto",
    "opt-ignore-cdata": "Ignorar CDATA",
    "opt-ignore-doctype": "Ignorar DOCTYPE",
    "opt-ignore-comment": "Ignorar comentários",
    "opt-trim": "Aparar texto",
    "opt-native-type": "Tipos nativos",
    "opt-always-array": "Sempre array (compacto)",
    "opt-always-children": "Sempre filhos (não compacto)",
    "opt-spaces": "Espaços"
  },
  "ar": {
    "opt-compact": "مضغوط",
    "opt-ignore-declaration": "تجاهل التصريح",
    "opt-ignore-instruction": "تجاهل التعليمة",
    "opt-ignore-attributes": "تجاهل السمات",
    "opt-ignore-text": "تجاهل النص",
    "opt-ignore-cdata": "تجاهل CDATA",
    "opt-ignore-doctype": "تجاهل DOCTYPE",
    "opt-ignore-comment": "تجاهل التعليقات",
    "opt-trim": "اقتطاع النص",
    "opt-native-type": "أنواع أصلية",
    "opt-always-array": "دائماً مصفوفة (مضغوط)",
    "opt-always-children": "دائماً أبناء (غير مضغوط)",
    "opt-spaces": "مسافات"
  },
  "hi": {
    "opt-compact": "कम्पैक्ट",
    "opt-ignore-declaration": "घोषणा अनदेखी",
    "opt-ignore-instruction": "निर्देश अनदेखी",
    "opt-ignore-attributes": "एट्रिब्यूट्स अनदेखी",
    "opt-ignore-text": "टेक्स्ट अनदेखी",
    "opt-ignore-cdata": "CDATA अनदेखी",
    "opt-ignore-doctype": "DOCTYPE अनदेखी",
    "opt-ignore-comment": "टिप्पणी अनदेखी",
    "opt-trim": "टेक्स्ट ट्रिम",
    "opt-native-type": "नेटिव प्रकार",
    "opt-always-array": "हमेशा एरे (कम्पैक्ट)",
    "opt-always-children": "हमेशा चाइल्ड्रन (नॉन-कम्पैक्ट)",
    "opt-spaces": "स्पेसेज़"
  },
  "tr": {
    "opt-compact": "Kompakt",
    "opt-ignore-declaration": "Bildirimi yok say",
    "opt-ignore-instruction": "Talimatı yok say",
    "opt-ignore-attributes": "Öznitelikleri yok say",
    "opt-ignore-text": "Metni yok say",
    "opt-ignore-cdata": "CDATA'yı yok say",
    "opt-ignore-doctype": "DOCTYPE'u yok say",
    "opt-ignore-comment": "Yorumları yok say",
    "opt-trim": "Metni kırp",
    "opt-native-type": "Yerel türler",
    "opt-always-array": "Her zaman dizi (kompakt)",
    "opt-always-children": "Her zaman çocuklar (kompakt değil)",
    "opt-spaces": "Boşluk"
  },
  "nl": {
    "opt-compact": "Compact",
    "opt-ignore-declaration": "Declaratie negeren",
    "opt-ignore-instruction": "Instructie negeren",
    "opt-ignore-attributes": "Attributen negeren",
    "opt-ignore-text": "Tekst negeren",
    "opt-ignore-cdata": "CDATA negeren",
    "opt-ignore-doctype": "DOCTYPE negeren",
    "opt-ignore-comment": "Reacties negeren",
    "opt-trim": "Tekst inkorten",
    "opt-native-type": "Natieve typen",
    "opt-always-array": "Altijd array (compact)",
    "opt-always-children": "Altijd children (niet-compact)",
    "opt-spaces": "Spaties"
  },
  "sv": {
    "opt-compact": "Kompakt",
    "opt-ignore-declaration": "Ignorera deklaration",
    "opt-ignore-instruction": "Ignorera instruktion",
    "opt-ignore-attributes": "Ignorera attribut",
    "opt-ignore-text": "Ignorera text",
    "opt-ignore-cdata": "Ignorera CDATA",
    "opt-ignore-doctype": "Ignorera DOCTYPE",
    "opt-ignore-comment": "Ignorera kommentarer",
    "opt-trim": "Trimma text",
    "opt-native-type": "Inbyggda typer",
    "opt-always-array": "Alltid array (kompakt)",
    "opt-always-children": "Alltid barn (ej kompakt)",
    "opt-spaces": "Blanksteg"
  },
  "pl": {
    "opt-compact": "Kompaktowy",
    "opt-ignore-declaration": "Ignoruj deklarację",
    "opt-ignore-instruction": "Ignoruj instrukcję",
    "opt-ignore-attributes": "Ignoruj atrybuty",
    "opt-ignore-text": "Ignoruj tekst",
    "opt-ignore-cdata": "Ignoruj CDATA",
    "opt-ignore-doctype": "Ignoruj DOCTYPE",
    "opt-ignore-comment": "Ignoruj komentarze",
    "opt-trim": "Przytnij tekst",
    "opt-native-type": "Typy natywne",
    "opt-always-array": "Zawsze tablica (kompakt)",
    "opt-always-children": "Zawsze dzieci (niekompakt)",
    "opt-spaces": "Spacje"
  },
  "vi": {
    "opt-compact": "Gọn",
    "opt-ignore-declaration": "Bỏ qua khai báo",
    "opt-ignore-instruction": "Bỏ qua chỉ thị",
    "opt-ignore-attributes": "Bỏ qua thuộc tính",
    "opt-ignore-text": "Bỏ qua văn bản",
    "opt-ignore-cdata": "Bỏ qua CDATA",
    "opt-ignore-doctype": "Bỏ qua DOCTYPE",
    "opt-ignore-comment": "Bỏ qua nhận xét",
    "opt-trim": "Cắt gọn văn bản",
    "opt-native-type": "Kiểu nguyên bản",
    "opt-always-array": "Luôn mảng (gọn)",
    "opt-always-children": "Luôn có con (không gọn)",
    "opt-spaces": "Khoảng trắng"
  },
  "th": {
    "opt-compact": "กระชับ",
    "opt-ignore-declaration": "ละเว้นประกาศ",
    "opt-ignore-instruction": "ละเว้นคำสั่ง",
    "opt-ignore-attributes": "ละเว้นแอตทริบิวต์",
    "opt-ignore-text": "ละเว้นข้อความ",
    "opt-ignore-cdata": "ละเว้น CDATA",
    "opt-ignore-doctype": "ละเว้น DOCTYPE",
    "opt-ignore-comment": "ละเว้นความคิดเห็น",
    "opt-trim": "ตัดแต่งข้อความ",
    "opt-native-type": "ชนิดเนทีฟ",
    "opt-always-array": "เป็นอาเรย์เสมอ (กระชับ)",
    "opt-always-children": "มีลูกเสมอ (ไม่กระชับ)",
    "opt-spaces": "ช่องว่าง"
  },
  "id": {
    "opt-compact": "Ringkas",
    "opt-ignore-declaration": "Abaikan deklarasi",
    "opt-ignore-instruction": "Abaikan instruksi",
    "opt-ignore-attributes": "Abaikan atribut",
    "opt-ignore-text": "Abaikan teks",
    "opt-ignore-cdata": "Abaikan CDATA",
    "opt-ignore-doctype": "Abaikan DOCTYPE",
    "opt-ignore-comment": "Abaikan komentar",
    "opt-trim": "Pangkas teks",
    "opt-native-type": "Tipe native",
    "opt-always-array": "Selalu array (ringkas)",
    "opt-always-children": "Selalu anak (tidak ringkas)",
    "opt-spaces": "Spasi"
  },
  "he": {
    "opt-compact": "קומפקטי",
    "opt-ignore-declaration": "התעלם מהצהרה",
    "opt-ignore-instruction": "התעלם מהוראה",
    "opt-ignore-attributes": "התעלם ממאפיינים",
    "opt-ignore-text": "התעלם מטקסט",
    "opt-ignore-cdata": "התעלם מ‑CDATA",
    "opt-ignore-doctype": "התעלם מ‑DOCTYPE",
    "opt-ignore-comment": "התעלם מהערות",
    "opt-trim": "קיצוץ טקסט",
    "opt-native-type": "סוגים מקוריים",
    "opt-always-array": "תמיד מערך (קומפקטי)",
    "opt-always-children": "תמיד ילדים (לא קומפקטי)",
    "opt-spaces": "רווחים"
  },
  "ms": {
    "opt-compact": "Padat",
    "opt-ignore-declaration": "Abaikan deklarasi",
    "opt-ignore-instruction": "Abaikan arahan",
    "opt-ignore-attributes": "Abaikan atribut",
    "opt-ignore-text": "Abaikan teks",
    "opt-ignore-cdata": "Abaikan CDATA",
    "opt-ignore-doctype": "Abaikan DOCTYPE",
    "opt-ignore-comment": "Abaikan komen",
    "opt-trim": "Potong teks",
    "opt-native-type": "Jenis asli",
    "opt-always-array": "Sentiasa array (padat)",
    "opt-always-children": "Sentiasa anak (tidak padat)",
    "opt-spaces": "Ruang"
  },
  "no": {
    "opt-compact": "Kompakt",
    "opt-ignore-declaration": "Ignorer deklarasjon",
    "opt-ignore-instruction": "Ignorer instruksjon",
    "opt-ignore-attributes": "Ignorer attributter",
    "opt-ignore-text": "Ignorer tekst",
    "opt-ignore-cdata": "Ignorer CDATA",
    "opt-ignore-doctype": "Ignorer DOCTYPE",
    "opt-ignore-comment": "Ignorer kommentarer",
    "opt-trim": "Trim tekst",
    "opt-native-type": "Native typer",
    "opt-always-array": "Alltid array (kompakt)",
    "opt-always-children": "Alltid children (ikke-kompakt)",
    "opt-spaces": "Mellomrom"
  }
}
</i18n>
