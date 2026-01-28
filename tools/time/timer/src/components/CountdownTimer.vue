<template>
  <div
    ref="fullscreenTarget"
    class="timer-root"
    :class="{
      'timer-root--fullscreen': isFullscreenActive,
      'timer-root--overlay': isFullscreenOverlay,
    }"
  >
    <CountdownDisplay
      :formatted-remaining="formattedRemaining"
      :is-fullscreen-active="isFullscreenActive"
    />

    <CountdownControls
      v-show="!isFullscreenActive"
      :toggle-label="toggleLabel"
      :toggle-icon="toggleIcon"
      :can-reset="canReset"
      :fullscreen-available="fullscreenAvailable"
      :toggle-run="toggleRun"
      :reset="reset"
      :enter-fullscreen="enterFullscreen"
    />

    <CountdownFullscreenControls
      v-show="isFullscreenActive"
      :toggle-label="toggleLabel"
      :toggle-icon="toggleIcon"
      :can-reset="canReset"
      :toggle-run="toggleRun"
      :reset="reset"
      :exit-fullscreen="exitFullscreen"
    />

    <n-alert v-show="errorMessage" type="error" :title="t('errorTitle')">
      {{ errorMessage }}
    </n-alert>

    <CountdownDurationSection
      v-show="!isFullscreenActive"
      :hours="hours"
      :minutes="minutes"
      :seconds="seconds"
      :running="running"
      :preset-minutes="presetMinutes"
      :update-hours="updateHours"
      :update-minutes="updateMinutes"
      :update-seconds="updateSeconds"
      :apply-preset="applyPreset"
    />

    <CountdownAlertsSection
      v-show="!isFullscreenActive"
      v-model:sound-enabled="soundEnabled"
      v-model:vibration-enabled="vibrationEnabled"
      v-model:notification-enabled="notificationEnabled"
      :sound-supported="soundSupported"
      :vibration-supported="vibrationSupported"
      :notification-supported="notificationSupported"
      :notification-permission="notificationPermission"
      :request-notification-permission="requestNotificationPermission"
    />
  </div>
</template>

<script setup lang="ts">
import { NAlert, useThemeVars } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import CountdownAlertsSection from './CountdownAlertsSection.vue'
import CountdownControls from './CountdownControls.vue'
import CountdownDisplay from './CountdownDisplay.vue'
import CountdownDurationSection from './CountdownDurationSection.vue'
import CountdownFullscreenControls from './CountdownFullscreenControls.vue'
import { useCountdownTimer } from '../composables/useCountdownTimer'

const { t } = useI18n()
const themeVars = useThemeVars()

const countdownI18n = {
  start: () => t('start'),
  resume: () => t('resume'),
  pause: () => t('pause'),
  errorNoDuration: () => t('errorNoDuration'),
  notificationTitle: () => t('notificationTitle'),
  notificationBody: () => t('notificationBody'),
  notificationUnsupported: () => t('notificationUnsupported'),
  notificationDenied: () => t('notificationDenied'),
  notificationDefault: () => t('notificationDefault'),
  notificationGranted: () => t('notificationGranted'),
}

const {
  fullscreenTarget,
  fullscreenAvailable,
  isFullscreenActive,
  isFullscreenOverlay,
  formattedRemaining,
  toggleLabel,
  toggleIcon,
  canReset,
  hours,
  minutes,
  seconds,
  running,
  remainingMs,
  presetMinutes,
  soundEnabled,
  vibrationEnabled,
  notificationEnabled,
  soundSupported,
  vibrationSupported,
  notificationSupported,
  notificationPermission,
  notificationHint,
  updateHours,
  updateMinutes,
  updateSeconds,
  applyPreset,
  start,
  pause,
  toggleRun,
  reset,
  enterFullscreen,
  exitFullscreen,
  setBodyOverflow,
  requestNotificationPermission,
  errorMessage,
} = useCountdownTimer(countdownI18n)

defineExpose({
  remainingMs,
  notificationHint,
  start,
  pause,
  setBodyOverflow,
})
</script>

