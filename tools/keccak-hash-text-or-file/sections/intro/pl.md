## Czym jest Keccak?

Keccak to rodzina kryptograficznych funkcji skrótu, która służy jako podstawa dla standardu SHA-3 (Secure Hash Algorithm 3). Opracowana przez Guido Bertoni, Joan Daemen, Michaël Peeters i Gilles Van Assche, wygrała konkurs funkcji skrótu NIST w 2012 roku.

**Kluczowe cechy:**

- **Konstrukcja gąbki**: Używa innowacyjnego projektu funkcji gąbki z fazami wchłaniania i wyciskania
- **Zmienna długość wyjścia**: Może produkować wyjścia skrótu o dowolnej pożądanej długości
- **Wysoki margines bezpieczeństwa**: Zaprojektowana z znacznymi rezerwami bezpieczeństwa
- **Różni się od SHA-1/SHA-2**: Oparta na całkowicie różnych zasadach matematycznych
- **Wariant Keccak[c=2d]**: Ta implementacja używa oryginalnej specyfikacji Keccak z pojemnością c = 2d (gdzie d to długość wyjścia)

**Różnice między Keccak a SHA-3 (FIPS 202):**
🔍 **Ważne rozróżnienie**: Oryginalny Keccak i znormalizowany SHA-3 **nie są identyczne**:

- **Oryginalny Keccak**: Używa pojemności c = 2d i innego dopełniania (dopełnianie Keccak: 0x01)
- **FIPS 202 SHA-3**: Używa pojemności c = 2d ale innego dopełniania (dopełnianie SHA-3: 0x06)
- **Separacja domen**: Różnica w dopełnianiu zapewnia, że Keccak i SHA-3 produkują różne wyjścia dla tego samego wejścia
- **To narzędzie implementuje**: **Oryginalną specyfikację Keccak** z parametryzacją Keccak[c=2d]

**Status bezpieczeństwa:**
✅ **Keccak jest uważane za wysoce bezpieczne** bez znanych praktycznych ataków. Zapewnia doskonałe marginesy bezpieczeństwa i odporność na różne techniki kryptoanalizy.

**Powszechne zastosowania:**

- Blockchain Ethereum (używa oryginalnego Keccak-256)
- Badania akademickie i protokoły kryptograficzne
- Aplikacje wymagające wyjść skrótu o zmiennej długości
- Systemy potrzebujące alternatyw dla rodziny SHA-2
- Implementacje blockchain i kryptowalut

**Zalety nad tradycyjnymi skrótami:**

- Fundamentalnie inny projekt zmniejsza ryzyko powiązanych ataków
- Elastyczna długość wyjścia (nie ograniczona do stałych rozmiarów)
- Silna teoretyczna podstawa bezpieczeństwa
- Odporność na ataki rozszerzania długości
- Doskonała wydajność na różnych platformach

**Uwaga techniczna:**

- **Keccak-256**: Produkuje 256-bitowe wyjście (najczęstsza odmiana)
- **Formuła pojemności**: c = 2d zapewnia odpowiedni poziom bezpieczeństwa
- **Użycie Ethereum**: Ethereum używa specjalnie oryginalnego Keccak-256, a nie SHA3-256
