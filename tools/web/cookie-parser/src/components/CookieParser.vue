<template>
  <div>
    <ToolSectionHeader>{{ t('options') }}</ToolSectionHeader>
    <ToolSection>
      <n-form-item :label="t('header-type')" label-placement="left" :show-feedback="false">
        <n-select v-model:value="headerType" :options="headerOptions" style="width: 220px" />
      </n-form-item>
    </ToolSection>

    <ToolSectionHeader>{{ t('input-title') }}</ToolSectionHeader>
    <ToolSection>
      <n-input
        v-model:value="inputText"
        class="monospace-input"
        type="textarea"
        :autosize="{ minRows: 6, maxRows: 14 }"
        :placeholder="t('input-placeholder')"
      />
    </ToolSection>

    <ToolSectionHeader>{{ t('output-title') }}</ToolSectionHeader>
    <ToolSection>
      <n-input
        :value="outputText"
        class="monospace-output"
        type="textarea"
        :autosize="{ minRows: 6, maxRows: 16 }"
        :placeholder="t('output-placeholder')"
        readonly
      />
    </ToolSection>
    <ToolSection>
      <n-flex align="center" justify="space-between">
        <n-flex align="center" :size="8">
          <CopyToClipboardButton :content="outputText" />
          <n-button
            tag="a"
            text
            :href="downloadUrl ?? undefined"
            :download="downloadName"
            :disabled="!downloadBlob"
          >
            <template #icon>
              <n-icon :component="ArrowDownload16Regular" />
            </template>
            {{ t('download') }}
          </n-button>
        </n-flex>
        <n-text v-show="error" type="error">{{ error }}</n-text>
      </n-flex>
    </ToolSection>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useObjectUrl, useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NFormItem, NIcon, NInput, NSelect, NText } from 'naive-ui'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { parseCookieHeader, parseSetCookieHeaders } from '@utils/cookie'

type HeaderType = 'cookie' | 'set-cookie'

const { t } = useI18n()

const headerType = useStorage<HeaderType>('tools:cookie-parser:type', 'cookie')
const inputText = useStorage(
  'tools:cookie-parser:input',
  'Cookie: session=abc123; theme=light; logged_in=true',
)

const headerOptions = computed(() => [
  { label: t('header-cookie'), value: 'cookie' as HeaderType },
  { label: t('header-set-cookie'), value: 'set-cookie' as HeaderType },
])

const parsed = computed(() =>
  headerType.value === 'cookie'
    ? parseCookieHeader(inputText.value)
    : parseSetCookieHeaders(inputText.value),
)

const hasInput = computed(() => inputText.value.trim().length > 0)
const outputText = computed(() => (hasInput.value ? JSON.stringify(parsed.value, null, 2) : ''))

const error = computed(() => {
  if (!hasInput.value) return ''
  if (parsed.value.cookies.length === 0) return t('no-cookies')
  return ''
})

const downloadName = computed(() =>
  headerType.value === 'cookie' ? 'cookies.json' : 'set-cookie.json',
)

const downloadBlob = computed(() =>
  outputText.value
    ? new Blob([outputText.value], { type: 'application/json;charset=utf-8' })
    : null,
)
const downloadUrl = useObjectUrl(downloadBlob)
</script>

<style scoped>
.monospace-input :deep(textarea),
.monospace-output :deep(textarea) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}
</style>

