## CAR arşivinden veya dosyadan Piece CID hesaplama

Filecoin depolama sağlayıcısına göndereceğiniz dosyayı seçin. **Piece CID hesapla** düğmesine basın, ardından ihtiyacınız olan biçimdeki tanımlayıcıyı kopyalayın. Araç, dolgu sonrası parça boyutunu bayt cinsinden de gösterir. Tarayıcı dosyayı cihazınızda okur ve parçalar hâlinde işler. İçeriğiniz cihazınızda kalır.

## Hangi biçimi kullanmalıyım?

**Piece CID (v2)**, [FRC-0069](https://github.com/filecoin-project/FIPs/blob/master/FRCs/frc-0069.md) standardına uyar. Genellikle `bafkzci` ile başlar ve yeni Filecoin araçlarının ihtiyaç duyduğu veri boyutu bilgisini içerir. **Eski biçimde CommP (v1)**, genellikle `baga6ea4` ile başlar ve geleneksel Filecoin depolama anlaşmalarında kullanılır. Kullandığınız araç eski biçimde bir Piece CID ve dolgu sonrası parça boyutu istiyorsa eski biçimdeki CommP değerini kopyalayın ve yanında gösterilen boyutu kullanın. Mevcut bir taahhüdü dosyanızla karşılaştırmak için iki biçimden birini yapıştırabilirsiniz. Yalnızca sondaki sıfır baytları farklı olan dosyalar aynı eski biçimli CommP değerine sahip olabilir.

## IPFS CID değerim neden farklı görünüyor?

IPFS kök CID değeri bir bloğu, dosyanın kökünü veya klasörün kökünü tanımlar. Filecoin Piece CID ise depolamaya gönderilen verinin, Filecoin'in dolgu ve karma alma kuralları uygulandıktan sonraki tam bayt dizisine kriptografik olarak bağlanır. Göndereceğiniz dosya bir CAR arşiviyse taahhüdü arşivin kendisinden hesaplayın. İki CAR arşivi aynı IPFS kök CID değerine sahip olsa da blokları farklı bir sırada saklayabilir. Bu da Piece CID değerini değiştirebilir. Depolama anlaşmasını gönderirken Piece CID değerini hesapladığınız dosyanın aynısını kullanın.

Biçim ve dolgu kuralları için [Filecoin Piece teknik tanımına](https://spec.filecoin.io/systems/filecoin_files/piece/) bakın.
