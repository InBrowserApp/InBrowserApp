## Czym jest IBAN?

IBAN (International Bank Account Number) to znormalizowany identyfikator rachunków bankowych używany w płatnościach międzynarodowych.

### Struktura IBAN

IBAN zaczyna się od dwuliterowego kodu kraju, dwóch cyfr kontrolnych i krajowego BBAN.

### Walidacja sumy kontrolnej

Poprawność IBAN sprawdza algorytm mod-97 normy ISO 13616.

1. Usuń spacje i przenieś pierwsze cztery znaki na koniec
2. Zamień litery na liczby (A=10, B=11, ..., Z=35)
3. Oblicz mod 97; poprawny IBAN daje resztę 1

Każdy kraj określa stałą długość i strukturę części BBAN.
