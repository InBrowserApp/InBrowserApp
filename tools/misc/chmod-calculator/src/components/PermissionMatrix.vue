<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-table :bordered="false" :single-line="false" size="small">
      <thead>
        <tr>
          <th></th>
          <th style="text-align: center">
            {{ t('read') }}
            <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
            <span>(r)</span>
          </th>
          <th style="text-align: center">
            {{ t('write') }}
            <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
            <span>(w)</span>
          </th>
          <th style="text-align: center">
            {{ t('execute') }}
            <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
            <span>(x)</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>{{ t('owner') }}</strong>
          </td>
          <td style="text-align: center">
            <n-checkbox
              :checked="permissions.owner.read"
              @update:checked="update('owner', 'read', $event)"
            />
          </td>
          <td style="text-align: center">
            <n-checkbox
              :checked="permissions.owner.write"
              @update:checked="update('owner', 'write', $event)"
            />
          </td>
          <td style="text-align: center">
            <n-checkbox
              :checked="permissions.owner.execute"
              @update:checked="update('owner', 'execute', $event)"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>{{ t('group') }}</strong>
          </td>
          <td style="text-align: center">
            <n-checkbox
              :checked="permissions.group.read"
              @update:checked="update('group', 'read', $event)"
            />
          </td>
          <td style="text-align: center">
            <n-checkbox
              :checked="permissions.group.write"
              @update:checked="update('group', 'write', $event)"
            />
          </td>
          <td style="text-align: center">
            <n-checkbox
              :checked="permissions.group.execute"
              @update:checked="update('group', 'execute', $event)"
            />
          </td>
        </tr>
        <tr>
          <td>
            <strong>{{ t('others') }}</strong>
          </td>
          <td style="text-align: center">
            <n-checkbox
              :checked="permissions.others.read"
              @update:checked="update('others', 'read', $event)"
            />
          </td>
          <td style="text-align: center">
            <n-checkbox
              :checked="permissions.others.write"
              @update:checked="update('others', 'write', $event)"
            />
          </td>
          <td style="text-align: center">
            <n-checkbox
              :checked="permissions.others.execute"
              @update:checked="update('others', 'execute', $event)"
            />
          </td>
        </tr>
      </tbody>
    </n-table>
  </ToolSection>
</template>

<script setup lang="ts">
import { NCheckbox, NTable } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import type { Permissions } from '../composables/useChmodState'

defineProps<{
  permissions: Permissions
}>()

const emit = defineEmits<{
  update: [role: 'owner' | 'group' | 'others', perm: 'read' | 'write' | 'execute', value: boolean]
}>()

const { t } = useI18n()

function update(
  role: 'owner' | 'group' | 'others',
  perm: 'read' | 'write' | 'execute',
  value: boolean,
) {
  emit('update', role, perm, value)
}
</script>

