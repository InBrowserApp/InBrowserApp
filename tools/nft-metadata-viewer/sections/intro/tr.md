## Sözleşme adresi ve token kimliğiyle NFT meta verilerini bulma

Ethereum ana ağındaki adresi **Sözleşme adresi** alanına yapıştırıp **Token kimliği** değerini girin. Ardından **Meta verileri görüntüle** düğmesine basın. Token kimliği `1` gibi ondalık veya `0x1` gibi onaltılık bir sayı olabilir. Tam bir sorgunun sonucunu görmek için **Örnek dene** düğmesini kullanın. Araç tarayıcınızdan salt okunur bir Ethereum RPC isteği gönderir. Herkese açık bir tokeni cüzdan bağlamadan sorgulayabilirsiniz.

## Token URI'sini, görseli, özellikleri ve JSON'u bulma

Araç, ERC-721 için `tokenURI`, ERC-1155 için `uri` değerini okur. **Token URI'si** alanı, sözleşmenin döndürdüğü metni gösterir. Araç bu adresteki meta verileri okur ve ilgili alanlar varsa görseli, adı ve özellikleri gösterir. Yanıtı olduğu gibi incelemek veya kopyalamak için **Ham JSON** bölümünü kullanın. IPFS, HTTP, Arweave ve gömülü JSON içeren veri URI'leri desteklenir.

## ERC-1155 token kimliği şablona nasıl yerleştirilir?

Bir ERC-1155 sözleşmesi, birden çok token için ortak bir şablon döndürebilir. Araç, `{id}` yerine başına sıfırlar eklenerek 64 küçük harfli onaltılık karaktere tamamlanan token kimliğini koyar. Kimlikte `0x` öneki bulunmaz. Şablon değiştiğinde **Çözümlenen URI** alanında token için istek gönderilen adres gösterilir. Aynı değiştirme işlemi görsel bağlantısı gibi önizleme alanlarına da uygulanır.

## Token URI'si görünüyor ama görsel yoksa ne yapabilirim?

Web sunucusu veya IPFS ağ geçidi geçici olarak erişilemiyor olsa bile sözleşme bir URI döndürebilir. Meta veriler yüklenemezse URI'yi yine de kopyalayabilirsiniz. JSON erişilebiliyorsa `image` alanındaki adresi inceleyin ve doğrudan açmayı deneyin. HTTP sunucuları kaynaklar arası istekleri kısıtlayabilir. Bu da tarayıcının okuyabileceği verileri etkiler.

NFT uygulamalarında yaygın olarak kullanılan alanlar için [ERC-721 standardına](https://eips.ethereum.org/EIPS/eip-721), [ERC-1155 meta veri belirtimine](https://eips.ethereum.org/EIPS/eip-1155#metadata) ve [OpenSea meta veri kılavuzuna](https://docs.opensea.io/docs/metadata-standards) bakın.
