<template>
  <n-p>
    <span v-if="result === 'error'">{{ t('error') }}</span>
    <span v-else-if="result.length === 0">{{ t('noCidrs') }}</span>
    <n-ul v-else>
      <n-li v-for="cidr in result" :key="cidr">
        {{ cidr }}
      </n-li>
    </n-ul>
  </n-p>
</template>

<script setup lang="ts">
import { NP, NUl, NLi } from 'naive-ui'
import { excludeCidr } from 'cidr-tools'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  cidrsToMerge: string[]
  cidrsToExclude: string[]
}>()

const { t } = useI18n()

const result = computed<string[] | 'error'>(() => {
  try {
    return excludeCidr(props.cidrsToMerge, props.cidrsToExclude)
  } catch (e) {
    console.error(e)
    return 'error'
  }
})
</script>

<i18n lang="json">
{
  "en": {
    "error": "Error",
    "noCidrs": "No CIDRs"
  },
  "zh": {
    "error": "错误",
    "noCidrs": "无 CIDR"
  },
  "zh-CN": {
    "error": "错误",
    "noCidrs": "无 CIDR"
  },
  "zh-TW": {
    "error": "錯誤",
    "noCidrs": "無 CIDR"
  },
  "zh-HK": {
    "error": "錯誤",
    "noCidrs": "無 CIDR"
  },
  "es": {
    "error": "Error",
    "noCidrs": "Sin CIDRs"
  },
  "fr": {
    "error": "Erreur",
    "noCidrs": "Aucun CIDR"
  },
  "de": {
    "error": "Fehler",
    "noCidrs": "Keine CIDRs"
  },
  "it": {
    "error": "Errore",
    "noCidrs": "Nessun CIDR"
  },
  "ja": {
    "error": "エラー",
    "noCidrs": "CIDR なし"
  },
  "ko": {
    "error": "오류",
    "noCidrs": "CIDR 없음"
  },
  "ru": {
    "error": "Ошибка",
    "noCidrs": "Нет CIDR"
  },
  "pt": {
    "error": "Erro",
    "noCidrs": "Sem CIDRs"
  },
  "ar": {
    "error": "خطأ",
    "noCidrs": "لا توجد CIDRs"
  },
  "hi": {
    "error": "त्रुटि",
    "noCidrs": "कोई CIDR नहीं"
  },
  "tr": {
    "error": "Hata",
    "noCidrs": "CIDR yok"
  },
  "nl": {
    "error": "Fout",
    "noCidrs": "Geen CIDRs"
  },
  "sv": {
    "error": "Fel",
    "noCidrs": "Inga CIDRs"
  },
  "pl": {
    "error": "Błąd",
    "noCidrs": "Brak CIDRs"
  },
  "vi": {
    "error": "Lỗi",
    "noCidrs": "Không có CIDR"
  },
  "th": {
    "error": "ข้อผิดพลาด",
    "noCidrs": "ไม่มี CIDR"
  },
  "id": {
    "error": "Kesalahan",
    "noCidrs": "Tidak ada CIDR"
  },
  "he": {
    "error": "שגיאה",
    "noCidrs": "אין CIDRs"
  },
  "ms": {
    "error": "Ralat",
    "noCidrs": "Tiada CIDR"
  },
  "no": {
    "error": "Feil",
    "noCidrs": "Ingen CIDRs"
  }
}
</i18n>
