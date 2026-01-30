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
    "note": "APNG outputs are saved as .png files. If the GIF has no loop info, the default is 1 play."
  },
  "zh": {
    "note": "APNG 输出为 .png 文件。如果 GIF 未提供循环信息，默认播放 1 次。"
  },
  "zh-CN": {
    "note": "APNG 输出为 .png 文件。如果 GIF 未提供循环信息，默认播放 1 次。"
  },
  "zh-TW": {
    "note": "APNG 輸出為 .png 檔案。如果 GIF 未提供循環資訊，預設播放 1 次。"
  },
  "zh-HK": {
    "note": "APNG 輸出為 .png 檔案。如果 GIF 未提供循環資訊，預設播放 1 次。"
  },
  "es": {
    "note": "Los APNG se guardan como archivos .png. Si el GIF no define bucle, se usa 1 repetición."
  },
  "fr": {
    "note": "Les APNG sont enregistrés en .png. Si le GIF n'a pas de boucle, 1 lecture est utilisée."
  },
  "de": {
    "note": "APNG-Ausgaben werden als .png gespeichert. Wenn das GIF keine Schleife angibt, wird 1 Durchlauf verwendet."
  },
  "it": {
    "note": "Gli APNG vengono salvati come .png. Se il GIF non specifica il loop, usa 1 riproduzione."
  },
  "ja": {
    "note": "APNGは .png として保存されます。GIFにループ情報がない場合は1回再生します。"
  },
  "ko": {
    "note": "APNG는 .png로 저장됩니다. GIF에 루프 정보가 없으면 1회 재생합니다."
  },
  "ru": {
    "note": "APNG сохраняются как .png. Если GIF не содержит данных цикла, используется 1 повтор."
  },
  "pt": {
    "note": "Os APNGs são salvos como .png. Se o GIF não tiver loop, usa 1 repetição."
  },
  "ar": {
    "note": "يتم حفظ APNG كملفات .png. إذا لم يحدد GIF التكرار فالإعداد الافتراضي 1 مرة."
  },
  "hi": {
    "note": "APNG आउटपुट .png के रूप में सेव होते हैं। यदि GIF में लूप जानकारी नहीं है, तो डिफॉल्ट 1 प्ले है।"
  },
  "tr": {
    "note": "APNG çıktıları .png olarak kaydedilir. GIF döngüsü yoksa varsayılan 1 oynatmadır."
  },
  "nl": {
    "note": "APNG-uitvoer wordt opgeslagen als .png. Als GIF geen lus bevat, is de standaard 1 keer."
  },
  "sv": {
    "note": "APNG sparas som .png. Om GIF saknar loopinfo används 1 uppspelning."
  },
  "pl": {
    "note": "APNG zapisywane są jako .png. Jeśli GIF nie ma pętli, domyślnie 1 odtworzenie."
  },
  "vi": {
    "note": "APNG được lưu dưới dạng .png. Nếu GIF không có thông tin lặp, mặc định 1 lần."
  },
  "th": {
    "note": "APNG จะถูกบันทึกเป็น .png หาก GIF ไม่มีข้อมูลลูป จะใช้ค่าเริ่มต้น 1 ครั้ง"
  },
  "id": {
    "note": "APNG disimpan sebagai .png. Jika GIF tidak memiliki info loop, defaultnya 1 kali."
  },
  "he": {
    "note": "פלט APNG נשמר כ־.png. אם ל-GIF אין לולאה, ברירת המחדל היא פעם אחת."
  },
  "ms": {
    "note": "APNG disimpan sebagai .png. Jika GIF tiada info gelung, lalai 1 kali."
  },
  "no": {
    "note": "APNG lagres som .png. Hvis GIF ikke har loopinfo, brukes 1 avspilling."
  }
}
</i18n>
