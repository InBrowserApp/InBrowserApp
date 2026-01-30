<template>
  <n-tooltip>
    <template #trigger>
      <n-button
        quaternary
        circle
        :aria-label="
          airplaneModeStore.isAirplaneMode
            ? t('airplane-mode-enabled')
            : t('airplane-mode-disabled')
        "
        :type="airplaneModeStore.isAirplaneMode ? 'warning' : 'tertiary'"
        @click="airplaneModeStore.toggleAirplaneMode"
      >
        <template #icon>
          <n-icon>
            <component :is="icon" />
          </n-icon>
        </template>
      </n-button>
    </template>
    <span v-if="airplaneModeStore.isAirplaneMode">{{ t('airplane-mode-enabled') }}</span>
    <span v-else>{{ t('airplane-mode-disabled') }}</span>
  </n-tooltip>
</template>

<script lang="ts" setup>
import { useAirplaneModeStore } from '@utils/airplane-mode'
import { NIcon, NButton, NTooltip } from 'naive-ui'
import enableIcon from '@vicons/material/AirplanemodeActiveRound'
import disableIcon from '@vicons/material/AirplanemodeInactiveRound'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const airplaneModeStore = useAirplaneModeStore()

const icon = computed(() => {
  return airplaneModeStore.isAirplaneMode ? enableIcon : disableIcon
})
</script>

<i18n lang="json">
{
  "en": {
    "airplane-mode-enabled": "Airplane Mode Enabled",
    "airplane-mode-disabled": "Airplane Mode Disabled"
  },
  "zh": {
    "airplane-mode-enabled": "飞行模式已启用",
    "airplane-mode-disabled": "飞行模式已禁用"
  },
  "zh-CN": {
    "airplane-mode-enabled": "飞行模式已启用",
    "airplane-mode-disabled": "飞行模式已禁用"
  },
  "zh-TW": {
    "airplane-mode-enabled": "飛航模式已啟用",
    "airplane-mode-disabled": "飛航模式已停用"
  },
  "zh-HK": {
    "airplane-mode-enabled": "飛行模式已啟用",
    "airplane-mode-disabled": "飛行模式已停用"
  },
  "es": {
    "airplane-mode-enabled": "Modo Avión Habilitado",
    "airplane-mode-disabled": "Modo Avión Deshabilitado"
  },
  "fr": {
    "airplane-mode-enabled": "Mode Avion Activé",
    "airplane-mode-disabled": "Mode Avion Désactivé"
  },
  "de": {
    "airplane-mode-enabled": "Flugmodus Aktiviert",
    "airplane-mode-disabled": "Flugmodus Deaktiviert"
  },
  "it": {
    "airplane-mode-enabled": "Modalità Aereo Abilitata",
    "airplane-mode-disabled": "Modalità Aereo Disabilitata"
  },
  "ja": {
    "airplane-mode-enabled": "機内モード 有効",
    "airplane-mode-disabled": "機内モード 無効"
  },
  "ko": {
    "airplane-mode-enabled": "비행기 모드 활성화됨",
    "airplane-mode-disabled": "비행기 모드 비활성화됨"
  },
  "ru": {
    "airplane-mode-enabled": "Авиарежим Включен",
    "airplane-mode-disabled": "Авиарежим Отключен"
  },
  "pt": {
    "airplane-mode-enabled": "Modo Avião Habilitado",
    "airplane-mode-disabled": "Modo Avião Desabilitado"
  },
  "ar": {
    "airplane-mode-enabled": "وضع الطيران مفعل",
    "airplane-mode-disabled": "وضع الطيران معطل"
  },
  "hi": {
    "airplane-mode-enabled": "एयरप्लेन मोड सक्षम",
    "airplane-mode-disabled": "एयरप्लेन मोड अक्षम"
  },
  "tr": {
    "airplane-mode-enabled": "Uçak Modu Etkin",
    "airplane-mode-disabled": "Uçak Modu Devre Dışı"
  },
  "nl": {
    "airplane-mode-enabled": "Vliegtuigmodus Ingeschakeld",
    "airplane-mode-disabled": "Vliegtuigmodus Uitgeschakeld"
  },
  "sv": {
    "airplane-mode-enabled": "Flygplansläge Aktiverat",
    "airplane-mode-disabled": "Flygplansläge Inaktiverat"
  },
  "pl": {
    "airplane-mode-enabled": "Tryb Samolotowy Włączony",
    "airplane-mode-disabled": "Tryb Samolotowy Wyłączony"
  },
  "vi": {
    "airplane-mode-enabled": "Chế Độ Máy Bay Đã Bật",
    "airplane-mode-disabled": "Chế Độ Máy Bay Đã Tắt"
  },
  "th": {
    "airplane-mode-enabled": "โหมดเครื่องบิน เปิดใช้งาน",
    "airplane-mode-disabled": "โหมดเครื่องบิน ปิดใช้งาน"
  },
  "id": {
    "airplane-mode-enabled": "Mode Pesawat Diaktifkan",
    "airplane-mode-disabled": "Mode Pesawat Dinonaktifkan"
  },
  "he": {
    "airplane-mode-enabled": "מצב טיסה מופעל",
    "airplane-mode-disabled": "מצב טיסה מושבת"
  },
  "ms": {
    "airplane-mode-enabled": "Mod Kapal Terbang Diaktifkan",
    "airplane-mode-disabled": "Mod Kapal Terbang Dinyahaktifkan"
  },
  "no": {
    "airplane-mode-enabled": "Flymodus Aktivert",
    "airplane-mode-disabled": "Flymodus Deaktivert"
  }
}
</i18n>
