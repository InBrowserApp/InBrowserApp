<template>
  <ToolSectionHeader>{{ t('history') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-flex align="center" justify="end">
        <n-button
          text
          size="small"
          :disabled="!hasHistory"
          @click="emit('clear-history')"
          data-testid="clear-history"
        >
          {{ t('clearHistory') }}
        </n-button>
      </n-flex>

      <n-card v-if="!hasHistory" embedded :content-style="{ padding: '12px 16px' }">
        <n-text depth="3">{{ t('historyEmpty') }}</n-text>
      </n-card>

      <n-flex v-else vertical :size="12" class="history-list">
        <n-card
          v-for="entry in historyEntries"
          :key="entry.id"
          embedded
          :content-style="{ padding: '10px 14px' }"
          class="history-card"
        >
          <n-flex wrap :size="12" class="history-tags">
            <n-tag v-for="(value, index) in entry.values" :key="`${entry.id}-${index}`" round>
              {{ value }}
            </n-tag>
          </n-flex>
        </n-card>
      </n-flex>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NButton, NCard, NFlex, NTag, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

type HistoryEntry = {
  id: string
  values: string[]
}

const props = defineProps<{
  historyEntries: HistoryEntry[]
}>()

const emit = defineEmits<{
  (event: 'clear-history'): void
}>()

const { t } = useI18n()

const hasHistory = computed(() => props.historyEntries.length > 0)
</script>

<style scoped>
.history-list {
  width: 100%;
}

.history-card {
  width: 100%;
}

.history-tags {
  align-items: center;
  justify-content: flex-start;
}

.history-tags :deep(.n-tag) {
  height: auto;
  min-height: 2.2rem;
  min-width: 2.8ch;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.history-tags :deep(.n-tag__content) {
  font-size: clamp(1rem, 2.6vw, 1.6rem);
  font-weight: 600;
  line-height: 1;
  padding: 8px 12px;
  text-align: center;
}
</style>

<i18n lang="json">
{
  "en": {
    "history": "History",
    "historyEmpty": "No history yet.",
    "clearHistory": "Clear history"
  },
  "zh": {
    "history": "历史记录",
    "historyEmpty": "暂无历史记录。",
    "clearHistory": "清空历史"
  },
  "zh-CN": {
    "history": "历史记录",
    "historyEmpty": "暂无历史记录。",
    "clearHistory": "清空历史"
  },
  "zh-TW": {
    "history": "歷史記錄",
    "historyEmpty": "尚無歷史記錄。",
    "clearHistory": "清空歷史"
  },
  "zh-HK": {
    "history": "歷史記錄",
    "historyEmpty": "尚無歷史記錄。",
    "clearHistory": "清空歷史"
  },
  "es": {
    "history": "Historial",
    "historyEmpty": "Aún no hay historial.",
    "clearHistory": "Borrar historial"
  },
  "fr": {
    "history": "Historique",
    "historyEmpty": "Aucun historique pour le moment.",
    "clearHistory": "Effacer l'historique"
  },
  "de": {
    "history": "Verlauf",
    "historyEmpty": "Noch kein Verlauf.",
    "clearHistory": "Verlauf löschen"
  },
  "it": {
    "history": "Cronologia",
    "historyEmpty": "Nessuna cronologia.",
    "clearHistory": "Cancella cronologia"
  },
  "ja": {
    "history": "履歴",
    "historyEmpty": "履歴はまだありません。",
    "clearHistory": "履歴をクリア"
  },
  "ko": {
    "history": "기록",
    "historyEmpty": "기록이 아직 없습니다.",
    "clearHistory": "기록 지우기"
  },
  "ru": {
    "history": "История",
    "historyEmpty": "Истории пока нет.",
    "clearHistory": "Очистить историю"
  },
  "pt": {
    "history": "Histórico",
    "historyEmpty": "Ainda não há histórico.",
    "clearHistory": "Limpar histórico"
  },
  "ar": {
    "history": "السجل",
    "historyEmpty": "لا يوجد سجل بعد.",
    "clearHistory": "مسح السجل"
  },
  "hi": {
    "history": "इतिहास",
    "historyEmpty": "अभी कोई इतिहास नहीं है।",
    "clearHistory": "इतिहास साफ करें"
  },
  "tr": {
    "history": "Geçmiş",
    "historyEmpty": "Henüz geçmiş yok.",
    "clearHistory": "Geçmişi temizle"
  },
  "nl": {
    "history": "Geschiedenis",
    "historyEmpty": "Nog geen geschiedenis.",
    "clearHistory": "Geschiedenis wissen"
  },
  "sv": {
    "history": "Historik",
    "historyEmpty": "Ingen historik ännu.",
    "clearHistory": "Rensa historik"
  },
  "pl": {
    "history": "Historia",
    "historyEmpty": "Brak historii.",
    "clearHistory": "Wyczyść historię"
  },
  "vi": {
    "history": "Lịch sử",
    "historyEmpty": "Chưa có lịch sử.",
    "clearHistory": "Xóa lịch sử"
  },
  "th": {
    "history": "ประวัติ",
    "historyEmpty": "ยังไม่มีประวัติ",
    "clearHistory": "ล้างประวัติ"
  },
  "id": {
    "history": "Riwayat",
    "historyEmpty": "Belum ada riwayat.",
    "clearHistory": "Hapus riwayat"
  },
  "he": {
    "history": "היסטוריה",
    "historyEmpty": "אין היסטוריה עדיין.",
    "clearHistory": "נקה היסטוריה"
  },
  "ms": {
    "history": "Sejarah",
    "historyEmpty": "Belum ada sejarah.",
    "clearHistory": "Padam sejarah"
  },
  "no": {
    "history": "Historikk",
    "historyEmpty": "Ingen historikk ennå.",
    "clearHistory": "Tøm historikk"
  }
}
</i18n>
