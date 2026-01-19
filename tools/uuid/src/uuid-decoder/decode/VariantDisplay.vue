<template>
  <span>
    <!-- eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys -->
    {{ t(`variant-${variant}`) }}
  </span>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  variant: number
}>()
</script>

<i18n lang="json">
{
  "en": {
    "variant-0": "0 (NCS — pre-standard, obsolete)",
    "variant-1": "1 (RFC 4122 — standard variant)",
    "variant-2": "2 (Microsoft — backward compatibility)",
    "variant-3": "3 (Future/reserved — not currently used)"
  },
  "zh": {
    "variant-0": "0 (NCS — 预标准，已过时)",
    "variant-1": "1 (RFC 4122 — 标准变体)",
    "variant-2": "2 (Microsoft — 向后兼容)",
    "variant-3": "3 (未来/保留 — 当前未使用)"
  },
  "zh-CN": {
    "variant-0": "0 (NCS — 预标准，已过时)",
    "variant-1": "1 (RFC 4122 — 标准变体)",
    "variant-2": "2 (Microsoft — 向后兼容)",
    "variant-3": "3 (未来/保留 — 当前未使用)"
  },
  "zh-TW": {
    "variant-0": "0 (NCS — 預標準，已過時)",
    "variant-1": "1 (RFC 4122 — 標準變體)",
    "variant-2": "2 (Microsoft — 向後兼容)",
    "variant-3": "3 (未來/保留 — 當前未使用)"
  },
  "zh-HK": {
    "variant-0": "0 (NCS — 預標準，已過時)",
    "variant-1": "1 (RFC 4122 — 標準變體)",
    "variant-2": "2 (Microsoft — 向後兼容)",
    "variant-3": "3 (未來/保留 — 當前未使用)"
  },
  "es": {
    "variant-0": "0 (NCS — pre-estándar, obsoleto)",
    "variant-1": "1 (RFC 4122 — variante estándar)",
    "variant-2": "2 (Microsoft — compatibilidad hacia atrás)",
    "variant-3": "3 (Futuro/reservado — no se usa actualmente)"
  },
  "fr": {
    "variant-0": "0 (NCS — pré-standard, obsolète)",
    "variant-1": "1 (RFC 4122 — variante standard)",
    "variant-2": "2 (Microsoft — compatibilité ascendante)",
    "variant-3": "3 (Futur/réservé — non utilisé actuellement)"
  },
  "de": {
    "variant-0": "0 (NCS — Vorstandard, veraltet)",
    "variant-1": "1 (RFC 4122 — Standardvariante)",
    "variant-2": "2 (Microsoft — Abwärtskompatibilität)",
    "variant-3": "3 (Zukunft/reserviert — derzeit nicht verwendet)"
  },
  "it": {
    "variant-0": "0 (NCS — pre-standard, obsoleto)",
    "variant-1": "1 (RFC 4122 — variante standard)",
    "variant-2": "2 (Microsoft — compatibilità all'indietro)",
    "variant-3": "3 (Futuro/riservato — attualmente non utilizzato)"
  },
  "ja": {
    "variant-0": "0 (NCS — 標準前、廃止)",
    "variant-1": "1 (RFC 4122 — 標準バリアント)",
    "variant-2": "2 (Microsoft — 後方互換性)",
    "variant-3": "3 (将来/予約済み — 現在未使用)"
  },
  "ko": {
    "variant-0": "0 (NCS — 표준 이전, 폐기됨)",
    "variant-1": "1 (RFC 4122 — 표준 변형)",
    "variant-2": "2 (Microsoft — 이전 버전과의 호환성)",
    "variant-3": "3 (미래/예약됨 — 현재 사용되지 않음)"
  },
  "ru": {
    "variant-0": "0 (NCS — предварительный стандарт, устаревший)",
    "variant-1": "1 (RFC 4122 — стандартный вариант)",
    "variant-2": "2 (Microsoft — обратная совместимость)",
    "variant-3": "3 (Будущее/зарезервировано — в настоящее время не используется)"
  },
  "pt": {
    "variant-0": "0 (NCS — pré-padrão, obsoleto)",
    "variant-1": "1 (RFC 4122 — variante padrão)",
    "variant-2": "2 (Microsoft — compatibilidade retroativa)",
    "variant-3": "3 (Futuro/reservado — não utilizado atualmente)"
  },
  "ar": {
    "variant-0": "0 (NCS — ما قبل المعيار، مهجور)",
    "variant-1": "1 (RFC 4122 — المتغير القياسي)",
    "variant-2": "2 (Microsoft — التوافق مع الإصدارات السابقة)",
    "variant-3": "3 (مستقبلي/محجوز — غير مستخدم حالياً)"
  },
  "hi": {
    "variant-0": "0 (NCS — प्री-स्टैंडर्ड, अप्रचलित)",
    "variant-1": "1 (RFC 4122 — मानक वेरिएंट)",
    "variant-2": "2 (Microsoft — पिछड़ा संगतता)",
    "variant-3": "3 (भविष्य/आरक्षित — वर्तमान में उपयोग नहीं किया जाता)"
  },
  "tr": {
    "variant-0": "0 (NCS — ön standart, kullanımdan kaldırılmış)",
    "variant-1": "1 (RFC 4122 — standart varyant)",
    "variant-2": "2 (Microsoft — geriye dönük uyumluluk)",
    "variant-3": "3 (Gelecek/ayrılmış — şu anda kullanılmıyor)"
  },
  "nl": {
    "variant-0": "0 (NCS — pre-standaard, verouderd)",
    "variant-1": "1 (RFC 4122 — standaard variant)",
    "variant-2": "2 (Microsoft — achterwaartse compatibiliteit)",
    "variant-3": "3 (Toekomstig/gereserveerd — momenteel niet in gebruik)"
  },
  "sv": {
    "variant-0": "0 (NCS — förstandard, föråldrad)",
    "variant-1": "1 (RFC 4122 — standardvariant)",
    "variant-2": "2 (Microsoft — bakåtkompatibilitet)",
    "variant-3": "3 (Framtida/reserverad — används inte för närvarande)"
  },
  "pl": {
    "variant-0": "0 (NCS — przedstandardowy, przestarzały)",
    "variant-1": "1 (RFC 4122 — wariant standardowy)",
    "variant-2": "2 (Microsoft — kompatybilność wsteczna)",
    "variant-3": "3 (Przyszły/zastrzeżony — obecnie nieużywany)"
  },
  "vi": {
    "variant-0": "0 (NCS — tiền chuẩn, lỗi thời)",
    "variant-1": "1 (RFC 4122 — biến thể chuẩn)",
    "variant-2": "2 (Microsoft — tương thích ngược)",
    "variant-3": "3 (Tương lai/dành riêng — hiện không được sử dụng)"
  },
  "th": {
    "variant-0": "0 (NCS — ก่อนมาตรฐาน, เลิกใช้แล้ว)",
    "variant-1": "1 (RFC 4122 — รูปแบบมาตรฐาน)",
    "variant-2": "2 (Microsoft — ความเข้ากันได้ย้อนหลัง)",
    "variant-3": "3 (อนาคต/สงวนไว้ — ยังไม่มีการใช้งานในปัจจุบัน)"
  },
  "id": {
    "variant-0": "0 (NCS — pra-standar, usang)",
    "variant-1": "1 (RFC 4122 — varian standar)",
    "variant-2": "2 (Microsoft — kompatibilitas mundur)",
    "variant-3": "3 (Masa depan/direservasi — saat ini tidak digunakan)"
  },
  "he": {
    "variant-0": "0 (NCS — טרום-תקן, מיושן)",
    "variant-1": "1 (RFC 4122 — גרסה תקנית)",
    "variant-2": "2 (Microsoft — תאימות לאחור)",
    "variant-3": "3 (עתידי/שמור — לא בשימוש כרגע)"
  },
  "ms": {
    "variant-0": "0 (NCS — pra-piawaian, lapuk)",
    "variant-1": "1 (RFC 4122 — varian piawaian)",
    "variant-2": "2 (Microsoft — keserasian ke belakang)",
    "variant-3": "3 (Masa hadapan/diperuntukkan — tidak digunakan pada masa ini)"
  },
  "no": {
    "variant-0": "0 (NCS — før-standard, foreldet)",
    "variant-1": "1 (RFC 4122 — standardvariant)",
    "variant-2": "2 (Microsoft — bakoverkompatibilitet)",
    "variant-3": "3 (Fremtidig/reservert — ikke i bruk for øyeblikket)"
  }
}
</i18n>
