<template>
  <NFlex vertical :size="16">
    <NInput v-model:value="search" :placeholder="t('searchPlaceholder')" clearable>
      <template #prefix>
        <NIcon :component="SearchIcon" />
      </template>
    </NInput>
    <NScrollbar x-scrollable>
      <NRadioGroup v-model:value="category">
        <NRadioButton value="all">{{ t('all') }}</NRadioButton>
        <NRadioButton v-for="cat in colorCategories" :key="cat" :value="cat">
          <span
            :style="{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              borderRadius: '2px',
              backgroundColor: categoryColors[cat],
              marginRight: '4px',
              verticalAlign: 'middle',
              border: cat === 'white' ? '1px solid #ccc' : 'none',
            }"
          />
          <!-- eslint-disable-next-line @intlify/vue-i18n/no-dynamic-keys -->
          {{ t(cat) }}
        </NRadioButton>
      </NRadioGroup>
    </NScrollbar>
  </NFlex>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFlex, NInput, NIcon, NRadioGroup, NRadioButton, NScrollbar } from 'naive-ui'
import SearchIcon from '@vicons/fluent/Search20Regular'
import { colorCategories, categoryColors } from '../data/colorData'

const search = defineModel<string>('search', { required: true })
const category = defineModel<string>('category', { required: true })

const { t } = useI18n()
</script>

