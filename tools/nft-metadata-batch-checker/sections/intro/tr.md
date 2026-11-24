## NFT basmadan önce JSON meta verileri nasıl kontrol edilir?

Cihazınızdaki tek tek JSON dosyalarını veya koleksiyon klasörünü kontrol etmek için **Yerel dosyalar** seçeneğini kullanın. `1` veya `42` gibi sayı adları taşıyan dosyaları doğrudan seçebilirsiniz. Araç, her öğedeki geçersiz JSON'u ve boş ad, eksik görsel, geçersiz açıklama veya yanlış biçimlendirilmiş nitelik gibi yaygın meta veri sorunlarını bildirir. Düzeltilecek öğeleri bulmak için **İncelenecekler** seçeneğini kullanın veya raporun tamamını JSON olarak indirin.

## Token URI'leri toplu olarak nasıl kontrol edilir?

**Token URI'leri** bölümünde her satıra bir meta veri adresi yapıştırın. Numaralı koleksiyonlar için **URI şablonu** bölümünü açın ve `https://example.com/metadata/{id}.json` örneğindeki gibi bir yer tutucu kullanın. Aralığın iki ucu da dahil olacak şekilde ilk ve son kimlikleri girin. Ondalık biçim kimlikleri yazıldıkları gibi kullanır. **ERC-1155 onaltılık**, ERC-1155'in `{id}` değiştirme kuralına göre her kimliği başında sıfırlar bulunan 64 küçük harfli onaltılık karakterle yazar. Araç ayrıca görsel bağlantıları gibi meta veri değerlerinde `{id}` yerine kimliği koyar.

## NFT görsel ve animasyon bağlantıları nasıl kontrol edilir?

`image` ve `animation_url` bağlantılarını kontrol etmek için **Medya erişilebilirliğini kontrol et** seçeneğini açın. Göreli yollarla belirtilen medyayı da kontrol etmek için cihazınızdaki klasörün tamamını seçin. `/` ile başlayan yollar seçilen klasörün kökünden çözümlenir. Tarayıcı HTTP, IPFS ve Arweave kaynaklarını da kontrol edebilir. Ağ geçidi hatası, zaman aşımı veya kaynaklar arası erişim kısıtlaması nedeniyle bir bağlantı doğrulanamayabilir. Böyle bağlantıları kullandığınız ağ geçidinde veya pazaryerinde inceleyin. Yerel dosya kontrolleri tarayıcıda yapılır. URI kontrollerinde ilgili sunucuya veya ağ geçidine istek gönderilir.

Alan tanımları ve token URI'sindeki yer tutucunun değiştirilmesi hakkında bilgi için [OpenSea meta veri kılavuzuna](https://docs.opensea.io/docs/metadata-standards) ve [ERC-1155 meta veri belirtimine](https://eips.ethereum.org/EIPS/eip-1155#metadata) bakın.
