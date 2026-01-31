<template>
  <NFlex vertical :size="16" align="center">
    <template v-if="!isSupported">
      <NAlert type="warning">{{ t('cameraNotSupported') }}</NAlert>
    </template>
    <template v-else-if="permissionDenied">
      <NAlert type="error">{{ t('cameraPermissionDenied') }}</NAlert>
      <NButton @click="requestCamera">{{ t('retryPermission') }}</NButton>
    </template>
    <template v-else>
      <NFlex :size="12">
        <NButton v-if="!isScanning" type="primary" @click="startCamera">
          <template #icon>
            <NIcon><Camera24Regular /></NIcon>
          </template>
          {{ t('startCamera') }}
        </NButton>
        <NButton v-else type="error" @click="stopCamera">
          <template #icon>
            <NIcon><Stop24Regular /></NIcon>
          </template>
          {{ t('stopCamera') }}
        </NButton>
      </NFlex>

      <div v-show="isScanning" class="video-container">
        <video ref="videoRef" autoplay playsinline muted />
        <div class="scan-overlay">
          <div class="scan-line" />
        </div>
      </div>

      <NText v-if="isScanning" depth="3">{{ t('pointAtQRCode') }}</NText>
    </template>
  </NFlex>
</template>

<script setup lang="ts">
import { ref, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NFlex, NButton, NIcon, NAlert, NText } from 'naive-ui'
import Camera24Regular from '@vicons/fluent/Camera24Regular'
import Stop24Regular from '@vicons/fluent/Stop24Regular'
import { readQRFromVideo } from '../qr-reader'

const emit = defineEmits<{
  decoded: [data: string]
  error: [message: string]
}>()

const { t } = useI18n()

const videoRef = ref<HTMLVideoElement>()
const isScanning = ref(false)
const permissionDenied = ref(false)
const canvas = document.createElement('canvas')
let animationId: number | null = null

const isSupported = computed(() => {
  return typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia
})

async function requestCamera() {
  permissionDenied.value = false
  await startCamera()
}

async function startCamera() {
  if (!videoRef.value) return

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
    })
    videoRef.value.srcObject = stream
    await videoRef.value.play()
    isScanning.value = true
    permissionDenied.value = false
    scanLoop()
  } catch (err) {
    if (
      err instanceof Error &&
      (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')
    ) {
      permissionDenied.value = true
      emit('error', t('cameraPermissionDenied'))
    } else {
      emit('error', t('cameraError'))
    }
  }
}

function scanLoop() {
  if (!videoRef.value || !isScanning.value) return

  const result = readQRFromVideo(videoRef.value, canvas)
  if (result) {
    emit('decoded', result)
    stopCamera()
  } else {
    animationId = requestAnimationFrame(scanLoop)
  }
}

function stopCamera() {
  isScanning.value = false

  if (animationId !== null) {
    cancelAnimationFrame(animationId)
    animationId = null
  }

  if (videoRef.value?.srcObject) {
    const stream = videoRef.value.srcObject as MediaStream
    stream.getTracks().forEach((track) => track.stop())
    videoRef.value.srcObject = null
  }
}

onUnmounted(stopCamera)
</script>

<style scoped>
.video-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
  background: #000;
}

.video-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scan-overlay {
  position: absolute;
  inset: 0;
  border: 2px solid rgba(24, 160, 88, 0.5);
  border-radius: 8px;
  pointer-events: none;
}

.scan-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #18a058, transparent);
  animation: scan 2s ease-in-out infinite;
}

@keyframes scan {
  0%,
  100% {
    top: 10%;
  }
  50% {
    top: 90%;
  }
}
</style>

