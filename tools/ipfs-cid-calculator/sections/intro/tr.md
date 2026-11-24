## Dosya veya klasör için CID nasıl hesaplanır?

Cihazınızdan bir dosya veya klasör seçip **CID hesapla** düğmesine basın. İçerik tanımlayıcısını (CID) kopyalayarak bir manifest dosyasına kaydedebilir veya önceki bir IPFS içe aktarma sonucuyla karşılaştırabilirsiniz. Hesaplama tarayıcınızda yapılır. Dosyalarınız cihazınızda kalır.

## Aynı dosyanın IPFS CID değerleri neden farklı olabilir?

IPFS, dosyayı bloklara ayırabilir ve bloklar arasındaki bağlantıları UnixFS ile saklayabilir. Kök CID, blokların nasıl bölündüğüne, kodlandığına ve düzenlendiğine bağlıdır. Aynı CID değerini elde etmek için ilk içe aktarmadaki parça boyutunu, ham yaprak bloğu ayarını ve klasör yapısını kullanın. Klasör CID değerini dosya ve alt klasör adları da etkiler. Tarayıcının klasör seçicisi boş alt klasörleri atlar.

## Kubo ile aynı CID nasıl elde edilir?

CID sürümünü, parça boyutunu, ham yaprak bloğu ayarını veya klasör içine alma seçeneğini değiştirmek için **İçe aktarma ayarları** bölümünü açın. Varsayılan sürüm CIDv1'dir. Önceki içe aktarmada CIDv0 kullanıldıysa bu sürümü seçin. **Klasör içine al** seçeneği bir üst klasör oluşturur. Böylece dosyaya kök CID altındaki adıyla erişebilirsiniz.

Aynı dosya veya klasör için hesaplamayı Kubo'da tekrarlamak üzere ekrandaki `ipfs add --only-hash` komutunu kopyalayın. Önceki içe aktarmadan bir CID değeriniz varsa karşılaştırma alanına yapıştırın. Eşdeğer CIDv0 ve CIDv1 değerleri aynı bloğu tanımladıkları için eşleşir. [İçerik tanımlayıcıları hakkında IPFS belgeleri](https://docs.ipfs.tech/concepts/content-addressing/)
