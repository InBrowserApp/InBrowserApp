<template>
  <ToolSectionHeader>{{ t('results') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-input
        :value="output"
        class="monospace-output"
        type="textarea"
        readonly
        :autosize="{ minRows: 4, maxRows: 12 }"
        :placeholder="t('placeholder')"
      />
      <n-flex>
        <CopyToClipboardButton :content="output" />
        <RegenerateButton @click="emit('regenerate')" />
      </n-flex>
      <n-text v-if="output" depth="3">
        {{ t('generatedAt', { seconds: generatedAtUnixSeconds }) }}
      </n-text>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFlex, NInput, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton, RegenerateButton } from '@shared/ui/base'

defineProps<{
  output: string
  generatedAtUnixSeconds: number
}>()

const emit = defineEmits<{
  (event: 'regenerate'): void
}>()

const { t } = useI18n()
</script>

<style scoped>
.monospace-output :deep(textarea) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}
</style>

<i18n lang="json">
{
  "en": {
    "results": "Results",
    "placeholder": "Generated KSUIDs will appear here...",
    "generatedAt": "Generated with Unix time: {seconds}"
  },
  "zh": {
    "results": "结果",
    "placeholder": "生成的 KSUID 将显示在这里...",
    "generatedAt": "生成所用 Unix 时间：{seconds}"
  },
  "zh-CN": {
    "results": "结果",
    "placeholder": "生成的 KSUID 将显示在这里...",
    "generatedAt": "生成所用 Unix 时间：{seconds}"
  },
  "zh-TW": {
    "results": "結果",
    "placeholder": "產生的 KSUID 會顯示在這裡...",
    "generatedAt": "生成所用 Unix 時間：{seconds}"
  },
  "zh-HK": {
    "results": "結果",
    "placeholder": "產生的 KSUID 會顯示在這裡...",
    "generatedAt": "生成所用 Unix 時間：{seconds}"
  },
  "es": {
    "results": "Resultados",
    "placeholder": "Los KSUID generados aparecerán aquí...",
    "generatedAt": "Generado con tiempo Unix: {seconds}"
  },
  "fr": {
    "results": "Résultats",
    "placeholder": "Les KSUID générés apparaîtront ici...",
    "generatedAt": "Généré avec l'heure Unix : {seconds}"
  },
  "de": {
    "results": "Ergebnisse",
    "placeholder": "Generierte KSUIDs erscheinen hier...",
    "generatedAt": "Erzeugt mit Unix-Zeit: {seconds}"
  },
  "it": {
    "results": "Risultati",
    "placeholder": "I KSUID generati appariranno qui...",
    "generatedAt": "Generato con tempo Unix: {seconds}"
  },
  "ja": {
    "results": "結果",
    "placeholder": "生成された KSUID がここに表示されます...",
    "generatedAt": "使用した Unix 時間: {seconds}"
  },
  "ko": {
    "results": "결과",
    "placeholder": "생성된 KSUID가 여기에 표시됩니다...",
    "generatedAt": "사용된 Unix 시간: {seconds}"
  },
  "ru": {
    "results": "Результаты",
    "placeholder": "Сгенерированные KSUID появятся здесь...",
    "generatedAt": "Сгенерировано с Unix-временем: {seconds}"
  },
  "pt": {
    "results": "Resultados",
    "placeholder": "Os KSUIDs gerados aparecerão aqui...",
    "generatedAt": "Gerado com tempo Unix: {seconds}"
  },
  "ar": {
    "results": "النتائج",
    "placeholder": "ستظهر KSUIDs المُولَّدة هنا...",
    "generatedAt": "تم الإنشاء باستخدام وقت Unix: {seconds}"
  },
  "hi": {
    "results": "परिणाम",
    "placeholder": "जनरेट किए गए KSUID यहाँ दिखेंगे...",
    "generatedAt": "Unix समय के साथ जनरेट किया गया: {seconds}"
  },
  "tr": {
    "results": "Sonuçlar",
    "placeholder": "Üretilen KSUID'ler burada görünecek...",
    "generatedAt": "Unix zamanı ile üretildi: {seconds}"
  },
  "nl": {
    "results": "Resultaten",
    "placeholder": "Gegenereerde KSUID's verschijnen hier...",
    "generatedAt": "Gegenereerd met Unix-tijd: {seconds}"
  },
  "sv": {
    "results": "Resultat",
    "placeholder": "Genererade KSUID visas här...",
    "generatedAt": "Genererad med Unix-tid: {seconds}"
  },
  "pl": {
    "results": "Wyniki",
    "placeholder": "Wygenerowane KSUID pojawią się tutaj...",
    "generatedAt": "Wygenerowano z czasem Unix: {seconds}"
  },
  "vi": {
    "results": "Kết quả",
    "placeholder": "KSUID tạo ra sẽ hiển thị ở đây...",
    "generatedAt": "Tạo với thời gian Unix: {seconds}"
  },
  "th": {
    "results": "ผลลัพธ์",
    "placeholder": "KSUID ที่สร้างจะปรากฏที่นี่...",
    "generatedAt": "สร้างด้วยเวลา Unix: {seconds}"
  },
  "id": {
    "results": "Hasil",
    "placeholder": "KSUID yang dihasilkan akan muncul di sini...",
    "generatedAt": "Dihasilkan dengan waktu Unix: {seconds}"
  },
  "he": {
    "results": "תוצאות",
    "placeholder": "ה-KSUID שנוצרו יופיעו כאן...",
    "generatedAt": "נוצר עם זמן Unix: {seconds}"
  },
  "ms": {
    "results": "Hasil",
    "placeholder": "KSUID yang dijana akan muncul di sini...",
    "generatedAt": "Dijana dengan masa Unix: {seconds}"
  },
  "no": {
    "results": "Resultater",
    "placeholder": "Genererte KSUID-er vises her...",
    "generatedAt": "Generert med Unix-tid: {seconds}"
  }
}
</i18n>
