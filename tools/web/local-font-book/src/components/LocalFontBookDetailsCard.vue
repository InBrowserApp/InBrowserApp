<template>
  <n-card :title="t('details-title')" class="details-card">
    <n-descriptions label-placement="left" bordered :column="1" content-style="width: 100%">
      <n-descriptions-item>
        <template #label>
          <span class="details-label">{{ t('details-family') }}</span>
        </template>
        <CopyToClipboardTooltip :content="activeFont?.family || ''" #="{ copy }">
          <n-text
            class="details-value"
            :class="{ 'details-value--empty': !activeFont?.family }"
            @click="activeFont?.family ? copy() : undefined"
          >
            {{ activeFont?.family || '--' }}
          </n-text>
        </CopyToClipboardTooltip>
      </n-descriptions-item>
      <n-descriptions-item>
        <template #label>
          <span class="details-label">{{ t('details-full-name') }}</span>
        </template>
        <CopyToClipboardTooltip :content="activeFont?.fullName || ''" #="{ copy }">
          <n-text
            class="details-value"
            :class="{ 'details-value--empty': !activeFont?.fullName }"
            @click="activeFont?.fullName ? copy() : undefined"
          >
            {{ activeFont?.fullName || '--' }}
          </n-text>
        </CopyToClipboardTooltip>
      </n-descriptions-item>
      <n-descriptions-item>
        <template #label>
          <span class="details-label">{{ t('details-postscript') }}</span>
        </template>
        <CopyToClipboardTooltip :content="activeFont?.postscriptName || ''" #="{ copy }">
          <n-text
            class="details-value"
            :class="{ 'details-value--empty': !activeFont?.postscriptName }"
            @click="activeFont?.postscriptName ? copy() : undefined"
          >
            {{ activeFont?.postscriptName || '--' }}
          </n-text>
        </CopyToClipboardTooltip>
      </n-descriptions-item>
      <n-descriptions-item>
        <template #label>
          <span class="details-label">{{ t('details-style') }}</span>
        </template>
        <CopyToClipboardTooltip :content="activeFont?.style || ''" #="{ copy }">
          <n-text
            class="details-value"
            :class="{ 'details-value--empty': !activeFont?.style }"
            @click="activeFont?.style ? copy() : undefined"
          >
            {{ activeFont?.style || '--' }}
          </n-text>
        </CopyToClipboardTooltip>
      </n-descriptions-item>
    </n-descriptions>
    <div class="css-output">
      <n-text strong>{{ t('css-title') }}</n-text>
      <CopyToClipboardTooltip :content="cssSnippet" #="{ copy }">
        <span class="css-snippet-trigger" @click="cssSnippet ? copy() : undefined">
          <n-code :code="cssSnippet" word-wrap class="css-snippet" data-testid="css-snippet" />
        </span>
      </CopyToClipboardTooltip>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NCode, NDescriptions, NDescriptionsItem, NText } from 'naive-ui'
import { CopyToClipboardTooltip } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'
import type { DisplayFont } from './types'

defineProps<{
  activeFont?: DisplayFont
  cssSnippet: string
}>()

const { t } = useI18n()
</script>

<style scoped>
.details-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.details-label {
  white-space: nowrap;
}