<!-- eslint-disable @intlify/vue-i18n/no-unused-keys -->
<i18n lang="json">
{
  "en": {
    "searchPlaceholder": "Search by color name or HEX value...",
    "all": "All",
    "red": "Red",
    "orange": "Orange",
    "yellow": "Yellow",
    "green": "Green",
    "cyan": "Cyan",
    "blue": "Blue",
    "purple": "Purple",
    "pink": "Pink",
    "brown": "Brown",
    "gray": "Gray",
    "white": "White"
  },
  "zh": {
    "searchPlaceholder": "按颜色名称或十六进制值搜索...",
    "all": "全部",
    "red": "红色",
    "orange": "橙色",
    "yellow": "黄色",
    "green": "绿色",
    "cyan": "青色",
    "blue": "蓝色",
    "purple": "紫色",
    "pink": "粉色",
    "brown": "棕色",
    "gray": "灰色",
    "white": "白色"
  },
  "zh-CN": {
    "searchPlaceholder": "按颜色名称或十六进制值搜索...",
    "all": "全部",
    "red": "红色",
    "orange": "橙色",
    "yellow": "黄色",
    "green": "绿色",
    "cyan": "青色",
    "blue": "蓝色",
    "purple": "紫色",
    "pink": "粉色",
    "brown": "棕色",
    "gray": "灰色",
    "white": "白色"
  },
  "zh-TW": {
    "searchPlaceholder": "按顏色名稱或十六進位值搜尋...",
    "all": "全部",
    "red": "紅色",
    "orange": "橙色",
    "yellow": "黃色",
    "green": "綠色",
    "cyan": "青色",
    "blue": "藍色",
    "purple": "紫色",
    "pink": "粉色",
    "brown": "棕色",
    "gray": "灰色",
    "white": "白色"
  },
  "zh-HK": {
    "searchPlaceholder": "按顏色名稱或十六進位值搜尋...",
    "all": "全部",
    "red": "紅色",
    "orange": "橙色",
    "yellow": "黃色",
    "green": "綠色",
    "cyan": "青色",
    "blue": "藍色",
    "purple": "紫色",
    "pink": "粉色",
    "brown": "棕色",
    "gray": "灰色",
    "white": "白色"
  },
  "es": {
    "searchPlaceholder": "Buscar por nombre de color o valor HEX...",
    "all": "Todos",
    "red": "Rojo",
    "orange": "Naranja",
    "yellow": "Amarillo",
    "green": "Verde",
    "cyan": "Cian",
    "blue": "Azul",
    "purple": "Púrpura",
    "pink": "Rosa",
    "brown": "Marrón",
    "gray": "Gris",
    "white": "Blanco"
  },
  "fr": {
    "searchPlaceholder": "Rechercher par nom de couleur ou valeur HEX...",
    "all": "Tous",
    "red": "Rouge",
    "orange": "Orange",
    "yellow": "Jaune",
    "green": "Vert",
    "cyan": "Cyan",
    "blue": "Bleu",
    "purple": "Violet",
    "pink": "Rose",
    "brown": "Marron",
    "gray": "Gris",
    "white": "Blanc"
  },
  "de": {
    "searchPlaceholder": "Nach Farbnamen oder HEX-Wert suchen...",
    "all": "Alle",
    "red": "Rot",
    "orange": "Orange",
    "yellow": "Gelb",
    "green": "Grün",
    "cyan": "Cyan",
    "blue": "Blau",
    "purple": "Lila",
    "pink": "Rosa",
    "brown": "Braun",
    "gray": "Grau",
    "white": "Weiß"
  },
  "it": {
    "searchPlaceholder": "Cerca per nome colore o valore HEX...",
    "all": "Tutti",
    "red": "Rosso",
    "orange": "Arancione",
    "yellow": "Giallo",
    "green": "Verde",
    "cyan": "Ciano",
    "blue": "Blu",
    "purple": "Viola",
    "pink": "Rosa",
    "brown": "Marrone",
    "gray": "Grigio",
    "white": "Bianco"
  },
  "ja": {
    "searchPlaceholder": "色名またはHEX値で検索...",
    "all": "すべて",
    "red": "赤",
    "orange": "オレンジ",
    "yellow": "黄色",
    "green": "緑",
    "cyan": "シアン",
    "blue": "青",
    "purple": "紫",
    "pink": "ピンク",
    "brown": "茶色",
    "gray": "グレー",
    "white": "白"
  },
  "ko": {
    "searchPlaceholder": "색상 이름 또는 HEX 값으로 검색...",
    "all": "전체",
    "red": "빨간색",
    "orange": "주황색",
    "yellow": "노란색",
    "green": "초록색",
    "cyan": "시안",
    "blue": "파란색",
    "purple": "보라색",
    "pink": "분홍색",
    "brown": "갈색",
    "gray": "회색",
    "white": "흰색"
  },
  "ru": {
    "searchPlaceholder": "Поиск по названию цвета или значению HEX...",
    "all": "Все",
    "red": "Красный",
    "orange": "Оранжевый",
    "yellow": "Жёлтый",
    "green": "Зелёный",
    "cyan": "Циан",
    "blue": "Синий",
    "purple": "Фиолетовый",
    "pink": "Розовый",
    "brown": "Коричневый",
    "gray": "Серый",
    "white": "Белый"
  },
  "pt": {
    "searchPlaceholder": "Pesquisar por nome da cor ou valor HEX...",
    "all": "Todos",
    "red": "Vermelho",
    "orange": "Laranja",
    "yellow": "Amarelo",
    "green": "Verde",
    "cyan": "Ciano",
    "blue": "Azul",
    "purple": "Roxo",
    "pink": "Rosa",
    "brown": "Marrom",
    "gray": "Cinza",
    "white": "Branco"
  },
  "ar": {
    "searchPlaceholder": "ابحث باسم اللون أو قيمة HEX...",
    "all": "الكل",
    "red": "أحمر",
    "orange": "برتقالي",
    "yellow": "أصفر",
    "green": "أخضر",
    "cyan": "سماوي",
    "blue": "أزرق",
    "purple": "أرجواني",
    "pink": "وردي",
    "brown": "بني",
    "gray": "رمادي",
    "white": "أبيض"
  },
  "hi": {
    "searchPlaceholder": "रंग नाम या HEX मान से खोजें...",
    "all": "सभी",
    "red": "लाल",
    "orange": "नारंगी",
    "yellow": "पीला",
    "green": "हरा",
    "cyan": "सियान",
    "blue": "नीला",
    "purple": "बैंगनी",
    "pink": "गुलाबी",
    "brown": "भूरा",
    "gray": "धूसर",
    "white": "सफ़ेद"
  },
  "tr": {
    "searchPlaceholder": "Renk adına veya HEX değerine göre ara...",
    "all": "Tümü",
    "red": "Kırmızı",
    "orange": "Turuncu",
    "yellow": "Sarı",
    "green": "Yeşil",
    "cyan": "Camgöbeği",
    "blue": "Mavi",
    "purple": "Mor",
    "pink": "Pembe",
    "brown": "Kahverengi",
    "gray": "Gri",
    "white": "Beyaz"
  },
  "nl": {
    "searchPlaceholder": "Zoek op kleurnaam of HEX-waarde...",
    "all": "Alle",
    "red": "Rood",
    "orange": "Oranje",
    "yellow": "Geel",
    "green": "Groen",
    "cyan": "Cyaan",
    "blue": "Blauw",
    "purple": "Paars",
    "pink": "Roze",
    "brown": "Bruin",
    "gray": "Grijs",
    "white": "Wit"
  },
  "sv": {
    "searchPlaceholder": "Sök efter färgnamn eller HEX-värde...",
    "all": "Alla",
    "red": "Röd",
    "orange": "Orange",
    "yellow": "Gul",
    "green": "Grön",
    "cyan": "Cyan",
    "blue": "Blå",
    "purple": "Lila",
    "pink": "Rosa",
    "brown": "Brun",
    "gray": "Grå",
    "white": "Vit"
  },
  "pl": {
    "searchPlaceholder": "Szukaj po nazwie koloru lub wartości HEX...",
    "all": "Wszystkie",
    "red": "Czerwony",
    "orange": "Pomarańczowy",
    "yellow": "Żółty",
    "green": "Zielony",
    "cyan": "Cyjan",
    "blue": "Niebieski",
    "purple": "Fioletowy",
    "pink": "Różowy",
    "brown": "Brązowy",
    "gray": "Szary",
    "white": "Biały"
  },
  "vi": {
    "searchPlaceholder": "Tìm theo tên màu hoặc giá trị HEX...",
    "all": "Tất cả",
    "red": "Đỏ",
    "orange": "Cam",
    "yellow": "Vàng",
    "green": "Xanh lá",
    "cyan": "Lục lam",
    "blue": "Xanh dương",
    "purple": "Tím",
    "pink": "Hồng",
    "brown": "Nâu",
    "gray": "Xám",
    "white": "Trắng"
  },
  "th": {
    "searchPlaceholder": "ค้นหาตามชื่อสีหรือค่า HEX...",
    "all": "ทั้งหมด",
    "red": "แดง",
    "orange": "ส้ม",
    "yellow": "เหลือง",
    "green": "เขียว",
    "cyan": "ไซแอน",
    "blue": "น้ำเงิน",
    "purple": "ม่วง",
    "pink": "ชมพู",
    "brown": "น้ำตาล",
    "gray": "เทา",
    "white": "ขาว"
  },
  "id": {
    "searchPlaceholder": "Cari berdasarkan nama warna atau nilai HEX...",
    "all": "Semua",
    "red": "Merah",
    "orange": "Oranye",
    "yellow": "Kuning",
    "green": "Hijau",
    "cyan": "Sian",
    "blue": "Biru",
    "purple": "Ungu",
    "pink": "Merah muda",
    "brown": "Cokelat",
    "gray": "Abu-abu",
    "white": "Putih"
  },
  "he": {
    "searchPlaceholder": "חפש לפי שם צבע או ערך HEX...",
    "all": "הכל",
    "red": "אדום",
    "orange": "כתום",
    "yellow": "צהוב",
    "green": "ירוק",
    "cyan": "ציאן",
    "blue": "כחול",
    "purple": "סגול",
    "pink": "ורוד",
    "brown": "חום",
    "gray": "אפור",
    "white": "לבן"
  },
  "ms": {
    "searchPlaceholder": "Cari mengikut nama warna atau nilai HEX...",
    "all": "Semua",
    "red": "Merah",
    "orange": "Jingga",
    "yellow": "Kuning",
    "green": "Hijau",
    "cyan": "Sian",
    "blue": "Biru",
    "purple": "Ungu",
    "pink": "Merah jambu",
    "brown": "Coklat",
    "gray": "Kelabu",
    "white": "Putih"
  },
  "no": {
    "searchPlaceholder": "Søk etter fargenavn eller HEX-verdi...",
    "all": "Alle",
    "red": "Rød",
    "orange": "Oransje",
    "yellow": "Gul",
    "green": "Grønn",
    "cyan": "Cyan",
    "blue": "Blå",
    "purple": "Lilla",
    "pink": "Rosa",
    "brown": "Brun",
    "gray": "Grå",
    "white": "Hvit"
  }
}
</i18n>
<!-- eslint-enable @intlify/vue-i18n/no-unused-keys -->
