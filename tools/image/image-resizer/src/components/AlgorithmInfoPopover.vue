<template>
  <n-popover trigger="hover" placement="top-start" :width="360">
    <template #trigger>
      <n-icon size="16" depth="3" style="cursor: help">
        <Info16Regular />
      </n-icon>
    </template>

    <n-flex vertical :size="6">
      <n-text strong>{{ t('title') }}</n-text>
      <n-text depth="3">{{ t('browser') }}</n-text>
      <n-text depth="3">{{ t('bicubic') }}</n-text>
      <n-text depth="3">{{ t('bilinear') }}</n-text>
      <n-text depth="3">{{ t('lanczos3') }}</n-text>
      <n-text depth="3">{{ t('nearest') }}</n-text>
    </n-flex>
  </n-popover>
</template>

<script setup lang="ts">
import { NFlex, NIcon, NPopover, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import Info16Regular from '@vicons/fluent/Info16Regular'

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "title": "Algorithm guide",
    "browser": "Browser high quality: best default for photos and general use. Fast and smooth in most browsers.",
    "bicubic": "Bicubic interpolation: smoother edges than bilinear, suitable for portrait and product photos.",
    "bilinear": "Bilinear interpolation: balanced sharpness and speed, useful for common resize workflows.",
    "lanczos3": "Lanczos filter (radius 3): strongest detail retention when downscaling, but usually slower.",
    "nearest": "Nearest neighbor: preserves hard edges for pixel-art style images and UI sprites."
  },
  "zh": {
    "title": "算法说明",
    "browser": "浏览器高质量：照片和通用场景的默认选择，速度快、画面平滑。",
    "bicubic": "双三次插值：边缘更平滑，适合人像和商品图。",
    "bilinear": "双线性插值：清晰度与速度平衡，适合常规缩放。",
    "lanczos3": "Lanczos（半径 3）：缩小时细节保留更好，但速度通常更慢。",
    "nearest": "最近邻：保留硬边缘，适合像素风图和 UI 精灵图。"
  },
  "zh-CN": {
    "title": "算法说明",
    "browser": "浏览器高质量：照片和通用场景的默认选择，速度快、画面平滑。",
    "bicubic": "双三次插值：边缘更平滑，适合人像和商品图。",
    "bilinear": "双线性插值：清晰度与速度平衡，适合常规缩放。",
    "lanczos3": "Lanczos（半径 3）：缩小时细节保留更好，但速度通常更慢。",
    "nearest": "最近邻：保留硬边缘，适合像素风图和 UI 精灵图。"
  },
  "zh-TW": {
    "title": "演算法說明",
    "browser": "瀏覽器高品質：照片與一般用途的預設選項，速度快且畫面平滑。",
    "bicubic": "雙三次插值：邊緣更平滑，適合人像與商品圖片。",
    "bilinear": "雙線性插值：清晰度與速度均衡，適合一般縮放流程。",
    "lanczos3": "Lanczos（半徑 3）：縮小時細節保留更好，但通常較慢。",
    "nearest": "最近鄰：保留硬邊緣，適合像素風圖片與 UI 精靈圖。"
  },
  "zh-HK": {
    "title": "演算法說明",
    "browser": "瀏覽器高品質：照片與一般用途的預設選項，速度快且畫面平滑。",
    "bicubic": "雙三次插值：邊緣更平滑，適合人像與商品圖片。",
    "bilinear": "雙線性插值：清晰度與速度均衡，適合一般縮放流程。",
    "lanczos3": "Lanczos（半徑 3）：縮小時細節保留更好，但通常較慢。",
    "nearest": "最近鄰：保留硬邊緣，適合像素風圖片與 UI 精靈圖。"
  },
  "es": {
    "title": "Guía de algoritmos",
    "browser": "Alta calidad del navegador: opción predeterminada para fotos y uso general.",
    "bicubic": "Interpolación bicúbica: bordes más suaves que bilineal.",
    "bilinear": "Interpolación bilineal: equilibrio entre nitidez y velocidad.",
    "lanczos3": "Filtro Lanczos (radio 3): más detalle al reducir, pero más lento.",
    "nearest": "Vecino más cercano: conserva bordes duros para pixel art."
  },
  "fr": {
    "title": "Guide des algorithmes",
    "browser": "Haute qualité navigateur : bon choix par défaut pour photos et usage général.",
    "bicubic": "Interpolation bicubique : bords plus lisses que le bilinéaire.",
    "bilinear": "Interpolation bilinéaire : bon équilibre entre netteté et vitesse.",
    "lanczos3": "Filtre Lanczos (rayon 3) : meilleure conservation des détails en réduction.",
    "nearest": "Voisin le plus proche : idéal pour pixel art et bords durs."
  },
  "de": {
    "title": "Algorithmus-Hinweise",
    "browser": "Browser-Hochqualität: guter Standard für Fotos und allgemeine Nutzung.",
    "bicubic": "Bikubisch: glattere Kanten als bilinear.",
    "bilinear": "Bilinear: ausgewogen zwischen Schärfe und Geschwindigkeit.",
    "lanczos3": "Lanczos (Radius 3): mehr Details beim Verkleinern, meist langsamer.",
    "nearest": "Nächster Nachbar: harte Kanten für Pixel-Art."
  },
  "it": {
    "title": "Guida algoritmi",
    "browser": "Alta qualità browser: scelta predefinita per foto e uso generale.",
    "bicubic": "Interpolazione bicubica: bordi più morbidi del bilineare.",
    "bilinear": "Interpolazione bilineare: buon equilibrio tra nitidezza e velocità.",
    "lanczos3": "Filtro Lanczos (raggio 3): più dettagli in riduzione, ma più lento.",
    "nearest": "Vicino più prossimo: mantiene bordi netti per pixel art."
  },
  "ja": {
    "title": "アルゴリズム解説",
    "browser": "ブラウザー高品質：写真や一般用途の標準設定。",
    "bicubic": "バイキュービック：バイリニアより滑らかな輪郭。",
    "bilinear": "バイリニア：画質と速度のバランスが良い。",
    "lanczos3": "Lanczos（半径 3）：縮小時の細部保持に強いが遅め。",
    "nearest": "ニアレストネイバー：ドット絵など硬い輪郭向け。"
  },
  "ko": {
    "title": "알고리즘 안내",
    "browser": "브라우저 고품질: 사진과 일반 용도에 기본으로 적합합니다.",
    "bicubic": "바이큐빅: 바이리니어보다 가장자리가 더 부드럽습니다.",
    "bilinear": "바이리니어: 선명도와 속도의 균형이 좋습니다.",
    "lanczos3": "Lanczos(반경 3): 축소 시 디테일 유지가 뛰어나지만 더 느립니다.",
    "nearest": "최근접 이웃: 픽셀아트처럼 경계가 뚜렷한 이미지에 적합합니다."
  },
  "ru": {
    "title": "Подсказка по алгоритмам",
    "browser": "Высокое качество браузера: лучший выбор по умолчанию для фото и общего использования.",
    "bicubic": "Бикубическая интерполяция: более гладкие края, чем у билинейной.",
    "bilinear": "Билинейная интерполяция: хороший баланс резкости и скорости.",
    "lanczos3": "Lanczos (радиус 3): лучше сохраняет детали при уменьшении, но медленнее.",
    "nearest": "Ближайший сосед: для пиксель-арта и жёстких границ."
  },
  "pt": {
    "title": "Guia de algoritmos",
    "browser": "Alta qualidade do navegador: melhor padrão para fotos e uso geral.",
    "bicubic": "Interpolação bicúbica: bordas mais suaves que bilinear.",
    "bilinear": "Interpolação bilinear: equilíbrio entre nitidez e velocidade.",
    "lanczos3": "Filtro Lanczos (raio 3): mantém mais detalhes ao reduzir, porém mais lento.",
    "nearest": "Vizinho mais próximo: preserva bordas duras para pixel art."
  },
  "ar": {
    "title": "دليل الخوارزميات",
    "browser": "جودة عالية من المتصفح: الخيار الافتراضي المناسب للصور والاستخدام العام.",
    "bicubic": "استيفاء تكعيبي: حواف أكثر سلاسة من الاستيفاء الثنائي.",
    "bilinear": "استيفاء ثنائي: توازن جيد بين الحدة والسرعة.",
    "lanczos3": "مرشح Lanczos (نصف قطر 3): يحافظ على التفاصيل أكثر عند التصغير لكنه أبطأ.",
    "nearest": "أقرب جار: يحافظ على الحواف الحادة لرسومات البكسل."
  },
  "hi": {
    "title": "एल्गोरिदम मार्गदर्शिका",
    "browser": "ब्राउज़र हाई क्वालिटी: फ़ोटो और सामान्य उपयोग के लिए डिफ़ॉल्ट रूप से अच्छा विकल्प।",
    "bicubic": "बाइक्यूबिक इंटरपोलेशन: बिलिनियर से अधिक स्मूद किनारे।",
    "bilinear": "बिलिनियर इंटरपोलेशन: शार्पनेस और स्पीड का संतुलन।",
    "lanczos3": "लैंज़ोस फ़िल्टर (रेडियस 3): डाउनस्केल में बेहतर डिटेल, पर आम तौर पर धीमा।",
    "nearest": "नियरस्ट नेबर: पिक्सेल-आर्ट के लिए तेज़ और हार्ड एज सुरक्षित।"
  },
  "tr": {
    "title": "Algoritma rehberi",
    "browser": "Tarayıcı yüksek kalite: fotoğraflar ve genel kullanım için iyi varsayılan.",
    "bicubic": "Bikübik enterpolasyon: bilineere göre daha yumuşak kenarlar.",
    "bilinear": "Bilineer enterpolasyon: netlik ve hız arasında dengeli.",
    "lanczos3": "Lanczos filtresi (yarıçap 3): küçültmede daha fazla detay, ancak daha yavaş.",
    "nearest": "En yakın komşu: piksel art için keskin kenarları korur."
  },
  "nl": {
    "title": "Algoritmegids",
    "browser": "Browser hoge kwaliteit: goede standaard voor foto’s en algemeen gebruik.",
    "bicubic": "Bicubische interpolatie: gladdere randen dan bilineair.",
    "bilinear": "Bilineaire interpolatie: balans tussen scherpte en snelheid.",
    "lanczos3": "Lanczos-filter (straal 3): meer details bij verkleinen, meestal trager.",
    "nearest": "Dichtstbijzijnde buur: behoudt harde randen voor pixel-art."
  },
  "sv": {
    "title": "Algoritmguide",
    "browser": "Hög webbläsarkvalitet: bra standardval för foto och allmänt bruk.",
    "bicubic": "Bikubisk interpolering: mjukare kanter än bilinjär.",
    "bilinear": "Bilinjär interpolering: balanserar skärpa och hastighet.",
    "lanczos3": "Lanczos-filter (radie 3): mer detalj vid nedskalning men långsammare.",
    "nearest": "Närmaste granne: bevarar hårda kanter för pixelgrafik."
  },
  "pl": {
    "title": "Opis algorytmów",
    "browser": "Wysoka jakość przeglądarki: najlepszy domyślny wybór do zdjęć i zastosowań ogólnych.",
    "bicubic": "Interpolacja bikubiczna: gładsze krawędzie niż biliniowa.",
    "bilinear": "Interpolacja biliniowa: dobry balans ostrości i szybkości.",
    "lanczos3": "Filtr Lanczosa (promień 3): więcej detali przy zmniejszaniu, ale wolniej.",
    "nearest": "Najbliższy sąsiad: ostre krawędzie dla grafiki pikselowej."
  },
  "vi": {
    "title": "Hướng dẫn thuật toán",
    "browser": "Chất lượng cao của trình duyệt: lựa chọn mặc định tốt cho ảnh và nhu cầu chung.",
    "bicubic": "Nội suy bicubic: viền mượt hơn bilinear.",
    "bilinear": "Nội suy bilinear: cân bằng giữa độ nét và tốc độ.",
    "lanczos3": "Bộ lọc Lanczos (bán kính 3): giữ chi tiết tốt khi giảm kích thước nhưng chậm hơn.",
    "nearest": "Láng giềng gần nhất: giữ cạnh cứng cho ảnh pixel art."
  },
  "th": {
    "title": "คำอธิบายอัลกอริทึม",
    "browser": "คุณภาพสูงของเบราว์เซอร์: เหมาะเป็นค่าเริ่มต้นสำหรับภาพถ่ายและงานทั่วไป",
    "bicubic": "ไบคิวบิก: ขอบเนียนกว่าบิลิเนียร์",
    "bilinear": "บิลิเนียร์: สมดุลระหว่างความคมและความเร็ว",
    "lanczos3": "Lanczos (รัศมี 3): เก็บรายละเอียดได้ดีเมื่อย่อ แต่ช้ากว่า",
    "nearest": "เพื่อนบ้านใกล้สุด: คงขอบคม เหมาะกับภาพพิกเซลอาร์ต"
  },
  "id": {
    "title": "Panduan algoritme",
    "browser": "Kualitas tinggi browser: pilihan default yang bagus untuk foto dan kebutuhan umum.",
    "bicubic": "Interpolasi bikubik: tepi lebih halus dibanding bilinear.",
    "bilinear": "Interpolasi bilinear: seimbang antara ketajaman dan kecepatan.",
    "lanczos3": "Filter Lanczos (radius 3): detail lebih baik saat mengecilkan, tetapi lebih lambat.",
    "nearest": "Tetangga terdekat: mempertahankan tepi tegas untuk pixel art."
  },
  "he": {
    "title": "מדריך אלגוריתמים",
    "browser": "איכות גבוהה בדפדפן: ברירת מחדל טובה לתמונות ולשימוש כללי.",
    "bicubic": "אינטרפולציה דו-קובית: קצוות חלקים יותר מבילינארית.",
    "bilinear": "אינטרפולציה ביליניארית: איזון טוב בין חדות למהירות.",
    "lanczos3": "מסנן Lanczos (רדיוס 3): שומר יותר פרטים בהקטנה אך איטי יותר.",
    "nearest": "שכן קרוב ביותר: שומר קצוות חדים לפיקסל-ארט."
  },
  "ms": {
    "title": "Panduan algoritma",
    "browser": "Kualiti tinggi pelayar: pilihan lalai yang baik untuk foto dan kegunaan umum.",
    "bicubic": "Interpolasi bikubik: tepi lebih licin berbanding bilinear.",
    "bilinear": "Interpolasi bilinear: seimbang antara ketajaman dan kelajuan.",
    "lanczos3": "Penapis Lanczos (jejari 3): lebih detail ketika mengecilkan, tetapi lebih perlahan.",
    "nearest": "Jiran terdekat: mengekalkan tepi keras untuk pixel art."
  },
  "no": {
    "title": "Algoritmeguide",
    "browser": "Høy nettleserkvalitet: godt standardvalg for foto og generell bruk.",
    "bicubic": "Bikubisk interpolasjon: glattere kanter enn bilineær.",
    "bilinear": "Bilineær interpolasjon: balanserer skarphet og hastighet.",
    "lanczos3": "Lanczos-filter (radius 3): beholder mer detaljer ved nedskalering, men tregere.",
    "nearest": "Nærmeste nabo: bevarer harde kanter for pikselkunst."
  }
}
</i18n>
