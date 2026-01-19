<template>
  <ToolSection>
    <n-collapse>
      <n-collapse-item :title="t('advancedOptions')" name="advanced">
        <n-grid :cols="2" :x-gap="12" :y-gap="12">
          <n-form-item-gi v-if="keyType === 'password'" :label="t('pbkdf2Iterations')">
            <n-input-number
              :value="pbkdf2Iterations"
              :min="1000"
              :max="10000000"
              :step="10000"
              :status="pbkdf2Iterations < 10000 ? 'warning' : undefined"
              style="width: 100%"
              @update:value="$event !== null && $emit('update:pbkdf2Iterations', $event)"
            />
            <template v-if="pbkdf2Iterations < 10000" #feedback>
              <n-text type="warning" style="font-size: 12px">{{
                t('lowIterationsWarning')
              }}</n-text>
            </template>
          </n-form-item-gi>
          <n-form-item-gi v-if="keyType === 'password'" :label="t('pbkdf2Hash')">
            <n-select
              :value="pbkdf2Hash"
              :options="pbkdf2HashOptions"
              :disabled="outputMode === 'jwe'"
              @update:value="$emit('update:pbkdf2Hash', $event)"
            />
            <template v-if="outputMode === 'jwe'" #feedback>
              {{ t('jweHashNote') }}
            </template>
          </n-form-item-gi>
          <n-form-item-gi v-if="outputMode === 'raw'" label="Salt">
            <n-space vertical :size="8">
              <n-radio-group
                :value="saltMode"
                name="salt-mode"
                @update:value="$emit('update:saltMode', $event)"
              >
                <n-radio value="auto">{{ t('autoGenerate') }}</n-radio>
                <n-radio value="manual">{{ t('manual') }}</n-radio>
              </n-radio-group>
              <n-input
                v-if="saltMode === 'manual'"
                :value="manualSalt"
                :placeholder="t('saltPlaceholder')"
                style="font-family: monospace"
                @update:value="$emit('update:manualSalt', $event)"
              />
            </n-space>
          </n-form-item-gi>
          <n-form-item-gi v-if="outputMode === 'raw'" label="IV">
            <n-space vertical :size="8">
              <n-radio-group
                :value="ivMode"
                name="iv-mode"
                @update:value="$emit('update:ivMode', $event)"
              >
                <n-radio value="auto">{{ t('autoGenerate') }}</n-radio>
                <n-radio value="manual">{{ t('manual') }}</n-radio>
              </n-radio-group>
              <n-input
                v-if="ivMode === 'manual'"
                :value="manualIv"
                :placeholder="t('ivPlaceholder', { length: ivLength * 2 })"
                style="font-family: monospace"
                @update:value="$emit('update:manualIv', $event)"
              />
            </n-space>
          </n-form-item-gi>
        </n-grid>
      </n-collapse-item>
    </n-collapse>
  </ToolSection>
</template>

<script setup lang="ts">
import {
  NGrid,
  NFormItemGi,
  NCollapse,
  NCollapseItem,
  NInputNumber,
  NSelect,
  NRadioGroup,
  NRadio,
  NInput,
  NSpace,
  NText,
} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import type { KeyType, OutputMode, Pbkdf2Hash } from '@utils/aes'

defineProps<{
  keyType: KeyType
  outputMode: OutputMode
  ivLength: number
  pbkdf2Iterations: number
  pbkdf2Hash: Pbkdf2Hash
  saltMode: 'auto' | 'manual'
  manualSalt: string
  ivMode: 'auto' | 'manual'
  manualIv: string
}>()

defineEmits<{
  'update:pbkdf2Iterations': [value: number]
  'update:pbkdf2Hash': [value: Pbkdf2Hash]
  'update:saltMode': [value: 'auto' | 'manual']
  'update:manualSalt': [value: string]
  'update:ivMode': [value: 'auto' | 'manual']
  'update:manualIv': [value: string]
}>()

const { t } = useI18n()

const pbkdf2HashOptions = [
  { label: 'SHA-1', value: 'SHA-1' },
  { label: 'SHA-256', value: 'SHA-256' },
  { label: 'SHA-384', value: 'SHA-384' },
  { label: 'SHA-512', value: 'SHA-512' },
] satisfies Array<{ label: string; value: Pbkdf2Hash }>
</script>