<i18n lang="json">
{
  "en": {
    "title": "Permission Matrix",
    "read": "Read",
    "write": "Write",
    "execute": "Execute",
    "owner": "Owner",
    "group": "Group",
    "others": "Others"
  },
  "zh": {
    "title": "权限矩阵",
    "read": "读取",
    "write": "写入",
    "execute": "执行",
    "owner": "所有者",
    "group": "用户组",
    "others": "其他用户"
  },
  "zh-CN": {
    "title": "权限矩阵",
    "read": "读取",
    "write": "写入",
    "execute": "执行",
    "owner": "所有者",
    "group": "用户组",
    "others": "其他用户"
  },
  "zh-TW": {
    "title": "權限矩陣",
    "read": "讀取",
    "write": "寫入",
    "execute": "執行",
    "owner": "擁有者",
    "group": "群組",
    "others": "其他使用者"
  },
  "zh-HK": {
    "title": "權限矩陣",
    "read": "讀取",
    "write": "寫入",
    "execute": "執行",
    "owner": "擁有者",
    "group": "群組",
    "others": "其他使用者"
  },
  "es": {
    "title": "Matriz de permisos",
    "read": "Lectura",
    "write": "Escritura",
    "execute": "Ejecución",
    "owner": "Propietario",
    "group": "Grupo",
    "others": "Otros"
  },
  "fr": {
    "title": "Matrice des permissions",
    "read": "Lecture",
    "write": "Écriture",
    "execute": "Exécution",
    "owner": "Propriétaire",
    "group": "Groupe",
    "others": "Autres"
  },
  "de": {
    "title": "Berechtigungsmatrix",
    "read": "Lesen",
    "write": "Schreiben",
    "execute": "Ausführen",
    "owner": "Eigentümer",
    "group": "Gruppe",
    "others": "Andere"
  },
  "it": {
    "title": "Matrice dei permessi",
    "read": "Lettura",
    "write": "Scrittura",
    "execute": "Esecuzione",
    "owner": "Proprietario",
    "group": "Gruppo",
    "others": "Altri"
  },
  "ja": {
    "title": "パーミッションマトリックス",
    "read": "読み取り",
    "write": "書き込み",
    "execute": "実行",
    "owner": "所有者",
    "group": "グループ",
    "others": "その他"
  },
  "ko": {
    "title": "권한 매트릭스",
    "read": "읽기",
    "write": "쓰기",
    "execute": "실행",
    "owner": "소유자",
    "group": "그룹",
    "others": "기타"
  },
  "ru": {
    "title": "Матрица разрешений",
    "read": "Чтение",
    "write": "Запись",
    "execute": "Выполнение",
    "owner": "Владелец",
    "group": "Группа",
    "others": "Другие"
  },
  "pt": {
    "title": "Matriz de permissões",
    "read": "Leitura",
    "write": "Escrita",
    "execute": "Execução",
    "owner": "Proprietário",
    "group": "Grupo",
    "others": "Outros"
  },
  "ar": {
    "title": "مصفوفة الأذونات",
    "read": "قراءة",
    "write": "كتابة",
    "execute": "تنفيذ",
    "owner": "المالك",
    "group": "المجموعة",
    "others": "الآخرون"
  },
  "hi": {
    "title": "अनुमति मैट्रिक्स",
    "read": "पढ़ें",
    "write": "लिखें",
    "execute": "निष्पादित करें",
    "owner": "स्वामी",
    "group": "समूह",
    "others": "अन्य"
  },
  "tr": {
    "title": "İzin Matrisi",
    "read": "Okuma",
    "write": "Yazma",
    "execute": "Çalıştırma",
    "owner": "Sahip",
    "group": "Grup",
    "others": "Diğerleri"
  },
  "nl": {
    "title": "Machtigingsmatrix",
    "read": "Lezen",
    "write": "Schrijven",
    "execute": "Uitvoeren",
    "owner": "Eigenaar",
    "group": "Groep",
    "others": "Anderen"
  },
  "sv": {
    "title": "Behörighetsmatris",
    "read": "Läsa",
    "write": "Skriva",
    "execute": "Köra",
    "owner": "Ägare",
    "group": "Grupp",
    "others": "Andra"
  },
  "pl": {
    "title": "Macierz uprawnień",
    "read": "Odczyt",
    "write": "Zapis",
    "execute": "Wykonanie",
    "owner": "Właściciel",
    "group": "Grupa",
    "others": "Inni"
  },
  "vi": {
    "title": "Ma trận quyền",
    "read": "Đọc",
    "write": "Ghi",
    "execute": "Thực thi",
    "owner": "Chủ sở hữu",
    "group": "Nhóm",
    "others": "Người khác"
  },
  "th": {
    "title": "ตารางสิทธิ์",
    "read": "อ่าน",
    "write": "เขียน",
    "execute": "รัน",
    "owner": "เจ้าของ",
    "group": "กลุ่ม",
    "others": "ผู้อื่น"
  },
  "id": {
    "title": "Matriks Izin",
    "read": "Baca",
    "write": "Tulis",
    "execute": "Eksekusi",
    "owner": "Pemilik",
    "group": "Grup",
    "others": "Lainnya"
  },
  "he": {
    "title": "מטריצת הרשאות",
    "read": "קריאה",
    "write": "כתיבה",
    "execute": "הרצה",
    "owner": "בעלים",
    "group": "קבוצה",
    "others": "אחרים"
  },
  "ms": {
    "title": "Matriks Kebenaran",
    "read": "Baca",
    "write": "Tulis",
    "execute": "Laksana",
    "owner": "Pemilik",
    "group": "Kumpulan",
    "others": "Lain-lain"
  },
  "no": {
    "title": "Tillatelsesmatrise",
    "read": "Les",
    "write": "Skriv",
    "execute": "Kjør",
    "owner": "Eier",
    "group": "Gruppe",
    "others": "Andre"
  }
}
</i18n>
