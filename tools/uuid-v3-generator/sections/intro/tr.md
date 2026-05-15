## UUID v3 nedir?

UUID v3, ada dayalı bir UUID biçimidir. Bir ad alanı UUID'si ve bir ad alır,
bunları MD5 ile karmalar ve sonucu standart bir UUID olarak biçimlendirir.
Önemli davranış determinizmdir: aynı ad alanı ve ad her zaman aynı UUID'yi
üretir.

Bu araç tamamen tarayıcınızda çalışır. Ad alanı, ad ve oluşturulan UUID, sonucu
başka bir yere kopyalamadığınız sürece cihazınızda kalır.

## Ne zaman kullanılır?

- DNS adı, URL, nesne yolu veya kullanıcı adı gibi bilinen bir ad için kararlı
  bir tanımlayıcıya ihtiyacınız olduğunda UUID v3 kullanın.
- Tanımladığınız adın türüne uyan ad alanını seçin. DNS ve URL en yaygın ön
  ayarlardır.
- Aynı ad alanını tutarlı şekilde yeniden kullanın. Ad aynı kalsa bile ad
  alanını değiştirmek oluşturulan her UUID'yi değiştirir.
- Bir seçeneğiniz varsa ve daha güçlü bir karmaya sahip ada dayalı bir UUID
  gerekiyorsa UUID v5 veya başka bir modern tanımlayıcıyı tercih edin. UUID v3,
  özellikle MD5 tabanlı UUID'ler bekleyen sistemlerle uyumluluk için vardır.

## Güvenlikle ilgili notlar

UUID v3 rastgele bir tanımlayıcı değildir ve gizli değildir. Ad alanını ve adı
bilen herkes aynı UUID'yi yeniden oluşturabilir. Parolalar, oturum belirteçleri,
API anahtarları veya öngörülemez olması gereken diğer değerler için kullanmayın.
