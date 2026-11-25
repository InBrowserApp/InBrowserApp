## APK dosyasını açma ve manifesti okuma

Bir Android `.apk` dosyası bırakın veya **APK veya manifest aç** seçeneğini kullanın. Görüntüleyici, çoğu APK dosyasında bulunan derlenmiş ikili XML de dâhil olmak üzere paketteki `AndroidManifest.xml` dosyasını açar. Önceden çıkarılmış ikili veya metin biçimindeki bir manifesti de açabilirsiniz. Genel bakışı ve çözülmüş XML’yi görmek için örnek APK’yı deneyin. Dosyalar tarayıcınızda kalır.

## Paket, sürüm ve SDK alanlarını anlama

**Paket adı**, Android uygulamasını tanımlar. Sürüm adı, kullanıcıların gördüğü sürüm etiketidir. Sürüm kodu ise Android’in güncellemeleri sıralamak için kullandığı sayıdır. Minimum SDK, manifestte bildirilen en düşük Android API düzeyidir. Hedef SDK, uygulamanın hedeflediği API düzeyini gösterir. Manifestte yer almayan alanlar belirtilmemiş olarak görünür.

## İzinleri inceleme ve AndroidManifest.xml dosyasını dışa aktarma

Genel bakış, paketin bildirdiği izinleri listeler. Android, işletim sistemi sürümüne, uygulama ayarlarına ve kullanıcı tercihlerine göre cihazda hangi izinlerin verileceğini belirler. Bileşenleri, intent filtrelerini ve koşullu izin bildirimlerini okumak için **Manifest XML** sekmesini açın. Çözülmüş dosyayı saklamak için **XML’yi kopyala** veya **XML’yi indir** seçeneğini kullanın. Derlenmiş kaynak başvuruları `@0x7f010001` gibi kimlikler olarak görünebilir.

[Android manifestinin yapısı ve öğeleri](https://developer.android.com/guide/topics/manifest/manifest-intro)
