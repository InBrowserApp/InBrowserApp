## Filecoin f410 adresi 0x biçimine nasıl dönüştürülür?

Bir `f410` veya `t410` adresi yapıştırıp **Adresi dönüştür** düğmesine basın. Araç Filecoin sağlama toplamını doğrular ve eşdeğer Ethereum biçimindeki `0x` adresini EIP-55 sağlama toplamıyla gösterir. Sonucu, Filecoin'de Ethereum biçiminde adres kullanan cüzdan veya blok gezgini için kopyalayın. Kendi adresinizi girmeden bir dönüşüm görmek için **Örnek dene** düğmesini kullanın.

## 0x adresi Filecoin biçimine nasıl dönüştürülür?

40 onaltılık basamak içeren bir `0x` adresi yapıştırın. `f410` adresi için **Ana ağ**, `t410` adresi için **Test ağı** seçeneğini kullanın. Calibration, diğer Filecoin test ağlarıyla aynı `t410` önekini kullanır. `0x` biçiminde ağ öneki yoktur. Bu nedenle aynı baytlar iki Filecoin önekinden biriyle yazılabilir. Cüzdanınızın, blok gezgininizin veya borsanızın kullandığı ağı seçin. Yalnızca küçük ya da yalnızca büyük harfli onaltılık adresler kabul edilir. Hem küçük hem büyük harf içeren adresler EIP-55 sağlama toplamı doğrulamasından geçmelidir.

## f410 ve t410 ne anlama gelir?

Bunlar Filecoin Ethereum Sanal Makinesi'nin (FEVM) kullandığı yetkilendirilmiş adreslerdir. `f410` veya `t410` adresi ve bu adresin `0x` biçimi, seçilen Filecoin ağında aynı 20 baytlık adresi temsil eder. Filecoin'in yerel biçimi Base32 ve kendi sağlama toplamını kullanır. Biçimi dönüştürmek bu baytları değiştirmez ve ağlar arasında FIL aktarmaz.

## f0, f1, f2 veya f3 adresleri dönüştürülebilir mi?

Bu araç, `10` ad alanındaki yetkilendirilmiş FEVM adreslerini dönüştürür. Bu adresleri `f410` veya `t410` önekinden tanıyabilirsiniz. Aktör kimliği adresleri, bunların maskelenmiş `0xff0000…` gösterimleri ve diğer Filecoin adres türleri kapsam dışındadır. Bazı yerel adres türlerini bir aktörle eşlemek için zincirin durumunu sorgulamak gerekir. Bu dönüşüm RPC isteği veya cüzdan bağlantısı olmadan tarayıcıda çalışır.

Bkz. [Filecoin adres türleri ve aktarımlar kılavuzu](https://github.com/filecoin-project/filecoin-docs/blob/main/networks-and-tools/assets/transfer-fil.md) ve [EIP-55 sağlama toplamı belirtimi](https://eips.ethereum.org/EIPS/eip-55).
