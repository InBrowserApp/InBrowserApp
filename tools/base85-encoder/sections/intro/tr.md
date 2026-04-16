## Base85 nedir?

Base85, 4 baytı 5 yazdırılabilir karaktere dönüştüren bir ikiliden metne kodlama biçimidir. Base64’ten daha yoğundur ve bu araç, hedef sistemin beklediği biçime göre ASCII85 veya Z85 seçmenizi sağlar.

## Ne zaman kullanılır?

- Ham baytları, metni veya dosyaları yalnızca metin kabul eden kanallardan geçirirken çıktıyı nispeten kompakt tutmak istediğinizde.
- Sonunda kalan kısmi baytları destekleyen esnek bir Base85 biçimine ihtiyacınız varsa ASCII85 kullanın.
- ZeroMQ uyumlu Base85 metni gerekiyorsa ve giriş uzunluğu tam olarak 4 baytın katıysa Z85 kullanın.

## Dikkat edilmesi gerekenler

- Base85 bir kodlama biçimidir, şifreleme değildir.
- ASCII85 ve Z85 farklı alfabeler kullanır; bu yüzden birbirinin yerine geçmezler.
- Z85, bayt uzunluğu 4’e bölünmeyen verileri reddeder; ASCII85 ise kısmi son blokları kodlayabilir.
