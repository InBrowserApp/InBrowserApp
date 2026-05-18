Test kayıtları, veritabanı satırları, API örnekleri, olay yükleri, fikstürler veya yapılandırma dosyaları için yeni bir tanımlayıcı gerektiğinde tarayıcınızda yerel olarak bir UUID v4 oluşturun. Araç her seferinde tek bir kanonik küçük harfli UUID oluşturur; böylece ayrı toplu oluşturucu ile çakışmadan tek değerli iş akışına odaklanır.

## UUID v4 Ne Anlama Gelir

UUID v4, sürüm ve varyant bitlerinin sabit olduğu, kalan 122 bitin rastgele veriden geldiği 128 bitlik bir tanımlayıcıdır. Bu, oluşturma zamanını, makine bilgisini, sıra sayaçlarını veya kullanıcı ayrıntılarını açığa çıkarmayan tanımlayıcılara ihtiyacınız olduğunda kullanışlıdır.

## Ne Zaman Kullanılır

UUID v4'ü istemci tarafında oluşturulan kimlikler, sahte nesneler, geçici kayıtlar, herkese açık örnekler ve merkezi bir sayacı koordine etmenin zahmetli olacağı dağıtık sistemler için kullanın. Sıralama önemli olmadığında ve yalnızca düşük çakışma olasılığına sahip bir tanımlayıcı gerektiğinde iyi bir varsayılandır.

## Gizlilik Ve Güvenilirlik

Oluşturma bu tarayıcı sekmesinde Web Crypto ile çalışır, bu nedenle UUID InBrowser.App'e veya başka bir hizmete gönderilmez. Değer doğru göründüğünde kopyalayın, ardından sonraki kayıt veya örnek için yeni bir tanımlayıcı gerektiğinde yeniden oluşturun.