<i18n lang="json">
{
  "en": {
    "startCamera": "Start Camera",
    "stopCamera": "Stop Camera",
    "pointAtQRCode": "Point camera at a QR code",
    "cameraNotSupported": "Camera is not supported in this browser",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "retryPermission": "Retry",
    "cameraError": "Failed to access camera"
  },
  "zh": {
    "startCamera": "启动摄像头",
    "stopCamera": "停止摄像头",
    "pointAtQRCode": "将摄像头对准二维码",
    "cameraNotSupported": "此浏览器不支持摄像头",
    "cameraPermissionDenied": "摄像头权限被拒绝，请允许摄像头访问",
    "retryPermission": "重试",
    "cameraError": "无法访问摄像头"
  },
  "zh-CN": {
    "startCamera": "启动摄像头",
    "stopCamera": "停止摄像头",
    "pointAtQRCode": "将摄像头对准二维码",
    "cameraNotSupported": "此浏览器不支持摄像头",
    "cameraPermissionDenied": "摄像头权限被拒绝，请允许摄像头访问",
    "retryPermission": "重试",
    "cameraError": "无法访问摄像头"
  },
  "zh-TW": {
    "startCamera": "啟動攝影機",
    "stopCamera": "停止攝影機",
    "pointAtQRCode": "將攝影機對準 QR Code",
    "cameraNotSupported": "此瀏覽器不支援攝影機",
    "cameraPermissionDenied": "攝影機權限被拒絕，請允許攝影機存取",
    "retryPermission": "重試",
    "cameraError": "無法存取攝影機"
  },
  "zh-HK": {
    "startCamera": "啟動攝影機",
    "stopCamera": "停止攝影機",
    "pointAtQRCode": "將攝影機對準 QR Code",
    "cameraNotSupported": "此瀏覽器不支援攝影機",
    "cameraPermissionDenied": "攝影機權限被拒絕，請允許攝影機存取",
    "retryPermission": "重試",
    "cameraError": "無法存取攝影機"
  },
  "es": {
    "startCamera": "Iniciar camara",
    "stopCamera": "Detener camara",
    "pointAtQRCode": "Apunta la camara a un codigo QR",
    "cameraNotSupported": "La camara no es compatible con este navegador",
    "cameraPermissionDenied": "Permiso de camara denegado. Por favor permita el acceso.",
    "retryPermission": "Reintentar",
    "cameraError": "Error al acceder a la camara"
  },
  "fr": {
    "startCamera": "Demarrer la camera",
    "stopCamera": "Arreter la camera",
    "pointAtQRCode": "Pointez la camera vers un code QR",
    "cameraNotSupported": "La camera n'est pas prise en charge dans ce navigateur",
    "cameraPermissionDenied": "Permission de la camera refusee. Veuillez autoriser l'acces.",
    "retryPermission": "Reessayer",
    "cameraError": "Impossible d'acceder a la camera"
  },
  "de": {
    "startCamera": "Kamera starten",
    "stopCamera": "Kamera stoppen",
    "pointAtQRCode": "Richten Sie die Kamera auf einen QR-Code",
    "cameraNotSupported": "Kamera wird in diesem Browser nicht unterstutzt",
    "cameraPermissionDenied": "Kameraberechtigung verweigert. Bitte erlauben Sie den Zugriff.",
    "retryPermission": "Erneut versuchen",
    "cameraError": "Kamerazugriff fehlgeschlagen"
  },
  "it": {
    "startCamera": "Avvia fotocamera",
    "stopCamera": "Ferma fotocamera",
    "pointAtQRCode": "Punta la fotocamera verso un codice QR",
    "cameraNotSupported": "La fotocamera non e supportata in questo browser",
    "cameraPermissionDenied": "Permesso fotocamera negato. Si prega di consentire l'accesso.",
    "retryPermission": "Riprova",
    "cameraError": "Impossibile accedere alla fotocamera"
  },
  "ja": {
    "startCamera": "カメラを起動",
    "stopCamera": "カメラを停止",
    "pointAtQRCode": "カメラをQRコードに向けてください",
    "cameraNotSupported": "このブラウザではカメラがサポートされていません",
    "cameraPermissionDenied": "カメラの許可が拒否されました。アクセスを許可してください。",
    "retryPermission": "再試行",
    "cameraError": "カメラにアクセスできませんでした"
  },
  "ko": {
    "startCamera": "카메라 시작",
    "stopCamera": "카메라 중지",
    "pointAtQRCode": "카메라를 QR 코드에 맞추세요",
    "cameraNotSupported": "이 브라우저에서는 카메라가 지원되지 않습니다",
    "cameraPermissionDenied": "카메라 권한이 거부되었습니다. 접근을 허용해주세요.",
    "retryPermission": "다시 시도",
    "cameraError": "카메라에 접근할 수 없습니다"
  },
  "ru": {
    "startCamera": "Запустить камеру",
    "stopCamera": "Остановить камеру",
    "pointAtQRCode": "Наведите камеру на QR-код",
    "cameraNotSupported": "Камера не поддерживается в этом браузере",
    "cameraPermissionDenied": "Доступ к камере запрещен. Пожалуйста, разрешите доступ.",
    "retryPermission": "Повторить",
    "cameraError": "Не удалось получить доступ к камере"
  },
  "pt": {
    "startCamera": "Iniciar camera",
    "stopCamera": "Parar camera",
    "pointAtQRCode": "Aponte a camera para um codigo QR",
    "cameraNotSupported": "A camera nao e suportada neste navegador",
    "cameraPermissionDenied": "Permissao da camera negada. Por favor, permita o acesso.",
    "retryPermission": "Tentar novamente",
    "cameraError": "Falha ao acessar a camera"
  },
  "ar": {
    "startCamera": "بدء الكاميرا",
    "stopCamera": "إيقاف الكاميرا",
    "pointAtQRCode": "وجه الكاميرا نحو رمز QR",
    "cameraNotSupported": "الكاميرا غير مدعومة في هذا المتصفح",
    "cameraPermissionDenied": "تم رفض إذن الكاميرا. يرجى السماح بالوصول.",
    "retryPermission": "إعادة المحاولة",
    "cameraError": "فشل في الوصول إلى الكاميرا"
  },
  "hi": {
    "startCamera": "कैमरा शुरू करें",
    "stopCamera": "कैमरा बंद करें",
    "pointAtQRCode": "कैमरे को QR कोड की ओर इंगित करें",
    "cameraNotSupported": "इस ब्राउज़र में कैमरा समर्थित नहीं है",
    "cameraPermissionDenied": "कैमरा अनुमति अस्वीकृत। कृपया पहुंच की अनुमति दें।",
    "retryPermission": "पुनः प्रयास करें",
    "cameraError": "कैमरे तक पहुंचने में विफल"
  },
  "tr": {
    "startCamera": "Kamerayi baslat",
    "stopCamera": "Kamerayi durdur",
    "pointAtQRCode": "Kamerayi bir QR koduna yoneltin",
    "cameraNotSupported": "Bu tarayicide kamera desteklenmiyor",
    "cameraPermissionDenied": "Kamera izni reddedildi. Lutfen erisime izin verin.",
    "retryPermission": "Tekrar dene",
    "cameraError": "Kameraya erisilemedi"
  },
  "nl": {
    "startCamera": "Camera starten",
    "stopCamera": "Camera stoppen",
    "pointAtQRCode": "Richt de camera op een QR-code",
    "cameraNotSupported": "Camera wordt niet ondersteund in deze browser",
    "cameraPermissionDenied": "Camera toestemming geweigerd. Sta toegang toe.",
    "retryPermission": "Opnieuw proberen",
    "cameraError": "Kan geen toegang krijgen tot camera"
  },
  "sv": {
    "startCamera": "Starta kamera",
    "stopCamera": "Stoppa kamera",
    "pointAtQRCode": "Rikta kameran mot en QR-kod",
    "cameraNotSupported": "Kamera stods inte i denna webblasare",
    "cameraPermissionDenied": "Kameratillstand nekades. Ge atkomst.",
    "retryPermission": "Forsok igen",
    "cameraError": "Kunde inte komma at kameran"
  },
  "pl": {
    "startCamera": "Uruchom kamere",
    "stopCamera": "Zatrzymaj kamere",
    "pointAtQRCode": "Skieruj kamere na kod QR",
    "cameraNotSupported": "Kamera nie jest obslugiwana w tej przegladarce",
    "cameraPermissionDenied": "Odmowiono dostepu do kamery. Prosze zezwolic na dostep.",
    "retryPermission": "Ponow probe",
    "cameraError": "Nie udalo sie uzyskac dostepu do kamery"
  },
  "vi": {
    "startCamera": "Bat camera",
    "stopCamera": "Dung camera",
    "pointAtQRCode": "Huong camera vao ma QR",
    "cameraNotSupported": "Camera khong duoc ho tro tren trinh duyet nay",
    "cameraPermissionDenied": "Quyen truy cap camera bi tu choi. Vui long cho phep truy cap.",
    "retryPermission": "Thu lai",
    "cameraError": "Khong the truy cap camera"
  },
  "th": {
    "startCamera": "เริ่มกล้อง",
    "stopCamera": "หยุดกล้อง",
    "pointAtQRCode": "หันกล้องไปที่ QR Code",
    "cameraNotSupported": "กล้องไม่รองรับในเบราว์เซอร์นี้",
    "cameraPermissionDenied": "สิทธิ์กล้องถูกปฏิเสธ กรุณาอนุญาตการเข้าถึง",
    "retryPermission": "ลองอีกครั้ง",
    "cameraError": "ไม่สามารถเข้าถึงกล้องได้"
  },
  "id": {
    "startCamera": "Mulai kamera",
    "stopCamera": "Hentikan kamera",
    "pointAtQRCode": "Arahkan kamera ke kode QR",
    "cameraNotSupported": "Kamera tidak didukung di browser ini",
    "cameraPermissionDenied": "Izin kamera ditolak. Harap izinkan akses.",
    "retryPermission": "Coba lagi",
    "cameraError": "Gagal mengakses kamera"
  },
  "he": {
    "startCamera": "הפעל מצלמה",
    "stopCamera": "עצור מצלמה",
    "pointAtQRCode": "כוון את המצלמה לקוד QR",
    "cameraNotSupported": "המצלמה אינה נתמכת בדפדפן זה",
    "cameraPermissionDenied": "הרשאת מצלמה נדחתה. אנא אפשר גישה.",
    "retryPermission": "נסה שוב",
    "cameraError": "נכשל בגישה למצלמה"
  },
  "ms": {
    "startCamera": "Mulakan kamera",
    "stopCamera": "Hentikan kamera",
    "pointAtQRCode": "Halakan kamera ke kod QR",
    "cameraNotSupported": "Kamera tidak disokong dalam pelayar ini",
    "cameraPermissionDenied": "Kebenaran kamera ditolak. Sila benarkan akses.",
    "retryPermission": "Cuba lagi",
    "cameraError": "Gagal mengakses kamera"
  },
  "no": {
    "startCamera": "Start kamera",
    "stopCamera": "Stopp kamera",
    "pointAtQRCode": "Pek kameraet mot en QR-kode",
    "cameraNotSupported": "Kamera stettes ikke i denne nettleseren",
    "cameraPermissionDenied": "Kameratillatelse nektet. Vennligst tillat tilgang.",
    "retryPermission": "Prov igjen",
    "cameraError": "Kunne ikke fa tilgang til kamera"
  }
}
</i18n>
