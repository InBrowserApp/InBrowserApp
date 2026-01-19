<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('options') }}</ToolSectionHeader>
    <n-grid cols="1 m:2" responsive="screen" :x-gap="20" :y-gap="16">
      <n-form-item-gi :label="t('algorithm')" :show-feedback="false">
        <n-radio-group
          :value="algorithm"
          name="algorithm"
          @update:value="$emit('update:algorithm', $event)"
        >
          <n-space>
            <n-radio value="ed25519">
              <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
              Ed25519
              <!-- eslint-enable @intlify/vue-i18n/no-raw-text -->
              <n-tag size="tiny" type="success" :bordered="false" style="margin-left: 4px">
                {{ t('recommended') }}
              </n-tag>
            </n-radio>
            <n-radio value="rsa">RSA</n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item-gi>

      <n-form-item-gi v-if="algorithm === 'rsa'" :label="t('keySize')" :show-feedback="false">
        <n-select
          :value="rsaKeySize"
          :options="keySizeOptions"
          @update:value="$emit('update:rsaKeySize', $event)"
        />
      </n-form-item-gi>

      <n-form-item-gi
        :label="t('comment')"
        :show-feedback="false"
        :span="algorithm === 'rsa' ? 2 : 1"
      >
        <n-input
          :value="comment"
          :placeholder="t('commentPlaceholder')"
          @update:value="$emit('update:comment', $event)"
        />
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NGrid, NFormItemGi, NRadioGroup, NRadio, NSpace, NSelect, NInput, NTag } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { KeyAlgorithm, RsaKeySize } from '../ssh-keygen'

defineProps<{
  algorithm: KeyAlgorithm
  rsaKeySize: RsaKeySize
  comment: string
}>()

defineEmits<{
  'update:algorithm': [value: KeyAlgorithm]
  'update:rsaKeySize': [value: RsaKeySize]
  'update:comment': [value: string]
}>()

const { t } = useI18n()

const keySizeOptions = computed(() => [
  { label: '2048 bits', value: 2048 },
  { label: '3072 bits', value: 3072 },
  { label: `4096 bits (${t('recommended')})`, value: 4096 },
])
</script>

