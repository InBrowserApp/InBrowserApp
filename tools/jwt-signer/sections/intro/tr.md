## JWT imzalama aracı nedir?

JWT imzalama aracı, bir başlığı ve yükü serileştirip ardından bunları bir sır veya özel anahtarla imzalayarak kompakt bir JSON Web Token oluşturur. Sonuç, birçok API, OAuth ve oturum sistemi tarafından kullanılan üç parçalı `header.payload.signature` token'ıdır.

## Bu araç ne zaman kullanılır

- API geliştirme, hazırlık ortamları ve demolar için yerel test token'ları oluşturun.
- Farklı algoritmaların token başlığını ve imzasını nasıl değiştirdiğini karşılaştırın.
- Geçici bir betik yazmadan `sub`, `iss`, `aud`, `exp`, `iat`, `scope` gibi talepler veya özel uygulama alanları ekleyin.
- HMAC paylaşılan sırlarıyla veya PKCS#8 PEM ya da JWK biçimindeki RSA/ECDSA özel anahtarlarıyla token'lar oluşturun.

## İmzalı bir token kullanmadan önce kontrol edilecekler

- Algoritmayı anahtar türüyle eşleştirin: `HS*` paylaşılan bir sır kullanır, `RS*` ve `PS*` RSA özel anahtarları kullanır, `ES*` EC özel anahtarları kullanır.
- Alıcı hizmet bekliyorsa sona erme ve hedef kitle talepleri ekleyin.
- Üretim özel anahtarlarını paylaşılan tarayıcı ve makinelerden uzak tutun. Bu araç yerel olarak çalışır, ancak anahtarları zaten ele geçirilmiş bir cihazdan koruyamaz.
- İmzalamanın şifreleme olmadığını unutmayın. Token'ı alan herkes başlığı ve yükü çözebilir.
