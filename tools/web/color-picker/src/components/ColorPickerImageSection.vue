<template>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-flex align="center" justify="space-between" :wrap="true" class="section-row">
        <div class="section-copy">
          <div class="section-title">{{ t('imageTitle') }}</div>
          <div class="section-subtitle">{{ t('imageDescription') }}</div>
        </div>
        <div class="image-actions">
          <input
            ref="fileInputEl"
            class="file-input"
            type="file"
            accept="image/*,image/svg+xml"
            @change="onFileChange"
          />
          <n-button type="primary" @click="onImagePick">
            <template #icon>
              <n-icon>
                <ImagePickIcon />
              </n-icon>
            </template>
            {{ t('imageButton') }}
          </n-button>
        </div>
      </n-flex>
      <n-alert v-if="imageError" type="error" :show-icon="false">
        {{ imageError }}
      </n-alert>
      <div v-if="hasImage" ref="canvasWrapperEl" class="canvas-wrapper">
        <div class="canvas-hint">{{ t('imageHint') }}</div>
        <canvas ref="canvasEl" class="image-canvas" :style="canvasStyle" @click="onCanvasClick" />
      </div>
    </n-flex>
  </ToolSection>

  <Teleport to="body">
    <div class="drop-overlay" :class="{ 'drop-overlay--active': dropOverlayActive }">
      <div class="drop-panel">
        <n-icon size="48" :depth="1">
          <ImagePickIcon />
        </n-icon>
        <div class="drop-title">{{ t('imageTitle') }}</div>
        <div class="drop-subtitle">{{ t('uploadHint') }}</div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { NAlert, NButton, NFlex, NIcon } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import ImagePickIcon from '@vicons/fluent/TabDesktopImage16Regular'
import { ToolSection } from '@shared/ui/tool'

const { t } = useI18n()

defineProps<{
  imageError: string | null
  hasImage: boolean
  canvasStyle: CSSProperties
  dropOverlayActive: boolean
}>()

const emit = defineEmits<{
  (event: 'pick-image'): void
  (event: 'file-change', value: Event): void
  (event: 'canvas-click', value: MouseEvent): void
  (event: 'file-input-ready', value: HTMLInputElement | null): void
  (event: 'canvas-ready', value: HTMLCanvasElement | null): void
  (event: 'wrapper-ready', value: HTMLDivElement | null): void
}>()

const fileInputEl = ref<HTMLInputElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)
const canvasWrapperEl = ref<HTMLDivElement | null>(null)

watch(
  fileInputEl,
  (value) => {
    emit('file-input-ready', value)
  },
  { immediate: true },
)

watch(
  canvasEl,
  (value) => {
    emit('canvas-ready', value)
  },
  { immediate: true },
)

watch(
  canvasWrapperEl,
  (value) => {
    emit('wrapper-ready', value)
  },
  { immediate: true },
)

function onImagePick() {
  emit('pick-image')
}

function onFileChange(event: Event) {
  emit('file-change', event)
}

function onCanvasClick(event: MouseEvent) {
  emit('canvas-click', event)
}
</script>

<style scoped>
.section-row {
  gap: 16px;
}

.section-copy {
  max-width: 520px;
}

.section-title {
  font-weight: 600;
  font-size: 16px;
}

.section-subtitle {
  font-size: 13px;
  color: var(--n-text-color-3);
}

.image-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-input {
  display: none;
}

.canvas-wrapper {
  margin-top: 8px;
}

.canvas-hint {
  margin-bottom: 8px;
  font-size: 13px;
  color: var(--n-text-color-3);
}

.image-canvas {
  display: block;
  border-radius: 10px;
  border: 1px solid var(--n-border-color);
  cursor: crosshair;
  max-width: 100%;
}

.drop-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  background:
    radial-gradient(circle at top, rgba(248, 250, 252, 0.35), rgba(248, 250, 252, 0) 55%),
    linear-gradient(135deg, rgba(15, 23, 42, 0.35), rgba(148, 163, 184, 0.25));
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease;
}

.drop-overlay--active {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.drop-panel {
  width: min(420px, 100%);
  padding: 24px 28px;
  text-align: center;
  border-radius: 18px;
  border: 1px dashed var(--n-border-color);
  background: var(--n-color);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.28);
}

.drop-title {
  margin-top: 12px;
  font-weight: 600;
  font-size: 18px;
}

.drop-subtitle {
  margin-top: 6px;
  font-size: 14px;
  color: var(--n-text-color-3);
}
</style>

