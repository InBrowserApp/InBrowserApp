<template>
  <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
    <n-form-item-gi :label="t('no-select-star')" :show-feedback="false">
      <n-switch v-model:value="checkSelectStar" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('unsafe-update-delete')" :show-feedback="false">
      <n-switch v-model:value="checkUnsafeMutation" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('require-semicolon')" :show-feedback="false">
      <n-switch v-model:value="requireSemicolon" />
    </n-form-item-gi>

    <n-form-item-gi :label="t('max-line-length')" :show-feedback="false">
      <n-input-number
        v-model:value="maxLineLength"
        :min="20"
        :max="300"
        size="small"
        style="width: 100%"
      />
    </n-form-item-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFormItemGi, NGrid, NInputNumber, NSwitch } from 'naive-ui'

const checkSelectStar = defineModel<boolean>('checkSelectStar', { required: true })
const checkUnsafeMutation = defineModel<boolean>('checkUnsafeMutation', { required: true })
const requireSemicolon = defineModel<boolean>('requireSemicolon', { required: true })
const maxLineLength = defineModel<number>('maxLineLength', { required: true })

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "no-select-star": "Warn on SELECT *",
    "unsafe-update-delete": "Warn on UPDATE/DELETE without WHERE",
    "require-semicolon": "Warn on missing semicolon",
    "max-line-length": "Max line length"
  },
  "zh": {
    "no-select-star": "检查 SELECT *",
    "unsafe-update-delete": "检查无 WHERE 的 UPDATE/DELETE",
    "require-semicolon": "检查语句分号",
    "max-line-length": "最大行长度"
  },
  "zh-CN": {
    "no-select-star": "检查 SELECT *",
    "unsafe-update-delete": "检查无 WHERE 的 UPDATE/DELETE",
    "require-semicolon": "检查语句分号",
    "max-line-length": "最大行长度"
  },
  "zh-TW": {
    "no-select-star": "檢查 SELECT *",
    "unsafe-update-delete": "檢查無 WHERE 的 UPDATE/DELETE",
    "require-semicolon": "檢查語句分號",
    "max-line-length": "最大行長度"
  },
  "zh-HK": {
    "no-select-star": "檢查 SELECT *",
    "unsafe-update-delete": "檢查無 WHERE 的 UPDATE/DELETE",
    "require-semicolon": "檢查語句分號",
    "max-line-length": "最大行長度"
  },
  "es": {
    "no-select-star": "Comprobar SELECT *",
    "unsafe-update-delete": "Comprobar UPDATE/DELETE sin WHERE",
    "require-semicolon": "Comprobar punto y coma",
    "max-line-length": "Longitud máxima de línea"
  },
  "fr": {
    "no-select-star": "Vérifier SELECT *",
    "unsafe-update-delete": "Vérifier UPDATE/DELETE sans WHERE",
    "require-semicolon": "Vérifier le point-virgule final",
    "max-line-length": "Longueur maximale de ligne"
  },
  "de": {
    "no-select-star": "SELECT * prüfen",
    "unsafe-update-delete": "UPDATE/DELETE ohne WHERE prüfen",
    "require-semicolon": "Abschließendes Semikolon prüfen",
    "max-line-length": "Maximale Zeilenlänge"
  },
  "it": {
    "no-select-star": "Controlla SELECT *",
    "unsafe-update-delete": "Controlla UPDATE/DELETE senza WHERE",
    "require-semicolon": "Controlla punto e virgola finale",
    "max-line-length": "Lunghezza massima riga"
  },
  "ja": {
    "no-select-star": "SELECT * をチェック",
    "unsafe-update-delete": "WHERE なしの UPDATE/DELETE をチェック",
    "require-semicolon": "文末セミコロンをチェック",
    "max-line-length": "最大行長"
  },
  "ko": {
    "no-select-star": "SELECT * 검사",
    "unsafe-update-delete": "WHERE 없는 UPDATE/DELETE 검사",
    "require-semicolon": "세미콜론 검사",
    "max-line-length": "최대 줄 길이"
  },
  "ru": {
    "no-select-star": "Проверять SELECT *",
    "unsafe-update-delete": "Проверять UPDATE/DELETE без WHERE",
    "require-semicolon": "Проверять точку с запятой",
    "max-line-length": "Максимальная длина строки"
  },
  "pt": {
    "no-select-star": "Verificar SELECT *",
    "unsafe-update-delete": "Verificar UPDATE/DELETE sem WHERE",
    "require-semicolon": "Verificar ponto e vírgula",
    "max-line-length": "Comprimento máximo da linha"
  },
  "ar": {
    "no-select-star": "فحص SELECT *",
    "unsafe-update-delete": "فحص UPDATE/DELETE بدون WHERE",
    "require-semicolon": "فحص الفاصلة المنقوطة",
    "max-line-length": "الحد الأقصى لطول السطر"
  },
  "hi": {
    "no-select-star": "SELECT * जाँचें",
    "unsafe-update-delete": "WHERE बिना UPDATE/DELETE जाँचें",
    "require-semicolon": "सेमीकोलन जाँचें",
    "max-line-length": "अधिकतम पंक्ति लंबाई"
  },
  "tr": {
    "no-select-star": "SELECT * denetle",
    "unsafe-update-delete": "WHERE’süz UPDATE/DELETE denetle",
    "require-semicolon": "Noktalı virgül denetle",
    "max-line-length": "Maksimum satır uzunluğu"
  },
  "nl": {
    "no-select-star": "SELECT * controleren",
    "unsafe-update-delete": "UPDATE/DELETE zonder WHERE controleren",
    "require-semicolon": "Puntkomma controleren",
    "max-line-length": "Maximale regellengte"
  },
  "sv": {
    "no-select-star": "Kontrollera SELECT *",
    "unsafe-update-delete": "Kontrollera UPDATE/DELETE utan WHERE",
    "require-semicolon": "Kontrollera semikolon",
    "max-line-length": "Max radlängd"
  },
  "pl": {
    "no-select-star": "Sprawdzaj SELECT *",
    "unsafe-update-delete": "Sprawdzaj UPDATE/DELETE bez WHERE",
    "require-semicolon": "Sprawdzaj średnik",
    "max-line-length": "Maksymalna długość wiersza"
  },
  "vi": {
    "no-select-star": "Kiểm tra SELECT *",
    "unsafe-update-delete": "Kiểm tra UPDATE/DELETE không có WHERE",
    "require-semicolon": "Kiểm tra dấu chấm phẩy",
    "max-line-length": "Độ dài dòng tối đa"
  },
  "th": {
    "no-select-star": "ตรวจสอบ SELECT *",
    "unsafe-update-delete": "ตรวจสอบ UPDATE/DELETE ที่ไม่มี WHERE",
    "require-semicolon": "ตรวจสอบเครื่องหมายอัฒภาค",
    "max-line-length": "ความยาวบรรทัดสูงสุด"
  },
  "id": {
    "no-select-star": "Periksa SELECT *",
    "unsafe-update-delete": "Periksa UPDATE/DELETE tanpa WHERE",
    "require-semicolon": "Periksa titik koma",
    "max-line-length": "Panjang baris maksimum"
  },
  "he": {
    "no-select-star": "בדוק SELECT *",
    "unsafe-update-delete": "בדוק UPDATE/DELETE ללא WHERE",
    "require-semicolon": "בדוק נקודה-פסיק",
    "max-line-length": "אורך שורה מרבי"
  },
  "ms": {
    "no-select-star": "Semak SELECT *",
    "unsafe-update-delete": "Semak UPDATE/DELETE tanpa WHERE",
    "require-semicolon": "Semak koma bernoktah",
    "max-line-length": "Panjang baris maksimum"
  },
  "no": {
    "no-select-star": "Sjekk SELECT *",
    "unsafe-update-delete": "Sjekk UPDATE/DELETE uten WHERE",
    "require-semicolon": "Sjekk semikolon",
    "max-line-length": "Maks linjelengde"
  }
}
</i18n>
