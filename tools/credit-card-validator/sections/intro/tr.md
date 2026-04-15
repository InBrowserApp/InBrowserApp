## Kredi Kartı Doğrulaması Nedir?

Kredi kartı doğrulaması, bir işlem gerçekleştirmeden önce kart numarasının potansiyel olarak geçerli olup olmadığını kontrol eden bir süreçtir. Formatı doğrulamak için Luhn algoritması ve kart markası tanımlaması kullanır.

### Luhn Algoritması

Luhn algoritması (Mod 10 olarak da bilinir), kimlik numaralarını doğrulamak için kullanılan bir sağlama toplamı formülüdür. İşte nasıl çalışır:

1. En sağdaki rakamdan başlayarak, her ikinci rakamı ikiye katlayın
2. İkiye katlamanın sonucu 9'dan büyükse, sonuçtan 9 çıkarın
3. Tüm rakamları toplayın. Toplam 10'a bölünebiliyorsa, numara geçerlidir

### Desteklenen Kart Markaları

Kart markaları, kart numarasının ilk birkaç rakamı olan BIN (Banka Kimlik Numarası) veya IIN (Veren Kimlik Numarası) ile tanımlanır.

- Visa: `4` · `13, 16, 19`
- Mastercard: `51-55`, `2221-2720` · `16`
- American Express: `34`, `37` · `15`
- Discover: `6011`, `65`, `644-649`, `622126-622925` · `16, 19`
- JCB: `3528-3589` · `16, 17, 18, 19`
- UnionPay: `62` · `16, 17, 18, 19`
- Diners Club: `36`, `38`, `39`, `300-305` · `14, 16, 19`
