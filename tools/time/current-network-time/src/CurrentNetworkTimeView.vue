<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ToolSection>
      <n-alert v-if="error" type="error" :title="t('errorTitle')" style="margin-bottom: 16px">
        {{ error }}
      </n-alert>

      <n-flex
        justify="center"
        align="center"
        style="cursor: pointer"
        :class="{ fullscreen: isFullscreen }"
        @click="isFullscreen = !isFullscreen"
      >
        <div style="position: relative">
          <n-time class="network-time" :time="networkTime ?? localTime" format="HH:mm:ss" />
          <Transition name="fade" mode="out-in">
            <div style="position: absolute; top: 8px; right: 8px" v-if="status === 'syncing'">
              <n-badge dot processing type="warning" />
              {{ t('syncing') }}
            </div>
          </Transition>
        </div>
      </n-flex>

      <n-flex justify="space-between" align="center">
        <n-text depth="3">
          <span>{{ t('offset') }}: </span>
          <span v-if="offset !== undefined">
            <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
            {{ Math.round(offset) }} ms (±{{ Math.round(roundTripTimeMs) }} ms)
          </span>
          <n-skeleton text style="width: 10em" v-else />
        </n-text>
        <n-text depth="3">
          <span>{{ t('lastSyncedAt') }}: </span>
          <span v-if="lastSyncAt > 0">{{ new Date(lastSyncAt).toLocaleTimeString() }}</span>
          <n-skeleton text style="width: 5em" v-else />
        </n-text>
      </n-flex>
    </ToolSection>
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout, ToolSection } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import { NTime, NText, NFlex, NAlert, NBadge, NSkeleton } from 'naive-ui'
import { useNetworkTime } from './composables/useNetworkTime'
import { useThemeVars } from 'naive-ui'
import { ref } from 'vue'

const { t } = useI18n()

const { status, error, networkTime, localTime, roundTripTimeMs, offset, lastSyncAt } =
  useNetworkTime()

const themeVars = useThemeVars()
const isFullscreen = ref(false)
</script>

<style scoped>
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-active {
  transition: opacity 2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fullscreen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: v-bind('themeVars.bodyColor');
}
</style>

<i18n lang="json">
{
  "en": {
    "lastSyncedAt": "Last synced at",
    "errorTitle": "Failed to sync time",
    "offset": "Offset",
    "syncing": "Syncing"
  },
  "zh": {
    "lastSyncedAt": "上次同步时间",
    "errorTitle": "同步时间失败",
    "offset": "时间偏移",
    "syncing": "同步中"
  },
  "zh-CN": {
    "lastSyncedAt": "上次同步时间",
    "errorTitle": "同步时间失败",
    "offset": "时间偏移",
    "syncing": "同步中"
  },
  "zh-TW": {
    "lastSyncedAt": "上次同步時間",
    "errorTitle": "同步時間失敗",
    "offset": "時間偏移",
    "syncing": "同步中"
  },
  "zh-HK": {
    "lastSyncedAt": "上次同步時間",
    "errorTitle": "同步時間失敗",
    "offset": "時間偏移",
    "syncing": "同步中"
  },
  "es": {
    "lastSyncedAt": "Última sincronización",
    "errorTitle": "Error al sincronizar la hora",
    "offset": "Desfase",
    "syncing": "Sincronizando"
  },
  "fr": {
    "lastSyncedAt": "Dernière synchro",
    "errorTitle": "Échec de la synchronisation de l'heure",
    "offset": "Décalage",
    "syncing": "Synchronisation"
  },
  "de": {
    "lastSyncedAt": "Zuletzt synchronisiert",
    "errorTitle": "Zeitabgleich fehlgeschlagen",
    "offset": "Versatz",
    "syncing": "Synchronisiert"
  },
  "it": {
    "lastSyncedAt": "Ultima sincronizzazione",
    "errorTitle": "Sincronizzazione dell'ora non riuscita",
    "offset": "Offset",
    "syncing": "Sincronizzazione"
  },
  "ja": {
    "lastSyncedAt": "最終同期",
    "errorTitle": "時刻の同期に失敗しました",
    "offset": "オフセット",
    "syncing": "同期中"
  },
  "ko": {
    "lastSyncedAt": "마지막 동기화",
    "errorTitle": "시간 동기화 실패",
    "offset": "오프셋",
    "syncing": "동기화 중"
  },
  "ru": {
    "lastSyncedAt": "Последняя синхронизация",
    "errorTitle": "Не удалось синхронизировать время",
    "offset": "Смещение",
    "syncing": "Синхронизация"
  },
  "pt": {
    "lastSyncedAt": "Última sincronização",
    "errorTitle": "Falha ao sincronizar a hora",
    "offset": "Offset",
    "syncing": "Sincronizando"
  },
  "ar": {
    "lastSyncedAt": "آخر مزامنة",
    "errorTitle": "فشل مزامنة الوقت",
    "offset": "الإزاحة",
    "syncing": "جاري المزامنة"
  },
  "hi": {
    "lastSyncedAt": "अंतिम सिंक",
    "errorTitle": "समय सिंक विफल",
    "offset": "ऑफसेट",
    "syncing": "सिंक हो रहा है"
  },
  "tr": {
    "lastSyncedAt": "Son senkronizasyon",
    "errorTitle": "Zaman senkronizasyonu başarısız",
    "offset": "Sapma",
    "syncing": "Senkronize ediliyor"
  },
  "nl": {
    "lastSyncedAt": "Laatst gesynchroniseerd",
    "errorTitle": "Tijdsynchronisatie mislukt",
    "offset": "Offset",
    "syncing": "Synchroniseren"
  },
  "sv": {
    "lastSyncedAt": "Senast synkad",
    "errorTitle": "Misslyckades att synka tid",
    "offset": "Offset",
    "syncing": "Synkar"
  },
  "pl": {
    "lastSyncedAt": "Ostatnia synchronizacja",
    "errorTitle": "Nie udało się zsynchronizować czasu",
    "offset": "Przesunięcie",
    "syncing": "Synchronizowanie"
  },
  "vi": {
    "lastSyncedAt": "Đồng bộ lần cuối",
    "errorTitle": "Đồng bộ thời gian thất bại",
    "offset": "Độ lệch",
    "syncing": "Đang đồng bộ"
  },
  "th": {
    "lastSyncedAt": "ซิงก์ล่าสุด",
    "errorTitle": "ซิงก์เวลาไม่สำเร็จ",
    "offset": "ออฟเซ็ต",
    "syncing": "กำลังซิงก์"
  },
  "id": {
    "lastSyncedAt": "Sinkron terakhir",
    "errorTitle": "Gagal menyinkronkan waktu",
    "offset": "Offset",
    "syncing": "Menyinkronkan"
  },
  "he": {
    "lastSyncedAt": "סונכרן לאחרונה",
    "errorTitle": "סנכרון הזמן נכשל",
    "offset": "היסט",
    "syncing": "מסנכרן"
  },
  "ms": {
    "lastSyncedAt": "Kali terakhir disegerakkan",
    "errorTitle": "Gagal menyegerakkan masa",
    "offset": "Offset",
    "syncing": "Menyegerakkan"
  },
  "no": {
    "lastSyncedAt": "Sist synkronisert",
    "errorTitle": "Kunne ikke synkronisere tid",
    "offset": "Offset",
    "syncing": "Synkroniserer"
  }
}
</i18n>

<style scoped>
.network-time {
  font-size: 10em;
  font-weight: 900;
}
</style>
