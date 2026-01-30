<template>
  <n-card class="panel">
    <div class="panel__header">
      <div>
        <div class="panel__title">{{ t('outputTitle') }}</div>
        <div class="panel__subtitle">{{ t('outputSubtitle') }}</div>
      </div>
    </div>
    <n-flex vertical :size="12">
      <div class="form-row">
        <div class="form-label">{{ t('outputFormat') }}</div>
        <n-select v-model:value="outputFormatModel" :options="formatOptions" />
      </div>
      <n-input
        :value="cssOutput"
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 9 }"
        readonly
        data-testid="css-output"
      />
      <n-flex :size="8" :wrap="true">
        <CopyToClipboardButton :content="cssOutput">
          <template #label>{{ t('copyCss') }}</template>
        </CopyToClipboardButton>
        <CopyToClipboardButton :content="backgroundImageDeclaration">
          <template #label>{{ t('copyBackgroundImage') }}</template>
        </CopyToClipboardButton>
        <CopyToClipboardButton :content="backgroundShorthand">
          <template #label>{{ t('copyBackground') }}</template>
        </CopyToClipboardButton>
        <CopyToClipboardButton v-if="hasBlendModes" :content="backgroundBlendDeclaration">
          <template #label>{{ t('copyBlendMode') }}</template>
        </CopyToClipboardButton>
        <n-button
          tag="a"
          text
          :href="cssUrl ?? undefined"
          download="gradient.css"
          :disabled="!cssUrl"
          data-testid="download-css"
        >
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('downloadCss') }}
        </n-button>
      </n-flex>
    </n-flex>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NCard, NFlex, NIcon, NInput, NSelect } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import type { ColorFormat } from '../types'

const props = defineProps<{
  outputFormat: ColorFormat
  cssOutput: string
  backgroundImageDeclaration: string
  backgroundBlendDeclaration: string
  backgroundShorthand: string
  hasBlendModes: boolean
  cssUrl?: string
}>()

const emit = defineEmits<{
  (event: 'update:outputFormat', value: ColorFormat): void
}>()

const { t } = useI18n()

const outputFormatModel = computed({
  get: () => props.outputFormat,
  set: (value: ColorFormat) => emit('update:outputFormat', value),
})

const formatOptions = computed(() => [
  { label: t('format.hex'), value: 'hex' },
  { label: t('format.rgba'), value: 'rgba' },
])
</script>

