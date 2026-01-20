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

      <template v-if="isScanning">
        <NText depth="3">{{ t('pointAtCode') }}</NText>
      </template>
      <template v-else />
    </template>
  </NFlex>
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NAlert, NButton, NFlex, NIcon, NText } from 'naive-ui'
import Camera24Regular from '@vicons/fluent/Camera24Regular'
import Stop24Regular from '@vicons/fluent/Stop24Regular'
import type { IScannerControls } from '@zxing/browser'
import {
  createBarcodeReader,
  isIgnorableDecodeError,
  toBarcodeResult,
  type BarcodeScanResult,
} from '../barcode-reader'

const { t } = useI18n()

const emit = defineEmits<{
  decoded: [data: BarcodeScanResult]
  error: [message: string]
}>()

const videoRef = ref<HTMLVideoElement>()
const isScanning = ref(false)
const permissionDenied = ref(false)
let scannerControls: IScannerControls | null = null

const isSupported = computed(() => {
  return typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia
})

async function requestCamera() {
  permissionDenied.value = false
  await nextTick()
  await startCamera()
}

function stopCamera() {
  isScanning.value = false

  if (scannerControls) {
    scannerControls.stop()
    scannerControls = null
  }

  if (videoRef.value?.srcObject) {
    const stream = videoRef.value.srcObject as MediaStream
    stream.getTracks().forEach((track) => track.stop())
    videoRef.value.srcObject = null
  }
}

