## Czym jest RIPEMD-160?

RIPEMD-160 (RACE Integrity Primitives Evaluation Message Digest) to kryptograficzna funkcja skrótu, która produkuje 160-bitową (20-bajtową) wartość skrótu, zazwyczaj przedstawianą jako 40-znakową liczbę szesnastkową. Została opracowana w 1996 roku przez Hansa Dobbertina, Antoona Bosselaersa i Barta Preneela jako część europejskiego projektu RACE.

**Kluczowe cechy:**

- **Deterministyczna**: To samo wejście zawsze produkuje ten sam skrót
- **Szybkie obliczenia**: Rozsądnie szybkie do obliczenia dla dowolnego danego wejścia
- **Efekt lawiny**: Małe zmiany w wejściu powodują drastycznie różne wyjścia
- **Stały rozmiar wyjścia**: Zawsze produkuje 160-bitowy skrót niezależnie od rozmiaru wejścia
- **Dwuliniowa struktura równoległa**: Używa dwóch równoległych linii obliczeniowych dla zwiększonej bezpieczeństwa

**Status bezpieczeństwa:**
✅ **RIPEMD-160 jest uważane za kryptograficznie bezpieczne** bez znanych praktycznych ataków. Zapewnia dobry margines bezpieczeństwa i nadal jest zalecane dla aplikacji kryptograficznych, gdzie 160-bitowy skrót jest wystarczający.

**Powszechne zastosowania:**

- Generowanie adresów Bitcoin (kodowanie Base58Check)
- Podpisy cyfrowe i certyfikaty
- Weryfikacja integralności danych
- Protokoły kryptograficzne wymagające 160-bitowych skrótów
- Alternatywa dla SHA-1 w razie potrzeby

**Porównanie z innymi algorytmami:**

- Bezpieczniejsze niż MD5 i SHA-1
- Mniejsze wyjście niż SHA-256 (160 bitów vs 256 bitów)
- Dobre charakterystyki wydajności
- Dobrze zbadane i zaufane w społeczności kryptograficznej

**Zalecane dla:**

- Aplikacji wymagających 160-bitowego bezpieczeństwa skrótu
- Operacji kryptograficznych związanych z Bitcoin
- Kompatybilności ze starszymi systemami, gdzie określono RIPEMD-160
