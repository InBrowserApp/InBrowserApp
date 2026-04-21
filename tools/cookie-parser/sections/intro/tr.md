## Bu araç neyi ayrıştırır?

Bir Cookie istek başlığını ya da bir veya daha fazla Set-Cookie yanıt satırını yapıştırabilirsiniz. Ayrıştırıcı, çerez adlarını, değerlerini ve hatalı parçaları hızlı inceleme için yapılandırılmış JSON olarak çıkarır.

## Cookie ve Set-Cookie farkı

Cookie, tarayıcının sunucuya geri gönderdiği başlıktır. Set-Cookie ise Path, Max-Age, SameSite, Secure veya HttpOnly gibi öznitelikleri tanımlayan yanıt başlıkları için kullanılır.

## Daha temiz sonuçlar için ipuçları

- Tam başlık satırlarını veya yalnızca ham cookie çiftlerini yapıştırabilirsiniz.
- Birden fazla Set-Cookie satırı desteklenir.
- Geçersiz parçalar ayrı listelenir, böylece hatalı çiftleri veya öznitelikleri görmek kolaylaşır.
