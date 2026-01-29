<template>
  <n-grid-item span="1 s:2 m:3 l:5">
    <n-form-item :label="t('path')">
      <n-input v-model:value="path" :placeholder="t('path-placeholder')" />
    </n-form-item>
  </n-grid-item>

  <n-grid-item span="1 s:2 m:3 l:4">
    <n-form-item :label="t('query-params')">
      <n-input v-model:value="queryString" :placeholder="t('query-params-placeholder')" />
    </n-form-item>
  </n-grid-item>

  <n-grid-item span="1 s:2 m:3 l:4">
    <n-form-item :label="t('hash')">
      <n-input v-model:value="hash" :placeholder="t('hash-placeholder')" />
    </n-form-item>
  </n-grid-item>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { NFormItem, NGridItem, NInput } from 'naive-ui'

const path = defineModel<string>('path', { required: true })
const queryString = defineModel<string>('queryString', { required: true })
const hash = defineModel<string>('hash', { required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "path": "Path",
    "path-placeholder": "/path/to/resource",
    "query-params": "Query Parameters",
    "query-params-placeholder": "param1=value1&param2=value2",
    "hash": "Hash/Fragment",
    "hash-placeholder": "section1, anchor, etc."
  },
  "zh": {
    "path": "路径",
    "path-placeholder": "/path/to/resource",
    "query-params": "查询参数",
    "query-params-placeholder": "param1=value1&param2=value2",
    "hash": "哈希/片段",
    "hash-placeholder": "section1, anchor 等"
  },
  "zh-CN": {
    "path": "路径",
    "path-placeholder": "/path/to/resource",
    "query-params": "查询参数",
    "query-params-placeholder": "param1=value1&param2=value2",
    "hash": "哈希/片段",
    "hash-placeholder": "section1, anchor 等"
  },
  "zh-TW": {
    "path": "路徑",
    "path-placeholder": "/path/to/resource",
    "query-params": "查詢參數",
    "query-params-placeholder": "param1=value1&param2=value2",
    "hash": "雜湊/片段",
    "hash-placeholder": "section1, anchor 等"
  },
  "zh-HK": {
    "path": "路徑",
    "path-placeholder": "/path/to/resource",
    "query-params": "查詢參數",
    "query-params-placeholder": "param1=value1&param2=value2",
    "hash": "雜湊/片段",
    "hash-placeholder": "section1, anchor 等"
  },
  "es": {
    "path": "Ruta",
    "path-placeholder": "/ruta/al/recurso",
    "query-params": "Parámetros de consulta",
    "query-params-placeholder": "param1=valor1&param2=valor2",
    "hash": "Hash/Fragmento",
    "hash-placeholder": "seccion1, anchor, etc."
  },
  "fr": {
    "path": "Chemin",
    "path-placeholder": "/chemin/vers/ressource",
    "query-params": "Paramètres de requête",
    "query-params-placeholder": "param1=valeur1&param2=valeur2",
    "hash": "Hash/Fragment",
    "hash-placeholder": "section1, anchor, etc."
  },
  "de": {
    "path": "Pfad",
    "path-placeholder": "/pfad/zur/ressource",
    "query-params": "Abfrageparameter",
    "query-params-placeholder": "param1=wert1&param2=wert2",
    "hash": "Hash/Fragment",
    "hash-placeholder": "sektion1, anchor, etc."
  },
  "it": {
    "path": "Percorso",
    "path-placeholder": "/percorso/alla/risorsa",
    "query-params": "Parametri di query",
    "query-params-placeholder": "param1=valore1&param2=valore2",
    "hash": "Hash/Frammento",
    "hash-placeholder": "sezione1, anchor, etc."
  },
  "ja": {
    "path": "パス",
    "path-placeholder": "/path/to/resource",
    "query-params": "クエリパラメータ",
    "query-params-placeholder": "param1=value1&param2=value2",
    "hash": "ハッシュ/フラグメント",
    "hash-placeholder": "section1, anchor など"
  },
  "ko": {
    "path": "경로",
    "path-placeholder": "/path/to/resource",
    "query-params": "쿼리 매개변수",
    "query-params-placeholder": "param1=value1&param2=value2",
    "hash": "해시/프래그먼트",
    "hash-placeholder": "section1, anchor 등"
  },
  "ru": {
    "path": "Путь",
    "path-placeholder": "/путь/к/ресурсу",
    "query-params": "Параметры запроса",
    "query-params-placeholder": "param1=значение1&param2=значение2",
    "hash": "Хеш/Фрагмент",
    "hash-placeholder": "раздел1, якорь и т.д."
  },
  "pt": {
    "path": "Caminho",
    "path-placeholder": "/caminho/para/recurso",
    "query-params": "Parâmetros de consulta",
    "query-params-placeholder": "param1=valor1&param2=valor2",
    "hash": "Hash/Fragmento",
    "hash-placeholder": "secao1, anchor, etc."
  },
  "ar": {
    "path": "المسار",
    "path-placeholder": "/مسار/إلى/المورد",
    "query-params": "معاملات الاستعلام",
    "query-params-placeholder": "param1=value1&param2=value2",
    "hash": "التجزئة/الجزء",
    "hash-placeholder": "قسم1، مرساة إلخ"
  },
  "hi": {
    "path": "पथ",
    "path-placeholder": "/संसाधन/का/पथ",
    "query-params": "क्वेरी पैरामीटर",
    "query-params-placeholder": "param1=value1&param2=value2",
    "hash": "हैश/खंड",
    "hash-placeholder": "अनुभाग1, एंकर आदि"
  },
  "tr": {
    "path": "Yol",
    "path-placeholder": "/kaynak/yolu",
    "query-params": "Sorgu parametreleri",
    "query-params-placeholder": "param1=değer1&param2=değer2",
    "hash": "Hash/Parça",
    "hash-placeholder": "bölüm1, çapa vb."
  },
  "nl": {
    "path": "Pad",
    "path-placeholder": "/pad/naar/bron",
    "query-params": "Query-parameters",
    "query-params-placeholder": "param1=waarde1&param2=waarde2",
    "hash": "Hash/Fragment",
    "hash-placeholder": "sectie1, anker, enz."
  },
  "sv": {
    "path": "Sökväg",
    "path-placeholder": "/sökväg/till/resurs",
    "query-params": "Frågeparametrar",
    "query-params-placeholder": "param1=värde1&param2=värde2",
    "hash": "Hash/Fragment",
    "hash-placeholder": "avsnitt1, ankare, etc."
  },
  "pl": {
    "path": "Ścieżka",
    "path-placeholder": "/ścieżka/do/zasobu",
    "query-params": "Parametry zapytania",
    "query-params-placeholder": "param1=wartość1&param2=wartość2",
    "hash": "Hash/Fragment",
    "hash-placeholder": "sekcja1, kotwica itp."
  },
  "vi": {
    "path": "Đường dẫn",
    "path-placeholder": "/đường/dẫn/tới/tài/nguyên",
    "query-params": "Tham số truy vấn",
    "query-params-placeholder": "param1=giá_trị1&param2=giá_trị2",
    "hash": "Hash/Phân đoạn",
    "hash-placeholder": "phần1, neo, v.v."
  },
  "th": {
    "path": "เส้นทาง",
    "path-placeholder": "/เส้นทาง/ไปยัง/ทรัพยากร",
    "query-params": "พารามิเตอร์คิวรี",
    "query-params-placeholder": "param1=value1&param2=value2",
    "hash": "แฮช/ส่วนย่อย",
    "hash-placeholder": "ส่วน1, สมอ ฯลฯ"
  },
  "id": {
    "path": "Jalur",
    "path-placeholder": "/jalur/ke/sumber",
    "query-params": "Parameter kueri",
    "query-params-placeholder": "param1=nilai1&param2=nilai2",
    "hash": "Hash/Fragmen",
    "hash-placeholder": "bagian1, jangkar, dll."
  },
  "he": {
    "path": "נתיב",
    "path-placeholder": "/נתיב/למשאב",
    "query-params": "פרמטרי שאילתה",
    "query-params-placeholder": "param1=value1&param2=value2",
    "hash": "Hash/קטע",
    "hash-placeholder": "קטע1, עוגן וכו'"
  },
  "ms": {
    "path": "Laluan",
    "path-placeholder": "/laluan/ke/sumber",
    "query-params": "Parameter pertanyaan",
    "query-params-placeholder": "param1=nilai1&param2=nilai2",
    "hash": "Hash/Serpihan",
    "hash-placeholder": "bahagian1, sauh, dll."
  },
  "no": {
    "path": "Sti",
    "path-placeholder": "/sti/til/ressurs",
    "query-params": "Spørringsparametere",
    "query-params-placeholder": "param1=verdi1&param2=verdi2",
    "hash": "Hash/Fragment",
    "hash-placeholder": "seksjon1, anker, etc."
  }
}
</i18n>
