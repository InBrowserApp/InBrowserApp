<template>
  <n-grid cols="1" :y-gap="12">
    <n-form-item-gi :label="t('algorithm')" :show-feedback="false">
      <n-radio-group v-model:value="algorithm" name="algorithm">
        <n-space>
          <n-radio value="ecc">
            ECC
            <n-tag size="tiny" type="success" :bordered="false" style="margin-left: 4px">
              {{ t('recommended') }}
            </n-tag>
          </n-radio>
          <n-radio value="rsa">RSA</n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item-gi>

    <n-form-item-gi v-if="algorithm === 'rsa'" :label="t('keySize')" :show-feedback="false">
      <n-select v-model:value="rsaKeySize" :options="keySizeOptions" />
    </n-form-item-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NFormItemGi, NGrid, NRadio, NRadioGroup, NSelect, NSpace, NTag } from 'naive-ui'
import type { KeyAlgorithm, RsaKeySize } from '../pgp-keygen'

const algorithm = defineModel<KeyAlgorithm>('algorithm', { required: true })
const rsaKeySize = defineModel<RsaKeySize>('rsaKeySize', { required: true })

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
    "algorithm": "Algorithm",
    "keySize": "Key Size",
    "recommended": "Recommended"
  },
  "zh": {
    "algorithm": "算法",
    "keySize": "密钥长度",
    "recommended": "推荐"
  },
  "zh-CN": {
    "algorithm": "算法",
    "keySize": "密钥长度",
    "recommended": "推荐"
  },
  "zh-TW": {
    "algorithm": "演算法",
    "keySize": "金鑰長度",
    "recommended": "推薦"
  },
  "zh-HK": {
    "algorithm": "演算法",
    "keySize": "金鑰長度",
    "recommended": "推薦"
  },
  "es": {
    "algorithm": "Algoritmo",
    "keySize": "Tamaño de clave",
    "recommended": "Recomendado"
  },
  "fr": {
    "algorithm": "Algorithme",
    "keySize": "Taille de clé",
    "recommended": "Recommandé"
  },
  "de": {
    "algorithm": "Algorithmus",
    "keySize": "Schlüsselgröße",
    "recommended": "Empfohlen"
  },
  "it": {
    "algorithm": "Algoritmo",
    "keySize": "Dimensione chiave",
    "recommended": "Consigliato"
  },
  "ja": {
    "algorithm": "アルゴリズム",
    "keySize": "キーサイズ",
    "recommended": "推奨"
  },
  "ko": {
    "algorithm": "알고리즘",
    "keySize": "키 크기",
    "recommended": "권장"
  },
  "ru": {
    "algorithm": "Алгоритм",
    "keySize": "Размер ключа",
    "recommended": "Рекомендуется"
  },
  "pt": {
    "algorithm": "Algoritmo",
    "keySize": "Tamanho da chave",
    "recommended": "Recomendado"
  },
  "ar": {
    "algorithm": "الخوارزمية",
    "keySize": "حجم المفتاح",
    "recommended": "موصى به"
  },
  "hi": {
    "algorithm": "एल्गोरिथम",
    "keySize": "कुंजी का आकार",
    "recommended": "अनुशंसित"
  },
  "tr": {
    "algorithm": "Algoritma",
    "keySize": "Anahtar Boyutu",
    "recommended": "Önerilen"
  },
  "nl": {
    "algorithm": "Algoritme",
    "keySize": "Sleutelgrootte",
    "recommended": "Aanbevolen"
  },
  "sv": {
    "algorithm": "Algoritm",
    "keySize": "Nyckelstorlek",
    "recommended": "Rekommenderas"
  },
  "pl": {
    "algorithm": "Algorytm",
    "keySize": "Rozmiar klucza",
    "recommended": "Zalecane"
  },
  "vi": {
    "algorithm": "Thuật toán",
    "keySize": "Kích thước khóa",
    "recommended": "Khuyến nghị"
  },
  "th": {
    "algorithm": "อัลกอริทึม",
    "keySize": "ขนาดคีย์",
    "recommended": "แนะนำ"
  },
  "id": {
    "algorithm": "Algoritma",
    "keySize": "Ukuran kunci",
    "recommended": "Direkomendasikan"
  },
  "he": {
    "algorithm": "אלגוריתם",
    "keySize": "גודל מפתח",
    "recommended": "מומלץ"
  },
  "ms": {
    "algorithm": "Algoritma",
    "keySize": "Saiz kunci",
    "recommended": "Disyorkan"
  },
  "no": {
    "algorithm": "Algoritme",
    "keySize": "Nøkkelstørrelse",
    "recommended": "Anbefalt"
  }
}
</i18n>
