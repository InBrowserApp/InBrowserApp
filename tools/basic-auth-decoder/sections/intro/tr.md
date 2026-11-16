## Ne Yapar?

HTTP Basic Authorization başlığını çözüp Base64’ten kullanıcı adı ve parolayı çıkarın. Hata ayıklama ve API testi için yararlı.

## Kabul Edilen Girdi

Şunun gibi yapıştırın: Basic dXNlcjpwYXNz
Bu araç, tam bir `Authorization: Basic ...` satırını da kabul eder.

## Notlar

- Base64, kimlik bilgilerini yalnızca kodlar; onları korumaz.
- Çözücü, ilk `:` karakterinden böler ve kalan kısmı parolada tutar.
- Her şey tarayıcınızda yerel olarak çalışır.
