<template>
  <ToolSectionHeader>{{ t('reminders') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex align="center" justify="space-between">
      <n-text>{{ t('enable-reminders') }}</n-text>
      <n-switch v-model:value="remindersEnabledModel" />
    </n-flex>

    <n-flex v-if="remindersEnabledModel" vertical :size="8" style="margin-top: 12px">
      <div v-for="(reminder, index) in reminders" :key="index" class="reminder-row">
        <n-input-number
          :value="reminder.amount"
          :min="1"
          :precision="0"
          @update:value="updateReminder(index, { amount: $event ?? 1 })"
        />
        <n-select
          :value="reminder.unit"
          :options="reminderUnitOptions"
          @update:value="updateReminder(index, { unit: $event })"
        />
        <n-input
          :value="reminder.description"
          :placeholder="t('reminder-message')"
          @update:value="updateReminder(index, { description: $event })"
        />
        <n-button text @click="removeReminder(index)">
          <template #icon>
            <n-icon :component="Delete16Regular" />
          </template>
          {{ t('remove') }}
        </n-button>
      </div>
      <n-button text @click="addReminder">
        <template #icon>
          <n-icon :component="Add16Regular" />
        </template>
        {{ t('add-reminder') }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NIcon, NInput, NInputNumber, NSelect, NSwitch, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import Add16Regular from '@vicons/fluent/Add16Regular'
import Delete16Regular from '@vicons/fluent/Delete16Regular'
import type { ReminderUnit } from '../utils/ics'

type ReminderForm = {
  amount: number
  unit: ReminderUnit
  description: string
}

const props = defineProps<{
  remindersEnabled: boolean
  reminders: ReminderForm[]
}>()

const emit = defineEmits<{
  (event: 'update:remindersEnabled', value: boolean): void
  (event: 'update:reminders', value: ReminderForm[]): void
  (event: 'update:defaultReminder', value: string): void
}>()

const { t } = useI18n()

const remindersEnabledModel = computed({
  get: () => props.remindersEnabled,
  set: (value) => emit('update:remindersEnabled', value),
})

const reminderUnitOptions = computed(() => [
  { label: t('minutes'), value: 'minutes' },
  { label: t('hours'), value: 'hours' },
  { label: t('days'), value: 'days' },
  { label: t('weeks'), value: 'weeks' },
])

const updateReminder = (index: number, patch: Partial<ReminderForm>) => {
  const next = props.reminders.map((item, current) =>
    current === index ? { ...item, ...patch } : item,
  )
  emit('update:reminders', next)
}

const addReminder = () => {
  emit('update:reminders', [...props.reminders, { amount: 15, unit: 'minutes', description: '' }])
}

const removeReminder = (index: number) => {
  emit(
    'update:reminders',
    props.reminders.filter((_, current) => current !== index),
  )
}

const reminderDefault = computed(() => t('reminder-default'))

watchEffect(() => {
  emit('update:defaultReminder', reminderDefault.value)
})
</script>

<style scoped>
.reminder-row {
  display: grid;
  grid-template-columns: 120px 160px 1fr auto;
  gap: 8px;
  align-items: center;
}

@media (max-width: 700px) {
  .reminder-row {
    grid-template-columns: 1fr;
  }
}
</style>

<i18n lang="json">
{
  "en": {
    "reminders": "Reminders",
    "enable-reminders": "Enable reminders",
    "reminder-message": "Message",
    "reminder-default": "Reminder",
    "add-reminder": "Add reminder",
    "remove": "Remove",
    "minutes": "Minutes",
    "hours": "Hours",
    "days": "Days",
    "weeks": "Weeks"
  },
  "zh": {
    "reminders": "提醒",
    "enable-reminders": "启用提醒",
    "reminder-message": "提醒内容",
    "reminder-default": "提醒",
    "add-reminder": "添加提醒",
    "remove": "移除",
    "minutes": "分钟",
    "hours": "小时",
    "days": "天",
    "weeks": "周"
  },
  "zh-CN": {
    "reminders": "提醒",
    "enable-reminders": "启用提醒",
    "reminder-message": "提醒内容",
    "reminder-default": "提醒",
    "add-reminder": "添加提醒",
    "remove": "移除",
    "minutes": "分钟",
    "hours": "小时",
    "days": "天",
    "weeks": "周"
  },
  "zh-TW": {
    "reminders": "提醒",
    "enable-reminders": "啟用提醒",
    "reminder-message": "提醒內容",
    "reminder-default": "提醒",
    "add-reminder": "新增提醒",
    "remove": "移除",
    "minutes": "分鐘",
    "hours": "小時",
    "days": "天",
    "weeks": "週"
  },
  "zh-HK": {
    "reminders": "提醒",
    "enable-reminders": "啟用提醒",
    "reminder-message": "提醒內容",
    "reminder-default": "提醒",
    "add-reminder": "新增提醒",
    "remove": "移除",
    "minutes": "分鐘",
    "hours": "小時",
    "days": "天",
    "weeks": "週"
  },
  "es": {
    "reminders": "Recordatorios",
    "enable-reminders": "Habilitar recordatorios",
    "reminder-message": "Mensaje",
    "reminder-default": "Recordatorio",
    "add-reminder": "Añadir recordatorio",
    "remove": "Eliminar",
    "minutes": "Minutos",
    "hours": "Horas",
    "days": "Días",
    "weeks": "Semanas"
  },
  "fr": {
    "reminders": "Rappels",
    "enable-reminders": "Activer les rappels",
    "reminder-message": "Message",
    "reminder-default": "Rappel",
    "add-reminder": "Ajouter un rappel",
    "remove": "Supprimer",
    "minutes": "Minutes",
    "hours": "Heures",
    "days": "Jours",
    "weeks": "Semaines"
  },
  "de": {
    "reminders": "Erinnerungen",
    "enable-reminders": "Erinnerungen aktivieren",
    "reminder-message": "Nachricht",
    "reminder-default": "Erinnerung",
    "add-reminder": "Erinnerung hinzufügen",
    "remove": "Entfernen",
    "minutes": "Minuten",
    "hours": "Stunden",
    "days": "Tage",
    "weeks": "Wochen"
  },
  "it": {
    "reminders": "Promemoria",
    "enable-reminders": "Abilita promemoria",
    "reminder-message": "Messaggio",
    "reminder-default": "Promemoria",
    "add-reminder": "Aggiungi promemoria",
    "remove": "Rimuovi",
    "minutes": "Minuti",
    "hours": "Ore",
    "days": "Giorni",
    "weeks": "Settimane"
  },
  "ja": {
    "reminders": "リマインダー",
    "enable-reminders": "リマインダーを有効化",
    "reminder-message": "メッセージ",
    "reminder-default": "リマインダー",
    "add-reminder": "リマインダーを追加",
    "remove": "削除",
    "minutes": "分",
    "hours": "時間",
    "days": "日",
    "weeks": "週"
  },
  "ko": {
    "reminders": "알림",
    "enable-reminders": "알림 사용",
    "reminder-message": "메시지",
    "reminder-default": "알림",
    "add-reminder": "알림 추가",
    "remove": "삭제",
    "minutes": "분",
    "hours": "시간",
    "days": "일",
    "weeks": "주"
  },
  "ru": {
    "reminders": "Напоминания",
    "enable-reminders": "Включить напоминания",
    "reminder-message": "Сообщение",
    "reminder-default": "Напоминание",
    "add-reminder": "Добавить напоминание",
    "remove": "Удалить",
    "minutes": "Минуты",
    "hours": "Часы",
    "days": "Дни",
    "weeks": "Недели"
  },
  "pt": {
    "reminders": "Lembretes",
    "enable-reminders": "Ativar lembretes",
    "reminder-message": "Mensagem",
    "reminder-default": "Lembrete",
    "add-reminder": "Adicionar lembrete",
    "remove": "Remover",
    "minutes": "Minutos",
    "hours": "Horas",
    "days": "Dias",
    "weeks": "Semanas"
  },
  "ar": {
    "reminders": "التذكيرات",
    "enable-reminders": "تفعيل التذكيرات",
    "reminder-message": "الرسالة",
    "reminder-default": "تذكير",
    "add-reminder": "إضافة تذكير",
    "remove": "إزالة",
    "minutes": "دقائق",
    "hours": "ساعات",
    "days": "أيام",
    "weeks": "أسابيع"
  },
  "hi": {
    "reminders": "रिमाइंडर",
    "enable-reminders": "रिमाइंडर सक्षम करें",
    "reminder-message": "संदेश",
    "reminder-default": "रिमाइंडर",
    "add-reminder": "रिमाइंडर जोड़ें",
    "remove": "हटाएं",
    "minutes": "मिनट",
    "hours": "घंटे",
    "days": "दिन",
    "weeks": "सप्ताह"
  },
  "tr": {
    "reminders": "Hatırlatıcılar",
    "enable-reminders": "Hatırlatıcıları etkinleştir",
    "reminder-message": "Mesaj",
    "reminder-default": "Hatırlatıcı",
    "add-reminder": "Hatırlatıcı ekle",
    "remove": "Kaldır",
    "minutes": "Dakika",
    "hours": "Saat",
    "days": "Gün",
    "weeks": "Hafta"
  },
  "nl": {
    "reminders": "Herinneringen",
    "enable-reminders": "Herinneringen inschakelen",
    "reminder-message": "Bericht",
    "reminder-default": "Herinnering",
    "add-reminder": "Herinnering toevoegen",
    "remove": "Verwijderen",
    "minutes": "Minuten",
    "hours": "Uren",
    "days": "Dagen",
    "weeks": "Weken"
  },
  "sv": {
    "reminders": "Påminnelser",
    "enable-reminders": "Aktivera påminnelser",
    "reminder-message": "Meddelande",
    "reminder-default": "Påminnelse",
    "add-reminder": "Lägg till påminnelse",
    "remove": "Ta bort",
    "minutes": "Minuter",
    "hours": "Timmar",
    "days": "Dagar",
    "weeks": "Veckor"
  },
  "pl": {
    "reminders": "Przypomnienia",
    "enable-reminders": "Włącz przypomnienia",
    "reminder-message": "Wiadomość",
    "reminder-default": "Przypomnienie",
    "add-reminder": "Dodaj przypomnienie",
    "remove": "Usuń",
    "minutes": "Minuty",
    "hours": "Godziny",
    "days": "Dni",
    "weeks": "Tygodnie"
  },
  "vi": {
    "reminders": "Nhắc nhở",
    "enable-reminders": "Bật nhắc nhở",
    "reminder-message": "Tin nhắn",
    "reminder-default": "Nhắc nhở",
    "add-reminder": "Thêm nhắc nhở",
    "remove": "Xóa",
    "minutes": "Phút",
    "hours": "Giờ",
    "days": "Ngày",
    "weeks": "Tuần"
  },
  "th": {
    "reminders": "การเตือน",
    "enable-reminders": "เปิดการเตือน",
    "reminder-message": "ข้อความ",
    "reminder-default": "การเตือน",
    "add-reminder": "เพิ่มการเตือน",
    "remove": "ลบ",
    "minutes": "นาที",
    "hours": "ชั่วโมง",
    "days": "วัน",
    "weeks": "สัปดาห์"
  },
  "id": {
    "reminders": "Pengingat",
    "enable-reminders": "Aktifkan pengingat",
    "reminder-message": "Pesan",
    "reminder-default": "Pengingat",
    "add-reminder": "Tambah pengingat",
    "remove": "Hapus",
    "minutes": "Menit",
    "hours": "Jam",
    "days": "Hari",
    "weeks": "Minggu"
  },
  "he": {
    "reminders": "תזכורות",
    "enable-reminders": "הפעל תזכורות",
    "reminder-message": "הודעה",
    "reminder-default": "תזכורת",
    "add-reminder": "הוסף תזכורת",
    "remove": "הסר",
    "minutes": "דקות",
    "hours": "שעות",
    "days": "ימים",
    "weeks": "שבועות"
  },
  "ms": {
    "reminders": "Peringatan",
    "enable-reminders": "Dayakan peringatan",
    "reminder-message": "Mesej",
    "reminder-default": "Peringatan",
    "add-reminder": "Tambah peringatan",
    "remove": "Buang",
    "minutes": "Minit",
    "hours": "Jam",
    "days": "Hari",
    "weeks": "Minggu"
  },
  "no": {
    "reminders": "Påminnelser",
    "enable-reminders": "Aktiver påminnelser",
    "reminder-message": "Melding",
    "reminder-default": "Påminnelse",
    "add-reminder": "Legg til påminnelse",
    "remove": "Fjern",
    "minutes": "Minutter",
    "hours": "Timer",
    "days": "Dager",
    "weeks": "Uker"
  }
}
</i18n>
