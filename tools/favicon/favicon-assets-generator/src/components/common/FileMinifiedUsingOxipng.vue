<template>
  <n-text depth="3">
    <n-icon :component="Sparkle16Filled" style="vertical-align: -0.1em" />
    {{ t('minificationNote') }}
  </n-text>
</template>

<script setup lang="ts">
import { NIcon, NText } from 'naive-ui'
import Sparkle16Filled from '@vicons/fluent/Sparkle16Filled'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "minificationNote": "All files are losslessly minified using oxipng."
  },
  "zh": {
    "minificationNote": "所有文件都使用 oxipng 进行无损压缩。"
  },
  "zh-CN": {
    "minificationNote": "所有文件都使用 oxipng 进行无损压缩。"
  },
  "zh-TW": {
    "minificationNote": "所有檔案都使用 oxipng 進行無損壓縮。"
  },
  "zh-HK": {
    "minificationNote": "所有檔案都使用 oxipng 進行無損壓縮。"
  },
  "es": {
    "minificationNote": "Todos los archivos se minifican sin pérdida usando oxipng."
  },
  "fr": {
    "minificationNote": "Tous les fichiers sont minifiés sans perte en utilisant oxipng."
  },
  "de": {
    "minificationNote": "Alle Dateien werden verlustfrei mit oxipng minifiziert."
  },
  "it": {
    "minificationNote": "Tutti i file vengono minificati senza perdita utilizzando oxipng."
  },
  "ja": {
    "minificationNote": "すべてのファイルは oxipng を使用してロスレスで最適化されています。"
  },
  "ko": {
    "minificationNote": "모든 파일은 oxipng를 사용하여 무손실로 최적화됩니다."
  },
  "ru": {
    "minificationNote": "Все файлы оптимизируются без потерь с помощью oxipng."
  },
  "pt": {
    "minificationNote": "Todos os arquivos são minificados sem perda usando oxipng."
  },
  "ar": {
    "minificationNote": "يتم تصغير جميع الملفات بدون فقدان باستخدام oxipng."
  },
  "hi": {
    "minificationNote": "सभी फ़ाइलें oxipng का उपयोग करके बिना किसी नुकसान के छोटी की जाती हैं।"
  },
  "tr": {
    "minificationNote": "Tüm dosyalar oxipng kullanılarak kayıpsız olarak küçültülür."
  },
  "nl": {
    "minificationNote": "Alle bestanden worden verliesvrij geoptimaliseerd met oxipng."
  },
  "sv": {
    "minificationNote": "Alla filer är förlustfritt minifierade med oxipng."
  },
  "pl": {
    "minificationNote": "Wszystkie pliki są bezstratnie minifikowane przy użyciu oxipng."
  },
  "vi": {
    "minificationNote": "Tất cả các tệp được tối ưu hóa không mất chất lượng bằng oxipng."
  },
  "th": {
    "minificationNote": "ไฟล์ทั้งหมดถูกบีบอัดแบบไม่สูญเสียคุณภาพโดยใช้ oxipng"
  },
  "id": {
    "minificationNote": "Semua file dioptimalkan tanpa kehilangan kualitas menggunakan oxipng."
  },
  "he": {
    "minificationNote": "כל הקבצים מוקטנים ללא אובדן איכות באמצעות oxipng."
  },
  "ms": {
    "minificationNote": "Semua fail dioptimumkan tanpa kehilangan kualiti menggunakan oxipng."
  },
  "no": {
    "minificationNote": "Alle filer er optimalisert uten kvalitetstap ved hjelp av oxipng."
  }
}
</i18n>
