## Local Font Access nedir?

Local Font Access, cihazda yüklü yazı tiplerini listeleyen bir tarayıcı API'sidir.

Bu araç sonuçlarda arama yapmanıza, ilgili yazı tipi varyantlarını karşılaştırmanıza ve seçtiğiniz font için bir CSS parçası kopyalamanıza olanak tanır.

Yalnızca güvenli bağlamlarda ve desteklenen tarayıcılarda çalışır, kullanıcı izni (local-fonts) gerekir.

API, family, fullName, postscriptName ve style bilgilerini içeren FontData döndürür.

### Temel noktalar

- Geçerli cihazda bir CSS `font-family` yığını için gereken tam adları doğrulamak için kullanın.
- Çağrılar kullanıcı etkileşimiyle tetiklenmelidir.
- Permissions Policy bazı sitelerde erişimi engelleyebilir.
- Bu araç yerelde çalışır ve font yüklemez.
