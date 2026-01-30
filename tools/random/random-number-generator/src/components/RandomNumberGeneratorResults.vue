<template>
  <ToolSectionHeader>{{ t('results') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-card
        embedded
        :content-style="{ padding: '12px 16px' }"
        data-testid="results-card"
        class="results-card"
        :class="{ 'is-clickable': hasResults }"
        @click="openFullscreen"
      >
        <div class="results-display">
          <div v-if="formattedNumbers.length === 1" class="hero-number" data-testid="hero-number">
            {{ formattedNumbers[0] }}
          </div>
          <n-flex v-else-if="formattedNumbers.length" wrap :size="16" class="results-tags">
            <n-tag v-for="(value, index) in formattedNumbers" :key="`${value}-${index}`" round>
              {{ value }}
            </n-tag>
          </n-flex>
          <n-text v-else depth="3">{{ t('placeholder') }}</n-text>
        </div>
      </n-card>

      <n-flex :size="12">
        <RegenerateButton
          :disabled="!canRoll && !isRolling"
          data-testid="regenerate"
          @click="emit('toggle-rolling')"
        >
          <template #icon>
            <n-icon :component="rollingIcon" />
          </template>
          <template #label>
            {{ rollingLabel }}
          </template>
        </RegenerateButton>
        <CopyToClipboardButton :content="outputText" />
        <n-button
          text
          tag="a"
          :href="outputText ? downloadUrl : undefined"
          :download="downloadName"
          :disabled="!outputText"
          data-testid="download-results"
        >
          <template #icon>
            <n-icon :component="DownloadIcon" />
          </template>
          {{ t('download') }}
        </n-button>
        <n-button
          text
          :disabled="!hasResults"
          data-testid="enter-fullscreen"
          @click="openFullscreen"
        >
          <template #icon>
            <n-icon :component="EnterFullscreenIcon" />
          </template>
          {{ t('enterFullscreen') }}
        </n-button>
      </n-flex>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useObjectUrl } from '@vueuse/core'
import { NButton, NCard, NFlex, NIcon, NTag, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton, RegenerateButton } from '@shared/ui/base'
import DownloadIcon from '@vicons/fluent/ArrowDownload16Regular'
import EnterFullscreenIcon from '@vicons/fluent/FullScreenMaximize16Regular'
import type { Component } from 'vue'

const props = defineProps<{
  formattedNumbers: string[]
  outputText: string
  canRoll: boolean
  isRolling: boolean
  rollingLabel: string
  rollingIcon: Component
}>()

const emit = defineEmits<{
  (event: 'toggle-rolling'): void
  (event: 'open-fullscreen'): void
}>()

const { t } = useI18n()

const hasResults = computed(() => props.formattedNumbers.length > 0)
const downloadName = 'random-numbers.txt'
const downloadBlob = computed(() => (props.outputText ? new Blob([props.outputText]) : null))
const downloadUrl = useObjectUrl(downloadBlob)

const openFullscreen = () => {
  if (!hasResults.value) return
  emit('open-fullscreen')
}
</script>

<style scoped>
.results-card {
  cursor: default;
}

.results-card.is-clickable {
  cursor: pointer;
}

.results-display {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  text-align: center;
  width: 100%;
}

.results-tags {
  justify-content: center;
  width: 100%;
  align-items: center;
}

.results-tags :deep(.n-tag) {
  height: auto;
  min-height: 2.8rem;
  min-width: 3.4ch;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.results-tags :deep(.n-tag__content) {
  font-size: clamp(1.4rem, 3.8vw, 2.6rem);
  font-weight: 600;
  line-height: 1;
  padding: 12px 20px;
  text-align: center;
}

.hero-number {
  font-size: clamp(2.75rem, 8vw, 4.75rem);
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>

<i18n lang="json">
{
  "en": {
    "results": "Results",
    "placeholder": "Numbers will appear here...",
    "download": "Download",
    "enterFullscreen": "Full screen"
  },
  "zh": {
    "results": "结果",
    "placeholder": "数字会显示在这里...",
    "download": "下载",
    "enterFullscreen": "全屏"
  },
  "zh-CN": {
    "results": "结果",
    "placeholder": "数字会显示在这里...",
    "download": "下载",
    "enterFullscreen": "全屏"
  },
  "zh-TW": {
    "results": "結果",
    "placeholder": "數字會顯示在這裡...",
    "download": "下載",
    "enterFullscreen": "全螢幕"
  },
  "zh-HK": {
    "results": "結果",
    "placeholder": "數字會顯示在這裡...",
    "download": "下載",
    "enterFullscreen": "全螢幕"
  },
  "es": {
    "results": "Resultados",
    "placeholder": "Los números aparecerán aquí...",
    "download": "Descargar",
    "enterFullscreen": "Pantalla completa"
  },
  "fr": {
    "results": "Résultats",
    "placeholder": "Les nombres apparaîtront ici...",
    "download": "Télécharger",
    "enterFullscreen": "Plein écran"
  },
  "de": {
    "results": "Ergebnisse",
    "placeholder": "Zahlen erscheinen hier...",
    "download": "Herunterladen",
    "enterFullscreen": "Vollbild"
  },
  "it": {
    "results": "Risultati",
    "placeholder": "I numeri appariranno qui...",
    "download": "Scarica",
    "enterFullscreen": "Schermo intero"
  },
  "ja": {
    "results": "結果",
    "placeholder": "数値はここに表示されます...",
    "download": "ダウンロード",
    "enterFullscreen": "全画面"
  },
  "ko": {
    "results": "결과",
    "placeholder": "숫자가 여기에 표시됩니다...",
    "download": "다운로드",
    "enterFullscreen": "전체 화면"
  },
  "ru": {
    "results": "Результаты",
    "placeholder": "Числа появятся здесь...",
    "download": "Скачать",
    "enterFullscreen": "Полный экран"
  },
  "pt": {
    "results": "Resultados",
    "placeholder": "Os números aparecerão aqui...",
    "download": "Baixar",
    "enterFullscreen": "Tela cheia"
  },
  "ar": {
    "results": "النتائج",
    "placeholder": "ستظهر الأرقام هنا...",
    "download": "تنزيل",
    "enterFullscreen": "ملء الشاشة"
  },
  "hi": {
    "results": "परिणाम",
    "placeholder": "संख्याएँ यहाँ दिखाई देंगी...",
    "download": "डाउनलोड",
    "enterFullscreen": "पूर्ण स्क्रीन"
  },
  "tr": {
    "results": "Sonuçlar",
    "placeholder": "Sayılar burada görünecek...",
    "download": "İndir",
    "enterFullscreen": "Tam ekran"
  },
  "nl": {
    "results": "Resultaten",
    "placeholder": "Getallen verschijnen hier...",
    "download": "Downloaden",
    "enterFullscreen": "Volledig scherm"
  },
  "sv": {
    "results": "Resultat",
    "placeholder": "Tal visas här...",
    "download": "Ladda ner",
    "enterFullscreen": "Fullskärm"
  },
  "pl": {
    "results": "Wyniki",
    "placeholder": "Liczby pojawią się tutaj...",
    "download": "Pobierz",
    "enterFullscreen": "Pełny ekran"
  },
  "vi": {
    "results": "Kết quả",
    "placeholder": "Các số sẽ hiển thị ở đây...",
    "download": "Tải xuống",
    "enterFullscreen": "Toàn màn hình"
  },
  "th": {
    "results": "ผลลัพธ์",
    "placeholder": "ตัวเลขจะแสดงที่นี่...",
    "download": "ดาวน์โหลด",
    "enterFullscreen": "เต็มหน้าจอ"
  },
  "id": {
    "results": "Hasil",
    "placeholder": "Angka akan muncul di sini...",
    "download": "Unduh",
    "enterFullscreen": "Layar penuh"
  },
  "he": {
    "results": "תוצאות",
    "placeholder": "מספרים יופיעו כאן...",
    "download": "הורדה",
    "enterFullscreen": "מסך מלא"
  },
  "ms": {
    "results": "Hasil",
    "placeholder": "Nombor akan muncul di sini...",
    "download": "Muat turun",
    "enterFullscreen": "Skrin penuh"
  },
  "no": {
    "results": "Resultater",
    "placeholder": "Tallene vises her...",
    "download": "Last ned",
    "enterFullscreen": "Fullskjerm"
  }
}
</i18n>
