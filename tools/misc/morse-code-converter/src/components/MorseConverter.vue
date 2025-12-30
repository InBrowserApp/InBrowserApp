<template>
  <ToolSectionHeader>
    <n-flex align="center" justify="space-between">
      <span>{{ t('text') }}</span>
      <CopyToClipboardButton v-if="plainText" :content="plainText" size="small" />
    </n-flex>
  </ToolSectionHeader>
  <ToolSection>
    <n-input
      v-model:value="plainText"
      type="textarea"
      :placeholder="t('textPlaceholder')"
      :rows="4"
      @focus="editSource = 'text'"
    />
  </ToolSection>

  <ToolSectionHeader>
    <n-flex align="center" justify="space-between">
      <span>{{ t('morseCode') }}</span>
      <n-flex :size="8">
        <n-button v-if="morseCode && !isPlaying" text @click="handlePlay">
          <template #icon>
            <n-icon :component="PlayIcon" />
          </template>
          {{ t('play') }}
        </n-button>
        <n-button v-if="isPlaying" text @click="handleStop">
          <template #icon>
            <n-icon :component="StopIcon" />
          </template>
          {{ t('stop') }}
        </n-button>
        <CopyToClipboardButton v-if="morseCode" :content="morseCode" size="small" />
      </n-flex>
    </n-flex>
  </ToolSectionHeader>
  <ToolSection>
    <n-input
      v-model:value="morseCode"
      type="textarea"
      :placeholder="t('morsePlaceholder')"
      :rows="4"
      :status="morseStatus"
      style="font-family: monospace"
      @focus="editSource = 'morse'"
    />
    <n-flex align="center" :size="8" style="margin-top: 8px">
      <n-text v-if="morseCode && morseStatus === 'success'" type="success">
        {{ t('valid') }}
      </n-text>
      <n-text v-else-if="morseCode && morseStatus === 'error'" type="error">
        {{ t('invalid') }}
      </n-text>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { NInput, NFlex, NText, NButton, NIcon } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import { Play16Regular as PlayIcon, Stop16Regular as StopIcon } from '@shared/icons/fluent'
import { textToMorse, morseToText, isValidMorse, playMorseAudio } from '../utils/morse'

const { t } = useI18n()

const plainText = useStorage('tools:morse-code-converter:text', 'HELLO WORLD')
const morseCode = ref(textToMorse(plainText.value))
const editSource = ref<'text' | 'morse'>('text')
const isPlaying = ref(false)
let audioController: { stop: () => void } | null = null

const morseStatus = computed(() => {
  if (!morseCode.value) return undefined
  return isValidMorse(morseCode.value) ? 'success' : 'error'
})

watch(plainText, (newValue) => {
  if (editSource.value === 'text') {
    morseCode.value = textToMorse(newValue)
  }
})

watch(morseCode, (newValue) => {
  if (editSource.value === 'morse' && isValidMorse(newValue)) {
    plainText.value = morseToText(newValue)
  }
})

function handlePlay() {
  if (!morseCode.value) return
  isPlaying.value = true
  audioController = playMorseAudio(morseCode.value, {
    onComplete: () => {
      isPlaying.value = false
    },
  })
}

function handleStop() {
  audioController?.stop()
  isPlaying.value = false
}
</script>