<i18n lang="json">
{
  "en": {
    "options": "Options",
    "algorithm": "Algorithm",
    "keySize": "Key Size",
    "comment": "Comment",
    "commentPlaceholder": "user{'@'}hostname (optional)",
    "recommended": "Recommended"
  },
  "zh": {
    "options": "选项",
    "algorithm": "算法",
    "keySize": "密钥长度",
    "comment": "注释",
    "commentPlaceholder": "user{'@'}hostname（可选）",
    "recommended": "推荐"
  },
  "zh-CN": {
    "options": "选项",
    "algorithm": "算法",
    "keySize": "密钥长度",
    "comment": "注释",
    "commentPlaceholder": "user{'@'}hostname（可选）",
    "recommended": "推荐"
  },
  "zh-TW": {
    "options": "選項",
    "algorithm": "演算法",
    "keySize": "金鑰長度",
    "comment": "註解",
    "commentPlaceholder": "user{'@'}hostname（可選）",
    "recommended": "推薦"
  },
  "zh-HK": {
    "options": "選項",
    "algorithm": "演算法",
    "keySize": "金鑰長度",
    "comment": "註解",
    "commentPlaceholder": "user{'@'}hostname（可選）",
    "recommended": "推薦"
  },
  "es": {
    "options": "Opciones",
    "algorithm": "Algoritmo",
    "keySize": "Tamaño de clave",
    "comment": "Comentario",
    "commentPlaceholder": "user{'@'}hostname (opcional)",
    "recommended": "Recomendado"
  },
  "fr": {
    "options": "Options",
    "algorithm": "Algorithme",
    "keySize": "Taille de clé",
    "comment": "Commentaire",
    "commentPlaceholder": "user{'@'}hostname (optionnel)",
    "recommended": "Recommandé"
  },
  "de": {
    "options": "Optionen",
    "algorithm": "Algorithmus",
    "keySize": "Schlüsselgröße",
    "comment": "Kommentar",
    "commentPlaceholder": "user{'@'}hostname (optional)",
    "recommended": "Empfohlen"
  },
  "it": {
    "options": "Opzioni",
    "algorithm": "Algoritmo",
    "keySize": "Dimensione chiave",
    "comment": "Commento",
    "commentPlaceholder": "user{'@'}hostname (opzionale)",
    "recommended": "Consigliato"
  },
  "ja": {
    "options": "オプション",
    "algorithm": "アルゴリズム",
    "keySize": "キーサイズ",
    "comment": "コメント",
    "commentPlaceholder": "user{'@'}hostname（オプション）",
    "recommended": "推奨"
  },
  "ko": {
    "options": "옵션",
    "algorithm": "알고리즘",
    "keySize": "키 크기",
    "comment": "코멘트",
    "commentPlaceholder": "user{'@'}hostname (선택사항)",
    "recommended": "권장"
  },
  "ru": {
    "options": "Параметры",
    "algorithm": "Алгоритм",
    "keySize": "Размер ключа",
    "comment": "Комментарий",
    "commentPlaceholder": "user{'@'}hostname (необязательно)",
    "recommended": "Рекомендуется"
  },
  "pt": {
    "options": "Opções",
    "algorithm": "Algoritmo",
    "keySize": "Tamanho da chave",
    "comment": "Comentário",
    "commentPlaceholder": "user{'@'}hostname (opcional)",
    "recommended": "Recomendado"
  },
  "ar": {
    "options": "الخيارات",
    "algorithm": "الخوارزمية",
    "keySize": "حجم المفتاح",
    "comment": "تعليق",
    "commentPlaceholder": "user{'@'}hostname (اختياري)",
    "recommended": "موصى به"
  },
  "hi": {
    "options": "विकल्प",
    "algorithm": "एल्गोरिथम",
    "keySize": "कुंजी का आकार",
    "comment": "टिप्पणी",
    "commentPlaceholder": "user{'@'}hostname (वैकल्पिक)",
    "recommended": "अनुशंसित"
  },
  "tr": {
    "options": "Seçenekler",
    "algorithm": "Algoritma",
    "keySize": "Anahtar Boyutu",
    "comment": "Yorum",
    "commentPlaceholder": "user{'@'}hostname (isteğe bağlı)",
    "recommended": "Önerilen"
  },
  "nl": {
    "options": "Opties",
    "algorithm": "Algoritme",
    "keySize": "Sleutelgrootte",
    "comment": "Opmerking",
    "commentPlaceholder": "user{'@'}hostname (optioneel)",
    "recommended": "Aanbevolen"
  },
  "sv": {
    "options": "Alternativ",
    "algorithm": "Algoritm",
    "keySize": "Nyckelstorlek",
    "comment": "Kommentar",
    "commentPlaceholder": "user{'@'}hostname (valfritt)",
    "recommended": "Rekommenderas"
  },
  "pl": {
    "options": "Opcje",
    "algorithm": "Algorytm",
    "keySize": "Rozmiar klucza",
    "comment": "Komentarz",
    "commentPlaceholder": "user{'@'}hostname (opcjonalnie)",
    "recommended": "Zalecane"
  },
  "vi": {
    "options": "Tùy chọn",
    "algorithm": "Thuật toán",
    "keySize": "Kích thước khóa",
    "comment": "Ghi chú",
    "commentPlaceholder": "user{'@'}hostname (tùy chọn)",
    "recommended": "Khuyến nghị"
  },
  "th": {
    "options": "ตัวเลือก",
    "algorithm": "อัลกอริทึม",
    "keySize": "ขนาดคีย์",
    "comment": "ความคิดเห็น",
    "commentPlaceholder": "user{'@'}hostname (ไม่บังคับ)",
    "recommended": "แนะนำ"
  },
  "id": {
    "options": "Opsi",
    "algorithm": "Algoritma",
    "keySize": "Ukuran Kunci",
    "comment": "Komentar",
    "commentPlaceholder": "user{'@'}hostname (opsional)",
    "recommended": "Disarankan"
  },
  "he": {
    "options": "אפשרויות",
    "algorithm": "אלגוריתם",
    "keySize": "גודל מפתח",
    "comment": "הערה",
    "commentPlaceholder": "user{'@'}hostname (אופציונלי)",
    "recommended": "מומלץ"
  },
  "ms": {
    "options": "Pilihan",
    "algorithm": "Algoritma",
    "keySize": "Saiz Kunci",
    "comment": "Komen",
    "commentPlaceholder": "user{'@'}hostname (pilihan)",
    "recommended": "Disyorkan"
  },
  "no": {
    "options": "Alternativer",
    "algorithm": "Algoritme",
    "keySize": "Nøkkelstørrelse",
    "comment": "Kommentar",
    "commentPlaceholder": "user{'@'}hostname (valgfritt)",
    "recommended": "Anbefalt"
  }
}
</i18n>
