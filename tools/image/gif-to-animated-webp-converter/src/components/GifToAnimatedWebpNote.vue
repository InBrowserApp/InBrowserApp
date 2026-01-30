<template>
  <ToolSection>
    <n-text depth="3">{{ t('note') }}</n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NText } from 'naive-ui'
import { ToolSection } from '@shared/ui/tool'

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "note": "Animated WebP outputs are saved as .webp files. If the GIF has no loop info, the default is 1 play."
  },
  "zh": {
    "note": "WebP 动图输出为 .webp 文件。如果 GIF 未提供循环信息，默认播放 1 次。"
  },
  "zh-CN": {
    "note": "WebP 动图输出为 .webp 文件。如果 GIF 未提供循环信息，默认播放 1 次。"
  },
  "zh-TW": {
    "note": "WebP 輸出為 .webp 檔案。如果 GIF 未提供循環資訊，預設播放 1 次。"
  },
  "zh-HK": {
    "note": "WebP 輸出為 .webp 檔案。如果 GIF 未提供循環資訊，預設播放 1 次。"
  },
  "es": {
    "note": "Los WebP se guardan como archivos .webp. Si el GIF no define bucle, se usa 1 repetición."
  },
  "fr": {
    "note": "Les WebP sont enregistrés en .webp. Si le GIF n'a pas de boucle, 1 lecture est utilisée."
  },
  "de": {
    "note": "WebP-Ausgaben werden als .webp gespeichert. Wenn das GIF keine Schleife angibt, wird 1 Durchlauf verwendet."
  },
  "it": {
    "note": "Gli WebP vengono salvati come .webp. Se il GIF non specifica il loop, usa 1 riproduzione."
  },
  "ja": {
    "note": "WebPは .webp として保存されます。GIFにループ情報がない場合は1回再生します。"
  },
  "ko": {
    "note": "WebP는 .webp로 저장됩니다. GIF에 루프 정보가 없으면 1회 재생합니다."
  },
  "ru": {
    "note": "WebP сохраняются как .webp. Если GIF не содержит данных цикла, используется 1 повтор."
  },
  "pt": {
    "note": "Os WebPs são salvos como .webp. Se o GIF não tiver loop, usa 1 repetição."
  },
  "ar": {
    "note": "يتم حفظ WebP كملفات .webp. إذا لم يحدد GIF التكرار فالإعداد الافتراضي 1 مرة."
  },
  "hi": {
    "note": "WebP आउटपुट .webp के रूप में सेव होते हैं। यदि GIF में लूप जानकारी नहीं है, तो डिफॉल्ट 1 प्ले है।"
  },
  "tr": {
    "note": "WebP çıktıları .webp olarak kaydedilir. GIF döngüsü yoksa varsayılan 1 oynatmadır."
  },
  "nl": {
    "note": "WebP-uitvoer wordt opgeslagen als .webp. Als GIF geen lus bevat, is de standaard 1 keer."
  },
  "sv": {
    "note": "WebP sparas som .webp. Om GIF saknar loopinfo används 1 uppspelning."
  },
  "pl": {
    "note": "WebP zapisywane są jako .webp. Jeśli GIF nie ma pętli, domyślnie 1 odtworzenie."
  },
  "vi": {
    "note": "WebP được lưu dưới dạng .webp. Nếu GIF không có thông tin lặp, mặc định 1 lần."
  },
  "th": {
    "note": "WebP จะถูกบันทึกเป็น .webp หาก GIF ไม่มีข้อมูลลูป จะใช้ค่าเริ่มต้น 1 ครั้ง"
  },
  "id": {
    "note": "WebP disimpan sebagai .webp. Jika GIF tidak memiliki info loop, defaultnya 1 kali."
  },
  "he": {
    "note": "פלט WebP נשמר כ־.webp. אם ל-GIF אין לולאה, ברירת המחדל היא פעם אחת."
  },
  "ms": {
    "note": "WebP disimpan sebagai .webp. Jika GIF tiada info gelung, lalai 1 kali."
  },
  "no": {
    "note": "WebP lagres som .webp. Hvis GIF ikke har loopinfo, brukes 1 avspilling."
  }
}
</i18n>
