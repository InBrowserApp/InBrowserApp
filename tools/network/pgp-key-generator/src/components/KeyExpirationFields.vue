<template>
  <n-form-item-gi :label="t('expires')" :show-feedback="false">
    <n-select v-model:value="expirationDays" :options="expirationOptions" />
  </n-form-item-gi>

  <n-form-item-gi :label="t('passphrase')" :show-feedback="false" :span="2">
    <n-input
      v-model:value="passphrase"
      type="password"
      show-password-on="click"
      :placeholder="t('passphrasePlaceholder')"
    />
  </n-form-item-gi>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NFormItemGi, NSelect, NInput } from 'naive-ui'

const expirationDays = defineModel<number>('expirationDays', { required: true })
const passphrase = defineModel<string>('passphrase', { required: true })

const { t } = useI18n()

const expirationOptions = computed(() => [
  { label: t('never'), value: 0 },
  { label: `30 ${t('days')}`, value: 30 },
  { label: `90 ${t('days')}`, value: 90 },
  { label: `1 ${t('year')}`, value: 365 },
  { label: `2 ${t('years')}`, value: 730 },
  { label: `5 ${t('years')}`, value: 1825 },
])
</script>

<i18n lang="json">
{
  "en": {
    "expires": "Expires",
    "passphrase": "Passphrase",
    "passphrasePlaceholder": "Leave empty for no passphrase",
    "never": "Never",
    "days": "days",
    "year": "year",
    "years": "years"
  },
  "zh": {
    "expires": "有效期",
    "passphrase": "密码短语",
    "passphrasePlaceholder": "留空表示不设置密码短语",
    "never": "永不过期",
    "days": "天",
    "year": "年",
    "years": "年"
  },
  "zh-CN": {
    "expires": "有效期",
    "passphrase": "密码短语",
    "passphrasePlaceholder": "留空表示不设置密码短语",
    "never": "永不过期",
    "days": "天",
    "year": "年",
    "years": "年"
  },
  "zh-TW": {
    "expires": "有效期限",
    "passphrase": "密碼短語",
    "passphrasePlaceholder": "留空表示不設定密碼短語",
    "never": "永不過期",
    "days": "天",
    "year": "年",
    "years": "年"
  },
  "zh-HK": {
    "expires": "有效期限",
    "passphrase": "密碼短語",
    "passphrasePlaceholder": "留空表示不設定密碼短語",
    "never": "永不過期",
    "days": "天",
    "year": "年",
    "years": "年"
  },
  "es": {
    "expires": "Caduca",
    "passphrase": "Frase de contraseña",
    "passphrasePlaceholder": "Dejar vacío para no usar frase",
    "never": "Nunca",
    "days": "días",
    "year": "año",
    "years": "años"
  },
  "fr": {
    "expires": "Expiration",
    "passphrase": "Phrase de passe",
    "passphrasePlaceholder": "Laisser vide pour aucune phrase",
    "never": "Jamais",
    "days": "jours",
    "year": "an",
    "years": "ans"
  },
  "de": {
    "expires": "Gültig bis",
    "passphrase": "Passphrase",
    "passphrasePlaceholder": "Leer lassen für keine Passphrase",
    "never": "Nie",
    "days": "Tage",
    "year": "Jahr",
    "years": "Jahre"
  },
  "it": {
    "expires": "Scadenza",
    "passphrase": "Passphrase",
    "passphrasePlaceholder": "Lascia vuoto per nessuna passphrase",
    "never": "Mai",
    "days": "giorni",
    "year": "anno",
    "years": "anni"
  },
  "ja": {
    "expires": "有効期限",
    "passphrase": "パスフレーズ",
    "passphrasePlaceholder": "空欄でパスフレーズなし",
    "never": "なし",
    "days": "日",
    "year": "年",
    "years": "年"
  },
  "ko": {
    "expires": "만료",
    "passphrase": "암호문구",
    "passphrasePlaceholder": "비워 두면 암호문구 없음",
    "never": "없음",
    "days": "일",
    "year": "년",
    "years": "년"
  },
  "ru": {
    "expires": "Срок действия",
    "passphrase": "Парольная фраза",
    "passphrasePlaceholder": "Оставьте пустым, чтобы не использовать",
    "never": "Никогда",
    "days": "дней",
    "year": "год",
    "years": "лет"
  },
  "pt": {
    "expires": "Expira",
    "passphrase": "Frase-senha",
    "passphrasePlaceholder": "Deixe vazio para não usar",
    "never": "Nunca",
    "days": "dias",
    "year": "ano",
    "years": "anos"
  },
  "ar": {
    "expires": "ينتهي",
    "passphrase": "عبارة المرور",
    "passphrasePlaceholder": "اتركه فارغًا بدون عبارة مرور",
    "never": "أبدًا",
    "days": "أيام",
    "year": "سنة",
    "years": "سنوات"
  },
  "hi": {
    "expires": "समाप्ति",
    "passphrase": "पासफ़्रेज़",
    "passphrasePlaceholder": "खाली छोड़ें तो पासफ़्रेज़ नहीं",
    "never": "कभी नहीं",
    "days": "दिन",
    "year": "वर्ष",
    "years": "वर्ष"
  },
  "tr": {
    "expires": "Süre",
    "passphrase": "Parola ifadesi",
    "passphrasePlaceholder": "Parola istemiyorsanız boş bırakın",
    "never": "Asla",
    "days": "gün",
    "year": "yıl",
    "years": "yıl"
  },
  "nl": {
    "expires": "Verloopt",
    "passphrase": "Wachtwoordzin",
    "passphrasePlaceholder": "Leeg laten voor geen wachtwoordzin",
    "never": "Nooit",
    "days": "dagen",
    "year": "jaar",
    "years": "jaar"
  },
  "sv": {
    "expires": "Går ut",
    "passphrase": "Lösenfras",
    "passphrasePlaceholder": "Lämna tomt för ingen lösenfras",
    "never": "Aldrig",
    "days": "dagar",
    "year": "år",
    "years": "år"
  },
  "pl": {
    "expires": "Wygasa",
    "passphrase": "Fraza hasła",
    "passphrasePlaceholder": "Pozostaw puste, aby nie używać",
    "never": "Nigdy",
    "days": "dni",
    "year": "rok",
    "years": "lata"
  },
  "vi": {
    "expires": "Hết hạn",
    "passphrase": "Cụm mật khẩu",
    "passphrasePlaceholder": "Để trống nếu không dùng",
    "never": "Không bao giờ",
    "days": "ngày",
    "year": "năm",
    "years": "năm"
  },
  "th": {
    "expires": "วันหมดอายุ",
    "passphrase": "วลีรหัสผ่าน",
    "passphrasePlaceholder": "เว้นว่างเพื่อไม่ใช้วลีรหัสผ่าน",
    "never": "ไม่หมดอายุ",
    "days": "วัน",
    "year": "ปี",
    "years": "ปี"
  },
  "id": {
    "expires": "Kedaluwarsa",
    "passphrase": "Frasa sandi",
    "passphrasePlaceholder": "Kosongkan untuk tanpa frasa",
    "never": "Tidak pernah",
    "days": "hari",
    "year": "tahun",
    "years": "tahun"
  },
  "he": {
    "expires": "תפוגה",
    "passphrase": "משפט סיסמה",
    "passphrasePlaceholder": "השאר ריק ללא משפט סיסמה",
    "never": "לעולם לא",
    "days": "ימים",
    "year": "שנה",
    "years": "שנים"
  },
  "ms": {
    "expires": "Tamat tempoh",
    "passphrase": "Frasa laluan",
    "passphrasePlaceholder": "Biarkan kosong jika tiada frasa",
    "never": "Tidak pernah",
    "days": "hari",
    "year": "tahun",
    "years": "tahun"
  },
  "no": {
    "expires": "Utløper",
    "passphrase": "Passfrase",
    "passphrasePlaceholder": "La stå tomt for ingen passfrase",
    "never": "Aldri",
    "days": "dager",
    "year": "år",
    "years": "år"
  }
}
</i18n>
