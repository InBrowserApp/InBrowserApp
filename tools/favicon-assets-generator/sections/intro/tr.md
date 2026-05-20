## Aracın oluşturduğu dosyalar

Bu üretici, tek bir görseli eksiksiz ve modern bir favicon paketine dönüştürür —
eski tarayıcılar için çok boyutlu bir `.ico`, 16 / 32 / 180 / 192 / 512
PNG varyantları, isteğe bağlı orijinal bir `.svg`, PWA'lar için bir
`site.webmanifest` ve `<head>` içine yapıştıracağınız HTML parçacığı. Her
bayt tarayıcınızda üretilir; yükleme yok, sunucu yok, analitik yok.

## Pakette neler var

- `favicon.ico` — tarayıcı sekmeleri, yer imleri ve eski Windows kısayolları
  için çok görselli (16 / 32 / 48).
- `favicon-16x16.png` ve `favicon-32x32.png` — güncel tarayıcılar tarafından
  kullanılan modern PNG varyantları.
- `favicon.svg` — yalnızca kaynak görseliniz SVG olduğunda ve "Orijinal
  SVG'yi kullan" anahtarı açıkken eklenir.
- `apple-touch-icon.png` — 180×180, opak, iOS ana ekranları tarafından
  kullanılır.
- `pwa-192x192.png` ve `pwa-512x512.png` — standart PWA simgeleri.
- `pwa-maskable-192x192.png` ve `pwa-maskable-512x512.png` — W3C
  tarafından önerilen güvenli alana sahip maskelenebilir varyantlar.
- `site.webmanifest` — yukarıdaki simgelere bağlanmış PWA manifesti.

## Dolgu, arka plan ve maskelenebilir güvenli bölgeler nasıl çalışır

Her platformun kendi dolgusu ("Kenar boşluğu") vardır; böylece simge
tuvalinin içinde nefes alacak alan bırakabilirsiniz. "Arka plan ekle"
anahtarı, kaynağınızın arkasına opak bir kare boyar — kaynak şeffaf
olduğunda ve hedef opaklık gerektirdiğinde (Apple ana ekranı) veya
yalnızca bir tarayıcı sekmesindeki görsel kontrast için kullanışlıdır.
Maskelenebilir PWA simgeleri, platform kenar boşluğunun üstünde ek bir
güvenli bölge kullanır: merkezi ~%80'in dışında kalan her şey Android,
Windows veya ChromeOS dairesel, yuvarlatılmış veya squircle bir maske
uyguladığında kırpılabilir.

## Paketi sitenize bağlama

1. İndirilen arşivi web kök dizininize açın (böylece dosyalar
   `/favicon.ico`, `/site.webmanifest` vb. konumlarda bulunur).
2. HTML parçacığını sitenizin `<head>` bölümüne yapıştırın.
3. Varlıkları bir alt yoldan sunuyorsanız (örneğin `/static/icons/`),
   parçacığın ve manifestin doğru URL'leri kullanması için üretmeden önce
   "Varlık yolu"nu ayarlayın.
4. Manifesti bu aracın sunduklarının ötesinde özelleştirdiyseniz (örneğin
   `categories` veya `screenshots` eklemek için), `site.webmanifest`
   dosyasını bir metin editöründe açıp doğrudan düzenleyin — düz JSON'dur.
