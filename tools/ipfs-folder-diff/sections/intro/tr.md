## İki IPFS klasörü CID ile nasıl karşılaştırılır?

İlk klasörün adresini **Önceki klasör**, güncellenen klasörün adresini **Sonraki klasör** alanına yapıştırın. Ardından **Klasörleri karşılaştır** düğmesine basın. Her iki alana da bir CID, `ipfs://` adresi veya HTTP ağ geçidi bağlantısı girebilirsiniz. İki alt klasörü karşılaştırmak için yollarını da ekleyin. CID değerlerini görmek için bir sonucu açın, listeyi yola göre filtreleyin veya karşılaştırmayı kaydetmek için JSON indirin.

## Bir yol hangi durumda eklenmiş, kaldırılmış veya değişmiş sayılır?

Yalnızca bir klasörde bulunan yol eklenmiş ya da kaldırılmış sayılır. Tamamı eklenen veya kaldırılan bir alt klasör tek bir yol olarak görünür. Her iki sürümde de alt klasör varsa ancak CID değerleri farklıysa araç içindeki yolları karşılaştırır. CID değeri farklı olan bir öğe değişmiş olarak görünür. Farklı parçalama veya kodlama ayarlarıyla içe aktarılan dosyaların görünen içerikleri aynı olsa bile CID değerleri farklı olabilir.

## Her dosyayı indirmeden IPFS sürümlerini karşılaştırma

Tarayıcı, genel IPFS ağ geçitlerinden doğrulanmış blokları okur ve CID değerleri eşleşen dalları atlar. Böylece bir web sitesinin, yayımlanmış bir veri kümesinin veya yedeğin sürümlerini değişmez klasör adreslerini kullanarak karşılaştırabilirsiniz. Değişen bağlantıları, dosyaların tamamını indirmeden karşılaştırabilirsiniz. Bir klasör öğesi alınamazsa sonuç, karşılaştırılamayan yolları gösterir.

[İçeriğe göre adresleme ve veri kümesi sürümleri](https://docs.ipfs.tech/how-to/content-addressing-data-sets/) hakkında daha fazla bilgi edinin.