<i18n lang="json">
{
  "en": {
    "outputTitle": "CSS Output",
    "outputSubtitle": "Copy CSS that matches the preview.",
    "outputFormat": "Stop format",
    "copyCss": "Copy CSS",
    "downloadCss": "Download CSS",
    "copyBackgroundImage": "Copy background-image",
    "copyBackground": "Copy background",
    "copyBlendMode": "Copy blend mode",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  },
  "zh": {
    "outputTitle": "CSS 输出",
    "outputSubtitle": "复制与预览一致的 CSS。",
    "outputFormat": "颜色格式",
    "copyCss": "复制 CSS",
    "downloadCss": "下载 CSS",
    "copyBackgroundImage": "复制 background-image",
    "copyBackground": "复制 background",
    "copyBlendMode": "复制混合模式",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  },
  "zh-CN": {
    "outputTitle": "CSS 输出",
    "outputSubtitle": "复制与预览一致的 CSS。",
    "outputFormat": "颜色格式",
    "copyCss": "复制 CSS",
    "downloadCss": "下载 CSS",
    "copyBackgroundImage": "复制 background-image",
    "copyBackground": "复制 background",
    "copyBlendMode": "复制混合模式",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  },
  "zh-TW": {
    "outputTitle": "CSS 輸出",
    "outputSubtitle": "複製與預覽一致的 CSS。",
    "outputFormat": "顏色格式",
    "copyCss": "複製 CSS",
    "downloadCss": "下載 CSS",
    "copyBackgroundImage": "複製 background-image",
    "copyBackground": "複製 background",
    "copyBlendMode": "複製混合模式",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  },
  "zh-HK": {
    "outputTitle": "CSS 輸出",
    "outputSubtitle": "複製與預覽一致的 CSS。",
    "outputFormat": "顏色格式",
    "copyCss": "複製 CSS",
    "downloadCss": "下載 CSS",
    "copyBackgroundImage": "複製 background-image",
    "copyBackground": "複製 background",
    "copyBlendMode": "複製混合模式",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  },
  "es": {
    "outputTitle": "Salida CSS",
    "outputSubtitle": "Copia el CSS que coincide con la vista previa.",
    "outputFormat": "Formato de color",
    "copyCss": "Copiar CSS",
    "downloadCss": "Descargar CSS",
    "copyBackgroundImage": "Copiar background-image",
    "copyBackground": "Copiar background",
    "copyBlendMode": "Copiar modo de mezcla",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  },
  "fr": {
    "outputTitle": "Sortie CSS",
    "outputSubtitle": "Copiez le CSS conforme à l’aperçu.",
    "outputFormat": "Format couleur",
    "copyCss": "Copier le CSS",
    "downloadCss": "Télécharger CSS",
    "copyBackgroundImage": "Copier background-image",
    "copyBackground": "Copier background",
    "copyBlendMode": "Copier le mode de fusion",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  },
  "de": {
    "outputTitle": "CSS-Ausgabe",
    "outputSubtitle": "CSS passend zur Vorschau kopieren.",
    "outputFormat": "Farbformat",
    "copyCss": "CSS kopieren",
    "downloadCss": "CSS herunterladen",
    "copyBackgroundImage": "background-image kopieren",
    "copyBackground": "background kopieren",
    "copyBlendMode": "Mischmodus kopieren",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  },
  "it": {
    "outputTitle": "Output CSS",
    "outputSubtitle": "Copia il CSS che corrisponde all’anteprima.",
    "outputFormat": "Formato colore",
    "copyCss": "Copia CSS",
    "downloadCss": "Scarica CSS",
    "copyBackgroundImage": "Copia background-image",
    "copyBackground": "Copia background",
    "copyBlendMode": "Copia modalità fusione",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  },
  "ja": {
    "outputTitle": "CSS 出力",
    "outputSubtitle": "プレビューと一致する CSS をコピー。",
    "outputFormat": "色形式",
    "copyCss": "CSS をコピー",
    "downloadCss": "CSS をダウンロード",
    "copyBackgroundImage": "background-image をコピー",
    "copyBackground": "background をコピー",
    "copyBlendMode": "ブレンドモードをコピー",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  },
  "ko": {
    "outputTitle": "CSS 출력",
    "outputSubtitle": "미리보기와 동일한 CSS를 복사합니다.",
    "outputFormat": "색상 형식",
    "copyCss": "CSS 복사",
    "downloadCss": "CSS 다운로드",
    "copyBackgroundImage": "background-image 복사",
    "copyBackground": "background 복사",
    "copyBlendMode": "블렌드 모드 복사",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  },
  "ru": {
    "outputTitle": "CSS вывод",
    "outputSubtitle": "Скопируйте CSS как в превью.",
    "outputFormat": "Формат цвета",
    "copyCss": "Копировать CSS",
    "downloadCss": "Скачать CSS",
    "copyBackgroundImage": "Копировать background-image",
    "copyBackground": "Копировать background",
    "copyBlendMode": "Копировать режим",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  },
  "pt": {
    "outputTitle": "Saída CSS",
    "outputSubtitle": "Copie o CSS que corresponde à prévia.",
    "outputFormat": "Formato de cor",
    "copyCss": "Copiar CSS",
    "downloadCss": "Baixar CSS",
    "copyBackgroundImage": "Copiar background-image",
    "copyBackground": "Copiar background",
    "copyBlendMode": "Copiar modo de mesclagem",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  },
  "ar": {
    "outputTitle": "مخرجات CSS",
    "outputSubtitle": "انسخ CSS المطابق للمعاينة.",
    "outputFormat": "تنسيق اللون",
    "copyCss": "نسخ CSS",
    "downloadCss": "تنزيل CSS",
    "copyBackgroundImage": "نسخ background-image",
    "copyBackground": "نسخ background",
    "copyBlendMode": "نسخ وضع المزج",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  },
  "hi": {
    "outputTitle": "CSS आउटपुट",
    "outputSubtitle": "पूर्वावलोकन के अनुरूप CSS कॉपी करें।",
    "outputFormat": "रंग प्रारूप",
    "copyCss": "CSS कॉपी करें",
    "downloadCss": "CSS डाउनलोड करें",
    "copyBackgroundImage": "background-image कॉपी करें",
    "copyBackground": "background कॉपी करें",
    "copyBlendMode": "ब्लेंड मोड कॉपी करें",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  },
  "tr": {
    "outputTitle": "CSS Çıktısı",
    "outputSubtitle": "Önizlemeyle eşleşen CSS'i kopyalayın.",
    "outputFormat": "Renk biçimi",
    "copyCss": "CSS kopyala",
    "downloadCss": "CSS indir",
    "copyBackgroundImage": "background-image kopyala",
    "copyBackground": "background kopyala",
    "copyBlendMode": "Karışım modunu kopyala",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  },
  "nl": {
    "outputTitle": "CSS-uitvoer",
    "outputSubtitle": "Kopieer CSS dat overeenkomt met de preview.",
    "outputFormat": "Kleurformaat",
    "copyCss": "CSS kopiëren",
    "downloadCss": "CSS downloaden",
    "copyBackgroundImage": "background-image kopiëren",
    "copyBackground": "background kopiëren",
    "copyBlendMode": "Mengmodus kopiëren",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  },
  "sv": {
    "outputTitle": "CSS-utdata",
    "outputSubtitle": "Kopiera CSS som matchar förhandsvisningen.",
    "outputFormat": "Färgformat",
    "copyCss": "Kopiera CSS",
    "downloadCss": "Ladda ner CSS",
    "copyBackgroundImage": "Kopiera background-image",
    "copyBackground": "Kopiera background",
    "copyBlendMode": "Kopiera blandningsläge",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  },
  "pl": {
    "outputTitle": "Wyjście CSS",
    "outputSubtitle": "Skopiuj CSS zgodny z podglądem.",
    "outputFormat": "Format koloru",
    "copyCss": "Kopiuj CSS",
    "downloadCss": "Pobierz CSS",
    "copyBackgroundImage": "Kopiuj background-image",
    "copyBackground": "Kopiuj background",
    "copyBlendMode": "Kopiuj tryb mieszania",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  },
  "vi": {
    "outputTitle": "Đầu ra CSS",
    "outputSubtitle": "Sao chép CSS khớp với xem trước.",
    "outputFormat": "Định dạng màu",
    "copyCss": "Sao chép CSS",
    "downloadCss": "Tải CSS",
    "copyBackgroundImage": "Sao chép background-image",
    "copyBackground": "Sao chép background",
    "copyBlendMode": "Sao chép chế độ hòa trộn",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  },
  "th": {
    "outputTitle": "เอาต์พุต CSS",
    "outputSubtitle": "คัดลอก CSS ที่ตรงกับตัวอย่าง",
    "outputFormat": "รูปแบบสี",
    "copyCss": "คัดลอก CSS",
    "downloadCss": "ดาวน์โหลด CSS",
    "copyBackgroundImage": "คัดลอก background-image",
    "copyBackground": "คัดลอก background",
    "copyBlendMode": "คัดลอกโหมดผสมสี",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  },
  "id": {
    "outputTitle": "Output CSS",
    "outputSubtitle": "Salin CSS yang sesuai dengan pratinjau.",
    "outputFormat": "Format warna",
    "copyCss": "Salin CSS",
    "downloadCss": "Unduh CSS",
    "copyBackgroundImage": "Salin background-image",
    "copyBackground": "Salin background",
    "copyBlendMode": "Salin mode blend",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  },
  "he": {
    "outputTitle": "פלט CSS",
    "outputSubtitle": "העתיקו CSS שתואם לתצוגה המקדימה.",
    "outputFormat": "פורמט צבע",
    "copyCss": "העתק CSS",
    "downloadCss": "הורד CSS",
    "copyBackgroundImage": "העתק background-image",
    "copyBackground": "העתק background",
    "copyBlendMode": "העתק מצב מיזוג",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  },
  "ms": {
    "outputTitle": "Output CSS",
    "outputSubtitle": "Salin CSS yang sepadan dengan pratonton.",
    "outputFormat": "Format warna",
    "copyCss": "Salin CSS",
    "downloadCss": "Muat turun CSS",
    "copyBackgroundImage": "Salin background-image",
    "copyBackground": "Salin background",
    "copyBlendMode": "Salin mod campuran",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  },
  "no": {
    "outputTitle": "CSS-utdata",
    "outputSubtitle": "Kopier CSS som matcher forhåndsvisningen.",
    "outputFormat": "Fargeformat",
    "copyCss": "Kopier CSS",
    "downloadCss": "Last ned CSS",
    "copyBackgroundImage": "Kopier background-image",
    "copyBackground": "Kopier background",
    "copyBlendMode": "Kopier blandemodus",
    "format": {
      "hex": "Hex",
      "rgba": "RGBA"
    }
  }
}
</i18n>