<style scoped>
.timer-root {
  position: relative;
}

.timer-root--fullscreen {
  min-height: 100vh;
  padding: calc(24px + env(safe-area-inset-top)) 16px calc(24px + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: v-bind('themeVars.bodyColor');
}

.timer-root--overlay {
  position: fixed;
  inset: 0;
  z-index: 10;
  overflow: auto;
}
</style>

<i18n lang="json">
{
  "en": {
    "start": "Start",
    "pause": "Pause",
    "resume": "Resume",
    "errorTitle": "Error",
    "errorNoDuration": "Set a duration greater than zero.",
    "notificationTitle": "Timer finished",
    "notificationBody": "Time's up.",
    "notificationUnsupported": "Notifications are not supported in this browser.",
    "notificationDenied": "Notifications are blocked in browser settings.",
    "notificationDefault": "Allow notifications to receive alerts.",
    "notificationGranted": "Notifications are enabled."
  },
  "zh": {
    "start": "开始",
    "pause": "暂停",
    "resume": "继续",
    "errorTitle": "错误",
    "errorNoDuration": "请设置大于 0 的时长。",
    "notificationTitle": "倒计时结束",
    "notificationBody": "时间到了。",
    "notificationUnsupported": "当前浏览器不支持通知。",
    "notificationDenied": "通知已在浏览器设置中被阻止。",
    "notificationDefault": "允许通知以接收提醒。",
    "notificationGranted": "通知已启用。"
  },
  "zh-CN": {
    "start": "开始",
    "pause": "暂停",
    "resume": "继续",
    "errorTitle": "错误",
    "errorNoDuration": "请设置大于 0 的时长。",
    "notificationTitle": "倒计时结束",
    "notificationBody": "时间到了。",
    "notificationUnsupported": "当前浏览器不支持通知。",
    "notificationDenied": "通知已在浏览器设置中被阻止。",
    "notificationDefault": "允许通知以接收提醒。",
    "notificationGranted": "通知已启用。"
  },
  "zh-TW": {
    "start": "開始",
    "pause": "暫停",
    "resume": "繼續",
    "errorTitle": "錯誤",
    "errorNoDuration": "請設定大於 0 的時長。",
    "notificationTitle": "倒數計時結束",
    "notificationBody": "時間到了。",
    "notificationUnsupported": "目前瀏覽器不支援通知。",
    "notificationDenied": "通知已在瀏覽器設定中被封鎖。",
    "notificationDefault": "允許通知以接收提醒。",
    "notificationGranted": "通知已啟用。"
  },
  "zh-HK": {
    "start": "開始",
    "pause": "暫停",
    "resume": "繼續",
    "errorTitle": "錯誤",
    "errorNoDuration": "請設定大於 0 的時長。",
    "notificationTitle": "倒數計時結束",
    "notificationBody": "時間到了。",
    "notificationUnsupported": "目前瀏覽器不支援通知。",
    "notificationDenied": "通知已在瀏覽器設定中被封鎖。",
    "notificationDefault": "允許通知以接收提醒。",
    "notificationGranted": "通知已啟用。"
  },
  "es": {
    "start": "Iniciar",
    "pause": "Pausar",
    "resume": "Reanudar",
    "errorTitle": "Error",
    "errorNoDuration": "Configura una duración mayor que cero.",
    "notificationTitle": "Temporizador finalizado",
    "notificationBody": "Se acabó el tiempo.",
    "notificationUnsupported": "Las notificaciones no son compatibles con este navegador.",
    "notificationDenied": "Las notificaciones están bloqueadas en la configuración del navegador.",
    "notificationDefault": "Permite notificaciones para recibir alertas.",
    "notificationGranted": "Las notificaciones están habilitadas."
  },
  "fr": {
    "start": "Démarrer",
    "pause": "Pause",
    "resume": "Reprendre",
    "errorTitle": "Erreur",
    "errorNoDuration": "Définissez une durée supérieure à zéro.",
    "notificationTitle": "Minuteur terminé",
    "notificationBody": "Le temps est écoulé.",
    "notificationUnsupported": "Les notifications ne sont pas prises en charge par ce navigateur.",
    "notificationDenied": "Les notifications sont bloquées dans les paramètres du navigateur.",
    "notificationDefault": "Autorisez les notifications pour recevoir des alertes.",
    "notificationGranted": "Les notifications sont activées."
  },
  "de": {
    "start": "Start",
    "pause": "Pause",
    "resume": "Fortsetzen",
    "errorTitle": "Fehler",
    "errorNoDuration": "Legen Sie eine Dauer größer als null fest.",
    "notificationTitle": "Timer beendet",
    "notificationBody": "Die Zeit ist abgelaufen.",
    "notificationUnsupported": "Benachrichtigungen werden in diesem Browser nicht unterstützt.",
    "notificationDenied": "Benachrichtigungen sind in den Browser-Einstellungen blockiert.",
    "notificationDefault": "Benachrichtigungen zulassen, um Hinweise zu erhalten.",
    "notificationGranted": "Benachrichtigungen sind aktiviert."
  },
  "it": {
    "start": "Avvia",
    "pause": "Pausa",
    "resume": "Riprendi",
    "errorTitle": "Errore",
    "errorNoDuration": "Imposta una durata maggiore di zero.",
    "notificationTitle": "Timer terminato",
    "notificationBody": "Il tempo è scaduto.",
    "notificationUnsupported": "Le notifiche non sono supportate da questo browser.",
    "notificationDenied": "Le notifiche sono bloccate nelle impostazioni del browser.",
    "notificationDefault": "Consenti le notifiche per ricevere gli avvisi.",
    "notificationGranted": "Le notifiche sono attive."
  },
  "ja": {
    "start": "開始",
    "pause": "一時停止",
    "resume": "再開",
    "errorTitle": "エラー",
    "errorNoDuration": "0 より大きい時間を設定してください。",
    "notificationTitle": "タイマー終了",
    "notificationBody": "時間になりました。",
    "notificationUnsupported": "このブラウザでは通知がサポートされていません。",
    "notificationDenied": "通知はブラウザ設定でブロックされています。",
    "notificationDefault": "通知を許可してアラートを受け取ってください。",
    "notificationGranted": "通知が有効になっています。"
  },
  "ko": {
    "start": "시작",
    "pause": "일시정지",
    "resume": "재개",
    "errorTitle": "오류",
    "errorNoDuration": "0보다 큰 시간을 설정하세요.",
    "notificationTitle": "타이머 종료",
    "notificationBody": "시간이 다 됐습니다.",
    "notificationUnsupported": "이 브라우저에서는 알림을 지원하지 않습니다.",
    "notificationDenied": "알림이 브라우저 설정에서 차단되었습니다.",
    "notificationDefault": "알림을 허용하면 알림을 받을 수 있습니다.",
    "notificationGranted": "알림이 활성화되었습니다."
  },
  "ru": {
    "start": "Старт",
    "pause": "Пауза",
    "resume": "Продолжить",
    "errorTitle": "Ошибка",
    "errorNoDuration": "Установите длительность больше нуля.",
    "notificationTitle": "Таймер завершён",
    "notificationBody": "Время вышло.",
    "notificationUnsupported": "Уведомления не поддерживаются этим браузером.",
    "notificationDenied": "Уведомления заблокированы в настройках браузера.",
    "notificationDefault": "Разрешите уведомления для получения оповещений.",
    "notificationGranted": "Уведомления включены."
  },
  "pt": {
    "start": "Iniciar",
    "pause": "Pausar",
    "resume": "Retomar",
    "errorTitle": "Erro",
    "errorNoDuration": "Defina uma duração maior que zero.",
    "notificationTitle": "Temporizador concluído",
    "notificationBody": "O tempo acabou.",
    "notificationUnsupported": "Notificações não são suportadas neste navegador.",
    "notificationDenied": "Notificações estão bloqueadas nas configurações do navegador.",
    "notificationDefault": "Permita notificações para receber alertas.",
    "notificationGranted": "Notificações ativadas."
  },
  "ar": {
    "start": "ابدأ",
    "pause": "إيقاف مؤقت",
    "resume": "استئناف",
    "errorTitle": "خطأ",
    "errorNoDuration": "عيّن مدة أكبر من صفر.",
    "notificationTitle": "انتهى المؤقت",
    "notificationBody": "انتهى الوقت.",
    "notificationUnsupported": "الإشعارات غير مدعومة في هذا المتصفح.",
    "notificationDenied": "تم حظر الإشعارات في إعدادات المتصفح.",
    "notificationDefault": "اسمح بالإشعارات لتلقي التنبيهات.",
    "notificationGranted": "الإشعارات مفعلة."
  },
  "hi": {
    "start": "शुरू",
    "pause": "रोकें",
    "resume": "जारी रखें",
    "errorTitle": "त्रुटि",
    "errorNoDuration": "0 से अधिक अवधि सेट करें।",
    "notificationTitle": "टाइमर समाप्त",
    "notificationBody": "समय समाप्त।",
    "notificationUnsupported": "इस ब्राउज़र में सूचनाएँ समर्थित नहीं हैं।",
    "notificationDenied": "सूचनाएँ ब्राउज़र सेटिंग में ब्लॉक हैं।",
    "notificationDefault": "अलर्ट पाने के लिए सूचनाएँ अनुमति दें।",
    "notificationGranted": "सूचनाएँ सक्षम हैं।"
  },
  "tr": {
    "start": "Başlat",
    "pause": "Duraklat",
    "resume": "Devam et",
    "errorTitle": "Hata",
    "errorNoDuration": "Sıfırdan büyük bir süre ayarlayın.",
    "notificationTitle": "Zamanlayıcı bitti",
    "notificationBody": "Süre doldu.",
    "notificationUnsupported": "Bildirimler bu tarayıcıda desteklenmiyor.",
    "notificationDenied": "Bildirimler tarayıcı ayarlarında engellendi.",
    "notificationDefault": "Uyarılar için bildirimlere izin verin.",
    "notificationGranted": "Bildirimler etkin."
  },
  "nl": {
    "start": "Start",
    "pause": "Pauze",
    "resume": "Hervatten",
    "errorTitle": "Fout",
    "errorNoDuration": "Stel een duur groter dan nul in.",
    "notificationTitle": "Timer afgelopen",
    "notificationBody": "De tijd is om.",
    "notificationUnsupported": "Notificaties worden niet ondersteund in deze browser.",
    "notificationDenied": "Notificaties zijn geblokkeerd in de browserinstellingen.",
    "notificationDefault": "Sta notificaties toe om meldingen te ontvangen.",
    "notificationGranted": "Notificaties zijn ingeschakeld."
  },
  "sv": {
    "start": "Start",
    "pause": "Paus",
    "resume": "Fortsätt",
    "errorTitle": "Fel",
    "errorNoDuration": "Ange en varaktighet större än noll.",
    "notificationTitle": "Timer klar",
    "notificationBody": "Tiden är ute.",
    "notificationUnsupported": "Notifieringar stöds inte i denna webbläsare.",
    "notificationDenied": "Notifieringar är blockerade i webbläsarens inställningar.",
    "notificationDefault": "Tillåt notifieringar för att få aviseringar.",
    "notificationGranted": "Notifieringar är aktiverade."
  },
  "pl": {
    "start": "Start",
    "pause": "Pauza",
    "resume": "Wznów",
    "errorTitle": "Błąd",
    "errorNoDuration": "Ustaw czas większy niż zero.",
    "notificationTitle": "Koniec timera",
    "notificationBody": "Czas minął.",
    "notificationUnsupported": "Powiadomienia nie są obsługiwane w tej przeglądarce.",
    "notificationDenied": "Powiadomienia są zablokowane w ustawieniach przeglądarki.",
    "notificationDefault": "Zezwól na powiadomienia, aby otrzymywać alerty.",
    "notificationGranted": "Powiadomienia są włączone."
  },
  "vi": {
    "start": "Bắt đầu",
    "pause": "Tạm dừng",
    "resume": "Tiếp tục",
    "errorTitle": "Lỗi",
    "errorNoDuration": "Hãy đặt thời lượng lớn hơn 0.",
    "notificationTitle": "Hết giờ",
    "notificationBody": "Đã hết thời gian.",
    "notificationUnsupported": "Trình duyệt này không hỗ trợ thông báo.",
    "notificationDenied": "Thông báo bị chặn trong cài đặt trình duyệt.",
    "notificationDefault": "Cho phép thông báo để nhận cảnh báo.",
    "notificationGranted": "Thông báo đã bật."
  },
  "th": {
    "start": "เริ่ม",
    "pause": "หยุดชั่วคราว",
    "resume": "ทำต่อ",
    "errorTitle": "ข้อผิดพลาด",
    "errorNoDuration": "ตั้งระยะเวลามากกว่า 0",
    "notificationTitle": "ตัวตั้งเวลาเสร็จสิ้น",
    "notificationBody": "หมดเวลาแล้ว",
    "notificationUnsupported": "เบราว์เซอร์นี้ไม่รองรับการแจ้งเตือน",
    "notificationDenied": "การแจ้งเตือนถูกบล็อกในตั้งค่าเบราว์เซอร์",
    "notificationDefault": "อนุญาตการแจ้งเตือนเพื่อรับการเตือน",
    "notificationGranted": "เปิดการแจ้งเตือนแล้ว"
  },
  "id": {
    "start": "Mulai",
    "pause": "Jeda",
    "resume": "Lanjutkan",
    "errorTitle": "Kesalahan",
    "errorNoDuration": "Atur durasi lebih dari 0.",
    "notificationTitle": "Timer selesai",
    "notificationBody": "Waktu habis.",
    "notificationUnsupported": "Notifikasi tidak didukung di browser ini.",
    "notificationDenied": "Notifikasi diblokir di pengaturan browser.",
    "notificationDefault": "Izinkan notifikasi untuk menerima peringatan.",
    "notificationGranted": "Notifikasi diaktifkan."
  },
  "he": {
    "start": "התחל",
    "pause": "השהה",
    "resume": "המשך",
    "errorTitle": "שגיאה",
    "errorNoDuration": "הגדר משך גדול מאפס.",
    "notificationTitle": "הטיימר הסתיים",
    "notificationBody": "הזמן נגמר.",
    "notificationUnsupported": "התראות אינן נתמכות בדפדפן זה.",
    "notificationDenied": "התראות נחסמו בהגדרות הדפדפן.",
    "notificationDefault": "אפשר התראות כדי לקבל התראות.",
    "notificationGranted": "התראות מופעלות."
  },
  "ms": {
    "start": "Mula",
    "pause": "Jeda",
    "resume": "Sambung",
    "errorTitle": "Ralat",
    "errorNoDuration": "Tetapkan tempoh lebih besar daripada sifar.",
    "notificationTitle": "Pemasa tamat",
    "notificationBody": "Masa tamat.",
    "notificationUnsupported": "Pemberitahuan tidak disokong dalam pelayar ini.",
    "notificationDenied": "Pemberitahuan disekat dalam tetapan pelayar.",
    "notificationDefault": "Benarkan pemberitahuan untuk menerima makluman.",
    "notificationGranted": "Pemberitahuan diaktifkan."
  },
  "no": {
    "start": "Start",
    "pause": "Pause",
    "resume": "Fortsett",
    "errorTitle": "Feil",
    "errorNoDuration": "Angi en varighet større enn null.",
    "notificationTitle": "Nedtelling ferdig",
    "notificationBody": "Tiden er ute.",
    "notificationUnsupported": "Varsler støttes ikke i denne nettleseren.",
    "notificationDenied": "Varsler er blokkert i nettleserinnstillingene.",
    "notificationDefault": "Tillat varsler for å motta påminnelser.",
    "notificationGranted": "Varsler er aktivert."
  }
}
</i18n>