<i18n lang="json">
{
  "en": {
    "options": "Options",
    "header-type": "Header Type",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "Input",
    "input-placeholder": "Paste Cookie or Set-Cookie headers here...",
    "output-title": "Parsed JSON",
    "output-placeholder": "Parsed output will appear here...",
    "download": "Download JSON",
    "no-cookies": "No cookies found"
  },
  "zh": {
    "options": "选项",
    "header-type": "头部类型",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "输入",
    "input-placeholder": "在此粘贴 Cookie 或 Set-Cookie 头...",
    "output-title": "解析后的 JSON",
    "output-placeholder": "解析结果将显示在这里...",
    "download": "下载 JSON",
    "no-cookies": "未找到 Cookie"
  },
  "zh-CN": {
    "options": "选项",
    "header-type": "头部类型",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "输入",
    "input-placeholder": "在此粘贴 Cookie 或 Set-Cookie 头...",
    "output-title": "解析后的 JSON",
    "output-placeholder": "解析结果将显示在这里...",
    "download": "下载 JSON",
    "no-cookies": "未找到 Cookie"
  },
  "zh-TW": {
    "options": "選項",
    "header-type": "標頭類型",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "輸入",
    "input-placeholder": "在此貼上 Cookie 或 Set-Cookie 標頭...",
    "output-title": "解析後的 JSON",
    "output-placeholder": "解析結果會顯示在這裡...",
    "download": "下載 JSON",
    "no-cookies": "找不到 Cookie"
  },
  "zh-HK": {
    "options": "選項",
    "header-type": "標頭類型",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "輸入",
    "input-placeholder": "在此貼上 Cookie 或 Set-Cookie 標頭...",
    "output-title": "解析後的 JSON",
    "output-placeholder": "解析結果會顯示在這裡...",
    "download": "下載 JSON",
    "no-cookies": "找不到 Cookie"
  },
  "es": {
    "options": "Opciones",
    "header-type": "Tipo de encabezado",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "Entrada",
    "input-placeholder": "Pega encabezados Cookie o Set-Cookie aquí...",
    "output-title": "JSON analizado",
    "output-placeholder": "La salida analizada aparecerá aquí...",
    "download": "Descargar JSON",
    "no-cookies": "No se encontraron cookies"
  },
  "fr": {
    "options": "Options",
    "header-type": "Type d’en-tête",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "Entrée",
    "input-placeholder": "Collez les en-têtes Cookie ou Set-Cookie ici...",
    "output-title": "JSON analysé",
    "output-placeholder": "La sortie analysée apparaîtra ici...",
    "download": "Télécharger JSON",
    "no-cookies": "Aucun cookie trouvé"
  },
  "de": {
    "options": "Optionen",
    "header-type": "Header-Typ",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "Eingabe",
    "input-placeholder": "Cookie- oder Set-Cookie-Header hier einfügen...",
    "output-title": "Geparstes JSON",
    "output-placeholder": "Die geparste Ausgabe erscheint hier...",
    "download": "JSON herunterladen",
    "no-cookies": "Keine Cookies gefunden"
  },
  "it": {
    "options": "Opzioni",
    "header-type": "Tipo di header",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "Input",
    "input-placeholder": "Incolla qui gli header Cookie o Set-Cookie...",
    "output-title": "JSON analizzato",
    "output-placeholder": "L’output analizzato apparirà qui...",
    "download": "Scarica JSON",
    "no-cookies": "Nessun cookie trovato"
  },
  "ja": {
    "options": "オプション",
    "header-type": "ヘッダー種別",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "入力",
    "input-placeholder": "Cookie または Set-Cookie ヘッダーを貼り付けてください...",
    "output-title": "解析済み JSON",
    "output-placeholder": "解析結果がここに表示されます...",
    "download": "JSON をダウンロード",
    "no-cookies": "Cookie が見つかりません"
  },
  "ko": {
    "options": "옵션",
    "header-type": "헤더 유형",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "입력",
    "input-placeholder": "Cookie 또는 Set-Cookie 헤더를 붙여넣으세요...",
    "output-title": "파싱된 JSON",
    "output-placeholder": "파싱 결과가 여기에 표시됩니다...",
    "download": "JSON 다운로드",
    "no-cookies": "쿠키를 찾을 수 없습니다"
  },
  "ru": {
    "options": "Параметры",
    "header-type": "Тип заголовка",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "Ввод",
    "input-placeholder": "Вставьте заголовки Cookie или Set-Cookie здесь...",
    "output-title": "Разобранный JSON",
    "output-placeholder": "Результат разборки появится здесь...",
    "download": "Скачать JSON",
    "no-cookies": "Cookie не найдены"
  },
  "pt": {
    "options": "Opções",
    "header-type": "Tipo de cabeçalho",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "Entrada",
    "input-placeholder": "Cole os cabeçalhos Cookie ou Set-Cookie aqui...",
    "output-title": "JSON analisado",
    "output-placeholder": "A saída analisada aparecerá aqui...",
    "download": "Baixar JSON",
    "no-cookies": "Nenhum cookie encontrado"
  },
  "ar": {
    "options": "خيارات",
    "header-type": "نوع الترويسة",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "الإدخال",
    "input-placeholder": "الصق ترويسات Cookie أو Set-Cookie هنا...",
    "output-title": "JSON المُحلَّل",
    "output-placeholder": "سيظهر الإخراج المُحلَّل هنا...",
    "download": "تنزيل JSON",
    "no-cookies": "لم يتم العثور على أي ملفات تعريف ارتباط"
  },
  "hi": {
    "options": "विकल्प",
    "header-type": "हेडर प्रकार",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "इनपुट",
    "input-placeholder": "यहां Cookie या Set-Cookie हेडर पेस्ट करें...",
    "output-title": "पार्स किया गया JSON",
    "output-placeholder": "पार्स आउटपुट यहां दिखाई देगा...",
    "download": "JSON डाउनलोड करें",
    "no-cookies": "कोई कुकी नहीं मिली"
  },
  "tr": {
    "options": "Seçenekler",
    "header-type": "Başlık Türü",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "Girdi",
    "input-placeholder": "Cookie veya Set-Cookie başlıklarını buraya yapıştırın...",
    "output-title": "Ayrıştırılmış JSON",
    "output-placeholder": "Ayrıştırılmış çıktı burada görünecek...",
    "download": "JSON İndir",
    "no-cookies": "Çerez bulunamadı"
  },
  "nl": {
    "options": "Opties",
    "header-type": "Header-type",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "Invoer",
    "input-placeholder": "Plak Cookie- of Set-Cookie-headers hier...",
    "output-title": "Geparseerde JSON",
    "output-placeholder": "De geparste uitvoer verschijnt hier...",
    "download": "JSON downloaden",
    "no-cookies": "Geen cookies gevonden"
  },
  "sv": {
    "options": "Alternativ",
    "header-type": "Header-typ",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "Inmatning",
    "input-placeholder": "Klistra in Cookie- eller Set-Cookie-headers här...",
    "output-title": "Tolkad JSON",
    "output-placeholder": "Den tolkade utdata visas här...",
    "download": "Ladda ner JSON",
    "no-cookies": "Inga cookies hittades"
  },
  "pl": {
    "options": "Opcje",
    "header-type": "Typ nagłówka",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "Wejście",
    "input-placeholder": "Wklej tutaj nagłówki Cookie lub Set-Cookie...",
    "output-title": "Sparsowany JSON",
    "output-placeholder": "Sparsowane dane pojawią się tutaj...",
    "download": "Pobierz JSON",
    "no-cookies": "Nie znaleziono ciasteczek"
  },
  "vi": {
    "options": "Tùy chọn",
    "header-type": "Loại header",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "Đầu vào",
    "input-placeholder": "Dán header Cookie hoặc Set-Cookie vào đây...",
    "output-title": "JSON đã phân tích",
    "output-placeholder": "Kết quả sẽ hiển thị ở đây...",
    "download": "Tải JSON",
    "no-cookies": "Không tìm thấy cookie"
  },
  "th": {
    "options": "ตัวเลือก",
    "header-type": "ประเภทส่วนหัว",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "อินพุต",
    "input-placeholder": "วางส่วนหัว Cookie หรือ Set-Cookie ที่นี่...",
    "output-title": "JSON ที่แยกแล้ว",
    "output-placeholder": "ผลลัพธ์จะแสดงที่นี่...",
    "download": "ดาวน์โหลด JSON",
    "no-cookies": "ไม่พบคุกกี้"
  },
  "id": {
    "options": "Opsi",
    "header-type": "Jenis Header",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "Input",
    "input-placeholder": "Tempel header Cookie atau Set-Cookie di sini...",
    "output-title": "JSON hasil parsing",
    "output-placeholder": "Hasil parsing akan muncul di sini...",
    "download": "Unduh JSON",
    "no-cookies": "Cookie tidak ditemukan"
  },
  "he": {
    "options": "אפשרויות",
    "header-type": "סוג כותרת",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "קלט",
    "input-placeholder": "הדביקו כאן כותרות Cookie או Set-Cookie...",
    "output-title": "JSON מפוענח",
    "output-placeholder": "הפלט המפוענח יופיע כאן...",
    "download": "הורד JSON",
    "no-cookies": "לא נמצאו עוגיות"
  },
  "ms": {
    "options": "Pilihan",
    "header-type": "Jenis Pengepala",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "Input",
    "input-placeholder": "Tampal pengepala Cookie atau Set-Cookie di sini...",
    "output-title": "JSON terhurai",
    "output-placeholder": "Output terhurai akan dipaparkan di sini...",
    "download": "Muat turun JSON",
    "no-cookies": "Tiada cookie ditemui"
  },
  "no": {
    "options": "Alternativer",
    "header-type": "Header-type",
    "header-cookie": "Cookie",
    "header-set-cookie": "Set-Cookie",
    "input-title": "Inndata",
    "input-placeholder": "Lim inn Cookie- eller Set-Cookie-headere her...",
    "output-title": "Tolket JSON",
    "output-placeholder": "Tolket output vises her...",
    "download": "Last ned JSON",
    "no-cookies": "Ingen cookies funnet"
  }
}
</i18n>
