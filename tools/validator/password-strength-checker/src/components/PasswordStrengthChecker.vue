<template>
  <ToolSectionHeader>{{ t('input-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-form-item :label="t('password-label')">
      <n-input
        v-model:value="password"
        :type="showPassword ? 'text' : 'password'"
        :placeholder="t('password-placeholder')"
      >
        <template #suffix>
          <n-button text size="small" @click="toggleVisibility">
            {{ showPassword ? t('hide') : t('show') }}
          </n-button>
        </template>
      </n-input>
    </n-form-item>
    <n-text depth="3" class="hint">{{ t('privacy-hint') }}</n-text>
  </ToolSection>

  <ToolSectionHeader>{{ t('results-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-text v-if="!analysis" depth="3">{{ t('empty') }}</n-text>
    <div v-else class="results">
      <n-flex align="center" :size="12" wrap>
        <n-tag :type="scoreTagType" size="small">
          {{ strengthLabel }}
        </n-tag>
        <n-text depth="3">{{ t('entropy-bits', { bits: entropyBits }) }}</n-text>
        <n-text depth="3">{{ t('log10-guesses', { value: log10Guesses }) }}</n-text>
      </n-flex>

      <div class="strength-meter" role="presentation">
        <div
          class="strength-meter-fill"
          :class="`score-${analysis.score}`"
          :style="{ width: `${scorePercent}%` }"
        />
      </div>

      <n-descriptions :column="1" bordered label-placement="left">
        <n-descriptions-item :label="t('length')">
          <n-text depth="3">{{ analysis.length }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('unique')">
          <n-text depth="3">{{ analysis.uniqueCount }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('character-sets')">
          <n-flex align="center" :size="6" wrap>
            <n-tag v-for="tag in characterTags" :key="tag" size="small">{{ tag }}</n-tag>
          </n-flex>
        </n-descriptions-item>
        <n-descriptions-item :label="t('crack-offline')">
          <n-text depth="3">{{ offlineTimeLabel }}</n-text>
        </n-descriptions-item>
        <n-descriptions-item :label="t('crack-online')">
          <n-text depth="3">{{ onlineTimeLabel }}</n-text>
        </n-descriptions-item>
      </n-descriptions>

      <n-alert v-show="warningMessages.length" type="warning" :show-icon="true" class="alert">
        <n-ul>
          <n-li v-for="message in warningMessages" :key="message">{{ message }}</n-li>
        </n-ul>
      </n-alert>

      <n-alert v-show="suggestionMessages.length" type="info" :show-icon="true" class="alert">
        <n-ul>
          <n-li v-for="message in suggestionMessages" :key="message">{{ message }}</n-li>
        </n-ul>
      </n-alert>
    </div>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  NAlert,
  NButton,
  NDescriptions,
  NDescriptionsItem,
  NFlex,
  NFormItem,
  NInput,
  NTag,
  NText,
  NUl,
  NLi,
} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { analyzePassword, type DurationDisplay } from '../utils'

const { t } = useI18n()

const password = useStorage('tools:password-strength-checker:password', '')
const showPassword = ref(false)

const analysis = computed(() => analyzePassword(password.value))

const strengthLabel = computed(() => {
  if (!analysis.value) return ''
  return t(`strength-${analysis.value.score}`)
})

const scorePercent = computed(() => {
  if (!analysis.value) return 0
  return (analysis.value.score + 1) * 20
})

const scoreTagType = computed(() => {
  if (!analysis.value) return 'default'
  const scoreMap = ['error', 'warning', 'info', 'success', 'success'] as const
  return scoreMap[analysis.value.score]
})

const entropyBits = computed(() => {
  if (!analysis.value) return '0'
  return analysis.value.entropyBits.toFixed(1)
})

const log10Guesses = computed(() => {
  if (!analysis.value) return '0'
  return analysis.value.log10Guesses.toFixed(1)
})

const characterTags = computed(() => {
  if (!analysis.value) return []
  const entries = [
    { label: 'a-z', enabled: analysis.value.composition.lower },
    { label: 'A-Z', enabled: analysis.value.composition.upper },
    { label: '0-9', enabled: analysis.value.composition.digit },
    { label: '#@$', enabled: analysis.value.composition.symbol },
  ]
  return entries.filter((entry) => entry.enabled).map((entry) => entry.label)
})

const warningMessages = computed(() =>
  analysis.value ? analysis.value.warnings.map((key) => t(`warning.${key}`)) : [],
)

const suggestionMessages = computed(() =>
  analysis.value ? analysis.value.suggestions.map((key) => t(`suggestion.${key}`)) : [],
)

const offlineTimeLabel = computed(() => {
  if (!analysis.value) return ''
  return formatDurationLabel(analysis.value.crackTimes.offlineFast)
})

const onlineTimeLabel = computed(() => {
  if (!analysis.value) return ''
  return formatDurationLabel(analysis.value.crackTimes.onlineThrottled)
})

function formatDurationLabel(duration: DurationDisplay): string {
  if (duration.isUnderSecond) return t('duration-under-second')
  return t('duration-format', {
    value: duration.value,
    unit: t(`unit.${duration.unit}`),
  })
}

function toggleVisibility() {
  showPassword.value = !showPassword.value
}
</script>

<style scoped>
.hint {
  display: block;
  margin-top: 8px;
}

.results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.strength-meter {
  height: 10px;
  background-color: var(--n-border-color);
  border-radius: 999px;
  overflow: hidden;
}

.strength-meter-fill {
  height: 100%;
  transition: width 0.2s ease;
}

.strength-meter-fill.score-0 {
  background-color: #d92d20;
}

.strength-meter-fill.score-1 {
  background-color: #f79009;
}

.strength-meter-fill.score-2 {
  background-color: #fdb022;
}

.strength-meter-fill.score-3 {
  background-color: #32d583;
}

.strength-meter-fill.score-4 {
  background-color: #12b76a;
}

.alert :deep(.n-alert-body) {
  width: 100%;
}
</style>

<i18n lang="json">
{
  "en": {
    "input-title": "Password",
    "password-label": "Password",
    "password-placeholder": "Type a password to evaluate",
    "show": "Show",
    "hide": "Hide",
    "privacy-hint": "Strength checks run locally in your browser.",
    "results-title": "Strength Summary",
    "empty": "Enter a password to check its strength.",
    "strength-0": "Very weak",
    "strength-1": "Weak",
    "strength-2": "Fair",
    "strength-3": "Strong",
    "strength-4": "Very strong",
    "entropy-bits": "Entropy: {bits} bits",
    "log10-guesses": "Guesses (log10): {value}",
    "length": "Length",
    "unique": "Unique characters",
    "character-sets": "Character sets",
    "crack-offline": "Crack time (offline, 1e10/s)",
    "crack-online": "Crack time (online, 100/s)",
    "duration-format": "About {value} {unit}",
    "duration-under-second": "Less than 1 second",
    "unit": {
      "seconds": "seconds",
      "minutes": "minutes",
      "hours": "hours",
      "days": "days",
      "months": "months",
      "years": "years"
    },
    "warning": {
      "common": "This is a very common password.",
      "short": "The password is too short.",
      "sequence": "Sequential patterns are easy to guess.",
      "repeat": "Repeated patterns reduce strength.",
      "singleClass": "Using only one character type lowers strength."
    },
    "suggestion": {
      "use-longer": "Use a longer password or passphrase.",
      "add-uppercase": "Add uppercase letters.",
      "add-lowercase": "Add lowercase letters.",
      "add-numbers": "Add numbers.",
      "add-symbols": "Add symbols.",
      "avoid-common": "Avoid common passwords and leaked phrases.",
      "avoid-sequences": "Avoid sequences like 123 or abc.",
      "avoid-repetition": "Avoid repeated patterns."
    }
  },
  "zh": {
    "input-title": "密码",
    "password-label": "密码",
    "password-placeholder": "输入要评估的密码",
    "show": "显示",
    "hide": "隐藏",
    "privacy-hint": "强度检测在本地浏览器中完成。",
    "results-title": "强度摘要",
    "empty": "请输入密码以检查强度。",
    "strength-0": "非常弱",
    "strength-1": "较弱",
    "strength-2": "一般",
    "strength-3": "强",
    "strength-4": "非常强",
    "entropy-bits": "熵值：{bits} 位",
    "log10-guesses": "猜测次数（log10）：{value}",
    "length": "长度",
    "unique": "唯一字符数",
    "character-sets": "字符集",
    "crack-offline": "破解时间（离线 1e10/秒）",
    "crack-online": "破解时间（在线 100/秒）",
    "duration-format": "约 {value} {unit}",
    "duration-under-second": "少于 1 秒",
    "unit": {
      "seconds": "秒",
      "minutes": "分钟",
      "hours": "小时",
      "days": "天",
      "months": "个月",
      "years": "年"
    },
    "warning": {
      "common": "这是非常常见的密码。",
      "short": "密码过短。",
      "sequence": "连续模式容易被猜中。",
      "repeat": "重复模式会降低强度。",
      "singleClass": "仅使用一种字符类型会降低强度。"
    },
    "suggestion": {
      "use-longer": "使用更长的密码或口令短语。",
      "add-uppercase": "添加大写字母。",
      "add-lowercase": "添加小写字母。",
      "add-numbers": "添加数字。",
      "add-symbols": "添加符号。",
      "avoid-common": "避免常见密码和已泄露的短语。",
      "avoid-sequences": "避免 123 或 abc 之类的序列。",
      "avoid-repetition": "避免重复模式。"
    }
  },
  "zh-CN": {
    "input-title": "密码",
    "password-label": "密码",
    "password-placeholder": "输入要评估的密码",
    "show": "显示",
    "hide": "隐藏",
    "privacy-hint": "强度检测在本地浏览器中完成。",
    "results-title": "强度摘要",
    "empty": "请输入密码以检查强度。",
    "strength-0": "非常弱",
    "strength-1": "较弱",
    "strength-2": "一般",
    "strength-3": "强",
    "strength-4": "非常强",
    "entropy-bits": "熵值：{bits} 位",
    "log10-guesses": "猜测次数（log10）：{value}",
    "length": "长度",
    "unique": "唯一字符数",
    "character-sets": "字符集",
    "crack-offline": "破解时间（离线 1e10/秒）",
    "crack-online": "破解时间（在线 100/秒）",
    "duration-format": "约 {value} {unit}",
    "duration-under-second": "少于 1 秒",
    "unit": {
      "seconds": "秒",
      "minutes": "分钟",
      "hours": "小时",
      "days": "天",
      "months": "个月",
      "years": "年"
    },
    "warning": {
      "common": "这是非常常见的密码。",
      "short": "密码过短。",
      "sequence": "连续模式容易被猜中。",
      "repeat": "重复模式会降低强度。",
      "singleClass": "仅使用一种字符类型会降低强度。"
    },
    "suggestion": {
      "use-longer": "使用更长的密码或口令短语。",
      "add-uppercase": "添加大写字母。",
      "add-lowercase": "添加小写字母。",
      "add-numbers": "添加数字。",
      "add-symbols": "添加符号。",
      "avoid-common": "避免常见密码和已泄露的短语。",
      "avoid-sequences": "避免 123 或 abc 之类的序列。",
      "avoid-repetition": "避免重复模式。"
    }
  },
  "zh-TW": {
    "input-title": "密碼",
    "password-label": "密碼",
    "password-placeholder": "輸入要評估的密碼",
    "show": "顯示",
    "hide": "隱藏",
    "privacy-hint": "強度檢測在本地瀏覽器中完成。",
    "results-title": "強度摘要",
    "empty": "請輸入密碼以檢查強度。",
    "strength-0": "非常弱",
    "strength-1": "較弱",
    "strength-2": "一般",
    "strength-3": "強",
    "strength-4": "非常強",
    "entropy-bits": "熵值：{bits} 位",
    "log10-guesses": "猜測次數（log10）：{value}",
    "length": "長度",
    "unique": "唯一字元數",
    "character-sets": "字元集",
    "crack-offline": "破解時間（離線 1e10/秒）",
    "crack-online": "破解時間（線上 100/秒）",
    "duration-format": "約 {value} {unit}",
    "duration-under-second": "少於 1 秒",
    "unit": {
      "seconds": "秒",
      "minutes": "分鐘",
      "hours": "小時",
      "days": "天",
      "months": "個月",
      "years": "年"
    },
    "warning": {
      "common": "這是非常常見的密碼。",
      "short": "密碼過短。",
      "sequence": "連續模式容易被猜中。",
      "repeat": "重複模式會降低強度。",
      "singleClass": "僅使用一種字元類型會降低強度。"
    },
    "suggestion": {
      "use-longer": "使用更長的密碼或口令短語。",
      "add-uppercase": "加入大寫字母。",
      "add-lowercase": "加入小寫字母。",
      "add-numbers": "加入數字。",
      "add-symbols": "加入符號。",
      "avoid-common": "避免常見密碼和已洩露的短語。",
      "avoid-sequences": "避免 123 或 abc 等序列。",
      "avoid-repetition": "避免重複模式。"
    }
  },
  "zh-HK": {
    "input-title": "密碼",
    "password-label": "密碼",
    "password-placeholder": "輸入要評估嘅密碼",
    "show": "顯示",
    "hide": "隱藏",
    "privacy-hint": "強度檢測喺本地瀏覽器完成。",
    "results-title": "強度摘要",
    "empty": "請輸入密碼以檢查強度。",
    "strength-0": "非常弱",
    "strength-1": "較弱",
    "strength-2": "一般",
    "strength-3": "強",
    "strength-4": "非常強",
    "entropy-bits": "熵值：{bits} 位",
    "log10-guesses": "猜測次數（log10）：{value}",
    "length": "長度",
    "unique": "唯一字元數",
    "character-sets": "字元集",
    "crack-offline": "破解時間（離線 1e10/秒）",
    "crack-online": "破解時間（線上 100/秒）",
    "duration-format": "約 {value} {unit}",
    "duration-under-second": "少於 1 秒",
    "unit": {
      "seconds": "秒",
      "minutes": "分鐘",
      "hours": "小時",
      "days": "天",
      "months": "個月",
      "years": "年"
    },
    "warning": {
      "common": "呢個係非常常見嘅密碼。",
      "short": "密碼太短。",
      "sequence": "連續模式容易被估中。",
      "repeat": "重複模式會降低強度。",
      "singleClass": "只用一種字元類型會降低強度。"
    },
    "suggestion": {
      "use-longer": "使用更長嘅密碼或口令短語。",
      "add-uppercase": "加入大寫字母。",
      "add-lowercase": "加入小寫字母。",
      "add-numbers": "加入數字。",
      "add-symbols": "加入符號。",
      "avoid-common": "避免常見密碼同已洩露嘅短語。",
      "avoid-sequences": "避免 123 或 abc 等序列。",
      "avoid-repetition": "避免重複模式。"
    }
  },
  "es": {
    "input-title": "Contraseña",
    "password-label": "Contraseña",
    "password-placeholder": "Escribe una contraseña para evaluar",
    "show": "Mostrar",
    "hide": "Ocultar",
    "privacy-hint": "Las comprobaciones se realizan localmente en tu navegador.",
    "results-title": "Resumen de fuerza",
    "empty": "Introduce una contraseña para comprobar su fuerza.",
    "strength-0": "Muy débil",
    "strength-1": "Débil",
    "strength-2": "Aceptable",
    "strength-3": "Fuerte",
    "strength-4": "Muy fuerte",
    "entropy-bits": "Entropía: {bits} bits",
    "log10-guesses": "Intentos (log10): {value}",
    "length": "Longitud",
    "unique": "Caracteres únicos",
    "character-sets": "Conjuntos de caracteres",
    "crack-offline": "Tiempo de ruptura (offline, 1e10/s)",
    "crack-online": "Tiempo de ruptura (online, 100/s)",
    "duration-format": "Aproximadamente {value} {unit}",
    "duration-under-second": "Menos de 1 segundo",
    "unit": {
      "seconds": "segundos",
      "minutes": "minutos",
      "hours": "horas",
      "days": "días",
      "months": "meses",
      "years": "años"
    },
    "warning": {
      "common": "Esta es una contraseña muy común.",
      "short": "La contraseña es demasiado corta.",
      "sequence": "Las secuencias son fáciles de adivinar.",
      "repeat": "Los patrones repetidos reducen la fuerza.",
      "singleClass": "Usar solo un tipo de carácter reduce la fuerza."
    },
    "suggestion": {
      "use-longer": "Usa una contraseña o frase más larga.",
      "add-uppercase": "Añade letras mayúsculas.",
      "add-lowercase": "Añade letras minúsculas.",
      "add-numbers": "Añade números.",
      "add-symbols": "Añade símbolos.",
      "avoid-common": "Evita contraseñas comunes y filtradas.",
      "avoid-sequences": "Evita secuencias como 123 o abc.",
      "avoid-repetition": "Evita patrones repetidos."
    }
  },
  "fr": {
    "input-title": "Mot de passe",
    "password-label": "Mot de passe",
    "password-placeholder": "Saisissez un mot de passe à évaluer",
    "show": "Afficher",
    "hide": "Masquer",
    "privacy-hint": "Les vérifications sont effectuées localement dans votre navigateur.",
    "results-title": "Résumé de robustesse",
    "empty": "Saisissez un mot de passe pour vérifier sa robustesse.",
    "strength-0": "Très faible",
    "strength-1": "Faible",
    "strength-2": "Moyenne",
    "strength-3": "Forte",
    "strength-4": "Très forte",
    "entropy-bits": "Entropie : {bits} bits",
    "log10-guesses": "Essais (log10) : {value}",
    "length": "Longueur",
    "unique": "Caractères uniques",
    "character-sets": "Jeux de caractères",
    "crack-offline": "Temps de cassage (offline, 1e10/s)",
    "crack-online": "Temps de cassage (en ligne, 100/s)",
    "duration-format": "Environ {value} {unit}",
    "duration-under-second": "Moins d'une seconde",
    "unit": {
      "seconds": "secondes",
      "minutes": "minutes",
      "hours": "heures",
      "days": "jours",
      "months": "mois",
      "years": "années"
    },
    "warning": {
      "common": "C'est un mot de passe très courant.",
      "short": "Le mot de passe est trop court.",
      "sequence": "Les séquences sont faciles à deviner.",
      "repeat": "Les motifs répétés réduisent la robustesse.",
      "singleClass": "Utiliser un seul type de caractère réduit la robustesse."
    },
    "suggestion": {
      "use-longer": "Utilisez un mot de passe ou une phrase plus long.",
      "add-uppercase": "Ajoutez des lettres majuscules.",
      "add-lowercase": "Ajoutez des lettres minuscules.",
      "add-numbers": "Ajoutez des chiffres.",
      "add-symbols": "Ajoutez des symboles.",
      "avoid-common": "Évitez les mots de passe courants et divulgués.",
      "avoid-sequences": "Évitez les séquences comme 123 ou abc.",
      "avoid-repetition": "Évitez les motifs répétitifs."
    }
  },
  "de": {
    "input-title": "Passwort",
    "password-label": "Passwort",
    "password-placeholder": "Geben Sie ein Passwort zur Bewertung ein",
    "show": "Anzeigen",
    "hide": "Verbergen",
    "privacy-hint": "Die Prüfung erfolgt lokal in Ihrem Browser.",
    "results-title": "Stärkeübersicht",
    "empty": "Geben Sie ein Passwort ein, um die Stärke zu prüfen.",
    "strength-0": "Sehr schwach",
    "strength-1": "Schwach",
    "strength-2": "Mittel",
    "strength-3": "Stark",
    "strength-4": "Sehr stark",
    "entropy-bits": "Entropie: {bits} Bits",
    "log10-guesses": "Versuche (log10): {value}",
    "length": "Länge",
    "unique": "Eindeutige Zeichen",
    "character-sets": "Zeichensätze",
    "crack-offline": "Knackzeit (offline, 1e10/s)",
    "crack-online": "Knackzeit (online, 100/s)",
    "duration-format": "Etwa {value} {unit}",
    "duration-under-second": "Weniger als 1 Sekunde",
    "unit": {
      "seconds": "Sekunden",
      "minutes": "Minuten",
      "hours": "Stunden",
      "days": "Tage",
      "months": "Monate",
      "years": "Jahre"
    },
    "warning": {
      "common": "Dies ist ein sehr häufiges Passwort.",
      "short": "Das Passwort ist zu kurz.",
      "sequence": "Sequenzen sind leicht zu erraten.",
      "repeat": "Wiederholte Muster verringern die Stärke.",
      "singleClass": "Nur eine Zeichenart zu verwenden verringert die Stärke."
    },
    "suggestion": {
      "use-longer": "Verwenden Sie ein längeres Passwort oder eine Passphrase.",
      "add-uppercase": "Fügen Sie Großbuchstaben hinzu.",
      "add-lowercase": "Fügen Sie Kleinbuchstaben hinzu.",
      "add-numbers": "Fügen Sie Zahlen hinzu.",
      "add-symbols": "Fügen Sie Symbole hinzu.",
      "avoid-common": "Vermeiden Sie häufige und geleakte Passwörter.",
      "avoid-sequences": "Vermeiden Sie Sequenzen wie 123 oder abc.",
      "avoid-repetition": "Vermeiden Sie wiederholte Muster."
    }
  },
  "it": {
    "input-title": "Password",
    "password-label": "Password",
    "password-placeholder": "Inserisci una password da valutare",
    "show": "Mostra",
    "hide": "Nascondi",
    "privacy-hint": "Le verifiche vengono eseguite localmente nel browser.",
    "results-title": "Riepilogo forza",
    "empty": "Inserisci una password per verificarne la forza.",
    "strength-0": "Molto debole",
    "strength-1": "Debole",
    "strength-2": "Discreta",
    "strength-3": "Forte",
    "strength-4": "Molto forte",
    "entropy-bits": "Entropia: {bits} bit",
    "log10-guesses": "Tentativi (log10): {value}",
    "length": "Lunghezza",
    "unique": "Caratteri unici",
    "character-sets": "Set di caratteri",
    "crack-offline": "Tempo di crack (offline, 1e10/s)",
    "crack-online": "Tempo di crack (online, 100/s)",
    "duration-format": "Circa {value} {unit}",
    "duration-under-second": "Meno di 1 secondo",
    "unit": {
      "seconds": "secondi",
      "minutes": "minuti",
      "hours": "ore",
      "days": "giorni",
      "months": "mesi",
      "years": "anni"
    },
    "warning": {
      "common": "Questa è una password molto comune.",
      "short": "La password è troppo corta.",
      "sequence": "Le sequenze sono facili da indovinare.",
      "repeat": "I pattern ripetuti riducono la forza.",
      "singleClass": "Usare un solo tipo di carattere riduce la forza."
    },
    "suggestion": {
      "use-longer": "Usa una password o una passphrase più lunga.",
      "add-uppercase": "Aggiungi lettere maiuscole.",
      "add-lowercase": "Aggiungi lettere minuscole.",
      "add-numbers": "Aggiungi numeri.",
      "add-symbols": "Aggiungi simboli.",
      "avoid-common": "Evita password comuni o compromesse.",
      "avoid-sequences": "Evita sequenze come 123 o abc.",
      "avoid-repetition": "Evita pattern ripetuti."
    }
  },
  "ja": {
    "input-title": "パスワード",
    "password-label": "パスワード",
    "password-placeholder": "評価するパスワードを入力",
    "show": "表示",
    "hide": "非表示",
    "privacy-hint": "強度チェックはブラウザ内でローカルに実行されます。",
    "results-title": "強度サマリー",
    "empty": "パスワードを入力して強度を確認してください。",
    "strength-0": "非常に弱い",
    "strength-1": "弱い",
    "strength-2": "普通",
    "strength-3": "強い",
    "strength-4": "非常に強い",
    "entropy-bits": "エントロピー: {bits} ビット",
    "log10-guesses": "推測回数（log10）: {value}",
    "length": "長さ",
    "unique": "ユニーク文字数",
    "character-sets": "文字種",
    "crack-offline": "解析時間（オフライン 1e10/秒）",
    "crack-online": "解析時間（オンライン 100/秒）",
    "duration-format": "約 {value} {unit}",
    "duration-under-second": "1 秒未満",
    "unit": {
      "seconds": "秒",
      "minutes": "分",
      "hours": "時間",
      "days": "日",
      "months": "か月",
      "years": "年"
    },
    "warning": {
      "common": "非常に一般的なパスワードです。",
      "short": "パスワードが短すぎます。",
      "sequence": "連続パターンは推測されやすいです。",
      "repeat": "繰り返しパターンは強度を下げます。",
      "singleClass": "1種類の文字だけだと強度が下がります。"
    },
    "suggestion": {
      "use-longer": "より長いパスワードやパスフレーズを使用してください。",
      "add-uppercase": "大文字を追加してください。",
      "add-lowercase": "小文字を追加してください。",
      "add-numbers": "数字を追加してください。",
      "add-symbols": "記号を追加してください。",
      "avoid-common": "一般的または流出したパスワードを避けてください。",
      "avoid-sequences": "123 や abc のような連続を避けてください。",
      "avoid-repetition": "繰り返しパターンを避けてください。"
    }
  },
  "ko": {
    "input-title": "비밀번호",
    "password-label": "비밀번호",
    "password-placeholder": "평가할 비밀번호를 입력하세요",
    "show": "표시",
    "hide": "숨기기",
    "privacy-hint": "강도 검사는 브라우저에서 로컬로 실행됩니다.",
    "results-title": "강도 요약",
    "empty": "비밀번호를 입력해 강도를 확인하세요.",
    "strength-0": "매우 약함",
    "strength-1": "약함",
    "strength-2": "보통",
    "strength-3": "강함",
    "strength-4": "매우 강함",
    "entropy-bits": "엔트로피: {bits}비트",
    "log10-guesses": "추측 횟수(log10): {value}",
    "length": "길이",
    "unique": "고유 문자 수",
    "character-sets": "문자 집합",
    "crack-offline": "해독 시간(오프라인 1e10/초)",
    "crack-online": "해독 시간(온라인 100/초)",
    "duration-format": "약 {value} {unit}",
    "duration-under-second": "1초 미만",
    "unit": {
      "seconds": "초",
      "minutes": "분",
      "hours": "시간",
      "days": "일",
      "months": "개월",
      "years": "년"
    },
    "warning": {
      "common": "매우 흔한 비밀번호입니다.",
      "short": "비밀번호가 너무 짧습니다.",
      "sequence": "연속 패턴은 쉽게 추측됩니다.",
      "repeat": "반복 패턴은 강도를 낮춥니다.",
      "singleClass": "한 가지 문자 유형만 사용하면 강도가 낮아집니다."
    },
    "suggestion": {
      "use-longer": "더 긴 비밀번호 또는 구문을 사용하세요.",
      "add-uppercase": "대문자를 추가하세요.",
      "add-lowercase": "소문자를 추가하세요.",
      "add-numbers": "숫자를 추가하세요.",
      "add-symbols": "기호를 추가하세요.",
      "avoid-common": "흔하거나 유출된 비밀번호를 피하세요.",
      "avoid-sequences": "123 또는 abc 같은 연속을 피하세요.",
      "avoid-repetition": "반복 패턴을 피하세요."
    }
  },
  "ru": {
    "input-title": "Пароль",
    "password-label": "Пароль",
    "password-placeholder": "Введите пароль для оценки",
    "show": "Показать",
    "hide": "Скрыть",
    "privacy-hint": "Проверка выполняется локально в браузере.",
    "results-title": "Сводка прочности",
    "empty": "Введите пароль, чтобы проверить его прочность.",
    "strength-0": "Очень слабый",
    "strength-1": "Слабый",
    "strength-2": "Средний",
    "strength-3": "Сильный",
    "strength-4": "Очень сильный",
    "entropy-bits": "Энтропия: {bits} бит",
    "log10-guesses": "Попытки (log10): {value}",
    "length": "Длина",
    "unique": "Уникальные символы",
    "character-sets": "Наборы символов",
    "crack-offline": "Время взлома (оффлайн, 1e10/с)",
    "crack-online": "Время взлома (онлайн, 100/с)",
    "duration-format": "Около {value} {unit}",
    "duration-under-second": "Меньше 1 секунды",
    "unit": {
      "seconds": "секунд",
      "minutes": "минут",
      "hours": "часов",
      "days": "дней",
      "months": "месяцев",
      "years": "лет"
    },
    "warning": {
      "common": "Это очень распространенный пароль.",
      "short": "Пароль слишком короткий.",
      "sequence": "Последовательности легко угадываются.",
      "repeat": "Повторяющиеся шаблоны снижают прочность.",
      "singleClass": "Использование только одного типа символов снижает прочность."
    },
    "suggestion": {
      "use-longer": "Используйте более длинный пароль или фразу.",
      "add-uppercase": "Добавьте заглавные буквы.",
      "add-lowercase": "Добавьте строчные буквы.",
      "add-numbers": "Добавьте цифры.",
      "add-symbols": "Добавьте символы.",
      "avoid-common": "Избегайте распространенных и утекших паролей.",
      "avoid-sequences": "Избегайте последовательностей вроде 123 или abc.",
      "avoid-repetition": "Избегайте повторяющихся шаблонов."
    }
  },
  "pt": {
    "input-title": "Senha",
    "password-label": "Senha",
    "password-placeholder": "Digite uma senha para avaliar",
    "show": "Mostrar",
    "hide": "Ocultar",
    "privacy-hint": "As verificações são feitas localmente no navegador.",
    "results-title": "Resumo de força",
    "empty": "Digite uma senha para verificar a força.",
    "strength-0": "Muito fraca",
    "strength-1": "Fraca",
    "strength-2": "Regular",
    "strength-3": "Forte",
    "strength-4": "Muito forte",
    "entropy-bits": "Entropia: {bits} bits",
    "log10-guesses": "Tentativas (log10): {value}",
    "length": "Comprimento",
    "unique": "Caracteres únicos",
    "character-sets": "Conjuntos de caracteres",
    "crack-offline": "Tempo de quebra (offline, 1e10/s)",
    "crack-online": "Tempo de quebra (online, 100/s)",
    "duration-format": "Cerca de {value} {unit}",
    "duration-under-second": "Menos de 1 segundo",
    "unit": {
      "seconds": "segundos",
      "minutes": "minutos",
      "hours": "horas",
      "days": "dias",
      "months": "meses",
      "years": "anos"
    },
    "warning": {
      "common": "Esta é uma senha muito comum.",
      "short": "A senha é muito curta.",
      "sequence": "Sequências são fáceis de adivinhar.",
      "repeat": "Padrões repetidos reduzem a força.",
      "singleClass": "Usar apenas um tipo de caractere reduz a força."
    },
    "suggestion": {
      "use-longer": "Use uma senha ou frase mais longa.",
      "add-uppercase": "Adicione letras maiúsculas.",
      "add-lowercase": "Adicione letras minúsculas.",
      "add-numbers": "Adicione números.",
      "add-symbols": "Adicione símbolos.",
      "avoid-common": "Evite senhas comuns e vazadas.",
      "avoid-sequences": "Evite sequências como 123 ou abc.",
      "avoid-repetition": "Evite padrões repetidos."
    }
  },
  "ar": {
    "input-title": "كلمة المرور",
    "password-label": "كلمة المرور",
    "password-placeholder": "أدخل كلمة مرور لتقييمها",
    "show": "إظهار",
    "hide": "إخفاء",
    "privacy-hint": "الفحص يتم محليًا في المتصفح.",
    "results-title": "ملخص القوة",
    "empty": "أدخل كلمة مرور لفحص القوة.",
    "strength-0": "ضعيفة جدًا",
    "strength-1": "ضعيفة",
    "strength-2": "متوسطة",
    "strength-3": "قوية",
    "strength-4": "قوية جدًا",
    "entropy-bits": "الإنتروبيا: {bits} بت",
    "log10-guesses": "محاولات (log10): {value}",
    "length": "الطول",
    "unique": "حروف فريدة",
    "character-sets": "مجموعات الأحرف",
    "crack-offline": "زمن الكسر (غير متصل 1e10/ث)",
    "crack-online": "زمن الكسر (متصل 100/ث)",
    "duration-format": "حوالي {value} {unit}",
    "duration-under-second": "أقل من ثانية واحدة",
    "unit": {
      "seconds": "ثوانٍ",
      "minutes": "دقائق",
      "hours": "ساعات",
      "days": "أيام",
      "months": "أشهر",
      "years": "سنوات"
    },
    "warning": {
      "common": "هذه كلمة مرور شائعة جدًا.",
      "short": "كلمة المرور قصيرة جدًا.",
      "sequence": "التسلسلات سهلة التخمين.",
      "repeat": "الأنماط المتكررة تقلل القوة.",
      "singleClass": "استخدام نوع واحد من الأحرف يقلل القوة."
    },
    "suggestion": {
      "use-longer": "استخدم كلمة مرور أو عبارة أطول.",
      "add-uppercase": "أضف أحرفًا كبيرة.",
      "add-lowercase": "أضف أحرفًا صغيرة.",
      "add-numbers": "أضف أرقامًا.",
      "add-symbols": "أضف رموزًا.",
      "avoid-common": "تجنب كلمات المرور الشائعة أو المسرّبة.",
      "avoid-sequences": "تجنب تسلسلات مثل 123 أو abc.",
      "avoid-repetition": "تجنب الأنماط المتكررة."
    }
  },
  "hi": {
    "input-title": "पासवर्ड",
    "password-label": "पासवर्ड",
    "password-placeholder": "मूल्यांकन के लिए पासवर्ड दर्ज करें",
    "show": "दिखाएँ",
    "hide": "छिपाएँ",
    "privacy-hint": "जांच आपके ब्राउज़र में स्थानीय रूप से होती है।",
    "results-title": "मजबूती सारांश",
    "empty": "मजबूती जाँचने के लिए पासवर्ड दर्ज करें।",
    "strength-0": "बहुत कमजोर",
    "strength-1": "कमजोर",
    "strength-2": "ठीक-ठाक",
    "strength-3": "मजबूत",
    "strength-4": "बहुत मजबूत",
    "entropy-bits": "एंट्रॉपी: {bits} बिट",
    "log10-guesses": "अनुमान (log10): {value}",
    "length": "लंबाई",
    "unique": "अद्वितीय अक्षर",
    "character-sets": "करेक्टर सेट",
    "crack-offline": "क्रैक समय (ऑफलाइन 1e10/से)",
    "crack-online": "क्रैक समय (ऑनलाइन 100/से)",
    "duration-format": "लगभग {value} {unit}",
    "duration-under-second": "1 सेकंड से कम",
    "unit": {
      "seconds": "सेकंड",
      "minutes": "मिनट",
      "hours": "घंटे",
      "days": "दिन",
      "months": "महीने",
      "years": "वर्ष"
    },
    "warning": {
      "common": "यह बहुत आम पासवर्ड है।",
      "short": "पासवर्ड बहुत छोटा है।",
      "sequence": "क्रम आसान होते हैं।",
      "repeat": "दोहराव पैटर्न मजबूती घटाते हैं।",
      "singleClass": "केवल एक प्रकार के अक्षर इस्तेमाल करने से मजबूती घटती है।"
    },
    "suggestion": {
      "use-longer": "लंबा पासवर्ड या पासफ्रेज़ इस्तेमाल करें।",
      "add-uppercase": "बड़े अक्षर जोड़ें।",
      "add-lowercase": "छोटे अक्षर जोड़ें।",
      "add-numbers": "संख्याएँ जोड़ें।",
      "add-symbols": "चिह्न जोड़ें।",
      "avoid-common": "आम या लीक हुए पासवर्ड से बचें।",
      "avoid-sequences": "123 या abc जैसे क्रम से बचें।",
      "avoid-repetition": "दोहराव पैटर्न से बचें।"
    }
  },
  "tr": {
    "input-title": "Parola",
    "password-label": "Parola",
    "password-placeholder": "Değerlendirmek için parola girin",
    "show": "Göster",
    "hide": "Gizle",
    "privacy-hint": "Kontroller tarayıcınızda yerel olarak yapılır.",
    "results-title": "Güç özeti",
    "empty": "Gücü kontrol etmek için bir parola girin.",
    "strength-0": "Çok zayıf",
    "strength-1": "Zayıf",
    "strength-2": "Orta",
    "strength-3": "Güçlü",
    "strength-4": "Çok güçlü",
    "entropy-bits": "Entropi: {bits} bit",
    "log10-guesses": "Tahmin (log10): {value}",
    "length": "Uzunluk",
    "unique": "Benzersiz karakterler",
    "character-sets": "Karakter kümeleri",
    "crack-offline": "Kırma süresi (offline, 1e10/sn)",
    "crack-online": "Kırma süresi (online, 100/sn)",
    "duration-format": "Yaklaşık {value} {unit}",
    "duration-under-second": "1 saniyeden kısa",
    "unit": {
      "seconds": "saniye",
      "minutes": "dakika",
      "hours": "saat",
      "days": "gün",
      "months": "ay",
      "years": "yıl"
    },
    "warning": {
      "common": "Bu çok yaygın bir paroladır.",
      "short": "Parola çok kısa.",
      "sequence": "Ardışık diziler kolayca tahmin edilir.",
      "repeat": "Tekrarlayan desenler gücü düşürür.",
      "singleClass": "Tek bir karakter türü kullanmak gücü düşürür."
    },
    "suggestion": {
      "use-longer": "Daha uzun bir parola veya ifade kullanın.",
      "add-uppercase": "Büyük harf ekleyin.",
      "add-lowercase": "Küçük harf ekleyin.",
      "add-numbers": "Rakam ekleyin.",
      "add-symbols": "Sembol ekleyin.",
      "avoid-common": "Yaygın ve sızmış parolalardan kaçının.",
      "avoid-sequences": "123 veya abc gibi dizilerden kaçının.",
      "avoid-repetition": "Tekrarlayan desenlerden kaçının."
    }
  },
  "nl": {
    "input-title": "Wachtwoord",
    "password-label": "Wachtwoord",
    "password-placeholder": "Typ een wachtwoord om te beoordelen",
    "show": "Tonen",
    "hide": "Verbergen",
    "privacy-hint": "De controle gebeurt lokaal in je browser.",
    "results-title": "Sterkteoverzicht",
    "empty": "Voer een wachtwoord in om de sterkte te controleren.",
    "strength-0": "Zeer zwak",
    "strength-1": "Zwak",
    "strength-2": "Redelijk",
    "strength-3": "Sterk",
    "strength-4": "Zeer sterk",
    "entropy-bits": "Entropie: {bits} bits",
    "log10-guesses": "Gissingen (log10): {value}",
    "length": "Lengte",
    "unique": "Unieke tekens",
    "character-sets": "Tekensets",
    "crack-offline": "Kraaktijd (offline, 1e10/s)",
    "crack-online": "Kraaktijd (online, 100/s)",
    "duration-format": "Ongeveer {value} {unit}",
    "duration-under-second": "Minder dan 1 seconde",
    "unit": {
      "seconds": "seconden",
      "minutes": "minuten",
      "hours": "uur",
      "days": "dagen",
      "months": "maanden",
      "years": "jaar"
    },
    "warning": {
      "common": "Dit is een zeer veelvoorkomend wachtwoord.",
      "short": "Het wachtwoord is te kort.",
      "sequence": "Reeksen zijn makkelijk te raden.",
      "repeat": "Herhaalde patronen verlagen de sterkte.",
      "singleClass": "Slechts één tekentype gebruiken verlaagt de sterkte."
    },
    "suggestion": {
      "use-longer": "Gebruik een langer wachtwoord of wachtzin.",
      "add-uppercase": "Voeg hoofdletters toe.",
      "add-lowercase": "Voeg kleine letters toe.",
      "add-numbers": "Voeg cijfers toe.",
      "add-symbols": "Voeg symbolen toe.",
      "avoid-common": "Vermijd veelvoorkomende of gelekte wachtwoorden.",
      "avoid-sequences": "Vermijd reeksen zoals 123 of abc.",
      "avoid-repetition": "Vermijd herhaalde patronen."
    }
  },
  "sv": {
    "input-title": "Lösenord",
    "password-label": "Lösenord",
    "password-placeholder": "Skriv ett lösenord att bedöma",
    "show": "Visa",
    "hide": "Dölj",
    "privacy-hint": "Kontrollen sker lokalt i webbläsaren.",
    "results-title": "Styrkesammanfattning",
    "empty": "Ange ett lösenord för att kontrollera styrkan.",
    "strength-0": "Mycket svagt",
    "strength-1": "Svagt",
    "strength-2": "Okej",
    "strength-3": "Starkt",
    "strength-4": "Mycket starkt",
    "entropy-bits": "Entropi: {bits} bit",
    "log10-guesses": "Gissningar (log10): {value}",
    "length": "Längd",
    "unique": "Unika tecken",
    "character-sets": "Teckenuppsättningar",
    "crack-offline": "Knäckningstid (offline, 1e10/s)",
    "crack-online": "Knäckningstid (online, 100/s)",
    "duration-format": "Cirka {value} {unit}",
    "duration-under-second": "Mindre än 1 sekund",
    "unit": {
      "seconds": "sekunder",
      "minutes": "minuter",
      "hours": "timmar",
      "days": "dagar",
      "months": "månader",
      "years": "år"
    },
    "warning": {
      "common": "Det här är ett mycket vanligt lösenord.",
      "short": "Lösenordet är för kort.",
      "sequence": "Sekvenser är lätta att gissa.",
      "repeat": "Upprepade mönster minskar styrkan.",
      "singleClass": "Att bara använda en teckentyp minskar styrkan."
    },
    "suggestion": {
      "use-longer": "Använd ett längre lösenord eller lösenfras.",
      "add-uppercase": "Lägg till versaler.",
      "add-lowercase": "Lägg till gemener.",
      "add-numbers": "Lägg till siffror.",
      "add-symbols": "Lägg till symboler.",
      "avoid-common": "Undvik vanliga eller läckta lösenord.",
      "avoid-sequences": "Undvik sekvenser som 123 eller abc.",
      "avoid-repetition": "Undvik upprepade mönster."
    }
  },
  "pl": {
    "input-title": "Hasło",
    "password-label": "Hasło",
    "password-placeholder": "Wpisz hasło do oceny",
    "show": "Pokaż",
    "hide": "Ukryj",
    "privacy-hint": "Sprawdzanie odbywa się lokalnie w przeglądarce.",
    "results-title": "Podsumowanie siły",
    "empty": "Wpisz hasło, aby sprawdzić siłę.",
    "strength-0": "Bardzo słabe",
    "strength-1": "Słabe",
    "strength-2": "Przeciętne",
    "strength-3": "Silne",
    "strength-4": "Bardzo silne",
    "entropy-bits": "Entropia: {bits} bitów",
    "log10-guesses": "Próby (log10): {value}",
    "length": "Długość",
    "unique": "Unikalne znaki",
    "character-sets": "Zestawy znaków",
    "crack-offline": "Czas złamania (offline, 1e10/s)",
    "crack-online": "Czas złamania (online, 100/s)",
    "duration-format": "Około {value} {unit}",
    "duration-under-second": "Mniej niż 1 sekunda",
    "unit": {
      "seconds": "sekund",
      "minutes": "minut",
      "hours": "godzin",
      "days": "dni",
      "months": "miesięcy",
      "years": "lat"
    },
    "warning": {
      "common": "To bardzo popularne hasło.",
      "short": "Hasło jest zbyt krótkie.",
      "sequence": "Sekwencje są łatwe do odgadnięcia.",
      "repeat": "Powtarzające się wzorce obniżają siłę.",
      "singleClass": "Użycie tylko jednego typu znaków obniża siłę."
    },
    "suggestion": {
      "use-longer": "Użyj dłuższego hasła lub frazy.",
      "add-uppercase": "Dodaj wielkie litery.",
      "add-lowercase": "Dodaj małe litery.",
      "add-numbers": "Dodaj cyfry.",
      "add-symbols": "Dodaj symbole.",
      "avoid-common": "Unikaj popularnych lub wyciekłych haseł.",
      "avoid-sequences": "Unikaj sekwencji jak 123 lub abc.",
      "avoid-repetition": "Unikaj powtarzających się wzorców."
    }
  },
  "vi": {
    "input-title": "Mật khẩu",
    "password-label": "Mật khẩu",
    "password-placeholder": "Nhập mật khẩu để đánh giá",
    "show": "Hiện",
    "hide": "Ẩn",
    "privacy-hint": "Việc kiểm tra được thực hiện cục bộ trong trình duyệt.",
    "results-title": "Tóm tắt độ mạnh",
    "empty": "Nhập mật khẩu để kiểm tra độ mạnh.",
    "strength-0": "Rất yếu",
    "strength-1": "Yếu",
    "strength-2": "Trung bình",
    "strength-3": "Mạnh",
    "strength-4": "Rất mạnh",
    "entropy-bits": "Entropy: {bits} bit",
    "log10-guesses": "Số lần đoán (log10): {value}",
    "length": "Độ dài",
    "unique": "Ký tự duy nhất",
    "character-sets": "Tập ký tự",
    "crack-offline": "Thời gian bẻ (offline, 1e10/s)",
    "crack-online": "Thời gian bẻ (online, 100/s)",
    "duration-format": "Khoảng {value} {unit}",
    "duration-under-second": "Nhỏ hơn 1 giây",
    "unit": {
      "seconds": "giây",
      "minutes": "phút",
      "hours": "giờ",
      "days": "ngày",
      "months": "tháng",
      "years": "năm"
    },
    "warning": {
      "common": "Đây là mật khẩu rất phổ biến.",
      "short": "Mật khẩu quá ngắn.",
      "sequence": "Chuỗi liên tiếp dễ đoán.",
      "repeat": "Mẫu lặp lại làm giảm độ mạnh.",
      "singleClass": "Chỉ dùng một loại ký tự làm giảm độ mạnh."
    },
    "suggestion": {
      "use-longer": "Dùng mật khẩu hoặc cụm từ dài hơn.",
      "add-uppercase": "Thêm chữ in hoa.",
      "add-lowercase": "Thêm chữ thường.",
      "add-numbers": "Thêm số.",
      "add-symbols": "Thêm ký hiệu.",
      "avoid-common": "Tránh mật khẩu phổ biến hoặc đã lộ.",
      "avoid-sequences": "Tránh chuỗi như 123 hoặc abc.",
      "avoid-repetition": "Tránh mẫu lặp lại."
    }
  },
  "th": {
    "input-title": "รหัสผ่าน",
    "password-label": "รหัสผ่าน",
    "password-placeholder": "พิมพ์รหัสผ่านเพื่อประเมิน",
    "show": "แสดง",
    "hide": "ซ่อน",
    "privacy-hint": "การตรวจสอบทำงานในเบราว์เซอร์ของคุณแบบออฟไลน์",
    "results-title": "สรุปความแข็งแรง",
    "empty": "กรอกรหัสผ่านเพื่อประเมินความแข็งแรง",
    "strength-0": "อ่อนมาก",
    "strength-1": "อ่อน",
    "strength-2": "ปานกลาง",
    "strength-3": "แข็งแรง",
    "strength-4": "แข็งแรงมาก",
    "entropy-bits": "เอนโทรปี: {bits} บิต",
    "log10-guesses": "จำนวนเดา (log10): {value}",
    "length": "ความยาว",
    "unique": "อักขระไม่ซ้ำ",
    "character-sets": "ชุดอักขระ",
    "crack-offline": "เวลาแคร็ก (ออฟไลน์ 1e10/วินาที)",
    "crack-online": "เวลาแคร็ก (ออนไลน์ 100/วินาที)",
    "duration-format": "ประมาณ {value} {unit}",
    "duration-under-second": "น้อยกว่า 1 วินาที",
    "unit": {
      "seconds": "วินาที",
      "minutes": "นาที",
      "hours": "ชั่วโมง",
      "days": "วัน",
      "months": "เดือน",
      "years": "ปี"
    },
    "warning": {
      "common": "นี่เป็นรหัสผ่านที่พบบ่อยมาก",
      "short": "รหัสผ่านสั้นเกินไป",
      "sequence": "ลำดับต่อเนื่องเดาง่าย",
      "repeat": "รูปแบบซ้ำทำให้ความแข็งแรงลดลง",
      "singleClass": "ใช้ประเภทอักขระเพียงแบบเดียวทำให้ความแข็งแรงลดลง"
    },
    "suggestion": {
      "use-longer": "ใช้รหัสผ่านหรือวลีที่ยาวขึ้น",
      "add-uppercase": "เพิ่มตัวอักษรพิมพ์ใหญ่",
      "add-lowercase": "เพิ่มตัวอักษรพิมพ์เล็ก",
      "add-numbers": "เพิ่มตัวเลข",
      "add-symbols": "เพิ่มสัญลักษณ์",
      "avoid-common": "หลีกเลี่ยงรหัสผ่านยอดนิยมและที่รั่วไหล",
      "avoid-sequences": "หลีกเลี่ยงลำดับอย่าง 123 หรือ abc",
      "avoid-repetition": "หลีกเลี่ยงรูปแบบซ้ำ"
    }
  },
  "id": {
    "input-title": "Kata sandi",
    "password-label": "Kata sandi",
    "password-placeholder": "Masukkan kata sandi untuk menilai",
    "show": "Tampilkan",
    "hide": "Sembunyikan",
    "privacy-hint": "Pemeriksaan berjalan lokal di browser Anda.",
    "results-title": "Ringkasan kekuatan",
    "empty": "Masukkan kata sandi untuk mengecek kekuatannya.",
    "strength-0": "Sangat lemah",
    "strength-1": "Lemah",
    "strength-2": "Cukup",
    "strength-3": "Kuat",
    "strength-4": "Sangat kuat",
    "entropy-bits": "Entropi: {bits} bit",
    "log10-guesses": "Perkiraan (log10): {value}",
    "length": "Panjang",
    "unique": "Karakter unik",
    "character-sets": "Set karakter",
    "crack-offline": "Waktu pecah (offline, 1e10/detik)",
    "crack-online": "Waktu pecah (online, 100/detik)",
    "duration-format": "Sekitar {value} {unit}",
    "duration-under-second": "Kurang dari 1 detik",
    "unit": {
      "seconds": "detik",
      "minutes": "menit",
      "hours": "jam",
      "days": "hari",
      "months": "bulan",
      "years": "tahun"
    },
    "warning": {
      "common": "Ini adalah kata sandi yang sangat umum.",
      "short": "Kata sandi terlalu pendek.",
      "sequence": "Urutan mudah ditebak.",
      "repeat": "Pola berulang mengurangi kekuatan.",
      "singleClass": "Hanya satu jenis karakter menurunkan kekuatan."
    },
    "suggestion": {
      "use-longer": "Gunakan kata sandi atau frasa yang lebih panjang.",
      "add-uppercase": "Tambahkan huruf kapital.",
      "add-lowercase": "Tambahkan huruf kecil.",
      "add-numbers": "Tambahkan angka.",
      "add-symbols": "Tambahkan simbol.",
      "avoid-common": "Hindari kata sandi umum atau yang bocor.",
      "avoid-sequences": "Hindari urutan seperti 123 atau abc.",
      "avoid-repetition": "Hindari pola berulang."
    }
  },
  "he": {
    "input-title": "סיסמה",
    "password-label": "סיסמה",
    "password-placeholder": "הקלד סיסמה להערכה",
    "show": "הצג",
    "hide": "הסתר",
    "privacy-hint": "הבדיקה מתבצעת מקומית בדפדפן שלך.",
    "results-title": "סיכום חוזק",
    "empty": "הזן סיסמה כדי לבדוק את החוזק.",
    "strength-0": "חלשה מאוד",
    "strength-1": "חלשה",
    "strength-2": "בינונית",
    "strength-3": "חזקה",
    "strength-4": "חזקה מאוד",
    "entropy-bits": "אנטרופיה: {bits} ביט",
    "log10-guesses": "ניסיונות (log10): {value}",
    "length": "אורך",
    "unique": "תווים ייחודיים",
    "character-sets": "קבוצות תווים",
    "crack-offline": "זמן פיצוח (אופליין, 1e10/שניה)",
    "crack-online": "זמן פיצוח (אונליין, 100/שניה)",
    "duration-format": "בערך {value} {unit}",
    "duration-under-second": "פחות משנייה אחת",
    "unit": {
      "seconds": "שניות",
      "minutes": "דקות",
      "hours": "שעות",
      "days": "ימים",
      "months": "חודשים",
      "years": "שנים"
    },
    "warning": {
      "common": "זו סיסמה נפוצה מאוד.",
      "short": "הסיסמה קצרה מדי.",
      "sequence": "רצפים קלים לניחוש.",
      "repeat": "דפוסים חוזרים מפחיתים את החוזק.",
      "singleClass": "שימוש בסוג תווים אחד מפחית את החוזק."
    },
    "suggestion": {
      "use-longer": "השתמש בסיסמה או ביטוי ארוכים יותר.",
      "add-uppercase": "הוסף אותיות גדולות.",
      "add-lowercase": "הוסף אותיות קטנות.",
      "add-numbers": "הוסף מספרים.",
      "add-symbols": "הוסף סמלים.",
      "avoid-common": "הימנע מסיסמאות נפוצות או דלופות.",
      "avoid-sequences": "הימנע מרצפים כמו 123 או abc.",
      "avoid-repetition": "הימנע מדפוסים חוזרים."
    }
  },
  "ms": {
    "input-title": "Kata laluan",
    "password-label": "Kata laluan",
    "password-placeholder": "Masukkan kata laluan untuk dinilai",
    "show": "Tunjuk",
    "hide": "Sembunyi",
    "privacy-hint": "Pemeriksaan dijalankan secara tempatan dalam pelayar.",
    "results-title": "Ringkasan kekuatan",
    "empty": "Masukkan kata laluan untuk semak kekuatan.",
    "strength-0": "Sangat lemah",
    "strength-1": "Lemah",
    "strength-2": "Sederhana",
    "strength-3": "Kuat",
    "strength-4": "Sangat kuat",
    "entropy-bits": "Entropi: {bits} bit",
    "log10-guesses": "Tebakan (log10): {value}",
    "length": "Panjang",
    "unique": "Aksara unik",
    "character-sets": "Set aksara",
    "crack-offline": "Masa pecah (offline, 1e10/s)",
    "crack-online": "Masa pecah (online, 100/s)",
    "duration-format": "Kira-kira {value} {unit}",
    "duration-under-second": "Kurang daripada 1 saat",
    "unit": {
      "seconds": "saat",
      "minutes": "minit",
      "hours": "jam",
      "days": "hari",
      "months": "bulan",
      "years": "tahun"
    },
    "warning": {
      "common": "Ini kata laluan yang sangat biasa.",
      "short": "Kata laluan terlalu pendek.",
      "sequence": "Jujukan mudah diteka.",
      "repeat": "Corak berulang mengurangkan kekuatan.",
      "singleClass": "Hanya satu jenis aksara menurunkan kekuatan."
    },
    "suggestion": {
      "use-longer": "Gunakan kata laluan atau frasa yang lebih panjang.",
      "add-uppercase": "Tambah huruf besar.",
      "add-lowercase": "Tambah huruf kecil.",
      "add-numbers": "Tambah nombor.",
      "add-symbols": "Tambah simbol.",
      "avoid-common": "Elakkan kata laluan biasa atau yang bocor.",
      "avoid-sequences": "Elakkan jujukan seperti 123 atau abc.",
      "avoid-repetition": "Elakkan corak berulang."
    }
  },
  "no": {
    "input-title": "Passord",
    "password-label": "Passord",
    "password-placeholder": "Skriv inn et passord for vurdering",
    "show": "Vis",
    "hide": "Skjul",
    "privacy-hint": "Sjekken kjøres lokalt i nettleseren.",
    "results-title": "Styrkesammendrag",
    "empty": "Skriv inn et passord for å sjekke styrken.",
    "strength-0": "Svært svakt",
    "strength-1": "Svakt",
    "strength-2": "Greit",
    "strength-3": "Sterkt",
    "strength-4": "Svært sterkt",
    "entropy-bits": "Entropi: {bits} bit",
    "log10-guesses": "Gjetninger (log10): {value}",
    "length": "Lengde",
    "unique": "Unike tegn",
    "character-sets": "Tegnsett",
    "crack-offline": "Knekktid (offline, 1e10/s)",
    "crack-online": "Knekktid (online, 100/s)",
    "duration-format": "Omtrent {value} {unit}",
    "duration-under-second": "Mindre enn 1 sekund",
    "unit": {
      "seconds": "sekunder",
      "minutes": "minutter",
      "hours": "timer",
      "days": "dager",
      "months": "måneder",
      "years": "år"
    },
    "warning": {
      "common": "Dette er et svært vanlig passord.",
      "short": "Passordet er for kort.",
      "sequence": "Sekvenser er lette å gjette.",
      "repeat": "Gjentatte mønstre reduserer styrken.",
      "singleClass": "Kun én tegnkategori reduserer styrken."
    },
    "suggestion": {
      "use-longer": "Bruk et lengre passord eller en passfrase.",
      "add-uppercase": "Legg til store bokstaver.",
      "add-lowercase": "Legg til små bokstaver.",
      "add-numbers": "Legg til tall.",
      "add-symbols": "Legg til symboler.",
      "avoid-common": "Unngå vanlige eller lekkede passord.",
      "avoid-sequences": "Unngå sekvenser som 123 eller abc.",
      "avoid-repetition": "Unngå gjentatte mønstre."
    }
  }
}
</i18n>
