<template>
  <n-space vertical :size="16">
    <PublicKeySection :value="publicKey" :filename="publicKeyFilename" :loading="loading" />

    <PrivateKeySection :value="privateKey" :filename="privateKeyFilename" :loading="loading" />

    <FingerprintSection :value="fingerprint" :loading="loading" />

    <n-alert type="warning" :title="t('securityWarning')">
      {{ t('securityWarningContent') }}
    </n-alert>
  </n-space>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NSpace, NAlert } from 'naive-ui'
import PublicKeySection from './PublicKeySection.vue'
import PrivateKeySection from './PrivateKeySection.vue'
import FingerprintSection from './FingerprintSection.vue'

const props = defineProps<{
  publicKey: string
  privateKey: string
  fingerprint: string
  algorithm: 'ed25519' | 'rsa'
  loading?: boolean
}>()

const { t } = useI18n()

const publicKeyFilename = computed(() =>
  props.algorithm === 'ed25519' ? 'id_ed25519.pub' : 'id_rsa.pub',
)

const privateKeyFilename = computed(() => (props.algorithm === 'ed25519' ? 'id_ed25519' : 'id_rsa'))
</script>

<i18n lang="json">
{
  "en": {
    "securityWarning": "Security Warning",
    "securityWarningContent": "Never share your private key with anyone. Store it securely and consider using a passphrase for additional protection."
  },
  "zh": {
    "securityWarning": "安全警告",
    "securityWarningContent": "切勿与任何人分享您的私钥。请安全存储，并考虑使用密码短语进行额外保护。"
  },
  "zh-CN": {
    "securityWarning": "安全警告",
    "securityWarningContent": "切勿与任何人分享您的私钥。请安全存储，并考虑使用密码短语进行额外保护。"
  },
  "zh-TW": {
    "securityWarning": "安全警告",
    "securityWarningContent": "切勿與任何人分享您的私鑰。請安全存儲，並考慮使用密碼短語進行額外保護。"
  },
  "zh-HK": {
    "securityWarning": "安全警告",
    "securityWarningContent": "切勿與任何人分享您的私鑰。請安全存儲，並考慮使用密碼短語進行額外保護。"
  },
  "es": {
    "securityWarning": "Advertencia de Seguridad",
    "securityWarningContent": "Nunca comparta su clave privada con nadie. Guárdela de forma segura y considere usar una frase de contraseña para protección adicional."
  },
  "fr": {
    "securityWarning": "Avertissement de Sécurité",
    "securityWarningContent": "Ne partagez jamais votre clé privée avec quiconque. Conservez-la en lieu sûr et envisagez d'utiliser une phrase de passe pour une protection supplémentaire."
  },
  "de": {
    "securityWarning": "Sicherheitswarnung",
    "securityWarningContent": "Teilen Sie Ihren privaten Schlüssel niemals mit anderen. Bewahren Sie ihn sicher auf und erwägen Sie die Verwendung einer Passphrase für zusätzlichen Schutz."
  },
  "it": {
    "securityWarning": "Avviso di Sicurezza",
    "securityWarningContent": "Non condividere mai la tua chiave privata con nessuno. Conservala in modo sicuro e considera l'uso di una passphrase per una protezione aggiuntiva."
  },
  "ja": {
    "securityWarning": "セキュリティ警告",
    "securityWarningContent": "秘密鍵を誰とも共有しないでください。安全に保管し、追加の保護のためにパスフレーズの使用を検討してください。"
  },
  "ko": {
    "securityWarning": "보안 경고",
    "securityWarningContent": "개인 키를 누구와도 공유하지 마세요. 안전하게 보관하고 추가 보호를 위해 암호 문구 사용을 고려하세요."
  },
  "ru": {
    "securityWarning": "Предупреждение о Безопасности",
    "securityWarningContent": "Никогда не делитесь своим закрытым ключом. Храните его в безопасности и рассмотрите использование парольной фразы для дополнительной защиты."
  },
  "pt": {
    "securityWarning": "Aviso de Segurança",
    "securityWarningContent": "Nunca compartilhe sua chave privada com ninguém. Armazene-a com segurança e considere usar uma frase-senha para proteção adicional."
  },
  "ar": {
    "securityWarning": "تحذير أمني",
    "securityWarningContent": "لا تشارك مفتاحك الخاص مع أي شخص أبداً. قم بتخزينه بشكل آمن وفكر في استخدام عبارة مرور لحماية إضافية."
  },
  "hi": {
    "securityWarning": "सुरक्षा चेतावनी",
    "securityWarningContent": "अपनी निजी कुंजी किसी के साथ साझा न करें। इसे सुरक्षित रूप से संग्रहीत करें और अतिरिक्त सुरक्षा के लिए पासफ़्रेज़ का उपयोग करने पर विचार करें।"
  },
  "tr": {
    "securityWarning": "Güvenlik Uyarısı",
    "securityWarningContent": "Özel anahtarınızı asla kimseyle paylaşmayın. Güvenli bir şekilde saklayın ve ek koruma için bir parola kullanmayı düşünün."
  },
  "nl": {
    "securityWarning": "Beveiligingswaarschuwing",
    "securityWarningContent": "Deel uw privésleutel nooit met iemand. Bewaar deze veilig en overweeg een wachtwoordzin te gebruiken voor extra bescherming."
  },
  "sv": {
    "securityWarning": "Säkerhetsvarning",
    "securityWarningContent": "Dela aldrig din privata nyckel med någon. Förvara den säkert och överväg att använda en lösenfras för extra skydd."
  },
  "pl": {
    "securityWarning": "Ostrzeżenie o Bezpieczeństwie",
    "securityWarningContent": "Nigdy nie udostępniaj swojego klucza prywatnego. Przechowuj go bezpiecznie i rozważ użycie hasła dla dodatkowej ochrony."
  },
  "vi": {
    "securityWarning": "Cảnh Báo Bảo Mật",
    "securityWarningContent": "Không bao giờ chia sẻ khóa riêng tư của bạn với bất kỳ ai. Lưu trữ an toàn và cân nhắc sử dụng cụm mật khẩu để bảo vệ thêm."
  },
  "th": {
    "securityWarning": "คำเตือนด้านความปลอดภัย",
    "securityWarningContent": "อย่าแชร์คีย์ส่วนตัวของคุณกับใคร เก็บรักษาอย่างปลอดภัยและพิจารณาใช้รหัสผ่านเพื่อการป้องกันเพิ่มเติม"
  },
  "id": {
    "securityWarning": "Peringatan Keamanan",
    "securityWarningContent": "Jangan pernah membagikan kunci pribadi Anda kepada siapa pun. Simpan dengan aman dan pertimbangkan menggunakan frasa sandi untuk perlindungan tambahan."
  },
  "he": {
    "securityWarning": "אזהרת אבטחה",
    "securityWarningContent": "לעולם אל תשתף את המפתח הפרטי שלך עם אף אחד. אחסן אותו בצורה מאובטחת ושקול להשתמש במשפט סיסמה להגנה נוספת."
  },
  "ms": {
    "securityWarning": "Amaran Keselamatan",
    "securityWarningContent": "Jangan sesekali berkongsi kunci peribadi anda dengan sesiapa. Simpan dengan selamat dan pertimbangkan untuk menggunakan frasa laluan untuk perlindungan tambahan."
  },
  "no": {
    "securityWarning": "Sikkerhetsadvarsel",
    "securityWarningContent": "Del aldri din private nøkkel med noen. Oppbevar den sikkert og vurder å bruke en passordfrase for ekstra beskyttelse."
  }
}
</i18n>
