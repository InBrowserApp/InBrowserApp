import type { Ref } from 'vue'
import { h } from 'vue'
import { get } from '@vueuse/core'
import { useMessage, NIcon } from 'naive-ui'
import Icon from '@vicons/fluent/ClipboardCheckmark20Regular'
import { useI18n } from 'vue-i18n'

export function useCopyToClipboard(
  text: Ref<string | number | undefined> | string | number | undefined,
) {
  const message = useMessage()
  const { t } = useI18n({
    messages: i18nMessages,
  })

  const copy = async () => {
    const textToCopy = get(text)
    if (!textToCopy) return
    try {
      await navigator.clipboard.writeText(textToCopy.toString())
      message.create(t('success'), {
        icon: () => h(NIcon, null, { default: () => h(Icon) }),
      })
    } catch (error) {
      console.error('Failed to copy to clipboard', error)
      message.error(t('error'))
    }
  }

  return { copy }
}

const i18nMessages = {
  en: {
    success: 'Copied to clipboard',
    error: 'Failed to copy to clipboard',
  },
  zh: {
    success: '已复制到剪贴板',
    error: '复制到剪贴板失败',
  },
  'zh-CN': {
    success: '已复制到剪贴板',
    error: '复制到剪贴板失败',
  },
  'zh-TW': {
    success: '已複製到剪貼簿',
    error: '複製到剪貼簿失敗',
  },
  'zh-HK': {
    success: '已複製到剪貼簿',
    error: '複製到剪貼簿失敗',
  },
  es: {
    success: 'Copiado al portapapeles',
    error: 'Error al copiar al portapapeles',
  },
  fr: {
    success: 'Copié dans le presse-papiers',
    error: 'Échec de la copie dans le presse-papiers',
  },
  de: {
    success: 'In Zwischenablage kopiert',
    error: 'Fehler beim Kopieren in die Zwischenablage',
  },
  it: {
    success: 'Copiato negli appunti',
    error: 'Impossibile copiare negli appunti',
  },
  ja: {
    success: 'クリップボードにコピーしました',
    error: 'クリップボードへのコピーに失敗しました',
  },
  ko: {
    success: '클립보드에 복사되었습니다',
    error: '클립보드에 복사하는 데 실패했습니다',
  },
  ru: {
    success: 'Скопировано в буфер обмена',
    error: 'Не удалось скопировать в буфер обмена',
  },
  pt: {
    success: 'Copiado para a área de transferência',
    error: 'Falha ao copiar para a área de transferência',
  },
  ar: {
    success: 'تم النسخ إلى الحافظة',
    error: 'فشل النسخ إلى الحافظة',
  },
  hi: {
    success: 'क्लिपबोर्ड पर कॉपी किया गया',
    error: 'क्लिपबोर्ड पर कॉपी करने में विफल',
  },
  tr: {
    success: 'Panoya kopyalandı',
    error: 'Panoya kopyalama başarısız',
  },
  nl: {
    success: 'Gekopieerd naar klembord',
    error: 'Kopiëren naar klembord mislukt',
  },
  sv: {
    success: 'Kopierat till urklipp',
    error: 'Kunde inte kopiera till urklipp',
  },
  pl: {
    success: 'Skopiowano do schowka',
    error: 'Nie udało się skopiować do schowka',
  },
  vi: {
    success: 'Đã sao chép vào bộ nhớ tạm',
    error: 'Không thể sao chép vào bộ nhớ tạm',
  },
  th: {
    success: 'คัดลอกไปยังคลิปบอร์ดแล้ว',
    error: 'คัดลอกไปยังคลิปบอร์ดไม่สำเร็จ',
  },
  id: {
    success: 'Disalin ke papan klip',
    error: 'Gagal menyalin ke papan klip',
  },
  he: {
    success: 'הועתק ללוח',
    error: 'העתקה ללוח נכשלה',
  },
  ms: {
    success: 'Disalin ke papan klip',
    error: 'Gagal menyalin ke papan klip',
  },
  no: {
    success: 'Kopiert til utklippstavlen',
    error: 'Kunne ikke kopiere til utklippstavlen',
  },
}
