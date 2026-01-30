<template>
  <n-form :model="model">
    <n-dynamic-input
      v-model:value="model.cidrs"
      item-style="margin-bottom: 0;"
      :placeholder="t('placeholder')"
      :on-create="onCreate"
    >
      <template #create-button-default>{{ t('addCidr') }}</template>
      <template #default="{ index }">
        <n-form-item
          ignore-path-change
          :rule="rule"
          :path="`cidrs[${index}]`"
          :show-label="false"
          style="width: 100%"
        >
          <n-input v-model:value="model.cidrs[index]" :placeholder="t('placeholder')" />
        </n-form-item>
      </template>
    </n-dynamic-input>
  </n-form>
</template>

<script setup lang="ts">
import { NForm, NDynamicInput, NInput, NFormItem, type FormItemRule } from 'naive-ui'
import { ref } from 'vue'
import isCidr from 'is-cidr'
import { watchDeep } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  'update:cidrs': [string[] | undefined]
}>()

const { t } = useI18n()

const model = ref({
  cidrs: [],
})

const rule: FormItemRule = {
  trigger: ['input', 'change', 'blur'],
  validator(rule: unknown, value: string) {
    if (isCidr(value) === 0) {
      return new Error(t('invalidCidr'))
    }
  },
}

const onCreate = () => {
  return ''
}

watchDeep(model, () => {
  const cidrs = model.value.cidrs
  // all cidrs are valid
  if (cidrs.every((cidr) => isCidr(cidr) !== 0)) {
    emit('update:cidrs', cidrs)
    return
  } else {
    emit('update:cidrs', undefined)
    return
  }
})
</script>

<i18n lang="json">
{
  "en": {
    "placeholder": "10.0.0.0/24 or 2001:db8::/32",
    "invalidCidr": "Invalid CIDR",
    "addCidr": "Add CIDR"
  },
  "zh": {
    "placeholder": "10.0.0.0/24 或 2001:db8::/32",
    "invalidCidr": "无效的 CIDR",
    "addCidr": "添加 CIDR"
  },
  "zh-CN": {
    "placeholder": "10.0.0.0/24 或 2001:db8::/32",
    "invalidCidr": "无效的 CIDR",
    "addCidr": "添加 CIDR"
  },
  "zh-TW": {
    "placeholder": "10.0.0.0/24 或 2001:db8::/32",
    "invalidCidr": "無效的 CIDR",
    "addCidr": "新增 CIDR"
  },
  "zh-HK": {
    "placeholder": "10.0.0.0/24 或 2001:db8::/32",
    "invalidCidr": "無效的 CIDR",
    "addCidr": "新增 CIDR"
  },
  "es": {
    "placeholder": "10.0.0.0/24 o 2001:db8::/32",
    "invalidCidr": "CIDR inválido",
    "addCidr": "Agregar CIDR"
  },
  "fr": {
    "placeholder": "10.0.0.0/24 ou 2001:db8::/32",
    "invalidCidr": "CIDR invalide",
    "addCidr": "Ajouter CIDR"
  },
  "de": {
    "placeholder": "10.0.0.0/24 oder 2001:db8::/32",
    "invalidCidr": "Ungültiger CIDR",
    "addCidr": "CIDR hinzufügen"
  },
  "it": {
    "placeholder": "10.0.0.0/24 o 2001:db8::/32",
    "invalidCidr": "CIDR non valido",
    "addCidr": "Aggiungi CIDR"
  },
  "ja": {
    "placeholder": "10.0.0.0/24 または 2001:db8::/32",
    "invalidCidr": "無効な CIDR",
    "addCidr": "CIDR を追加"
  },
  "ko": {
    "placeholder": "10.0.0.0/24 또는 2001:db8::/32",
    "invalidCidr": "유효하지 않은 CIDR",
    "addCidr": "CIDR 추가"
  },
  "ru": {
    "placeholder": "10.0.0.0/24 или 2001:db8::/32",
    "invalidCidr": "Недействительный CIDR",
    "addCidr": "Добавить CIDR"
  },
  "pt": {
    "placeholder": "10.0.0.0/24 ou 2001:db8::/32",
    "invalidCidr": "CIDR inválido",
    "addCidr": "Adicionar CIDR"
  },
  "ar": {
    "placeholder": "10.0.0.0/24 أو 2001:db8::/32",
    "invalidCidr": "CIDR غير صالح",
    "addCidr": "إضافة CIDR"
  },
  "hi": {
    "placeholder": "10.0.0.0/24 या 2001:db8::/32",
    "invalidCidr": "अमान्य CIDR",
    "addCidr": "CIDR जोड़ें"
  },
  "tr": {
    "placeholder": "10.0.0.0/24 veya 2001:db8::/32",
    "invalidCidr": "Geçersiz CIDR",
    "addCidr": "CIDR Ekle"
  },
  "nl": {
    "placeholder": "10.0.0.0/24 of 2001:db8::/32",
    "invalidCidr": "Ongeldige CIDR",
    "addCidr": "CIDR toevoegen"
  },
  "sv": {
    "placeholder": "10.0.0.0/24 eller 2001:db8::/32",
    "invalidCidr": "Ogiltigt CIDR",
    "addCidr": "Lägg till CIDR"
  },
  "pl": {
    "placeholder": "10.0.0.0/24 lub 2001:db8::/32",
    "invalidCidr": "Nieprawidłowy CIDR",
    "addCidr": "Dodaj CIDR"
  },
  "vi": {
    "placeholder": "10.0.0.0/24 hoặc 2001:db8::/32",
    "invalidCidr": "CIDR không hợp lệ",
    "addCidr": "Thêm CIDR"
  },
  "th": {
    "placeholder": "10.0.0.0/24 หรือ 2001:db8::/32",
    "invalidCidr": "CIDR ไม่ถูกต้อง",
    "addCidr": "เพิ่ม CIDR"
  },
  "id": {
    "placeholder": "10.0.0.0/24 atau 2001:db8::/32",
    "invalidCidr": "CIDR tidak valid",
    "addCidr": "Tambah CIDR"
  },
  "he": {
    "placeholder": "10.0.0.0/24 או 2001:db8::/32",
    "invalidCidr": "CIDR לא תקף",
    "addCidr": "הוסף CIDR"
  },
  "ms": {
    "placeholder": "10.0.0.0/24 atau 2001:db8::/32",
    "invalidCidr": "CIDR tidak sah",
    "addCidr": "Tambah CIDR"
  },
  "no": {
    "placeholder": "10.0.0.0/24 eller 2001:db8::/32",
    "invalidCidr": "Ugyldig CIDR",
    "addCidr": "Legg til CIDR"
  }
}
</i18n>
