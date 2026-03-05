<template>
  <ToolSectionHeader>{{ t('inputsTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-flex justify="space-between" align="center" :wrap="true">
        <n-flex :size="8">
          <n-button text @click="emit('swap')">
            <template #icon>
              <n-icon :component="ArrowSwap20Regular" />
            </template>
            {{ t('swap') }}
          </n-button>
          <n-button text @click="emit('format')">
            <template #icon>
              <n-icon :component="TextNumberFormat20Regular" />
            </template>
            {{ t('format') }}
          </n-button>
          <n-button v-if="showLargeCompareHint" type="primary" @click="emit('compare')">
            {{ t('compareNow') }}
          </n-button>
        </n-flex>

        <n-flex align="center" :size="8">
          <n-text>{{ t('operations') }}</n-text>
          <n-checkbox-group v-model:value="selectedOperations">
            <n-flex :size="8">
              <n-checkbox value="add">{{ t('add') }}</n-checkbox>
              <n-checkbox value="remove">{{ t('remove') }}</n-checkbox>
              <n-checkbox value="replace">{{ t('replace') }}</n-checkbox>
            </n-flex>
          </n-checkbox-group>
        </n-flex>
      </n-flex>

      <n-alert v-if="showLargeCompareHint" type="info">{{ t('largeModeHint') }}</n-alert>

      <n-grid cols="1 m:2" responsive="screen" :x-gap="12" :y-gap="12">
        <n-gi>
          <n-card :title="t('originalLabel')" size="small">
            <n-input
              v-model:value="originalText"
              type="textarea"
              :rows="14"
              :placeholder="t('originalPlaceholder')"
            />
          </n-card>
        </n-gi>

        <n-gi>
          <n-card :title="t('modifiedLabel')" size="small">
            <n-input
              v-model:value="modifiedText"
              type="textarea"
              :rows="14"
              :placeholder="t('modifiedPlaceholder')"
            />
          </n-card>
        </n-gi>
      </n-grid>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  NAlert,
  NButton,
  NCard,
  NCheckbox,
  NCheckboxGroup,
  NFlex,
  NGi,
  NGrid,
  NIcon,
  NInput,
  NText,
} from 'naive-ui'
import ArrowSwap20Regular from '@vicons/fluent/ArrowSwap20Regular'
import TextNumberFormat20Regular from '@vicons/fluent/TextNumberFormat20Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { JsonDiffOperation } from '../utils/jsonDiff'

withDefaults(
  defineProps<{
    showLargeCompareHint?: boolean
  }>(),
  {
    showLargeCompareHint: false,
  },
)

const emit = defineEmits<{
  swap: []
  format: []
  compare: []
}>()

const originalText = defineModel<string>('originalText', { required: true })
const modifiedText = defineModel<string>('modifiedText', { required: true })
const selectedOperations = defineModel<JsonDiffOperation[]>('selectedOperations', {
  required: true,
})

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "inputsTitle": "Compare JSON Documents",
    "swap": "Swap",
    "format": "Format JSON",
    "compareNow": "Compare Now",
    "largeModeHint": "Large JSON detected. Automatic comparison is paused to keep typing responsive. Click Compare Now to refresh results.",
    "operations": "Operations",
    "add": "Add",
    "remove": "Remove",
    "replace": "Replace",
    "originalLabel": "Original JSON",
    "modifiedLabel": "Modified JSON",
    "originalPlaceholder": "Paste original JSON...",
    "modifiedPlaceholder": "Paste modified JSON..."
  },
  "zh": {
    "inputsTitle": "比较 JSON 文档",
    "swap": "交换",
    "format": "格式化 JSON",
    "compareNow": "立即比较",
    "largeModeHint": "检测到大体积 JSON。为保证输入流畅，已暂停自动比较。点击“立即比较”更新结果。",
    "operations": "操作类型",
    "add": "新增",
    "remove": "删除",
    "replace": "修改",
    "originalLabel": "原始 JSON",
    "modifiedLabel": "修改后 JSON",
    "originalPlaceholder": "粘贴原始 JSON...",
    "modifiedPlaceholder": "粘贴修改后 JSON..."
  },
  "zh-CN": {
    "inputsTitle": "比较 JSON 文档",
    "swap": "交换",
    "format": "格式化 JSON",
    "compareNow": "立即比较",
    "largeModeHint": "检测到大体积 JSON。为保证输入流畅，已暂停自动比较。点击“立即比较”更新结果。",
    "operations": "操作类型",
    "add": "新增",
    "remove": "删除",
    "replace": "修改",
    "originalLabel": "原始 JSON",
    "modifiedLabel": "修改后 JSON",
    "originalPlaceholder": "粘贴原始 JSON...",
    "modifiedPlaceholder": "粘贴修改后 JSON..."
  },
  "zh-TW": {
    "inputsTitle": "比較 JSON 文件",
    "swap": "交換",
    "format": "格式化 JSON",
    "compareNow": "立即比較",
    "largeModeHint": "偵測到大型 JSON。為了保持輸入流暢，已暫停自動比較。請點擊「立即比較」更新結果。",
    "operations": "操作類型",
    "add": "新增",
    "remove": "刪除",
    "replace": "修改",
    "originalLabel": "原始 JSON",
    "modifiedLabel": "修改後 JSON",
    "originalPlaceholder": "貼上原始 JSON...",
    "modifiedPlaceholder": "貼上修改後 JSON..."
  },
  "zh-HK": {
    "inputsTitle": "比較 JSON 文件",
    "swap": "交換",
    "format": "格式化 JSON",
    "compareNow": "立即比較",
    "largeModeHint": "偵測到大型 JSON。為了保持輸入流暢，已暫停自動比較。請點擊「立即比較」更新結果。",
    "operations": "操作類型",
    "add": "新增",
    "remove": "刪除",
    "replace": "修改",
    "originalLabel": "原始 JSON",
    "modifiedLabel": "修改後 JSON",
    "originalPlaceholder": "貼上原始 JSON...",
    "modifiedPlaceholder": "貼上修改後 JSON..."
  },
  "es": {
    "inputsTitle": "Comparar documentos JSON",
    "swap": "Intercambiar",
    "format": "Formatear JSON",
    "compareNow": "Comparar ahora",
    "largeModeHint": "Se detectó un JSON grande. La comparación automática se pausó para mantener una escritura fluida. Haz clic en \"Comparar ahora\" para actualizar resultados.",
    "operations": "Operaciones",
    "add": "Agregar",
    "remove": "Eliminar",
    "replace": "Reemplazar",
    "originalLabel": "JSON original",
    "modifiedLabel": "JSON modificado",
    "originalPlaceholder": "Pega el JSON original...",
    "modifiedPlaceholder": "Pega el JSON modificado..."
  },
  "fr": {
    "inputsTitle": "Comparer des documents JSON",
    "swap": "Inverser",
    "format": "Formater le JSON",
    "compareNow": "Comparer maintenant",
    "largeModeHint": "JSON volumineux détecté. La comparaison automatique est mise en pause pour garder une saisie fluide. Cliquez sur \"Comparer maintenant\" pour actualiser les résultats.",
    "operations": "Opérations",
    "add": "Ajouter",
    "remove": "Supprimer",
    "replace": "Remplacer",
    "originalLabel": "JSON original",
    "modifiedLabel": "JSON modifié",
    "originalPlaceholder": "Collez le JSON original...",
    "modifiedPlaceholder": "Collez le JSON modifié..."
  },
  "de": {
    "inputsTitle": "JSON-Dokumente vergleichen",
    "swap": "Tauschen",
    "format": "JSON formatieren",
    "compareNow": "Jetzt vergleichen",
    "largeModeHint": "Großes JSON erkannt. Der automatische Vergleich wurde pausiert, damit die Eingabe flüssig bleibt. Klicken Sie auf \"Jetzt vergleichen\", um die Ergebnisse zu aktualisieren.",
    "operations": "Operationen",
    "add": "Hinzufügen",
    "remove": "Entfernen",
    "replace": "Ersetzen",
    "originalLabel": "Ursprüngliches JSON",
    "modifiedLabel": "Geändertes JSON",
    "originalPlaceholder": "Ursprüngliches JSON einfügen...",
    "modifiedPlaceholder": "Geändertes JSON einfügen..."
  },
  "it": {
    "inputsTitle": "Confronta documenti JSON",
    "swap": "Scambia",
    "format": "Formatta JSON",
    "compareNow": "Confronta ora",
    "largeModeHint": "Rilevato JSON di grandi dimensioni. Il confronto automatico è in pausa per mantenere fluida la digitazione. Fai clic su \"Confronta ora\" per aggiornare i risultati.",
    "operations": "Operazioni",
    "add": "Aggiungi",
    "remove": "Rimuovi",
    "replace": "Sostituisci",
    "originalLabel": "JSON originale",
    "modifiedLabel": "JSON modificato",
    "originalPlaceholder": "Incolla il JSON originale...",
    "modifiedPlaceholder": "Incolla il JSON modificato..."
  },
  "ja": {
    "inputsTitle": "JSON ドキュメントを比較",
    "swap": "入れ替え",
    "format": "JSON を整形",
    "compareNow": "今すぐ比較",
    "largeModeHint": "大きな JSON が検出されました。入力の応答性を保つため自動比較を一時停止しています。結果を更新するには「今すぐ比較」をクリックしてください。",
    "operations": "操作",
    "add": "追加",
    "remove": "削除",
    "replace": "置換",
    "originalLabel": "元の JSON",
    "modifiedLabel": "変更後の JSON",
    "originalPlaceholder": "元の JSON を貼り付け...",
    "modifiedPlaceholder": "変更後の JSON を貼り付け..."
  },
  "ko": {
    "inputsTitle": "JSON 문서 비교",
    "swap": "교체",
    "format": "JSON 포맷",
    "compareNow": "지금 비교",
    "largeModeHint": "큰 JSON이 감지되었습니다. 입력 반응성을 유지하기 위해 자동 비교를 일시 중지했습니다. 결과를 갱신하려면 \"지금 비교\"를 클릭하세요.",
    "operations": "작업",
    "add": "추가",
    "remove": "삭제",
    "replace": "교체",
    "originalLabel": "원본 JSON",
    "modifiedLabel": "수정된 JSON",
    "originalPlaceholder": "원본 JSON 붙여넣기...",
    "modifiedPlaceholder": "수정된 JSON 붙여넣기..."
  },
  "ru": {
    "inputsTitle": "Сравнить JSON-документы",
    "swap": "Поменять местами",
    "format": "Форматировать JSON",
    "compareNow": "Сравнить сейчас",
    "largeModeHint": "Обнаружен большой JSON. Автосравнение приостановлено, чтобы ввод оставался плавным. Нажмите \"Сравнить сейчас\", чтобы обновить результат.",
    "operations": "Операции",
    "add": "Добавить",
    "remove": "Удалить",
    "replace": "Заменить",
    "originalLabel": "Исходный JSON",
    "modifiedLabel": "Изменённый JSON",
    "originalPlaceholder": "Вставьте исходный JSON...",
    "modifiedPlaceholder": "Вставьте изменённый JSON..."
  },
  "pt": {
    "inputsTitle": "Comparar documentos JSON",
    "swap": "Trocar",
    "format": "Formatar JSON",
    "compareNow": "Comparar agora",
    "largeModeHint": "JSON grande detectado. A comparação automática foi pausada para manter a digitação responsiva. Clique em \"Comparar agora\" para atualizar os resultados.",
    "operations": "Operações",
    "add": "Adicionar",
    "remove": "Remover",
    "replace": "Substituir",
    "originalLabel": "JSON original",
    "modifiedLabel": "JSON modificado",
    "originalPlaceholder": "Cole o JSON original...",
    "modifiedPlaceholder": "Cole o JSON modificado..."
  },
  "ar": {
    "inputsTitle": "مقارنة مستندات JSON",
    "swap": "تبديل",
    "format": "تنسيق JSON",
    "compareNow": "قارن الآن",
    "largeModeHint": "تم اكتشاف JSON كبير. تم إيقاف المقارنة التلقائية مؤقتًا للحفاظ على سلاسة الكتابة. انقر \"قارن الآن\" لتحديث النتائج.",
    "operations": "العمليات",
    "add": "إضافة",
    "remove": "حذف",
    "replace": "استبدال",
    "originalLabel": "JSON الأصلي",
    "modifiedLabel": "JSON المعدل",
    "originalPlaceholder": "الصق JSON الأصلي...",
    "modifiedPlaceholder": "الصق JSON المعدل..."
  },
  "hi": {
    "inputsTitle": "JSON दस्तावेज़ों की तुलना करें",
    "swap": "अदला-बदली",
    "format": "JSON फ़ॉर्मेट करें",
    "compareNow": "अभी तुलना करें",
    "largeModeHint": "बड़ा JSON मिला है। टाइपिंग को सुचारु रखने के लिए ऑटो तुलना रोकी गई है। परिणाम अपडेट करने के लिए \"अभी तुलना करें\" पर क्लिक करें।",
    "operations": "ऑपरेशन",
    "add": "जोड़ें",
    "remove": "हटाएँ",
    "replace": "बदलें",
    "originalLabel": "मूल JSON",
    "modifiedLabel": "संशोधित JSON",
    "originalPlaceholder": "मूल JSON पेस्ट करें...",
    "modifiedPlaceholder": "संशोधित JSON पेस्ट करें..."
  },
  "tr": {
    "inputsTitle": "JSON belgelerini karşılaştır",
    "swap": "Yer değiştir",
    "format": "JSON biçimlendir",
    "compareNow": "Şimdi karşılaştır",
    "largeModeHint": "Büyük JSON algılandı. Yazma akıcılığını korumak için otomatik karşılaştırma duraklatıldı. Sonuçları yenilemek için \"Şimdi karşılaştır\" seçeneğine tıklayın.",
    "operations": "İşlemler",
    "add": "Ekle",
    "remove": "Kaldır",
    "replace": "Değiştir",
    "originalLabel": "Orijinal JSON",
    "modifiedLabel": "Değiştirilmiş JSON",
    "originalPlaceholder": "Orijinal JSON yapıştırın...",
    "modifiedPlaceholder": "Değiştirilmiş JSON yapıştırın..."
  },
  "nl": {
    "inputsTitle": "JSON-documenten vergelijken",
    "swap": "Wisselen",
    "format": "JSON opmaken",
    "compareNow": "Nu vergelijken",
    "largeModeHint": "Grote JSON gedetecteerd. Automatisch vergelijken is gepauzeerd om typen soepel te houden. Klik op \"Nu vergelijken\" om resultaten te verversen.",
    "operations": "Bewerkingen",
    "add": "Toevoegen",
    "remove": "Verwijderen",
    "replace": "Vervangen",
    "originalLabel": "Originele JSON",
    "modifiedLabel": "Gewijzigde JSON",
    "originalPlaceholder": "Plak originele JSON...",
    "modifiedPlaceholder": "Plak gewijzigde JSON..."
  },
  "sv": {
    "inputsTitle": "Jämför JSON-dokument",
    "swap": "Byt plats",
    "format": "Formatera JSON",
    "compareNow": "Jämför nu",
    "largeModeHint": "Stor JSON upptäcktes. Automatisk jämförelse pausades för att behålla responsiv inmatning. Klicka på \"Jämför nu\" för att uppdatera resultat.",
    "operations": "Operationer",
    "add": "Lägg till",
    "remove": "Ta bort",
    "replace": "Ersätt",
    "originalLabel": "Ursprunglig JSON",
    "modifiedLabel": "Ändrad JSON",
    "originalPlaceholder": "Klistra in ursprunglig JSON...",
    "modifiedPlaceholder": "Klistra in ändrad JSON..."
  },
  "pl": {
    "inputsTitle": "Porównaj dokumenty JSON",
    "swap": "Zamień",
    "format": "Formatuj JSON",
    "compareNow": "Porównaj teraz",
    "largeModeHint": "Wykryto duży JSON. Automatyczne porównanie zostało wstrzymane, aby zachować płynność pisania. Kliknij „Porównaj teraz”, aby odświeżyć wynik.",
    "operations": "Operacje",
    "add": "Dodaj",
    "remove": "Usuń",
    "replace": "Zastąp",
    "originalLabel": "Oryginalny JSON",
    "modifiedLabel": "Zmodyfikowany JSON",
    "originalPlaceholder": "Wklej oryginalny JSON...",
    "modifiedPlaceholder": "Wklej zmodyfikowany JSON..."
  },
  "vi": {
    "inputsTitle": "So sánh tài liệu JSON",
    "swap": "Hoán đổi",
    "format": "Định dạng JSON",
    "compareNow": "So sánh ngay",
    "largeModeHint": "Phát hiện JSON lớn. So sánh tự động đã tạm dừng để giữ nhập liệu mượt mà. Nhấn \"So sánh ngay\" để cập nhật kết quả.",
    "operations": "Thao tác",
    "add": "Thêm",
    "remove": "Xóa",
    "replace": "Thay thế",
    "originalLabel": "JSON gốc",
    "modifiedLabel": "JSON đã sửa",
    "originalPlaceholder": "Dán JSON gốc...",
    "modifiedPlaceholder": "Dán JSON đã sửa..."
  },
  "th": {
    "inputsTitle": "เปรียบเทียบเอกสาร JSON",
    "swap": "สลับ",
    "format": "จัดรูปแบบ JSON",
    "compareNow": "เปรียบเทียบทันที",
    "largeModeHint": "ตรวจพบ JSON ขนาดใหญ่ ระบบหยุดการเปรียบเทียบอัตโนมัติชั่วคราวเพื่อให้พิมพ์ได้ลื่นไหล คลิก \"เปรียบเทียบทันที\" เพื่ออัปเดตผลลัพธ์",
    "operations": "การดำเนินการ",
    "add": "เพิ่ม",
    "remove": "ลบ",
    "replace": "แทนที่",
    "originalLabel": "JSON ต้นฉบับ",
    "modifiedLabel": "JSON ที่แก้ไข",
    "originalPlaceholder": "วาง JSON ต้นฉบับ...",
    "modifiedPlaceholder": "วาง JSON ที่แก้ไข..."
  },
  "id": {
    "inputsTitle": "Bandingkan dokumen JSON",
    "swap": "Tukar",
    "format": "Format JSON",
    "compareNow": "Bandingkan sekarang",
    "largeModeHint": "JSON besar terdeteksi. Perbandingan otomatis dijeda agar pengetikan tetap responsif. Klik \"Bandingkan sekarang\" untuk memperbarui hasil.",
    "operations": "Operasi",
    "add": "Tambah",
    "remove": "Hapus",
    "replace": "Ganti",
    "originalLabel": "JSON asli",
    "modifiedLabel": "JSON yang diubah",
    "originalPlaceholder": "Tempel JSON asli...",
    "modifiedPlaceholder": "Tempel JSON yang diubah..."
  },
  "he": {
    "inputsTitle": "השוואת מסמכי JSON",
    "swap": "החלפה",
    "format": "עיצוב JSON",
    "compareNow": "השווה עכשיו",
    "largeModeHint": "זוהה JSON גדול. ההשוואה האוטומטית הושהתה כדי לשמור על כתיבה רציפה. לחץ על \"השווה עכשיו\" כדי לרענן את התוצאות.",
    "operations": "פעולות",
    "add": "הוספה",
    "remove": "הסרה",
    "replace": "החלפה",
    "originalLabel": "JSON מקורי",
    "modifiedLabel": "JSON מעודכן",
    "originalPlaceholder": "הדבק JSON מקורי...",
    "modifiedPlaceholder": "הדבק JSON מעודכן..."
  },
  "ms": {
    "inputsTitle": "Bandingkan dokumen JSON",
    "swap": "Tukar",
    "format": "Format JSON",
    "compareNow": "Bandingkan sekarang",
    "largeModeHint": "JSON besar dikesan. Perbandingan automatik dijeda untuk memastikan penaipan kekal lancar. Klik \"Bandingkan sekarang\" untuk mengemas kini hasil.",
    "operations": "Operasi",
    "add": "Tambah",
    "remove": "Buang",
    "replace": "Ganti",
    "originalLabel": "JSON asal",
    "modifiedLabel": "JSON diubah",
    "originalPlaceholder": "Tampal JSON asal...",
    "modifiedPlaceholder": "Tampal JSON diubah..."
  },
  "no": {
    "inputsTitle": "Sammenlign JSON-dokumenter",
    "swap": "Bytt",
    "format": "Formater JSON",
    "compareNow": "Sammenlign nå",
    "largeModeHint": "Stor JSON oppdaget. Automatisk sammenligning er satt på pause for å holde skrivingen responsiv. Klikk \"Sammenlign nå\" for å oppdatere resultatene.",
    "operations": "Operasjoner",
    "add": "Legg til",
    "remove": "Fjern",
    "replace": "Erstatt",
    "originalLabel": "Opprinnelig JSON",
    "modifiedLabel": "Endret JSON",
    "originalPlaceholder": "Lim inn opprinnelig JSON...",
    "modifiedPlaceholder": "Lim inn endret JSON..."
  }
}
</i18n>