<i18n lang="json">
{
  "en": {
    "imageTitle": "Image Color Picker",
    "imageDescription": "Upload an image and click to sample a pixel. You can also drag a file to upload.",
    "imageButton": "Select Image",
    "imageHint": "Click the image to pick a color.",
    "uploadHint": "Click or drag image to upload"
  },
  "zh": {
    "imageTitle": "图片取色",
    "imageDescription": "上传图片并点击以采样像素。也可拖拽文件上传。",
    "imageButton": "选择图片",
    "imageHint": "点击图片取色。",
    "uploadHint": "点击或拖拽图片上传"
  },
  "zh-CN": {
    "imageTitle": "图片取色",
    "imageDescription": "上传图片并点击以采样像素。也可拖拽文件上传。",
    "imageButton": "选择图片",
    "imageHint": "点击图片取色。",
    "uploadHint": "点击或拖拽图片上传"
  },
  "zh-TW": {
    "imageTitle": "圖片取色",
    "imageDescription": "上傳圖片並點擊以取樣像素。也可拖曳檔案上傳。",
    "imageButton": "選擇圖片",
    "imageHint": "點擊圖片取色。",
    "uploadHint": "點擊或拖曳圖片上傳"
  },
  "zh-HK": {
    "imageTitle": "圖片取色",
    "imageDescription": "上傳圖片並點擊以取樣像素。也可拖曳檔案上傳。",
    "imageButton": "選擇圖片",
    "imageHint": "點擊圖片取色。",
    "uploadHint": "點擊或拖曳圖片上傳"
  },
  "es": {
    "imageTitle": "Selector de color de imagen",
    "imageDescription": "Sube una imagen y haz clic para muestrear un píxel. También puedes arrastrar un archivo para cargar.",
    "imageButton": "Seleccionar imagen",
    "imageHint": "Haz clic en la imagen para tomar un color.",
    "uploadHint": "Haga clic o arrastre la imagen para cargar"
  },
  "fr": {
    "imageTitle": "Pipette de couleur d’image",
    "imageDescription": "Téléchargez une image et cliquez pour échantillonner un pixel. Vous pouvez aussi glisser un fichier pour le téléverser.",
    "imageButton": "Sélectionner une image",
    "imageHint": "Cliquez sur l’image pour choisir une couleur.",
    "uploadHint": "Cliquez ou déposez l'image pour télécharger"
  },
  "de": {
    "imageTitle": "Bild-Farbpipette",
    "imageDescription": "Laden Sie ein Bild hoch und klicken Sie, um ein Pixel zu sampeln. Sie können eine Datei auch per Drag-and-drop hochladen.",
    "imageButton": "Bild auswählen",
    "imageHint": "Klicken Sie auf das Bild, um eine Farbe zu wählen.",
    "uploadHint": "Klicken oder Bild hierher ziehen"
  },
  "it": {
    "imageTitle": "Contagocce immagine",
    "imageDescription": "Carica un'immagine e fai clic per campionare un pixel. Puoi anche trascinare un file per caricarlo.",
    "imageButton": "Seleziona immagine",
    "imageHint": "Fai clic sull'immagine per scegliere un colore.",
    "uploadHint": "Clicca o trascina l'immagine per caricarla"
  },
  "ja": {
    "imageTitle": "画像カラーピッカー",
    "imageDescription": "画像をアップロードしてクリックし、ピクセルをサンプルします。ファイルをドラッグしてアップロードすることもできます。",
    "imageButton": "画像を選択",
    "imageHint": "画像をクリックして色を取得します。",
    "uploadHint": "クリックまたは画像をドラッグしてアップロード"
  },
  "ko": {
    "imageTitle": "이미지 색상 선택기",
    "imageDescription": "이미지를 업로드하고 클릭해 픽셀을 샘플링하세요. 파일을 끌어다 놓아 업로드할 수도 있습니다.",
    "imageButton": "이미지 선택",
    "imageHint": "이미지를 클릭해 색상을 선택하세요.",
    "uploadHint": "클릭하거나 이미지를 드래그하여 업로드"
  },
  "ru": {
    "imageTitle": "Пипетка изображения",
    "imageDescription": "Загрузите изображение и щёлкните, чтобы выбрать пиксель. Также можно перетащить файл для загрузки.",
    "imageButton": "Выбрать изображение",
    "imageHint": "Нажмите на изображение, чтобы выбрать цвет.",
    "uploadHint": "Нажмите или перетащите изображение для загрузки"
  },
  "pt": {
    "imageTitle": "Seletor de cor da imagem",
    "imageDescription": "Envie uma imagem e clique para amostrar um pixel. Você também pode arrastar um arquivo para enviar.",
    "imageButton": "Selecionar imagem",
    "imageHint": "Clique na imagem para escolher uma cor.",
    "uploadHint": "Clique ou arraste a imagem para fazer upload"
  },
  "ar": {
    "imageTitle": "منتقي ألوان الصورة",
    "imageDescription": "ارفع صورة وانقر لأخذ عيّنة بكسل. يمكنك أيضًا سحب ملف للتحميل.",
    "imageButton": "اختر صورة",
    "imageHint": "انقر على الصورة لالتقاط لون.",
    "uploadHint": "انقر أو اسحب الصورة للتحميل"
  },
  "hi": {
    "imageTitle": "इमेज कलर पिकर",
    "imageDescription": "छवि अपलोड करें और पिक्सेल सैंपल करने के लिए क्लिक करें। आप अपलोड के लिए फ़ाइल खींच भी सकते हैं।",
    "imageButton": "चित्र चुनें",
    "imageHint": "रंग चुनने के लिए छवि पर क्लिक करें।",
    "uploadHint": "अपलोड करने के लिए क्लिक करें या छवि खींचें"
  },
  "tr": {
    "imageTitle": "Görsel Renk Seçici",
    "imageDescription": "Bir görsel yükleyin ve bir pikseli örneklemek için tıklayın. Dosya sürükleyerek de yükleyebilirsiniz.",
    "imageButton": "Görsel seç",
    "imageHint": "Renk seçmek için görsele tıklayın.",
    "uploadHint": "Yüklemek için tıklayın veya görüntüyü sürükleyin"
  },
  "nl": {
    "imageTitle": "Afbeeldingskleurpipet",
    "imageDescription": "Upload een afbeelding en klik om een pixel te samplen. Je kunt ook een bestand slepen om te uploaden.",
    "imageButton": "Afbeelding kiezen",
    "imageHint": "Klik op de afbeelding om een kleur te kiezen.",
    "uploadHint": "Klik of sleep afbeelding om te uploaden"
  },
  "sv": {
    "imageTitle": "Bildfärgväljare",
    "imageDescription": "Ladda upp en bild och klicka för att sampla en pixel. Du kan också dra en fil för att ladda upp.",
    "imageButton": "Välj bild",
    "imageHint": "Klicka på bilden för att välja en färg.",
    "uploadHint": "Klicka eller dra bild för att ladda upp"
  },
  "pl": {
    "imageTitle": "Pipeta obrazu",
    "imageDescription": "Prześlij obraz i kliknij, aby pobrać piksel. Możesz też przeciągnąć plik, aby przesłać.",
    "imageButton": "Wybierz obraz",
    "imageHint": "Kliknij obraz, aby wybrać kolor.",
    "uploadHint": "Kliknij lub przeciągnij obraz, aby przesłać"
  },
  "vi": {
    "imageTitle": "Bộ chọn màu từ ảnh",
    "imageDescription": "Tải ảnh lên và nhấp để lấy mẫu pixel. Bạn cũng có thể kéo thả tệp để tải lên.",
    "imageButton": "Chọn ảnh",
    "imageHint": "Nhấp vào ảnh để chọn màu.",
    "uploadHint": "Nhấp hoặc kéo hình ảnh để tải lên"
  },
  "th": {
    "imageTitle": "ตัวเลือกสีจากภาพ",
    "imageDescription": "อัปโหลดภาพแล้วคลิกเพื่อสุ่มตัวอย่างพิกเซล คุณยังลากไฟล์เพื่ออัปโหลดได้ด้วย",
    "imageButton": "เลือกภาพ",
    "imageHint": "คลิกที่ภาพเพื่อเลือกสี",
    "uploadHint": "คลิกหรือลากภาพเพื่ออัปโหลด"
  },
  "id": {
    "imageTitle": "Pemilih warna gambar",
    "imageDescription": "Unggah gambar dan klik untuk mengambil sampel piksel. Anda juga dapat menyeret file untuk mengunggah.",
    "imageButton": "Pilih gambar",
    "imageHint": "Klik gambar untuk memilih warna.",
    "uploadHint": "Klik atau seret gambar untuk mengunggah"
  },
  "he": {
    "imageTitle": "בוחר צבע מתמונה",
    "imageDescription": "העלה תמונה ולחץ כדי לדגום פיקסל. אפשר גם לגרור קובץ כדי להעלות.",
    "imageButton": "בחר תמונה",
    "imageHint": "לחץ על התמונה כדי לבחור צבע.",
    "uploadHint": "לחץ או גרור תמונה להעלאה"
  },
  "ms": {
    "imageTitle": "Pemilih warna imej",
    "imageDescription": "Muat naik imej dan klik untuk mengambil sampel piksel. Anda juga boleh menyeret fail untuk dimuat naik.",
    "imageButton": "Pilih imej",
    "imageHint": "Klik imej untuk memilih warna.",
    "uploadHint": "Klik atau seret imej untuk muat naik"
  },
  "no": {
    "imageTitle": "Bildefargevelger",
    "imageDescription": "Last opp et bilde og klikk for å prøve en piksel. Du kan også dra en fil for å laste opp.",
    "imageButton": "Velg bilde",
    "imageHint": "Klikk på bildet for å velge en farge.",
    "uploadHint": "Klikk eller dra bilde for å laste opp"
  }
}
</i18n>
