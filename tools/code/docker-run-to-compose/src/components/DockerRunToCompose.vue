<template>
  <n-alert v-if="errorMessage" type="error" :title="t('errors-title')" :show-icon="true">
    {{ errorMessage }}
  </n-alert>
  <n-alert v-if="warnings.length" type="warning" :title="t('warnings-title')" :show-icon="true">
    <n-space vertical :size="4">
      <div v-for="warning in warnings" :key="warning">{{ warning }}</div>
    </n-space>
  </n-alert>

  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :show-feedback="false" label-style="width: 100%">
        <template #label>
          <n-flex
            align="center"
            justify="space-between"
            :wrap="true"
            :size="12"
            class="field-label"
          >
            <span>{{ t('input-title') }}</span>
            <n-flex :wrap="true" :size="12">
              <n-button text @click="applySample">
                <template #icon>
                  <n-icon :component="ClipboardPaste16Regular" />
                </template>
                {{ t('sample') }}
              </n-button>
              <n-button text @click="clearInput">
                <template #icon>
                  <n-icon :component="Delete16Regular" />
                </template>
                {{ t('clear') }}
              </n-button>
            </n-flex>
          </n-flex>
        </template>
        <n-input
          v-model:value="dockerRunInput"
          class="monospace-input"
          type="textarea"
          autosize
          :placeholder="t('input-placeholder')"
        />
      </n-form-item-gi>
      <n-form-item-gi :show-feedback="false" label-style="width: 100%">
        <template #label>
          <n-flex align="center" justify="space-between" :wrap="true" :size="12">
            <span>{{ t('output-title') }}</span>
            <n-flex :wrap="true" :size="12">
              <CopyToClipboardButton :content="outputText" />
              <n-button tag="a" text :href="downloadUrl ?? undefined" download="docker-compose.yml">
                <template #icon>
                  <n-icon :component="ArrowDownload16Regular" />
                </template>
                {{ t('download') }}
              </n-button>
            </n-flex>
          </n-flex>
        </template>
        <n-card size="small">
          <n-code :code="outputText" language="yaml" :hljs="hljs" word-wrap />
        </n-card>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useObjectUrl, useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import {
  NAlert,
  NButton,
  NCard,
  NCode,
  NFlex,
  NFormItemGi,
  NGrid,
  NIcon,
  NInput,
  NSpace,
} from 'naive-ui'
import { ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import ClipboardPaste16Regular from '@vicons/fluent/ClipboardPaste16Regular'
import Delete16Regular from '@vicons/fluent/Delete16Regular'
import hljs from 'highlight.js/lib/core'
import yaml from 'highlight.js/lib/languages/yaml'
import { convertDockerRunToCompose } from '../converter'

hljs.registerLanguage('yaml', yaml)

const { t } = useI18n()

const sampleInput = `docker run --name api -p 8080:8080 -e NODE_ENV=production -e API_KEY \\
  -v ./data:/data --restart unless-stopped node:20-alpine node server.js

docker run -d --name redis -p 6379:6379 redis:7-alpine`

const dockerRunInput = useStorage<string>('tools:docker-run-to-compose:input', sampleInput)

const conversion = computed(() => convertDockerRunToCompose(dockerRunInput.value))

const outputText = computed(() => conversion.value.output)
const warnings = computed(() => conversion.value.warnings)
const errorMessage = computed(() => conversion.value.error ?? '')

const downloadBlob = computed(
  () => new Blob([outputText.value], { type: 'text/yaml;charset=utf-8' }),
)
const downloadUrl = useObjectUrl(downloadBlob)

function applySample(): void {
  dockerRunInput.value = sampleInput
}

function clearInput(): void {
  dockerRunInput.value = ''
}
</script>

<style scoped>
.monospace-input :deep(textarea) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}

.field-label {
  width: 100%;
}
</style>

