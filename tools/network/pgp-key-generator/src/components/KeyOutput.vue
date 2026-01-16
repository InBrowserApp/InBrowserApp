<template>
  <n-space vertical :size="16">
    <PublicKeySection :value="keyPair.publicKey" :filename="publicKeyFilename" />

    <PrivateKeySection :value="keyPair.privateKey" :filename="privateKeyFilename" />

    <RevocationCertificateSection
      v-if="revocationCertificateAvailable"
      :value="keyPair.revocationCertificate"
      :filename="revocationFilename"
    />

    <FingerprintSection
      :fingerprint="keyPair.fingerprint"
      :key-id="keyPair.keyID"
      :user-id="keyPair.userID"
    />

    <n-alert type="warning" :title="t('securityWarning')">
      {{ t('securityWarningContent') }}
    </n-alert>

    <n-alert v-if="!passphraseProtected" type="warning" :title="t('unprotectedWarning')">
      {{ t('unprotectedWarningContent') }}
    </n-alert>
  </n-space>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NSpace, NAlert } from 'naive-ui'
import PublicKeySection from './PublicKeySection.vue'
import PrivateKeySection from './PrivateKeySection.vue'
import RevocationCertificateSection from './RevocationCertificateSection.vue'
import FingerprintSection from './FingerprintSection.vue'
import type { PgpKeyPair } from '../pgp-keygen'

const props = defineProps<{
  keyPair: PgpKeyPair
  passphraseProtected: boolean
}>()

const { t } = useI18n()

const keyIdSuffix = computed(() => props.keyPair.keyID.toLowerCase())
const publicKeyFilename = computed(() => `pgp-public-${keyIdSuffix.value}.asc`)
const privateKeyFilename = computed(() => `pgp-private-${keyIdSuffix.value}.asc`)
const revocationFilename = computed(() => `pgp-revocation-${keyIdSuffix.value}.asc`)
const revocationCertificateAvailable = computed(
  () => props.keyPair.revocationCertificate.trim().length > 0,
)
</script>

