<template>
  <ToolSectionHeader>{{ t('alertsTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 s:3" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('soundLabel')" :show-feedback="false">
        <n-switch v-model:value="soundEnabled" :disabled="!soundSupported" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('vibrationLabel')" :show-feedback="false">
        <n-switch v-model:value="vibrationEnabled" :disabled="!vibrationSupported" />
      </n-form-item-gi>
      <n-form-item-gi
        v-show="notificationSupported"
        :label="t('notificationLabel')"
        :show-feedback="false"
      >
        <n-flex align="center" justify="space-between" style="width: 100%">
          <n-switch v-model:value="notificationEnabled" @update:value="handleNotificationToggle" />
          <n-button
            v-show="showNotificationButton"
            text
            size="small"
            data-testid="notification-permission"
            @click="requestNotificationPermission"
          >
            {{ t('notificationRequest') }}
          </n-button>
        </n-flex>
      </n-form-item-gi>
    </n-grid>
    <n-text
      v-show="notificationSupported && notificationHint"
      depth="3"
      class="input-hint"
      data-testid="notification-hint"
    >
      {{ notificationHint }}
    </n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NFlex, NFormItemGi, NGrid, NSwitch, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

type NotificationPermissionState = NotificationPermission | 'unsupported'

const props = defineProps<{
  soundSupported: boolean
  vibrationSupported: boolean
  notificationSupported: boolean
  notificationPermission: NotificationPermissionState
  requestNotificationPermission: () => void | Promise<void>
}>()

const soundEnabled = defineModel<boolean>('soundEnabled', { required: true })
const vibrationEnabled = defineModel<boolean>('vibrationEnabled', { required: true })
const notificationEnabled = defineModel<boolean>('notificationEnabled', { required: true })

const { t } = useI18n()

const showNotificationButton = computed(
  () =>
    notificationEnabled.value &&
    props.notificationSupported &&
    props.notificationPermission === 'default',
)

const notificationHint = computed(() => {
  if (!props.notificationSupported) return t('notificationUnsupported')
  if (!notificationEnabled.value) return ''
  if (props.notificationPermission === 'denied') return t('notificationDenied')
  if (props.notificationPermission === 'default') return t('notificationDefault')
  return t('notificationGranted')
})

const handleNotificationToggle = async (value: boolean) => {
  if (!value) return
  await props.requestNotificationPermission()
}
</script>

<style scoped>
.input-hint {
  display: block;
  margin-top: 8px;
}
</style>

<i18n lang="json">
{
  "en": {
    "alertsTitle": "Alerts",
    "soundLabel": "Sound",
    "vibrationLabel": "Vibration",
    "notificationLabel": "Notifications",
    "notificationUnsupported": "Notifications are not supported in this browser.",
    "notificationDenied": "Notifications are blocked in browser settings.",
    "notificationDefault": "Allow notifications to receive alerts.",
    "notificationGranted": "Notifications are enabled.",
    "notificationRequest": "Enable"
  },
  "zh": {
    "alertsTitle": "提醒",
    "soundLabel": "提示音",
    "vibrationLabel": "震动",
    "notificationLabel": "通知",
    "notificationUnsupported": "当前浏览器不支持通知。",
    "notificationDenied": "通知已在浏览器设置中被阻止。",
    "notificationDefault": "允许通知以接收提醒。",
    "notificationGranted": "通知已启用。",
    "notificationRequest": "启用"
  },
  "zh-CN": {
    "alertsTitle": "提醒",
    "soundLabel": "提示音",
    "vibrationLabel": "震动",
    "notificationLabel": "通知",
    "notificationUnsupported": "当前浏览器不支持通知。",
    "notificationDenied": "通知已在浏览器设置中被阻止。",
    "notificationDefault": "允许通知以接收提醒。",
    "notificationGranted": "通知已启用。",
    "notificationRequest": "启用"
  },
  "zh-TW": {
    "alertsTitle": "提醒",
    "soundLabel": "提示音",
    "vibrationLabel": "震動",
    "notificationLabel": "通知",
    "notificationUnsupported": "目前瀏覽器不支援通知。",
    "notificationDenied": "通知已在瀏覽器設定中被封鎖。",
    "notificationDefault": "允許通知以接收提醒。",
    "notificationGranted": "通知已啟用。",
    "notificationRequest": "啟用"
  },
  "zh-HK": {
    "alertsTitle": "提醒",
    "soundLabel": "提示音",
    "vibrationLabel": "震動",
    "notificationLabel": "通知",
    "notificationUnsupported": "目前瀏覽器不支援通知。",
    "notificationDenied": "通知已在瀏覽器設定中被封鎖。",
    "notificationDefault": "允許通知以接收提醒。",
    "notificationGranted": "通知已啟用。",
    "notificationRequest": "啟用"
  },
  "es": {
    "alertsTitle": "Alertas",
    "soundLabel": "Sonido",
    "vibrationLabel": "Vibración",
    "notificationLabel": "Notificaciones",
    "notificationUnsupported": "Las notificaciones no son compatibles con este navegador.",
    "notificationDenied": "Las notificaciones están bloqueadas en la configuración del navegador.",
    "notificationDefault": "Permite notificaciones para recibir alertas.",
    "notificationGranted": "Las notificaciones están habilitadas.",
    "notificationRequest": "Habilitar"
  },
  "fr": {
    "alertsTitle": "Alertes",
    "soundLabel": "Son",
    "vibrationLabel": "Vibration",
    "notificationLabel": "Notifications",
    "notificationUnsupported": "Les notifications ne sont pas prises en charge par ce navigateur.",
    "notificationDenied": "Les notifications sont bloquées dans les paramètres du navigateur.",
    "notificationDefault": "Autorisez les notifications pour recevoir des alertes.",
    "notificationGranted": "Les notifications sont activées.",
    "notificationRequest": "Activer"
  },
  "de": {
    "alertsTitle": "Hinweise",
    "soundLabel": "Ton",
    "vibrationLabel": "Vibration",
    "notificationLabel": "Benachrichtigungen",
    "notificationUnsupported": "Benachrichtigungen werden in diesem Browser nicht unterstützt.",
    "notificationDenied": "Benachrichtigungen sind in den Browser-Einstellungen blockiert.",
    "notificationDefault": "Benachrichtigungen zulassen, um Hinweise zu erhalten.",
    "notificationGranted": "Benachrichtigungen sind aktiviert.",
    "notificationRequest": "Aktivieren"
  },
  "it": {
    "alertsTitle": "Avvisi",
    "soundLabel": "Suono",
    "vibrationLabel": "Vibrazione",
    "notificationLabel": "Notifiche",
    "notificationUnsupported": "Le notifiche non sono supportate da questo browser.",
    "notificationDenied": "Le notifiche sono bloccate nelle impostazioni del browser.",
    "notificationDefault": "Consenti le notifiche per ricevere gli avvisi.",
    "notificationGranted": "Le notifiche sono attive.",
    "notificationRequest": "Attiva"
  },
  "ja": {
    "alertsTitle": "通知",
    "soundLabel": "音",
    "vibrationLabel": "振動",
    "notificationLabel": "通知",
    "notificationUnsupported": "このブラウザでは通知がサポートされていません。",
    "notificationDenied": "通知はブラウザ設定でブロックされています。",
    "notificationDefault": "通知を許可してアラートを受け取ってください。",
    "notificationGranted": "通知が有効になっています。",
    "notificationRequest": "有効化"
  },
  "ko": {
    "alertsTitle": "알림",
    "soundLabel": "소리",
    "vibrationLabel": "진동",
    "notificationLabel": "알림",
    "notificationUnsupported": "이 브라우저에서는 알림을 지원하지 않습니다.",
    "notificationDenied": "알림이 브라우저 설정에서 차단되었습니다.",
    "notificationDefault": "알림을 허용하면 알림을 받을 수 있습니다.",
    "notificationGranted": "알림이 활성화되었습니다.",
    "notificationRequest": "활성화"
  },
  "ru": {
    "alertsTitle": "Оповещения",
    "soundLabel": "Звук",
    "vibrationLabel": "Вибрация",
    "notificationLabel": "Уведомления",
    "notificationUnsupported": "Уведомления не поддерживаются этим браузером.",
    "notificationDenied": "Уведомления заблокированы в настройках браузера.",
    "notificationDefault": "Разрешите уведомления для получения оповещений.",
    "notificationGranted": "Уведомления включены.",
    "notificationRequest": "Включить"
  },
  "pt": {
    "alertsTitle": "Alertas",
    "soundLabel": "Som",
    "vibrationLabel": "Vibração",
    "notificationLabel": "Notificações",
    "notificationUnsupported": "Notificações não são suportadas neste navegador.",
    "notificationDenied": "Notificações estão bloqueadas nas configurações do navegador.",
    "notificationDefault": "Permita notificações para receber alertas.",
    "notificationGranted": "Notificações ativadas.",
    "notificationRequest": "Ativar"
  },
  "ar": {
    "alertsTitle": "تنبيهات",
    "soundLabel": "صوت",
    "vibrationLabel": "اهتزاز",
    "notificationLabel": "إشعارات",
    "notificationUnsupported": "الإشعارات غير مدعومة في هذا المتصفح.",
    "notificationDenied": "تم حظر الإشعارات في إعدادات المتصفح.",
    "notificationDefault": "اسمح بالإشعارات لتلقي التنبيهات.",
    "notificationGranted": "الإشعارات مفعلة.",
    "notificationRequest": "تفعيل"
  },
  "hi": {
    "alertsTitle": "अलर्ट",
    "soundLabel": "ध्वनि",
    "vibrationLabel": "कंपन",
    "notificationLabel": "सूचनाएँ",
    "notificationUnsupported": "इस ब्राउज़र में सूचनाएँ समर्थित नहीं हैं।",
    "notificationDenied": "सूचनाएँ ब्राउज़र सेटिंग में ब्लॉक हैं।",
    "notificationDefault": "अलर्ट पाने के लिए सूचनाएँ अनुमति दें।",
    "notificationGranted": "सूचनाएँ सक्षम हैं।",
    "notificationRequest": "सक्षम करें"
  },
  "tr": {
    "alertsTitle": "Uyarılar",
    "soundLabel": "Ses",
    "vibrationLabel": "Titreşim",
    "notificationLabel": "Bildirimler",
    "notificationUnsupported": "Bildirimler bu tarayıcıda desteklenmiyor.",
    "notificationDenied": "Bildirimler tarayıcı ayarlarında engellendi.",
    "notificationDefault": "Uyarılar için bildirimlere izin verin.",
    "notificationGranted": "Bildirimler etkin.",
    "notificationRequest": "Etkinleştir"
  },
  "nl": {
    "alertsTitle": "Meldingen",
    "soundLabel": "Geluid",
    "vibrationLabel": "Trillen",
    "notificationLabel": "Notificaties",
    "notificationUnsupported": "Notificaties worden niet ondersteund in deze browser.",
    "notificationDenied": "Notificaties zijn geblokkeerd in de browserinstellingen.",
    "notificationDefault": "Sta notificaties toe om meldingen te ontvangen.",
    "notificationGranted": "Notificaties zijn ingeschakeld.",
    "notificationRequest": "Inschakelen"
  },
  "sv": {
    "alertsTitle": "Aviseringar",
    "soundLabel": "Ljud",
    "vibrationLabel": "Vibration",
    "notificationLabel": "Notifieringar",
    "notificationUnsupported": "Notifieringar stöds inte i denna webbläsare.",
    "notificationDenied": "Notifieringar är blockerade i webbläsarens inställningar.",
    "notificationDefault": "Tillåt notifieringar för att få aviseringar.",
    "notificationGranted": "Notifieringar är aktiverade.",
    "notificationRequest": "Aktivera"
  },
  "pl": {
    "alertsTitle": "Alerty",
    "soundLabel": "Dźwięk",
    "vibrationLabel": "Wibracja",
    "notificationLabel": "Powiadomienia",
    "notificationUnsupported": "Powiadomienia nie są obsługiwane w tej przeglądarce.",
    "notificationDenied": "Powiadomienia są zablokowane w ustawieniach przeglądarki.",
    "notificationDefault": "Zezwól na powiadomienia, aby otrzymywać alerty.",
    "notificationGranted": "Powiadomienia są włączone.",
    "notificationRequest": "Włącz"
  },
  "vi": {
    "alertsTitle": "Cảnh báo",
    "soundLabel": "Âm thanh",
    "vibrationLabel": "Rung",
    "notificationLabel": "Thông báo",
    "notificationUnsupported": "Trình duyệt này không hỗ trợ thông báo.",
    "notificationDenied": "Thông báo bị chặn trong cài đặt trình duyệt.",
    "notificationDefault": "Cho phép thông báo để nhận cảnh báo.",
    "notificationGranted": "Thông báo đã bật.",
    "notificationRequest": "Bật"
  },
  "th": {
    "alertsTitle": "การแจ้งเตือน",
    "soundLabel": "เสียง",
    "vibrationLabel": "การสั่น",
    "notificationLabel": "การแจ้งเตือน",
    "notificationUnsupported": "เบราว์เซอร์นี้ไม่รองรับการแจ้งเตือน",
    "notificationDenied": "การแจ้งเตือนถูกบล็อกในตั้งค่าเบราว์เซอร์",
    "notificationDefault": "อนุญาตการแจ้งเตือนเพื่อรับการเตือน",
    "notificationGranted": "เปิดการแจ้งเตือนแล้ว",
    "notificationRequest": "เปิดใช้งาน"
  },
  "id": {
    "alertsTitle": "Peringatan",
    "soundLabel": "Suara",
    "vibrationLabel": "Getar",
    "notificationLabel": "Notifikasi",
    "notificationUnsupported": "Notifikasi tidak didukung di browser ini.",
    "notificationDenied": "Notifikasi diblokir di pengaturan browser.",
    "notificationDefault": "Izinkan notifikasi untuk menerima peringatan.",
    "notificationGranted": "Notifikasi diaktifkan.",
    "notificationRequest": "Aktifkan"
  },
  "he": {
    "alertsTitle": "התראות",
    "soundLabel": "צליל",
    "vibrationLabel": "רטט",
    "notificationLabel": "התראות",
    "notificationUnsupported": "התראות אינן נתמכות בדפדפן זה.",
    "notificationDenied": "התראות נחסמו בהגדרות הדפדפן.",
    "notificationDefault": "אפשר התראות כדי לקבל התראות.",
    "notificationGranted": "התראות מופעלות.",
    "notificationRequest": "הפעל"
  },
  "ms": {
    "alertsTitle": "Makluman",
    "soundLabel": "Bunyi",
    "vibrationLabel": "Getaran",
    "notificationLabel": "Pemberitahuan",
    "notificationUnsupported": "Pemberitahuan tidak disokong dalam pelayar ini.",
    "notificationDenied": "Pemberitahuan disekat dalam tetapan pelayar.",
    "notificationDefault": "Benarkan pemberitahuan untuk menerima makluman.",
    "notificationGranted": "Pemberitahuan diaktifkan.",
    "notificationRequest": "Aktifkan"
  },
  "no": {
    "alertsTitle": "Varsler",
    "soundLabel": "Lyd",
    "vibrationLabel": "Vibrasjon",
    "notificationLabel": "Varsler",
    "notificationUnsupported": "Varsler støttes ikke i denne nettleseren.",
    "notificationDenied": "Varsler er blokkert i nettleserinnstillingene.",
    "notificationDefault": "Tillat varsler for å motta påminnelser.",
    "notificationGranted": "Varsler er aktivert.",
    "notificationRequest": "Aktiver"
  }
}
</i18n>