async function startCamera() {
  if (!videoRef.value) return

  try {
    isScanning.value = true
    permissionDenied.value = false

    const reader = createBarcodeReader()
    const controls = await reader.decodeFromVideoDevice(
      undefined,
      videoRef.value,
      (result, error) => {
        if (result) {
          emit('decoded', toBarcodeResult(result))
          stopCamera()
          return
        }

        if (error && !isIgnorableDecodeError(error)) {
          emit('error', t('cameraError'))
          stopCamera()
        }
      },
    )

    if (!isScanning.value) {
      controls.stop()
      return
    }

    scannerControls = controls
  } catch (err) {
    stopCamera()

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
    "pointAtCode": "Point camera at a barcode or QR code",
    "cameraNotSupported": "Camera is not supported in this browser",
    "cameraPermissionDenied": "Camera permission denied. Please allow camera access.",
    "retryPermission": "Retry",
    "cameraError": "Failed to access camera"
  },
  "zh": {
    "startCamera": "启动摄像头",
    "stopCamera": "停止摄像头",
    "pointAtCode": "将摄像头对准条形码或二维码",
    "cameraNotSupported": "此浏览器不支持摄像头",
    "cameraPermissionDenied": "摄像头权限被拒绝，请允许摄像头访问",
    "retryPermission": "重试",
    "cameraError": "无法访问摄像头"
  },
  "zh-CN": {
    "startCamera": "启动摄像头",
    "stopCamera": "停止摄像头",
    "pointAtCode": "将摄像头对准条形码或二维码",
    "cameraNotSupported": "此浏览器不支持摄像头",
    "cameraPermissionDenied": "摄像头权限被拒绝，请允许摄像头访问",
    "retryPermission": "重试",
    "cameraError": "无法访问摄像头"
  },
  "zh-TW": {
    "startCamera": "啟動攝影機",
    "stopCamera": "停止攝影機",
    "pointAtCode": "將攝影機對準條碼或 QR Code",
    "cameraNotSupported": "此瀏覽器不支援攝影機",
    "cameraPermissionDenied": "攝影機權限被拒絕，請允許攝影機存取",
    "retryPermission": "重試",
    "cameraError": "無法存取攝影機"
  },
  "zh-HK": {
    "startCamera": "啟動攝影機",
    "stopCamera": "停止攝影機",
    "pointAtCode": "將攝影機對準條碼或 QR Code",
    "cameraNotSupported": "此瀏覽器不支援攝影機",
    "cameraPermissionDenied": "攝影機權限被拒絕，請允許攝影機存取",
    "retryPermission": "重試",
    "cameraError": "無法存取攝影機"
  },
  "es": {
    "startCamera": "Iniciar camara",
    "stopCamera": "Detener camara",
    "pointAtCode": "Apunta la camara a un codigo de barras o QR",
    "cameraNotSupported": "La camara no es compatible con este navegador",
    "cameraPermissionDenied": "Permiso de camara denegado. Por favor permita el acceso.",
    "retryPermission": "Reintentar",
    "cameraError": "Error al acceder a la camara"
  },
  "fr": {
    "startCamera": "Demarrer la camera",
    "stopCamera": "Arreter la camera",
    "pointAtCode": "Pointez la camera vers un code-barres ou QR",
    "cameraNotSupported": "La camera n'est pas prise en charge dans ce navigateur",
    "cameraPermissionDenied": "Permission de la camera refusee. Veuillez autoriser l'acces.",
    "retryPermission": "Reessayer",
    "cameraError": "Impossible d'acceder a la camera"
  },
  "de": {
    "startCamera": "Kamera starten",
    "stopCamera": "Kamera stoppen",
    "pointAtCode": "Richten Sie die Kamera auf einen Barcode oder QR-Code",
    "cameraNotSupported": "Kamera wird in diesem Browser nicht unterstutzt",
    "cameraPermissionDenied": "Kameraberechtigung verweigert. Bitte erlauben Sie den Zugriff.",
    "retryPermission": "Erneut versuchen",
    "cameraError": "Kamerazugriff fehlgeschlagen"
  },
  "it": {
    "startCamera": "Avvia fotocamera",
    "stopCamera": "Ferma fotocamera",
    "pointAtCode": "Punta la fotocamera verso un codice a barre o QR",
    "cameraNotSupported": "La fotocamera non e supportata in questo browser",
    "cameraPermissionDenied": "Permesso fotocamera negato. Si prega di consentire l'accesso.",
    "retryPermission": "Riprova",
    "cameraError": "Impossibile accedere alla fotocamera"
  },
  "ja": {
    "startCamera": "カメラを起動",
    "stopCamera": "カメラを停止",
    "pointAtCode": "カメラをバーコードまたはQRコードに向けてください",
    "cameraNotSupported": "このブラウザではカメラがサポートされていません",
    "cameraPermissionDenied": "カメラの許可が拒否されました。アクセスを許可してください。",
    "retryPermission": "再試行",
    "cameraError": "カメラにアクセスできませんでした"
  },
  "ko": {
    "startCamera": "카메라 시작",
    "stopCamera": "카메라 중지",
    "pointAtCode": "카메라를 바코드 또는 QR 코드에 맞추세요",
    "cameraNotSupported": "이 브라우저에서는 카메라가 지원되지 않습니다",
    "cameraPermissionDenied": "카메라 권한이 거부되었습니다. 접근을 허용해주세요.",
    "retryPermission": "다시 시도",
    "cameraError": "카메라에 접근할 수 없습니다"
  },
  "ru": {
    "startCamera": "Запустить камеру",
    "stopCamera": "Остановить камеру",
    "pointAtCode": "Наведите камеру на штрихкод или QR-код",
    "cameraNotSupported": "Камера не поддерживается в этом браузере",
    "cameraPermissionDenied": "Доступ к камере запрещен. Пожалуйста, разрешите доступ.",
    "retryPermission": "Повторить",
    "cameraError": "Не удалось получить доступ к камере"
  },
  "pt": {
    "startCamera": "Iniciar camera",
    "stopCamera": "Parar camera",
    "pointAtCode": "Aponte a camera para um codigo de barras ou QR",
    "cameraNotSupported": "A camera nao e suportada neste navegador",
    "cameraPermissionDenied": "Permissao da camera negada. Por favor, permita o acesso.",
    "retryPermission": "Tentar novamente",
    "cameraError": "Falha ao acessar a camera"
  },
  "ar": {
    "startCamera": "بدء الكاميرا",
    "stopCamera": "إيقاف الكاميرا",
    "pointAtCode": "وجه الكاميرا نحو باركود أو QR",
    "cameraNotSupported": "الكاميرا غير مدعومة في هذا المتصفح",
    "cameraPermissionDenied": "تم رفض إذن الكاميرا. يرجى السماح بالوصول.",
    "retryPermission": "إعادة المحاولة",
    "cameraError": "فشل في الوصول إلى الكاميرا"
  },
  "hi": {
    "startCamera": "कैमरा शुरू करें",
    "stopCamera": "कैमरा बंद करें",
    "pointAtCode": "कैमरे को बारकोड या QR कोड की ओर इंगित करें",
    "cameraNotSupported": "इस ब्राउज़र में कैमरा समर्थित नहीं है",
    "cameraPermissionDenied": "कैमरा अनुमति अस्वीकृत। कृपया पहुंच की अनुमति दें।",
    "retryPermission": "पुनः प्रयास करें",
    "cameraError": "कैमरे तक पहुंचने में विफल"
  },
  "tr": {
    "startCamera": "Kamerayi baslat",
    "stopCamera": "Kamerayi durdur",
    "pointAtCode": "Kamerayi bir barkod veya QR koduna yoneltin",
    "cameraNotSupported": "Bu tarayicide kamera desteklenmiyor",
    "cameraPermissionDenied": "Kamera izni reddedildi. Lutfen erisime izin verin.",
    "retryPermission": "Tekrar dene",
    "cameraError": "Kameraya erisilemedi"
  },
  "nl": {
    "startCamera": "Camera starten",
    "stopCamera": "Camera stoppen",
    "pointAtCode": "Richt de camera op een barcode of QR-code",
    "cameraNotSupported": "Camera wordt niet ondersteund in deze browser",
    "cameraPermissionDenied": "Camera toestemming geweigerd. Sta toegang toe.",
    "retryPermission": "Opnieuw proberen",
    "cameraError": "Kan geen toegang krijgen tot camera"
  },
  "sv": {
    "startCamera": "Starta kamera",
    "stopCamera": "Stoppa kamera",
    "pointAtCode": "Rikta kameran mot en streckkod eller QR-kod",
    "cameraNotSupported": "Kamera stods inte i denna webblasare",
    "cameraPermissionDenied": "Kameratillstand nekades. Ge atkomst.",
    "retryPermission": "Forsok igen",
    "cameraError": "Kunde inte komma at kameran"
  },
  "pl": {
    "startCamera": "Uruchom kamere",
    "stopCamera": "Zatrzymaj kamere",
    "pointAtCode": "Skieruj kamere na kod kreskowy lub QR",
    "cameraNotSupported": "Kamera nie jest obslugiwana w tej przegladarce",
    "cameraPermissionDenied": "Odmowiono dostepu do kamery. Prosze zezwolic na dostep.",
    "retryPermission": "Ponow probe",
    "cameraError": "Nie udalo sie uzyskac dostepu do kamery"
  },
  "vi": {
    "startCamera": "Bat camera",
    "stopCamera": "Dung camera",
    "pointAtCode": "Huong camera vao ma vach hoac QR",
    "cameraNotSupported": "Camera khong duoc ho tro tren trinh duyet nay",
    "cameraPermissionDenied": "Quyen truy cap camera bi tu choi. Vui long cho phep truy cap.",
    "retryPermission": "Thu lai",
    "cameraError": "Khong the truy cap camera"
  },
  "th": {
    "startCamera": "เริ่มกล้อง",
    "stopCamera": "หยุดกล้อง",
    "pointAtCode": "หันกล้องไปที่บาร์โค้ดหรือ QR Code",
    "cameraNotSupported": "กล้องไม่รองรับในเบราว์เซอร์นี้",
    "cameraPermissionDenied": "สิทธิ์กล้องถูกปฏิเสธ กรุณาอนุญาตการเข้าถึง",
    "retryPermission": "ลองอีกครั้ง",
    "cameraError": "ไม่สามารถเข้าถึงกล้องได้"
  },
  "id": {
    "startCamera": "Mulai kamera",
    "stopCamera": "Hentikan kamera",
    "pointAtCode": "Arahkan kamera ke barcode atau QR",
    "cameraNotSupported": "Kamera tidak didukung di browser ini",
    "cameraPermissionDenied": "Izin kamera ditolak. Harap izinkan akses.",
    "retryPermission": "Coba lagi",
    "cameraError": "Gagal mengakses kamera"
  },
  "he": {
    "startCamera": "הפעל מצלמה",
    "stopCamera": "עצור מצלמה",
    "pointAtCode": "כוון את המצלמה לברקוד או קוד QR",
    "cameraNotSupported": "המצלמה אינה נתמכת בדפדפן זה",
    "cameraPermissionDenied": "הרשאת מצלמה נדחתה. אנא אפשר גישה.",
    "retryPermission": "נסה שוב",
    "cameraError": "נכשל בגישה למצלמה"
  },
  "ms": {
    "startCamera": "Mulakan kamera",
    "stopCamera": "Hentikan kamera",
    "pointAtCode": "Halakan kamera ke kod bar atau QR",
    "cameraNotSupported": "Kamera tidak disokong dalam pelayar ini",
    "cameraPermissionDenied": "Kebenaran kamera ditolak. Sila benarkan akses.",
    "retryPermission": "Cuba lagi",
    "cameraError": "Gagal mengakses kamera"
  },
  "no": {
    "startCamera": "Start kamera",
    "stopCamera": "Stopp kamera",
    "pointAtCode": "Pek kameraet mot en strekkode eller QR-kode",
    "cameraNotSupported": "Kamera stettes ikke i denne nettleseren",
    "cameraPermissionDenied": "Kameratillatelse nektet. Vennligst tillat tilgang.",
    "retryPermission": "Prov igjen",
    "cameraError": "Kunne ikke fa tilgang til kamera"
  }
}
</i18n>
