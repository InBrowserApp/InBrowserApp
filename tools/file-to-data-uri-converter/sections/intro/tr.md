## Data URI nedir?

Data URI (veya data URL) küçük dosyaları doğrudan metne gömer. Biçim: `data:[mime][;charset][;base64],data`.

**Yaygın kullanım:**

- HTML/CSS içinde görsel veya yazı tipi gömme
- JSON/ayar dosyalarında küçük kaynakları saklama

**Notlar:**

- Küçük dosyalar için uygundur; büyük dizgeler sayfayı yavaşlatabilir
- İkili veriler için Base64 yaygındır

### Örnek

```text
data:image/svg+xml;base64,PHN2ZyB4bWxucz0i...
```

Virgülden önceki bölüm dosyayı açıklar; MIME türü ve Base64 kullanıp kullanmadığı gibi bilgiler burada yer alır. Virgülden sonraki bölüm ise kodlanmış yükün kendisidir.

### Bu dönüştürücü ne zaman kullanışlıdır

- Yerel bir dosyayı HTML, CSS, JSON veya e-posta işaretlemesine gömülebilecek bir metne dönüştürmek için
- Varlığı başka bir yerde barındırmadan hızlı, kendi kendine yeterli bir demo oluşturmak için
- Sonucu başka bir araca yapıştırmadan önce algılanan MIME türünü kontrol etmek için

### Pratik sınırlar

- Data URI en çok simgeler, küçük görseller ve kısa parçalar gibi küçük dosyalarda işe yarar
- Base64 yaklaşık %33 ek yük getirir; bu yüzden ortaya çıkan metin özgün dosyadan daha büyük olur
- Çok uzun metinleri boyut sınırı olan formlara, yapılandırmalara veya editörlere yapıştırmak zor olabilir
