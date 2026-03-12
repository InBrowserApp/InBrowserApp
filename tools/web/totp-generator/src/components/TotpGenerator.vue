<template>
  <n-flex vertical :size="24">
    <div class="totp-tool__block">
      <ToolSectionHeader>{{ t('inputTitle') }}</ToolSectionHeader>
      <div class="totp-tool__section">
        <n-alert type="info" :show-icon="false">{{ t('safetyNote') }}</n-alert>

        <n-radio-group v-model:value="inputMode" name="totp-input-mode">
          <n-space>
            <n-radio-button value="secret">{{ t('secretMode') }}</n-radio-button>
            <n-radio-button value="uri">{{ t('uriMode') }}</n-radio-button>
          </n-space>
        </n-radio-group>

        <n-flex :size="12">
          <n-button secondary @click="loadSample">{{ t('loadSample') }}</n-button>
          <n-button tertiary @click="clearAll">{{ t('clear') }}</n-button>
        </n-flex>

        <n-form label-placement="top">
          <template v-if="inputMode === 'secret'">
            <!-- prettier-ignore -->
            <n-form-item :label="t('secretLabel')" :feedback="secretError" :validation-status="secretError ? 'error' : undefined"><n-input v-model:value="secretInput" :placeholder="sampleConfig.secret" class="totp-tool__secret-input"><template #suffix><n-button quaternary circle size="small" title="Generate random secret" aria-label="Generate random secret" data-testid="random-secret-button" @click="generateRandomSecret"><template #icon><n-icon :component="ArrowSync16Regular" /></template></n-button></template></n-input></n-form-item>

            <n-grid cols="1 s:2 m:3" responsive="screen" x-gap="12">
              <n-gi>
                <n-form-item :label="t('issuerLabel')">
                  <n-input v-model:value="issuerInput" />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item :label="t('accountLabel')">
                  <n-input v-model:value="accountNameInput" />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item :label="t('algorithmLabel')">
                  <n-select
                    :value="algorithm"
                    :options="algorithmOptions"
                    @update:value="updateAlgorithm"
                  />
                </n-form-item>
              </n-gi>
            </n-grid>

            <n-grid cols="1 s:2" responsive="screen" x-gap="12">
              <n-gi>
                <n-form-item :label="t('digitsLabel')">
                  <n-select :value="digits" :options="digitsOptions" @update:value="updateDigits" />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item :label="t('periodLabel')">
                  <n-select :value="period" :options="periodOptions" @update:value="updatePeriod" />
                </n-form-item>
              </n-gi>
            </n-grid>

            <n-form-item :label="t('generatedUriLabel')">
              <n-input
                :value="generatedUri"
                type="textarea"
                readonly
                :autosize="{ minRows: 2, maxRows: 4 }"
              />
            </n-form-item>

            <CopyToClipboardButton
              :content="generatedUri"
              variant="secondary"
              :disabled="!generatedUri"
            />
          </template>

          <!-- prettier-ignore -->
          <n-form-item v-else :label="t('uriLabel')" :feedback="uriError" :validation-status="uriError ? 'error' : undefined"><n-input v-model:value="uriInput" type="textarea" :placeholder="sampleUri" :autosize="{ minRows: 3, maxRows: 6 }" /></n-form-item>
        </n-form>
      </div>
    </div>

    <div class="totp-tool__block">
      <ToolSectionHeader>{{ t('codeTitle') }}</ToolSectionHeader>
      <div class="totp-tool__section">
        <n-empty v-if="!activeConfig" :description="t('noCode')" />
        <n-card v-else size="small">
          <n-flex vertical align="center" :size="12">
            <n-text depth="3">{{ activeDisplayName }}</n-text>
            <div class="totp-tool__code">{{ currentCode || '......' }}</div>
            <n-text depth="3">{{ t('timeRemaining', { seconds: remainingSeconds }) }}</n-text>
            <n-progress type="line" :percentage="progressPercentage" :show-indicator="false" />
            <CopyToClipboardButton
              :content="currentCode"
              variant="secondary"
              :disabled="!currentCode"
            />
          </n-flex>
        </n-card>
      </div>
    </div>

    <div class="totp-tool__block">
      <ToolSectionHeader>{{ t('detailsTitle') }}</ToolSectionHeader>
      <div class="totp-tool__section">
        <n-empty v-if="!activeConfig" :description="t('detailsEmpty')" />
        <n-grid v-else cols="1 s:2 m:3" responsive="screen" x-gap="12" y-gap="12">
          <n-gi v-for="item in detailsItems" :key="item.label">
            <n-card size="small">
              <n-text depth="3">{{ item.label }}</n-text>
              <div class="totp-tool__detail">{{ item.value }}</div>
            </n-card>
          </n-gi>
        </n-grid>
      </div>
    </div>

    <div class="totp-tool__block">
      <ToolSectionHeader>{{ t('debugTitle') }}</ToolSectionHeader>
      <div class="totp-tool__section">
        <n-empty v-if="debugRows.length === 0" :description="t('debugEmpty')" />
        <n-table v-else striped size="small">
          <thead>
            <tr>
              <th>{{ t('windowLabel') }}</th>
              <th>{{ t('codeLabel') }}</th>
              <th>{{ t('counterLabel') }}</th>
              <th>{{ t('timeLabel') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in debugRows" :key="row.label">
              <td>{{ row.label }}</td>
              <td class="totp-tool__cell-code">{{ row.code }}</td>
              <td>{{ row.counter }}</td>
              <td>{{ row.timeRange }}</td>
            </tr>
          </tbody>
        </n-table>
      </div>
    </div>
  </n-flex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ArrowSync16Regular from '@vicons/fluent/ArrowSync16Regular'
import { useI18n } from 'vue-i18n'
import {
  NAlert,
  NButton,
  NCard,
  NEmpty,
  NFlex,
  NForm,
  NFormItem,
  NGi,
  NGrid,
  NIcon,
  NInput,
  NProgress,
  NRadioButton,
  NRadioGroup,
  NSpace,
  NSelect,
  NTable,
  NText,
} from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ToolSectionHeader } from '@shared/ui/tool'
import {
  algorithmOptions,
  digitsOptions,
  periodOptions,
  sampleConfig,
  sampleUri,
  useTotpGenerator,
} from '../composables/useTotpGenerator'

const { t } = useI18n({ useScope: 'local' })

const {
  inputMode,
  secretInput,
  issuerInput,
  accountNameInput,
  algorithm,
  digits,
  period,
  uriInput,
  secretState,
  uriState,
  activeConfig,
  generatedUri,
  activeUri,
  activeDisplayName,
  debugRows,
  currentCode,
  remainingSeconds,
  progressPercentage,
  loadSample,
  generateRandomSecret,
  clearAll,
} = useTotpGenerator({
  getWindowLabels: () => ({
    previous: t('previousWindow'),
    current: t('currentWindow'),
    next: t('nextWindow'),
  }),
})

const secretError = computed(() => translateError(secretState.value.errorCode))
const uriError = computed(() => translateError(uriState.value.errorCode))

const detailsItems = computed(() => {
  if (!activeConfig.value) {
    return []
  }

  return [
    { label: t('detailType'), value: 'TOTP' },
    { label: t('detailIssuer'), value: activeConfig.value.issuer || '—' },
    { label: t('detailAccount'), value: activeConfig.value.accountName || '—' },
    { label: t('detailAlgorithm'), value: activeConfig.value.algorithm },
    { label: t('detailDigits'), value: String(activeConfig.value.digits) },
    { label: t('detailPeriod'), value: `${activeConfig.value.period}s` },
    { label: t('detailSecretStatus'), value: t('valid') },
    { label: t('detailUri'), value: activeUri.value },
  ]
})

function translateError(code: string | null): string {
  switch (code) {
    case 'invalid_base32':
      return t('errorInvalidBase32')
    case 'missing_secret':
      return t('errorMissingSecret')
    case 'invalid_algorithm':
      return t('errorInvalidAlgorithm')
    case 'invalid_digits':
      return t('errorInvalidDigits')
    case 'invalid_period':
      return t('errorInvalidPeriod')
    case 'invalid_uri':
      return t('errorInvalidUri')
    case 'invalid_otpauth_protocol':
      return t('errorInvalidProtocol')
    case 'unsupported_otpauth_type':
      return t('errorUnsupportedType')
    default:
      return ''
  }
}

function updateAlgorithm(value: 'SHA-1' | 'SHA-256' | 'SHA-512'): void {
  algorithm.value = value
}

function updateDigits(value: number): void {
  digits.value = value
}

function updatePeriod(value: number): void {
  period.value = value
}

defineExpose({
  inputMode,
  remainingSeconds,
  progressPercentage,
  detailsItems,
  activeUri,
  activeDisplayName,
  updateAlgorithm,
  updateDigits,
  updatePeriod,
  generateRandomSecret,
})
</script>

<style scoped>
.totp-tool__block {
  display: grid;
  gap: 12px;
}

.totp-tool__section {
  display: grid;
  gap: 16px;
}

:deep(.n-h2) {
  margin: 0;
}

.totp-tool__secret-input :deep(.n-input__suffix) {
  gap: 4px;
}

.totp-tool__code {
  font-family: 'SFMono-Regular', 'Consolas', 'Liberation Mono', monospace;
  font-size: clamp(2rem, 7vw, 3.5rem);
  font-weight: 700;
  letter-spacing: 0.12em;
}

.totp-tool__detail {
  margin-top: 8px;
  font-family: 'SFMono-Regular', 'Consolas', 'Liberation Mono', monospace;
  overflow-wrap: anywhere;
}

.totp-tool__cell-code {
  font-family: 'SFMono-Regular', 'Consolas', 'Liberation Mono', monospace;
  font-weight: 600;
}
</style>

<!-- prettier-ignore -->
<i18n lang="json">{"en":{"inputTitle":"Input","safetyNote":"Local-only TOTP generator. Secrets are not saved by default, and this tool is meant for temporary generation and debugging rather than long-term 2FA storage.","secretMode":"Base32 secret","uriMode":"otpauth URI","loadSample":"Load sample","clear":"Clear","secretLabel":"Base32 secret","issuerLabel":"Issuer","accountLabel":"Account name","algorithmLabel":"Algorithm","digitsLabel":"Digits","periodLabel":"Period","generatedUriLabel":"Provisioning URI","uriLabel":"otpauth URI","codeTitle":"Current code","noCode":"Enter a valid Base32 secret or otpauth URI to generate a code.","timeRemaining":"Refreshes in {seconds}s","detailsTitle":"Parsed details","detailType":"Type","detailIssuer":"Issuer","detailAccount":"Account","detailAlgorithm":"Algorithm","detailDigits":"Digits","detailPeriod":"Period","detailSecretStatus":"Secret","detailUri":"URI","valid":"Valid","detailsEmpty":"Nothing to show yet.","debugTitle":"Debug windows","debugEmpty":"Window codes appear after the input becomes valid.","windowLabel":"Window","counterLabel":"Counter","codeLabel":"Code","timeLabel":"Time range","previousWindow":"Previous","currentWindow":"Current","nextWindow":"Next","errorInvalidBase32":"Enter a valid Base32 secret.","errorMissingSecret":"A secret is required.","errorInvalidAlgorithm":"The algorithm is not supported.","errorInvalidDigits":"Digits must be a positive integer.","errorInvalidPeriod":"Period must be a positive integer.","errorInvalidUri":"Enter a valid otpauth URI.","errorInvalidProtocol":"The URI must start with otpauth://.","errorUnsupportedType":"Only otpauth://totp/... is supported in this tool."},"zh":{"inputTitle":"输入","safetyNote":"仅在本地生成 TOTP。默认不会保存密钥，本工具适合临时生成和调试，不适合作为长期 2FA 保管器。","secretMode":"Base32 密钥","uriMode":"otpauth URI","loadSample":"加载示例","clear":"清空","secretLabel":"Base32 密钥","issuerLabel":"签发方","accountLabel":"账户名","algorithmLabel":"算法","digitsLabel":"位数","periodLabel":"周期","generatedUriLabel":"配置 URI","uriLabel":"otpauth URI","codeTitle":"当前验证码","noCode":"输入有效的 Base32 密钥或 otpauth URI 后即可生成验证码。","timeRemaining":"{seconds}s 后刷新","detailsTitle":"解析结果","detailType":"类型","detailIssuer":"签发方","detailAccount":"账户","detailAlgorithm":"算法","detailDigits":"位数","detailPeriod":"周期","detailSecretStatus":"密钥","detailUri":"URI","valid":"有效","detailsEmpty":"暂无内容。","debugTitle":"调试时间窗","debugEmpty":"输入有效后会显示前后时间窗验证码。","windowLabel":"时间窗","counterLabel":"计数器","codeLabel":"验证码","timeLabel":"时间范围","previousWindow":"上一窗","currentWindow":"当前窗","nextWindow":"下一窗","errorInvalidBase32":"请输入有效的 Base32 密钥。","errorMissingSecret":"必须提供密钥。","errorInvalidAlgorithm":"当前算法不受支持。","errorInvalidDigits":"位数必须是正整数。","errorInvalidPeriod":"周期必须是正整数。","errorInvalidUri":"请输入有效的 otpauth URI。","errorInvalidProtocol":"URI 必须以 otpauth:// 开头。","errorUnsupportedType":"当前工具仅支持 otpauth://totp/...。"},"zh-CN":{"inputTitle":"输入","safetyNote":"仅在本地生成 TOTP。默认不会保存密钥，本工具适合临时生成和调试，不适合作为长期 2FA 保管器。","secretMode":"Base32 密钥","uriMode":"otpauth URI","loadSample":"加载示例","clear":"清空","secretLabel":"Base32 密钥","issuerLabel":"签发方","accountLabel":"账户名","algorithmLabel":"算法","digitsLabel":"位数","periodLabel":"周期","generatedUriLabel":"配置 URI","uriLabel":"otpauth URI","codeTitle":"当前验证码","noCode":"输入有效的 Base32 密钥或 otpauth URI 后即可生成验证码。","timeRemaining":"{seconds}s 后刷新","detailsTitle":"解析结果","detailType":"类型","detailIssuer":"签发方","detailAccount":"账户","detailAlgorithm":"算法","detailDigits":"位数","detailPeriod":"周期","detailSecretStatus":"密钥","detailUri":"URI","valid":"有效","detailsEmpty":"暂无内容。","debugTitle":"调试时间窗","debugEmpty":"输入有效后会显示前后时间窗验证码。","windowLabel":"时间窗","counterLabel":"计数器","codeLabel":"验证码","timeLabel":"时间范围","previousWindow":"上一窗","currentWindow":"当前窗","nextWindow":"下一窗","errorInvalidBase32":"请输入有效的 Base32 密钥。","errorMissingSecret":"必须提供密钥。","errorInvalidAlgorithm":"当前算法不受支持。","errorInvalidDigits":"位数必须是正整数。","errorInvalidPeriod":"周期必须是正整数。","errorInvalidUri":"请输入有效的 otpauth URI。","errorInvalidProtocol":"URI 必须以 otpauth:// 开头。","errorUnsupportedType":"当前工具仅支持 otpauth://totp/...。"},"zh-TW":{"inputTitle":"輸入","safetyNote":"僅在本機產生 TOTP。預設不會儲存密鑰，本工具適合暫時產生與除錯，不適合作為長期 2FA 保管器。","secretMode":"Base32 密鑰","uriMode":"otpauth URI","loadSample":"載入範例","clear":"清除","secretLabel":"Base32 密鑰","issuerLabel":"發行者","accountLabel":"帳號名稱","algorithmLabel":"演算法","digitsLabel":"位數","periodLabel":"週期","generatedUriLabel":"設定 URI","uriLabel":"otpauth URI","codeTitle":"目前驗證碼","noCode":"輸入有效的 Base32 密鑰或 otpauth URI 後即可產生驗證碼。","timeRemaining":"{seconds}s 後更新","detailsTitle":"解析結果","detailType":"類型","detailIssuer":"發行者","detailAccount":"帳號","detailAlgorithm":"演算法","detailDigits":"位數","detailPeriod":"週期","detailSecretStatus":"密鑰","detailUri":"URI","valid":"有效","detailsEmpty":"目前沒有內容。","debugTitle":"除錯時間窗","debugEmpty":"輸入有效後會顯示前後時間窗驗證碼。","windowLabel":"時間窗","counterLabel":"計數器","codeLabel":"驗證碼","timeLabel":"時間範圍","previousWindow":"前一窗","currentWindow":"目前窗","nextWindow":"下一窗","errorInvalidBase32":"請輸入有效的 Base32 密鑰。","errorMissingSecret":"必須提供密鑰。","errorInvalidAlgorithm":"不支援此演算法。","errorInvalidDigits":"位數必須是正整數。","errorInvalidPeriod":"週期必須是正整數。","errorInvalidUri":"請輸入有效的 otpauth URI。","errorInvalidProtocol":"URI 必須以 otpauth:// 開頭。","errorUnsupportedType":"此工具僅支援 otpauth://totp/...。"},"zh-HK":{"inputTitle":"輸入","safetyNote":"僅在本機產生 TOTP。預設不會儲存密鑰，本工具適合暫時產生與除錯，不適合作為長期 2FA 保管器。","secretMode":"Base32 密鑰","uriMode":"otpauth URI","loadSample":"載入範例","clear":"清除","secretLabel":"Base32 密鑰","issuerLabel":"發行者","accountLabel":"帳號名稱","algorithmLabel":"演算法","digitsLabel":"位數","periodLabel":"週期","generatedUriLabel":"設定 URI","uriLabel":"otpauth URI","codeTitle":"目前驗證碼","noCode":"輸入有效的 Base32 密鑰或 otpauth URI 後即可產生驗證碼。","timeRemaining":"{seconds}s 後更新","detailsTitle":"解析結果","detailType":"類型","detailIssuer":"發行者","detailAccount":"帳號","detailAlgorithm":"演算法","detailDigits":"位數","detailPeriod":"週期","detailSecretStatus":"密鑰","detailUri":"URI","valid":"有效","detailsEmpty":"目前沒有內容。","debugTitle":"除錯時間窗","debugEmpty":"輸入有效後會顯示前後時間窗驗證碼。","windowLabel":"時間窗","counterLabel":"計數器","codeLabel":"驗證碼","timeLabel":"時間範圍","previousWindow":"前一窗","currentWindow":"目前窗","nextWindow":"下一窗","errorInvalidBase32":"請輸入有效的 Base32 密鑰。","errorMissingSecret":"必須提供密鑰。","errorInvalidAlgorithm":"不支援此演算法。","errorInvalidDigits":"位數必須是正整數。","errorInvalidPeriod":"週期必須是正整數。","errorInvalidUri":"請輸入有效的 otpauth URI。","errorInvalidProtocol":"URI 必須以 otpauth:// 開頭。","errorUnsupportedType":"此工具僅支援 otpauth://totp/...。"},"es":{"inputTitle":"Entrada","safetyNote":"Generador TOTP solo local. Los secretos no se guardan por defecto y la herramienta está pensada para generación temporal y depuración, no para almacenar 2FA a largo plazo.","secretMode":"Secreto Base32","uriMode":"URI otpauth","loadSample":"Cargar ejemplo","clear":"Limpiar","secretLabel":"Secreto Base32","issuerLabel":"Issuer","accountLabel":"Cuenta","algorithmLabel":"Algoritmo","digitsLabel":"Dígitos","periodLabel":"Periodo","generatedUriLabel":"URI de aprovisionamiento","uriLabel":"URI otpauth","codeTitle":"Código actual","noCode":"Introduce un secreto Base32 válido o un URI otpauth para generar un código.","timeRemaining":"Se actualiza en {seconds}s","detailsTitle":"Detalles","detailType":"Tipo","detailIssuer":"Issuer","detailAccount":"Cuenta","detailAlgorithm":"Algoritmo","detailDigits":"Dígitos","detailPeriod":"Periodo","detailSecretStatus":"Secreto","detailUri":"URI","valid":"Válido","detailsEmpty":"Todavía no hay datos.","debugTitle":"Ventanas de depuración","debugEmpty":"Los códigos de ventana aparecen cuando la entrada es válida.","windowLabel":"Ventana","counterLabel":"Contador","codeLabel":"Código","timeLabel":"Rango de tiempo","previousWindow":"Anterior","currentWindow":"Actual","nextWindow":"Siguiente","errorInvalidBase32":"Introduce un secreto Base32 válido.","errorMissingSecret":"Se requiere un secreto.","errorInvalidAlgorithm":"El algoritmo no es compatible.","errorInvalidDigits":"Los dígitos deben ser un entero positivo.","errorInvalidPeriod":"El periodo debe ser un entero positivo.","errorInvalidUri":"Introduce un URI otpauth válido.","errorInvalidProtocol":"El URI debe comenzar con otpauth://.","errorUnsupportedType":"Esta herramienta solo admite otpauth://totp/... ."},"fr":{"inputTitle":"Entrée","safetyNote":"Générateur TOTP local uniquement. Les secrets ne sont pas enregistrés par défaut et l’outil sert à la génération temporaire et au débogage, pas au stockage 2FA longue durée.","secretMode":"Secret Base32","uriMode":"URI otpauth","loadSample":"Charger un exemple","clear":"Effacer","secretLabel":"Secret Base32","issuerLabel":"Émetteur","accountLabel":"Compte","algorithmLabel":"Algorithme","digitsLabel":"Chiffres","periodLabel":"Période","generatedUriLabel":"URI de provisioning","uriLabel":"URI otpauth","codeTitle":"Code actuel","noCode":"Saisissez un secret Base32 valide ou un URI otpauth pour générer un code.","timeRemaining":"Rafraîchi dans {seconds}s","detailsTitle":"Détails","detailType":"Type","detailIssuer":"Émetteur","detailAccount":"Compte","detailAlgorithm":"Algorithme","detailDigits":"Chiffres","detailPeriod":"Période","detailSecretStatus":"Secret","detailUri":"URI","valid":"Valide","detailsEmpty":"Rien à afficher pour le moment.","debugTitle":"Fenêtres de debug","debugEmpty":"Les codes apparaissent une fois la saisie valide.","windowLabel":"Fenêtre","counterLabel":"Compteur","codeLabel":"Code","timeLabel":"Plage horaire","previousWindow":"Précédente","currentWindow":"Actuelle","nextWindow":"Suivante","errorInvalidBase32":"Saisissez un secret Base32 valide.","errorMissingSecret":"Un secret est requis.","errorInvalidAlgorithm":"Algorithme non pris en charge.","errorInvalidDigits":"Le nombre de chiffres doit être un entier positif.","errorInvalidPeriod":"La période doit être un entier positif.","errorInvalidUri":"Saisissez un URI otpauth valide.","errorInvalidProtocol":"L’URI doit commencer par otpauth://.","errorUnsupportedType":"Cet outil prend uniquement en charge otpauth://totp/... ."},"de":{"inputTitle":"Eingabe","safetyNote":"Nur lokaler TOTP-Generator. Geheimnisse werden standardmäßig nicht gespeichert. Das Tool ist für temporäre Erzeugung und Debugging gedacht, nicht für dauerhafte 2FA-Aufbewahrung.","secretMode":"Base32-Geheimnis","uriMode":"otpauth-URI","loadSample":"Beispiel laden","clear":"Leeren","secretLabel":"Base32-Geheimnis","issuerLabel":"Aussteller","accountLabel":"Kontoname","algorithmLabel":"Algorithmus","digitsLabel":"Stellen","periodLabel":"Zeitraum","generatedUriLabel":"Provisioning-URI","uriLabel":"otpauth-URI","codeTitle":"Aktueller Code","noCode":"Geben Sie ein gültiges Base32-Geheimnis oder eine otpauth-URI ein.","timeRemaining":"Aktualisiert in {seconds}s","detailsTitle":"Details","detailType":"Typ","detailIssuer":"Aussteller","detailAccount":"Konto","detailAlgorithm":"Algorithmus","detailDigits":"Stellen","detailPeriod":"Zeitraum","detailSecretStatus":"Geheimnis","detailUri":"URI","valid":"Gültig","detailsEmpty":"Noch nichts anzuzeigen.","debugTitle":"Debug-Fenster","debugEmpty":"Fenstercodes erscheinen nach gültiger Eingabe.","windowLabel":"Fenster","counterLabel":"Zähler","codeLabel":"Code","timeLabel":"Zeitbereich","previousWindow":"Vorheriges","currentWindow":"Aktuelles","nextWindow":"Nächstes","errorInvalidBase32":"Geben Sie ein gültiges Base32-Geheimnis ein.","errorMissingSecret":"Ein Geheimnis ist erforderlich.","errorInvalidAlgorithm":"Algorithmus wird nicht unterstützt.","errorInvalidDigits":"Die Stellenzahl muss eine positive Ganzzahl sein.","errorInvalidPeriod":"Der Zeitraum muss eine positive Ganzzahl sein.","errorInvalidUri":"Geben Sie eine gültige otpauth-URI ein.","errorInvalidProtocol":"Die URI muss mit otpauth:// beginnen.","errorUnsupportedType":"Dieses Tool unterstützt nur otpauth://totp/... ."},"it":{"inputTitle":"Input","safetyNote":"Generatore TOTP solo locale. I segreti non vengono salvati per impostazione predefinita e lo strumento è pensato per generazione temporanea e debug, non per conservare 2FA nel lungo periodo.","secretMode":"Segreto Base32","uriMode":"URI otpauth","loadSample":"Carica esempio","clear":"Cancella","secretLabel":"Segreto Base32","issuerLabel":"Issuer","accountLabel":"Account","algorithmLabel":"Algoritmo","digitsLabel":"Cifre","periodLabel":"Periodo","generatedUriLabel":"URI di provisioning","uriLabel":"URI otpauth","codeTitle":"Codice attuale","noCode":"Inserisci un segreto Base32 valido o un URI otpauth per generare un codice.","timeRemaining":"Si aggiorna tra {seconds}s","detailsTitle":"Dettagli","detailType":"Tipo","detailIssuer":"Issuer","detailAccount":"Account","detailAlgorithm":"Algoritmo","detailDigits":"Cifre","detailPeriod":"Periodo","detailSecretStatus":"Segreto","detailUri":"URI","valid":"Valido","detailsEmpty":"Niente da mostrare.","debugTitle":"Finestre di debug","debugEmpty":"I codici compaiono quando l’input è valido.","windowLabel":"Finestra","counterLabel":"Contatore","codeLabel":"Codice","timeLabel":"Intervallo","previousWindow":"Precedente","currentWindow":"Corrente","nextWindow":"Successiva","errorInvalidBase32":"Inserisci un segreto Base32 valido.","errorMissingSecret":"È richiesto un segreto.","errorInvalidAlgorithm":"Algoritmo non supportato.","errorInvalidDigits":"Le cifre devono essere un intero positivo.","errorInvalidPeriod":"Il periodo deve essere un intero positivo.","errorInvalidUri":"Inserisci un URI otpauth valido.","errorInvalidProtocol":"L’URI deve iniziare con otpauth://.","errorUnsupportedType":"Questo strumento supporta solo otpauth://totp/... ."},"ja":{"inputTitle":"入力","safetyNote":"ローカル専用のTOTP生成ツールです。シークレットは既定で保存されず、一時的な生成やデバッグ向けであり、長期的な2FA保管には向きません。","secretMode":"Base32 シークレット","uriMode":"otpauth URI","loadSample":"サンプルを読み込む","clear":"クリア","secretLabel":"Base32 シークレット","issuerLabel":"Issuer","accountLabel":"アカウント名","algorithmLabel":"アルゴリズム","digitsLabel":"桁数","periodLabel":"周期","generatedUriLabel":"プロビジョニング URI","uriLabel":"otpauth URI","codeTitle":"現在のコード","noCode":"有効な Base32 シークレットまたは otpauth URI を入力してください。","timeRemaining":"{seconds}s 後に更新","detailsTitle":"解析結果","detailType":"タイプ","detailIssuer":"Issuer","detailAccount":"アカウント","detailAlgorithm":"アルゴリズム","detailDigits":"桁数","detailPeriod":"周期","detailSecretStatus":"シークレット","detailUri":"URI","valid":"有効","detailsEmpty":"まだ表示する内容がありません。","debugTitle":"デバッグウィンドウ","debugEmpty":"入力が有効になると各時間窓のコードを表示します。","windowLabel":"ウィンドウ","counterLabel":"カウンター","codeLabel":"コード","timeLabel":"時間範囲","previousWindow":"前","currentWindow":"現在","nextWindow":"次","errorInvalidBase32":"有効な Base32 シークレットを入力してください。","errorMissingSecret":"シークレットが必要です。","errorInvalidAlgorithm":"このアルゴリズムはサポートされていません。","errorInvalidDigits":"桁数は正の整数である必要があります。","errorInvalidPeriod":"周期は正の整数である必要があります。","errorInvalidUri":"有効な otpauth URI を入力してください。","errorInvalidProtocol":"URI は otpauth:// で始まる必要があります。","errorUnsupportedType":"このツールは otpauth://totp/... のみ対応しています。"},"ko":{"inputTitle":"입력","safetyNote":"로컬 전용 TOTP 생성기입니다. 비밀값은 기본적으로 저장되지 않으며, 장기 보관용 2FA 앱이 아니라 임시 생성과 디버깅을 위한 도구입니다.","secretMode":"Base32 시크릿","uriMode":"otpauth URI","loadSample":"예제 불러오기","clear":"지우기","secretLabel":"Base32 시크릿","issuerLabel":"발급자","accountLabel":"계정 이름","algorithmLabel":"알고리즘","digitsLabel":"자리수","periodLabel":"주기","generatedUriLabel":"프로비저닝 URI","uriLabel":"otpauth URI","codeTitle":"현재 코드","noCode":"유효한 Base32 시크릿 또는 otpauth URI를 입력하세요.","timeRemaining":"{seconds}s 후 갱신","detailsTitle":"파싱 결과","detailType":"유형","detailIssuer":"발급자","detailAccount":"계정","detailAlgorithm":"알고리즘","detailDigits":"자리수","detailPeriod":"주기","detailSecretStatus":"시크릿","detailUri":"URI","valid":"유효","detailsEmpty":"표시할 내용이 없습니다.","debugTitle":"디버그 윈도우","debugEmpty":"입력이 유효해지면 이전/현재/다음 윈도우 코드를 표시합니다.","windowLabel":"윈도우","counterLabel":"카운터","codeLabel":"코드","timeLabel":"시간 범위","previousWindow":"이전","currentWindow":"현재","nextWindow":"다음","errorInvalidBase32":"유효한 Base32 시크릿을 입력하세요.","errorMissingSecret":"시크릿이 필요합니다.","errorInvalidAlgorithm":"지원되지 않는 알고리즘입니다.","errorInvalidDigits":"자리수는 양의 정수여야 합니다.","errorInvalidPeriod":"주기는 양의 정수여야 합니다.","errorInvalidUri":"유효한 otpauth URI를 입력하세요.","errorInvalidProtocol":"URI는 otpauth:// 로 시작해야 합니다.","errorUnsupportedType":"이 도구는 otpauth://totp/... 만 지원합니다."},"ru":{"inputTitle":"Ввод","safetyNote":"Локальный генератор TOTP. Секреты по умолчанию не сохраняются; инструмент предназначен для временной генерации и отладки, а не для долгого хранения 2FA.","secretMode":"Секрет Base32","uriMode":"otpauth URI","loadSample":"Загрузить пример","clear":"Очистить","secretLabel":"Секрет Base32","issuerLabel":"Issuer","accountLabel":"Аккаунт","algorithmLabel":"Алгоритм","digitsLabel":"Цифры","periodLabel":"Период","generatedUriLabel":"Provisioning URI","uriLabel":"otpauth URI","codeTitle":"Текущий код","noCode":"Введите корректный секрет Base32 или URI otpauth.","timeRemaining":"Обновится через {seconds}s","detailsTitle":"Детали","detailType":"Тип","detailIssuer":"Issuer","detailAccount":"Аккаунт","detailAlgorithm":"Алгоритм","detailDigits":"Цифры","detailPeriod":"Период","detailSecretStatus":"Секрет","detailUri":"URI","valid":"Корректно","detailsEmpty":"Пока нечего показывать.","debugTitle":"Окна отладки","debugEmpty":"Коды окон появятся после корректного ввода.","windowLabel":"Окно","counterLabel":"Счётчик","codeLabel":"Код","timeLabel":"Диапазон времени","previousWindow":"Предыдущее","currentWindow":"Текущее","nextWindow":"Следующее","errorInvalidBase32":"Введите корректный секрет Base32.","errorMissingSecret":"Требуется секрет.","errorInvalidAlgorithm":"Алгоритм не поддерживается.","errorInvalidDigits":"Количество цифр должно быть положительным целым числом.","errorInvalidPeriod":"Период должен быть положительным целым числом.","errorInvalidUri":"Введите корректный URI otpauth.","errorInvalidProtocol":"URI должен начинаться с otpauth://.","errorUnsupportedType":"Этот инструмент поддерживает только otpauth://totp/... ."},"pt":{"inputTitle":"Entrada","safetyNote":"Gerador TOTP local. Os segredos não são salvos por padrão e a ferramenta é voltada para geração temporária e depuração, não para guardar 2FA no longo prazo.","secretMode":"Segredo Base32","uriMode":"URI otpauth","loadSample":"Carregar exemplo","clear":"Limpar","secretLabel":"Segredo Base32","issuerLabel":"Emissor","accountLabel":"Conta","algorithmLabel":"Algoritmo","digitsLabel":"Dígitos","periodLabel":"Período","generatedUriLabel":"URI de provisionamento","uriLabel":"URI otpauth","codeTitle":"Código atual","noCode":"Insira um segredo Base32 válido ou um URI otpauth para gerar um código.","timeRemaining":"Atualiza em {seconds}s","detailsTitle":"Detalhes","detailType":"Tipo","detailIssuer":"Emissor","detailAccount":"Conta","detailAlgorithm":"Algoritmo","detailDigits":"Dígitos","detailPeriod":"Período","detailSecretStatus":"Segredo","detailUri":"URI","valid":"Válido","detailsEmpty":"Nada para mostrar ainda.","debugTitle":"Janelas de depuração","debugEmpty":"Os códigos aparecem quando a entrada fica válida.","windowLabel":"Janela","counterLabel":"Contador","codeLabel":"Código","timeLabel":"Faixa de tempo","previousWindow":"Anterior","currentWindow":"Atual","nextWindow":"Próxima","errorInvalidBase32":"Insira um segredo Base32 válido.","errorMissingSecret":"Um segredo é obrigatório.","errorInvalidAlgorithm":"O algoritmo não é compatível.","errorInvalidDigits":"Os dígitos devem ser um inteiro positivo.","errorInvalidPeriod":"O período deve ser um inteiro positivo.","errorInvalidUri":"Insira um URI otpauth válido.","errorInvalidProtocol":"O URI deve começar com otpauth://.","errorUnsupportedType":"Esta ferramenta só oferece suporte a otpauth://totp/... ."},"ar":{"inputTitle":"الإدخال","safetyNote":"مولد TOTP محلي فقط. لا يتم حفظ الأسرار افتراضياً، وهذه الأداة مخصصة للتوليد المؤقت وتصحيح الأخطاء وليست لتخزين 2FA على المدى الطويل.","secretMode":"سر Base32","uriMode":"URI otpauth","loadSample":"تحميل مثال","clear":"مسح","secretLabel":"سر Base32","issuerLabel":"الجهة المصدرة","accountLabel":"اسم الحساب","algorithmLabel":"الخوارزمية","digitsLabel":"عدد الأرقام","periodLabel":"الفترة","generatedUriLabel":"URI التهيئة","uriLabel":"URI otpauth","codeTitle":"الرمز الحالي","noCode":"أدخل سر Base32 صالحاً أو URI otpauth صالحاً لإنشاء رمز.","timeRemaining":"يتم التحديث خلال {seconds}s","detailsTitle":"التفاصيل","detailType":"النوع","detailIssuer":"الجهة المصدرة","detailAccount":"الحساب","detailAlgorithm":"الخوارزمية","detailDigits":"عدد الأرقام","detailPeriod":"الفترة","detailSecretStatus":"السر","detailUri":"URI","valid":"صالح","detailsEmpty":"لا يوجد شيء لعرضه بعد.","debugTitle":"نوافذ التصحيح","debugEmpty":"تظهر رموز النوافذ بعد أن تصبح المدخلات صالحة.","windowLabel":"النافذة","counterLabel":"العداد","codeLabel":"الرمز","timeLabel":"النطاق الزمني","previousWindow":"السابقة","currentWindow":"الحالية","nextWindow":"التالية","errorInvalidBase32":"أدخل سر Base32 صالحاً.","errorMissingSecret":"السر مطلوب.","errorInvalidAlgorithm":"الخوارزمية غير مدعومة.","errorInvalidDigits":"يجب أن يكون عدد الأرقام عدداً صحيحاً موجباً.","errorInvalidPeriod":"يجب أن تكون الفترة عدداً صحيحاً موجباً.","errorInvalidUri":"أدخل URI otpauth صالحاً.","errorInvalidProtocol":"يجب أن يبدأ URI بـ otpauth://.","errorUnsupportedType":"تدعم هذه الأداة فقط otpauth://totp/... ."},"hi":{"inputTitle":"इनपुट","safetyNote":"यह केवल लोकल TOTP जनरेटर है। secrets डिफ़ॉल्ट रूप से सेव नहीं होते, और यह टूल अस्थायी generation व debugging के लिए है, लंबे समय की 2FA storage के लिए नहीं।","secretMode":"Base32 secret","uriMode":"otpauth URI","loadSample":"नमूना लोड करें","clear":"साफ करें","secretLabel":"Base32 secret","issuerLabel":"Issuer","accountLabel":"Account name","algorithmLabel":"Algorithm","digitsLabel":"Digits","periodLabel":"Period","generatedUriLabel":"Provisioning URI","uriLabel":"otpauth URI","codeTitle":"वर्तमान कोड","noCode":"कोड बनाने के लिए मान्य Base32 secret या otpauth URI दर्ज करें।","timeRemaining":"{seconds}s में रीफ़्रेश होगा","detailsTitle":"विवरण","detailType":"Type","detailIssuer":"Issuer","detailAccount":"Account","detailAlgorithm":"Algorithm","detailDigits":"Digits","detailPeriod":"Period","detailSecretStatus":"Secret","detailUri":"URI","valid":"Valid","detailsEmpty":"अभी दिखाने के लिए कुछ नहीं है।","debugTitle":"Debug windows","debugEmpty":"इनपुट मान्य होने पर window codes दिखेंगे।","windowLabel":"Window","counterLabel":"Counter","codeLabel":"Code","timeLabel":"Time range","previousWindow":"Previous","currentWindow":"Current","nextWindow":"Next","errorInvalidBase32":"मान्य Base32 secret दर्ज करें।","errorMissingSecret":"Secret आवश्यक है।","errorInvalidAlgorithm":"Algorithm समर्थित नहीं है।","errorInvalidDigits":"Digits एक positive integer होना चाहिए।","errorInvalidPeriod":"Period एक positive integer होना चाहिए।","errorInvalidUri":"मान्य otpauth URI दर्ज करें।","errorInvalidProtocol":"URI को otpauth:// से शुरू होना चाहिए।","errorUnsupportedType":"यह टूल केवल otpauth://totp/... को सपोर्ट करता है।"},"tr":{"inputTitle":"Girdi","safetyNote":"Yalnızca yerel çalışan TOTP oluşturucu. Gizli anahtarlar varsayılan olarak kaydedilmez; bu araç uzun süreli 2FA saklama için değil, geçici üretim ve hata ayıklama içindir.","secretMode":"Base32 gizli anahtar","uriMode":"otpauth URI","loadSample":"Örnek yükle","clear":"Temizle","secretLabel":"Base32 gizli anahtar","issuerLabel":"Sağlayıcı","accountLabel":"Hesap adı","algorithmLabel":"Algoritma","digitsLabel":"Basamak","periodLabel":"Süre","generatedUriLabel":"Provisioning URI","uriLabel":"otpauth URI","codeTitle":"Geçerli kod","noCode":"Kod üretmek için geçerli bir Base32 gizli anahtar veya otpauth URI girin.","timeRemaining":"{seconds}s içinde yenilenir","detailsTitle":"Ayrıntılar","detailType":"Tür","detailIssuer":"Sağlayıcı","detailAccount":"Hesap","detailAlgorithm":"Algoritma","detailDigits":"Basamak","detailPeriod":"Süre","detailSecretStatus":"Gizli anahtar","detailUri":"URI","valid":"Geçerli","detailsEmpty":"Henüz gösterilecek bir şey yok.","debugTitle":"Hata ayıklama pencereleri","debugEmpty":"Girdi geçerli olduğunda pencere kodları görünür.","windowLabel":"Pencere","counterLabel":"Sayaç","codeLabel":"Kod","timeLabel":"Zaman aralığı","previousWindow":"Önceki","currentWindow":"Geçerli","nextWindow":"Sonraki","errorInvalidBase32":"Geçerli bir Base32 gizli anahtar girin.","errorMissingSecret":"Bir gizli anahtar gerekli.","errorInvalidAlgorithm":"Algoritma desteklenmiyor.","errorInvalidDigits":"Basamak sayısı pozitif tam sayı olmalıdır.","errorInvalidPeriod":"Süre pozitif tam sayı olmalıdır.","errorInvalidUri":"Geçerli bir otpauth URI girin.","errorInvalidProtocol":"URI otpauth:// ile başlamalıdır.","errorUnsupportedType":"Bu araç yalnızca otpauth://totp/... destekler."},"nl":{"inputTitle":"Invoer","safetyNote":"Alleen lokale TOTP-generator. Geheimen worden standaard niet opgeslagen; deze tool is bedoeld voor tijdelijke generatie en debugging, niet voor langdurige 2FA-opslag.","secretMode":"Base32-geheim","uriMode":"otpauth-URI","loadSample":"Voorbeeld laden","clear":"Wissen","secretLabel":"Base32-geheim","issuerLabel":"Issuer","accountLabel":"Accountnaam","algorithmLabel":"Algoritme","digitsLabel":"Cijfers","periodLabel":"Periode","generatedUriLabel":"Provisioning-URI","uriLabel":"otpauth-URI","codeTitle":"Huidige code","noCode":"Voer een geldig Base32-geheim of een geldige otpauth-URI in.","timeRemaining":"Vernieuwt over {seconds}s","detailsTitle":"Details","detailType":"Type","detailIssuer":"Issuer","detailAccount":"Account","detailAlgorithm":"Algoritme","detailDigits":"Cijfers","detailPeriod":"Periode","detailSecretStatus":"Geheim","detailUri":"URI","valid":"Geldig","detailsEmpty":"Nog niets om te tonen.","debugTitle":"Debugvensters","debugEmpty":"Venstercodes verschijnen zodra de invoer geldig is.","windowLabel":"Venster","counterLabel":"Teller","codeLabel":"Code","timeLabel":"Tijdbereik","previousWindow":"Vorige","currentWindow":"Huidige","nextWindow":"Volgende","errorInvalidBase32":"Voer een geldig Base32-geheim in.","errorMissingSecret":"Een geheim is verplicht.","errorInvalidAlgorithm":"Het algoritme wordt niet ondersteund.","errorInvalidDigits":"Cijfers moeten een positief geheel getal zijn.","errorInvalidPeriod":"Periode moet een positief geheel getal zijn.","errorInvalidUri":"Voer een geldige otpauth-URI in.","errorInvalidProtocol":"De URI moet beginnen met otpauth://.","errorUnsupportedType":"Deze tool ondersteunt alleen otpauth://totp/... ."},"sv":{"inputTitle":"Inmatning","safetyNote":"Lokal TOTP-generator. Hemligheter sparas inte som standard, och verktyget är avsett för tillfällig generering och felsökning, inte för långvarig 2FA-lagring.","secretMode":"Base32-hemlighet","uriMode":"otpauth-URI","loadSample":"Ladda exempel","clear":"Rensa","secretLabel":"Base32-hemlighet","issuerLabel":"Utfärdare","accountLabel":"Kontonamn","algorithmLabel":"Algoritm","digitsLabel":"Siffror","periodLabel":"Period","generatedUriLabel":"Provisioning-URI","uriLabel":"otpauth-URI","codeTitle":"Aktuell kod","noCode":"Ange en giltig Base32-hemlighet eller otpauth-URI för att skapa en kod.","timeRemaining":"Uppdateras om {seconds}s","detailsTitle":"Detaljer","detailType":"Typ","detailIssuer":"Utfärdare","detailAccount":"Konto","detailAlgorithm":"Algoritm","detailDigits":"Siffror","detailPeriod":"Period","detailSecretStatus":"Hemlighet","detailUri":"URI","valid":"Giltig","detailsEmpty":"Inget att visa ännu.","debugTitle":"Debugfönster","debugEmpty":"Fönsterkoder visas när inmatningen är giltig.","windowLabel":"Fönster","counterLabel":"Räknare","codeLabel":"Kod","timeLabel":"Tidsintervall","previousWindow":"Föregående","currentWindow":"Nuvarande","nextWindow":"Nästa","errorInvalidBase32":"Ange en giltig Base32-hemlighet.","errorMissingSecret":"En hemlighet krävs.","errorInvalidAlgorithm":"Algoritmen stöds inte.","errorInvalidDigits":"Antalet siffror måste vara ett positivt heltal.","errorInvalidPeriod":"Perioden måste vara ett positivt heltal.","errorInvalidUri":"Ange en giltig otpauth-URI.","errorInvalidProtocol":"URI:n måste börja med otpauth://.","errorUnsupportedType":"Det här verktyget stöder bara otpauth://totp/... ."},"pl":{"inputTitle":"Dane wejściowe","safetyNote":"Lokalny generator TOTP. Sekrety nie są domyślnie zapisywane; to narzędzie służy do tymczasowego generowania i debugowania, a nie do długoterminowego przechowywania 2FA.","secretMode":"Sekret Base32","uriMode":"URI otpauth","loadSample":"Wczytaj przykład","clear":"Wyczyść","secretLabel":"Sekret Base32","issuerLabel":"Wystawca","accountLabel":"Nazwa konta","algorithmLabel":"Algorytm","digitsLabel":"Cyfry","periodLabel":"Okres","generatedUriLabel":"Provisioning URI","uriLabel":"URI otpauth","codeTitle":"Bieżący kod","noCode":"Wprowadź poprawny sekret Base32 lub URI otpauth, aby wygenerować kod.","timeRemaining":"Odświeży się za {seconds}s","detailsTitle":"Szczegóły","detailType":"Typ","detailIssuer":"Wystawca","detailAccount":"Konto","detailAlgorithm":"Algorytm","detailDigits":"Cyfry","detailPeriod":"Okres","detailSecretStatus":"Sekret","detailUri":"URI","valid":"Poprawny","detailsEmpty":"Jeszcze nic do pokazania.","debugTitle":"Okna debugowania","debugEmpty":"Kody okien pojawią się po poprawnym wprowadzeniu danych.","windowLabel":"Okno","counterLabel":"Licznik","codeLabel":"Kod","timeLabel":"Zakres czasu","previousWindow":"Poprzednie","currentWindow":"Bieżące","nextWindow":"Następne","errorInvalidBase32":"Wprowadź poprawny sekret Base32.","errorMissingSecret":"Sekret jest wymagany.","errorInvalidAlgorithm":"Algorytm nie jest obsługiwany.","errorInvalidDigits":"Liczba cyfr musi być dodatnią liczbą całkowitą.","errorInvalidPeriod":"Okres musi być dodatnią liczbą całkowitą.","errorInvalidUri":"Wprowadź poprawny URI otpauth.","errorInvalidProtocol":"URI musi zaczynać się od otpauth://.","errorUnsupportedType":"To narzędzie obsługuje tylko otpauth://totp/... ."},"vi":{"inputTitle":"Đầu vào","safetyNote":"Trình tạo TOTP cục bộ. Bí mật không được lưu theo mặc định; công cụ này dành cho tạo tạm thời và gỡ lỗi, không phải lưu trữ 2FA dài hạn.","secretMode":"Bí mật Base32","uriMode":"URI otpauth","loadSample":"Tải ví dụ","clear":"Xóa","secretLabel":"Bí mật Base32","issuerLabel":"Nhà phát hành","accountLabel":"Tên tài khoản","algorithmLabel":"Thuật toán","digitsLabel":"Số chữ số","periodLabel":"Chu kỳ","generatedUriLabel":"Provisioning URI","uriLabel":"URI otpauth","codeTitle":"Mã hiện tại","noCode":"Nhập bí mật Base32 hợp lệ hoặc URI otpauth để tạo mã.","timeRemaining":"Làm mới sau {seconds}s","detailsTitle":"Chi tiết","detailType":"Loại","detailIssuer":"Nhà phát hành","detailAccount":"Tài khoản","detailAlgorithm":"Thuật toán","detailDigits":"Số chữ số","detailPeriod":"Chu kỳ","detailSecretStatus":"Bí mật","detailUri":"URI","valid":"Hợp lệ","detailsEmpty":"Chưa có gì để hiển thị.","debugTitle":"Cửa sổ gỡ lỗi","debugEmpty":"Mã cửa sổ sẽ xuất hiện khi đầu vào hợp lệ.","windowLabel":"Cửa sổ","counterLabel":"Bộ đếm","codeLabel":"Mã","timeLabel":"Khoảng thời gian","previousWindow":"Trước","currentWindow":"Hiện tại","nextWindow":"Tiếp theo","errorInvalidBase32":"Nhập bí mật Base32 hợp lệ.","errorMissingSecret":"Yêu cầu có bí mật.","errorInvalidAlgorithm":"Thuật toán không được hỗ trợ.","errorInvalidDigits":"Số chữ số phải là số nguyên dương.","errorInvalidPeriod":"Chu kỳ phải là số nguyên dương.","errorInvalidUri":"Nhập URI otpauth hợp lệ.","errorInvalidProtocol":"URI phải bắt đầu bằng otpauth://.","errorUnsupportedType":"Công cụ này chỉ hỗ trợ otpauth://totp/... ."},"th":{"inputTitle":"ข้อมูลนำเข้า","safetyNote":"เครื่องมือสร้าง TOTP ในเครื่องเท่านั้น คีย์ลับจะไม่ถูกบันทึกโดยค่าเริ่มต้น และเครื่องมือนี้เหมาะกับการสร้างชั่วคราวและดีบัก ไม่ใช่การเก็บ 2FA ระยะยาว","secretMode":"คีย์ลับ Base32","uriMode":"otpauth URI","loadSample":"โหลดตัวอย่าง","clear":"ล้าง","secretLabel":"คีย์ลับ Base32","issuerLabel":"ผู้ออก","accountLabel":"ชื่อบัญชี","algorithmLabel":"อัลกอริทึม","digitsLabel":"จำนวนหลัก","periodLabel":"ช่วงเวลา","generatedUriLabel":"Provisioning URI","uriLabel":"otpauth URI","codeTitle":"รหัสปัจจุบัน","noCode":"กรอกคีย์ลับ Base32 หรือ otpauth URI ที่ถูกต้องเพื่อสร้างรหัส","timeRemaining":"รีเฟรชในอีก {seconds}s","detailsTitle":"รายละเอียด","detailType":"ประเภท","detailIssuer":"ผู้ออก","detailAccount":"บัญชี","detailAlgorithm":"อัลกอริทึม","detailDigits":"จำนวนหลัก","detailPeriod":"ช่วงเวลา","detailSecretStatus":"คีย์ลับ","detailUri":"URI","valid":"ถูกต้อง","detailsEmpty":"ยังไม่มีข้อมูลให้แสดง","debugTitle":"หน้าต่างดีบัก","debugEmpty":"รหัสของแต่ละช่วงเวลาจะแสดงเมื่อข้อมูลถูกต้อง","windowLabel":"ช่วงเวลา","counterLabel":"ตัวนับ","codeLabel":"รหัส","timeLabel":"ช่วงเวลา","previousWindow":"ก่อนหน้า","currentWindow":"ปัจจุบัน","nextWindow":"ถัดไป","errorInvalidBase32":"กรอกคีย์ลับ Base32 ที่ถูกต้อง","errorMissingSecret":"ต้องมีคีย์ลับ","errorInvalidAlgorithm":"ไม่รองรับอัลกอริทึมนี้","errorInvalidDigits":"จำนวนหลักต้องเป็นจำนวนเต็มบวก","errorInvalidPeriod":"ช่วงเวลาต้องเป็นจำนวนเต็มบวก","errorInvalidUri":"กรอก otpauth URI ที่ถูกต้อง","errorInvalidProtocol":"URI ต้องขึ้นต้นด้วย otpauth://","errorUnsupportedType":"เครื่องมือนี้รองรับเฉพาะ otpauth://totp/... เท่านั้น"},"id":{"inputTitle":"Input","safetyNote":"Generator TOTP lokal. Secret tidak disimpan secara default, dan alat ini ditujukan untuk pembuatan sementara serta debugging, bukan penyimpanan 2FA jangka panjang.","secretMode":"Secret Base32","uriMode":"URI otpauth","loadSample":"Muat contoh","clear":"Bersihkan","secretLabel":"Secret Base32","issuerLabel":"Penerbit","accountLabel":"Nama akun","algorithmLabel":"Algoritma","digitsLabel":"Digit","periodLabel":"Periode","generatedUriLabel":"Provisioning URI","uriLabel":"URI otpauth","codeTitle":"Kode saat ini","noCode":"Masukkan secret Base32 atau URI otpauth yang valid untuk membuat kode.","timeRemaining":"Diperbarui dalam {seconds}s","detailsTitle":"Detail","detailType":"Tipe","detailIssuer":"Penerbit","detailAccount":"Akun","detailAlgorithm":"Algoritma","detailDigits":"Digit","detailPeriod":"Periode","detailSecretStatus":"Secret","detailUri":"URI","valid":"Valid","detailsEmpty":"Belum ada yang ditampilkan.","debugTitle":"Jendela debug","debugEmpty":"Kode jendela akan muncul setelah input valid.","windowLabel":"Jendela","counterLabel":"Penghitung","codeLabel":"Kode","timeLabel":"Rentang waktu","previousWindow":"Sebelumnya","currentWindow":"Saat ini","nextWindow":"Berikutnya","errorInvalidBase32":"Masukkan secret Base32 yang valid.","errorMissingSecret":"Secret wajib diisi.","errorInvalidAlgorithm":"Algoritma tidak didukung.","errorInvalidDigits":"Digit harus berupa bilangan bulat positif.","errorInvalidPeriod":"Periode harus berupa bilangan bulat positif.","errorInvalidUri":"Masukkan URI otpauth yang valid.","errorInvalidProtocol":"URI harus diawali dengan otpauth://.","errorUnsupportedType":"Alat ini hanya mendukung otpauth://totp/... ."},"he":{"inputTitle":"קלט","safetyNote":"מחולל TOTP מקומי בלבד. סודות אינם נשמרים כברירת מחדל, והכלי מיועד ליצירה זמנית ולניפוי שגיאות ולא לאחסון 2FA לטווח ארוך.","secretMode":"סוד Base32","uriMode":"otpauth URI","loadSample":"טען דוגמה","clear":"נקה","secretLabel":"סוד Base32","issuerLabel":"מנפיק","accountLabel":"שם חשבון","algorithmLabel":"אלגוריתם","digitsLabel":"ספרות","periodLabel":"מחזור","generatedUriLabel":"Provisioning URI","uriLabel":"otpauth URI","codeTitle":"קוד נוכחי","noCode":"הזן סוד Base32 תקין או otpauth URI תקין כדי לייצר קוד.","timeRemaining":"מתרענן בעוד {seconds}s","detailsTitle":"פרטים","detailType":"סוג","detailIssuer":"מנפיק","detailAccount":"חשבון","detailAlgorithm":"אלגוריתם","detailDigits":"ספרות","detailPeriod":"מחזור","detailSecretStatus":"סוד","detailUri":"URI","valid":"תקין","detailsEmpty":"אין עדיין מה להציג.","debugTitle":"חלונות ניפוי","debugEmpty":"קודי חלון יופיעו לאחר שהקלט יהיה תקין.","windowLabel":"חלון","counterLabel":"מונה","codeLabel":"קוד","timeLabel":"טווח זמן","previousWindow":"קודם","currentWindow":"נוכחי","nextWindow":"הבא","errorInvalidBase32":"הזן סוד Base32 תקין.","errorMissingSecret":"נדרש סוד.","errorInvalidAlgorithm":"האלגוריתם אינו נתמך.","errorInvalidDigits":"מספר הספרות חייב להיות מספר שלם חיובי.","errorInvalidPeriod":"המחזור חייב להיות מספר שלם חיובי.","errorInvalidUri":"הזן otpauth URI תקין.","errorInvalidProtocol":"ה-URI חייב להתחיל ב-otpauth://.","errorUnsupportedType":"הכלי הזה תומך רק ב-otpauth://totp/... ."},"ms":{"inputTitle":"Input","safetyNote":"Penjana TOTP tempatan sahaja. Rahsia tidak disimpan secara lalai, dan alat ini sesuai untuk penjanaan sementara serta nyahpepijat, bukan penyimpanan 2FA jangka panjang.","secretMode":"Rahsia Base32","uriMode":"URI otpauth","loadSample":"Muat contoh","clear":"Kosongkan","secretLabel":"Rahsia Base32","issuerLabel":"Penerbit","accountLabel":"Nama akaun","algorithmLabel":"Algoritma","digitsLabel":"Digit","periodLabel":"Tempoh","generatedUriLabel":"Provisioning URI","uriLabel":"URI otpauth","codeTitle":"Kod semasa","noCode":"Masukkan rahsia Base32 atau URI otpauth yang sah untuk menjana kod.","timeRemaining":"Dikemas kini dalam {seconds}s","detailsTitle":"Butiran","detailType":"Jenis","detailIssuer":"Penerbit","detailAccount":"Akaun","detailAlgorithm":"Algoritma","detailDigits":"Digit","detailPeriod":"Tempoh","detailSecretStatus":"Rahsia","detailUri":"URI","valid":"Sah","detailsEmpty":"Belum ada apa-apa untuk dipaparkan.","debugTitle":"Tetingkap nyahpepijat","debugEmpty":"Kod tetingkap akan muncul apabila input sah.","windowLabel":"Tetingkap","counterLabel":"Kaunter","codeLabel":"Kod","timeLabel":"Julat masa","previousWindow":"Sebelumnya","currentWindow":"Semasa","nextWindow":"Seterusnya","errorInvalidBase32":"Masukkan rahsia Base32 yang sah.","errorMissingSecret":"Rahsia diperlukan.","errorInvalidAlgorithm":"Algoritma tidak disokong.","errorInvalidDigits":"Digit mesti integer positif.","errorInvalidPeriod":"Tempoh mesti integer positif.","errorInvalidUri":"Masukkan URI otpauth yang sah.","errorInvalidProtocol":"URI mesti bermula dengan otpauth://.","errorUnsupportedType":"Alat ini hanya menyokong otpauth://totp/... ."},"no":{"inputTitle":"Inndata","safetyNote":"Lokal TOTP-generator. Hemmeligheter lagres ikke som standard, og verktøyet er ment for midlertidig generering og feilsøking, ikke for langsiktig 2FA-lagring.","secretMode":"Base32-hemmelighet","uriMode":"otpauth-URI","loadSample":"Last inn eksempel","clear":"Tøm","secretLabel":"Base32-hemmelighet","issuerLabel":"Utsteder","accountLabel":"Kontonavn","algorithmLabel":"Algoritme","digitsLabel":"Sifre","periodLabel":"Periode","generatedUriLabel":"Provisioning-URI","uriLabel":"otpauth-URI","codeTitle":"Gjeldende kode","noCode":"Skriv inn en gyldig Base32-hemmelighet eller otpauth-URI for å generere en kode.","timeRemaining":"Oppdateres om {seconds}s","detailsTitle":"Detaljer","detailType":"Type","detailIssuer":"Utsteder","detailAccount":"Konto","detailAlgorithm":"Algoritme","detailDigits":"Sifre","detailPeriod":"Periode","detailSecretStatus":"Hemmelighet","detailUri":"URI","valid":"Gyldig","detailsEmpty":"Ingenting å vise ennå.","debugTitle":"Feilsøkingsvinduer","debugEmpty":"Vinduskoder vises når inndataene er gyldige.","windowLabel":"Vindu","counterLabel":"Teller","codeLabel":"Kode","timeLabel":"Tidsrom","previousWindow":"Forrige","currentWindow":"Nåværende","nextWindow":"Neste","errorInvalidBase32":"Skriv inn en gyldig Base32-hemmelighet.","errorMissingSecret":"En hemmelighet er påkrevd.","errorInvalidAlgorithm":"Algoritmen støttes ikke.","errorInvalidDigits":"Antall sifre må være et positivt heltall.","errorInvalidPeriod":"Perioden må være et positivt heltall.","errorInvalidUri":"Skriv inn en gyldig otpauth-URI.","errorInvalidProtocol":"URI-en må starte med otpauth://.","errorUnsupportedType":"Dette verktøyet støtter bare otpauth://totp/... ."}}</i18n>
