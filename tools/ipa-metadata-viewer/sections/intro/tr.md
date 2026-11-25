## IPA dosyasını açma ve ana uygulamanın meta verilerini okuma

Bir iOS `.ipa` dosyası bırakın veya **IPA dosyası aç** seçeneğini kullanın. Görüntüleyici, ana uygulamanın özellik listesini `Payload/Trail Notes.app/Info.plist` gibi bir yoldan okur. Kendi dosyanızı açmadan önce alanları görmek için örnek IPA’yı deneyin. Tarayıcınız arşivi açar ve özellik listesini okur.

## Paket kimliğini, sürümleri ve platformları anlama

`CFBundleIdentifier` alanındaki paket kimliği, uygulama paketini tanımlar. `CFBundleShortVersionString` yayımlanan sürümü, `CFBundleVersion` ise derlemeyi belirtir. Pakette kayıtlı minimum sistem sürümünü ve platform adlarını görmek için `MinimumOSVersion` ve `CFBundleSupportedPlatforms` alanlarını kontrol edin. Görünen ad, `CFBundleDisplayName` veya `CFBundleName` alanından alınır.

## Info.plist dosyasını inceleme ve dışa aktarma

Genel bakışta yer almayan anahtarlar da dâhil olmak üzere özellik listesinin tamamını okunabilir XML olarak görmek için **Info.plist** sekmesini seçin. Görüntüleyici, ikili ve XML biçimindeki özellik listelerini okuyabilir. Okunabilir XML’yi başka bir araçta kullanmak için **XML’yi kopyala**, özgün baytları saklamak için **Info.plist dosyasını indir** seçeneğini kullanın. Gösterilen arşiv yolu, meta verilerin hangi uygulama paketinden alındığını belirtir.

[Apple Info.plist başvuru belgesi](https://developer.apple.com/documentation/bundleresources/information-property-list)