.details-value {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.details-value--empty {
  cursor: default;
}

.details-value:not(.details-value--empty):hover {
  text-decoration: underline;
}

.css-output {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.css-snippet-trigger {
  display: inline-flex;
  max-width: 100%;
  cursor: pointer;
}

.css-snippet :deep(pre) {
  display: inline-block;
  max-width: 100%;
  white-space: pre-wrap;
}
</style>

<i18n lang="json">
{
  "en": {
    "details-title": "Font details",
    "details-family": "Family",
    "details-full-name": "Full name",
    "details-postscript": "PostScript name",
    "details-style": "Style",
    "css-title": "CSS snippet"
  },
  "zh": {
    "details-title": "字体详情",
    "details-family": "家族",
    "details-full-name": "完整名称",
    "details-postscript": "PostScript 名称",
    "details-style": "样式",
    "css-title": "CSS 代码"
  },
  "zh-CN": {
    "details-title": "字体详情",
    "details-family": "家族",
    "details-full-name": "完整名称",
    "details-postscript": "PostScript 名称",
    "details-style": "样式",
    "css-title": "CSS 代码"
  },
  "zh-TW": {
    "details-title": "字型詳情",
    "details-family": "家族",
    "details-full-name": "完整名稱",
    "details-postscript": "PostScript 名稱",
    "details-style": "樣式",
    "css-title": "CSS 片段"
  },
  "zh-HK": {
    "details-title": "字體詳情",
    "details-family": "家族",
    "details-full-name": "完整名稱",
    "details-postscript": "PostScript 名稱",
    "details-style": "樣式",
    "css-title": "CSS 片段"
  },
  "es": {
    "details-title": "Detalles de la fuente",
    "details-family": "Familia",
    "details-full-name": "Nombre completo",
    "details-postscript": "Nombre PostScript",
    "details-style": "Estilo",
    "css-title": "Fragmento CSS"
  },
  "fr": {
    "details-title": "Détails de la police",
    "details-family": "Famille",
    "details-full-name": "Nom complet",
    "details-postscript": "Nom PostScript",
    "details-style": "Style",
    "css-title": "Extrait CSS"
  },
  "de": {
    "details-title": "Schriftdetails",
    "details-family": "Familie",
    "details-full-name": "Vollständiger Name",
    "details-postscript": "PostScript-Name",
    "details-style": "Stil",
    "css-title": "CSS-Auszug"
  },
  "it": {
    "details-title": "Dettagli del font",
    "details-family": "Famiglia",
    "details-full-name": "Nome completo",
    "details-postscript": "Nome PostScript",
    "details-style": "Stile",
    "css-title": "Snippet CSS"
  },
  "ja": {
    "details-title": "フォント詳細",
    "details-family": "ファミリー",
    "details-full-name": "フルネーム",
    "details-postscript": "PostScript 名",
    "details-style": "スタイル",
    "css-title": "CSS スニペット"
  },
  "ko": {
    "details-title": "폰트 상세",
    "details-family": "패밀리",
    "details-full-name": "전체 이름",
    "details-postscript": "PostScript 이름",
    "details-style": "스타일",
    "css-title": "CSS 스니펫"
  },
  "ru": {
    "details-title": "Детали шрифта",
    "details-family": "Семейство",
    "details-full-name": "Полное имя",
    "details-postscript": "Имя PostScript",
    "details-style": "Стиль",
    "css-title": "CSS-фрагмент"
  },
  "pt": {
    "details-title": "Detalhes da fonte",
    "details-family": "Família",
    "details-full-name": "Nome completo",
    "details-postscript": "Nome PostScript",
    "details-style": "Estilo",
    "css-title": "Trecho CSS"
  },
  "ar": {
    "details-title": "تفاصيل الخط",
    "details-family": "العائلة",
    "details-full-name": "الاسم الكامل",
    "details-postscript": "اسم PostScript",
    "details-style": "النمط",
    "css-title": "مقتطف CSS"
  },
  "hi": {
    "details-title": "फ़ॉन्ट विवरण",
    "details-family": "फ़ैमिली",
    "details-full-name": "पूरा नाम",
    "details-postscript": "PostScript नाम",
    "details-style": "स्टाइल",
    "css-title": "CSS स्निपेट"
  },
  "tr": {
    "details-title": "Yazı tipi ayrıntıları",
    "details-family": "Aile",
    "details-full-name": "Tam ad",
    "details-postscript": "PostScript adı",
    "details-style": "Stil",
    "css-title": "CSS parçası"
  },
  "nl": {
    "details-title": "Lettertypedetails",
    "details-family": "Familie",
    "details-full-name": "Volledige naam",
    "details-postscript": "PostScript-naam",
    "details-style": "Stijl",
    "css-title": "CSS-fragment"
  },
  "sv": {
    "details-title": "Typsnittdetaljer",
    "details-family": "Familj",
    "details-full-name": "Fullständigt namn",
    "details-postscript": "PostScript-namn",
    "details-style": "Stil",
    "css-title": "CSS-snutt"
  },
  "pl": {
    "details-title": "Szczegóły fontu",
    "details-family": "Rodzina",
    "details-full-name": "Pełna nazwa",
    "details-postscript": "Nazwa PostScript",
    "details-style": "Styl",
    "css-title": "Fragment CSS"
  },
  "vi": {
    "details-title": "Chi tiết phông chữ",
    "details-family": "Họ",
    "details-full-name": "Tên đầy đủ",
    "details-postscript": "Tên PostScript",
    "details-style": "Kiểu",
    "css-title": "Đoạn CSS"
  },
  "th": {
    "details-title": "รายละเอียดฟอนต์",
    "details-family": "ตระกูล",
    "details-full-name": "ชื่อเต็ม",
    "details-postscript": "ชื่อ PostScript",
    "details-style": "สไตล์",
    "css-title": "ตัวอย่าง CSS"
  },
  "id": {
    "details-title": "Detail font",
    "details-family": "Keluarga",
    "details-full-name": "Nama lengkap",
    "details-postscript": "Nama PostScript",
    "details-style": "Gaya",
    "css-title": "Cuplikan CSS"
  },
  "he": {
    "details-title": "פרטי גופן",
    "details-family": "משפחה",
    "details-full-name": "שם מלא",
    "details-postscript": "שם PostScript",
    "details-style": "סגנון",
    "css-title": "קטע CSS"
  },
  "ms": {
    "details-title": "Butiran fon",
    "details-family": "Keluarga",
    "details-full-name": "Nama penuh",
    "details-postscript": "Nama PostScript",
    "details-style": "Gaya",
    "css-title": "Petikan CSS"
  },
  "no": {
    "details-title": "Fontdetaljer",
    "details-family": "Familie",
    "details-full-name": "Fullt navn",
    "details-postscript": "PostScript-navn",
    "details-style": "Stil",
    "css-title": "CSS-utdrag"
  }
}
</i18n>
