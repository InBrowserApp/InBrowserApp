Bir sunucuya değerlerden hiçbirini göndermeden, bir ad alanı UUID'si ve bir addan UUID v5 tanımlayıcıları oluşturun. UUID v5, bir alan adı, URL, nesne yolu, hesap tanıtıcısı veya fixture kaydı için ID gibi, aynı girdiden daha sonra yeniden oluşturulabilecek kararlı bir tanımlayıcıya ihtiyaç duyduğunuzda kullanışlıdır.

## UUID v5 Nasıl Çalışır

UUID v5, bir ad alanı UUID'sini bir ad dizesiyle birleştirir, bu baytları SHA-1 ile karmalar ve ardından RFC 4122 sürüm ve varyant bitlerini uygular. Girdi deterministik olduğundan, DNS ad alanı içindeki `example.com` her zaman aynı UUID'yi üretir: `cfbff0d1-9375-5685-968c-48ce8b15ae17`.

## Ad Alanı Seçme

Alan adları için `ns:DNS`, URL'ler için `ns:URL`, nesne tanımlayıcıları için `ns:OID` ve X.500 ayırt edici adları için `ns:X.500 DN` kullanın. Uygulamanızın bir ürün, kiracı, veri kümesi veya geçiş kapsamında sınırlandırılmış tanımlayıcılara ihtiyaç duyması durumunda kendi UUID ad alanınızı da yapıştırabilirsiniz.

## Ne Zaman Kullanılmalı

Yeniden üretilebilirlik rastgelelikten daha önemli olduğunda UUID v5'i seçin. Deterministik içe aktarmalar, test fixture'ları, ad alanına bağlı kayıtlar ve aynı mantıksal öğeye çalıştırmalar arasında aynı ID'nin verilmesini gerektiren sistemler için uygundur. Gizli token'lar veya tahmin edilemez herkese açık ID'ler için bunun yerine rastgele bir oluşturucu kullanın.
