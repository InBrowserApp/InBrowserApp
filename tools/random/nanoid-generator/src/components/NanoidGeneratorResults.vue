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
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFlex, NInput } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton, RegenerateButton } from '@shared/ui/base'

defineProps<{
  output: string
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
    "placeholder": "Generated NanoIDs will appear here..."
  },
  "zh": {
    "results": "结果",
    "placeholder": "生成的 NanoID 将显示在这里..."
  },
  "zh-CN": {
    "results": "结果",
    "placeholder": "生成的 NanoID 将显示在这里..."
  },
  "zh-TW": {
    "results": "結果",
    "placeholder": "產生的 NanoID 會顯示在這裡..."
  },
  "zh-HK": {
    "results": "結果",
    "placeholder": "產生的 NanoID 會顯示在這裡..."
  },
  "es": {
    "results": "Resultados",
    "placeholder": "Los NanoID generados aparecerán aquí..."
  },
  "fr": {
    "results": "Résultats",
    "placeholder": "Les NanoID générés apparaîtront ici..."
  },
  "de": {
    "results": "Ergebnisse",
    "placeholder": "Generierte NanoIDs erscheinen hier..."
  },
  "it": {
    "results": "Risultati",
    "placeholder": "I NanoID generati appariranno qui..."
  },
  "ja": {
    "results": "結果",
    "placeholder": "生成された NanoID がここに表示されます..."
  },
  "ko": {
    "results": "결과",
    "placeholder": "생성된 NanoID가 여기에 표시됩니다..."
  },
  "ru": {
    "results": "Результаты",
    "placeholder": "Сгенерированные NanoID появятся здесь..."
  },
  "pt": {
    "results": "Resultados",
    "placeholder": "Os NanoID gerados aparecerão aqui..."
  },
  "ar": {
    "results": "النتائج",
    "placeholder": "ستظهر NanoID المُولَّدة هنا..."
  },
  "hi": {
    "results": "परिणाम",
    "placeholder": "जनरेट किए गए NanoID यहाँ दिखेंगे..."
  },
  "tr": {
    "results": "Sonuçlar",
    "placeholder": "Üretilen NanoID'ler burada görünecek..."
  },
  "nl": {
    "results": "Resultaten",
    "placeholder": "Gegenereerde NanoID's verschijnen hier..."
  },
  "sv": {
    "results": "Resultat",
    "placeholder": "Genererade NanoID visas här..."
  },
  "pl": {
    "results": "Wyniki",
    "placeholder": "Wygenerowane NanoID pojawią się tutaj..."
  },
  "vi": {
    "results": "Kết quả",
    "placeholder": "NanoID tạo ra sẽ hiển thị ở đây..."
  },
  "th": {
    "results": "ผลลัพธ์",
    "placeholder": "NanoID ที่สร้างจะปรากฏที่นี่..."
  },
  "id": {
    "results": "Hasil",
    "placeholder": "NanoID yang dihasilkan akan muncul di sini..."
  },
  "he": {
    "results": "תוצאות",
    "placeholder": "ה-NanoID שנוצרו יופיעו כאן..."
  },
  "ms": {
    "results": "Hasil",
    "placeholder": "NanoID yang dijana akan muncul di sini..."
  },
  "no": {
    "results": "Resultater",
    "placeholder": "Genererte NanoID-er vises her..."
  }
}
</i18n>
