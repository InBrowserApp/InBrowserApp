<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ToolSectionHeader>UUID</ToolSectionHeader>
    <ToolSection>
      <UUIDInput v-model:uuid="uuid" :emit-on-invalid="true" />
    </ToolSection>
    <ToolSection>
      <div v-if="isValid">
        <CustomRouterLink :to="decodeUUIDPath" class="decode-uuid-link">
          <n-icon style="vertical-align: -0.15em" :color="themeVars.successColor">
            <ValidIcon />
          </n-icon>
          {{ t('valid') }}
        </CustomRouterLink>
      </div>
      <div v-else>
        <n-icon style="vertical-align: -0.15em" :color="themeVars.errorColor">
          <InvalidIcon />
        </n-icon>
        {{ t('invalid') }}
      </div>
    </ToolSection>

    <WhatIsUUID />
  </ToolDefaultPageLayout>
</template>

<script lang="ts" setup>
import * as toolInfo from './infos'
import { NIcon } from 'naive-ui'
import WhatIsUUID from '../descriptions/WhatIsUUID.vue'
import { UUIDInput } from '@shared/ui/domain/uuid'
import type { UUID } from '@utils/uuid'
import { useStorage } from '@vueuse/core'
import { computed } from 'vue'
import { validate } from 'uuid'
import ValidIcon from '@vicons/fluent/CheckmarkCircle16Filled'
import InvalidIcon from '@vicons/fluent/DismissCircle16Filled'
import { useThemeVars } from 'naive-ui'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import { CustomRouterLink } from '@shared/ui/base'

const uuid = useStorage<UUID | ''>('tools:uuid-validator:uuid', '')
const isValid = computed(() => validate(uuid.value))
const themeVars = useThemeVars()
const decodeUUIDPath = computed(() => '/tools/uuid-decoder/' + uuid.value)

const { t } = useI18n()
</script>

<style scoped>
.decode-uuid-link {
  text-decoration: none;
  color: inherit;
}

.decode-uuid-link:hover {
  text-decoration: underline;
}
</style>

<i18n lang="json">
{
  "en": {
    "valid": "This is a valid UUID. Click to learn more about this UUID.",
    "invalid": "This is an invalid UUID"
  },
  "zh": {
    "valid": "这是一个有效的 UUID，点此了解关于该 UUID 的更多信息。",
    "invalid": "这是一个无效的 UUID"
  },
  "zh-CN": {
    "valid": "这是一个有效的 UUID，点此了解关于该 UUID 的更多信息。",
    "invalid": "这是一个无效的 UUID"
  },
  "zh-TW": {
    "valid": "這是一個有效的 UUID，點此了解關於該 UUID 的更多信息。",
    "invalid": "這是一個無效的 UUID"
  },
  "zh-HK": {
    "valid": "這是一個有效的 UUID，點此了解關於該 UUID 的更多信息。",
    "invalid": "這是一個無效的 UUID"
  },
  "es": {
    "valid": "Este es un UUID válido. Haga clic para obtener más información sobre este UUID.",
    "invalid": "Este es un UUID inválido"
  },
  "fr": {
    "valid": "Ceci est un UUID valide. Cliquez pour en savoir plus sur cet UUID.",
    "invalid": "Ceci est un UUID invalide"
  },
  "de": {
    "valid": "Dies ist eine gültige UUID. Klicken Sie, um mehr über diese UUID zu erfahren.",
    "invalid": "Dies ist eine ungültige UUID"
  },
  "it": {
    "valid": "Questo è un UUID valido. Clicca per saperne di più su questo UUID.",
    "invalid": "Questo è un UUID non valido"
  },
  "ja": {
    "valid": "これは有効な UUID です。この UUID について詳しく知るにはクリックしてください。",
    "invalid": "これは無効な UUID です"
  },
  "ko": {
    "valid": "유효한 UUID입니다. 이 UUID에 대해 자세히 알아보려면 클릭하세요.",
    "invalid": "유효하지 않은 UUID입니다"
  },
  "ru": {
    "valid": "Это действительный UUID. Нажмите, чтобы узнать больше об этом UUID.",
    "invalid": "Это недействительный UUID"
  },
  "pt": {
    "valid": "Este é um UUID válido. Clique para saber mais sobre este UUID.",
    "invalid": "Este é um UUID inválido"
  },
  "ar": {
    "valid": "هذا UUID صالح. انقر لمعرفة المزيد عن هذا UUID.",
    "invalid": "هذا UUID غير صالح"
  },
  "hi": {
    "valid": "यह एक वैध UUID है। इस UUID के बारे में अधिक जानने के लिए क्लिक करें।",
    "invalid": "यह एक अमान्य UUID है"
  },
  "tr": {
    "valid": "Bu geçerli bir UUID. Bu UUID hakkında daha fazla bilgi için tıklayın.",
    "invalid": "Bu geçersiz bir UUID"
  },
  "nl": {
    "valid": "Dit is een geldige UUID. Klik om meer te weten te komen over deze UUID.",
    "invalid": "Dit is een ongeldige UUID"
  },
  "sv": {
    "valid": "Detta är ett giltigt UUID. Klicka för att lära dig mer om detta UUID.",
    "invalid": "Detta är ett ogiltigt UUID"
  },
  "pl": {
    "valid": "To jest prawidłowy UUID. Kliknij, aby dowiedzieć się więcej o tym UUID.",
    "invalid": "To jest nieprawidłowy UUID"
  },
  "vi": {
    "valid": "Đây là UUID hợp lệ. Nhấp để tìm hiểu thêm về UUID này.",
    "invalid": "Đây là UUID không hợp lệ"
  },
  "th": {
    "valid": "นี่คือ UUID ที่ถูกต้อง คลิกเพื่อเรียนรู้เพิ่มเติมเกี่ยวกับ UUID นี้",
    "invalid": "นี่คือ UUID ที่ไม่ถูกต้อง"
  },
  "id": {
    "valid": "Ini adalah UUID yang valid. Klik untuk mempelajari lebih lanjut tentang UUID ini.",
    "invalid": "Ini adalah UUID yang tidak valid"
  },
  "he": {
    "valid": "זהו UUID תקין. לחץ כדי ללמוד עוד על UUID זה.",
    "invalid": "זהו UUID לא תקין"
  },
  "ms": {
    "valid": "Ini adalah UUID yang sah. Klik untuk mengetahui lebih lanjut tentang UUID ini.",
    "invalid": "Ini adalah UUID yang tidak sah"
  },
  "no": {
    "valid": "Dette er en gyldig UUID. Klikk for å lære mer om denne UUID.",
    "invalid": "Dette er en ugyldig UUID"
  }
}
</i18n>
