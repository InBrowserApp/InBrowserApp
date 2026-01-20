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
    "minificationNote": "All files are losslessly minified using oxipng and svgo."
  },
  "zh": {
    "minificationNote": "所有文件都使用 oxipng 和 svgo 进行无损压缩。"
  },
  "zh-CN": {
    "minificationNote": "所有文件都使用 oxipng 和 svgo 进行无损压缩。"
  },
  "zh-TW": {
    "minificationNote": "所有檔案都使用 oxipng 和 svgo 進行無損壓縮。"
  },
  "zh-HK": {
    "minificationNote": "所有檔案都使用 oxipng 和 svgo 進行無損壓縮。"
  },
  "es": {
    "minificationNote": "Todos los archivos se minifican sin pérdida usando oxipng y svgo."
  },
  "fr": {
    "minificationNote": "Tous les fichiers sont minifiés sans perte en utilisant oxipng et svgo."
  },
  "de": {
    "minificationNote": "Alle Dateien werden verlustfrei mit oxipng und svgo minifiziert."
  },
  "it": {
    "minificationNote": "Tutti i file vengono minificati senza perdita utilizzando oxipng e svgo."
  },
  "ja": {
    "minificationNote": "すべてのファイルは oxipng と svgo を使用してロスレスで最適化されています。"
  },
  "ko": {
    "minificationNote": "모든 파일은 oxipng와 svgo를 사용하여 무손실로 최적화됩니다."
  },
  "ru": {
    "minificationNote": "Все файлы оптимизируются без потерь с помощью oxipng и svgo."
  },
  "pt": {
    "minificationNote": "Todos os arquivos são minificados sem perda usando oxipng e svgo."
  },
  "ar": {
    "minificationNote": "يتم تصغير جميع الملفات بدون فقدان باستخدام oxipng و svgo."
  },
  "hi": {
    "minificationNote": "सभी फ़ाइलें oxipng और svgo का उपयोग करके बिना किसी नुकसान के छोटी की जाती हैं।"
  },
  "tr": {
    "minificationNote": "Tüm dosyalar oxipng ve svgo kullanılarak kayıpsız olarak küçültülür."
  },
  "nl": {
    "minificationNote": "Alle bestanden worden verliesvrij geoptimaliseerd met oxipng en svgo."
  },
  "sv": {
    "minificationNote": "Alla filer är förlustfritt minifierade med oxipng och svgo."
  },
  "pl": {
    "minificationNote": "Wszystkie pliki są bezstratnie minifikowane przy użyciu oxipng i svgo."
  },
  "vi": {
    "minificationNote": "Tất cả các tệp được tối ưu hóa không mất chất lượng bằng oxipng và svgo."
  },
  "th": {
    "minificationNote": "ไฟล์ทั้งหมดถูกบีบอัดแบบไม่สูญเสียคุณภาพโดยใช้ oxipng และ svgo"
  },
  "id": {
    "minificationNote": "Semua file dioptimalkan tanpa kehilangan kualitas menggunakan oxipng dan svgo."
  },
  "he": {
    "minificationNote": "כל הקבצים מוקטנים ללא אובדן איכות באמצעות oxipng ו-svgo."
  },
  "ms": {
    "minificationNote": "Semua fail dioptimumkan tanpa kehilangan kualiti menggunakan oxipng dan svgo."
  },
  "no": {
    "minificationNote": "Alle filer er optimalisert uten kvalitetstap ved hjelp av oxipng og svgo."
  }
}
</i18n>