<i18n lang="json">
{
  "en": {
    "output-title": "docker-compose.yml",
    "input-title": "Docker Run Commands",
    "input-placeholder": "Paste docker run commands here...",
    "sample": "Use sample",
    "clear": "Clear",
    "download": "Download Compose",
    "warnings-title": "Warnings",
    "errors-title": "Errors"
  },
  "zh": {
    "output-title": "docker-compose.yml",
    "input-title": "Docker Run 命令",
    "input-placeholder": "在此粘贴 docker run 命令...",
    "sample": "使用示例",
    "clear": "清空",
    "download": "下载 Compose",
    "warnings-title": "警告",
    "errors-title": "错误"
  },
  "zh-CN": {
    "output-title": "docker-compose.yml",
    "input-title": "Docker Run 命令",
    "input-placeholder": "在此粘贴 docker run 命令...",
    "sample": "使用示例",
    "clear": "清空",
    "download": "下载 Compose",
    "warnings-title": "警告",
    "errors-title": "错误"
  },
  "zh-TW": {
    "output-title": "docker-compose.yml",
    "input-title": "Docker Run 命令",
    "input-placeholder": "在此貼上 docker run 命令...",
    "sample": "使用範例",
    "clear": "清空",
    "download": "下載 Compose",
    "warnings-title": "警告",
    "errors-title": "錯誤"
  },
  "zh-HK": {
    "output-title": "docker-compose.yml",
    "input-title": "Docker Run 命令",
    "input-placeholder": "在此貼上 docker run 命令...",
    "sample": "使用範例",
    "clear": "清空",
    "download": "下載 Compose",
    "warnings-title": "警告",
    "errors-title": "錯誤"
  },
  "es": {
    "output-title": "docker-compose.yml",
    "input-title": "Comandos Docker Run",
    "input-placeholder": "Pega comandos docker run aquí...",
    "sample": "Usar ejemplo",
    "clear": "Limpiar",
    "download": "Descargar Compose",
    "warnings-title": "Advertencias",
    "errors-title": "Errores"
  },
  "fr": {
    "output-title": "docker-compose.yml",
    "input-title": "Commandes Docker Run",
    "input-placeholder": "Collez des commandes docker run ici...",
    "sample": "Utiliser un exemple",
    "clear": "Effacer",
    "download": "Télécharger Compose",
    "warnings-title": "Avertissements",
    "errors-title": "Erreurs"
  },
  "de": {
    "output-title": "docker-compose.yml",
    "input-title": "Docker Run-Befehle",
    "input-placeholder": "Docker run-Befehle hier einfügen...",
    "sample": "Beispiel verwenden",
    "clear": "Löschen",
    "download": "Compose herunterladen",
    "warnings-title": "Warnungen",
    "errors-title": "Fehler"
  },
  "it": {
    "output-title": "docker-compose.yml",
    "input-title": "Comandi Docker Run",
    "input-placeholder": "Incolla i comandi docker run qui...",
    "sample": "Usa esempio",
    "clear": "Pulisci",
    "download": "Scarica Compose",
    "warnings-title": "Avvisi",
    "errors-title": "Errori"
  },
  "ja": {
    "output-title": "docker-compose.yml",
    "input-title": "Docker Run コマンド",
    "input-placeholder": "ここに docker run コマンドを貼り付け...",
    "sample": "サンプルを使用",
    "clear": "クリア",
    "download": "Compose をダウンロード",
    "warnings-title": "警告",
    "errors-title": "エラー"
  },
  "ko": {
    "output-title": "docker-compose.yml",
    "input-title": "Docker Run 명령",
    "input-placeholder": "여기에 docker run 명령을 붙여넣기...",
    "sample": "샘플 사용",
    "clear": "지우기",
    "download": "Compose 다운로드",
    "warnings-title": "경고",
    "errors-title": "오류"
  },
  "ru": {
    "output-title": "docker-compose.yml",
    "input-title": "Команды Docker Run",
    "input-placeholder": "Вставьте команды docker run здесь...",
    "sample": "Использовать пример",
    "clear": "Очистить",
    "download": "Скачать Compose",
    "warnings-title": "Предупреждения",
    "errors-title": "Ошибки"
  },
  "pt": {
    "output-title": "docker-compose.yml",
    "input-title": "Comandos Docker Run",
    "input-placeholder": "Cole comandos docker run aqui...",
    "sample": "Usar exemplo",
    "clear": "Limpar",
    "download": "Baixar Compose",
    "warnings-title": "Avisos",
    "errors-title": "Erros"
  },
  "ar": {
    "output-title": "docker-compose.yml",
    "input-title": "أوامر Docker Run",
    "input-placeholder": "الصق أوامر docker run هنا...",
    "sample": "استخدام المثال",
    "clear": "مسح",
    "download": "تنزيل Compose",
    "warnings-title": "تحذيرات",
    "errors-title": "أخطاء"
  },
  "hi": {
    "output-title": "docker-compose.yml",
    "input-title": "Docker Run कमांड",
    "input-placeholder": "यहाँ docker run कमांड पेस्ट करें...",
    "sample": "उदाहरण उपयोग करें",
    "clear": "साफ करें",
    "download": "Compose डाउनलोड करें",
    "warnings-title": "चेतावनियाँ",
    "errors-title": "त्रुटियाँ"
  },
  "tr": {
    "output-title": "docker-compose.yml",
    "input-title": "Docker Run Komutları",
    "input-placeholder": "Docker run komutlarını buraya yapıştırın...",
    "sample": "Örnek kullan",
    "clear": "Temizle",
    "download": "Compose indir",
    "warnings-title": "Uyarılar",
    "errors-title": "Hatalar"
  },
  "nl": {
    "output-title": "docker-compose.yml",
    "input-title": "Docker Run-opdrachten",
    "input-placeholder": "Plak docker run-opdrachten hier...",
    "sample": "Voorbeeld gebruiken",
    "clear": "Wissen",
    "download": "Compose downloaden",
    "warnings-title": "Waarschuwingen",
    "errors-title": "Fouten"
  },
  "sv": {
    "output-title": "docker-compose.yml",
    "input-title": "Docker Run-kommandon",
    "input-placeholder": "Klistra in docker run-kommandon här...",
    "sample": "Använd exempel",
    "clear": "Rensa",
    "download": "Ladda ner Compose",
    "warnings-title": "Varningar",
    "errors-title": "Fel"
  },
  "pl": {
    "output-title": "docker-compose.yml",
    "input-title": "Polecenia Docker Run",
    "input-placeholder": "Wklej tutaj polecenia docker run...",
    "sample": "Użyj przykładu",
    "clear": "Wyczyść",
    "download": "Pobierz Compose",
    "warnings-title": "Ostrzeżenia",
    "errors-title": "Błędy"
  },
  "vi": {
    "output-title": "docker-compose.yml",
    "input-title": "Lệnh Docker Run",
    "input-placeholder": "Dán lệnh docker run vào đây...",
    "sample": "Dùng ví dụ",
    "clear": "Xóa",
    "download": "Tải Compose",
    "warnings-title": "Cảnh báo",
    "errors-title": "Lỗi"
  },
  "th": {
    "output-title": "docker-compose.yml",
    "input-title": "คำสั่ง Docker Run",
    "input-placeholder": "วางคำสั่ง docker run ที่นี่...",
    "sample": "ใช้ตัวอย่าง",
    "clear": "ล้าง",
    "download": "ดาวน์โหลด Compose",
    "warnings-title": "คำเตือน",
    "errors-title": "ข้อผิดพลาด"
  },
  "id": {
    "output-title": "docker-compose.yml",
    "input-title": "Perintah Docker Run",
    "input-placeholder": "Tempel perintah docker run di sini...",
    "sample": "Gunakan contoh",
    "clear": "Bersihkan",
    "download": "Unduh Compose",
    "warnings-title": "Peringatan",
    "errors-title": "Kesalahan"
  },
  "he": {
    "output-title": "docker-compose.yml",
    "input-title": "פקודות Docker Run",
    "input-placeholder": "הדבק כאן פקודות docker run...",
    "sample": "השתמש בדוגמה",
    "clear": "נקה",
    "download": "הורד Compose",
    "warnings-title": "אזהרות",
    "errors-title": "שגיאות"
  },
  "ms": {
    "output-title": "docker-compose.yml",
    "input-title": "Arahan Docker Run",
    "input-placeholder": "Tampal arahan docker run di sini...",
    "sample": "Guna contoh",
    "clear": "Kosongkan",
    "download": "Muat turun Compose",
    "warnings-title": "Amaran",
    "errors-title": "Ralat"
  },
  "no": {
    "output-title": "docker-compose.yml",
    "input-title": "Docker Run-kommandoer",
    "input-placeholder": "Lim inn docker run-kommandoer her...",
    "sample": "Bruk eksempel",
    "clear": "Tøm",
    "download": "Last ned Compose",
    "warnings-title": "Advarsler",
    "errors-title": "Feil"
  }
}
</i18n>