<i18n lang="json">
{
  "en": {
    "text": "Text",
    "morseCode": "Morse Code",
    "textPlaceholder": "Enter text to convert to Morse code",
    "morsePlaceholder": "Enter Morse code (dots and dashes, / for word separator)",
    "valid": "Valid Morse code",
    "invalid": "Invalid Morse code",
    "play": "Play",
    "stop": "Stop"
  },
  "zh": {
    "text": "文本",
    "morseCode": "摩尔斯电码",
    "textPlaceholder": "输入要转换为摩尔斯电码的文本",
    "morsePlaceholder": "输入摩尔斯电码（点和横线，/ 分隔单词）",
    "valid": "有效的摩尔斯电码",
    "invalid": "无效的摩尔斯电码",
    "play": "播放",
    "stop": "停止"
  },
  "zh-CN": {
    "text": "文本",
    "morseCode": "摩尔斯电码",
    "textPlaceholder": "输入要转换为摩尔斯电码的文本",
    "morsePlaceholder": "输入摩尔斯电码（点和横线，/ 分隔单词）",
    "valid": "有效的摩尔斯电码",
    "invalid": "无效的摩尔斯电码",
    "play": "播放",
    "stop": "停止"
  },
  "zh-TW": {
    "text": "文字",
    "morseCode": "摩爾斯電碼",
    "textPlaceholder": "輸入要轉換為摩爾斯電碼的文字",
    "morsePlaceholder": "輸入摩爾斯電碼（點和橫線，/ 分隔單詞）",
    "valid": "有效的摩爾斯電碼",
    "invalid": "無效的摩爾斯電碼",
    "play": "播放",
    "stop": "停止"
  },
  "zh-HK": {
    "text": "文字",
    "morseCode": "摩爾斯電碼",
    "textPlaceholder": "輸入要轉換為摩爾斯電碼的文字",
    "morsePlaceholder": "輸入摩爾斯電碼（點和橫線，/ 分隔單詞）",
    "valid": "有效的摩爾斯電碼",
    "invalid": "無效的摩爾斯電碼",
    "play": "播放",
    "stop": "停止"
  },
  "es": {
    "text": "Texto",
    "morseCode": "Código Morse",
    "textPlaceholder": "Ingrese texto para convertir a código Morse",
    "morsePlaceholder": "Ingrese código Morse (puntos y rayas, / para separar palabras)",
    "valid": "Código Morse válido",
    "invalid": "Código Morse inválido",
    "play": "Reproducir",
    "stop": "Detener"
  },
  "fr": {
    "text": "Texte",
    "morseCode": "Code Morse",
    "textPlaceholder": "Entrez le texte à convertir en code Morse",
    "morsePlaceholder": "Entrez le code Morse (points et traits, / pour séparer les mots)",
    "valid": "Code Morse valide",
    "invalid": "Code Morse invalide",
    "play": "Lecture",
    "stop": "Arrêter"
  },
  "de": {
    "text": "Text",
    "morseCode": "Morsecode",
    "textPlaceholder": "Text eingeben, um in Morsecode zu konvertieren",
    "morsePlaceholder": "Morsecode eingeben (Punkte und Striche, / für Worttrennung)",
    "valid": "Gültiger Morsecode",
    "invalid": "Ungültiger Morsecode",
    "play": "Abspielen",
    "stop": "Stopp"
  },
  "it": {
    "text": "Testo",
    "morseCode": "Codice Morse",
    "textPlaceholder": "Inserisci il testo da convertire in codice Morse",
    "morsePlaceholder": "Inserisci il codice Morse (punti e linee, / per separare le parole)",
    "valid": "Codice Morse valido",
    "invalid": "Codice Morse non valido",
    "play": "Riproduci",
    "stop": "Stop"
  },
  "ja": {
    "text": "テキスト",
    "morseCode": "モールス信号",
    "textPlaceholder": "モールス信号に変換するテキストを入力",
    "morsePlaceholder": "モールス信号を入力（点と線、/ で単語を区切る）",
    "valid": "有効なモールス信号",
    "invalid": "無効なモールス信号",
    "play": "再生",
    "stop": "停止"
  },
  "ko": {
    "text": "텍스트",
    "morseCode": "모스 부호",
    "textPlaceholder": "모스 부호로 변환할 텍스트 입력",
    "morsePlaceholder": "모스 부호 입력 (점과 대시, / 로 단어 구분)",
    "valid": "유효한 모스 부호",
    "invalid": "유효하지 않은 모스 부호",
    "play": "재생",
    "stop": "정지"
  },
  "ru": {
    "text": "Текст",
    "morseCode": "Код Морзе",
    "textPlaceholder": "Введите текст для преобразования в код Морзе",
    "morsePlaceholder": "Введите код Морзе (точки и тире, / для разделения слов)",
    "valid": "Действительный код Морзе",
    "invalid": "Недействительный код Морзе",
    "play": "Воспроизвести",
    "stop": "Остановить"
  },
  "pt": {
    "text": "Texto",
    "morseCode": "Código Morse",
    "textPlaceholder": "Digite o texto para converter em código Morse",
    "morsePlaceholder": "Digite o código Morse (pontos e traços, / para separar palavras)",
    "valid": "Código Morse válido",
    "invalid": "Código Morse inválido",
    "play": "Reproduzir",
    "stop": "Parar"
  },
  "ar": {
    "text": "النص",
    "morseCode": "شفرة مورس",
    "textPlaceholder": "أدخل النص لتحويله إلى شفرة مورس",
    "morsePlaceholder": "أدخل شفرة مورس (نقاط وشرطات، / لفصل الكلمات)",
    "valid": "شفرة مورس صالحة",
    "invalid": "شفرة مورس غير صالحة",
    "play": "تشغيل",
    "stop": "إيقاف"
  },
  "hi": {
    "text": "टेक्स्ट",
    "morseCode": "मोर्स कोड",
    "textPlaceholder": "मोर्स कोड में बदलने के लिए टेक्स्ट दर्ज करें",
    "morsePlaceholder": "मोर्स कोड दर्ज करें (डॉट और डैश, / शब्दों को अलग करने के लिए)",
    "valid": "वैध मोर्स कोड",
    "invalid": "अवैध मोर्स कोड",
    "play": "चलाएं",
    "stop": "रोकें"
  },
  "tr": {
    "text": "Metin",
    "morseCode": "Mors Kodu",
    "textPlaceholder": "Mors koduna dönüştürülecek metni girin",
    "morsePlaceholder": "Mors kodu girin (nokta ve çizgiler, / kelime ayırıcı)",
    "valid": "Geçerli Mors kodu",
    "invalid": "Geçersiz Mors kodu",
    "play": "Oynat",
    "stop": "Durdur"
  },
  "nl": {
    "text": "Tekst",
    "morseCode": "Morsecode",
    "textPlaceholder": "Voer tekst in om naar morsecode te converteren",
    "morsePlaceholder": "Voer morsecode in (punten en strepen, / voor woordscheiding)",
    "valid": "Geldige morsecode",
    "invalid": "Ongeldige morsecode",
    "play": "Afspelen",
    "stop": "Stop"
  },
  "sv": {
    "text": "Text",
    "morseCode": "Morsekod",
    "textPlaceholder": "Ange text att konvertera till morsekod",
    "morsePlaceholder": "Ange morsekod (punkter och streck, / för ordavskiljare)",
    "valid": "Giltig morsekod",
    "invalid": "Ogiltig morsekod",
    "play": "Spela",
    "stop": "Stopp"
  },
  "pl": {
    "text": "Tekst",
    "morseCode": "Kod Morse'a",
    "textPlaceholder": "Wprowadź tekst do konwersji na kod Morse'a",
    "morsePlaceholder": "Wprowadź kod Morse'a (kropki i kreski, / do oddzielania słów)",
    "valid": "Prawidłowy kod Morse'a",
    "invalid": "Nieprawidłowy kod Morse'a",
    "play": "Odtwórz",
    "stop": "Stop"
  },
  "vi": {
    "text": "Văn bản",
    "morseCode": "Mã Morse",
    "textPlaceholder": "Nhập văn bản để chuyển đổi sang mã Morse",
    "morsePlaceholder": "Nhập mã Morse (chấm và gạch, / để phân tách từ)",
    "valid": "Mã Morse hợp lệ",
    "invalid": "Mã Morse không hợp lệ",
    "play": "Phát",
    "stop": "Dừng"
  },
  "th": {
    "text": "ข้อความ",
    "morseCode": "รหัสมอร์ส",
    "textPlaceholder": "ป้อนข้อความเพื่อแปลงเป็นรหัสมอร์ส",
    "morsePlaceholder": "ป้อนรหัสมอร์ส (จุดและขีด, / สำหรับแยกคำ)",
    "valid": "รหัสมอร์สถูกต้อง",
    "invalid": "รหัสมอร์สไม่ถูกต้อง",
    "play": "เล่น",
    "stop": "หยุด"
  },
  "id": {
    "text": "Teks",
    "morseCode": "Kode Morse",
    "textPlaceholder": "Masukkan teks untuk dikonversi ke kode Morse",
    "morsePlaceholder": "Masukkan kode Morse (titik dan garis, / untuk pemisah kata)",
    "valid": "Kode Morse valid",
    "invalid": "Kode Morse tidak valid",
    "play": "Putar",
    "stop": "Berhenti"
  },
  "he": {
    "text": "טקסט",
    "morseCode": "קוד מורס",
    "textPlaceholder": "הזן טקסט להמרה לקוד מורס",
    "morsePlaceholder": "הזן קוד מורס (נקודות וקווים, / להפרדת מילים)",
    "valid": "קוד מורס תקין",
    "invalid": "קוד מורס לא תקין",
    "play": "נגן",
    "stop": "עצור"
  },
  "ms": {
    "text": "Teks",
    "morseCode": "Kod Morse",
    "textPlaceholder": "Masukkan teks untuk ditukar kepada kod Morse",
    "morsePlaceholder": "Masukkan kod Morse (titik dan sengkang, / untuk pemisah perkataan)",
    "valid": "Kod Morse sah",
    "invalid": "Kod Morse tidak sah",
    "play": "Main",
    "stop": "Berhenti"
  },
  "no": {
    "text": "Tekst",
    "morseCode": "Morsekode",
    "textPlaceholder": "Skriv inn tekst for å konvertere til morsekode",
    "morsePlaceholder": "Skriv inn morsekode (prikker og streker, / for ordskille)",
    "valid": "Gyldig morsekode",
    "invalid": "Ugyldig morsekode",
    "play": "Spill",
    "stop": "Stopp"
  }
}
</i18n>
