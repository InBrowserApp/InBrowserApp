<template>
  <n-alert type="warning" :show-icon="false" :title="t('securityNoticeTitle')">
    {{ t('securityNotice') }}
  </n-alert>

  <ToolSectionHeader>{{ t('presets') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex :wrap="true" :size="8">
      <n-button size="small" @click="onApplyPreset('allowAll')" data-testid="preset-allow-all">
        {{ t('presetAllowAll') }}
      </n-button>
      <n-button
        size="small"
        @click="onApplyPreset('disallowAll')"
        data-testid="preset-disallow-all"
      >
        {{ t('presetDisallowAll') }}
      </n-button>
      <n-button size="small" @click="onApplyPreset('blockAdmin')" data-testid="preset-block-admin">
        {{ t('presetBlockAdmin') }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NAlert, NButton, NFlex } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  onApplyPreset: (preset: 'allowAll' | 'disallowAll' | 'blockAdmin') => void
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "securityNoticeTitle": "Robots.txt is not security",
    "securityNotice": "Robots.txt is public and does not block access. Use server-side access control for sensitive content.",
    "presets": "Presets",
    "presetAllowAll": "Allow all",
    "presetDisallowAll": "Disallow all",
    "presetBlockAdmin": "Block /admin/"
  },
  "zh": {
    "securityNoticeTitle": "Robots.txt 不是安全机制",
    "securityNotice": "Robots.txt 是公开的，并不会阻止访问。敏感内容请使用服务端访问控制。",
    "presets": "预设",
    "presetAllowAll": "允许全部",
    "presetDisallowAll": "禁止全部",
    "presetBlockAdmin": "屏蔽 /admin/"
  },
  "zh-CN": {
    "securityNoticeTitle": "Robots.txt 不是安全机制",
    "securityNotice": "Robots.txt 是公开的，并不会阻止访问。敏感内容请使用服务端访问控制。",
    "presets": "预设",
    "presetAllowAll": "允许全部",
    "presetDisallowAll": "禁止全部",
    "presetBlockAdmin": "屏蔽 /admin/"
  },
  "zh-TW": {
    "securityNoticeTitle": "Robots.txt 不是安全機制",
    "securityNotice": "Robots.txt 為公開檔案，無法阻擋存取。敏感內容請使用伺服器端存取控制。",
    "presets": "預設",
    "presetAllowAll": "允許全部",
    "presetDisallowAll": "禁止全部",
    "presetBlockAdmin": "封鎖 /admin/"
  },
  "zh-HK": {
    "securityNoticeTitle": "Robots.txt 不是安全機制",
    "securityNotice": "Robots.txt 為公開檔案，無法阻擋存取。敏感內容請使用伺服器端存取控制。",
    "presets": "預設",
    "presetAllowAll": "允許全部",
    "presetDisallowAll": "禁止全部",
    "presetBlockAdmin": "封鎖 /admin/"
  },
  "es": {
    "securityNoticeTitle": "Robots.txt no es seguridad",
    "securityNotice": "Robots.txt es público y no bloquea el acceso. Usa control de acceso del servidor para contenido sensible.",
    "presets": "Preajustes",
    "presetAllowAll": "Permitir todo",
    "presetDisallowAll": "Bloquear todo",
    "presetBlockAdmin": "Bloquear /admin/"
  },
  "fr": {
    "securityNoticeTitle": "Robots.txt n'est pas une sécurité",
    "securityNotice": "Robots.txt est public et ne bloque pas l'accès. Utilisez un contrôle d'accès côté serveur pour les contenus sensibles.",
    "presets": "Préréglages",
    "presetAllowAll": "Tout autoriser",
    "presetDisallowAll": "Tout interdire",
    "presetBlockAdmin": "Bloquer /admin/"
  },
  "de": {
    "securityNoticeTitle": "Robots.txt ist keine Sicherheit",
    "securityNotice": "Robots.txt ist öffentlich und blockiert keinen Zugriff. Verwenden Sie serverseitige Zugriffskontrolle für sensible Inhalte.",
    "presets": "Voreinstellungen",
    "presetAllowAll": "Alles erlauben",
    "presetDisallowAll": "Alles sperren",
    "presetBlockAdmin": "/admin/ sperren"
  },
  "it": {
    "securityNoticeTitle": "Robots.txt non è sicurezza",
    "securityNotice": "Robots.txt è pubblico e non blocca l'accesso. Usa un controllo di accesso lato server per contenuti sensibili.",
    "presets": "Preimpostazioni",
    "presetAllowAll": "Consenti tutto",
    "presetDisallowAll": "Blocca tutto",
    "presetBlockAdmin": "Blocca /admin/"
  },
  "ja": {
    "securityNoticeTitle": "Robots.txt はセキュリティではありません",
    "securityNotice": "Robots.txt は公開情報であり、アクセスを遮断しません。機密コンテンツはサーバー側のアクセス制御を使用してください。",
    "presets": "プリセット",
    "presetAllowAll": "全て許可",
    "presetDisallowAll": "全て禁止",
    "presetBlockAdmin": "/admin/ をブロック"
  },
  "ko": {
    "securityNoticeTitle": "Robots.txt는 보안이 아닙니다",
    "securityNotice": "Robots.txt는 공개되어 있으며 접근을 차단하지 않습니다. 민감한 콘텐츠는 서버 측 접근 제어를 사용하세요.",
    "presets": "프리셋",
    "presetAllowAll": "모두 허용",
    "presetDisallowAll": "모두 차단",
    "presetBlockAdmin": "/admin/ 차단"
  },
  "ru": {
    "securityNoticeTitle": "Robots.txt не является защитой",
    "securityNotice": "Robots.txt публичен и не блокирует доступ. Для чувствительного контента используйте серверный контроль доступа.",
    "presets": "Предустановки",
    "presetAllowAll": "Разрешить всё",
    "presetDisallowAll": "Запретить всё",
    "presetBlockAdmin": "Блокировать /admin/"
  },
  "pt": {
    "securityNoticeTitle": "Robots.txt não é segurança",
    "securityNotice": "Robots.txt é público e não bloqueia o acesso. Use controle de acesso no servidor para conteúdo sensível.",
    "presets": "Predefinições",
    "presetAllowAll": "Permitir tudo",
    "presetDisallowAll": "Bloquear tudo",
    "presetBlockAdmin": "Bloquear /admin/"
  },
  "ar": {
    "securityNoticeTitle": "Robots.txt ليس أمانًا",
    "securityNotice": "Robots.txt ملف عام ولا يمنع الوصول. استخدم التحكم في الوصول من جهة الخادم للمحتوى الحساس.",
    "presets": "الإعدادات المسبقة",
    "presetAllowAll": "السماح للجميع",
    "presetDisallowAll": "الحظر للجميع",
    "presetBlockAdmin": "حظر /admin/"
  },
  "hi": {
    "securityNoticeTitle": "Robots.txt सुरक्षा नहीं है",
    "securityNotice": "Robots.txt सार्वजनिक है और एक्सेस नहीं रोकता। संवेदनशील सामग्री के लिए सर्वर-साइड एक्सेस नियंत्रण उपयोग करें।",
    "presets": "प्रीसेट",
    "presetAllowAll": "सबको अनुमति दें",
    "presetDisallowAll": "सबको रोकें",
    "presetBlockAdmin": "/admin/ ब्लॉक करें"
  },
  "tr": {
    "securityNoticeTitle": "Robots.txt güvenlik değildir",
    "securityNotice": "Robots.txt herkese açıktır ve erişimi engellemez. Hassas içerik için sunucu tarafı erişim kontrolü kullanın.",
    "presets": "Ön ayarlar",
    "presetAllowAll": "Hepsine izin ver",
    "presetDisallowAll": "Hepsini engelle",
    "presetBlockAdmin": "/admin/ engelle"
  },
  "nl": {
    "securityNoticeTitle": "Robots.txt is geen beveiliging",
    "securityNotice": "Robots.txt is openbaar en blokkeert geen toegang. Gebruik server-side toegangscontrole voor gevoelige inhoud.",
    "presets": "Voorinstellingen",
    "presetAllowAll": "Alles toestaan",
    "presetDisallowAll": "Alles blokkeren",
    "presetBlockAdmin": "/admin/ blokkeren"
  },
  "sv": {
    "securityNoticeTitle": "Robots.txt är inte säkerhet",
    "securityNotice": "Robots.txt är offentligt och blockerar inte åtkomst. Använd serverbaserad åtkomstkontroll för känsligt innehåll.",
    "presets": "Förinställningar",
    "presetAllowAll": "Tillåt allt",
    "presetDisallowAll": "Blockera allt",
    "presetBlockAdmin": "Blockera /admin/"
  },
  "pl": {
    "securityNoticeTitle": "Robots.txt to nie zabezpieczenie",
    "securityNotice": "Robots.txt jest publiczny i nie blokuje dostępu. Użyj kontroli dostępu po stronie serwera dla wrażliwych treści.",
    "presets": "Ustawienia wstępne",
    "presetAllowAll": "Zezwól na wszystko",
    "presetDisallowAll": "Zablokuj wszystko",
    "presetBlockAdmin": "Zablokuj /admin/"
  },
  "vi": {
    "securityNoticeTitle": "Robots.txt không phải bảo mật",
    "securityNotice": "Robots.txt là công khai và không chặn truy cập. Hãy dùng kiểm soát truy cập phía máy chủ cho nội dung nhạy cảm.",
    "presets": "Mẫu nhanh",
    "presetAllowAll": "Cho phép tất cả",
    "presetDisallowAll": "Chặn tất cả",
    "presetBlockAdmin": "Chặn /admin/"
  },
  "th": {
    "securityNoticeTitle": "Robots.txt ไม่ใช่ความปลอดภัย",
    "securityNotice": "Robots.txt เป็นไฟล์สาธารณะและไม่สามารถป้องกันการเข้าถึงได้ ใช้การควบคุมการเข้าถึงฝั่งเซิร์ฟเวอร์สำหรับเนื้อหาที่ละเอียดอ่อน",
    "presets": "ค่าที่ตั้งล่วงหน้า",
    "presetAllowAll": "อนุญาตทั้งหมด",
    "presetDisallowAll": "บล็อกทั้งหมด",
    "presetBlockAdmin": "บล็อก /admin/"
  },
  "id": {
    "securityNoticeTitle": "Robots.txt bukan keamanan",
    "securityNotice": "Robots.txt bersifat publik dan tidak memblokir akses. Gunakan kontrol akses sisi server untuk konten sensitif.",
    "presets": "Preset",
    "presetAllowAll": "Izinkan semua",
    "presetDisallowAll": "Blokir semua",
    "presetBlockAdmin": "Blokir /admin/"
  },
  "he": {
    "securityNoticeTitle": "Robots.txt אינו אבטחה",
    "securityNotice": "Robots.txt הוא קובץ ציבורי ואינו חוסם גישה. השתמש בבקרת גישה בצד השרת לתוכן רגיש.",
    "presets": "הגדרות קבועות",
    "presetAllowAll": "לאפשר הכול",
    "presetDisallowAll": "לחסום הכול",
    "presetBlockAdmin": "לחסום /admin/"
  },
  "ms": {
    "securityNoticeTitle": "Robots.txt bukan keselamatan",
    "securityNotice": "Robots.txt adalah awam dan tidak menyekat akses. Gunakan kawalan akses pelayan untuk kandungan sensitif.",
    "presets": "Pratetap",
    "presetAllowAll": "Benarkan semua",
    "presetDisallowAll": "Sekat semua",
    "presetBlockAdmin": "Sekat /admin/"
  },
  "no": {
    "securityNoticeTitle": "Robots.txt er ikke sikkerhet",
    "securityNotice": "Robots.txt er offentlig og blokkerer ikke tilgang. Bruk tilgangskontroll på serversiden for sensitivt innhold.",
    "presets": "Forhåndsinnstillinger",
    "presetAllowAll": "Tillat alt",
    "presetDisallowAll": "Blokker alt",
    "presetBlockAdmin": "Blokker /admin/"
  }
}
</i18n>