<i18n lang="json">
{
  "en": {
    "securityWarning": "Security Warning",
    "securityWarningContent": "Never share your private key. Store the revocation certificate separately and consider using a passphrase.",
    "unprotectedWarning": "Private key not protected",
    "unprotectedWarningContent": "This private key is not protected by a passphrase."
  },
  "zh": {
    "securityWarning": "安全警告",
    "securityWarningContent": "切勿分享私钥。请单独保存吊销证书，并考虑使用密码短语。",
    "unprotectedWarning": "私钥未受保护",
    "unprotectedWarningContent": "此私钥未使用密码短语保护。"
  },
  "zh-CN": {
    "securityWarning": "安全警告",
    "securityWarningContent": "切勿分享私钥。请单独保存吊销证书，并考虑使用密码短语。",
    "unprotectedWarning": "私钥未受保护",
    "unprotectedWarningContent": "此私钥未使用密码短语保护。"
  },
  "zh-TW": {
    "securityWarning": "安全警告",
    "securityWarningContent": "切勿分享私鑰。請單獨保存撤銷憑證，並考慮使用密碼短語。",
    "unprotectedWarning": "私鑰未受保護",
    "unprotectedWarningContent": "此私鑰未使用密碼短語保護。"
  },
  "zh-HK": {
    "securityWarning": "安全警告",
    "securityWarningContent": "切勿分享私鑰。請單獨保存撤銷憑證，並考慮使用密碼短語。",
    "unprotectedWarning": "私鑰未受保護",
    "unprotectedWarningContent": "此私鑰未使用密碼短語保護。"
  },
  "es": {
    "securityWarning": "Advertencia de Seguridad",
    "securityWarningContent": "Nunca compartas tu clave privada. Guarda el certificado de revocación por separado y considera usar una frase de contraseña.",
    "unprotectedWarning": "Clave privada sin protección",
    "unprotectedWarningContent": "Esta clave privada no está protegida por una frase de contraseña."
  },
  "fr": {
    "securityWarning": "Avertissement de Sécurité",
    "securityWarningContent": "Ne partagez jamais votre clé privée. Conservez le certificat de révocation séparément et envisagez d'utiliser une phrase de passe.",
    "unprotectedWarning": "Clé privée non protégée",
    "unprotectedWarningContent": "Cette clé privée n'est pas protégée par une phrase de passe."
  },
  "de": {
    "securityWarning": "Sicherheitswarnung",
    "securityWarningContent": "Teilen Sie Ihren privaten Schlüssel niemals. Bewahren Sie das Widerrufszertifikat separat auf und erwägen Sie eine Passphrase.",
    "unprotectedWarning": "Privater Schlüssel ungeschützt",
    "unprotectedWarningContent": "Dieser private Schlüssel ist nicht durch eine Passphrase geschützt."
  },
  "it": {
    "securityWarning": "Avviso di Sicurezza",
    "securityWarningContent": "Non condividere mai la tua chiave privata. Conserva separatamente il certificato di revoca e considera l'uso di una passphrase.",
    "unprotectedWarning": "Chiave privata non protetta",
    "unprotectedWarningContent": "Questa chiave privata non è protetta da una passphrase."
  },
  "ja": {
    "securityWarning": "セキュリティ警告",
    "securityWarningContent": "秘密鍵を共有しないでください。失効証明書は別に保管し、パスフレーズの使用を検討してください。",
    "unprotectedWarning": "秘密鍵は保護されていません",
    "unprotectedWarningContent": "この秘密鍵はパスフレーズで保護されていません。"
  },
  "ko": {
    "securityWarning": "보안 경고",
    "securityWarningContent": "개인 키를 공유하지 마세요. 폐기 인증서를 별도로 보관하고 암호문구 사용을 고려하세요.",
    "unprotectedWarning": "개인 키 보호 안 됨",
    "unprotectedWarningContent": "이 개인 키는 암호문구로 보호되지 않습니다."
  },
  "ru": {
    "securityWarning": "Предупреждение о безопасности",
    "securityWarningContent": "Никогда не делитесь закрытым ключом. Храните сертификат отзыва отдельно и используйте парольную фразу.",
    "unprotectedWarning": "Закрытый ключ не защищен",
    "unprotectedWarningContent": "Этот закрытый ключ не защищен парольной фразой."
  },
  "pt": {
    "securityWarning": "Aviso de Segurança",
    "securityWarningContent": "Nunca compartilhe sua chave privada. Guarde o certificado de revogação separadamente e considere usar uma frase-senha.",
    "unprotectedWarning": "Chave privada não protegida",
    "unprotectedWarningContent": "Esta chave privada não está protegida por uma frase-senha."
  },
  "ar": {
    "securityWarning": "تحذير أمني",
    "securityWarningContent": "لا تشارك مفتاحك الخاص. احفظ شهادة الإلغاء بشكل منفصل وفكّر في استخدام عبارة مرور.",
    "unprotectedWarning": "المفتاح الخاص غير محمي",
    "unprotectedWarningContent": "هذا المفتاح الخاص غير محمي بعبارة مرور."
  },
  "hi": {
    "securityWarning": "सुरक्षा चेतावनी",
    "securityWarningContent": "अपनी निजी कुंजी साझा न करें। निरस्तीकरण प्रमाणपत्र को अलग रखें और पासफ़्रेज़ का उपयोग करने पर विचार करें।",
    "unprotectedWarning": "निजी कुंजी असुरक्षित",
    "unprotectedWarningContent": "यह निजी कुंजी पासफ़्रेज़ से सुरक्षित नहीं है।"
  },
  "tr": {
    "securityWarning": "Güvenlik Uyarısı",
    "securityWarningContent": "Özel anahtarınızı paylaşmayın. İptal sertifikasını ayrı saklayın ve parola ifadesi kullanmayı düşünün.",
    "unprotectedWarning": "Özel anahtar korunmuyor",
    "unprotectedWarningContent": "Bu özel anahtar bir parola ifadesiyle korunmuyor."
  },
  "nl": {
    "securityWarning": "Beveiligingswaarschuwing",
    "securityWarningContent": "Deel uw privésleutel nooit. Bewaar het intrekkingscertificaat apart en overweeg een wachtwoordzin.",
    "unprotectedWarning": "Privésleutel niet beschermd",
    "unprotectedWarningContent": "Deze privésleutel is niet beschermd met een wachtwoordzin."
  },
  "sv": {
    "securityWarning": "Säkerhetsvarning",
    "securityWarningContent": "Dela aldrig din privata nyckel. Förvara återkallelsescertifikatet separat och överväg en lösenfras.",
    "unprotectedWarning": "Privat nyckel är oskyddad",
    "unprotectedWarningContent": "Den här privata nyckeln är inte skyddad med en lösenfras."
  },
  "pl": {
    "securityWarning": "Ostrzeżenie o bezpieczeństwie",
    "securityWarningContent": "Nigdy nie udostępniaj klucza prywatnego. Przechowuj certyfikat unieważnienia osobno i rozważ użycie frazy hasła.",
    "unprotectedWarning": "Klucz prywatny bez ochrony",
    "unprotectedWarningContent": "Ten klucz prywatny nie jest chroniony frazą hasła."
  },
  "vi": {
    "securityWarning": "Cảnh báo bảo mật",
    "securityWarningContent": "Không chia sẻ khóa riêng tư. Lưu chứng chỉ thu hồi riêng và cân nhắc dùng cụm mật khẩu.",
    "unprotectedWarning": "Khóa riêng tư không được bảo vệ",
    "unprotectedWarningContent": "Khóa riêng tư này không được bảo vệ bằng cụm mật khẩu."
  },
  "th": {
    "securityWarning": "คำเตือนด้านความปลอดภัย",
    "securityWarningContent": "อย่าแชร์คีย์ส่วนตัว เก็บใบรับรองเพิกถอนแยกต่างหากและพิจารณาใช้วลีรหัสผ่าน",
    "unprotectedWarning": "คีย์ส่วนตัวไม่ได้รับการป้องกัน",
    "unprotectedWarningContent": "คีย์ส่วนตัวนี้ไม่ได้รับการป้องกันด้วยวลีรหัสผ่าน"
  },
  "id": {
    "securityWarning": "Peringatan Keamanan",
    "securityWarningContent": "Jangan bagikan kunci privat. Simpan sertifikat pencabutan terpisah dan pertimbangkan menggunakan frasa sandi.",
    "unprotectedWarning": "Kunci privat tidak terlindungi",
    "unprotectedWarningContent": "Kunci privat ini tidak dilindungi dengan frasa sandi."
  },
  "he": {
    "securityWarning": "אזהרת אבטחה",
    "securityWarningContent": "אל תשתף את המפתח הפרטי. שמור את תעודת הביטול בנפרד ושקול להשתמש במשפט סיסמה.",
    "unprotectedWarning": "המפתח הפרטי לא מוגן",
    "unprotectedWarningContent": "המפתח הפרטי הזה אינו מוגן במשפט סיסמה."
  },
  "ms": {
    "securityWarning": "Amaran Keselamatan",
    "securityWarningContent": "Jangan kongsi kunci peribadi. Simpan sijil pembatalan secara berasingan dan pertimbangkan frasa laluan.",
    "unprotectedWarning": "Kunci peribadi tidak dilindungi",
    "unprotectedWarningContent": "Kunci peribadi ini tidak dilindungi dengan frasa laluan."
  },
  "no": {
    "securityWarning": "Sikkerhetsadvarsel",
    "securityWarningContent": "Del aldri den private nøkkelen. Oppbevar tilbakekallingssertifikatet separat og vurder en passfrase.",
    "unprotectedWarning": "Privat nøkkel er ikke beskyttet",
    "unprotectedWarningContent": "Denne private nøkkelen er ikke beskyttet med passfrase."
  }
}
</i18n>
