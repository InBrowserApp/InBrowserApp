## Bluetooth Low Energy cihazına nasıl bağlanılır?

Bluetooth'u açın ve cihazı bağlanılabilir duruma getirin. **Cihaza bağlan** seçeneğini seçin ve tarayıcıda çevre biriminizi seçin. Bu gezgin Pil Hizmeti, Cihaz Bilgileri, Kalp Atış Hızı ve Çevresel Algılama gibi yaygın GATT hizmetlerine erişim ister. Özel bir GATT hizmeti için seçim penceresini açmadan önce hizmetin UUID'sini girin. `180F` gibi 16 bitlik bir UUID veya cihaz belgelerindeki tam 128 bitlik UUID'yi kullanın.

## GATT özellikleri nasıl okunur?

Özelliklerini ve destekledikleri işlemleri görmek için bir hizmeti genişletin. Geçerli değeri istemek için **Oku** seçeneğini seçin. Onaltılık biçim, baytları tam olarak alındıkları gibi gösterirken UTF-8 metin içeren özellikler için kullanışlıdır. Pil seviyesi, ölçüm veya başka bir ikili değer, ilgili özelliğin belirtimine göre yorumlanmayı gerektirebilir.

## Bluetooth bildirimleri nasıl kaydedilir?

Bildirim veya onaylı bildirim desteği olan bir özellikte **Abone ol** seçeneğini seçin. Güncellemeler saatleri ve özellik UUID'si ile birlikte görünür. Son 100 bildirimi daha sonra incelemek üzere JSON dosyası olarak indirin veya bu akışı durdurmak için **Aboneliği sonlandır** seçeneğini seçin. Sayfa günlüğü yerel olarak saklar.

## Cihazımı veya hizmetlerini neden göremiyorum?

Web Bluetooth desteği tarayıcıya ve işletim sistemine bağlıdır. HTTPS üzerinden desteklenen bir tarayıcı kullanın, cihazı yakında tutun ve yalnızca tek bağlantıya izin veriyorsa diğer uygulamalardan bağlantısını kesin. Tarayıcı, Bluetooth LE çevre birimlerinde izin verilen GATT hizmetlerini kullanıma sunar. Yalnızca ses profilleri sunan kulaklıklar gibi Bluetooth Classic cihazları farklı bir arayüz gerektirir.
