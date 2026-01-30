<template>
  <n-flex vertical :size="6">
    <n-text>{{ t('audioWarning') }}</n-text>
    <n-text>{{ t('localTimeNote') }}</n-text>
    <n-text>{{ t('harmonicNote') }}</n-text>
    <n-text>{{ t('callSignNote') }}</n-text>
  </n-flex>
</template>

<script setup lang="ts">
import { NFlex, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated."
  },
  "zh": {
    "audioWarning": "请保持低音量，高频音可能不适。",
    "localTimeNote": "仅使用本机时间（离线）。",
    "harmonicNote": "输出为低频谐波近似，效果与设备和摆放位置有关。",
    "callSignNote": "JJY 在 15/45 分的呼号未模拟。"
  },
  "zh-CN": {
    "audioWarning": "请保持低音量，高频音可能不适。",
    "localTimeNote": "仅使用本机时间（离线）。",
    "harmonicNote": "输出为低频谐波近似，效果与设备和摆放位置有关。",
    "callSignNote": "JJY 在 15/45 分的呼号未模拟。"
  },
  "zh-TW": {
    "audioWarning": "請保持低音量，高頻音可能不適。",
    "localTimeNote": "僅使用本機時間（離線）。",
    "harmonicNote": "輸出為低頻諧波近似，效果與裝置和擺放位置有關。",
    "callSignNote": "JJY 在 15/45 分的呼號未模擬。"
  },
  "zh-HK": {
    "audioWarning": "請保持低音量，高頻音可能不適。",
    "localTimeNote": "僅使用本機時間（離線）。",
    "harmonicNote": "輸出為低頻諧波近似，效果與裝置和擺放位置有關。",
    "callSignNote": "JJY 在 15/45 分的呼號未模擬。"
  },
  "es": {
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated."
  },
  "fr": {
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated."
  },
  "de": {
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated."
  },
  "it": {
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated."
  },
  "ja": {
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated."
  },
  "ko": {
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated."
  },
  "ru": {
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated."
  },
  "pt": {
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated."
  },
  "ar": {
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated."
  },
  "hi": {
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated."
  },
  "tr": {
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated."
  },
  "nl": {
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated."
  },
  "sv": {
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated."
  },
  "pl": {
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated."
  },
  "vi": {
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated."
  },
  "th": {
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated."
  },
  "id": {
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated."
  },
  "he": {
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated."
  },
  "ms": {
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated."
  },
  "no": {
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated."
  }
}
</i18n>
