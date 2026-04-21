## Base85 çözmenin neden önemli olduğu

Base85, ikili verilerin onaltılık veya Base64'e göre daha az ek yükle yalnızca metin kabul eden sistemlerden geçirilmesi gerektiğinde ortaya çıkar. Bunu PostScript veya PDF akışlarında, ZeroMQ Z85 yüklerinde, hata ayıklama kayıtlarında, arşivlenmiş dışa aktarımlarda ve ham ikili baytlar yerine yazdırılabilir karakterler isteyen araçlarda görebilirsiniz.

## Bu çözücü neye yardımcı olur

Bu araç ASCII85 veya Z85 metnini doğrudan tarayıcıda tekrar özgün baytlara dönüştürür. Kodlanmış veriyi yapıştırabilir, dosya içe aktarabilir, kaynak sistemle eşleşmesi için alfabeyi değiştirebilir, çözülen sonucu önizleyebilir ve hiçbir şeyi sunucuya göndermeden geri kazanılan ikili veriyi indirebilirsiniz.

## Akılda tutulması gerekenler

- ASCII85 ile Z85 birbirinin yerine kullanılamaz. Yanlış alfabenin seçilmesi genellikle çözme hatasına veya bozuk çıktıya yol açar.
- Base85 bir kodlama biçimidir, şifreleme değildir. Çözülen sonuç düz metin, sıkıştırılmış içerik veya rastgele ikili veri olabilir.
- Z85 tam 5 karakterlik gruplar gerektirir; ASCII85 ise ayraçlar ve sıfır blokları için `z` gibi kısaltmalar da içerebilir.
