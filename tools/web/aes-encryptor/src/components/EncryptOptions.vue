<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('options') }}</ToolSectionHeader>
    <n-grid :cols="4" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('outputMode')">
        <n-radio-group v-model:value="outputMode" name="output-mode">
          <n-space vertical :size="4">
            <n-radio value="jwe" :disabled="mode === 'CTR'">
              JWE
              <n-text depth="3" style="font-size: 12px">({{ t('recommended') }})</n-text>
            </n-radio>
            <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
            <n-radio value="raw">Raw</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item-gi>
      <n-form-item-gi :label="t('mode')">
        <n-radio-group v-model:value="mode" name="mode">
          <n-space vertical :size="4">
            <n-radio value="GCM">GCM</n-radio>
            <n-radio value="CBC" :disabled="outputMode === 'jwe' && keyType === 'raw'">
              CBC
            </n-radio>
            <n-radio value="CTR">CTR</n-radio>
          </n-space>
        </n-radio-group>
        <template v-if="mode === 'CTR'" #feedback>
          <n-text type="warning" style="font-size: 12px">{{ t('ctrWarning') }}</n-text>
        </template>
      </n-form-item-gi>
      <n-form-item-gi :label="t('keyLength')">
        <n-radio-group v-model:value="keyLength" name="key-length">
          <n-space vertical :size="4">
            <n-radio :value="128">128-bit</n-radio>
            <n-radio :value="192">192-bit</n-radio>
            <n-radio :value="256">256-bit</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item-gi>
      <n-form-item-gi v-if="outputMode === 'raw'" :label="t('outputFormat')">
        <n-radio-group v-model:value="outputFormat" name="output-format">
          <n-space vertical :size="4">
            <n-radio value="base64">Base64</n-radio>
            <n-radio value="hex">Hex</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { NGrid, NFormItemGi, NRadioGroup, NRadio, NSpace, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { AesMode, KeyLength, KeyType, OutputFormat, OutputMode } from '@utils/aes'

defineProps<{
  keyType: KeyType
}>()

const outputMode = defineModel<OutputMode>('outputMode', { required: true })
const mode = defineModel<AesMode>('mode', { required: true })
const keyLength = defineModel<KeyLength>('keyLength', { required: true })
const outputFormat = defineModel<OutputFormat>('outputFormat', { required: true })

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "options": "Options",
    "outputMode": "Output Format",
    "recommended": "recommended",
    "mode": "Mode",
    "keyLength": "Key Length",
    "outputFormat": "Encoding",
    "ctrWarning": "CTR mode has no authentication - data can be tampered"
  },
  "zh": {
    "options": "选项",
    "outputMode": "输出模式",
    "recommended": "推荐",
    "mode": "模式",
    "keyLength": "密钥长度",
    "outputFormat": "编码",
    "ctrWarning": "CTR 模式无认证 - 数据可能被篡改"
  },
  "zh-CN": {
    "options": "选项",
    "outputMode": "输出模式",
    "recommended": "推荐",
    "mode": "模式",
    "keyLength": "密钥长度",
    "outputFormat": "编码",
    "ctrWarning": "CTR 模式无认证 - 数据可能被篡改"
  },
  "zh-TW": {
    "options": "選項",
    "outputMode": "輸出模式",
    "recommended": "推薦",
    "mode": "模式",
    "keyLength": "密鑰長度",
    "outputFormat": "編碼",
    "ctrWarning": "CTR 模式無認證 - 數據可能被篡改"
  },
  "zh-HK": {
    "options": "選項",
    "outputMode": "輸出模式",
    "recommended": "推薦",
    "mode": "模式",
    "keyLength": "密鑰長度",
    "outputFormat": "編碼",
    "ctrWarning": "CTR 模式無認證 - 數據可能被篡改"
  },
  "es": {
    "options": "Opciones",
    "outputMode": "Modo de salida",
    "recommended": "recomendado",
    "mode": "Modo",
    "keyLength": "Longitud de la clave",
    "outputFormat": "Codificación",
    "ctrWarning": "El modo CTR no tiene autenticación - los datos pueden ser manipulados"
  },
  "fr": {
    "options": "Options",
    "outputMode": "Mode de sortie",
    "recommended": "recommandé",
    "mode": "Mode",
    "keyLength": "Longueur de la clé",
    "outputFormat": "Encodage",
    "ctrWarning": "Le mode CTR n'offre pas d'authentification - les données peuvent être altérées"
  },
  "de": {
    "options": "Optionen",
    "outputMode": "Ausgabemodus",
    "recommended": "empfohlen",
    "mode": "Modus",
    "keyLength": "Schlüssellänge",
    "outputFormat": "Kodierung",
    "ctrWarning": "Im CTR-Modus gibt es keine Authentifizierung - Daten können manipuliert werden"
  },
  "it": {
    "options": "Opzioni",
    "outputMode": "Modalità di uscita",
    "recommended": "consigliato",
    "mode": "Modalità",
    "keyLength": "Lunghezza chiave",
    "outputFormat": "Codifica",
    "ctrWarning": "La modalità CTR non ha autenticazione - i dati possono essere manomessi"
  },
  "ja": {
    "options": "オプション",
    "outputMode": "出力モード",
    "recommended": "推奨",
    "mode": "モード",
    "keyLength": "キー長",
    "outputFormat": "エンコーディング",
    "ctrWarning": "CTR モードには認証がありません - データが改ざんされる可能性があります"
  },
  "ko": {
    "options": "옵션",
    "outputMode": "출력 모드",
    "recommended": "추천",
    "mode": "모드",
    "keyLength": "키 길이",
    "outputFormat": "인코딩",
    "ctrWarning": "CTR 모드는 인증이 없습니다 - 데이터가 변조될 수 있습니다"
  },
  "ru": {
    "options": "Опции",
    "outputMode": "Режим вывода",
    "recommended": "рекомендуется",
    "mode": "Режим",
    "keyLength": "Длина ключа",
    "outputFormat": "Кодирование",
    "ctrWarning": "В режиме CTR нет аутентификации - данные могут быть подделаны"
  },
  "pt": {
    "options": "Opções",
    "outputMode": "Modo de saída",
    "recommended": "recomendado",
    "mode": "Modo",
    "keyLength": "Comprimento da chave",
    "outputFormat": "Codificação",
    "ctrWarning": "O modo CTR não tem autenticação - os dados podem ser adulterados"
  },
  "ar": {
    "options": "خيارات",
    "outputMode": "وضع الإخراج",
    "recommended": "موصى به",
    "mode": "الوضع",
    "keyLength": "طول المفتاح",
    "outputFormat": "الترميز",
    "ctrWarning": "وضع CTR بلا مصادقة - يمكن العبث بالبيانات"
  },
  "hi": {
    "options": "विकल्प",
    "outputMode": "आउटपुट मोड",
    "recommended": "अनुशंसित",
    "mode": "मोड",
    "keyLength": "कुंजी की लंबाई",
    "outputFormat": "एन्कोडिंग",
    "ctrWarning": "CTR मोड में प्रमाणीकरण नहीं है - डेटा से छेड़छाड़ हो सकती है"
  },
  "tr": {
    "options": "Seçenekler",
    "outputMode": "Çıkış modu",
    "recommended": "önerilen",
    "mode": "Mod",
    "keyLength": "Anahtar uzunluğu",
    "outputFormat": "Kodlama",
    "ctrWarning": "CTR modunda kimlik doğrulama yok - verilerle oynanabilir"
  },
  "nl": {
    "options": "Opties",
    "outputMode": "Uitvoermodus",
    "recommended": "aanbevolen",
    "mode": "Modus",
    "keyLength": "Sleutellengte",
    "outputFormat": "Codering",
    "ctrWarning": "CTR-modus heeft geen authenticatie - gegevens kunnen worden gemanipuleerd"
  },
  "sv": {
    "options": "Alternativ",
    "outputMode": "Utdataläge",
    "recommended": "rekommenderas",
    "mode": "Läge",
    "keyLength": "Nyckellängd",
    "outputFormat": "Kodning",
    "ctrWarning": "CTR-läget saknar autentisering - data kan manipuleras"
  },
  "pl": {
    "options": "Opcje",
    "outputMode": "Tryb wyjścia",
    "recommended": "zalecane",
    "mode": "Tryb",
    "keyLength": "Długość klucza",
    "outputFormat": "Kodowanie",
    "ctrWarning": "Tryb CTR nie ma uwierzytelniania - dane mogą zostać zmienione"
  },
  "vi": {
    "options": "Tùy chọn",
    "outputMode": "Chế độ đầu ra",
    "recommended": "khuyến nghị",
    "mode": "Chế độ",
    "keyLength": "Độ dài khóa",
    "outputFormat": "Mã hóa",
    "ctrWarning": "Chế độ CTR không có xác thực - dữ liệu có thể bị sửa"
  },
  "th": {
    "options": "ตัวเลือก",
    "outputMode": "โหมดเอาต์พุต",
    "recommended": "แนะนำ",
    "mode": "โหมด",
    "keyLength": "ความยาวคีย์",
    "outputFormat": "การเข้ารหัส",
    "ctrWarning": "โหมด CTR ไม่มีการยืนยันตัวตน - ข้อมูลอาจถูกแก้ไขได้"
  },
  "id": {
    "options": "Opsi",
    "outputMode": "Mode keluaran",
    "recommended": "direkomendasikan",
    "mode": "Mode",
    "keyLength": "Panjang kunci",
    "outputFormat": "Pengodean",
    "ctrWarning": "Mode CTR tidak memiliki autentikasi - data bisa dimanipulasi"
  },
  "he": {
    "options": "אפשרויות",
    "outputMode": "מצב פלט",
    "recommended": "מומלץ",
    "mode": "מצב",
    "keyLength": "אורך מפתח",
    "outputFormat": "קידוד",
    "ctrWarning": "במצב CTR אין אימות - ניתן לשנות את הנתונים"
  },
  "ms": {
    "options": "Pilihan",
    "outputMode": "Mod keluaran",
    "recommended": "disyorkan",
    "mode": "Mod",
    "keyLength": "Panjang kunci",
    "outputFormat": "Pengekodan",
    "ctrWarning": "Mod CTR tiada pengesahan - data boleh diubah suai"
  },
  "no": {
    "options": "Alternativer",
    "outputMode": "Utdatamodus",
    "recommended": "anbefalt",
    "mode": "Modus",
    "keyLength": "Nøkkellengde",
    "outputFormat": "Koding",
    "ctrWarning": "CTR-modus har ingen autentisering - data kan manipuleres"
  }
}
</i18n>