<i18n lang="json">
{
  "en": {
    "advancedOptions": "Advanced Options",
    "pbkdf2Iterations": "PBKDF2 Iterations",
    "pbkdf2Hash": "PBKDF2 Hash",
    "jweHashNote": "JWE uses hash based on key length",
    "lowIterationsWarning": "Too low - recommend at least 100,000",
    "autoGenerate": "Auto generate",
    "manual": "Manual",
    "saltPlaceholder": "32 hex characters",
    "ivPlaceholder": "{length} hex characters"
  },
  "zh": {
    "advancedOptions": "高级选项",
    "pbkdf2Iterations": "PBKDF2 迭代次数",
    "pbkdf2Hash": "PBKDF2 哈希",
    "jweHashNote": "JWE 会根据密钥长度选择哈希",
    "lowIterationsWarning": "迭代次数过低 - 建议至少 100,000",
    "autoGenerate": "自动生成",
    "manual": "手动输入",
    "saltPlaceholder": "32 个十六进制字符",
    "ivPlaceholder": "{length} 个十六进制字符"
  },
  "zh-CN": {
    "advancedOptions": "高级选项",
    "pbkdf2Iterations": "PBKDF2 迭代次数",
    "pbkdf2Hash": "PBKDF2 哈希",
    "jweHashNote": "JWE 会根据密钥长度选择哈希",
    "lowIterationsWarning": "迭代次数过低 - 建议至少 100,000",
    "autoGenerate": "自动生成",
    "manual": "手动输入",
    "saltPlaceholder": "32 个十六进制字符",
    "ivPlaceholder": "{length} 个十六进制字符"
  },
  "zh-TW": {
    "advancedOptions": "高級選項",
    "pbkdf2Iterations": "PBKDF2 迭代次數",
    "pbkdf2Hash": "PBKDF2 哈希",
    "jweHashNote": "JWE 會依密鑰長度選擇哈希",
    "lowIterationsWarning": "迭代次數過低 - 建議至少 100,000",
    "autoGenerate": "自動生成",
    "manual": "手動",
    "saltPlaceholder": "32 個十六進位字元",
    "ivPlaceholder": "{length} 個十六進位字元"
  },
  "zh-HK": {
    "advancedOptions": "高級選項",
    "pbkdf2Iterations": "PBKDF2 迭代次數",
    "pbkdf2Hash": "PBKDF2 哈希",
    "jweHashNote": "JWE 會依密鑰長度選擇哈希",
    "lowIterationsWarning": "迭代次數過低 - 建議至少 100,000",
    "autoGenerate": "自動生成",
    "manual": "手動",
    "saltPlaceholder": "32 個十六進位字元",
    "ivPlaceholder": "{length} 個十六進位字元"
  },
  "es": {
    "advancedOptions": "Opciones avanzadas",
    "pbkdf2Iterations": "Iteraciones de PBKDF2",
    "pbkdf2Hash": "Hash de PBKDF2",
    "jweHashNote": "JWE usa el hash según la longitud de la clave",
    "lowIterationsWarning": "Demasiado bajo - se recomienda al menos 100,000",
    "autoGenerate": "Generar automáticamente",
    "manual": "Manual",
    "saltPlaceholder": "32 caracteres hexadecimales",
    "ivPlaceholder": "{length} caracteres hexadecimales"
  },
  "fr": {
    "advancedOptions": "Options avancées",
    "pbkdf2Iterations": "Itérations PBKDF2",
    "pbkdf2Hash": "Hachage PBKDF2",
    "jweHashNote": "JWE utilise un hachage selon la longueur de la clé",
    "lowIterationsWarning": "Trop faible - au moins 100,000 recommandé",
    "autoGenerate": "Génération automatique",
    "manual": "Manuel",
    "saltPlaceholder": "32 caractères hexadécimaux",
    "ivPlaceholder": "{length} caractères hexadécimaux"
  },
  "de": {
    "advancedOptions": "Erweiterte Optionen",
    "pbkdf2Iterations": "PBKDF2-Iterationen",
    "pbkdf2Hash": "PBKDF2-Hash",
    "jweHashNote": "JWE wählt den Hash je nach Schlüssellänge",
    "lowIterationsWarning": "Zu niedrig - mindestens 100.000 empfohlen",
    "autoGenerate": "Automatisch generieren",
    "manual": "Manuell",
    "saltPlaceholder": "32 Hexadezimalzeichen",
    "ivPlaceholder": "{length} Hexadezimalzeichen"
  },
  "it": {
    "advancedOptions": "Opzioni avanzate",
    "pbkdf2Iterations": "Iterazioni PBKDF2",
    "pbkdf2Hash": "Hash PBKDF2",
    "jweHashNote": "JWE usa l'hash in base alla lunghezza della chiave",
    "lowIterationsWarning": "Troppo basso - consigliato almeno 100.000",
    "autoGenerate": "Genera automaticamente",
    "manual": "Manuale",
    "saltPlaceholder": "32 caratteri esadecimali",
    "ivPlaceholder": "{length} caratteri esadecimali"
  },
  "ja": {
    "advancedOptions": "詳細オプション",
    "pbkdf2Iterations": "PBKDF2 反復回数",
    "pbkdf2Hash": "PBKDF2 ハッシュ",
    "jweHashNote": "JWE は鍵長に応じてハッシュを選択します",
    "lowIterationsWarning": "少なすぎます - 100,000 以上推奨",
    "autoGenerate": "自動生成",
    "manual": "手動",
    "saltPlaceholder": "16進数32文字",
    "ivPlaceholder": "16進数 {length} 文字"
  },
  "ko": {
    "advancedOptions": "고급 옵션",
    "pbkdf2Iterations": "PBKDF2 반복 횟수",
    "pbkdf2Hash": "PBKDF2 해시",
    "jweHashNote": "JWE는 키 길이에 따라 해시를 선택합니다",
    "lowIterationsWarning": "너무 낮음 - 최소 100,000 권장",
    "autoGenerate": "자동 생성",
    "manual": "수동",
    "saltPlaceholder": "16진수 32자",
    "ivPlaceholder": "16진수 {length}자"
  },
  "ru": {
    "advancedOptions": "Дополнительные параметры",
    "pbkdf2Iterations": "Итерации PBKDF2",
    "pbkdf2Hash": "Хэш PBKDF2",
    "jweHashNote": "JWE выбирает хэш по длине ключа",
    "lowIterationsWarning": "Слишком мало - рекомендуется минимум 100,000",
    "autoGenerate": "Автогенерация",
    "manual": "Вручную",
    "saltPlaceholder": "32 шестнадцатеричных символа",
    "ivPlaceholder": "{length} шестнадцатеричных символов"
  },
  "pt": {
    "advancedOptions": "Opções avançadas",
    "pbkdf2Iterations": "Iterações PBKDF2",
    "pbkdf2Hash": "Hash PBKDF2",
    "jweHashNote": "JWE usa o hash conforme o tamanho da chave",
    "lowIterationsWarning": "Muito baixo - recomendado pelo menos 100.000",
    "autoGenerate": "Gerar automaticamente",
    "manual": "Manual",
    "saltPlaceholder": "32 caracteres hexadecimais",
    "ivPlaceholder": "{length} caracteres hexadecimais"
  },
  "ar": {
    "advancedOptions": "خيارات متقدمة",
    "pbkdf2Iterations": "تكرارات PBKDF2",
    "pbkdf2Hash": "تجزئة PBKDF2",
    "jweHashNote": "يستخدم JWE التجزئة بناءً على طول المفتاح",
    "lowIterationsWarning": "منخفض جدًا - يُنصح بـ 100,000 على الأقل",
    "autoGenerate": "إنشاء تلقائي",
    "manual": "يدوي",
    "saltPlaceholder": "32 حرفًا سداسيًا عشريًا",
    "ivPlaceholder": "{length} حرفًا سداسيًا عشريًا"
  },
  "hi": {
    "advancedOptions": "उन्नत विकल्प",
    "pbkdf2Iterations": "PBKDF2 पुनरावृत्तियाँ",
    "pbkdf2Hash": "PBKDF2 हैश",
    "jweHashNote": "JWE कुंजी की लंबाई के आधार पर हैश चुनता है",
    "lowIterationsWarning": "बहुत कम - कम से कम 100,000 अनुशंसित",
    "autoGenerate": "स्वतः जनरेट करें",
    "manual": "मैनुअल",
    "saltPlaceholder": "32 हेक्स वर्ण",
    "ivPlaceholder": "{length} हेक्स वर्ण"
  },
  "tr": {
    "advancedOptions": "Gelişmiş seçenekler",
    "pbkdf2Iterations": "PBKDF2 yinelemeleri",
    "pbkdf2Hash": "PBKDF2 karması",
    "jweHashNote": "JWE, anahtar uzunluğuna göre karma seçer",
    "lowIterationsWarning": "Çok düşük - en az 100.000 önerilir",
    "autoGenerate": "Otomatik oluştur",
    "manual": "Elle",
    "saltPlaceholder": "32 onaltılık karakter",
    "ivPlaceholder": "{length} onaltılık karakter"
  },
  "nl": {
    "advancedOptions": "Geavanceerde opties",
    "pbkdf2Iterations": "PBKDF2-iteraties",
    "pbkdf2Hash": "PBKDF2-hash",
    "jweHashNote": "JWE kiest de hash op basis van sleutellengte",
    "lowIterationsWarning": "Te laag - minimaal 100.000 aanbevolen",
    "autoGenerate": "Automatisch genereren",
    "manual": "Handmatig",
    "saltPlaceholder": "32 hexadecimale tekens",
    "ivPlaceholder": "{length} hexadecimale tekens"
  },
  "sv": {
    "advancedOptions": "Avancerade alternativ",
    "pbkdf2Iterations": "PBKDF2-iterationer",
    "pbkdf2Hash": "PBKDF2-hash",
    "jweHashNote": "JWE väljer hash utifrån nyckellängd",
    "lowIterationsWarning": "För lågt - minst 100,000 rekommenderas",
    "autoGenerate": "Generera automatiskt",
    "manual": "Manuell",
    "saltPlaceholder": "32 hexadecimala tecken",
    "ivPlaceholder": "{length} hexadecimala tecken"
  },
  "pl": {
    "advancedOptions": "Opcje zaawansowane",
    "pbkdf2Iterations": "Iteracje PBKDF2",
    "pbkdf2Hash": "Skrót PBKDF2",
    "jweHashNote": "JWE dobiera skrót na podstawie długości klucza",
    "lowIterationsWarning": "Zbyt nisko - zalecane co najmniej 100,000",
    "autoGenerate": "Generuj automatycznie",
    "manual": "Ręcznie",
    "saltPlaceholder": "32 znaki szesnastkowe",
    "ivPlaceholder": "{length} znaków szesnastkowych"
  },
  "vi": {
    "advancedOptions": "Tùy chọn nâng cao",
    "pbkdf2Iterations": "Số vòng lặp PBKDF2",
    "pbkdf2Hash": "Băm PBKDF2",
    "jweHashNote": "JWE chọn hàm băm dựa trên độ dài khóa",
    "lowIterationsWarning": "Quá thấp - khuyến nghị ít nhất 100.000",
    "autoGenerate": "Tự động tạo",
    "manual": "Thủ công",
    "saltPlaceholder": "32 ký tự thập lục phân",
    "ivPlaceholder": "{length} ký tự thập lục phân"
  },
  "th": {
    "advancedOptions": "ตัวเลือกขั้นสูง",
    "pbkdf2Iterations": "จำนวนรอบ PBKDF2",
    "pbkdf2Hash": "แฮช PBKDF2",
    "jweHashNote": "JWE เลือกแฮชตามความยาวคีย์",
    "lowIterationsWarning": "ต่ำเกินไป - แนะนำอย่างน้อย 100,000",
    "autoGenerate": "สร้างอัตโนมัติ",
    "manual": "กำหนดเอง",
    "saltPlaceholder": "อักขระฐานสิบหก 32 ตัว",
    "ivPlaceholder": "อักขระฐานสิบหก {length} ตัว"
  },
  "id": {
    "advancedOptions": "Opsi lanjutan",
    "pbkdf2Iterations": "Iterasi PBKDF2",
    "pbkdf2Hash": "Hash PBKDF2",
    "jweHashNote": "JWE memilih hash berdasarkan panjang kunci",
    "lowIterationsWarning": "Terlalu rendah - disarankan minimal 100.000",
    "autoGenerate": "Buat otomatis",
    "manual": "Manual",
    "saltPlaceholder": "32 karakter heksadesimal",
    "ivPlaceholder": "{length} karakter heksadesimal"
  },
  "he": {
    "advancedOptions": "אפשרויות מתקדמות",
    "pbkdf2Iterations": "איטרציות PBKDF2",
    "pbkdf2Hash": "האש PBKDF2",
    "jweHashNote": "JWE בוחר האש לפי אורך המפתח",
    "lowIterationsWarning": "נמוך מדי - מומלץ לפחות 100,000",
    "autoGenerate": "יצירה אוטומטית",
    "manual": "ידני",
    "saltPlaceholder": "32 תווים הקסדצימליים",
    "ivPlaceholder": "{length} תווים הקסדצימליים"
  },
  "ms": {
    "advancedOptions": "Pilihan lanjutan",
    "pbkdf2Iterations": "Lelaran PBKDF2",
    "pbkdf2Hash": "Hash PBKDF2",
    "jweHashNote": "JWE memilih hash berdasarkan panjang kunci",
    "lowIterationsWarning": "Terlalu rendah - disyorkan sekurang-kurangnya 100,000",
    "autoGenerate": "Jana automatik",
    "manual": "Manual",
    "saltPlaceholder": "32 aksara heksadesimal",
    "ivPlaceholder": "{length} aksara heksadesimal"
  },
  "no": {
    "advancedOptions": "Avanserte alternativer",
    "pbkdf2Iterations": "PBKDF2-iterasjoner",
    "pbkdf2Hash": "PBKDF2-hash",
    "jweHashNote": "JWE velger hash basert på nøkkellengde",
    "lowIterationsWarning": "For lavt - anbefalt minst 100,000",
    "autoGenerate": "Automatisk generering",
    "manual": "Manuell",
    "saltPlaceholder": "32 heksadesimale tegn",
    "ivPlaceholder": "{length} heksadesimale tegn"
  }
}
</i18n>
