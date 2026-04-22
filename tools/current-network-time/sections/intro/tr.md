## Bu arac ne icin kullanilir

Bu araci, cihaz saatini agdan alinan bir saat bilgisiyle karsilastirmak icin
kullanin. Cloudflare trace uc noktasindan bir zaman damgasi alir, istek
gecikmesinin orta noktasini tahmin eder ve ortaya cikan ag saatini tarayicida
gosterir.

## Nerede yardimci olur

- Yerel sistem saatinin ileri mi geri mi oldugunu kontrol etmek.
- TLS, token, zamanlayici veya log sorunlarini incelemeden once zaman kaymasini
  dogrulamak.
- NTP araclari kurmadan hizli bir ag referans saati elde etmek.

## Nelere dikkat edilmeli

- Gosterilen sapma bir tahmindir ve ag gecikmesine baglidir.
- Trace istegi basarisiz olursa, bir sonraki basarili esitlemeye kadar arac
  yerel saati gosterir.
- Sistem genelinde hassas bir duzeltme icin cihazinizin saat esitleme
  ayarlarini veya NTP yapilandirmasini duzenleyin.
