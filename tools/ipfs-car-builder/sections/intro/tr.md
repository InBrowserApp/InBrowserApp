## Dosyalardan veya bir klasörden CAR dosyası oluşturma

Dosyaları veya bir klasörü seçip **CAR oluştur** düğmesine basın. Kök CID değerini kopyalayın ve `.car` arşivini kaydedin. Tarayıcı seçtiğiniz dosyaları cihazınızda okur ve bunları UnixFS kökü olan bir CARv1 arşivinde paketler. Arşivi yedek olarak saklayabilir veya bir IPFS düğümüne ya da depolama hizmetine aktarabilirsiniz.

## Arşiv dosyalarınızın yapısını nasıl korur?

Tek bir dosya seçerseniz o dosya kök olur. Birden fazla dosya için ortak bir kök klasör oluşturulur. Bir klasör seçerseniz içindeki dosyaların yolları korunur. Tarayıcının klasör seçicisi dosyaları ve yollarını araca iletir. Tarayıcınız klasör sürükleyip bırakmayı destekliyorsa boş alt klasörleri de dahil etmek için klasörü sürükleyip bırakın.

## Kök CID ne anlama gelir?

Kök CID, paketlenen dosya veya klasörü tanımlar. Araç, IPFS CID Hesaplayıcısı ile aynı varsayılan CIDv1 ayarlarını kullanır. Dosya yapısı aynıysa içerik tanımlayıcısı da aynı olur. Arşivi Kubo'ya eklemek için `ipfs dag import archive.car` komutunu indirdiğiniz dosyanın adıyla çalıştırın. [Kubo komutları](https://docs.ipfs.tech/reference/kubo/cli/#ipfs-dag-import)
